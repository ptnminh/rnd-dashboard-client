import React, { useEffect, useState } from "react";
import styles from "./TemplateKW.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Form from "../../components/Form";
import Table from "./Table";
import Details from "./Details";
import { compact, includes, isEmpty, map, split, uniq } from "lodash";
import TextInputComponent from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheck } from "@tabler/icons-react";
import {
  Button,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Title,
  ScrollArea,
  LoadingOverlay,
  Pagination,
  Tooltip,
  Grid,
  Badge,
  Image,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { keywordServices, rndServices } from "../../services";
import { showNotification } from "../../utils/index";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import moment from "moment-timezone";
import Editor from "../../components/Editor";
import { convertFromRaw, EditorState } from "draft-js";
import { getStringAsEditorState } from "../../utils";
const navigation = ["Default", "New"];

const DesignerScreens = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [productLines, setProductLines] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);

  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSKU, setSelectedSKU] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [collectionNameInput, setCollectionNameInput] = useState("");
  const [loadingCreateCollection, setLoadingCreateCollection] = useState(false);
  const [loadingUpdateCollection, setLoadingUpdateCollection] = useState(false);

  const [collections, setCollections] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmitCreateCollection = async (data) => {
    setLoadingCreateCollection(true);
    const { name, keywords } = data;
    const transformedKeywords = uniq(split(keywords, "\n"));
    const createTemplateKeywordResponse =
      await keywordServices.createTemplateKeyword({
        name,
        keywords: transformedKeywords,
      });
    if (createTemplateKeywordResponse.data) {
      showNotification(
        "Thành công",
        "Tạo template keyword thành công",
        "green"
      );
      fetchCollections(1);
      close();
    } else {
      const message =
        createTemplateKeywordResponse?.response?.data?.message ||
        "Tạo template keyword thất bại";
      showNotification("Lỗi", message, "red");
    }
    setLoadingCreateCollection(false);
  };

  const handleBlurProductLines = () => {
    const { keywords } = getValues();
    setOptions(compact(uniq(split(keywords, "\n"))));
  };

  const handleDeleteCollections = async () => {
    setLoadingCreateCollection(true);
    const deleteTemplateResponse = await keywordServices.deleteTemplateKeyword({
      names: selectedFilters,
    });
    if (deleteTemplateResponse.message === "Done") {
      showNotification(
        "Thành công",
        "Xóa template keyword thành công",
        "green"
      );
      fetchCollections(1);
    } else {
      const message =
        deleteTemplateResponse?.response?.data?.message ||
        "Xóa template keyword thất bại";
      showNotification("Lỗi", message, "red");
    }
    setLoadingCreateCollection(false);
  };

  const fetchCollections = async (page = 1) => {
    const response = await rndServices.fetchBriefs({
      search,
      page,
      limit: 50,
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
            date: moment(x.createdAt).format("DD/MM/YYYY"),
            time:
              Math.round(moment().diff(moment(x.createdAt), "hours", true)) +
              "h",
          };
        })
      );
      setPagination(metadata);
      setSelectedCollection(data[0]);
    } else {
      showNotification("Lỗi", "Lấy dữ liệu thất bại", "red");
    }
  };
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };
  useEffect(() => {
    fetchCollections(pagination.currentPage);
  }, [search, pagination.currentPage, query]);

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
  return (
    <>
      <Card
        className={styles.card}
        title="DESIGNER TASK"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
        head={<></>}
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
                {selectedSKU?.designLink && (
                  <List.Item>
                    Link Design:{" "}
                    <a href={selectedSKU?.designLink} target="_blank">
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
                src={selectedSKU?.imageRef || "/images/content/not_found_2.jpg"}
                height={300}
              />

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
                {selectedSKU?.mockupLink && (
                  <List.Item>
                    Link Product:{" "}
                    <a href={selectedSKU?.mockupLink} target="_blank">
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
              />
            </Grid.Col>
          </Grid>
        </Modal>
      )}
    </>
  );
};

export default DesignerScreens;
