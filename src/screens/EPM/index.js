import React, { useEffect, useState } from "react";
import styles from "./TemplateKW.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Table from "./Details";
import { isEmpty, map } from "lodash";

import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheck, IconExclamationMark } from "@tabler/icons-react";
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
  HoverCard,
  Switch,
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
import { BRIEF_TYPES, STATUS } from "../../constant";
import NewDesign from "./NewDesign";
import Clipart from "./Clipart";
import Niche from "./Niche";
import ProductBase from "./ProductBase";
import ScaleDesign from "./ScaleDesign";
import MixMatch from "./MixMatch";

const EPMScreens = () => {
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
    status: [2],
    priority: 1,
  });
  const [sorting, setSorting] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSKU, setSelectedSKU] = useState();
  const [updateBrief, setUpdateBrief] = useState({});
  const [editingCell, setEditingCell] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [metadata, setMetadata] = useState({});
  const [linkProduct, setLinkProduct] = useState("");

  const [loadingFetchBrief, setLoadingFetchBrief] = useState(false);
  const [loadingUpdateProductLink, setLoadingUpdateProductLink] =
    useState(false);

  const fetchBriefs = async (page = 1) => {
    setLoadingFetchBrief(true);
    const response = await rndServices.fetchBriefs({
      search,
      page,
      limit: 30,
      view: "epm",
      sorting,
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
    fetchBriefs(pagination.currentPage);
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
    fetchUsers();
  }, []);

  const handleUpdateLinkProduct = async (uid) => {
    setLoadingUpdateProductLink(true);
    if (!linkProduct) {
      setLoadingUpdateProductLink(false);
      showNotification("Thất bại", "Link Product không được để trống", "red");
      return;
    }
    const urlPattern =
      /^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[\w-]*)?$/i;
    if (!urlPattern.test(linkProduct)) {
      showNotification("Thất bại", "Link Product không hợp lệ", "red");
      setLoadingUpdateProductLink(false);
      return;
    }
    if (linkProduct) {
      const updateResponse = await rndServices.updateBriefListing({
        uid,
        data: {
          linkProduct,
          status: STATUS.LISTED,
        },
      });
      if (updateResponse) {
        showNotification(
          "Thành công",
          "Update Link Product thành công",
          "green"
        );
        await fetchBriefs(pagination.currentPage);
      }
    }
    close();
    setLoadingUpdateProductLink(false);
  };
  return (
    <>
      <Card
        className={styles.card}
        title="EPM TASK"
        classTitle={styles.title}
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
                Time to done: {metadata?.totalTimeToDoneBriefsWithFilterV2Round}
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
          setLinkProduct={setLinkProduct}
          setSorting={setSorting}
          sorting={sorting}
          metadata={metadata}
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
      {selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[0] && (
        <ProductBase
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkProduct={linkProduct}
          loadingUpdateProductLink={loadingUpdateProductLink}
          setLinkProduct={setLinkProduct}
          handleUpdateLinkProduct={handleUpdateLinkProduct}
        />
      )}
      {selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[1] && (
        <Clipart
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkProduct={linkProduct}
          loadingUpdateProductLink={loadingUpdateProductLink}
          setLinkProduct={setLinkProduct}
          handleUpdateLinkProduct={handleUpdateLinkProduct}
        />
      )}
      {selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[2] && (
        <Niche
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkProduct={linkProduct}
          loadingUpdateProductLink={loadingUpdateProductLink}
          setLinkProduct={setLinkProduct}
          handleUpdateLinkProduct={handleUpdateLinkProduct}
        />
      )}
      {selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[3] && (
        <NewDesign
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkProduct={linkProduct}
          loadingUpdateProductLink={loadingUpdateProductLink}
          setLinkProduct={setLinkProduct}
          handleUpdateLinkProduct={handleUpdateLinkProduct}
        />
      )}
      {selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[4] && (
        <ScaleDesign
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkProduct={linkProduct}
          loadingUpdateProductLink={loadingUpdateProductLink}
          setLinkProduct={setLinkProduct}
          handleUpdateLinkProduct={handleUpdateLinkProduct}
        />
      )}
      {selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[5] && (
        <MixMatch
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkProduct={linkProduct}
          loadingUpdateProductLink={loadingUpdateProductLink}
          setLinkProduct={setLinkProduct}
          handleUpdateLinkProduct={handleUpdateLinkProduct}
        />
      )}
    </>
  );
};

export default EPMScreens;
