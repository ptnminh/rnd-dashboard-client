import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  CopyButton,
  Flex,
  Grid,
  Group,
  Image,
  NumberInput,
  Radio,
  rem,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  IconCurrencyDollar,
  IconExternalLink,
  IconCopy,
} from "@tabler/icons-react";
import {
  ceil,
  compact,
  concat,
  filter,
  find,
  includes,
  isEmpty,
  map,
  toNumber,
} from "lodash";
import { showNotification } from "../../../utils/index";
import { campaignServices, postService } from "../../../services";
import {
  CREATE_CAMP_ERRORS,
  CREATE_CAMP_ERRORS_CODES,
} from "../../../constant/errors";
import { CTA_LINK } from "../../../constant";
const RUN_FLOWS = {
  sameCamps: "Chung Camp",
  diffCamps: "Khác Camp",
};

const RunFlows = ({ selectedPayload, closeModal, setTrigger }) => {
  const [runflowValue, setRunFlowValue] = useState(RUN_FLOWS.sameCamps);
  const [totalBudget, setTotalBudget] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [loadingCreateCampaign, setLoadingCreateCampaign] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [errors, setErrors] = useState([]);
  const [addPostsCTA, setAddPostsCTA] = useState([]);
  const handleUpdatePostCTA = async (uid) => {
    const payload = {
      addCta: true,
    };
    const updatePostCTAResponse = await postService.updatePost(uid, payload);
    if (updatePostCTAResponse) {
      showNotification("Thành công", "Gắn CTA thành công", "green");
      setAddPostsCTA((prev) => filter(prev, (x) => x.uid !== uid));
      setErrors((prev) =>
        filter(prev, (x) => {
          if (
            x.postName ===
            find(selectedPayload?.ads, (x) => x.uid === uid)?.postName
          ) {
            return false;
          }
          return true;
        })
      );
    }
  };
  const [payloads, setPayloads] = useState([]);

  useEffect(() => {
    if (runflowValue === RUN_FLOWS.sameCamps) {
      const mergedSelectedAdIds = compact(
        concat(selectedImages, selectedVideos)
      );
      const selectedAds = filter(selectedPayload?.ads, (x) =>
        includes(mergedSelectedAdIds, x.uid)
      );
      const transformedPayloads = [
        {
          briefId: selectedPayload?.briefId,
          rootCampId: selectedPayload?.rootCampaign?.campaignId,
          campInfo: {
            dailyBudget: totalBudget,
            name: `${selectedPayload.team} - ${selectedPayload.sku} - ${
              selectedPayload.batch
            } - Test${selectedPayload.exCampIds.length + 1}`,
          },
          adsInfo: map(selectedAds, (x) => ({
            name: x.postName,
            objectStoryId: `${x.pageId}_${x.postId}`,
          })),
        },
      ];
      setPayloads(transformedPayloads);
      const transformedPreviews =
        isEmpty(selectedAds) || !totalBudget
          ? []
          : [
              {
                rootCampName: `${selectedPayload.team} - ${
                  selectedPayload.sku
                } - ${selectedPayload.batch} - Test${
                  selectedPayload.exCampIds.length + 1
                }`,
                budget: totalBudget,
              },
            ];
      setPreviews(transformedPreviews);
    } else {
      const mergedSelectedAdIds = compact(
        concat(selectedImages, selectedVideos)
      );
      const selectedAds = filter(selectedPayload?.ads, (x) =>
        includes(mergedSelectedAdIds, x.uid)
      );
      const budgetPerCamp = ceil(totalBudget / selectedAds.length);
      const transformedPayloads = map(selectedAds, (x, index) => ({
        briefId: selectedPayload?.briefId,
        rootCampId: selectedPayload?.rootCampaign?.campaignId,
        campInfo: {
          name: `${selectedPayload.team} - ${selectedPayload.sku} - ${
            selectedPayload.batch
          } - Test${selectedPayload.exCampIds.length + index + 1}`,
          dailyBudget: budgetPerCamp,
        },
        adsInfo: [
          {
            name: x.postName,
            objectStoryId: `${x.pageId}_${x.postId}`,
          },
        ],
      }));
      const transformedPreviews =
        isEmpty(selectedAds) || !totalBudget
          ? []
          : map(selectedAds, (x, index) => ({
              rootCampName: `${selectedPayload.team} - ${
                selectedPayload.sku
              } - ${selectedPayload.batch} - Test${
                selectedPayload.exCampIds.length + index + 1
              }`,
              budget: budgetPerCamp,
            }));
      setPreviews(transformedPreviews);
      setPayloads(transformedPayloads);
    }
  }, [
    runflowValue,
    selectedImages,
    selectedVideos,
    totalBudget,
    visiblePreview,
  ]);
  const handleCreateCampaign = async () => {
    setLoadingCreateCampaign(true);
    if (!totalBudget) {
      showNotification("Thất bại", "Vui lòng nhập Budget", "red");
      setLoadingCreateCampaign(false);
      return;
    }
    if (isEmpty(selectedImages) && isEmpty(selectedVideos)) {
      showNotification(
        "Thất bại",
        "Vui lòng chọn ít nhất 1 hình hoặc 1 video",
        "red"
      );
      setLoadingCreateCampaign(false);
      return;
    }
    const createCampResponse = await campaignServices.createCamps({
      payloads,
    });
    if (createCampResponse?.success === false) {
      const postNames = map(selectedPayload?.ads, (x) => x.postName);
      const errorList = compact(
        map(createCampResponse?.errorList, (x) => {
          const { code, message, adName } = x;
          const foundName = postNames.find((name) => name === adName);
          if (foundName) {
            if (code === CREATE_CAMP_ERRORS_CODES.POST_NOT_HAVE_CTA) {
              const postUID = find(
                selectedPayload?.ads,
                (x) => x.postName === foundName
              )?.uid;
              setAddPostsCTA((prev) => [
                ...prev,
                {
                  uid: postUID,
                  onClick: false,
                },
              ]);
            }
            return {
              postName: foundName,
              message: CREATE_CAMP_ERRORS[code] || message,
            };
          }
          return null;
        })
      );
      setErrors(errorList);
      setLoadingCreateCampaign(false);
      return;
    }
    showNotification("Thành công", "Tạo Campaign thành công", "green");
    console.log(`payloads`, payloads);
    setLoadingCreateCampaign(false);
    setTrigger(true);
    closeModal();
  };
  return (
    <Grid>
      <Grid.Col span={12}>
        <Flex align="center" justify="space-between">
          <Badge color="blue" variant="filled">
            <u>{selectedPayload?.sku}</u>
          </Badge>
          <Radio.Group
            name="favoriteFramework"
            styles={{
              root: {
                height: "100%",
              },
            }}
            value={runflowValue}
            onChange={setRunFlowValue}
          >
            <Group>
              <Radio value={RUN_FLOWS.sameCamps} label={RUN_FLOWS.sameCamps} />
              <Radio value={RUN_FLOWS.diffCamps} label={RUN_FLOWS.diffCamps} />
            </Group>
          </Radio.Group>
        </Flex>
      </Grid.Col>
      <Grid.Col span={12}>
        <Flex gap={8}>
          <TextInput
            placeholder="Root Campaign Name"
            styles={{
              root: {
                alignItems: "center",
                gap: "10px",
                flex: 1,
              },
              label: {
                fontWeight: "bold",
                marginBottom: "10px",
              },
            }}
            label="Root Campaign Name"
            value={selectedPayload?.rootCampaign?.campaignName}
          />
          <NumberInput
            leftSection={
              <IconCurrencyDollar style={{ width: rem(16), height: rem(16) }} />
            }
            placeholder="Budget"
            styles={{
              root: {
                alignItems: "center",
                gap: "10px",
                flex: 1,
              },
              label: {
                fontWeight: "bold",
                marginBottom: "10px",
              },
            }}
            label="Budget"
            value={totalBudget}
            onChange={setTotalBudget}
          />
        </Flex>
      </Grid.Col>
      <Grid.Col span={6}>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Post Hình
        </Text>
        <ScrollArea
          h={300}
          scrollbars="y"
          scrollbarSize={4}
          scrollHideDelay={1000}
        >
          <Checkbox.Group value={selectedImages}>
            <Stack pt="md" gap="xs">
              {map(
                filter(
                  selectedPayload?.ads,
                  (x) =>
                    (x.type === "image" || !x.type) && x.postId && !x.campaignId
                ),
                (item, index) => (
                  <Checkbox.Card
                    radius="md"
                    value={item.uid}
                    key={index}
                    withBorder={false}
                  >
                    <Group wrap="nowrap" align="center">
                      <Checkbox.Indicator
                        onClick={() => {
                          setSelectedImages((prev) => {
                            if (includes(prev, item.uid)) {
                              return filter(prev, (x) => x !== item.uid);
                            }
                            return [...prev, item.uid];
                          });
                        }}
                      />
                      <Group>
                        <Image
                          src={item.value || "/images/content/not_found_2.jpg"}
                          width="80px"
                          height="80px"
                          radius="md"
                          onClick={() => {
                            setSelectedImages((prev) => {
                              if (includes(prev, item.uid)) {
                                return filter(prev, (x) => x !== item.uid);
                              }
                              return [...prev, item.uid];
                            });
                          }}
                        />
                        <Flex direction="column" gap={8}>
                          <TextInput
                            size="sm"
                            readOnly
                            value={item.postName}
                            error={
                              find(errors, (x) => x.postName === item.postName)
                                ?.message || ""
                            }
                          />
                          <span
                            style={{
                              display: "flex",
                              gap: "10px",
                            }}
                          >
                            <Tooltip label="To Post">
                              <ActionIcon
                                component="a"
                                href={`https://facebook.com/${item?.postId}`}
                                size="sx"
                                aria-label="Open in a new tab"
                                onClick={() => {}}
                                target="_blank"
                              >
                                <IconExternalLink />
                              </ActionIcon>
                            </Tooltip>
                            <CopyButton value={item.postId}>
                              {({ copied, copy }) => (
                                <Tooltip label="Copy Post Id">
                                  <ActionIcon
                                    color={copied ? "teal" : "blue"}
                                    onClick={copy}
                                    size="sx"
                                  >
                                    <IconCopy />
                                  </ActionIcon>
                                </Tooltip>
                              )}
                            </CopyButton>
                            {includes(map(addPostsCTA, "uid"), item.uid) && (
                              <Group justify="center">
                                {find(addPostsCTA, (x) => x.uid === item.uid)
                                  ?.onClick ? (
                                  <Button
                                    color="green"
                                    variant="filled"
                                    radius="sm"
                                    size="xs"
                                    onClick={() => {
                                      handleUpdatePostCTA(item.uid);
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                ) : (
                                  <Button
                                    variant="filled"
                                    color="#646A73"
                                    radius="sm"
                                    size="xs"
                                    onClick={() => {
                                      // redirect to CTA link
                                      setAddPostsCTA((prev) => {
                                        return map(prev, (x) => {
                                          if (x.uid === item.uid) {
                                            return {
                                              uid: x.uid,
                                              onClick: true,
                                            };
                                          }
                                          return x;
                                        });
                                      });
                                      window.open(CTA_LINK, "_blank");
                                    }}
                                  >
                                    Gắn CTA
                                  </Button>
                                )}
                              </Group>
                            )}
                          </span>
                        </Flex>
                      </Group>
                    </Group>
                  </Checkbox.Card>
                )
              )}
            </Stack>
          </Checkbox.Group>
        </ScrollArea>
      </Grid.Col>
      <Grid.Col span={6}>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Post Video
        </Text>
        <Checkbox.Group value={selectedVideos}>
          <Stack pt="md" gap="xs">
            {map(
              filter(
                selectedPayload?.ads,
                (x) => x.type && x.type === "video" && x.postId && !x.campaignId
              ),
              (item, index) => (
                <Checkbox.Card
                  radius="md"
                  value={item.uid}
                  key={index}
                  withBorder={false}
                >
                  <Group wrap="nowrap" align="center">
                    <Checkbox.Indicator
                      onClick={() => {
                        setSelectedVideos((prev) => {
                          if (includes(prev, item.uid)) {
                            return filter(prev, (x) => x !== item.uid);
                          }
                          return [...prev, item.uid];
                        });
                      }}
                    />
                    <Group>
                      <video width="80px" height="80px" controls autoPlay muted>
                        <source src={item.value} type="video/mp4" />
                      </video>
                      <Flex direction="column" gap={8}>
                        <TextInput
                          size="sm"
                          readOnly
                          value={item.postName}
                          error={
                            find(errors, (x) => x?.postName === item?.postName)
                              ?.message || ""
                          }
                        />
                        <span
                          style={{
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <Tooltip label="To Post">
                            <ActionIcon
                              component="a"
                              href={`https://facebook.com/${item?.postId}`}
                              size="sx"
                              aria-label="Open in a new tab"
                              onClick={() => {}}
                              target="_blank"
                            >
                              <IconExternalLink />
                            </ActionIcon>
                          </Tooltip>
                          <CopyButton value={item.postId}>
                            {({ copied, copy }) => (
                              <Tooltip label="Copy Post Id">
                                <ActionIcon
                                  color={copied ? "teal" : "blue"}
                                  onClick={copy}
                                  size="sx"
                                >
                                  <IconCopy />
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </CopyButton>
                          {includes(map(addPostsCTA, "uid"), item.uid) && (
                            <Group justify="center">
                              {find(addPostsCTA, (x) => x.uid === item.uid)
                                ?.onClick ? (
                                <Button
                                  color="green"
                                  variant="filled"
                                  radius="sm"
                                  size="xs"
                                  onClick={() => {
                                    handleUpdatePostCTA(item.uid);
                                  }}
                                >
                                  Confirm
                                </Button>
                              ) : (
                                <Button
                                  variant="filled"
                                  color="#646A73"
                                  radius="sm"
                                  size="xs"
                                  onClick={() => {
                                    // redirect to CTA link
                                    setAddPostsCTA((prev) => {
                                      return map(prev, (x) => {
                                        if (x.uid === item.uid) {
                                          return {
                                            uid: x.uid,
                                            onClick: true,
                                          };
                                        }
                                        return x;
                                      });
                                    });
                                    window.open(CTA_LINK, "_blank");
                                  }}
                                >
                                  Gắn CTA
                                </Button>
                              )}
                            </Group>
                          )}
                        </span>
                      </Flex>
                    </Group>
                  </Group>
                </Checkbox.Card>
              )
            )}
          </Stack>
        </Checkbox.Group>
      </Grid.Col>
      {visiblePreview && (
        <Grid.Col span={12}>
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Preview
          </Text>
          <ScrollArea
            h={300}
            scrollbars="y"
            scrollbarSize={4}
            scrollHideDelay={1000}
          >
            <Stack>
              {map(previews, (preview, index) => {
                return (
                  <Stack key={index} gap="md">
                    <Flex align="center" justify="space-between" gap={10}>
                      <TextInput
                        placeholder="Campaign Name"
                        label="Campaign Name"
                        styles={{
                          root: {
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                          },
                          label: {
                            fontWeight: "bold",
                            marginBottom: "10px",
                          },
                        }}
                        value={preview?.rootCampName}
                        onChange={(event) => {
                          setPreviews((prev) => {
                            return map(prev, (x, i) => {
                              if (i === index) {
                                return {
                                  ...x,
                                  rootCampName: event.target.value,
                                };
                              }
                              return x;
                            });
                          });
                          setPayloads((prev) => {
                            return map(prev, (x, i) => {
                              if (i === index) {
                                return {
                                  ...x,
                                  campInfo: {
                                    ...x.campInfo,
                                    name: event.target.value,
                                  },
                                };
                              }
                              return x;
                            });
                          });
                        }}
                      />
                      <NumberInput
                        leftSection={
                          <IconCurrencyDollar
                            style={{ width: rem(16), height: rem(16) }}
                          />
                        }
                        placeholder="Budget"
                        styles={{
                          root: {
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                          },
                          label: {
                            fontWeight: "bold",
                            marginBottom: "10px",
                          },
                        }}
                        label="Budget"
                        value={preview?.budget}
                        onChange={(value) => {
                          setPreviews((prev) => {
                            return map(prev, (x, i) => {
                              if (i === index) {
                                return {
                                  ...x,
                                  budget: toNumber(value),
                                };
                              }
                              return x;
                            });
                          });
                          setPayloads((prev) => {
                            return map(prev, (x, i) => {
                              if (i === index) {
                                return {
                                  ...x,
                                  campInfo: {
                                    ...x.campInfo,
                                    dailyBudget: toNumber(value),
                                  },
                                };
                              }
                              return x;
                            });
                          });
                        }}
                      />
                    </Flex>
                    <Flex
                      style={{
                        flexWrap: "wrap",
                      }}
                      gap="md"
                    >
                      {map(preview?.ads, (ad) => (
                        <Group>
                          <Image
                            src={ad?.value || "/images/content/not_found_2.jpg"}
                            width="80px"
                            height="80px"
                            radius="md"
                          />
                        </Group>
                      ))}
                    </Flex>
                  </Stack>
                );
              })}
            </Stack>
          </ScrollArea>
        </Grid.Col>
      )}
      <Grid.Col span={12}>
        <Flex justify="center" gap={5}>
          <Button
            variant="filled"
            color="green"
            size="sx"
            onClick={handleCreateCampaign}
            loading={loadingCreateCampaign}
          >
            Lên Camp
          </Button>
          <Button
            variant="filled"
            color={visiblePreview ? "red" : "blue"}
            size="sx"
            onClick={() => {
              const mergedSelectedAdIds = compact(
                concat(selectedImages, selectedVideos)
              );
              if (isEmpty(mergedSelectedAdIds)) {
                showNotification(
                  "Thất bại",
                  "Vui lòng chọn ít nhất 1 hình hoặc 1 video",
                  "red"
                );
                return;
              }
              if (!totalBudget) {
                showNotification("Thất bại", "Vui lòng nhập Budget", "red");
                return;
              }
              setVisiblePreview(!visiblePreview);
            }}
          >
            {visiblePreview ? "Ẩn Preview" : "Preview"}
          </Button>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default RunFlows;
