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
  HoverCard,
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
import { isEmpty, map } from "lodash";
import { STATUS } from "../../../constant";
import { useState } from "react";
import moment from "moment-timezone";
import { rndServices } from "../../../services";
import useStopWatch from "../../../hooks/useStopWatch";

const Clipart = ({
  close,
  selectedSKU,
  linkProduct,
  loadingUpdateProductLink,
  setLinkProduct,
  handleUpdateLinkProduct,
  opened,
  setSelectedSKU,
  fetchBriefs,
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateStartTime = async () => {
    setLoading(true);
    const epmStartedAt = moment().utc().format();
    const updateStartTimeResponse = await rndServices.updateBriefListing({
      uid: selectedSKU.uid,
      data: {
        epmStartedAt,
      },
    });
    if (updateStartTimeResponse) {
      setSelectedSKU({
        ...selectedSKU,
        productInfo: {
          ...selectedSKU.productInfo,
          startedAt: epmStartedAt,
        },
      });
      fetchBriefs();
    }
    setLoading(false);
  };
  const elapsedTime = useStopWatch(
    selectedSKU?.productInfo?.startedAt,
    selectedSKU?.productInfo?.doneAt
  );
  return (
    <Modal
      opened={opened}
      onClose={() => {
        fetchBriefs();
        close();
      }}
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
        disabled={selectedSKU?.productInfo?.startedAt}
      >
        {selectedSKU?.productInfo?.startedAt ? elapsedTime : "Start"}
      </Button>
      <LoadingOverlay
        visible={loadingUpdateProductLink}
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
            • Designer: {selectedSKU?.designer.name}
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
            • EPM: {selectedSKU?.epm.name}
          </div>
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
            Ref - Artwork
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
                Link Store:{" "}
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
                >
                  {selectedSKU?.linkProductRef}
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
            Scale To Clipart
          </div>
          <Image
            radius="md"
            src={
              selectedSKU?.designInfo?.thumbLink ||
              "/images/content/not_found_2.jpg"
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
            {selectedSKU?.sku}
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
            {selectedSKU?.productLine?.name && (
              <List.Item>
                Product Base: {selectedSKU?.productLine?.name}
              </List.Item>
            )}
            {selectedSKU?.productInfo?.tibSearchCampaignLink && (
              <List.Item>
                Campaign (TIB): {""}
                <a
                  style={{
                    display: "inline-block",
                    width: "200px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textDecoration: "none",
                    color: "#228be6",
                    verticalAlign: "middle",
                  }}
                  href={selectedSKU?.productInfo?.tibSearchCampaignLink}
                  target="_blank"
                >
                  {selectedSKU?.productInfo?.tibSearchCampaignLink}
                </a>
              </List.Item>
            )}
            {selectedSKU?.linkDesign && (
              <List.Item>
                Design (NAS):{" "}
                <a
                  style={{
                    display: "inline-block",
                    width: "200px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textDecoration: "none",
                    color: "#228be6",
                    verticalAlign: "middle",
                  }}
                  href={selectedSKU?.linkDesign}
                  target="_blank"
                >
                  {selectedSKU?.linkDesign}
                </a>
              </List.Item>
            )}
            {!isEmpty(selectedSKU?.cliparts) && (
              <List.Item>
                Clipart:{" "}
                <List
                  listStyleType="disc"
                  withPadding
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {map(selectedSKU?.cliparts, (clipart) => {
                    return (
                      <List.Item
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        <HoverCard width={280} shadow="md">
                          <HoverCard.Target>
                            <a href={clipart?.refLink} target="_blank">
                              {clipart.name}
                            </a>
                          </HoverCard.Target>
                          <HoverCard.Dropdown>
                            <iframe
                              src={clipart?.refLink}
                              title={clipart.name}
                            ></iframe>
                          </HoverCard.Dropdown>
                        </HoverCard>
                      </List.Item>
                    );
                  })}
                </List>
              </List.Item>
            )}
          </List>
        </Grid.Col>
        <Grid.Col span={6}>
          <Editor
            state={getStringAsEditorState(selectedSKU?.note?.epm)}
            label="RnD Note"
            readOnly={true}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Editor
            state={getStringAsEditorState(selectedSKU?.note?.noteForEPM)}
            label="Designer Note"
            readOnly={true}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Flex gap={10}>
            <TextInput
              placeholder="Output - Link Website"
              style={{
                flex: "1 1 90%",
              }}
              value={linkProduct}
              onChange={(event) => setLinkProduct(event.target.value)}
            />
            <Button
              style={{
                flex: "1 1 10%",
                backgroundColor: "#62D256",
                color: "#ffffff",
              }}
              disabled={selectedSKU?.status === STATUS.LISTED}
              onClick={() => {
                handleUpdateLinkProduct(selectedSKU?.uid);
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

export default Clipart;
