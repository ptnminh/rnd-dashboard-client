import React, { useEffect, useState } from "react";
import styles from "./TemplateKW.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Table from "./Details";
import { map } from "lodash";

import { useDisclosure } from "@mantine/hooks";
import {
  IconCircleCheck,
  IconCopy,
  IconCopyCheckFilled,
  IconExclamationMark,
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
  Switch,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Editor from "../../components/Editor";
import {
  CONVERT_BRIEF_TYPE_TO_OBJECT_NAME,
  CONVERT_NUMBER_TO_STATUS,
  getEditorStateAsString,
  getStringAsEditorState,
} from "../../utils";
import { rndServices } from "../../services";
import { showNotification } from "../../utils/index";
import { IconArrowBigRightLinesFilled } from "@tabler/icons-react";
import { BRIEF_TYPES, STATUS } from "../../constant";
import NewDesign from "./NewDesign";
import ScaleDesign from "./ScaleDesign";
import ScaleMixMatch from "./ScaleMixMatch";
import ScaleClipart from "./ScaleCliparts";
import ScaleNiche from "./Niche";
import ModalEditNoteEPM from "./ModalEditNoteEPM";

const DesignerScreens = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [briefs, setBriefs] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const [query, setQuery] = useState({
    statusValue: "Undone",
    status: [1],
    priority: 1,
  });
  const [sorting, setSorting] = useState([]);

  const [opened, { open, close }] = useDisclosure(false);
  const [openedNoteForEPM, { open: openNoteForEPM, close: closeNoteForEPM }] =
    useDisclosure(false);
  const [selectedSKU, setSelectedSKU] = useState({});
  const [updateBrief, setUpdateBrief] = useState({});
  const [editingCell, setEditingCell] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [metadata, setMetadata] = useState({});
  const [linkDesign, setLinkDesign] = useState("");

  const [loadingFetchBrief, setLoadingFetchBrief] = useState(false);
  const [loadingUpdateDesignLink, setLoadingUpdateDesignLink] = useState(false);

  const fetchBriefs = async (page = 1) => {
    setLoadingFetchBrief(true);
    const response = await rndServices.fetchBriefs({
      search,
      page,
      limit: 30,
      sorting,
      view: "design",
      ...query,
    });
    const { data, metadata } = response;
    if (data) {
      setBriefs(
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
    } else {
      setBriefs([]);
    }
    setLoadingFetchBrief(false);
    setTrigger(false);
    setDesignerNote(getStringAsEditorState(selectedSKU?.note?.designer || ""));
  };
  const fetchUsers = async () => {
    const { data } = await rndServices.getUsers({
      limit: -1,
    });
    setUsers(data);
  };
  const [designerNote, setDesignerNote] = useState("");
  const [loadingUpdateNote, setLoadingUpdateNote] = useState(false);
  const handleUpdateNote = async () => {
    setLoadingUpdateNote(true);
    const updateNoteResponse = await rndServices.updateBriefDesign({
      uid: selectedSKU.uid,
      data: {
        note: {
          ...selectedSKU.note,
          designer: getEditorStateAsString(designerNote),
        },
      },
    });
    if (updateNoteResponse) {
      close();
      setTrigger(true);
      showNotification("Thành công", "Cập nhật Note thành công", "green");
    }
    setLoadingUpdateNote(false);
  };
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    fetchBriefs(pagination.currentPage);
  }, [search, pagination.currentPage, query, trigger, sorting]);

  useEffect(() => {
    if (selectedSKU) {
      if (
        selectedSKU?.briefType === BRIEF_TYPES[3] ||
        selectedSKU?.briefType === BRIEF_TYPES[5]
      ) {
        setDesignerNote(
          getStringAsEditorState(
            selectedSKU?.note?.mixMatch ||
              selectedSKU?.attribute?.refDesignMarketNote ||
              selectedSKU?.note?.designer ||
              ""
          )
        );
      } else {
        setDesignerNote(
          getStringAsEditorState(selectedSKU?.note?.designer || "")
        );
      }
    }
  }, [selectedSKU]);

  useEffect(() => {
    // Update the URL when search or page changes
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, pagination.currentPage, navigate]);

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
      const updateResponse = await rndServices.updateBriefDesign({
        uid,
        data: {
          linkDesign,
          status: STATUS.DESIGNED,
        },
      });
      if (updateResponse) {
        showNotification(
          "Thành công",
          "Update Link Design thành công",
          "green"
        );
        await fetchBriefs(pagination.currentPage);
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
                Số card: {metadata?.totalUndoneBriefs}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Time to done: {metadata?.totalTimeToDoneAllBriefsV2Round || 0}
                {metadata?.totalTimeToDoneAllBriefsV2Round > 1
                  ? " Days "
                  : " Day "}
              </div>
            </Flex>
          </>
        }
      >
        <Grid
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Grid.Col span={6}>
            <Flex
              style={{
                gap: "30px",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#EFF0F1",
              }}
              justify="start"
              align="center"
            >
              <Switch
                checked={query?.priority === 2}
                labelPosition="left"
                onChange={() => {
                  setQuery({
                    ...query,
                    priority: query?.priority === 1 ? 2 : 1,
                  });
                }}
                styles={{
                  label: {
                    fontSize: "16px",
                    fontWeight: "bold",
                  },
                }}
                label="Priority View"
              />
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Số card: {metadata?.totalUndoneBriefsWithFilter}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Time to done:{" "}
                {metadata?.totalTimeToDoneBriefsWithFilterV2Round || 0}
                {metadata?.totalTimeToDoneBriefsWithFilterV2Round > 1
                  ? " Days "
                  : " Day "}
              </div>
            </Flex>
          </Grid.Col>
        </Grid>
        <Table
          className={styles.details}
          onClose={() => setVisible(false)}
          briefs={briefs}
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
          metadata={metadata}
          openNoteForEPM={openNoteForEPM}
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
      {selectedSKU &&
        selectedSKU?.briefType !== BRIEF_TYPES[1] &&
        selectedSKU?.briefType !== BRIEF_TYPES[2] &&
        selectedSKU?.briefType !== BRIEF_TYPES[3] &&
        selectedSKU?.briefType !== BRIEF_TYPES[4] &&
        selectedSKU?.briefType !== BRIEF_TYPES[5] && (
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
            styles={{
              title: {
                fontSize: "21px",
                fontWeight: "bold",
                margin: "auto",
              },
              close: {
                margin: "none",
                marginInlineStart: "unset",
              },
            }}
            title={selectedSKU?.sku}
          >
            <LoadingOverlay
              visible={loadingUpdateDesignLink}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            <Grid>
              <Grid.Col span={12}>
                <Grid
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
                  <Grid.Col span={4}>
                    {selectedSKU?.priority === 2 ? (
                      <span>
                        <IconExclamationMark color="red" size={24} />
                        <span
                          style={{
                            color: "red",
                          }}
                        >
                          Priority
                        </span>
                      </span>
                    ) : (
                      ""
                    )}
                  </Grid.Col>
                  <Grid.Col
                    span={4}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {selectedSKU?.briefType}
                  </Grid.Col>
                  <Grid.Col span={4}></Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col
                span={5}
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "5px",
                    fontSize: "14px",
                  }}
                >
                  • Value: {CONVERT_NUMBER_TO_STATUS[selectedSKU?.value?.rnd]}
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
                  • Size: {CONVERT_NUMBER_TO_STATUS[selectedSKU?.size?.design]}
                </div>
              </Grid.Col>
              <Grid.Col span={2}></Grid.Col>
              <Grid.Col
                span={5}
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "5px",
                    fontSize: "14px",
                  }}
                >
                  • Team: {selectedSKU?.rndTeam}
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
                  • RnD: {selectedSKU?.rnd?.name}
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
                  • Designer:{selectedSKU?.designer?.name}
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
                  src={
                    selectedSKU?.imageRef || "/images/content/not_found_2.jpg"
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
                  {(selectedSKU?.designLinkRef?.designLink ||
                    selectedSKU?.designLinkRef) && (
                    <List.Item>
                      Link Design (NAS):{" "}
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
                          selectedSKU?.designLinkRef ||
                          selectedSKU?.productLine?.designLink
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedSKU?.designLinkRef ||
                          selectedSKU?.productLine?.designLink}
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
                              <CopyButton
                                value={selectedSKU?.niche?.quote}
                                color
                              >
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
                  state={designerNote}
                  onChange={setDesignerNote}
                  classEditor={styles.editor}
                  label="Designer Note"
                  readOnly={selectedSKU?.status === STATUS.DESIGNED}
                  button={selectedSKU?.status !== STATUS.DESIGNED}
                  onClick={() => handleUpdateNote()}
                  loading={loadingUpdateNote}
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
                    disabled={selectedSKU?.status === STATUS.DESIGNED}
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
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[1] && (
        <ScaleClipart
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
        />
      )}
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[2] && (
        <ScaleNiche
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
        />
      )}
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[3] && (
        <NewDesign
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
        />
      )}
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[4] && (
        <ScaleDesign
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
        />
      )}
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[5] && (
        <ScaleMixMatch
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
        />
      )}
      {selectedSKU && openedNoteForEPM && (
        <ModalEditNoteEPM
          opened={openedNoteForEPM}
          close={closeNoteForEPM}
          selectedSKU={selectedSKU}
          setTrigger={setTrigger}
        />
      )}
    </>
  );
};

export default DesignerScreens;
