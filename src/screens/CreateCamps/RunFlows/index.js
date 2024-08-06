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
import { useState } from "react";
import {
  IconCurrencyDollar,
  IconExternalLink,
  IconCopy,
} from "@tabler/icons-react";
import { filter, map } from "lodash";
const RUN_FLOWS = {
  sameCamps: "Chung Camp",
  diffCamps: "Khác Camp",
};

const RunFlows = ({ selectedPayload }) => {
  const [runflowValue, setRunFlowValue] = useState(RUN_FLOWS.sameCamps);
  const [selectedAds, setSelectedAds] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
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
          <Checkbox.Group value={selectedAds} onChange={setSelectedAds}>
            <Stack pt="md" gap="xs">
              {map(
                filter(
                  selectedPayload?.ads,
                  (x) => (x.type === "image" || !x.type) && x.postId
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
                          src={item.value || "/images/content/not_found_2.jpg"}
                          width="80px"
                          height="80px"
                          radius="md"
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
        <Checkbox.Group value={selectedVideos} onChange={setSelectedVideos}>
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
          <Button variant="filled" color="green" size="sx">
            Lên Camp
          </Button>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default RunFlows;
