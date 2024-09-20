import React, { useEffect, useRef, useState } from "react";
import styles from "./Sellerboard.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import {
  Affix,
  Button,
  Flex,
  Grid,
  Loader,
  rem,
  Switch,
  Tabs,
  Transition,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { amzServices } from "../../services";
import Table from "./Table";
import { isEmpty, omit, toLower, toNumber } from "lodash";
import SurvivalModeTable from "./SurvivalMode";
import moment from "moment-timezone";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

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
  const [isLoadmore, setIsLoadmore] = useState(false);
  const [saleMetrics, setSaleMetrics] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const startDate = moment()
    .tz("America/Los_Angeles")
    .subtract(7, "days")
    .format("YYYY-MM-DD");
  const oneMonthAgo = moment()
    .tz("America/Los_Angeles")
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const isMounted = useRef(false);
  const currentWeek = moment().tz("America/Los_Angeles").week();
  const currentMonth = moment().tz("America/Los_Angeles").month();
  const currentYear = moment().tz("America/Los_Angeles").year();
  const endDate = moment().tz("America/Los_Angeles").format("YYYY-MM-DD");
  const [query, setQuery] = useState({
    groupByKey: toLower(TABS_VIEW.Date),
    stores: "PFH,QZL,GGT",
    storeValues: ["PFH", "QZL", "GGT"],
    fulfillmentChannel: "FBA,FBM",
    fulfillmentChannelValues: ["FBA", "FBM"],
    minOrders: 1,
    salesDateValue: [new Date(startDate), new Date(endDate)],
    startDate,
    endDate,
  });
  const [survivalModeQuery, setSurvivalModeQuery] = useState({
    groupByKey: "date",
    stores: "PFH,QZL,GGT",
    storeValues: ["PFH", "QZL", "GGT"],
    createdDateValue: [new Date(oneMonthAgo), new Date(endDate)],
    startDate: oneMonthAgo,
    endDate,
    values: [1, 2, 3, 4],
    textValue: ["Small", "Medium", "Big", "Super Big"],
  });
  const [sorting, setSorting] = useState([
    {
      id: moment(endDate).format("DD MMM YY"),
      desc: true,
    },
  ]);
  const [trigger, setTrigger] = useState(false);
  const [loadingFetchSaleMetrics, setLoadingFetchSaleMetrics] = useState(true);
  const fetchSaleMetrics = async (page) => {
    setLoadingFetchSaleMetrics(true);
    const response = await amzServices.fetchSaleMetrics({
      page,
      query: omit(
        {
          ...query,
          ...(query?.ordersInRange &&
            query?.startDate &&
            query?.endDate && {
              startDate: query.startDate,
              endDate: query.endDate,
              ordersInRange: toNumber(query.ordersInRange),
            }),
          ...(query?.minOrders && {
            minOrders: toNumber(query.minOrders),
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
      limit: 50,
      sorting,
    });
    const { data, metaData } = response;
    if (data) {
      if (isLoadmore) {
        setSaleMetrics((prev) => [...prev, ...data]);
      } else {
        setSaleMetrics(data);
      }
      setPagination({
        currentPage: toNumber(metaData.currentPage) || 1,
        totalPages: toNumber(metaData.totalPages) || 1,
      });
    } else {
      setSaleMetrics([]);
    }
    setIsConfirmedQuery(false);
    setIsLoadmore(false);
    setLoadingFetchSaleMetrics(false);
    setTrigger(false);
  };
  const fetchSaleMetricsForSurvivalMode = async (page) => {
    setLoadingFetchSaleMetrics(true);
    const response = await amzServices.fetchSurvivalModeSaleMetrics({
      page,
      query: omit(
        {
          ...survivalModeQuery,
          groupByKey: "date",
        },
        [
          "sortValue",
          "storeValues",
          "dateValue",
          "isConfirmed",
          "fulfillmentChannelValues",
          "salesDateValue",
          "value",
        ]
      ),
      limit: 50,
      sorting,
    });
    const { data, metaData } = response;
    if (data) {
      if (isLoadmore) {
        setSaleMetrics((prev) => [...prev, ...data]);
      } else {
        setSaleMetrics(data);
      }
      setPagination({
        currentPage: toNumber(metaData.currentPage) || 1,
        totalPages: toNumber(metaData.totalPages) || 1,
      });
    } else {
      setSaleMetrics([]);
    }
    setIsConfirmedQuery(false);
    setLoadingFetchSaleMetrics(false);
    setTrigger(false);
    setIsLoadmore(false);
  };
  useEffect(() => {
    if (isConfirmedQuery && activeTab !== TABS_VIEW.SURVIVAL) {
      fetchSaleMetrics(pagination.currentPage);
    }
  }, [
    search,
    query,
    trigger,
    sorting,
    isConfirmedQuery,
    pagination.currentPage,
  ]);
  useEffect(() => {
    if (isConfirmedQuery && activeTab === TABS_VIEW.SURVIVAL) {
      fetchSaleMetricsForSurvivalMode(pagination.currentPage);
    }
  }, [survivalModeQuery, isConfirmedQuery, pagination.currentPage]);

  // listen sorting change set isConfirmedQuery to true for refetch data
  useEffect(() => {
    if (!isEmpty(sorting)) {
      setPagination({
        ...pagination,
        currentPage: 1,
      });
      setIsConfirmedQuery(true);
    }
  }, [sorting]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, navigate]);
  const [activeTab, setActiveTab] = useState(TABS_VIEW.Date);
  useEffect(() => {
    if (isMounted.current) {
      setSaleMetrics([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
      });
      if (activeTab === TABS_VIEW.SURVIVAL) {
        setSorting([{ id: "value", desc: true }]);
        setSurvivalModeQuery({
          groupByKey: "date",
          stores: "PFH,QZL,GGT",
          storeValues: ["PFH", "QZL", "GGT"],
          createdDateValue: [new Date(oneMonthAgo), new Date(endDate)],
          startDate: oneMonthAgo,
          endDate,
          values: [1, 2, 3, 4],
          textValue: ["Small", "Medium", "Big", "Super Big"],
        });
      } else {
        let customSorting = [];
        switch (activeTab) {
          case TABS_VIEW.Date:
            customSorting = [
              {
                id: moment(endDate).format("DD MMM YY"),
                desc: true,
              },
            ];
            break;
          case TABS_VIEW.Week:
            customSorting = [
              {
                id: `W${currentWeek} ${currentYear}`,
                desc: true,
              },
            ];
            break;
          case TABS_VIEW.Month:
            customSorting = [
              {
                id: `${moment(endDate).format("MMM")} ${currentYear}`,
                desc: true,
              },
            ];
            break;
          default:
        }
        setSorting(customSorting);
        setQuery({
          groupByKey: toLower(activeTab),
          stores: "PFH,QZL,GGT",
          storeValues: ["PFH", "QZL", "GGT"],
          fulfillmentChannelValues: ["FBA", "FBM"],
          fulfillmentChannel: "FBA,FBM",
          ...(activeTab === TABS_VIEW.Date && {
            minOrders: 1,
            salesDateValue: [new Date(startDate), new Date(endDate)],
            startDate,
            endDate,
          }),
        });
      }
      setIsConfirmedQuery(true);
    } else {
      isMounted.current = true;
    }
  }, [activeTab]);

  const [scroll, scrollTo] = useWindowScroll();
  return (
    <>
      <div>
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
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Switch
                        checked={activeTab === TABS_VIEW.SURVIVAL}
                        label={TABS_VIEW.SURVIVAL}
                        onChange={(event) => {
                          const value = event.currentTarget.checked;
                          setActiveTab(
                            value ? TABS_VIEW.SURVIVAL : TABS_VIEW.Date
                          );
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </Flex>
                  </div>
                </Tabs.List>
                <Tabs.Panel value={TABS_VIEW.Date}>
                  {activeTab === TABS_VIEW.Date && !isEmpty(saleMetrics) ? (
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
                      setPagination={setPagination}
                      pagination={pagination}
                      setIsLoadmore={setIsLoadmore}
                    />
                  ) : (
                    loadingFetchSaleMetrics && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          height: "100%",
                          marginTop: "20px",
                        }}
                      >
                        <Loader size={30} />
                      </div>
                    )
                  )}
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.Week}>
                  {activeTab === TABS_VIEW.Week && !isEmpty(saleMetrics) ? (
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
                      setPagination={setPagination}
                      pagination={pagination}
                      setIsLoadmore={setIsLoadmore}
                    />
                  ) : (
                    loadingFetchSaleMetrics && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          height: "100%",
                          marginTop: "20px",
                        }}
                      >
                        <Loader size={30} />
                      </div>
                    )
                  )}
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.Month}>
                  {activeTab === TABS_VIEW.Month && !isEmpty(saleMetrics) ? (
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
                      setPagination={setPagination}
                      pagination={pagination}
                      setIsLoadmore={setIsLoadmore}
                    />
                  ) : (
                    loadingFetchSaleMetrics && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          height: "100%",
                          marginTop: "20px",
                        }}
                      >
                        <Loader size={30} />
                      </div>
                    )
                  )}
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.SURVIVAL}>
                  {activeTab === TABS_VIEW.SURVIVAL && !isEmpty(saleMetrics) ? (
                    <SurvivalModeTable
                      className={styles.Table}
                      tableData={saleMetrics}
                      query={survivalModeQuery}
                      setQuery={setSurvivalModeQuery}
                      loading={loadingFetchSaleMetrics}
                      setTrigger={setTrigger}
                      setSorting={setSorting}
                      sorting={sorting}
                      activeTab={activeTab}
                      setPagination={setPagination}
                      pagination={pagination}
                      setIsConfirmedQuery={setIsConfirmedQuery}
                      setIsLoadmore={setIsLoadmore}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        marginTop: "20px",
                      }}
                    >
                      <Loader size={30} />
                    </div>
                  )}
                </Tabs.Panel>
              </Tabs>
            </Grid.Col>
          </Grid>
        </Card>
      </div>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              leftSection={
                <IconArrowUp style={{ width: rem(16), height: rem(16) }} />
              }
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  );
};

export default Sellerboard;
