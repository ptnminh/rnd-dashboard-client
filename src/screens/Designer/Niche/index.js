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
  CopyButton,
} from "@mantine/core";
import {
  CONVERT_NUMBER_TO_STATUS,
  getEditorStateAsString,
  getStringAsEditorState,
} from "../../../utils";
import {
  IconCircleCheck,
  IconArrowBigRightLinesFilled,
  IconCopyCheckFilled,
  IconCopy,
  IconExclamationMark,
} from "@tabler/icons-react";
import Editor from "../../../components/Editor";
import styles from "./ScaleNiche.module.sass";
import { isEmpty, map } from "lodash";
import { STATUS } from "../../../constant";
import { useState } from "react";
import { rndServices } from "../../../services";
import { showNotification } from "../../../utils/index";

const ScaleNiche = ({
  close,
  selectedSKU,
  linkDesign,
  loadingUpdateDesignLink,
  setLinkDesign,
  handleUpdateLinkDesign,
  opened,
  setTrigger,
}) => {
  const [designerNote, setDesignerNote] = useState(
    getStringAsEditorState(selectedSKU?.note?.designer || "")
  );
  const [loading, setLoading] = useState(false);
  const handleUpdateNote = async () => {
    setLoading(true);
    const updateNoteResponse = await rndServices.updateBriefDesign({
      uid: selectedSKU.uid,
      data: {
        note: {
          ...selectedSKU.note,
          designer: getEditorStateAsString(designerNote),
        },
      },
    });
    if (updateNoteResponse) {
      setTrigger(true);
      showNotification("Thành công", "Cập nhật Note thành công", "green");
    }
    setLoading(false);
  };
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
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    Priority
                  </span>
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
              Scale Niche
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
                    width: "120px",
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
          {!isEmpty(selectedSKU?.cliparts) && (
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
          )}
          <Card
            shadow="sm"
            padding="sm"
            style={{
              cursor: "pointer",
              position: "relative",
              marginTop: "20px",
            }}
          >
            <Card.Section>
              <div
                style={{
                  cursor: "pointer",
                  width: "100%",
                  height: "200px",
                  padding: "10px",
                  position: "relative",
                }}
              >
                {selectedSKU?.niche?.quote}
                {true && (
                  <>
                    <div
                      style={{
                        padding: "5px",
                        position: "absolute",
                        bottom: "10px",
                        right: "13px",
                        borderRadius: "50%",
                        zIndex: 2,
                      }}
                    >
                      <CopyButton value={selectedSKU?.niche?.quote} color>
                        {({ copied, copy }) => (
                          <Button color="#62D256" onClick={copy}>
                            {copied ? (
                              <IconCopyCheckFilled color="#ffffff" />
                            ) : (
                              <IconCopy color="#ffffff" />
                            )}
                          </Button>
                        )}
                      </CopyButton>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "9px",
                        right: "0",
                        height: "94%",
                        width: "99%",
                        cursor: "pointer",
                        padding: "10px",
                        borderRadius: "10px",
                        zIndex: 1,
                      }}
                    ></div>
                  </>
                )}
              </div>
            </Card.Section>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Editor
            state={designerNote}
            onChange={setDesignerNote}
            classEditor={styles.editor}
            label="Designer Note"
            readOnly={selectedSKU?.status === STATUS.DESIGNED}
            button={selectedSKU?.status !== STATUS.DESIGNED}
            onClick={() => handleUpdateNote()}
            loading={loading}
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

export default ScaleNiche;
