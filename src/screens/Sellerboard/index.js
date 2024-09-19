import React, { useEffect, useRef, useState } from "react";
import styles from "./Sellerboard.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import {
  Affix,
  Button,
  Flex,
  Grid,
  rem,
  Tabs,
  Transition,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { amzServices } from "../../services";
import Table from "./Table";
import { debounce, isEmpty, omit, set, toLower, toNumber } from "lodash";
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
  const endDate = moment().tz("America/Los_Angeles").format("YYYY-MM-DD");
  const [query, setQuery] = useState({
    groupByKey: toLower(TABS_VIEW.Date),
    stores: "PFH,QZL,GGT",
    storeValues: ["PFH", "QZL", "GGT"],
    fulfillmentChannel: "FBA,FBM",
    fulfillmentChannelValues: ["FBA", "FBM"],
    ordersInRange: 1,
    salesDateValue: [new Date(startDate), new Date(endDate)],
    startDate,
    endDate,
  });
  const [survivalModeQuery, setSurvivalModeQuery] = useState({
    groupByKey: "date",
    stores: "PFH,QZL,GGT",
    storeValues: ["PFH", "QZL", "GGT"],
    salesDateValue: [new Date(oneMonthAgo), new Date(endDate)],
    startDate,
    endDate,
  });
  const [sorting, setSorting] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [loadingFetchSaleMetrics, setLoadingFetchSaleMetrics] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
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
      limit: 50,
      sorting,
    });
    const { data, metaData } = response;
    if (data) {
      setSaleMetrics((prev) => [...prev, ...data]);
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
  const fetchSaleMetricsForSurvivalMode = async (page) => {
    setLoadingFetchSaleMetrics(true);
    const response = await amzServices.fetchSurvivalModeSaleMetrics({
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
          groupByKey: "date",
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
      setSaleMetrics((prev) => [...prev, ...data]);
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
    if (isConfirmedQuery && activeTab !== TABS_VIEW.SURVIVAL) {
      fetchSaleMetrics(pagination.currentPage);
    }
  }, [search, query, trigger, sorting, isConfirmedQuery]);

  // listen sorting change set isConfirmedQuery to true for refetch data
  useEffect(() => {
    if (!isEmpty(sorting)) {
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
    if (!isEmpty(saleMetrics)) {
      setSaleMetrics([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
      });
      if (activeTab === TABS_VIEW.SURVIVAL) {
        setSurvivalModeQuery({
          groupByKey: "date",
          stores: "PFH,QZL,GGT",
          storeValues: ["PFH", "QZL", "GGT"],
          salesDateValue: [new Date(oneMonthAgo), new Date(endDate)],
          startDate,
          endDate,
        });
        fetchSaleMetricsForSurvivalMode(pagination.currentPage);
      } else {
        setQuery({
          groupByKey: toLower(activeTab),
          stores: "PFH,QZL,GGT",
          storeValues: ["PFH", "QZL", "GGT"],
          fulfillmentChannelValues: ["FBA", "FBM"],
          fulfillmentChannel: "FBA,FBM",
          ...(activeTab === TABS_VIEW.Date && {
            ordersInRange: 1,
            salesDateValue: [new Date(startDate), new Date(endDate)],
            startDate,
            endDate,
          }),
        });
      }
      setIsConfirmedQuery(true);
    }
  }, [activeTab]);

  // Inside Sellerboard Component
  const listInnerRef = useRef(null); // Create a reference to the scrollable element

  // Update useEffect to handle scrolling and load more data
  useEffect(() => {
    // Debounced scroll handler
    const handleScroll = debounce(() => {
      if (
        listInnerRef.current &&
        listInnerRef.current.getBoundingClientRect().bottom <=
          window.innerHeight + 50
      ) {
        // Check if scrolled near the bottom
        if (
          !loadingFetchSaleMetrics &&
          !isFetching &&
          pagination.currentPage < pagination.totalPages
        ) {
          setIsFetching(true);
          setPagination((prev) => ({
            ...prev,
            currentPage: prev.currentPage + 1,
          }));
          setIsConfirmedQuery(true);
        }
      }
    }, 200); // Adjust the debounce delay as needed

    window.addEventListener("scroll", handleScroll); // Attach scroll event listener

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up listener on component unmount
    };
  }, [loadingFetchSaleMetrics, pagination.currentPage]);
  useEffect(() => {
    if (!loadingFetchSaleMetrics) {
      setIsFetching(false); // Reset fetching flag when API call is complete
    }
  }, [loadingFetchSaleMetrics]);
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <>
      <div ref={listInnerRef}>
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
                  {activeTab === TABS_VIEW.Date && (
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
                  )}
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.Week}>
                  {activeTab === TABS_VIEW.Week && (
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
                  )}
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.Month}>
                  {activeTab === TABS_VIEW.Month && (
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
                  )}
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.SURVIVAL}>
                  {activeTab === TABS_VIEW.SURVIVAL && (
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
                    />
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
