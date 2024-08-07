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
import { compact, concat, filter, includes, isEmpty, map, round } from "lodash";
import { showNotification } from "../../../utils/index";
const RUN_FLOWS = {
  sameCamps: "Chung Camp",
  diffCamps: "Khác Camp",
};

const RunFlows = ({ selectedPayload }) => {
  const [runflowValue, setRunFlowValue] = useState(RUN_FLOWS.sameCamps);
  const [totalBudget, setTotalBudget] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

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
          rootCampId: selectedPayload?.rootCampaign?.campaignId,
          campInfo: {
            budget: totalBudget,
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
      const budgetPerCamp = round(totalBudget / selectedAds.length, 0);
      const transformedPayloads = map(selectedAds, (x) => ({
        rootCampId: selectedPayload?.rootCampaign?.campaignId,
        campInfo: {
          budget: budgetPerCamp,
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
  const handleCreateCampaign = () => {
    if (!totalBudget) {
      showNotification("Thất bại", "Vui lòng nhập Budget", "red");
      return;
    }
    if (isEmpty(selectedImages) && isEmpty(selectedVideos)) {
      showNotification(
        "Thất bại",
        "Vui lòng chọn ít nhất 1 hình hoặc 1 video",
        "red"
      );
      return;
    }
    console.log(`payloads`, payloads);
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
                  (x) => (x.type === "image" || !x.type) && x.postId
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
                          <Text size="sm">{item.postName}</Text>
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
                (x) => x.type === "video" && x.postId
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
          >
            Lên Camp
          </Button>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default RunFlows;
