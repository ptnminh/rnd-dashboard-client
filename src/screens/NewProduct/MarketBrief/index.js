import {
  Grid,
  ScrollArea,
  Card as MantineCard,
  Image,
  TextInput,
} from "@mantine/core";
import Card from "../../../components/Card";
import styles from "./MarketBrief.module.sass";
import cn from "classnames";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import LazyLoad from "react-lazyload";
import { uploadServices } from "../../../services/uploads";
import { showNotification } from "../../../utils/index";
import Loader from "../../../components/Loader";
import { isEmpty, set } from "lodash";
import Editor from "../../../components/Editor";

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
const MarketBriefDesign = ({ marketBrief, setMarketBrief, title }) => {
  const [showingSelectFile, setShowingSelectFile] = useState(false);
  const [loadingUploadFile, setLoadingUploadFile] = useState(false);
  const [briefNote, setBriefNote] = useState("");
  const pasteContainerRef = useRef(null);
  const handleChange = async (file) => {
    setLoadingUploadFile(true);
    const fileName = generateRandomString(10);
    const updateFileResponse = await uploadServices.upload(file, fileName);
    if (updateFileResponse) {
      const newMarketBrief = {
        imageRef: updateFileResponse.data.url,
        designLinkRef: marketBrief?.designLinkRef,
        note: marketBrief?.note,
      };
      setMarketBrief(newMarketBrief);
    } else {
      showNotification("Thất bại", "Upload ảnh thất bại", "red");
    }
    setLoadingUploadFile(false);
    setShowingSelectFile(false);
  };

  useEffect(() => {
    if (briefNote) {
      setMarketBrief({
        ...marketBrief,
        note: briefNote,
      });
    }
  }, [briefNote]);

  const handlePaste = async (event) => {
    setLoadingUploadFile(true);
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        const fileName = generateRandomString(10);
        const updateFileResponse = await uploadServices.upload(blob, fileName);
        if (updateFileResponse) {
          const newMarketBrief = {
            imageRef: updateFileResponse.data.url,
            designLinkRef: marketBrief?.designLinkRef,
            note: marketBrief?.note,
          };
          setMarketBrief(newMarketBrief);
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
        title={title || "3. Ref Design (Market)"}
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
            {isEmpty(marketBrief) && (
              <Grid.Col
                span={{ sm: 4, md: 3, lg: 2 }}
                style={{
                  position: "relative",
                  height: "100%",
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
            )}
            {!isEmpty(marketBrief) && (
              <>
                <Grid.Col
                  span={3}
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
                          setMarketBrief({});
                        }}
                      >
                        <IconX color="rgb(102, 102, 102)" />
                      </div>
                    </MantineCard.Section>
                    <MantineCard.Section>
                      <LazyLoad height={250} once={true}>
                        <Image
                          src={
                            marketBrief.imageRef ||
                            marketBrief?.image ||
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
                      value={marketBrief?.designLinkRef || ""}
                      onChange={(event) =>
                        setMarketBrief({
                          ...marketBrief,
                          designLinkRef: event.target.value,
                        })
                      }
                    />
                  </MantineCard>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Editor
                    state={briefNote}
                    onChange={setBriefNote}
                    classEditorWrapper={styles.editorWrapper}
                    classEditor={styles.editor}
                    label="Details Brief"
                  />
                </Grid.Col>
              </>
            )}
          </Grid>
        </ScrollArea>
      </Card>
    </>
  );
};

export default MarketBriefDesign;
