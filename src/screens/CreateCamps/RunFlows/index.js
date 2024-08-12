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
  const [loadingCreateCampaign, setLoadingCreateCampaign] = useState(false);
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
      setPayloads(transformedPayloads);
    }
  }, [runflowValue, selectedImages, selectedVideos, totalBudget]);
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
                (x) => x.type === "video" && x.postId && !x.campaignId
              ),
              (item, index) => (
                <Checkbox.Card
                  radius="md"
                  value={item.name}
                  key={index}
                  withBorder={false}
                >
                  <Group wrap="nowrap" align="center">
                    <Checkbox.Indicator />
                    <Group>
                      <Image
                        src={item?.value || "/images/content/not_found_2.jpg"}
                        width="80px"
                        height="80px"
                        radius="md"
                        onChange={setSelectedVideos}
                      />
                      <Text>{`Ad Image ${index + 1}`}</Text>
                    </Group>
                  </Group>
                </Checkbox.Card>
              )
            )}
          </Stack>
        </Checkbox.Group>
      </Grid.Col>
      <Grid.Col span={12}>
        <Flex justify="center">
          <Button
            variant="filled"
            color="green"
            size="sx"
            onClick={handleCreateCampaign}
            loading={loadingCreateCampaign}
          >
            Lên Camp
          </Button>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default RunFlows;
