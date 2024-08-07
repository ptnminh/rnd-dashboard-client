import React, { useEffect, useState } from "react";
import styles from "./CreatedCamps.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import Table from "./Table";
import { map } from "lodash";
import { useDisclosure } from "@mantine/hooks";
import { Pagination } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";

import { campaignServices, rndServices } from "../../services";
import { accountServices } from "../../services/accounts";

const CreatedCampsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [campsPayload, setCampsPayload] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const [query, setQuery] = useState({
    statusValue: "Undone",
    status: [3],
    postStatus: ["fulfilled"],
  });
  const [sorting, setSorting] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCollection, setSelectedCollection] = useState();
  const [updateBrief, setUpdateBrief] = useState({});
  const [editingCell, setEditingCell] = useState(false);

  const [trigger, setTrigger] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [querySampleCampaigns, setQuerySampleCampaigns] = useState({});
  const [sampleCampaigns, setSampleCampaigns] = useState([]);

  const [loadingFetchBrief, setLoadingFetchBrief] = useState(false);

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
      setCampaigns(
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
      setCampsPayload(
        map(data, (x) => ({
          sku: x.sku,
          ads: x?.designInfo?.adsLinks,
        }))
      );
      setPagination(metadata);
      setSelectedCollection(data[0]);
    } else {
      setCampaigns([]);
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
        title="List Camps đã tạo"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
      >
        <Table
          className={styles.details}
          onClose={() => setVisible(false)}
          campaigns={campaigns}
          name={selectedCollection?.name}
          query={query}
          setQuery={setQuery}
          openModal={open}
          users={users}
          setUpdateBrief={setUpdateBrief}
          updateBrief={updateBrief}
          setEditingCell={setEditingCell}
          editingCell={editingCell}
          loadingFetchBrief={loadingFetchBrief}
          setLoadingFetchBrief={setLoadingFetchBrief}
          setTrigger={setTrigger}
          setSorting={setSorting}
          sorting={sorting}
          accounts={accounts}
          setCampsPayload={setCampsPayload}
          campsPayload={campsPayload}
          querySampleCampaigns={querySampleCampaigns}
          setQuerySampleCampaigns={setQuerySampleCampaigns}
          sampleCampaigns={sampleCampaigns}
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
    </>
  );
};

export default CreatedCampsScreen;
