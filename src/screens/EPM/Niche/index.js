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
} from "@mantine/core";
import {
  CONVERT_NUMBER_TO_STATUS,
  getStringAsEditorState,
} from "../../../utils";
import {
  IconCircleCheck,
  IconArrowBigRightLinesFilled,
} from "@tabler/icons-react";
import Editor from "../../../components/Editor";
import { join, map } from "lodash";

const Niche = ({
  close,
  selectedSKU,
  linkProduct,
  loadingUpdateProductLink,
  setLinkProduct,
  handleUpdateLinkProduct,
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
      size="1000px"
    >
      <LoadingOverlay
        visible={loadingUpdateProductLink}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Grid>
        <Grid.Col span={12}>
          <div
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
            {selectedSKU?.briefType}
          </div>
        </Grid.Col>
        <Grid.Col span={5}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "5px",
              fontSize: "18px",
            }}
          >
            SKU: {selectedSKU?.sku} - Batch: {selectedSKU?.batch}
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
            Value: {CONVERT_NUMBER_TO_STATUS[selectedSKU?.value?.rnd]} - Size:{" "}
            {CONVERT_NUMBER_TO_STATUS[selectedSKU?.size?.rnd]}
            {selectedSKU?.priority === 2 ? " - Priority" : ""}
          </div>
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>

        <Grid.Col span={5}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "5px",
              fontSize: "14px",
            }}
          >
            {selectedSKU?.rndTeam} - RnD {selectedSKU?.rnd.name} - Designer{" "}
            {selectedSKU?.designer.name}
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
            EPM {selectedSKU?.epm.name}
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
            Ref
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
            {selectedSKU?.designLinkRef && (
              <List.Item>
                Link Design (NAS):{" "}
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
                  href={selectedSKU?.designLinkRef}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedSKU?.designLinkRef}
                </a>
              </List.Item>
            )}
            {selectedSKU?.productInfo?.tibSearchCampaignLink && (
              <List.Item>
                Link Campaign (TIB):{" "}
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
            Scale
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
            {selectedSKU?.sku} mới
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
            {
              <List.Item>
                Clipart:{" "}
                <span>{join(map(selectedSKU?.cliparts, "name"), " ,")}</span>
              </List.Item>
            }
            {selectedSKU?.linkDesign && (
              <List.Item>
                Link Design (NAS):{" "}
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
            <List.Item>Link Campaign (TIB) - Auto: (Coming soon)</List.Item>
          </List>
        </Grid.Col>
        <Grid.Col span={12}>
          <Editor
            state={getStringAsEditorState(selectedSKU?.note?.epm)}
            label="EPM Note"
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

export default Niche;
