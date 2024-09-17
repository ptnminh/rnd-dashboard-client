import React, { useEffect, useState } from "react";
import styles from "./Sellerboard.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import { Flex, Grid, Pagination, Tabs } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { amzServices } from "../../services";
import Table from "./Table";
import { isEmpty, omit, toLower, toNumber } from "lodash";
import SurvivalModeTable from "./SurvivalMode";

const TABS_VIEW = {
  Date: "Date",
  Week: "Week",
  Month: "Month",
  SURVIVAL: "Survival",
};

const Sellerboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [isConfirmedQuery, setIsConfirmedQuery] = useState(true);
  const [saleMetrics, setSaleMetrics] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const [query, setQuery] = useState({
    groupByKey: toLower(TABS_VIEW.Date),
    stores: "PFH,QZL,GGT",
    storeValues: ["PFH", "QZL", "GGT"],
    fulfillmentChannel: "FBA,FBM",
    fulfillmentChannelValues: ["FBA", "FBM"],
  });
  const [sorting, setSorting] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [loadingFetchSaleMetrics, setLoadingFetchSaleMetrics] = useState(true);

  const fetchSaleMetrics = async (page) => {
    setLoadingFetchSaleMetrics(true);
    const response = await amzServices.fetchSaleMetrics({
      page,
      query: omit(
        {
          ...query,
          // ignore ordersInRange if salesStartDate and salesEndDate are not provided and vice versa
          ...(query?.ordersInRange &&
            query?.startDate &&
            query?.endDate && {
              startDate: query.startDate,
              endDate: query.endDate,
              ordersInRange: toNumber(query.ordersInRange),
            }),
        },
        [
          "sortValue",
          "storeValues",
          "dateValue",
          "isConfirmed",
          "fulfillmentChannelValues",
          "salesDateValue",
        ]
      ),
      limit: 10,
      sorting,
    });
    const { data, metaData } = response;
    if (data) {
      setSaleMetrics(data);
      setPagination({
        currentPage: toNumber(metaData.currentPage),
        totalPages: toNumber(metaData.totalPages),
      });
    } else {
      setSaleMetrics([]);
    }
    setIsConfirmedQuery(false);
    setLoadingFetchSaleMetrics(false);
    setTrigger(false);
  };
  useEffect(() => {
    if (isConfirmedQuery) {
      fetchSaleMetrics(pagination.currentPage);
    }
  }, [
    search,
    query,
    trigger,
    sorting,
    pagination.currentPage,
    isConfirmedQuery,
  ]);

  // listen sorting change set isConfirmedQuery to true for refetch data
  useEffect(() => {
    if (!isEmpty(sorting)) {
      setIsConfirmedQuery(true);
    }
  }, [sorting]);

  // listen pagination change set isConfirmedQuery to true for refetch data
  useEffect(() => {
    if (pagination.currentPage > 1) {
      setIsConfirmedQuery(true);
    }
  }, [pagination.currentPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, navigate]);

  const [activeTab, setActiveTab] = useState(TABS_VIEW.Date);

  useEffect(() => {
    if (!isEmpty(saleMetrics)) {
      // TODO: Implement the logic for survival mode
      setQuery({
        groupByKey: activeTab === "Survival" ? "date" : toLower(activeTab),
        stores: "PFH,QZL,GGT",
        storeValues: ["PFH", "QZL", "GGT"],
        fulfillmentChannelValues: ["FBA", "FBM"],
        fulfillmentChannel: "FBA,FBM",
      });
      setPagination({
        currentPage: 1,
        totalPages: 1,
      });
      setIsConfirmedQuery(true);
    }
  }, [activeTab]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Card
        className={styles.card}
        title="AMZ Sellerboard"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
      >
        <Grid>
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
                      value={TABS_VIEW.Date}
                      styles={{
                        ...(activeTab === TABS_VIEW.Date && {
                          tab: {
                            backgroundColor: "#7C4DFF",
                            color: "#fff",
                            borderRadius: "10px",
                            borderColor: "transparent",
                          },
                        }),
                      }}
                    >
                      {TABS_VIEW.Date}
                    </Tabs.Tab>
                    <Tabs.Tab
                      value={TABS_VIEW.Week}
                      styles={{
                        ...(activeTab === TABS_VIEW.Week && {
                          tab: {
                            backgroundColor: "#7C4DFF",
                            color: "#fff",
                            borderRadius: "10px",
                            borderColor: "transparent",
                          },
                        }),
                      }}
                    >
                      {TABS_VIEW.Week}
                    </Tabs.Tab>
                    <Tabs.Tab
                      value={TABS_VIEW.Month}
                      styles={{
                        ...(activeTab === TABS_VIEW.Month && {
                          tab: {
                            backgroundColor: "#7C4DFF",
                            color: "#fff",
                            borderRadius: "10px",
                            borderColor: "transparent",
                          },
                        }),
                      }}
                    >
                      {TABS_VIEW.Month}
                    </Tabs.Tab>
                  </Flex>
                  <Flex
                    style={{
                      gap: "8px",
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor: "#EFF0F1",
                    }}
                  >
                    <Tabs.Tab
                      value={TABS_VIEW.SURVIVAL}
                      styles={{
                        ...(activeTab === TABS_VIEW.SURVIVAL && {
                          tab: {
                            backgroundColor: "#7C4DFF",
                            color: "#fff",
                            borderRadius: "10px",
                            borderColor: "transparent",
                          },
                        }),
                      }}
                    >
                      {TABS_VIEW.SURVIVAL}
                    </Tabs.Tab>
                  </Flex>
                </div>
              </Tabs.List>
              <Tabs.Panel value={TABS_VIEW.Date}>
                <Table
                  className={styles.Table}
                  tableData={saleMetrics}
                  query={query}
                  setQuery={setQuery}
                  loading={loadingFetchSaleMetrics}
                  setTrigger={setTrigger}
                  setSorting={setSorting}
                  sorting={sorting}
                  activeTab={activeTab}
                  setIsConfirmedQuery={setIsConfirmedQuery}
                />
                <Pagination
                  total={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="pink"
                  size="md"
                  style={{ marginTop: "20px", marginRight: "auto" }}
                />
              </Tabs.Panel>
              <Tabs.Panel value={TABS_VIEW.Week}>
                <Table
                  className={styles.Table}
                  tableData={saleMetrics}
                  query={query}
                  setQuery={setQuery}
                  loading={loadingFetchSaleMetrics}
                  setTrigger={setTrigger}
                  setSorting={setSorting}
                  sorting={sorting}
                  activeTab={activeTab}
                  setIsConfirmedQuery={setIsConfirmedQuery}
                />
                <Pagination
                  total={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="pink"
                  size="md"
                  style={{ marginTop: "20px", marginRight: "auto" }}
                />
              </Tabs.Panel>
              <Tabs.Panel value={TABS_VIEW.Month}>
                <Table
                  className={styles.Table}
                  tableData={saleMetrics}
                  query={query}
                  setQuery={setQuery}
                  loading={loadingFetchSaleMetrics}
                  setTrigger={setTrigger}
                  setSorting={setSorting}
                  sorting={sorting}
                  activeTab={activeTab}
                  setIsConfirmedQuery={setIsConfirmedQuery}
                />
                <Pagination
                  total={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="pink"
                  size="md"
                  style={{ marginTop: "20px", marginRight: "auto" }}
                />
              </Tabs.Panel>
              <Tabs.Panel value={TABS_VIEW.SURVIVAL}>
                <SurvivalModeTable
                  className={styles.Table}
                  tableData={saleMetrics}
                  query={query}
                  setQuery={setQuery}
                  loading={loadingFetchSaleMetrics}
                  setTrigger={setTrigger}
                  setSorting={setSorting}
                  sorting={sorting}
                  activeTab={activeTab}
                />
                <Pagination
                  total={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="pink"
                  size="md"
                  style={{ marginTop: "20px", marginRight: "auto" }}
                />
              </Tabs.Panel>
            </Tabs>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
};

export default Sellerboard;
