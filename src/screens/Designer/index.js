import React, { useEffect, useState } from "react";
import styles from "./TemplateKW.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Details from "./Details";
import { isEmpty, map } from "lodash";

import { useDisclosure } from "@mantine/hooks";
import {
  IconCircleCheck,
  IconCopy,
  IconCopyCheckFilled,
} from "@tabler/icons-react";
import {
  Modal,
  Pagination,
  Grid,
  Image,
  List,
  ThemeIcon,
  rem,
  Flex,
  TextInput,
  Button,
  LoadingOverlay,
  Card as MantineCard,
  CopyButton,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Editor from "../../components/Editor";
import {
  CONVERT_BRIEF_TYPE_TO_OBJECT_NAME,
  CONVERT_NUMBER_TO_STATUS,
  getStringAsEditorState,
} from "../../utils";
import { rndServices } from "../../services";
import { showNotification } from "../../utils/index";
import { IconArrowBigRightLinesFilled } from "@tabler/icons-react";
import { BRIEF_TYPES } from "../../constant";
import NewDesign from "./NewDesign";

const DesignerScreens = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [productLines, setProductLines] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const [query, setQuery] = useState({
    statusValue: "Undone",
    status: [1],
  });
  const [sorting, setSorting] = useState([]);

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSKU, setSelectedSKU] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [updateBrief, setUpdateBrief] = useState({});
  const [editingCell, setEditingCell] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [metadata, setMetadata] = useState({});
  const [linkDesign, setLinkDesign] = useState("");

  const [collectionNameInput, setCollectionNameInput] = useState("");
  const [loadingFetchBrief, setLoadingFetchBrief] = useState(false);
  const [loadingUpdateDesignLink, setLoadingUpdateDesignLink] = useState(false);

  const [collections, setCollections] = useState([]);

  const fetchCollections = async (page = 1) => {
    setLoadingFetchBrief(true);
    const response = await rndServices.fetchBriefs({
      search,
      page,
      limit: 30,
      sorting,
      ...query,
    });
    const { data, metadata } = response;
    if (data) {
      setCollections(data);
      setProductLines(
        map(data, (x, index) => {
          return {
            ...x,
            id: index + 1,
            date: moment(x.createdAt)
              .tz("Asia/Ho_Chi_Minh")
              .format("DD/MM/YYYY"),
            time: Math.floor(
              moment()
                .tz("Asia/Ho_Chi_Minh")
                .diff(moment(x.createdAt), "hours", true)
            ),
          };
        })
      );
      setPagination(metadata);
      setMetadata(metadata);
      setSelectedCollection(data[0]);
    } else {
      setCollections([]);
      setProductLines([]);
    }
    setLoadingFetchBrief(false);
    setTrigger(false);
  };
  const fetchUsers = async () => {
    const { data } = await rndServices.getUsers({
      limit: -1,
    });
    setUsers(data);
  };
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    fetchCollections(pagination.currentPage);
  }, [search, pagination.currentPage, query, trigger, sorting]);

  useEffect(() => {
    // Update the URL when search or page changes
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, pagination.currentPage, navigate]);

  useEffect(() => {
    if (selectedCollection) {
      setCollectionNameInput(selectedCollection.name);
    }
  }, [selectedCollection]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateLinkDesign = async (uid) => {
    setLoadingUpdateDesignLink(true);
    if (!linkDesign) {
      showNotification("Thất bại", "Link Design không được để trống", "red");
      setLoadingUpdateDesignLink(false);
      return;
    }
    const urlPattern =
      /^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[\w-]*)?$/i;
    if (!urlPattern.test(linkDesign)) {
      showNotification("Thất bại", "Link Design không hợp lệ", "red");
      setLoadingUpdateDesignLink(false);
      return;
    }
    if (linkDesign) {
      const updateResponse = await rndServices.updateBrief({
        uid,
        data: {
          linkDesign,
        },
      });
      if (updateResponse) {
        showNotification(
          "Thành công",
          "Update Link Design thành công",
          "green"
        );
        await fetchCollections(pagination.currentPage);
      }
    }
    close();
    setLoadingUpdateDesignLink(false);
  };
  return (
    <>
      <Card
        className={styles.card}
        title="DESIGNER TASK"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
        head={
          <>
            <Flex
              style={{
                gap: "30px",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#EFF0F1",
              }}
              justify="end"
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Undone: {metadata?.totalUndoneBriefs}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Time to done: {metadata?.totalTimeToDoneBriefs}h
              </div>
            </Flex>
          </>
        }
      >
        <Details
          className={styles.details}
          onClose={() => setVisible(false)}
          productLines={productLines}
          name={selectedCollection?.name}
          query={query}
          setQuery={setQuery}
          setSelectedSKU={setSelectedSKU}
          openModal={open}
          users={users}
          setUpdateBrief={setUpdateBrief}
          updateBrief={updateBrief}
          setEditingCell={setEditingCell}
          editingCell={editingCell}
          loadingFetchBrief={loadingFetchBrief}
          setLoadingFetchBrief={setLoadingFetchBrief}
          setTrigger={setTrigger}
          setLinkDesign={setLinkDesign}
          setSorting={setSorting}
          sorting={sorting}
        />
      </Card>
      <Pagination
        total={pagination.totalPages}
        page={pagination.currentPage}
        onChange={handlePageChange}
        color="pink"
        size="md"
        style={{ marginTop: "20px", marginLeft: "auto" }}
      />
      {selectedSKU && selectedSKU?.briefType !== BRIEF_TYPES[3] && (
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
                {selectedSKU?.briefType} - từ {selectedSKU?.skuRef}
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
                {selectedSKU?.sku} - {selectedSKU?.batch}
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
                Value: {CONVERT_NUMBER_TO_STATUS[selectedSKU?.value?.rnd]} -{" "}
                Size: {CONVERT_NUMBER_TO_STATUS[selectedSKU?.size?.rnd]}
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
            <Grid.Col span={5}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "5px",
                  fontSize: "18px",
                  alignItems: "center",
                }}
              >
                REF
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
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                {selectedSKU?.linkProductRef && (
                  <List.Item>
                    Link Product:{" "}
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
                      rel="noopener noreferrer"
                    >
                      {selectedSKU?.linkProductRef}
                    </a>
                  </List.Item>
                )}
                {selectedSKU?.designLinkRef && (
                  <List.Item>
                    Link Design:{" "}
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
                      href={selectedSKU?.designLinkRef}
                      target="_blank"
                    >
                      {selectedSKU?.designLinkRef}
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
              {selectedSKU?.briefType === BRIEF_TYPES[0] ||
              selectedSKU?.briefType === BRIEF_TYPES[1] ||
              (selectedSKU?.briefType === BRIEF_TYPES[2] &&
                selectedSKU?.clipart.name) ? (
                <>
                  <Image
                    radius="md"
                    src={
                      selectedSKU[
                        CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[
                          selectedSKU?.briefType
                        ]
                      ]?.image || "/images/content/not_found_2.jpg"
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
                    {
                      selectedSKU[
                        CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[
                          selectedSKU?.briefType
                        ]
                      ]?.name
                    }
                  </div>
                </>
              ) : null}
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
                {selectedSKU[
                  CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[selectedSKU?.briefType]
                ]?.refLink && (
                  <List.Item>
                    Link Mockup:{" "}
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
                      href={
                        selectedSKU[
                          CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[
                            selectedSKU?.briefType
                          ]
                        ]?.refLink
                      }
                      target="_blank"
                    >
                      {
                        selectedSKU[
                          CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[
                            selectedSKU?.briefType
                          ]
                        ]?.refLink
                      }
                    </a>
                  </List.Item>
                )}
              </List>
              {selectedSKU?.briefType === BRIEF_TYPES[2] && (
                <MantineCard
                  shadow="sm"
                  padding="sm"
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    marginTop: "10px",
                  }}
                >
                  <MantineCard.Section>
                    <div
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "200px",
                        padding: "10px",
                        position: "relative",
                      }}
                    >
                      {selectedSKU?.niche?.quote}
                      {true && (
                        <>
                          <div
                            style={{
                              padding: "5px",
                              position: "absolute",
                              bottom: "10px",
                              right: "13px",
                              borderRadius: "50%",
                              zIndex: 2,
                            }}
                          >
                            <CopyButton value={selectedSKU?.niche?.quote} color>
                              {({ copied, copy }) => (
                                <Button color="#62D256" onClick={copy}>
                                  {copied ? (
                                    <IconCopyCheckFilled color="#ffffff" />
                                  ) : (
                                    <IconCopy color="#ffffff" />
                                  )}
                                </Button>
                              )}
                            </CopyButton>
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              top: "9px",
                              right: "0",
                              height: "94%",
                              width: "99%",
                              cursor: "pointer",
                              padding: "10px",
                              borderRadius: "10px",
                              zIndex: 1,
                            }}
                          ></div>
                        </>
                      )}
                    </div>
                  </MantineCard.Section>
                </MantineCard>
              )}
            </Grid.Col>
            <Grid.Col span={12}>
              <Editor
                state={getStringAsEditorState(selectedSKU?.note?.designer)}
                classEditor={styles.editor}
                label="Designer Note"
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
      )}
      {selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[3] && (
        <NewDesign
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
        />
      )}
    </>
  );
};

export default DesignerScreens;
