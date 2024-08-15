import React, { useEffect, useState } from "react";
import styles from "./CreateCamps.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Details from "./Details";
import { filter, map, mapKeys, toLower, toNumber } from "lodash";
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
  TextInput,
  LoadingOverlay,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Editor from "../../components/Editor";
import {
  CONVERT_BRIEF_TYPE_TO_OBJECT_NAME,
  CONVERT_NUMBER_TO_STATUS,
  getStringAsEditorState,
} from "../../utils";
import { campaignServices, rndServices } from "../../services";
import { IconArrowBigRightLinesFilled } from "@tabler/icons-react";
import { BRIEF_TYPES } from "../../constant";
import NewDesign from "./NewDesign";
import Clipart from "./Clipart";
import Niche from "./Niche";
import { accountServices } from "../../services/accounts";
import PreviewCamps from "./PreviewCamps";

const CreateCampsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [campsPayload, setCampsPayload] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const [query, setQuery] = useState({
    status: [3],
    campaignStatus: ["unfulfilled", "partial"],
    postStatus: ["fulfilled", "partial"],
  });
  const [sorting, setSorting] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSKU, setSelectedSKU] = useState();
  const [updateBrief, setUpdateBrief] = useState({});
  const [editingCell, setEditingCell] = useState(false);
  const [metadata, setMetadata] = useState({});
  const [selectedCreateCampPayload, setSelectedCreateCampPayload] = useState(
    {}
  );
  const [trigger, setTrigger] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [querySampleCampaigns, setQuerySampleCampaigns] = useState({});
  const [sampleCampaigns, setSampleCampaigns] = useState([]);
  const [linkProduct, setLinkProduct] = useState("");
  const [
    openedModalPreview,
    { open: openModalPreview, close: closeModalPreview },
  ] = useDisclosure(false);

  const [loadingFetchBrief, setLoadingFetchBrief] = useState(false);
  const [loadingUpdateProductLink, setLoadingUpdateProductLink] =
    useState(false);

  const fetchBriefs = async (page = 1) => {
    setLoadingFetchBrief(true);
    const response = await rndServices.fetchBriefs({
      search,
      page,
      limit: 30,
      view: "mkt",
      sorting,
      ...query,
    });
    const { data, metadata } = response;
    if (data) {
      const filteredData = filter(data, (x) => {
        const adsLinksLength = filter(
          x?.adsLinks,
          (x) => x.postId && (x.type === "image" || !x.type) && !x.campaignId
        ).length;
        const videoLinksLength = filter(
          x?.adsLinks,
          (x) => x.postId && x.type === "video" && !x.campaignId
        ).length;
        return adsLinksLength > 0 || videoLinksLength > 0;
      });
      setBriefs(
        map(filteredData, (x, index) => {
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
      const budgetSetting = mapKeys(
        metadata?.setting?.attribute?.budget,
        (value, key) => toLower(key)
      );
      setCampsPayload(
        map(data, (x) => ({
          batch: x.batch,
          briefId: x.uid,
          team: x.rndTeam,
          sku: x.sku,
          ads: x?.adsLinks,
          exCampIds: map(
            filter(x?.adsLinks, (link) => link.campaignId),
            "campaignId"
          ),
          ...(metadata?.setting?.attribute?.budget && {
            budget: toNumber(
              budgetSetting[toLower(CONVERT_NUMBER_TO_STATUS[x?.value?.rnd])]
            ),
          }),
        }))
      );
      setPagination(metadata);
      setMetadata(metadata);
    } else {
      setBriefs([]);
    }
    setLoadingFetchBrief(false);
    setTrigger(false);
  };
  const fetchSampleCampaigns = async (page = 1) => {
    const { data } = await campaignServices.fetchSampleCampaigns({
      query: querySampleCampaigns,
      page,
      limit: -1,
    });
    setSampleCampaigns(data);
  };
  const fetchAccounts = async () => {
    const { data } = await accountServices.fetchAllAccounts({
      limit: -1,
    });
    setAccounts(data);
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
    fetchSampleCampaigns();
  }, [querySampleCampaigns]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, pagination.currentPage, navigate]);

  useEffect(() => {
    fetchUsers();
    fetchAccounts();
  }, []);

  return (
    <>
      <Card
        className={styles.card}
        title="List Camps đang đợi"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
      >
        <Details
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
          accounts={accounts}
          setCampsPayload={setCampsPayload}
          campsPayload={campsPayload}
          querySampleCampaigns={querySampleCampaigns}
          setQuerySampleCampaigns={setQuerySampleCampaigns}
          sampleCampaigns={sampleCampaigns}
          openModalPreview={openModalPreview}
          setSelectedCreateCampPayload={setSelectedCreateCampPayload}
          selectedCreateCampPayload={selectedCreateCampPayload}
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
      {selectedSKU &&
        selectedSKU?.briefType !== BRIEF_TYPES[1] &&
        selectedSKU?.briefType !== BRIEF_TYPES[2] &&
        selectedSKU?.briefType !== BRIEF_TYPES[3] && (
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
              visible={loadingUpdateProductLink}
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
                  {selectedSKU?.briefType}
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
                  SKU: {selectedSKU?.sku} - Batch: {selectedSKU?.batch}
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
                  {selectedSKU?.rndTeam} - RnD {selectedSKU?.rnd.name} -
                  Designer {selectedSKU?.designer.name}
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
                  EPM {selectedSKU?.epm.name}
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
                  {selectedSKU?.briefType === BRIEF_TYPES[5]
                    ? "Product Line"
                    : "Ref"}
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
                  {selectedSKU?.briefType === BRIEF_TYPES[5]
                    ? selectedSKU?.productLine?.name
                    : selectedSKU?.skuRef}
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
                  {selectedSKU?.designLinkRef && (
                    <List.Item>
                      {selectedSKU?.briefType === BRIEF_TYPES[5]
                        ? "Link Product (Market):"
                        : "Link Design (NAS):"}{" "}
                      <a
                        style={{
                          display: "inline-block",
                          width: "200px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textDecoration: "none",
                          color: "#228be6",
                          verticalAlign: "middle",
                        }}
                        href={
                          selectedSKU?.briefType === BRIEF_TYPES[5]
                            ? `https://${selectedSKU.designLinkRef.replace(
                                /^(https?:\/\/)?/,
                                ""
                              )}`
                            : selectedSKU?.designLinkRef
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedSKU?.designLinkRef}
                      </a>
                    </List.Item>
                  )}
                  {selectedSKU?.productInfo?.tibSearchCampaignLink && (
                    <List.Item>
                      Link Campaign (TIB):{" "}
                      <a
                        style={{
                          display: "inline-block",
                          width: "200px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textDecoration: "none",
                          color: "#228be6",
                          verticalAlign: "middle",
                        }}
                        href={selectedSKU?.productInfo?.tibSearchCampaignLink}
                        target="_blank"
                      >
                        {selectedSKU?.productInfo?.tibSearchCampaignLink}
                      </a>
                    </List.Item>
                  )}
                  {selectedSKU?.linkProductRef && (
                    <List.Item>
                      Link Store:{" "}
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
                      >
                        {selectedSKU?.linkProductRef}
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
                  {selectedSKU?.briefType === BRIEF_TYPES[5]
                    ? "Design + Clipart"
                    : "Scale"}
                </div>
                <Image
                  radius="md"
                  src={
                    selectedSKU?.designInfo?.thumbLink ||
                    "/images/content/not_found_2.jpg"
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
                  {selectedSKU?.sku} mới
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
                  {selectedSKU?.briefType === BRIEF_TYPES[4] ||
                  selectedSKU?.briefType === BRIEF_TYPES[5] ? (
                    <List.Item>
                      Product Base: {""}
                      <span>
                        {selectedSKU?.skuInfo.name ||
                          selectedSKU?.productLine?.name}
                      </span>
                    </List.Item>
                  ) : (
                    <List.Item>
                      {selectedSKU?.briefType === BRIEF_TYPES[0]
                        ? "Product Base"
                        : "Clipart"}
                      :{" "}
                      <span>
                        {
                          selectedSKU?.[
                            CONVERT_BRIEF_TYPE_TO_OBJECT_NAME[
                              selectedSKU?.briefType
                            ]
                          ]?.name
                        }
                      </span>
                    </List.Item>
                  )}
                  {selectedSKU?.linkDesign && (
                    <List.Item>
                      Link Design (NAS):{" "}
                      <a
                        style={{
                          display: "inline-block",
                          width: "200px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textDecoration: "none",
                          color: "#228be6",
                          verticalAlign: "middle",
                        }}
                        href={selectedSKU?.linkDesign}
                        target="_blank"
                      >
                        {selectedSKU?.linkDesign}
                      </a>
                    </List.Item>
                  )}
                  <List.Item>
                    Link Campaign (TIB) - Auto: (Coming soon)
                  </List.Item>
                </List>
              </Grid.Col>
              <Grid.Col span={12}>
                <Editor
                  state={getStringAsEditorState(selectedSKU?.note?.epm)}
                  classEditor={styles.editor}
                  label="EPM Note"
                  readOnly={true}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Flex gap={10}>
                  <TextInput
                    placeholder="Output - Link Website"
                    style={{
                      flex: "1 1 90%",
                    }}
                    value={linkProduct}
                    onChange={(event) => setLinkProduct(event.target.value)}
                  />
                </Flex>
              </Grid.Col>
            </Grid>
          </Modal>
        )}
      {selectedSKU && selectedSKU?.briefType === BRIEF_TYPES[1] && (
        <Clipart
          opened={opened}
          close={close}
          selectedSKU={selectedSKU}
          linkProduct={linkProduct}
          loadingUpdateProductLink={loadingUpdateProductLink}
          setLinkProduct={setLinkProduct}
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
        />
      )}
      <Modal
        opened={openedModalPreview}
        onClose={closeModalPreview}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="md"
        size="1000px"
      >
        <PreviewCamps
          selectedPayload={selectedCreateCampPayload}
          closeModal={closeModalPreview}
          setTrigger={setTrigger}
        />
      </Modal>
    </>
  );
};

export default CreateCampsScreen;
