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
import { groupBy, isEmpty, keys, map, round } from "lodash";
import { useEffect, useState } from "react";
import { CREATE_CAMP_FLOWS } from "../../../constant";
import { campaignServices } from "../../../services";
import { showNotification } from "../../../utils/index";

const PreviewCamps = ({ selectedPayload, closeModal }) => {
  const [payloads, setPayloads] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loadingCreateCampaign, setLoadingCreateCampaign] = useState(false);

  useEffect(() => {
    if (!isEmpty(selectedPayload)) {
      switch (selectedPayload?.runFlow) {
        case CREATE_CAMP_FLOWS[0].title: {
          setPayloads([
            {
              briefId: selectedPayload?.briefId,
              rootCampId: selectedPayload?.rootCampaign?.campaignId,
              campInfo: {
                dailyBudget: selectedPayload?.budget,
                name: `${selectedPayload.team} - ${selectedPayload.sku} - ${selectedPayload.batch} - Test1`,
              },
              adsInfo: map(selectedPayload.ads, (ad) => {
                return {
                  name: ad.postName,
                  // objectStoryId: `${ad.pageId}_${ad.postId}`,
                  objectStoryId: `102286709170123_483748387740655`,
                };
              }),
            },
          ]);
          const transformedPreviews = [
            {
              rootCampName: `${selectedPayload.team} - ${selectedPayload.sku} - ${selectedPayload.batch} - Test1`,
              budget: selectedPayload?.budget,
              ads: selectedPayload.ads,
            },
          ];
          setPreviews(transformedPreviews);
          break;
        }
        case CREATE_CAMP_FLOWS[1].title: {
          const groupedAds = groupBy(selectedPayload.ads, "type");
          const keyTypes = keys(groupedAds);
          const budgetPerCamp = round(
            selectedPayload?.budget / keyTypes.length,
            0
          );
          const transformedPayloads = map(keyTypes, (type, index) => {
            const ads = groupedAds[type];
            return {
              briefId: selectedPayload?.briefId,
              rootCampId: selectedPayload?.rootCampaign?.campaignId,
              campInfo: {
                dailyBudget: budgetPerCamp,
                name: `${selectedPayload.team} - ${selectedPayload.sku} - ${
                  selectedPayload.batch
                } - Test${index + 1}`,
              },
              adsInfo: map(ads, (ad) => {
                return {
                  name: ad.postName,
                  // objectStoryId: `${ad.pageId}_${ad.postId}`,
                  objectStoryId: `102286709170123_483748387740655`,
                };
              }),
            };
          });
          const transformedPreviews = map(keyTypes, (type, index) => {
            const ads = groupedAds[type];
            return {
              rootCampName: `${selectedPayload.team} - ${
                selectedPayload.sku
              } - ${selectedPayload.batch} - Test${index + 1}`,
              budget: budgetPerCamp,
              ads,
            };
          });
          setPayloads(transformedPayloads);
          setPreviews(transformedPreviews);
          break;
        }
        case CREATE_CAMP_FLOWS[2].title: {
          const budgetPerCamp = round(
            selectedPayload?.budget / selectedPayload.ads.length,
            0
          );
          const transformedPayloads = map(selectedPayload.ads, (ad, index) => {
            return {
              briefId: selectedPayload?.briefId,
              rootCampId: selectedPayload?.rootCampaign?.campaignId,
              campInfo: {
                dailyBudget: budgetPerCamp,
                name: `${selectedPayload.team} - ${selectedPayload.sku} - ${
                  selectedPayload.batch
                } - Test${index + 1}`,
              },
              adsInfo: [
                {
                  name: ad.postName,
                  // objectStoryId: `${ad.pageId}_${ad.postId}`,
                  objectStoryId: `102286709170123_483748387740655`,
                },
              ],
            };
          });
          const transformedPreviews = map(selectedPayload.ads, (ad, index) => {
            return {
              rootCampName: `${selectedPayload.team} - ${
                selectedPayload.sku
              } - ${selectedPayload.batch} - Test${index + 1}`,
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
    if (!createCampResponse) {
      setLoadingCreateCampaign(false);
      return;
    }
    showNotification("Thành công", "Tạo Campaign thành công", "green");
    console.log(`payloads`, payloads);
    setLoadingCreateCampaign(false);
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
            {previews.length} Campaigns
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
            label="Campaign Name"
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
                    <Text style={{ fontWeight: "bold" }}>
                      {preview?.rootCampName}
                    </Text>
                  </Flex>
                  <Flex
                    style={{
                      flexWrap: "wrap",
                    }}
                    gap="md"
                  >
                    {map(preview?.ads, (ad, index) => (
                      <Group>
                        <Image
                          src={ad?.value || "/images/content/not_found_2.jpg"}
                          width="80px"
                          height="80px"
                          radius="md"
                        />
                        <Flex gap={8} direction="column">
                          <Text size="sm">{ad?.postName}</Text>
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
