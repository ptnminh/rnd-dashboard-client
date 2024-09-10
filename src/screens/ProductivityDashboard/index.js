import React, { useEffect, useState } from "react";
import styles from "./ProductivityDashboard.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import { map, orderBy, split } from "lodash";
import { Flex, Grid, Select, Tabs, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { dashboardServices } from "../../services";
import InputDashboard from "./InputDashboard";
import ProductivityTable from "./ProductivityTable";
import moment from "moment-timezone";
import { generateDescendingArray } from "../../utils";

const TABS_FILTER = {
  WEEK: "Week",
  MONTH: "Month",
};

const ProductivityDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get the end of the current week (Saturday)
  const currentWeek = moment().week();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [listWeeks, setListWeeks] = useState([`Week ${currentWeek}`]);
  const [visible, setVisible] = useState(true);
  const [quotas, setQuotas] = useState([]);
  const [quotasProductivity, setQuotasProductivity] = useState([]);
  const [quotasBDProductivity, setQuotasBDProductivity] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [pagination, setPaginatFion] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const [queryProductivity, setQueryProductivity] = useState({
    weeks: generateDescendingArray(currentWeek),
  });
  const [queryBDProductivity, setQueryBDProductivity] = useState({
    weeks: generateDescendingArray(currentWeek),
  });
  const [query, setQuery] = useState({
    week: currentWeek,
  });

  const [sorting, setSorting] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [trigerFetchProductivity, setTriggerFetchProductivity] =
    useState(false);
  const [trigerFetchBDProductivity, setTriggerFetchBDProductivity] =
    useState(false);
  const [loadingFetchDashboardSettings, setLoadingFetchDashboardSettings] =
    useState(false);
  const [loadingFetchTeamProductivity, setLoadingFetchTeamProductivity] =
    useState(false);
  const [loadingFetchBDTeamProductivity, setLoadingFetchBDTeamProductivity] =
    useState(false);
  const fetchDashboardQuota = async () => {
    setLoadingFetchDashboardSettings(true);
    const response = await dashboardServices.fetchQuotas({
      page: -1,
      query,
      limit: 30,
    });
    const { data, metadata } = response;
    if (data) {
      setQuotas(orderBy(data, ["no"], ["asc"]));
      setListWeeks(map(metadata?.currentAllWeeks, (week) => `Week ${week}`));
    } else {
      setQuotas([]);
    }
    setLoadingFetchDashboardSettings(false);
    setTrigger(false);
  };
  const fetchTeamProductivity = async () => {
    setLoadingFetchTeamProductivity(true);
    const response = await dashboardServices.fetchQuotas({
      page: -1,
      query: queryProductivity,
      limit: 30,
    });
    const { data } = response;
    if (data) {
      setQuotasProductivity(orderBy(data, ["no"], ["asc"]));
    } else {
      setQuotasProductivity([]);
    }
    setLoadingFetchTeamProductivity(false);
    setTriggerFetchProductivity(false);
  };
  const fetchBDTeamProductivity = async () => {
    setLoadingFetchBDTeamProductivity(true);
    const response = await dashboardServices.fetchQuotas({
      page: -1,
      query: queryProductivity,
      limit: 30,
    });
    const { data } = response;
    if (data) {
      setQuotasBDProductivity(orderBy(data, ["no"], ["asc"]));
    } else {
      setQuotasBDProductivity([]);
    }
    setLoadingFetchBDTeamProductivity(false);
    setTriggerFetchBDProductivity(false);
  };
  useEffect(() => {
    fetchDashboardQuota(pagination.currentPage);
  }, [search, query, trigger, sorting]);
  useEffect(() => {
    fetchTeamProductivity(pagination.currentPage);
  }, [queryProductivity, trigerFetchProductivity]);
  useEffect(() => {
    fetchBDTeamProductivity(pagination.currentPage);
  }, [queryBDProductivity, trigerFetchBDProductivity]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, navigate]);

  const [activeTab, setActiveTab] = useState(TABS_FILTER.WEEK);
  return (
    <>
      <Card
        className={styles.card}
        title="DASHBOARD - Setting"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
      >
        <Grid>
          <Grid.Col span="12">
            <Text align="center" size="xl" fw={700}>
              INPUT
            </Text>
          </Grid.Col>
          <Grid.Col span="12">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0px",
                gap: "10px",
                flexWrap: "wrap-reverse",
                width: "100%",
              }}
            >
              <Flex
                style={{
                  gap: "8px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#EFF0F1",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                <Select
                  data={listWeeks}
                  placeholder="Choose Week"
                  value={`Week ${query.week}`}
                  onChange={(value) => {
                    const realWeek = split(value, " ")[1];
                    setQuery({
                      ...query,
                      week: realWeek,
                    });
                  }}
                />
              </Flex>
            </div>
            <InputDashboard
              className={styles.Table}
              tableData={quotas}
              query={query}
              setQuery={setQuery}
              loadingFetchDashboardSettings={loadingFetchDashboardSettings}
              setTrigger={setTrigger}
              setSorting={setSorting}
              sorting={sorting}
            />
          </Grid.Col>
        </Grid>
      </Card>
      <Card
        className={styles.quotaCard}
        title="Năng suất"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
      >
        <Grid>
          <Grid.Col span="12">
            <Text align="center" size="xl" fw={700}>
              NĂNG SUẤT
            </Text>
          </Grid.Col>
          <Grid.Col span="12">
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              style={{
                width: "100%",
              }}
            >
              <Tabs.List>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0px",
                    gap: "10px",
                    flexWrap: "wrap-reverse",
                    width: "100%",
                  }}
                >
                  <Flex
                    style={{
                      gap: "8px",
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor: "#EFF0F1",
                      flexWrap: "wrap",
                      width: "100%",
                    }}
                  >
                    <Tabs.Tab
                      value={TABS_FILTER.WEEK}
                      styles={{
                        ...(activeTab === TABS_FILTER.WEEK && {
                          tab: {
                            backgroundColor: "#7C4DFF",
                            color: "#fff",
                            borderRadius: "10px",
                            borderColor: "transparent",
                          },
                        }),
                      }}
                    >
                      {TABS_FILTER.WEEK}
                    </Tabs.Tab>
                    <Tabs.Tab
                      value={TABS_FILTER.MONTH}
                      styles={{
                        ...(activeTab === TABS_FILTER.MONTH && {
                          tab: {
                            backgroundColor: "#7C4DFF",
                            color: "#fff",
                            borderRadius: "10px",
                            borderColor: "transparent",
                          },
                        }),
                      }}
                    >
                      {TABS_FILTER.MONTH}
                    </Tabs.Tab>
                  </Flex>
                </div>
              </Tabs.List>
              <Tabs.Panel value={TABS_FILTER.WEEK}>
                <ProductivityTable
                  className={styles.Table}
                  opData={quotasProductivity}
                  bdData={quotasBDProductivity}
                  opQuery={queryProductivity}
                  bdQuery={queryBDProductivity}
                  setOpQuery={setQueryProductivity}
                  setBDQuery={setQueryBDProductivity}
                  oploading={loadingFetchTeamProductivity}
                  bdloading={loadingFetchBDTeamProductivity}
                  setOPTrigger={setTriggerFetchProductivity}
                  setBDTrigger={setTriggerFetchBDProductivity}
                  setSorting={setSorting}
                  sorting={sorting}
                  weeks={listWeeks}
                />
              </Tabs.Panel>
              <Tabs.Panel value={TABS_FILTER.MONTH}>
                <ProductivityTable
                  className={styles.Table}
                  tableData={quotasProductivity}
                  query={queryProductivity}
                  setQuery={setQueryProductivity}
                  loading={loadingFetchTeamProductivity}
                  setTrigger={setTriggerFetchProductivity}
                  setSorting={setSorting}
                  sorting={sorting}
                  weeks={listWeeks}
                />
              </Tabs.Panel>
            </Tabs>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
};

export default ProductivityDashboard;
