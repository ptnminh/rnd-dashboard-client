import React, { useEffect, useState } from "react";
import styles from "./TemplateKW.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Details from "./Details";
import { map } from "lodash";

import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheck } from "@tabler/icons-react";
import {
  Modal,
  Pagination,
  Grid,
  Image,
  List,
  ThemeIcon,
  rem,
  Flex,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Editor from "../../components/Editor";
import { getStringAsEditorState } from "../../utils";
import { rndServices } from "../../services";

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
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSKU, setSelectedSKU] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [updateBrief, setUpdateBrief] = useState({});
  const [editingCell, setEditingCell] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [metadata, setMetadata] = useState({});

  const [collectionNameInput, setCollectionNameInput] = useState("");
  const [loadingFetchBrief, setLoadingFetchBrief] = useState(false);

  const [collections, setCollections] = useState([]);

  const fetchCollections = async (page = 1) => {
    setLoadingFetchBrief(true);
    const response = await rndServices.fetchBriefs({
      search,
      page,
      limit: 30,
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
            time: Math.round(
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
  };
  useEffect(() => {
    fetchCollections(pagination.currentPage);
  }, [search, pagination.currentPage, query, trigger]);

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
      {selectedSKU && (
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
                {selectedSKU?.briefType} - từ {selectedSKU?.skuRef}
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                  fontSize: "18px",
                }}
              >
                {selectedSKU?.skuRef} - {selectedSKU?.batch}
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                  padding: "10px",
                  fontSize: "18px",
                  alignItems: "center",
                }}
              >
                REF
              </div>
              <Image
                radius="md"
                src={selectedSKU?.imageRef || "/images/content/not_found_2.jpg"}
                height={300}
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
                {selectedSKU?.sku}
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
                    <a href={selectedSKU?.linkProductRef} target="_blank">
                      Click
                    </a>
                  </List.Item>
                )}
                {selectedSKU?.linkDesign && (
                  <List.Item>
                    Link Design:{" "}
                    <a href={selectedSKU?.linkDesign} target="_blank">
                      Click
                    </a>
                  </List.Item>
                )}
              </List>
            </Grid.Col>
            <Grid.Col span={2}></Grid.Col>
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
              <Image
                radius="md"
                src={
                  selectedSKU?.productLine?.image ||
                  "/images/content/not_found_2.jpg"
                }
                height={300}
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
                {selectedSKU?.productLine?.name}
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
                {selectedSKU?.productLine?.refLink && (
                  <List.Item>
                    Link Mockup:{" "}
                    <a href={selectedSKU?.productLine?.refLink} target="_blank">
                      Click
                    </a>
                  </List.Item>
                )}
              </List>
            </Grid.Col>
            <Grid.Col span={12}>
              <Editor
                state={getStringAsEditorState(selectedSKU?.note?.designer)}
                classEditor={styles.editor}
                label="Designer Note"
                readOnly={true}
              />
            </Grid.Col>
          </Grid>
        </Modal>
      )}
    </>
  );
};

export default DesignerScreens;
