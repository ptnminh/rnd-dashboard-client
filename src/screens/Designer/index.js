import React, { useEffect, useState } from "react";
import styles from "./TemplateKW.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Table from "./Details";
import { map } from "lodash";

import { useDisclosure } from "@mantine/hooks";

import { Pagination, Grid, Flex, Switch } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { getEditorStateAsString, getStringAsEditorState } from "../../utils";
import { rndServices } from "../../services";
import { showNotification } from "../../utils/index";
import { BRIEF_TYPES, STATUS } from "../../constant";
import NewDesign from "./NewDesign";
import ScaleDesign from "./ScaleDesign";
import ScaleMixMatch from "./ScaleMixMatch";
import ScaleClipart from "./ScaleCliparts";
import ScaleNiche from "./Niche";
import ModalEditNoteEPM from "./ModalEditNoteEPM";
import Optimized from "./Optimized";
import ProductLine from "./Productline";

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
    let realStatus = null;
    switch (selectedSKU?.briefType) {
      case BRIEF_TYPES[6]:
        if (selectedSKU?.status === STATUS.BRIEF_CREATED) {
          realStatus = STATUS.OPTIMIZED_LISTING_DESIGNED;
        }
        break;
      case BRIEF_TYPES[7]:
        if (selectedSKU?.status === STATUS.BRIEF_CREATED) {
          realStatus = STATUS.OPTIMIZED_ADS_DESIGNED;
        }
        break;
      case BRIEF_TYPES[8]:
        if (selectedSKU?.status === STATUS.BRIEF_CREATED) {
          realStatus = STATUS.DESIGNED;
        }
        break;
      default:
        realStatus = null;
        break;
    }
    if (linkDesign) {
      const updateResponse = await rndServices.updateBriefDesign({
        uid,
        data: {
          linkDesign,
          status: STATUS.DESIGNED,
          ...(realStatus && { status: realStatus }),
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
        {!opened && (
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
        )}
      </Card>
      <Pagination
        total={pagination.totalPages}
        page={pagination.currentPage}
        onChange={handlePageChange}
        color="pink"
        size="md"
        style={{ marginTop: "20px", marginLeft: "auto" }}
      />
      {selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[0] && opened && (
        <ProductLine
          opened={opened}
          close={close}
          setSelectedSKU={setSelectedSKU}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
          fetchBriefs={fetchBriefs}
        />
      )}
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[1] && (
        <ScaleClipart
          opened={opened}
          close={close}
          setSelectedSKU={setSelectedSKU}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
          fetchBriefs={fetchBriefs}
        />
      )}
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[2] && (
        <ScaleNiche
          opened={opened}
          close={close}
          setSelectedSKU={setSelectedSKU}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
          fetchBriefs={fetchBriefs}
        />
      )}
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[3] && (
        <NewDesign
          opened={opened}
          close={close}
          setSelectedSKU={setSelectedSKU}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
          fetchBriefs={fetchBriefs}
        />
      )}
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[4] && (
        <ScaleDesign
          opened={opened}
          close={close}
          setSelectedSKU={setSelectedSKU}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
          fetchBriefs={fetchBriefs}
        />
      )}
      {opened && selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[5] && (
        <ScaleMixMatch
          opened={opened}
          close={close}
          setSelectedSKU={setSelectedSKU}
          selectedSKU={selectedSKU}
          linkDesign={linkDesign}
          loadingUpdateDesignLink={loadingUpdateDesignLink}
          setLinkDesign={setLinkDesign}
          handleUpdateLinkDesign={handleUpdateLinkDesign}
          setTrigger={setTrigger}
          designerNote={designerNote}
          setDesignerNote={setDesignerNote}
          fetchBriefs={fetchBriefs}
        />
      )}
      {opened &&
        selectedSKU &&
        (selectedSKU?.briefType === BRIEF_TYPES[6] ||
          selectedSKU?.briefType === BRIEF_TYPES[7] ||
          selectedSKU?.briefType === BRIEF_TYPES[8]) && (
          <Optimized
            opened={opened}
            close={close}
            setSelectedSKU={setSelectedSKU}
            selectedSKU={selectedSKU}
            linkDesign={linkDesign}
            loadingUpdateDesignLink={loadingUpdateDesignLink}
            setLinkDesign={setLinkDesign}
            handleUpdateLinkDesign={handleUpdateLinkDesign}
            setTrigger={setTrigger}
            designerNote={designerNote}
            setDesignerNote={setDesignerNote}
            fetchBriefs={fetchBriefs}
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
