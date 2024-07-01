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
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { IconDownload } from "@tabler/icons-react";
import { keywordServices } from "../../services";
import { showNotification } from "../../utils/index";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
const navigation = ["Default", "New"];

const TemplateKW = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [keywords, setKeywords] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);

  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const [options, setOptions] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [nameTemplate, setNameTemplate] = useState("");
  const [templateNameInput, setTemplateNameInput] = useState("");
  const [loadingCreateTemplateKW, setLoadingCreateTemplateKW] = useState(false);
  const [loadingUpdateTemplateKW, setLoadingUpdateTemplateKW] = useState(false);
  const handleSelectAllKWs = () => {
    setSelectedFilters((prev) =>
      isEmpty(prev) ? map(templatesKW, (x) => x.name) : []
    );
  };
  const handleChangeTemplateKW = (name) => {
    setSelectedFilters((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };
  const handleSelectTemplateKW = (name) => {
    const foundTemplate = templatesKW.find((x) => x.name === name);
    setKeywords(
      map(foundTemplate.keywords, (x, index) => ({
        id: index,
        keyword: x.keyword,
      }))
    );
    setSelectedTemplate(foundTemplate);
  };
  const [templatesKW, setTemplatesKW] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmitCreateTemplateKeyword = async (data) => {
    setLoadingCreateTemplateKW(true);
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
      fetchTemplatesKW(1);
      close();
    } else {
      const message =
        createTemplateKeywordResponse?.response?.data?.message ||
        "Tạo template keyword thất bại";
      showNotification("Lỗi", message, "red");
    }
    setLoadingCreateTemplateKW(false);
  };

  const handleChangeNameTemplate = async () => {
    setLoadingUpdateTemplateKW(true);
    const allTemplateNames = map(templatesKW, (x) => x.name);
    if (includes(allTemplateNames, templateNameInput)) {
      showNotification("Lỗi", "Tên template đã tồn tại", "red");
      setLoadingUpdateTemplateKW(false);
      return;
    }
    const updateTemplateResponse =
      await keywordServices.createNewKeywordInTemplate({
        name: selectedTemplate.name,
        newName: templateNameInput,
      });
    if (updateTemplateResponse.data) {
      showNotification("Thành công", "Đổi tên template thành công", "green");
      fetchTemplatesKW(1);
    } else {
      const message =
        updateTemplateResponse?.response?.data?.message ||
        "Tạo template keyword thất bại";
      showNotification("Lỗi", message, "red");
    }
    setLoadingUpdateTemplateKW(false);
    return;
  };
  const handleBlurKeywords = () => {
    const { keywords } = getValues();
    setOptions(compact(uniq(split(keywords, "\n"))));
  };

  const handleDeleteTemplateKeyword = async () => {
    setLoadingCreateTemplateKW(true);
    const deleteTemplateResponse = await keywordServices.deleteTemplateKeyword({
      names: selectedFilters,
    });
    if (deleteTemplateResponse.message === "Done") {
      showNotification(
        "Thành công",
        "Xóa template keyword thành công",
        "green"
      );
      fetchTemplatesKW(1);
    } else {
      const message =
        deleteTemplateResponse?.response?.data?.message ||
        "Xóa template keyword thất bại";
      showNotification("Lỗi", message, "red");
    }
    setLoadingCreateTemplateKW(false);
  };

  const fetchTemplatesKW = async (page = 1) => {
    const response = await keywordServices.getTemplatesKeyword({
      search,
      page,
    });
    const { data, pagination } = response;
    if (data) {
      setTemplatesKW(data);
      setKeywords(
        map(data[0]?.keywords, (x, index) => ({
          id: index,
          keyword: x.keyword,
        })) || []
      );
      setPagination(pagination);
      setSelectedTemplate(data[0]);
    } else {
      showNotification("Lỗi", "Lấy dữ liệu thất bại", "red");
    }
  };
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };
  useEffect(() => {
    fetchTemplatesKW(pagination.currentPage);
    setSelectedFilters([]);
  }, [search, pagination.currentPage]);

  useEffect(() => {
    // Update the URL when search or page changes
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, pagination.currentPage, navigate]);

  useEffect(() => {
    if (selectedTemplate) {
      setTemplateNameInput(selectedTemplate.name);
    }
  }, [selectedTemplate]);
  return (
    <>
      <Card
        className={styles.card}
        title="Template"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
        head={
          <>
            <Form
              className={styles.form}
              value={search}
              setValue={setSearch}
              placeholder="Search Templates"
              type="text"
              name="search"
              icon="search"
            />
            <div className={styles.nav}>
              {!isEmpty(selectedFilters) && (
                <button
                  className={cn(
                    "button-stroke-red button-small",
                    styles.createButton
                  )}
                  style={{
                    marginRight: "16px",
                  }}
                  onClick={() => {
                    handleDeleteTemplateKeyword();
                  }}
                >
                  <Icon name="trash" size="16" />
                  <span>Xóa</span>
                </button>
              )}

              {navigation.map((x, index) => (
                <button
                  className={cn(styles.link, {
                    [styles.active]: index === activeIndex,
                  })}
                  onClick={() => {
                    if (index === 1) {
                      open();
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                  key={index}
                >
                  {x}
                </button>
              ))}
            </div>
          </>
        }
      >
        <div className={cn(styles.row, { [styles.flex]: visible })}>
          <Table
            className={styles.table}
            activeTable={visible}
            setActiveTable={setVisible}
            setTemplatesKW={setTemplatesKW}
            templatesKW={templatesKW}
            setSelectedFilters={setSelectedFilters}
            selectedFilters={selectedFilters}
            handleSelectAllKWs={handleSelectAllKWs}
            handleChangeTemplateKW={handleChangeTemplateKW}
            handleSelectTemplateKW={handleSelectTemplateKW}
            selectedTemplate={selectedTemplate}
            nameTemplate={nameTemplate}
            setNameTemplate={setNameTemplate}
          />
          <Card
            className={styles.card}
            title="Danh sách KW"
            classTitle={cn("title-yellow", styles.title)}
            classCardHead={styles.head}
            head={
              <>
                <div className={styles.nav}>
                  <TextInputComponent
                    className={styles.input}
                    placeholder="Search"
                    value={templateNameInput}
                    onChange={(e) => setTemplateNameInput(e.target.value)}
                  />
                  <Tooltip label="Save">
                    <span
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "20px",
                      }}
                      onClick={() => handleChangeNameTemplate()}
                    >
                      {loadingUpdateTemplateKW ? (
                        <Loader className={styles.loader} />
                      ) : (
                        <Icon name="arrow-right" size={18} fill="#2A85FF" />
                      )}
                    </span>
                  </Tooltip>
                </div>
                {/* <Button
                  leftSection={<IconDownload />}
                  style={{
                    backgroundColor: "#FF6A55",
                    marginLeft: "auto",
                  }}
                  variant="filled"
                >
                  Export All Templates
                </Button> */}
              </>
            }
          >
            <ScrollArea h={600}>
              <Details
                className={styles.details}
                onClose={() => setVisible(false)}
                keywords={keywords}
                name={selectedTemplate?.name}
              />
            </ScrollArea>
          </Card>
        </div>
      </Card>
      <Pagination
        total={pagination.totalPages}
        page={pagination.currentPage}
        onChange={handlePageChange}
        color="pink"
        size="md"
        style={{ marginTop: "20px", marginLeft: "auto" }}
      />
      <Modal opened={opened} onClose={close} size="lg">
        <LoadingOverlay
          visible={loadingCreateTemplateKW}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "pink", type: "bars" }}
        />
        <form
          onSubmit={handleSubmit(onSubmitCreateTemplateKeyword)}
          style={{ position: "relative" }}
        >
          <Paper p="xl" radius="xl" withBorder>
            <Stack>
              <Group position="apart">
                <Title order={2}>Create Your Keyword</Title>
              </Group>

              <TextInputComponent
                size="sm"
                label="Name"
                name="name"
                register={register("name", {
                  required: true,
                })}
                error={errors.name}
              />
              <Paper>
                <TextInputComponent
                  size="md"
                  cols={16}
                  rows={5}
                  label="Keywords"
                  name="keywords"
                  isTextArea={true}
                  onBlur={handleBlurKeywords}
                  register={register("keywords", {
                    required: true,
                  })}
                  error={errors.keywords}
                />
              </Paper>
              {!isEmpty(options) && (
                <ScrollArea
                  h={100}
                  offsetScrollbars
                  classNames={styles.scrollArea}
                >
                  <SimpleGrid cols={4}>
                    {options?.map((option, i) => (
                      <Button key={i} size="xs" radius="md" variant="default">
                        {option}
                      </Button>
                    ))}
                  </SimpleGrid>
                </ScrollArea>
              )}

              <Group
                position="apart"
                style={{
                  justifyContent: "end",
                }}
              >
                <button
                  className={cn(
                    "button-stroke button-small",
                    styles.createButton
                  )}
                  type="submit"
                >
                  <Icon name="plus" size="16" />
                  <span>Tạo</span>
                </button>
              </Group>
            </Stack>
          </Paper>{" "}
        </form>
      </Modal>
    </>
  );
};

export default TemplateKW;
