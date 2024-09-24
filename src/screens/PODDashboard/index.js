import React, { useEffect, useRef, useState } from "react";
import styles from "./PODDashboard.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import {
  Affix,
  Button,
  Checkbox,
  Flex,
  Grid,
  Group,
  Loader,
  Radio,
  rem,
  Select,
  Switch,
  Tabs,
  Text,
  Transition,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { dashboardServices } from "../../services";
import Table from "./Table";
import { isEmpty, keys, map, omit, toLower, toNumber, values } from "lodash";
import moment from "moment-timezone";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
  VALUES,
} from "../../utils";

const TABS_VIEW = {
  Date: "Date",
  Week: "Week",
  Month: "Month",
  SURVIVAL: "Survival",
};

const TARGET_DATES = {
  THREE_DAYS: "3 Days",
  SEVEN_DAYS: "7 Days",
  FOURTEEN_DAYS: "14 Days",
};

const DEFAULT_SORTING = {
  CREATED_DATE_DESC: "Created Date (Newest)",
  CREATED_DATE_ASC: "Created Date (Oldest)",
  TOTAL_DESC: "Total Orders (A-Z)",
  TOTAL_ASC: "Total Orders (Z-A)",
};
const TARGET_DATA = {
  ORDERS: "Orders",
  PROFIT: "Profit",
};

const PODDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [isLoadmore, setIsLoadmore] = useState(false);
  const [saleMetrics, setSaleMetrics] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });

  const isMounted = useRef(false);
  const currentWeek = moment().tz("America/Los_Angeles").week();
  const currentYear = moment().tz("America/Los_Angeles").year();
  const endDate = moment().tz("America/Los_Angeles").format("YYYY-MM-DD");
  const [query, setQuery] = useState({
    groupByKey: toLower(TABS_VIEW.Date),
    dateRange: 3,
    targetDate: TARGET_DATES.THREE_DAYS,
    view: TARGET_DATA.ORDERS,
    toggleTest: true,
  });
  const [sorting, setSorting] = useState([
    {
      id: moment(endDate).format("MMM DD"),
      desc: true,
    },
  ]);
  const [trigger, setTrigger] = useState(false);
  const [loadingFetchSaleMetrics, setLoadingFetchSaleMetrics] = useState(true);
  const fetchSaleMetrics = async (page) => {
    setLoadingFetchSaleMetrics(true);
    const response = await dashboardServices.fetchPODSKUMetrics({
      page,
      query: omit(query, ["targetDate"]),
      limit: 50,
      sorting,
    });
    const { data, metadata } = response;
    if (!isEmpty(data)) {
      if (isLoadmore) {
        setSaleMetrics((prev) => [...prev, ...data]);
      } else {
        setSaleMetrics(data);
      }
      setPagination({
        currentPage: toNumber(metadata.currentPage) || 1,
        totalPages: toNumber(metadata.totalPages) || 1,
      });
    } else {
      setSaleMetrics([]);
    }
    setIsLoadmore(false);
    setLoadingFetchSaleMetrics(false);
    setTrigger(false);
  };
  useEffect(() => {
    fetchSaleMetrics(pagination.currentPage);
  }, [search, query, trigger, sorting, pagination.currentPage]);

  // listen sorting change set isConfirmedQuery to true for refetch data
  useEffect(() => {
    if (!isEmpty(sorting)) {
      setPagination({
        ...pagination,
        currentPage: 1,
      });
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
      let customSorting = [];
      switch (activeTab) {
        case TABS_VIEW.Date:
          customSorting = [
            {
              id: moment(endDate).format("MMM DD"),
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
        ...query,
        groupByKey: toLower(activeTab),
      });
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
          title="POD Dashboard"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={cn(styles.head, { [styles.hidden]: visible })}
        >
          <Grid
            style={{
              alignItems: "center",
            }}
          >
            <Grid.Col span={12}>
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
                        alignItems: "center",
                      }}
                    >
                      <Grid
                        style={{
                          width: "100%",
                          alignItems: "center",
                        }}
                        styles={{
                          inner: {
                            alignItems: "center",
                          },
                        }}
                      >
                        <Grid.Col
                          span={3}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
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
                        </Grid.Col>
                        {activeTab === TABS_VIEW.Date && (
                          <Grid.Col
                            span={4}
                            style={{
                              borderRadius: "10px",
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "start",
                              marginRight: "2px",
                              padding: "10px",
                              backgroundColor: "#e2eaff",
                              border: "1px solid #4f80ff",
                              borderColor: "#4f80ff",
                            }}
                          >
                            <Radio.Group
                              value={query?.targetDate}
                              onChange={(value) => {
                                setPagination({
                                  ...pagination,
                                  currentPage: 1,
                                });
                                switch (value) {
                                  case TARGET_DATES.FOURTEEN_DAYS:
                                    setQuery({
                                      ...query,
                                      dateRange: 14,
                                      targetDate: value,
                                    });
                                    break;
                                  case TARGET_DATES.THREE_DAYS:
                                    setQuery({
                                      ...query,
                                      dateRange: 3,
                                      targetDate: value,
                                    });
                                    break;
                                  case TARGET_DATES.SEVEN_DAYS:
                                    setQuery({
                                      ...query,
                                      dateRange: 7,
                                      targetDate: value,
                                    });
                                    break;
                                  default:
                                    break;
                                }
                              }}
                            >
                              <Group
                                styles={{
                                  root: {
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                  },
                                }}
                              >
                                <Radio
                                  styles={{
                                    input: {
                                      borderRadius: "50%",
                                    },
                                  }}
                                  value={TARGET_DATES.THREE_DAYS}
                                  label={TARGET_DATES.THREE_DAYS}
                                />
                                <Radio
                                  styles={{
                                    input: {
                                      borderRadius: "50%",
                                    },
                                  }}
                                  value={TARGET_DATES.SEVEN_DAYS}
                                  label={TARGET_DATES.SEVEN_DAYS}
                                />
                                <Radio
                                  styles={{
                                    input: {
                                      borderRadius: "50%",
                                    },
                                  }}
                                  value={TARGET_DATES.FOURTEEN_DAYS}
                                  label={TARGET_DATES.FOURTEEN_DAYS}
                                />
                              </Group>
                            </Radio.Group>
                          </Grid.Col>
                        )}
                        <Grid.Col
                          span={activeTab === TABS_VIEW.Date ? 4.5 : 8}
                          style={{
                            borderRadius: "10px",
                            width: "100%",
                            height: "100%",
                            marginRight: "2px",
                            padding: "10px",
                            display: "flex",
                            justifyContent: "end",
                          }}
                        >
                          <Text
                            style={{
                              marginRight: "10px",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            All SKU
                          </Text>
                          <Switch
                            checked={query?.toggleTest}
                            label="SKU Test"
                            onChange={() => {
                              setPagination({
                                ...pagination,
                                currentPage: 1,
                              });
                              setQuery({
                                ...query,
                                toggleTest: !query.toggleTest,
                              });
                            }}
                            styles={{
                              label: {
                                fontSize: "14px",
                                fontWeight: "bold",
                              },
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col
                          span={12}
                          style={{
                            display: "flex",
                          }}
                        >
                          <Grid.Col
                            span={8}
                            style={{
                              borderRadius: "10px",
                              width: "100%",
                              height: "100%",
                              marginRight: "2px",
                              padding: "10px",
                              backgroundColor: "#e2eaff",
                              border: "1px solid #4f80ff",
                              borderColor: "#4f80ff",
                            }}
                          >
                            <Flex
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Group
                                style={{
                                  display: "flex",
                                }}
                              >
                                <Select
                                  data={["BD1", "BD2", "BD3"]}
                                  placeholder="TEAM"
                                  value={query.team}
                                  size="sm"
                                  styles={{
                                    input: {
                                      width: "100px",
                                    },
                                  }}
                                  clearable
                                  onChange={(value) => {
                                    setPagination({
                                      ...pagination,
                                      currentPage: 1,
                                    });
                                    setQuery({
                                      ...query,
                                      team: value,
                                    });
                                  }}
                                  onClear={() => {
                                    setPagination({
                                      ...pagination,
                                      currentPage: 1,
                                    });
                                    setQuery({
                                      ...query,
                                      team: null,
                                    });
                                  }}
                                />
                                <Select
                                  data={keys(VALUES)}
                                  placeholder="VALUE"
                                  value={CONVERT_NUMBER_TO_STATUS[query.value] || null}
                                  onChange={(value) => {
                                    setPagination({
                                      ...pagination,
                                      currentPage: 1,
                                    });
                                    setQuery({
                                      ...query,
                                      value: CONVERT_STATUS_TO_NUMBER[value],
                                    });
                                  }}
                                  clearable
                                  onClear={() => {
                                    setPagination({
                                      ...pagination,
                                      currentPage: 1,
                                    });
                                    setQuery({
                                      ...query,
                                      value: null,
                                    });
                                  }}
                                  styles={{
                                    input: {
                                      width: "100px",
                                    },
                                  }}
                                />
                              </Group>
                              <Group>
                                <Select
                                  data={values(DEFAULT_SORTING)}
                                  placeholder="Sorting"
                                  value={query?.sortingValue}
                                  onClear={() => {
                                    setPagination({
                                      ...pagination,
                                      currentPage: 1,
                                    });
                                    setQuery({
                                      ...query,
                                      primarySortBy: null,
                                      primarySortDir: null,
                                      sortingValue: null,
                                    });
                                  }}
                                  onChange={(value) => {
                                    setPagination({
                                      ...pagination,
                                      currentPage: 1,
                                    });
                                    switch (value) {
                                      case DEFAULT_SORTING.CREATED_DATE_DESC:
                                        setQuery({
                                          ...query,
                                          primarySortBy: "createdDate",
                                          primarySortDir: "desc",
                                          sortingValue: value,
                                        });
                                        break;
                                      case DEFAULT_SORTING.CREATED_DATE_ASC:
                                        setQuery({
                                          ...query,
                                          primarySortBy: "createdDate",
                                          primarySortDir: "asc",
                                          sortingValue: value,
                                        });
                                        break;
                                      case DEFAULT_SORTING.TOTAL_DESC:
                                        setQuery({
                                          ...query,
                                          primarySortBy: "totalOrdersInRange",
                                          primarySortDir: "desc",
                                          sortingValue: value,
                                        });
                                        break;
                                      case DEFAULT_SORTING.TOTAL_ASC:
                                        setQuery({
                                          ...query,
                                          primarySortBy: "totalOrdersInRange",
                                          primarySortDir: "asc",
                                          sortingValue: value,
                                        });
                                        break;
                                      default:
                                        break;
                                    }
                                  }}
                                  size="sm"
                                  label="Sorting"
                                  styles={{
                                    root: {
                                      display: "flex",
                                      alignItems: "center",
                                    },
                                    label: {
                                      marginRight: "10px",
                                      fontWeight: "bold",
                                    },
                                  }}
                                />
                              </Group>
                            </Flex>
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <Radio.Group
                              value={query.view}
                              label="SHOW DATA"
                              onChange={(value) => {
                                setPagination({
                                  ...pagination,
                                  currentPage: 1,
                                });
                                setQuery({ ...query, view: value });
                              }}
                              styles={{
                                root: {
                                  display: "flex",
                                  justifyContent: "end",
                                  alignItems: "center",
                                  height: "100%",
                                },
                                label: {
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  marginRight: "10px",
                                },
                              }}
                            >
                              <Group
                                styles={{
                                  root: {
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "start",
                                  },
                                }}
                              >
                                <Radio
                                  styles={{
                                    input: {
                                      borderRadius: "50%",
                                    },
                                  }}
                                  value={TARGET_DATA.ORDERS}
                                  label={TARGET_DATA.ORDERS}
                                />
                                <Radio
                                  styles={{
                                    input: {
                                      borderRadius: "50%",
                                    },
                                  }}
                                  value={TARGET_DATA.PROFIT}
                                  label={TARGET_DATA.PROFIT}
                                />
                              </Group>
                            </Radio.Group>
                          </Grid.Col>
                        </Grid.Col>
                      </Grid>
                    </Flex>
                  </div>
                </Tabs.List>
                <Tabs.Panel value={TABS_VIEW.Date}>
                  {activeTab === TABS_VIEW.Date && !isEmpty(saleMetrics) && (
                    <Table
                      className={styles.Table}
                      tableData={map(saleMetrics, (row) => {
                        return {
                          ...row,
                          data: row?.sales || [],
                        };
                      })}
                      query={query}
                      setQuery={setQuery}
                      loading={loadingFetchSaleMetrics}
                      setTrigger={setTrigger}
                      setSorting={setSorting}
                      sorting={sorting}
                      activeTab={activeTab}
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
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.Week}>
                  {activeTab === TABS_VIEW.Week && !isEmpty(saleMetrics) && (
                    <Table
                      className={styles.Table}
                      tableData={map(saleMetrics, (row) => {
                        return {
                          ...row,
                          data: row?.sales || [],
                        };
                      })}
                      query={query}
                      setQuery={setQuery}
                      loading={loadingFetchSaleMetrics}
                      setTrigger={setTrigger}
                      setSorting={setSorting}
                      sorting={sorting}
                      activeTab={activeTab}
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
                </Tabs.Panel>
                <Tabs.Panel value={TABS_VIEW.Month}>
                  {activeTab === TABS_VIEW.Month && !isEmpty(saleMetrics) && (
                    <Table
                      className={styles.Table}
                      tableData={map(saleMetrics, (row) => {
                        return {
                          ...row,
                          data: row?.sales || [],
                        };
                      })}
                      query={query}
                      setQuery={setQuery}
                      loading={loadingFetchSaleMetrics}
                      setTrigger={setTrigger}
                      setSorting={setSorting}
                      sorting={sorting}
                      activeTab={activeTab}
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

export default PODDashboard;
