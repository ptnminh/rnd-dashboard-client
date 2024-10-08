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
  IconPlus,
} from "@tabler/icons-react";
import Editor from "../../../components/Editor";
import styles from "./NewDesign.module.sass";
import { isEmpty, map } from "lodash";

const ScaleMixMatch = ({
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
      size={!isEmpty(selectedSKU?.cliparts) ? "95%" : "1000px"}
    >
      <LoadingOverlay
        visible={loadingUpdateDesignLink}
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
            New - Mix Match
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
        </Grid.Col>
        <>
          <Grid.Col span={3.5}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "5px",
                fontSize: "18px",
                alignItems: "center",
              }}
            >
              Product Line
            </div>
            <Image
              radius="md"
              src={
                selectedSKU?.productLine?.image ||
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
              {selectedSKU?.productLine?.name}
            </div>
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
            </List>
          </Grid.Col>
          <Grid.Col
            span={0.75}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconArrowBigRightLinesFilled size={56} color="#228be6" />
          </Grid.Col>
          <Grid.Col span={3.5}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "5px",
                fontSize: "18px",
                alignItems: "center",
              }}
            >
              Design Ref
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
                marginTop: "20px",
              }}
            ></div>
            <List
              spacing="lg"
              size="sm"
              mt={24}
              center
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck
                    style={{ width: rem(16), height: rem(16) }}
                  />
                </ThemeIcon>
              }
            >
              {selectedSKU.designLinkRef && (
                <List.Item>
                  Link sản phẩm (Market):{" "}
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
                    href={`https://${selectedSKU.designLinkRef.replace(
                      /^(https?:\/\/)?/,
                      ""
                    )}`}
                    target="_blank"
                  >
                    {selectedSKU.designLinkRef}
                  </a>
                </List.Item>
              )}
            </List>
          </Grid.Col>

          <Grid.Col
            span={0.75}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconPlus size={56} color="#228be6" />
          </Grid.Col>
          <Grid.Col span={3.5}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "5px",
                fontSize: "18px",
                alignItems: "center",
              }}
            >
              Clipart
            </div>
            <ScrollArea offsetScrollbars="x" w={500}>
              <Flex wrap={true} gap={30}>
                {map(selectedSKU?.cliparts, (clipart) => (
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                      <Image
                        src={clipart.image || "/images/content/not_found_2.jpg"}
                        h="200px"
                        w="200px"
                        alt="Norway"
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </Card.Section>
                    <Group justify="space-between" mt="md" mb="xs">
                      <Text fw={500}>{clipart?.name}</Text>
                    </Group>

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
                  </Card>
                ))}
              </Flex>
            </ScrollArea>
          </Grid.Col>
        </>
        <Grid.Col span={12}>
          <Editor
            state={getStringAsEditorState(selectedSKU?.note?.mixMatch)}
            classEditor={styles.editor}
            label="Detail Brief"
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

export default ScaleMixMatch;
