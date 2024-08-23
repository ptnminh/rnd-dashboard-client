import { Card, Image, Text } from "@mantine/core";
import { useRef, useState } from "react";
import { uploadServices } from "../../../services/uploads";
import { showNotification } from "../../../utils/index";
import { FileUploader } from "react-drag-drop-files";
import { IconPlus, IconX } from "@tabler/icons-react";
import styles from "./ArtistRef.module.sass";
import LazyLoad from "react-lazyload";
import Loader from "../../../components/Loader";

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

const ArtistRef = ({
  artistDesignRefLink,
  setArtistDesignRefLink,
  isPreview,
}) => {
  const [loadingUploadFile, setLoadingUploadFile] = useState(false);
  const pasteContainerRef = useRef(null);
  const handleChange = async (file) => {
    setLoadingUploadFile(true);
    const fileName = generateRandomString(10);
    const updateFileResponse = await uploadServices.upload(file, fileName);
    if (updateFileResponse) {
      setArtistDesignRefLink(updateFileResponse.data.shortUrl);
    } else {
      showNotification("Thất bại", "Upload ảnh thất bại", "red");
    }
    setLoadingUploadFile(false);
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
          setArtistDesignRefLink(updateFileResponse.data.shortUrl);
        } else {
          showNotification("Thất bại", "Upload ảnh thất bại", "red");
        }
      }
    }
    setLoadingUploadFile(false);
  };

  return (
    <>
      {!artistDesignRefLink && (
        <>
          <Text
            align="center"
            style={{
              marginBottom: "14px",
              fontWeight: 600,
              lineHeight: 1.7,
              fontSize: "14px",
            }}
          >
            Hình Ref
          </Text>
          <Card
            shadow="sm"
            padding="sm"
            style={{
              height: "364px",
              backgroundColor: "#EFF0F1",
            }}
            title="Hình Ref"
          >
            <Card.Section
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
            </Card.Section>
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
          </Card>
        </>
      )}
      {artistDesignRefLink && (
        <>
          {!isPreview && (
            <Text
              align="center"
              style={{
                marginBottom: "14px",
                fontWeight: 600,
                lineHeight: 1.7,
                fontSize: "14px",
              }}
            >
              Hình Ref
            </Text>
          )}

          <Card
            shadow="sm"
            padding="sm"
            style={{
              cursor: "pointer",
              height: "364px",
            }}
          >
            <Card.Section
              style={{
                position: "relative",
              }}
            >
              {!isPreview && (
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setArtistDesignRefLink("");
                  }}
                >
                  <IconX color="rgb(102, 102, 102)" />
                </div>
              )}
            </Card.Section>
            <Card.Section>
              <LazyLoad height={250} once={true}>
                <Image
                  src={artistDesignRefLink || "/images/content/not_found_2.jpg"}
                  h={250}
                  alt="No way!"
                  fit="contain"
                />
              </LazyLoad>
            </Card.Section>
          </Card>
        </>
      )}
    </>
  );
};

export default ArtistRef;
