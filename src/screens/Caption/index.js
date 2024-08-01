import {
  Accordion,
  ActionIcon,
  Avatar,
  Button,
  Chip,
  Fieldset,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Pagination,
  Tabs,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Card as MantineCard,
  Modal,
  Tooltip,
} from "@mantine/core";
import styles from "./Caption.module.sass";
import cn from "classnames";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { isEmpty, map } from "lodash";
import { captionServices, rndServices } from "../../services";
import ProductBase from "./ProductBase";
import { showNotification } from "../../utils/index";
import { IconX, IconFilterOff, IconSearch } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
function AccordionLabel({ label, image, description }) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} radius="xl" size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" c="dimmed" fw={400}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

const ListCaptions = ({
  captions,
  handleUpdateCaption,
  handleRemoveCaption,
  setQueryCaption,
  productLines,
  selectedProductLines,
  setSelectedProductLines,
  fetchProductLinesLoading,
  setQueryProductLines,
  pagination,
  handlePageChange,
  setProductBasePagination,
}) => {
  const [data, setData] = useState(captions);
  const [searchCaption, setSearchCaption] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCaption, setSelectedCaption] = useState({});
  useEffect(() => {
    setData(captions);
  }, [captions]);
  const openModal = (caption) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleRemoveCaption(caption),
    });
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 5px",
          flexWrap: "wrap-reverse",
          backgroundColor: "#EFF0F1",
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      >
        <Flex
          style={{
            gap: "8px",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "#EFF0F1",
          }}
        >
          <TextInput
            placeholder="Keyword ..."
            size="sm"
            leftSection={
              <span
                onClick={() => {
                  setQueryCaption({
                    keyword: searchCaption,
                  });
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <IconSearch size={16} />
              </span>
            }
            styles={{
              input: {
                width: "300px",
              },
            }}
            value={searchCaption}
            onChange={(e) => setSearchCaption(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setQueryCaption({
                  keyword: searchCaption,
                });
              }
            }}
          />
          <Button
            onClick={() => {
              setSearchCaption("");
              setQueryCaption({
                keyword: "",
              });
            }}
          >
            <IconFilterOff />
          </Button>
        </Flex>
      </div>
      <Grid>
        {map(data, (caption) => (
          <Grid.Col span={4} key={caption.id}>
            <Fieldset
              legend="Thông tin"
              style={{
                display: "flex",
                gap: "10px",
                position: "relative",
              }}
            >
              <Flex
                style={{
                  position: "absolute",
                  top: "-24px",
                  right: "10px",
                  gap: "10px",
                }}
              >
                <Chip
                  checked={caption.checked}
                  onChange={() => {
                    setData((prev) => {
                      return map(prev, (x) => {
                        if (x.uid === caption.uid) {
                          return {
                            ...x,
                            checked: !x.checked,
                          };
                        }
                        return x;
                      });
                    });
                    handleUpdateCaption(caption);
                  }}
                  color="red"
                  variant="filled"
                >
                  Update
                </Chip>
                <ActionIcon
                  variant="filled"
                  aria-label="Settings"
                  onClick={() => {
                    openModal(caption);
                  }}
                  color="red"
                >
                  <IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
                </ActionIcon>
              </Flex>

              <Grid
                style={{
                  width: "100%",
                }}
              >
                <Grid.Col span={12}>
                  <Flex direction="column" gap="md">
                    <TextInput
                      label="Tên Caption"
                      placeholder="Tên Caption"
                      value={caption.name}
                      styles={{
                        label: {
                          marginBottom: "5px",
                        },
                      }}
                      onChange={(event) => {
                        setData((prev) => {
                          return map(prev, (x) => {
                            if (x.uid === caption.uid) {
                              return {
                                ...x,
                                name: event.currentTarget.value,
                              };
                            }
                            return x;
                          });
                        });
                      }}
                    />
                    <Textarea
                      label="Nội dung"
                      styles={{
                        label: {
                          marginBottom: "5px",
                        },
                        input: {
                          height: "116px",
                        },
                      }}
                      autosize
                      placeholder="Content"
                      value={caption.content}
                      onChange={(event) => {
                        setData((prev) => {
                          return map(prev, (x) => {
                            if (x.uid === caption.uid) {
                              return {
                                ...x,
                                content: event.currentTarget.value,
                              };
                            }
                            return x;
                          });
                        });
                      }}
                      minRows={10}
                      maxRows={10}
                    />
                    <TagsInput
                      label="Tags"
                      data={caption.tags}
                      value={caption.tags}
                      onChange={(value) => {
                        setData((prev) => {
                          return map(prev, (x) => {
                            if (x.uid === caption.uid) {
                              return {
                                ...x,
                                tags: value,
                              };
                            }
                            return x;
                          });
                        });
                      }}
                      placeholder="Tags"
                      splitChars={[",", " ", "|", "\r\n", "\n"]}
                      clearable
                      styles={{
                        label: {
                          marginBottom: "5px",
                        },
                      }}
                    />
                  </Flex>
                </Grid.Col>

                <Tooltip label="Chọn Product Base">
                  <Grid.Col span={12}>
                    <MantineCard
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                    >
                      <MantineCard.Section
                        onClick={() => {
                          setProductBasePagination({
                            currentPage: 1,
                            totalPages: 1,
                          });
                          setSelectedCaption(caption);
                          setSelectedProductLines([caption.productLineInfo]);
                          open();
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <Image
                          src={
                            caption.productLineInfo.imageSrc ||
                            "/images/content/not_found_2.jpg"
                          }
                          height={160}
                          alt="Norway"
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      </MantineCard.Section>
                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>{caption.productLineInfo.name}</Text>
                      </Group>
                    </MantineCard>
                  </Grid.Col>
                </Tooltip>
              </Grid>
            </Fieldset>
          </Grid.Col>
        ))}
      </Grid>
      <Modal
        onClose={() => {
          if (
            selectedCaption.productLineInfo?.uid !==
            selectedProductLines[0]?.uid
          ) {
            handleUpdateCaption(selectedCaption);
          }
          setProductBasePagination({
            currentPage: 1,
            totalPages: 1,
          });
          setQueryProductLines({
            keyword: "",
          });
          close();
        }}
        opened={opened}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="md"
        size="1000px"
      >
        <ProductBase
          productLines={productLines}
          selectedProductLines={selectedProductLines}
          setSelectedProductLines={setSelectedProductLines}
          fetchProductLinesLoading={fetchProductLinesLoading}
          pagination={pagination}
          handlePageChange={handlePageChange}
          setQueryProductLines={setQueryProductLines}
          title="Chọn Product Base"
        />{" "}
      </Modal>
    </>
  );
};

const Caption = () => {
  const charactersList = [
    {
      id: "bender",
      image:
        "https://www.feedough.com/wp-content/uploads/2020/07/PRODUCT-LINE-768x429.webp",
      label: "Product Line",
    },
  ];

  const [captionInfo, setCaptionInfo] = useState({
    name: "",
    content: "",
    tags: [],
  });
  const [productBasePagination, setProductBasePagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [captionsPagination, setCaptionsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [productBases, setProductBases] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [queryCaption, setQueryCaption] = useState("");
  const [loadingCaption, setLoadingCaption] = useState(false);
  const [queryProductBase, setQueryProductBase] = useState("");
  const [loadingProductBase, setLoadingProductBase] = useState(false);
  const [loadingCreateCaption, setLoadingCreateCaption] = useState(false);
  const [selectedProductBases, setSelectedProductBases] = useState([]);

  const fetchProductBases = async (page) => {
    setLoadingProductBase(true);
    const { data, metadata } = await rndServices.fetchProductLines({
      limit: 12,
      page,
      query: queryProductBase,
    });
    if (isEmpty(data)) {
      setLoadingProductBase(false);
      setProductBases([]);
      setProductBasePagination({
        currentPage: 1,
        totalPages: 1,
      });
      return;
    }
    setLoadingProductBase(false);
    setProductBases(data || []);
    setProductBasePagination(metadata);
    return;
  };
  const fetchCaptions = async (page) => {
    setLoadingCaption(true);
    const { data, metadata } = await captionServices.fetchCaptions({
      limit: 3,
      page,
      query: queryCaption,
    });
    if (isEmpty(data)) {
      setLoadingCaption(false);
      setCaptions([]);
      setCaptionsPagination({
        currentPage: 1,
        totalPages: 1,
      });
      return;
    }
    setLoadingCaption(false);
    setCaptions(
      map(data, (x) => ({
        ...x,
        checked: false,
      })) || []
    );
    setCaptionsPagination(metadata);
    return;
  };
  useEffect(() => {
    fetchProductBases(productBasePagination.currentPage);
  }, [productBasePagination.currentPage, queryProductBase]);
  useEffect(() => {
    fetchCaptions(captionsPagination.currentPage);
  }, [captionsPagination.currentPage, queryCaption]);
  const handlePageChange = (page) => {
    setProductBasePagination((prev) => ({ ...prev, currentPage: page }));
  };
  const handlePageChangeCaption = (page) => {
    setCaptionsPagination((prev) => ({ ...prev, currentPage: page }));
  };
  const items = charactersList.map((item) => (
    <Accordion.Item
      value={item.id}
      key={item.label}
      onClick={() => {
        fetchProductBases(1);
      }}
    >
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>
        <ProductBase
          productLines={productBases}
          selectedProductLines={selectedProductBases}
          setSelectedProductLines={setSelectedProductBases}
          fetchProductLinesLoading={loadingProductBase}
          pagination={productBasePagination}
          handlePageChange={handlePageChange}
          setQueryProductLines={setQueryProductBase}
          title="Chọn Product Base"
        />
      </Accordion.Panel>
    </Accordion.Item>
  ));
  const handleCreateCaption = async () => {
    setLoadingCreateCaption(true);
    if (!captionInfo.name || !captionInfo.content) {
      setLoadingCreateCaption(false);
      showNotification("Thất bại", "Vui lòng điền đầy đủ thông tin", "red");
      return;
    }
    const payload = {
      name: captionInfo.name,
      content: captionInfo.content,
      ...(!isEmpty(captionInfo.tags) && { tags: captionInfo.tags }),
      ...(!isEmpty(selectedProductBases) && {
        productLineId: selectedProductBases[0]?.uid,
      }),
    };
    const result = await captionServices.createCaption(payload);
    if (result) {
      setCaptionInfo({
        name: "",
        content: "",
      });
      setSelectedProductBases([]);
      showNotification("Thành công", "Tạo caption thành công", "green");
      await fetchCaptions(captionsPagination.currentPage);
    }
    setLoadingCreateCaption(false);
  };
  const handleRemoveCaption = async (caption) => {
    await captionServices.removeCaption(caption.uid);
    await fetchCaptions(captionsPagination.currentPage);
  };
  const handleUpdateCaption = async (caption) => {
    const result = await captionServices.createCaption({
      ...caption,
      id: caption.uid,
      ...(!isEmpty(selectedProductBases) &&
        caption?.productLineInfo?.uid !== selectedProductBases[0]?.uid && {
          productLineId: selectedProductBases[0]?.uid,
        }),
    });
    if (result) {
      setSelectedProductBases([]);
      setQueryProductBase({
        keyword: "",
      });
      setProductBasePagination({
        currentPage: 1,
      });
      showNotification("Thành công", "Update caption thành công", "green");
    }
    await fetchCaptions(captionsPagination.currentPage);
  };
  return (
    <>
      <Tabs color="teal" defaultValue="first">
        <LoadingOverlay
          visible={loadingCreateCaption}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Tabs.List>
          <Tabs.Tab value="first">Tạo Caption</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel color="teal" value="first" pt="xs">
          <Card
            className={cn(styles.card, styles.clipArtCard)}
            title="Caption"
            classTitle="title-green"
            classCardHead={styles.classCardHead}
            classSpanTitle={styles.classScaleSpanTitle}
          >
            <Fieldset
              legend="Thông tin"
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <Grid
                style={{
                  width: "100%",
                }}
              >
                <Grid.Col span={4}>
                  <Flex direction="column" gap="md">
                    <TextInput
                      label="Tên Caption"
                      placeholder="Tên Caption"
                      value={captionInfo.name}
                      onChange={(event) => {
                        setCaptionInfo({
                          ...captionInfo,
                          name: event.currentTarget.value,
                        });
                      }}
                      styles={{
                        label: {
                          marginBottom: "5px",
                        },
                      }}
                    />
                    <TagsInput
                      label="Tags"
                      data={captionInfo.tags}
                      value={captionInfo.tags}
                      onChange={(value) => {
                        setCaptionInfo({
                          ...captionInfo,
                          tags: value,
                        });
                      }}
                      placeholder="Tags"
                      splitChars={[",", " ", "|", "\r\n", "\n"]}
                      clearable
                      styles={{
                        label: {
                          marginBottom: "5px",
                        },
                      }}
                    />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Textarea
                    label="Nội dung"
                    styles={{
                      label: {
                        marginBottom: "5px",
                      },
                      input: {
                        height: "116px",
                      },
                    }}
                    placeholder="Content"
                    value={captionInfo.content}
                    onChange={(event) => {
                      setCaptionInfo({
                        ...captionInfo,
                        content: event.currentTarget.value,
                      });
                    }}
                    minRows={7}
                    maxRows={9}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Accordion chevronPosition="right" variant="contained">
                    {items}
                  </Accordion>
                </Grid.Col>
              </Grid>
            </Fieldset>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "flex-end",
              }}
              onClick={handleCreateCaption}
            >
              <Button>Tạo</Button>
            </div>
          </Card>
          <Card
            className={cn(styles.card, styles.clipArtCard)}
            title="Danh sách Caption"
            classTitle="title-green"
            classCardHead={styles.classCardHead}
            classSpanTitle={styles.classScaleSpanTitle}
          >
            <ListCaptions
              captions={captions}
              handleUpdateCaption={handleUpdateCaption}
              handleRemoveCaption={handleRemoveCaption}
              setQueryCaption={setQueryCaption}
              productLines={productBases}
              selectedProductLines={selectedProductBases}
              setSelectedProductLines={setSelectedProductBases}
              fetchProductLinesLoading={loadingProductBase}
              setQueryProductLines={setQueryProductBase}
              pagination={productBasePagination}
              handlePageChange={handlePageChange}
              title="Chọn Product Base"
              setProductBasePagination={setProductBasePagination}
            />
            <Pagination
              total={captionsPagination.totalPages}
              page={captionsPagination.currentPage}
              onChange={handlePageChangeCaption}
              color="pink"
              size="md"
              style={{ marginTop: "20px", marginLeft: "auto" }}
            />
          </Card>
        </Tabs.Panel>

        <Tabs.Panel color="teal" value="second" pt="xs">
          <Accordion chevronPosition="left" variant="contained">
            {items}
          </Accordion>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Caption;
