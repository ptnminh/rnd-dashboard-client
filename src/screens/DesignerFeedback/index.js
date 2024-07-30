import React, { useEffect, useState } from "react";
import styles from "./DesignerFeedback.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Details from "./Details";
import { findIndex, isEmpty, map, sum } from "lodash";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Pagination,
  Grid,
  Image,
  Flex,
  Button,
  Rating,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Editor from "../../components/Editor";
import { rndServices } from "../../services";
import {
  IconHeart,
  IconDeviceFloppy,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import { getEditorStateAsString, getStringAsEditorState } from "../../utils";
import { showNotification } from "../../utils/index";

const DesignerFeedbackScreens = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [feedback, setFeedback] = useState("");
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
    status: [2],
  });
  const [sorting, setSorting] = useState([]);
  const [colorRating, setColorRating] = useState(0);
  const [layoutRating, setLayoutRating] = useState(0);
  const [typoRating, setTypoRating] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedPreviewImage,
    { open: openPreviewImage, close: closePreviewImage },
  ] = useDisclosure(false);
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

  const [orderedData, setOrderedData] = useState([]);

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

  const handleChangeNextSlide = (uid) => {
    const findCurrentIndex = findIndex(productLines, { uid });
    let productLine;
    if (findCurrentIndex === productLines.length - 1) {
      productLine = productLines[0];
      setSelectedSKU(productLine);
    } else {
      productLine = productLines[findCurrentIndex + 1];
      setSelectedSKU(productLine);
    }
    setFeedback(
      getStringAsEditorState(productLine?.attribute?.feedback?.feedback)
    );
    setColorRating(productLine.attribute?.feedback?.rating?.color);
    setLayoutRating(productLine.attribute?.feedback?.rating?.layout);
    setTypoRating(productLine.attribute?.feedback?.rating?.typo);
  };

  const handleChangePreviousSlide = (uid) => {
    const findCurrentIndex = findIndex(productLines, { uid });
    let productLine;
    if (findCurrentIndex === 0) {
      productLine = productLines[productLines.length - 1];
      setSelectedSKU(productLine);
    } else {
      productLine = productLines[findCurrentIndex - 1];
      setSelectedSKU(productLine);
    }
    setFeedback(
      getStringAsEditorState(productLine?.attribute?.feedback?.feedback)
    );
    setColorRating(productLine.attribute?.feedback?.rating?.color);
    setLayoutRating(productLine.attribute?.feedback?.rating?.layout);
    setTypoRating(productLine.attribute?.feedback?.rating?.typo);
  };

  const handleUpdateBrief = async () => {
    const rating = {
      ...(colorRating && { color: colorRating }),
      ...(layoutRating && { layout: layoutRating }),
      ...(typoRating && { typo: typoRating }),
      ...(colorRating || layoutRating || typoRating
        ? {
            summary:
              Math.round(
                (sum([colorRating, layoutRating, typoRating]) / 3) * 2
              ) / 2,
          }
        : {}),
    };
    const payload = {
      ...(feedback && { feedback: getEditorStateAsString(feedback) }),
      ...(!isEmpty(rating) && { rating }),
    };
    if (!isEmpty(payload)) {
      const updateBriefResponse = await rndServices.updateBrief({
        uid: selectedSKU?.uid,
        data: payload,
      });
      if (updateBriefResponse) {
        showNotification("Thành công", "Cập nhật thành công", "green");
        await fetchCollections(pagination.currentPage);
      }
    }
  };

  return (
    <>
      <Card
        className={styles.card}
        title="DESIGNER FEEDBACK"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
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
          setFeedback={setFeedback}
          setOrderedData={setOrderedData}
          setLayoutRating={setLayoutRating}
          setColorRating={setColorRating}
          setTypoRating={setTypoRating}
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
        <>
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
          >
            <Button
              style={{
                position: "absolute",
                top: "50%",
                left: "17%",
                borderRadius: "50%",
                height: "50px",
                width: "50px",
              }}
              onClick={() => {
                handleChangePreviousSlide(selectedSKU?.uid);
              }}
            >
              <span
                style={{
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconArrowLeft size={16} />
              </span>
            </Button>
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
                  {selectedSKU?.sku}
                </div>
              </Grid.Col>
              <Grid.Col span={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px",
                    fontSize: "18px",
                  }}
                >
                  Team: {selectedSKU?.rndTeam} - RnD: {selectedSKU?.rnd.name} -
                  Designer: {selectedSKU?.designer.name}
                </div>
              </Grid.Col>
              <Grid.Col span={4}>
                <Image
                  radius="md"
                  src={
                    selectedSKU?.designInfo?.thumbLink ||
                    "/images/content/not_found_2.jpg"
                  }
                  height="100%"
                  fit="contain"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={openPreviewImage}
                />
              </Grid.Col>
              <Grid.Col span={8}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Rating
                    emptySymbol={<IconHeart size="3rem" color="#D9472A" />}
                    fullSymbol={
                      <IconHeart size="3rem" fill="#D54E30" color="#D9472A" />
                    }
                    fractions={2}
                    defaultValue={3.5}
                    value={
                      Math.round(
                        (sum([colorRating, layoutRating, typoRating]) / 3) * 2
                      ) / 2
                    }
                    readOnly
                  />
                </div>
                <div
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      margin: "15px 0",
                    }}
                  >
                    <span>Màu sắc</span>
                    <span>
                      <Rating
                        emptySymbol={
                          <IconHeart size="1.5rem" color="#D9472A" />
                        }
                        fullSymbol={
                          <IconHeart
                            size="1.5rem"
                            fill="#D54E30"
                            color="#D9472A"
                          />
                        }
                        fractions={2}
                        value={colorRating}
                        onChange={setColorRating}
                      />
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      margin: "15px 0",
                    }}
                  >
                    <span>Layout</span>
                    <span>
                      <Rating
                        emptySymbol={
                          <IconHeart size="1.5rem" color="#D9472A" />
                        }
                        fullSymbol={
                          <IconHeart
                            size="1.5rem"
                            fill="#D54E30"
                            color="#D9472A"
                          />
                        }
                        fractions={2}
                        value={layoutRating}
                        onChange={setLayoutRating}
                      />
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      margin: "15px 0",
                    }}
                  >
                    <span>Typo</span>
                    <span>
                      <Rating
                        emptySymbol={
                          <IconHeart size="1.5rem" color="#D9472A" />
                        }
                        fullSymbol={
                          <IconHeart
                            size="1.5rem"
                            fill="#D54E30"
                            color="#D9472A"
                          />
                        }
                        fractions={2}
                        value={typoRating}
                        onChange={setTypoRating}
                      />
                    </span>
                  </div>
                </div>
                <div>
                  <Editor
                    state={feedback}
                    onChange={setFeedback}
                    classEditorWrapper={styles.classEditorWrapper}
                    classEditor={styles.editor}
                    label="Feedback"
                  />
                </div>
              </Grid.Col>
              <Grid.Col
                span={12}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="filled"
                  color="green"
                  leftSection={<IconDeviceFloppy />}
                  onClick={handleUpdateBrief}
                >
                  Lưu
                </Button>
              </Grid.Col>
            </Grid>
            <Button
              style={{
                position: "absolute",
                top: "50%",
                right: "17%",
                borderRadius: "50%",
                height: "50px",
                width: "50px",
              }}
              onClick={() => {
                handleChangeNextSlide(selectedSKU?.uid);
              }}
            >
              <span
                style={{
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconArrowRight size={16} />
              </span>
            </Button>
          </Modal>
        </>
      )}
      <Modal
        opened={openedPreviewImage}
        onClose={closePreviewImage}
        fullScreen
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
        zIndex={9999}
        styles={{
          body: {
            width: "90%",
            height: "90%",
          },
        }}
      >
        <Image
          radius="md"
          src={
            selectedSKU?.designInfo?.thumbLink ||
            "/images/content/not_found_2.jpg"
          }
          height="100%"
          fit="contain"
          style={{
            cursor: "pointer",
          }}
        />
      </Modal>
    </>
  );
};

export default DesignerFeedbackScreens;
