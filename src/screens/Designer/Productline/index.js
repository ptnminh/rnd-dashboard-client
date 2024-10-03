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
  CONVERT_BRIEF_TYPE_TO_OBJECT_NAME,
  CONVERT_NUMBER_TO_STATUS,
  getEditorStateAsString,
  getStringAsEditorState,
} from "../../../utils";
import {
  IconCircleCheck,
  IconArrowBigRightLinesFilled,
  IconExclamationMark,
} from "@tabler/icons-react";
import Editor from "../../../components/Editor";
import { map } from "lodash";
import { BRIEF_TYPES, STATUS } from "../../../constant";
import { useState } from "react";
import { rndServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import moment from "moment-timezone";
import useStopWatch from "../../../hooks/useStopWatch";
const ProductLine = ({
  close,
  selectedSKU,
  linkDesign,
  loadingUpdateDesignLink,
  setLinkDesign,
  handleUpdateLinkDesign,
  opened,
  setTrigger,
  setDesignerNote,
  designerNote,
  setSelectedSKU,
}) => {
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
      close();
      setTrigger(true);
      showNotification("Thành công", "Cập nhật Note thành công", "green");
    }
    setLoading(false);
  };
  const handleUpdateStartTime = async () => {
    setLoading(true);
    const designStartedAt = moment().utc().format();
    const updateStartTimeResponse = await rndServices.updateBriefDesign({
      uid: selectedSKU.uid,
      data: {
        designStartedAt,
      },
    });
    if (updateStartTimeResponse) {
      setSelectedSKU({
        ...selectedSKU,
        designInfo: {
          ...selectedSKU.designInfo,
          startedAt: designStartedAt,
        },
      });
      setTrigger(true);
    }
    setLoading(false);
  };
  const elapsedTime = useStopWatch(
    selectedSKU?.designInfo?.startedAt,
    selectedSKU?.designInfo?.doneAt
  );
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
      size="1000px"
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
        content: {
          position: "relative",
        },
      }}
      title={selectedSKU?.sku}
    >
      <Button
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
        }}
        loading={loading}
        color="red"
        onClick={() => {
          handleUpdateStartTime();
        }}
        disabled={selectedSKU?.designInfo?.startedAt}
      >
        {selectedSKU?.designInfo?.startedAt ? elapsedTime : "Start"}
      </Button>
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
              {selectedSKU?.briefType}
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
            • RnD: {selectedSKU?.rnd?.name}
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
            • Designer:{selectedSKU?.designer?.name}
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
            {(selectedSKU?.designLinkRef?.designLink ||
              selectedSKU?.designLinkRef) && (
              <List.Item>
                Link Design (NAS):{" "}
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
          span={2}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconArrowBigRightLinesFilled size={56} color="#228be6" />
        </Grid.Col>
        <Grid.Col span={5}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              fontSize: "18px",
              alignItems: "center",
            }}
          >
            Scale
          </div>
          {selectedSKU?.briefType === BRIEF_TYPES[0] ||
          selectedSKU?.briefType === BRIEF_TYPES[1] ||
          (selectedSKU?.briefType === BRIEF_TYPES[2] &&
            selectedSKU?.clipart.name) ? (
            <>
              <Image
                radius="md"
                src={
                  selectedSKU[
                    CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[selectedSKU?.briefType]
                  ]?.image || "/images/content/not_found_2.jpg"
                }
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
                {
                  selectedSKU[
                    CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[selectedSKU?.briefType]
                  ]?.name
                }
              </div>
            </>
          ) : null}
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
            {selectedSKU[
              CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[selectedSKU?.briefType]
            ]?.refLink && (
              <List.Item>
                Link Mockup:{" "}
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
                  href={
                    selectedSKU[
                      CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[selectedSKU?.briefType]
                    ]?.refLink
                  }
                  target="_blank"
                >
                  {
                    selectedSKU[
                      CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[selectedSKU?.briefType]
                    ]?.refLink
                  }
                </a>
              </List.Item>
            )}
          </List>
        </Grid.Col>
        <Grid.Col span={12}>
          <Editor
            state={designerNote}
            onChange={setDesignerNote}
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

export default ProductLine;
