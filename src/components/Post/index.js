import {
  ActionIcon,
  Button,
  Checkbox,
  CopyButton,
  Flex,
  Grid,
  Group,
  Image,
  List,
  Modal,
  rem,
  Select,
  Stack,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import styles from "./PostCamp.module.sass";
import { filter, find, findIndex, includes, isEmpty, map } from "lodash";
import {
  IconCircleCheck,
  IconCircleDashed,
  IconChevronRight,
  IconChevronLeft,
  IconExternalLink,
  IconPlus,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Captions from "../Captions";

const Ads = ({
  sku,
  postId,
  captions,
  setQueryCaption,
  handlePageChangeCaption,
  captionsPagination,
  setSelectedValue,
  selectedValue,
  setPostPayloads,
  postPayloads,
  uid,
  index,
  choosePosts,
  setChoosePosts,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedAds, setSelectedAds] = useState({});
  const handleChooseCaption = (caption) => {
    if (isEmpty(caption)) return;
    setPostPayloads((prev) => {
      return map(prev, (x) => {
        if (x.uid === selectedAds) {
          return {
            ...x,
            caption: caption.content,
          };
        }
        return x;
      });
    });
  };

  return (
    <>
      <Checkbox.Card
        radius="md"
        value={uid}
        key={uid}
        style={{
          padding: "10px",
          ...(includes(choosePosts, uid) &&
            !postId && {
              backgroundColor: "#ffecd2",
            }),
        }}
      >
        <Checkbox.Indicator
          onClick={() => {
            if (postId) {
              return;
            }
            if (includes(choosePosts, uid)) {
              setChoosePosts(filter(choosePosts, (x) => x !== uid));
            } else {
              setChoosePosts([...choosePosts, uid]);
            }
          }}
          disabled={!!postId}
        />
        <Grid.Col
          span={12}
          style={{
            marginTop: "10px",
            padding: "10px",
          }}
        >
          <Flex
            direction="column"
            gap={10}
            style={{
              width: "100%",
            }}
          >
            <Flex
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              <span
                style={{
                  padding: "10px",
                  backgroundColor: "#E0EAFF",
                  borderRadius: "5px",
                }}
              >
                <TextInput
                  placeholder="CB-M0508 - M0001 - Test1"
                  size="sm"
                  value={
                    find(postPayloads, {
                      uid,
                    })?.name || ""
                  }
                  label={`Ad${index + 1}: `}
                  styles={{
                    root: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    },
                    label: {
                      fontWeight: "bold",
                    },
                  }}
                  onChange={(e) => {
                    setPostPayloads((prev) => {
                      const index = prev.findIndex((x) => x.uid === uid);
                      if (index === -1) {
                        return [
                          ...prev,
                          {
                            uid,
                            name: e.target.value,
                          },
                        ];
                      }
                      prev[index].name = e.target.value;
                      return [...prev];
                    });
                  }}
                />
              </span>
            </Flex>
            <Flex
              style={{
                marginLeft: "20px",
              }}
            >
              <Grid
                style={{
                  width: "100%",
                }}
              >
                <Grid.Col
                  span={1}
                  style={{
                    height: "80%",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    Hình Ads
                  </div>
                  <Image
                    src={
                      find(postPayloads, { uid })?.image ||
                      "/images/content/not_found_2.jpg"
                    }
                    alt="Post-Camp"
                    height="100%"
                    fit="contain"
                    radius="md"
                  />
                </Grid.Col>
                <Grid.Col span={11}>
                  <Flex gap={20} wrap={true}>
                    <Textarea
                      label="Nội dung"
                      styles={{
                        label: {
                          marginBottom: "5px",
                          fontWeight: "bold",
                        },
                        input: {
                          width: "100%",
                          height: "100px",
                        },
                      }}
                      style={{
                        flexGrow: 1,
                      }}
                      rightSection={
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          onClick={() => {
                            setSelectedAds(uid);
                            open();
                          }}
                        >
                          <IconPlus
                            style={{ width: "70%", height: "70%" }}
                            stroke={1.5}
                          />
                        </ActionIcon>
                      }
                      autosize
                      placeholder="Content"
                      value={find(postPayloads, { uid })?.caption || ""}
                      onChange={(event) => {
                        setPostPayloads((prev) => {
                          return map(prev, (x) => {
                            if (x.uid === uid) {
                              return {
                                ...x,
                                caption: event.target.value,
                              };
                            }
                            return x;
                          });
                        });
                      }}
                      minRows={8}
                      maxRows={8}
                    />

                    <Group
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <Group
                        style={{
                          width: "100%",
                        }}
                      >
                        <TextInput
                          placeholder="https://pawfecthouse.com/TOY-001"
                          label="CTA Link"
                          value={find(postPayloads, { uid })?.ctaLink || ""}
                          style={{
                            width: "100%",
                          }}
                          styles={{
                            label: {
                              fontSize: "16px",
                              fontWeight: "bold",
                              marginBottom: "10px",
                            },
                            input: {
                              width: "100%",
                            },
                          }}
                          onChange={(e) => {
                            setPostPayloads((prev) => {
                              const index = prev.findIndex(
                                (x) => x.uid === uid
                              );
                              if (index === -1) {
                                return [
                                  ...prev,
                                  {
                                    uid,
                                    ctaLink: e.target.value,
                                  },
                                ];
                              }
                              prev[index].ctaLink = e.target.value;
                              return [...prev];
                            });
                          }}
                        />
                      </Group>

                      <Group
                        style={{
                          width: "100%",
                          justifyContent: "flex-end",
                        }}
                      >
                        <ActionIcon
                          component="a"
                          href={`https://pawfecthouse.com/${sku}`}
                          size="xl"
                          aria-label="Open in a new tab"
                          onClick={() => {}}
                          target="_blank"
                        >
                          <IconExternalLink />
                        </ActionIcon>
                        {postId && (
                          <CopyButton value={postId}>
                            {({ copied, copy }) => (
                              <Button
                                color={copied ? "teal" : "blue"}
                                onClick={copy}
                              >
                                {copied ? "Copied Post ID" : "Copy Post ID"}
                              </Button>
                            )}
                          </CopyButton>
                        )}

                        <Button variant="filled" color="#646A73" radius="sm">
                          Gắn CTA
                        </Button>
                      </Group>
                    </Group>
                  </Flex>
                </Grid.Col>
              </Grid>
            </Flex>
          </Flex>
        </Grid.Col>
      </Checkbox.Card>

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
        <Captions
          captions={captions}
          setQueryCaption={setQueryCaption}
          handlePageChangeCaption={handlePageChangeCaption}
          captionsPagination={captionsPagination}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          handleChooseCaption={handleChooseCaption}
          closeModalChooseCaption={close}
        />
      </Modal>
    </>
  );
};

const ModalPreview = ({ opened, close, ads }) => {
  const [selectedAds, setSelectedAds] = useState(ads[0]);
  useEffect(() => {
    setSelectedAds(ads[0]);
  }, [ads]);
  const handleChangeNextSlide = (uid) => {
    const findCurrentIndex = findIndex(ads, { uid });
    let ad;
    if (findCurrentIndex === ads.length - 1) {
      ad = ads[0];
      setSelectedAds(ad);
    } else {
      ad = ads[findCurrentIndex + 1];
      setSelectedAds(ad);
    }
  };

  const handleChangePreviousSlide = (uid) => {
    const findCurrentIndex = findIndex(ads, { uid });
    let ad;
    if (findCurrentIndex === 0) {
      ad = ads[ads.length - 1];
      setSelectedAds(ad);
    } else {
      ad = ads[ads - 1];
      setSelectedAds(ad);
    }
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
      size="60%"
      title={`${findIndex(ads, { uid: selectedAds?.uid }) + 1}/${ads.length}`}
      styles={{
        header: {
          position: "relative",
        },
        title: {
          position: "absolute",
          left: "50%",
        },
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "17%",
          borderRadius: "50%",
          height: "50px",
          width: "50px",
          cursor: "pointer",
        }}
        onClick={() => {
          handleChangePreviousSlide(selectedAds?.uid);
        }}
      >
        <IconChevronLeft size={48} color="#228be6" />
      </span>
      <Grid>
        <Grid.Col
          span={7}
          style={{
            backgroundColor: "#F6F7F7",
            paddingTop: "20px",
            borderRadius: "10px",
          }}
        >
          <Flex
            direction="column"
            gap={40}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <Flex
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
              }}
            >
              <span
                style={{
                  padding: "5px",
                  backgroundColor: "#E0EAFF",
                  borderRadius: "5px",
                  width: "100%",
                }}
              >
                Ad1: {selectedAds?.sku}
              </span>
            </Flex>
            <Flex gap={30} direction="column">
              <Textarea
                value={selectedAds?.caption || ""}
                autosize
                minRows={6}
                maxRows={8}
                readOnly
              />
              <Image
                radius="md"
                src={selectedAds?.image || "/images/content/not_found_2.jpg"}
                height="80%"
                fit="contain"
                style={{
                  cursor: "pointer",
                  margin: "auto",
                  width: "90%",
                  position: "relative",
                  height: " 200px",
                  top: "-80px",
                }}
              />
            </Flex>
          </Flex>
        </Grid.Col>
        <Grid.Col
          span={5}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "#EFF0F1",
            paddingTop: "20px",
          }}
        >
          <Flex direction="column" gap={20}>
            {" "}
            <div>Target</div>
            <List
              spacing="sm"
              size="sm"
              center
              style={{
                marginLeft: "20px",
              }}
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck
                    style={{ width: rem(16), height: rem(16) }}
                  />
                </ThemeIcon>
              }
            >
              <List.Item>Clone or download repository from GitHub</List.Item>
              <List.Item>Install dependencies with yarn</List.Item>
              <List.Item>
                To start development server run npm start command
              </List.Item>
              <List.Item>
                Run tests to make sure your changes do not break the build
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <IconCircleDashed
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                Submit a pull request once you are done
              </List.Item>
            </List>
          </Flex>
        </Grid.Col>
      </Grid>
      <span
        style={{
          position: "absolute",
          top: "50%",
          right: "17%",
          borderRadius: "50%",
          height: "50px",
          width: "50px",
          cursor: "pointer",
        }}
        onClick={() => {
          handleChangeNextSlide(selectedAds?.uid);
        }}
      >
        <IconChevronRight size={48} color="#228be6" />
      </span>
    </Modal>
  );
};

const PostCamp = ({
  rndTeam,
  sku,
  batch,
  ads,
  postPayloads,
  setPostPayloads,
  selectedFanpage,
  fanpages,
  designInfo,
  choosePosts,
  setChoosePosts,
  uid,
  captions,
  setQueryCaption,
  handlePageChangeCaption,
  captionsPagination,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [chooseFanpage, setChooseFanpage] = useState(selectedFanpage);

  useEffect(() => {
    if (!isEmpty(selectedFanpage)) {
      setChooseFanpage(selectedFanpage);
    }
  }, [selectedFanpage]);

  useEffect(() => {
    setPostPayloads((prev) => {
      return map(prev, (x) => {
        if (x.briefId === uid) {
          return {
            ...x,
            pageId: chooseFanpage?.uid || "",
          };
        }
        return x;
      });
    });
  }, [chooseFanpage]);

  return (
    <>
      <Grid
        style={{
          backgroundColor: "#F6F7F7",
          padding: "10px",
        }}
      >
        <Grid.Col
          span={1}
          style={{
            height: "100px",
            padding: "10px",
            backgroundColor: "#E0EAFF",
          }}
        >
          <Image
            src={designInfo?.thumbLink || "/images/content/not_found_2.jpg"}
            alt="Post-Camp"
            height="100%"
            fit="contain"
            radius="md"
          />
        </Grid.Col>
        <Grid.Col
          span={11}
          style={{
            height: "100px",
            padding: "10px",
            backgroundColor: "#E0EAFF",
          }}
          wrap={true}
        >
          <Flex
            direction="column"
            gap={10}
            style={{
              height: "100%",
            }}
          >
            <Flex
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
              }}
            >
              {rndTeam} - {sku} - {batch}
            </Flex>
            <Flex gap={30}>
              <Select
                label="Page"
                placeholder="Choose page"
                data={map(fanpages, "name")}
                styles={{
                  label: {
                    fontSize: "16px",
                    fontWeight: "bold",
                  },
                  root: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  },
                }}
                value={chooseFanpage?.name}
                clearable
                onChange={(value) => {
                  setChooseFanpage(find(fanpages, { name: value }));
                }}
                onClear={() => {
                  setPostPayloads((prev) => {
                    return map(prev, (x) => {
                      return {
                        ...x,
                        pageId: selectedFanpage?.uid,
                      };
                    });
                  });
                }}
              />
            </Flex>
          </Flex>
        </Grid.Col>
        <Checkbox.Group
          value={choosePosts}
          style={{
            width: "100%",
          }}
        >
          <Stack pt="md" gap="xs">
            {map(ads, (x, index) => (
              <Ads
                {...x}
                sku={sku}
                batch={batch}
                captions={captions}
                setQueryCaption={setQueryCaption}
                handlePageChangeCaption={handlePageChangeCaption}
                captionsPagination={captionsPagination}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                setPostPayloads={setPostPayloads}
                postPayloads={postPayloads}
                closeModalChooseCaption={close}
                index={index}
                choosePosts={choosePosts}
                setChoosePosts={setChoosePosts}
              />
            ))}
          </Stack>
        </Checkbox.Group>

        <Group
          style={{
            marginTop: "30px",
            width: "100%",
            marginBottom: "20px",
            marginRight: "20px",
          }}
        >
          <Flex
            gap={20}
            justify="flex-end"
            style={{
              width: "100%",
            }}
          >
            <Button variant="filled" color="#646A73" radius="sm" onClick={open}>
              Preview
            </Button>
          </Flex>
        </Group>
      </Grid>
      <ModalPreview opened={opened} close={close} ads={postPayloads} />
    </>
  );
};

export default PostCamp;
