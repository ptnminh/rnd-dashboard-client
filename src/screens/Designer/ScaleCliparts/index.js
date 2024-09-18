import {
  Grid,
  Image,
  List,
  LoadingOverlay,
  Modal,
  rem,
  ThemeIcon,
  Flex,
  TextInput,
  Button,
  ScrollArea,
  Card,
  Group,
  Text,
} from "@mantine/core";
import {
  CONVERT_NUMBER_TO_STATUS,
  getStringAsEditorState,
} from "../../../utils";
import {
  IconCircleCheck,
  IconArrowBigRightLinesFilled,
  IconExclamationMark,
} from "@tabler/icons-react";
import Editor from "../../../components/Editor";
import styles from "./ScaleCliparts.module.sass";
import { map } from "lodash";
import { STATUS } from "../../../constant";

const ScaleClipart = ({
  close,
  selectedSKU,
  linkDesign,
  loadingUpdateDesignLink,
  setLinkDesign,
  handleUpdateLinkDesign,
  opened,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      transitionProps={{ transition: "fade", duration: 200 }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      radius="md"
      size="80%"
      styles={{
        title: {
          fontSize: "21px",
          fontWeight: "bold",
          margin: "auto",
        },
        close: {
          margin: "none",
          marginInlineStart: "unset",
        },
      }}
      title={selectedSKU?.sku}
    >
      <LoadingOverlay
        visible={loadingUpdateDesignLink}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Grid>
        <Grid.Col span={12}>
          <Grid
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
              backgroundColor: "#D9F5D6",
              border: "1px solid #62D256",
              color: "#000000",
              borderColor: "#62D256",
              fontSize: "18px",
              borderRadius: "12px",
            }}
          >
            <Grid.Col span={4}>
              {selectedSKU?.priority === 2 ? (
                <span>
                  <IconExclamationMark color="red" size={24} />
                  <span>Priority</span>
                </span>
              ) : (
                ""
              )}
            </Grid.Col>
            <Grid.Col
              span={4}
              style={{
                textAlign: "center",
              }}
            >
              Scale Clipart
            </Grid.Col>
            <Grid.Col span={4}></Grid.Col>
          </Grid>
        </Grid.Col>

        <Grid.Col
          span={5}
          style={{
            boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "5px",
              fontSize: "14px",
            }}
          >
            • Batch: {selectedSKU?.batch}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "5px",
              fontSize: "14px",
            }}
          >
            • Value: {CONVERT_NUMBER_TO_STATUS[selectedSKU?.value?.rnd]}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "5px",
              fontSize: "14px",
            }}
          >
            • Size: {CONVERT_NUMBER_TO_STATUS[selectedSKU?.size?.design]}
          </div>
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>
        <Grid.Col
          span={5}
          style={{
            boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "5px",
              fontSize: "14px",
            }}
          >
            • Team: {selectedSKU?.rndTeam}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "5px",
              fontSize: "14px",
            }}
          >
            • RnD: {selectedSKU?.rnd.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "5px",
              fontSize: "14px",
            }}
          >
            • Designer:{selectedSKU?.designer.name}
          </div>
        </Grid.Col>
        <Grid.Col span={5}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "5px",
              fontSize: "18px",
              alignItems: "center",
            }}
          >
            REF
          </div>
          <Image
            radius="md"
            src={selectedSKU?.imageRef || "/images/content/not_found_2.jpg"}
            height={200}
            fit="contain"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              fontSize: "18px",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            {selectedSKU?.skuRef}
          </div>
          <List
            spacing="lg"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
            }
          >
            {selectedSKU?.linkProductRef && (
              <List.Item>
                Link Product:{" "}
                <a
                  style={{
                    display: "inline-block",
                    width: "230px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textDecoration: "none",
                    color: "#228be6",
                    verticalAlign: "middle",
                  }}
                  href={selectedSKU?.linkProductRef}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedSKU?.linkProductRef}
                </a>
              </List.Item>
            )}
            {selectedSKU?.productLine?.refLink && (
              <List.Item>
                Link Product Base (Library):{" "}
                <a
                  style={{
                    display: "inline-block",
                    width: "230px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textDecoration: "none",
                    color: "#228be6",
                    verticalAlign: "middle",
                  }}
                  href={selectedSKU?.productLine?.refLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedSKU?.productLine?.refLink}
                </a>
              </List.Item>
            )}
            {(selectedSKU?.designLinkRef?.designLink ||
              selectedSKU?.designLinkRef) && (
              <List.Item>
                Link Design (NAS):{" "}
                <a
                  style={{
                    display: "inline-block",
                    width: "100px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textDecoration: "none",
                    color: "#228be6",
                    verticalAlign: "middle",
                  }}
                  href={
                    selectedSKU?.designLinkRef ||
                    selectedSKU?.productLine?.designLink
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedSKU?.designLinkRef ||
                    selectedSKU?.productLine?.designLink}
                </a>
              </List.Item>
            )}
          </List>
        </Grid.Col>
        <Grid.Col
          span={1}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconArrowBigRightLinesFilled size={56} color="#228be6" />
        </Grid.Col>
        <Grid.Col span={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "5px",
              fontSize: "18px",
              alignItems: "center",
            }}
          >
            SCALE
          </div>
          <ScrollArea offsetScrollbars="y" h={350}>
            <Flex wrap={true} gap={15} direction="column">
              {map(selectedSKU?.cliparts, (clipart) => (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section
                    style={{
                      padding: "5px",
                    }}
                  >
                    <Grid>
                      <Grid.Col span={3}>
                        <Image
                          src={
                            clipart.image || "/images/content/not_found_2.jpg"
                          }
                          h="100px"
                          w="100%"
                          alt="Norway"
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      </Grid.Col>
                      <Grid.Col
                        span={9}
                        style={{
                          display: "flex",
                        }}
                      >
                        <Group>
                          <Text fw={500}>{clipart?.name}</Text>
                          <List
                            spacing="lg"
                            size="sm"
                            center
                            icon={
                              <ThemeIcon color="teal" size={24} radius="xl">
                                <IconCircleCheck
                                  style={{ width: rem(16), height: rem(16) }}
                                />
                              </ThemeIcon>
                            }
                          >
                            {clipart.refLink && (
                              <List.Item>
                                Link Clipart:{" "}
                                <a
                                  style={{
                                    display: "inline-block",
                                    width: "230px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textDecoration: "none",
                                    color: "#228be6",
                                    verticalAlign: "middle",
                                  }}
                                  href={clipart.refLink}
                                  target="_blank"
                                >
                                  {clipart.refLink}
                                </a>
                              </List.Item>
                            )}
                          </List>
                        </Group>
                      </Grid.Col>
                    </Grid>
                  </Card.Section>
                </Card>
              ))}
            </Flex>
          </ScrollArea>
        </Grid.Col>

        <Grid.Col span={12}>
          <Editor
            state={getStringAsEditorState(selectedSKU?.note?.designer)}
            classEditor={styles.editor}
            label="Designer Note"
            readOnly={true}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Flex gap={10}>
            <TextInput
              placeholder="Output - Link Design (NAS)"
              style={{
                flex: "1 1 90%",
              }}
              value={linkDesign}
              onChange={(event) => setLinkDesign(event.target.value)}
            />
            <Button
              style={{
                flex: "1 1 10%",
                backgroundColor: "#62D256",
                color: "#ffffff",
              }}
              disabled={selectedSKU?.status === STATUS.DESIGNED}
              onClick={() => {
                handleUpdateLinkDesign(selectedSKU?.uid);
              }}
            >
              DONE
            </Button>
          </Flex>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export default ScaleClipart;
