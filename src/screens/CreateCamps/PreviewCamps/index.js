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
import { groupBy, isEmpty, keys, map } from "lodash";
import { useEffect, useState } from "react";
import { CREATE_CAMP_FLOWS } from "../../../constant";

const PreviewCamps = ({ selectedPayload }) => {
  const [payloads, setPayloads] = useState([]);
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    if (!isEmpty(selectedPayload)) {
      switch (selectedPayload?.runFlow) {
        case CREATE_CAMP_FLOWS[0].title: {
          setPayloads([
            {
              rootCampId: selectedPayload?.rootCampaign?.campaignId,
              campInfo: {
                dailyBudget: selectedPayload?.budget,
              },
              adsInfo: map(selectedPayload.ads, (ad) => {
                return {
                  name: ad.postName,
                  objectStoryId: `${ad.pageId}_${ad.postId}`,
                };
              }),
            },
          ]);
          const transformedPreviews = [
            {
              rootCampName: selectedPayload?.rootCampaign?.campaignName,
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
          const transformedPayloads = map(keyTypes, (type) => {
            const ads = groupedAds[type];
            return {
              rootCampId: selectedPayload?.rootCampaign?.campaignId,
              campInfo: {
                dailyBudget: selectedPayload?.budget,
              },
              adsInfo: map(ads, (ad) => {
                return {
                  name: ad.postName,
                  objectStoryId: `${ad.pageId}_${ad.postId}`,
                };
              }),
            };
          });
          const transformedPreviews = map(keyTypes, (type, index) => {
            const ads = groupedAds[type];
            return {
              rootCampName: selectedPayload?.rootCampaign?.campaignName,
              budget: selectedPayload?.budget,
              ads,
            };
          });
          setPayloads(transformedPayloads);
          setPreviews(transformedPreviews);
          break;
        }
        case CREATE_CAMP_FLOWS[2].title: {
          const transformedPayloads = map(selectedPayload.ads, (ad) => {
            return {
              rootCampId: selectedPayload?.rootCampaign?.campaignId,
              campInfo: {
                dailyBudget: selectedPayload?.budget,
              },
              adsInfo: [
                {
                  name: ad.postName,
                  objectStoryId: `${ad.pageId}_${ad.postId}`,
                },
              ],
            };
          });
          const transformedPreviews = map(selectedPayload.ads, (ad) => {
            return {
              rootCampName: selectedPayload?.rootCampaign?.campaignName,
              budget: selectedPayload?.budget,
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
  return (
    <Grid>
      <Grid.Col span={12}>
        <Flex align="center" justify="space-between">
          <Badge color="blue" variant="filled">
            <u>{selectedPayload?.sku || "AH-Q054"}</u>
          </Badge>
          <Badge color="blue" variant="filled">
            3 Campaigns
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
                      Campaign {index + 1}
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
            onClick={() => {
              console.log("Create Campaigns", payloads);
            }}
          >
            Tạo
          </Button>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default PreviewCamps;
