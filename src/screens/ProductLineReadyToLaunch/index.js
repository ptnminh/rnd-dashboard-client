import React, { useEffect, useState } from "react";
import styles from "./Task.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Table from "./Table";
import { map } from "lodash";
import { useDisclosure } from "@mantine/hooks";
import { Flex, Grid, Modal, Pagination } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { artistServices, rndServices } from "../../services";
import ArtistRef from "../Artist/ArtistRef";
import Editor from "../../components/Editor";
import { CONVERT_NUMBER_TO_STATUS, getStringAsEditorState } from "../../utils";

const ProductLineReadyToLaunch = () => {
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
    status: [1],
    statusValue: "Undone",
  });
  const [sorting, setSorting] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedBrief, setSelectedBrief] = useState();
  const [metadata, setMetadata] = useState({});
  const [trigger, setTrigger] = useState(false);
  const [
    openedModalPreview,
    { open: openModalPreview, close: closeModalPreview },
  ] = useDisclosure(false);

  const [loadingFetchBrief, setLoadingFetchBrief] = useState(false);

  const fetchBriefs = async (page = 1) => {
    setLoadingFetchBrief(true);
    const response = await artistServices.fetchArtistTask({
      search,
      page,
      limit: 30,
      view: "art",
      sorting,
      query,
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
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, pagination.currentPage, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Card
        className={styles.card}
        title="New PL - Ready to Launch"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
      >
        <Table
          className={styles.Table}
          briefs={briefs}
          query={query}
          setQuery={setQuery}
          setSelectedBrief={setSelectedBrief}
          openModal={open}
          users={users}
          loadingFetchBrief={loadingFetchBrief}
          setLoadingFetchBrief={setLoadingFetchBrief}
          setTrigger={setTrigger}
          setSorting={setSorting}
          sorting={sorting}
          openModalPreview={openModalPreview}
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
              PREVIEW CARD
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Flex direction="column">
                <div>
                  RnD:{" "}
                  <span
                    style={{
                      color: "#1356F0",
                    }}
                  >
                    @{selectedBrief?.rnd?.name}
                  </span>
                </div>
                <div>
                  Value: {CONVERT_NUMBER_TO_STATUS[selectedBrief?.value?.rnd]}
                </div>
              </Flex>
            </div>
          </Grid.Col>
          <Grid.Col span={3}>
            <ArtistRef
              artistDesignRefLink={selectedBrief?.imageRef}
              isPreview={true}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <Editor
              state={getStringAsEditorState(selectedBrief?.note?.artist)}
              classEditorWrapper={styles.editor}
              readOnly={true}
            />
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
};

export default ProductLineReadyToLaunch;
