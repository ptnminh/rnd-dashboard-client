import {
  Grid,
  ScrollArea,
  Card as MantineCard,
  Image,
  Button,
  TextInput,
  Modal,
  Text,
} from "@mantine/core";
import Card from "../../../components/Card";
import styles from "./RefDesign.module.sass";
import cn from "classnames";
import { findIndex, map } from "lodash";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import LazyLoad from "react-lazyload";
import { uploadServices } from "../../../services/uploads";
import { showNotification } from "../../../utils/index";
import Loader from "../../../components/Loader";
import { useDisclosure } from "@mantine/hooks";
import Clipart from "../Clipart";
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const RefDesign = ({
  designs,
  setDesigns,
  clipArts,
  fetchClipArts,
  fetchClipArtsLoading,
  pagination,
  searchClipArt,
  setSearchClipArt,
  filtersClipArt,
  query,
  setQuery,
  selectedClipArts,
  setSelectedClipArts,
  briefType,
  BRIEF_TYPES,
  handlePageChange,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showingSelectFile, setShowingSelectFile] = useState(false);
  const [loadingUploadFile, setLoadingUploadFile] = useState(false);
  const pasteContainerRef = useRef(null);
  const handleChange = async (file) => {
    setLoadingUploadFile(true);
    const fileName = generateRandomString(10);
    const updateFileResponse = await uploadServices.upload(file, fileName);
    if (updateFileResponse) {
      const newDesigns = [
        {
          imageRef: updateFileResponse.data.url,
          clipart: null,
          designLinkRef: null,
        },
        ...designs,
      ];
      setDesigns(newDesigns);
    } else {
      showNotification("Thất bại", "Upload ảnh thất bại", "red");
    }
    setLoadingUploadFile(false);
    setShowingSelectFile(false);
  };
  const handleSelectClipart = () => {
    if (selectedDesign) {
      const newDesigns = designs.map((design) => {
        if (design.imageRef === selectedDesign.imageRef) {
          return {
            ...design,
            clipart: selectedClipArts[0],
          };
        }
        return design;
      });
      setDesigns(newDesigns);
      setSelectedClipArts([]);
    }
    close();
  };

  const handlePaste = async (event) => {
    setLoadingUploadFile(true);
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        const fileName = generateRandomString(10);
        const updateFileResponse = await uploadServices.upload(blob, fileName);
        if (updateFileResponse) {
          const newDesigns = [
            {
              imageRef: updateFileResponse.data.url,
              clipart: null,
              designLinkRef: null,
            },
            ...designs,
          ];
          setDesigns(newDesigns);
        } else {
          showNotification("Thất bại", "Upload ảnh thất bại", "red");
        }
      }
    }
    setShowingSelectFile(false);
    setLoadingUploadFile(false);
  };

  return (
    <>
      <Card
        className={styles.card}
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classScaleSpanTitle}
        title="3. Ref Design (Market)"
        classTitle={cn("title-green", styles.title)}
      >
        <ScrollArea
          h={550}
          scrollbars="y"
          scrollbarSize={4}
          scrollHideDelay={1000}
        >
          <Grid
            style={{
              marginTop: "10px",
            }}
            columns={12}
          >
            <Grid.Col
              span={{ sm: 4, md: 3, lg: 2 }}
              style={{
                position: "relative",
              }}
            >
              <MantineCard
                shadow="sm"
                padding="sm"
                style={{
                  height: "364px",
                  backgroundColor: "#EFF0F1",
                }}
              >
                <MantineCard.Section
                  style={{
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <span
                      style={{
                        border: "1px solid #4E83FD",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowingSelectFile(!showingSelectFile);
                        if (pasteContainerRef.current) {
                          pasteContainerRef.current.click();
                        }
                      }}
                    >
                      {loadingUploadFile ? (
                        <Loader />
                      ) : (
                        <IconPlus size={48} color="#4E83FD" />
                      )}
                    </span>
                  </div>
                </MantineCard.Section>
                {showingSelectFile && (
                  <>
                    <FileUploader
                      handleChange={handleChange}
                      name="file"
                      classes={styles.fileUploader}
                      label="Drag Or Upload"
                      types={["JPG", "PNG", "GIF", "JPEG"]}
                    />
                    <div
                      ref={pasteContainerRef}
                      onPaste={handlePaste}
                      style={{
                        width: "100%",
                        border: "2px dashed rgb(6, 88, 194)",
                        padding: "20px",
                        textAlign: "center",
                        margin: "0 auto",
                        color: "rgb(102, 102, 102)",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      <p>Click me first then paste an image here</p>
                    </div>
                  </>
                )}
              </MantineCard>
            </Grid.Col>
            {map(designs, (item, index) => (
              <Grid.Col
                span={{ sm: 4, md: 3, lg: 2 }}
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <MantineCard
                  shadow="sm"
                  padding="sm"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <MantineCard.Section
                    style={{
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setDesigns(
                          designs.filter((x) => x.imageRef !== item.imageRef)
                        );
                      }}
                    >
                      <IconX color="rgb(102, 102, 102)" />
                    </div>
                  </MantineCard.Section>
                  <MantineCard.Section>
                    <LazyLoad height={250} once={true}>
                      <Image
                        src={
                          item.imageRef ||
                          item?.image ||
                          "/images/content/not_found_2.jpg"
                        }
                        h={250}
                        alt="No way!"
                        fit="contain"
                      />
                    </LazyLoad>
                  </MantineCard.Section>
                  <TextInput
                    mt="md"
                    rightSectionPointerEvents="none"
                    placeholder="Link sản phẩm (market)"
                    value={item?.designLinkRef || ""}
                    onChange={(event) => {
                      const foundDesignIndex = findIndex(designs, {
                        imageRef: item.imageRef,
                      });
                      if (foundDesignIndex === -1) return;
                      const newDesigns = [...designs];
                      newDesigns[foundDesignIndex] = {
                        ...item,
                        designLinkRef: event.target.value,
                      };
                      setDesigns(newDesigns);
                    }}
                  />
                  {item?.clipart?.name ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "25px",
                      }}
                    >
                      <Text
                        fw={500}
                        size="sm"
                        style={{
                          display: "inline-block",
                          width: "200px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textDecoration: "none",
                          verticalAlign: "middle",
                        }}
                      >
                        {item?.clipart?.name}
                      </Text>
                      <span
                        onClick={() => {
                          const newDesigns = designs.map((design) => {
                            if (design.imageRef === item.imageRef) {
                              return {
                                ...design,
                                clipart: null,
                              };
                            }
                            return design;
                          });
                          setDesigns(newDesigns);
                        }}
                      >
                        <IconX color="rgb(102, 102, 102)" />
                      </span>
                    </div>
                  ) : (
                    <Button
                      color="blue"
                      fullWidth
                      mt="md"
                      radius="md"
                      variant="default"
                      style={{
                        borderColor: "#3851D6",
                        color: "#5083FB",
                      }}
                      onClick={() => {
                        setSelectedDesign(item);
                        open();
                      }}
                    >
                      Add Clipart (UID)
                    </Button>
                  )}
                </MantineCard>
              </Grid.Col>
            ))}
          </Grid>
        </ScrollArea>
      </Card>
      <Modal
        opened={opened}
        onClose={close}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="md"
        size="90%"
      >
        <Card
          className={styles.card}
          classCardHead={styles.classCardHead}
          classSpanTitle={styles.classScaleSpanTitle}
          title="Chọn Clipart"
          classTitle={cn("title-green", styles.title)}
        >
          <Clipart
            clipArts={clipArts}
            fetchClipArts={fetchClipArts}
            pagination={pagination}
            searchClipArt={searchClipArt}
            setSearchClipArt={setSearchClipArt}
            filtersClipArt={filtersClipArt}
            query={query}
            selectedClipArts={selectedClipArts}
            setSelectedClipArts={setSelectedClipArts}
            handlePageChange={handlePageChange}
            briefType={briefType}
            BRIEF_TYPES={BRIEF_TYPES}
            fetchClipArtsLoading={fetchClipArtsLoading}
            setQuery={setQuery}
            handleSelectClipart={handleSelectClipart}
          />
        </Card>
      </Modal>
    </>
  );
};

export default RefDesign;
