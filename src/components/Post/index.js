import {
  ActionIcon,
  Badge,
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
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { filter, find, findIndex, includes, isEmpty, map } from "lodash";
import {
  IconCircleCheck,
  IconCircleDashed,
  IconChevronRight,
  IconChevronLeft,
  IconExternalLink,
  IconPlus,
  IconCopy,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import Captions from "../Captions";
import { CONVERT_NUMBER_TO_STATUS } from "../../utils";
import { CTA_LINK } from "../../constant";
import { postService } from "../../services";

const Ads = ({
  sku,
  type,
  postId,
  addCta,
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
  allProductBases,
  postErrors,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const textInputRef = useRef(null);
  const [selectedAds, setSelectedAds] = useState({});
  const [isAddCTA, setIsAddCTA] = useState(addCta);
  const [isClickOnCTA, setIsClickOnCTA] = useState(false);
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
  const handleUpdatePostCTA = async () => {
    const payload = {
      addCta: true,
    };
    const updatePostCTAResponse = await postService.updatePost(uid, payload);
    if (updatePostCTAResponse) {
      setIsAddCTA(true);
    }
  };
  useEffect(() => {
    setIsAddCTA(addCta);
  }, [addCta]);
  useEffect(() => {
    if (find(postErrors, { adsId: uid })?.message && textInputRef.current) {
      textInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [postErrors]);
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
                  size="sm"
                  ref={textInputRef}
                  value={
                    find(postPayloads, {
                      uid,
                    })?.name || null
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
                    error: {},
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
                  error={find(postErrors, { adsId: uid })?.message}
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
                  span={type === "image" || !type ? 1 : 3}
                  style={{
                    height: "80%",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    {type === "image" || !type ? "Hình" : "Video"} Ads
                  </div>
                  {type === "video" ? (
                    <video
                      width="100%"
                      height="200px"
                      controls
                      id="video"
                      style={{
                        display: "block",
                      }}
                      autoPlay
                      muted
                    >
                      <source
                        src={
                          find(postPayloads, { uid })?.videoLink ||
                          "/images/content/not_found_2.jpg"
                        }
                        type="video/mp4"
                      />
                    </video>
                  ) : (
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
                  )}
                </Grid.Col>
                <Grid.Col span={type === "image" || !type ? 11 : 9}>
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
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <Group
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <TextInput
                          placeholder="https://pawfecthouse.com/TOY-001"
                          label="CTA Link"
                          value={find(postPayloads, { uid })?.ctaLink || ""}
                          style={{
                            flex: 1,
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
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                          }}
                        >
                          <ActionIcon
                            component="a"
                            href={`https://pawfecthouse.com/${sku}`}
                            size="lg"
                            aria-label="Open in a new tab"
                            onClick={() => {}}
                            target="_blank"
                          >
                            <IconExternalLink />
                          </ActionIcon>
                          <CopyButton value={`https://pawfecthouse.com/${sku}`}>
                            {({ copied, copy }) => (
                              <ActionIcon
                                color={copied ? "teal" : "blue"}
                                onClick={copy}
                                size="lg"
                              >
                                <IconCopy />
                              </ActionIcon>
                            )}
                          </CopyButton>
                        </div>
                      </Group>
                      {type === "video" && (
                        <Textarea
                          label="CTA Description"
                          styles={{
                            root: {
                              width: "100%",
                            },
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
                          autosize
                          placeholder="Content"
                          value={
                            find(postPayloads, { uid })?.ctaDescription || ""
                          }
                          onChange={(event) => {
                            setPostPayloads((prev) => {
                              return map(prev, (x) => {
                                if (x.uid === uid) {
                                  return {
                                    ...x,
                                    ctaDescription: event.target.value,
                                  };
                                }
                                return x;
                              });
                            });
                          }}
                          minRows={4}
                          maxRows={4}
                        />
                      )}
                      {postId && (
                        <Group
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "flex-end",
                          }}
                        >
                          <TextInput
                            label="Post ID"
                            value={postId}
                            readOnly
                            style={{
                              flex: 1,
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
                          />
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                            }}
                          >
                            <ActionIcon
                              component="a"
                              href={`https://facebook.com/${postId}`}
                              size="lg"
                              aria-label="Open in a new tab"
                              onClick={() => {}}
                              target="_blank"
                            >
                              <IconExternalLink />
                            </ActionIcon>
                            <CopyButton value={postId}>
                              {({ copied, copy }) => (
                                <ActionIcon
                                  color={copied ? "teal" : "blue"}
                                  onClick={copy}
                                  size="lg"
                                >
                                  <IconCopy />
                                </ActionIcon>
                              )}
                            </CopyButton>
                          </div>
                        </Group>
                      )}
                      {postId && (
                        <Group
                          style={{
                            width: "100%",
                            justifyContent: "flex-end",
                          }}
                        >
                          {isAddCTA ? (
                            <Button variant="filled" color="lime" radius="sm">
                              Đã gắn CTA
                            </Button>
                          ) : (
                            <Group justify="center">
                              {isClickOnCTA ? (
                                <Button
                                  color="green"
                                  variant="filled"
                                  radius="sm"
                                  onClick={handleUpdatePostCTA}
                                >
                                  Confirm
                                </Button>
                              ) : (
                                <Button
                                  variant="filled"
                                  color="#646A73"
                                  radius="sm"
                                  onClick={() => {
                                    // redirect to CTA link
                                    setIsClickOnCTA(true);
                                    window.open(CTA_LINK, "_blank");
                                  }}
                                >
                                  Gắn CTA
                                </Button>
                              )}
                            </Group>
                          )}
                        </Group>
                      )}
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
          allProductBases={allProductBases}
        />
      </Modal>
    </>
  );
};

const ModalPreview = ({ opened, close, ads, briefId }) => {
  const [selectedAds, setSelectedAds] = useState(ads[0]);
  useEffect(() => {
    const firstAds = find(ads, { briefId });
    setSelectedAds(firstAds);
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
  value,
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
  allProductBases,
  postErrors,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [chooseFanpage, setChooseFanpage] = useState(selectedFanpage);
  useEffect(() => {
    setChooseFanpage(selectedFanpage);
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
  let valueColor = null;
  switch (value?.rnd) {
    case 1:
      valueColor = "#cfcfcf";
      break;
    case 2:
      valueColor = "yellow";
      break;
    case 3:
      valueColor = "green";
      break;
    case 4:
      valueColor = "#38761C";
      break;
    default:
      break;
  }
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
            <Flex gap={30} align="center">
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
                value={
                  !isEmpty(chooseFanpage?.name) ? chooseFanpage?.name : null
                }
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
              <Text>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Value
                </span>
                :{" "}
                {
                  <Badge color={valueColor} variant="filled">
                    {CONVERT_NUMBER_TO_STATUS[value?.rnd]}
                  </Badge>
                }
              </Text>
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
            {map(
              filter(ads, (ad) => includes(map(postPayloads, "uid"), ad?.uid)),
              (x, index) => (
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
                  allProductBases={allProductBases}
                  postErrors={postErrors}
                />
              )
            )}
          </Stack>
        </Checkbox.Group>
      </Grid>
      <ModalPreview
        opened={opened}
        close={close}
        ads={postPayloads}
        briefId={uid}
      />
    </>
  );
};

export default PostCamp;
