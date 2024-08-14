import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Flex,
  Grid,
  Group,
  Image,
  NumberInput,
  rem,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconCurrencyDollar,
  IconCopy,
  IconExternalLink,
} from "@tabler/icons-react";
import {
  ceil,
  compact,
  filter,
  find,
  groupBy,
  includes,
  isEmpty,
  keys,
  map,
} from "lodash";
import { useEffect, useState } from "react";
import { CREATE_CAMP_FLOWS, CTA_LINK } from "../../../constant";
import { campaignServices, postService } from "../../../services";
import { showNotification } from "../../../utils/index";
import {
  CREATE_CAMP_ERRORS,
  CREATE_CAMP_ERRORS_CODES,
} from "../../../constant/errors";

const PreviewCamps = ({ selectedPayload, closeModal, setTrigger }) => {
  const [payloads, setPayloads] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [addPostsCTA, setAddPostsCTA] = useState([]);
  const [loadingCreateCampaign, setLoadingCreateCampaign] = useState(false);
  const [errors, setErrors] = useState([]);
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
  useEffect(() => {
    if (!isEmpty(selectedPayload)) {
      const ads = filter(
        selectedPayload.ads,
        (ad) => ad.postId && ad.pageId && !ad.campaignId
      );
      switch (selectedPayload?.runFlow) {
        case CREATE_CAMP_FLOWS[0].title: {
          setPayloads([
            {
              briefId: selectedPayload?.briefId,
              rootCampId: selectedPayload?.rootCampaign?.campaignId,
              campInfo: {
                dailyBudget: selectedPayload?.budget,
                name: `${selectedPayload.team} - ${selectedPayload.sku} - ${
                  selectedPayload.batch
                } - Test${selectedPayload.exCampIds.length + 1}`,
              },
              adsInfo: map(ads, (ad) => {
                return {
                  adsLinkId: ad.uid,
                  name: ad.postName,
                  objectStoryId: `${ad.pageId}_${ad.postId}`,
                };
              }),
            },
          ]);
          const transformedPreviews = [
            {
              rootCampName: `${selectedPayload.team} - ${
                selectedPayload.sku
              } - ${selectedPayload.batch} - Test${
                selectedPayload.exCampIds.length + 1
              }`,
              budget: selectedPayload?.budget,
              ads: ads,
            },
          ];
          setPreviews(transformedPreviews);
          break;
        }
        case CREATE_CAMP_FLOWS[1].title: {
          const groupedAds = groupBy(ads, "type");
          const keyTypes = keys(groupedAds);
          const budgetPerCamp = ceil(selectedPayload?.budget / keyTypes.length);
          const transformedPayloads = map(keyTypes, (type, index) => {
            const ads = groupedAds[type];
            return {
              briefId: selectedPayload?.briefId,
              rootCampId: selectedPayload?.rootCampaign?.campaignId,
              campInfo: {
                dailyBudget: budgetPerCamp,
                name: `${selectedPayload.team} - ${selectedPayload.sku} - ${
                  selectedPayload.batch
                } - Test${selectedPayload.exCampIds.length + index + 1}`,
              },
              adsInfo: map(ads, (ad) => {
                return {
                  adsLinkId: ad.uid,
                  name: ad.postName,
                  objectStoryId: `${ad.pageId}_${ad.postId}`,
                };
              }),
            };
          });
          const transformedPreviews = map(keyTypes, (type, index) => {
            const ads = groupedAds[type];
            return {
              rootCampName: `${selectedPayload.team} - ${
                selectedPayload.sku
              } - ${selectedPayload.batch} - Test${
                selectedPayload.exCampIds.length + index + 1
              }`,
              budget: budgetPerCamp,
              ads,
            };
          });
          setPayloads(transformedPayloads);
          setPreviews(transformedPreviews);
          break;
        }
        case CREATE_CAMP_FLOWS[2].title: {
          const budgetPerCamp = ceil(selectedPayload?.budget / ads.length);
          const transformedPayloads = map(ads, (ad, index) => {
            return {
              briefId: selectedPayload?.briefId,
              rootCampId: selectedPayload?.rootCampaign?.campaignId,
              campInfo: {
                dailyBudget: budgetPerCamp,
                name: `${selectedPayload.team} - ${selectedPayload.sku} - ${
                  selectedPayload.batch
                } - Test${selectedPayload.exCampIds.length + index + 1}`,
              },
              adsInfo: [
                {
                  adsLinkId: ad.uid,
                  name: ad.postName,
                  objectStoryId: `${ad.pageId}_${ad.postId}`,
                },
              ],
            };
          });
          const transformedPreviews = map(ads, (ad, index) => {
            return {
              rootCampName: `${selectedPayload.team} - ${
                selectedPayload.sku
              } - ${selectedPayload.batch} - Test${
                selectedPayload.exCampIds.length + index + 1
              }`,
              budget: budgetPerCamp,
              ads: [ad],
            };
          });
          setPreviews(transformedPreviews);
          setPayloads(transformedPayloads);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [selectedPayload]);
  const handleCreateCampaign = async () => {
    setLoadingCreateCampaign(true);
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
            <u>{selectedPayload?.sku || "AH-Q054"}</u>
          </Badge>
          <Badge color="blue" variant="filled">
            {previews.length === 1
              ? `1 Campaign`
              : `${previews.length} Campaigns`}
          </Badge>
        </Flex>
      </Grid.Col>
      <Grid.Col span={12}>
        <Flex gap={8}>
          <TextInput
            readOnly
            placeholder="Campaign Name"
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
            readOnly
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
            value={selectedPayload?.budget}
          />
        </Flex>
      </Grid.Col>
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
                  <Flex align="center" justify="space-between">
                    <TextInput
                      placeholder="Campaign Name"
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
                  </Flex>
                  <Flex
                    style={{
                      flexWrap: "wrap",
                    }}
                    gap="md"
                  >
                    {map(preview?.ads, (ad) => (
                      <Group>
                        {ad?.type === "video" ? (
                          <video
                            width="80px"
                            height="80px"
                            controls
                            style={{
                              display: "block",
                            }}
                            autoPlay
                            muted
                          >
                            <source src={ad?.value} type="video/mp4" />
                          </video>
                        ) : (
                          <Image
                            src={ad?.value || "/images/content/not_found_2.jpg"}
                            width="80px"
                            height="80px"
                            radius="md"
                          />
                        )}
                        <Flex gap={8} direction="column">
                          <TextInput
                            size="sm"
                            readOnly
                            value={ad.postName}
                            error={
                              find(errors, (x) => x.postName === ad.postName)
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
                                href={`https://facebook.com/${ad?.postId}`}
                                size="sx"
                                aria-label="Open in a new tab"
                                onClick={() => {}}
                                target="_blank"
                              >
                                <IconExternalLink />
                              </ActionIcon>
                            </Tooltip>
                            <CopyButton value={ad?.postId}>
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
                            {includes(map(addPostsCTA, "uid"), ad.uid) && (
                              <Group justify="center">
                                {find(addPostsCTA, (x) => x.uid === ad.uid)
                                  ?.onClick ? (
                                  <Button
                                    color="green"
                                    variant="filled"
                                    radius="sm"
                                    size="xs"
                                    onClick={() => {
                                      handleUpdatePostCTA(ad.uid);
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
                                          if (x.uid === ad.uid) {
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
                    ))}
                  </Flex>
                </Stack>
              );
            })}
          </Stack>
        </ScrollArea>
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
            Tạo
          </Button>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default PreviewCamps;
