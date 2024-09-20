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
  MultiSelect,
  rem,
  Select,
  Switch,
  Tabs,
  TextInput,
  Transition,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { amzServices } from "../../services";
import Table from "./Table";
import { filter, isEmpty, join, omit, toLower, toNumber, values } from "lodash";
import SurvivalModeTable from "./SurvivalMode";
import moment from "moment-timezone";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp, IconFilterOff } from "@tabler/icons-react";
import { AMZ_SORTING, AMZ_STORES, FULFILLMENT_CHANNELS } from "../../constant";
import { arraysMatchUnordered } from "../../utils";
import { DateRangePicker } from "rsuite";

const TABS_VIEW = {
  Date: "Date",
  Week: "Week",
  Month: "Month",
  SURVIVAL: "Survival",
};

const FilterNormalModeHeader = ({
  query,
  setQuery,
  activeTab,
  setIsLoadmore,
  setPagination,
  setIsConfirmedQuery,
  loading,
  pagination,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 5px",
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
        <MultiSelect
          placeholder="Store"
          data={AMZ_STORES}
          styles={{
            input: {
              width: "130px",
              minHeight: "35px",
            },
            inputField: {
              display: "none",
            },
          }}
          value={
            arraysMatchUnordered(query?.storeValues, ["PFH", "QZL", "GGT"])
              ? ["All"]
              : query?.storeValues || []
          }
          onChange={(value) => {
            if (value.length === 1 && value[0] === "All") {
              const newValues = ["PFH", "QZL", "GGT"];
              setQuery({
                ...query,
                stores: join(newValues, ","),
                storeValues: newValues,
              });
            } else {
              const realValues = filter(value, (v) => v !== "All");
              setQuery({
                ...query,
                stores: join(realValues, ","),
                storeValues: realValues,
              });
            }
          }}
          clearable
          onClear={() => {
            setQuery({
              ...query,
              stores: null,
              storeValues: [],
            });
          }}
        />
        <MultiSelect
          placeholder="Channel"
          data={FULFILLMENT_CHANNELS}
          styles={{
            input: {
              width: "130px",
              minHeight: "35px",
            },
            inputField: {
              display: "none",
            },
          }}
          value={
            arraysMatchUnordered(query?.fulfillmentChannelValues, [
              "FBA",
              "FBM",
            ])
              ? ["All"]
              : query?.fulfillmentChannelValues || []
          }
          onChange={(value) => {
            if (value.length === 1 && value[0] === "All") {
              const newValues = ["FBA", "FBM"];
              setQuery({
                ...query,
                fulfillmentChannel: join(newValues, ","),
                fulfillmentChannelValues: newValues,
              });
            } else {
              const realValues = filter(value, (v) => v !== "All");
              setQuery({
                ...query,
                fulfillmentChannel: join(realValues, ","),
                fulfillmentChannelValues: realValues,
              });
            }
          }}
          clearable
          onClear={() => {
            setQuery({
              ...query,
              fulfillmentChannel: null,
              fulfillmentChannelValues: [],
            });
          }}
        />
        {activeTab === "Date" && (
          <DateRangePicker
            size="sx"
            // label="Created Date"
            placeholder="Date"
            style={{
              width: "100px",
            }}
            value={query.dateValue}
            onOk={(value) =>
              setQuery({
                ...query,
                dateValue: value,
                startCreatedDate: moment(value[0]).format("YYYY-MM-DD"),
                endCreatedDate: moment(value[1]).format("YYYY-MM-DD"),
              })
            }
            onClean={() => {
              setQuery({
                ...query,
                dateValue: null,
                startCreatedDate: null,
                endCreatedDate: null,
              });
            }}
            onShortcutClick={(shortcut) => {
              setQuery({
                ...query,
                dateValue: shortcut.value,
                startCreatedDate: moment(shortcut.value[0]).format(
                  "YYYY-MM-DD"
                ),
                endCreatedDate: moment(shortcut.value[1]).format("YYYY-MM-DD"),
              });
            }}
          />
        )}
        {activeTab === "Week" && (
          <DateRangePicker
            size="sx"
            // label="Created Date"
            showWeekNumbers
            hoverRange="week"
            isoWeek
            placeholder="Week"
            style={{
              width: "100px",
            }}
            value={query.dateValue}
            onOk={(value) =>
              setQuery({
                ...query,
                dateValue: value,
                startCreatedDate: moment(value[0]).format("YYYY-MM-DD"),
                endCreatedDate: moment(value[1]).format("YYYY-MM-DD"),
              })
            }
            onClean={() => {
              setQuery({
                ...query,
                dateValue: null,
                startCreatedDate: null,
                endCreatedDate: null,
              });
            }}
            onShortcutClick={(shortcut, event) => {
              setQuery({
                ...query,
                dateValue: shortcut.value,
                startCreatedDate: moment(shortcut.value[0]).format(
                  "YYYY-MM-DD"
                ),
                endCreatedDate: moment(shortcut.value[1]).format("YYYY-MM-DD"),
              });
            }}
          />
        )}
        {activeTab === "Month" && (
          <DateRangePicker
            size="sx"
            // label="Created Date"
            showMonthNumbers
            hoverRange="month"
            isoWeek
            placeholder="Month"
            style={{
              width: "100px",
            }}
            value={query.dateValue}
            onOk={(value) =>
              setQuery({
                ...query,
                dateValue: value,
                startCreatedDate: moment(value[0]).format("YYYY-MM-DD"),
                endCreatedDate: moment(value[1]).format("YYYY-MM-DD"),
              })
            }
            onClean={() => {
              setQuery({
                ...query,
                dateValue: null,
                startCreatedDate: null,
                endCreatedDate: null,
              });
            }}
            onShortcutClick={(shortcut, event) => {
              setQuery({
                ...query,
                dateValue: shortcut.value,
                startCreatedDate: moment(shortcut.value[0]).format(
                  "YYYY-MM-DD"
                ),
                endCreatedDate: moment(shortcut.value[1]).format("YYYY-MM-DD"),
              });
            }}
          />
        )}
        {activeTab === "Date" && (
          <>
            <DateRangePicker
              size="sx"
              // label="Sales Date"
              placeholder="Sales Date"
              style={{
                width: "100px",
              }}
              value={query.salesDateValue}
              onOk={(value) => {
                setQuery({
                  ...query,
                  salesDateValue: value,
                  startDate: moment(value[0]).format("YYYY-MM-DD"),
                  endDate: moment(value[1]).format("YYYY-MM-DD"),
                  minOrders: 1,
                });
              }}
              onOpen={() => {
                console.log("open");
              }}
              onClean={() => {
                setQuery({
                  ...query,
                  salesDateValue: null,
                  startDate: null,
                  endDate: null,
                  minOrders: "",
                });
              }}
              onShortcutClick={(shortcut) => {
                setQuery({
                  ...query,
                  salesDateValue: shortcut.value,
                  startDate: moment(shortcut.value[0]).format("YYYY-MM-DD"),
                  endDate: moment(shortcut.value[1]).format("YYYY-MM-DD"),
                  minOrders: 1,
                });
              }}
            />
            <TextInput
              placeholder="Min Orders"
              style={{
                width: "90px",
              }}
              value={query?.minOrders}
              onChange={(event) => {
                setQuery({
                  ...query,
                  minOrders: event.target.value,
                });
              }}
            />
          </>
        )}
        <Select
          placeholder="Sorting"
          data={values(AMZ_SORTING)}
          styles={{
            input: {
              width: "150px",
            },
          }}
          value={query?.sortValue || null}
          onChange={(value) => {
            let primarySortBy = "";
            let primarySortDir = "";
            switch (value) {
              case AMZ_SORTING.ordersAsc:
                primarySortBy = "totalOrders";
                primarySortDir = "asc";
                break;
              case AMZ_SORTING.ordersDesc:
                primarySortBy = "totalOrders";
                primarySortDir = "desc";
                break;
              case AMZ_SORTING.saleInRangeAsc:
                primarySortBy = "ordersInRange";
                primarySortDir = "asc";
                break;
              case AMZ_SORTING.saleInRangeDesc:
                primarySortBy = "ordersInRange";
                primarySortDir = "desc";
                break;
              case AMZ_SORTING.createdDateAsc:
                primarySortBy = "createdDate";
                primarySortDir = "asc";
                break;
              case AMZ_SORTING.createdDateDesc:
                primarySortBy = "createdDate";
                primarySortDir = "desc";
                break;
              default:
                value = null;
            }
            setQuery({
              ...query,
              sortValue: value,
              primarySortBy,
              primarySortDir,
            });
          }}
          clearable
          searchable
          onClear={() => {
            setQuery({
              ...query,
              sortValue: null,
              primarySortBy: null,
              primarySortDir: null,
            });
          }}
        />
        <Button
          loading={loading}
          onClick={() => {
            setIsLoadmore(false);
            setPagination({
              ...pagination,
              currentPage: 1,
            });
            setIsConfirmedQuery(true);
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            setIsConfirmedQuery(true);
            setPagination({
              ...pagination,
              currentPage: 1,
            });
            setQuery({
              stores: null,
              fulfillmentChannel: null,
              fulfillmentChannelValues: [],
              sortValue: null,
              sortBy: null,
              sortDir: null,
              storeValues: [],
              dateValue: null,
              startDate: null,
              endDate: null,
              primarySortBy: null,
              primarySortDir: null,
              salesDateValue: null,
              startCreatedDate: null,
              endCreatedDate: null,
              minOrders: "",
            });
          }}
        >
          <IconFilterOff />
        </Button>
      </Flex>
    </div>
  );
};
const FilterSurvivalModeHeader = ({
  query,
  setQuery,
  activeTab,
  setIsLoadmore,
  setPagination,
  setIsConfirmedQuery,
  loading,
  pagination,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 5px",
        gap: "10px",
        flexWrap: "wrap-reverse",
      }}
    >
      <Flex
        style={{
          gap: "8px",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: "#EFF0F1",
          flexWrap: "wrap",
        }}
      >
        <DateRangePicker
          size="sx"
          placeholder="Created Date"
          style={{
            width: "200px",
          }}
          value={query.createdDateValue}
          onOk={(value) => {
            setQuery({
              ...query,
              createdDateValue: value,
              startDate: moment(value[0]).format("YYYY-MM-DD"),
              endDate: moment(value[1]).format("YYYY-MM-DD"),
            });
          }}
          onOpen={() => {
            console.log("open");
          }}
          onClean={() => {
            setQuery({
              ...query,
              createdDateValue: null,
              startDate: null,
              endDate: null,
            });
          }}
          onShortcutClick={(shortcut) => {
            setQuery({
              ...query,
              createdDateValue: shortcut.value,
              startDate: moment(shortcut.value[0]).format("YYYY-MM-DD"),
              endDate: moment(shortcut.value[1]).format("YYYY-MM-DD"),
            });
          }}
        />
        <Button
          loading={loading}
          onClick={() => {
            setIsLoadmore(false);
            setPagination({
              ...pagination,
              currentPage: 1,
            });
            setIsConfirmedQuery(true);
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            setIsConfirmedQuery(true);
            setPagination({
              ...pagination,
              currentPage: 1,
            });
            setQuery({
              stores: null,
              fulfillmentChannel: [],
              sortValue: null,
              sortBy: null,
              sortDir: null,
              storeValues: [],
              dateValue: null,
              startDate: null,
              endDate: null,
              primarySortBy: null,
              primarySortDir: null,
              createdDateValue: null,
              salesStartDate: null,
              salesEndDate: null,
              ordersInRange: "",
            });
          }}
        >
          <IconFilterOff />
        </Button>
      </Flex>
    </div>
  );
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
                  {activeTab === TABS_VIEW.Date && !isEmpty(saleMetrics) && (
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
                  )}
                  {loadingFetchSaleMetrics && (
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
                  {isEmpty(saleMetrics) && !loadingFetchSaleMetrics && (
                    <FilterNormalModeHeader
                      query={query}
                      setQuery={setQuery}
                      activeTab={activeTab}
                      setIsLoadmore={setIsLoadmore}
                      setPagination={setPagination}
                      setIsConfirmedQuery={setIsConfirmedQuery}
                      loading={loadingFetchSaleMetrics}
                      pagination={pagination}
                    />
                  )}
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.Week}>
                  {activeTab === TABS_VIEW.Week && !isEmpty(saleMetrics) && (
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
                  )}
                  {loadingFetchSaleMetrics && (
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
                  {isEmpty(saleMetrics) && !loadingFetchSaleMetrics && (
                    <FilterNormalModeHeader
                      query={query}
                      setQuery={setQuery}
                      activeTab={activeTab}
                      setIsLoadmore={setIsLoadmore}
                      setPagination={setPagination}
                      setIsConfirmedQuery={setIsConfirmedQuery}
                      loading={loadingFetchSaleMetrics}
                      pagination={pagination}
                    />
                  )}
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.Month}>
                  {activeTab === TABS_VIEW.Month && !isEmpty(saleMetrics) && (
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
                  )}
                  {loadingFetchSaleMetrics && (
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
                  {isEmpty(saleMetrics) && !loadingFetchSaleMetrics && (
                    <FilterNormalModeHeader
                      query={query}
                      setQuery={setQuery}
                      activeTab={activeTab}
                      setIsLoadmore={setIsLoadmore}
                      setPagination={setPagination}
                      setIsConfirmedQuery={setIsConfirmedQuery}
                      loading={loadingFetchSaleMetrics}
                      pagination={pagination}
                    />
                  )}
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.SURVIVAL}>
                  {activeTab === TABS_VIEW.SURVIVAL &&
                    !isEmpty(saleMetrics) && (
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
                    )}
                  {loadingFetchSaleMetrics && (
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
                  {isEmpty(saleMetrics) && !loadingFetchSaleMetrics && (
                    <FilterSurvivalModeHeader
                      query={survivalModeQuery}
                      setQuery={setSurvivalModeQuery}
                      activeTab={activeTab}
                      setIsLoadmore={setIsLoadmore}
                      setPagination={setPagination}
                      setIsConfirmedQuery={setIsConfirmedQuery}
                      loading={loadingFetchSaleMetrics}
                      pagination={pagination}
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
