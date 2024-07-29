import {
  Grid,
  Modal,
  ScrollArea,
  Card as MantineCard,
  Text,
  Image,
  ActionIcon,
} from "@mantine/core";
import { compact, isEmpty, map } from "lodash";
import { IconEye, IconX, IconArrowLeft } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import LazyLoad from "react-lazyload";
import { useState } from "react";

const ModalPreviewGroupClipart = ({
  opened,
  close,
  grouppedCliparts,
  setGrouppedCliparts,
}) => {
  const [
    openedModalPreviewClipart,
    { open: openModalPreviewClipart, close: closeModalPreviewClipart },
  ] = useDisclosure(false);
  const [selectedGrouppedClipart, setSelectedGrouppedClipart] = useState(null);
  const handleRemoveClipart = (uid) => {
    const newGrouppedCliparts = compact(
      map(grouppedCliparts, (grouppedClipart) => {
        if (grouppedClipart.index === selectedGrouppedClipart.index) {
          const newCliparts = grouppedClipart.cliparts.filter(
            (clipart) => clipart.uid !== uid
          );
          setSelectedGrouppedClipart({
            ...selectedGrouppedClipart,
            cliparts: newCliparts,
          });
          if (newCliparts.length === 0) {
            closeModalPreviewClipart();
            return null;
          }
          return {
            ...grouppedClipart,
            cliparts: newCliparts,
          };
        }
      })
    );
    if (isEmpty(newGrouppedCliparts)) {
      close();
    }
    setGrouppedCliparts(newGrouppedCliparts);
  };
  return (
    <>
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
            gap={5}
          >
            {map(grouppedCliparts, (clipart, index) => {
              return (
                <Grid.Col
                  span={{ sm: 5, md: 4, lg: 3 }}
                  style={{
                    position: "relative",
                  }}
                >
                  <MantineCard
                    shadow="sm"
                    padding="sm"
                    style={{
                      height: "300px",
                      width: "200px",
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
                            setSelectedGrouppedClipart(clipart);
                            openModalPreviewClipart();
                          }}
                        >
                          <IconEye size={48} color="#4E83FD" />
                        </span>
                      </div>
                      <Text
                        style={{
                          textAlign: "center",
                          marginBottom: "20px",
                        }}
                      >
                        Group {index + 1}
                      </Text>
                    </MantineCard.Section>
                  </MantineCard>
                </Grid.Col>
              );
            })}
          </Grid>
        </ScrollArea>
      </Modal>

      <Modal
        opened={openedModalPreviewClipart}
        onClose={closeModalPreviewClipart}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="md"
        size="1000px"
      >
        <div onClick={closeModalPreviewClipart}>
          <ActionIcon variant="filled" aria-label="Settings">
            <IconArrowLeft
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </div>
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
            {map(selectedGrouppedClipart?.cliparts, (clipArt, index) => (
              <Grid.Col
                span={{ sm: 5, md: 4, lg: 3 }}
                key={index}
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
                    zIndex: 99999,
                  }}
                  onClick={() => {
                    handleRemoveClipart(clipArt?.uid);
                  }}
                >
                  <IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
                </div>
                <MantineCard
                  shadow="sm"
                  padding="sm"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <MantineCard.Section>
                    <LazyLoad height={200} once={true}>
                      <Image
                        src={
                          clipArt.imageSrc || "/images/content/not_found_2.jpg"
                        }
                        h={200}
                        alt="No way!"
                        fit="contain"
                      />
                    </LazyLoad>
                  </MantineCard.Section>
                  <Text
                    fw={500}
                    size="sm"
                    mt="md"
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
                    {clipArt.name}
                  </Text>
                </MantineCard>
              </Grid.Col>
            ))}
          </Grid>
        </ScrollArea>
      </Modal>
    </>
  );
};

export default ModalPreviewGroupClipart;
