import React, { useEffect, useRef, useState } from "react";
import styles from "./SummaryDashboard.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import {
  Affix,
  Button,
  Checkbox,
  Flex,
  Grid,
  Group,
  rem,
  Transition,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { amzServices } from "../../services";
import Table from "./Table";
import { isEmpty, omit, toNumber, values } from "lodash";
import moment from "moment-timezone";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

const TARGET_COMPETITORS = {
  PAWFECTHOUSE: "Pawfecthouse",
  MACORNER: "Macorner",
  WANDERPRINTS: "Wanderprints",
}
const TARGET_DATES = {
  TODAY: "Today",
  THREE_DAYS: "3 Day",
  SEVEN_DAYS: "7 Day",
}
const TARGET_MODES = {
  ORDERS: "Orders",
  RANKING: "Ranking",
}

const SummaryDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  // const [isConfirmedQuery, setIsConfirmedQuery] = useState(true);
  const [isLoadmore, setIsLoadmore] = useState(false);
  const [productRankings, setProductRankings] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const threeDayAgo = moment().subtract(3, "days").format("YYYY-MM-DD");
  const sevenDayAgo = moment().subtract(7, "days").format("YYYY-MM-DD");
  const isMounted = useRef(false);
  const currentWeek = moment().week();
  const currentYear = moment().year();
  const endDate = moment().format("YYYY-MM-DD");
  const [query, setQuery] = useState({
    competitors: values(TARGET_COMPETITORS),
    startDate: endDate,
    endDate: endDate,
    mode: [TARGET_MODES.ORDERS],
    targetDate: [TARGET_DATES.TODAY],
  });
  const [sorting, setSorting] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [loadingFetchRankings, setLoadingFetchRankings] = useState(true);
  const fetchRankings = async (page) => {
    setLoadingFetchRankings(true);
    const response = await amzServices.fetchSaleMetrics({
      page,
      query: omit(
        {
          ...query,
          mode: query.mode[0],
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
        setProductRankings((prev) => [...prev, ...data]);
      } else {
        setProductRankings(data);
      }
      setPagination({
        currentPage: toNumber(metaData.currentPage) || 1,
        totalPages: toNumber(metaData.totalPages) || 1,
      });
    } else {
      setProductRankings([]);
    }
    // setIsConfirmedQuery(false);
    setIsLoadmore(false);
    setLoadingFetchRankings(false);
    setTrigger(false);
  };
  useEffect(() => {
    fetchRankings(pagination.currentPage);
  }, [
    search,
    query,
    trigger,
    sorting,
    pagination.currentPage,
  ]);

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

  const [scroll, scrollTo] = useWindowScroll();
  return (
    <>
      <div>
        <Card
          className={styles.card}
          title="Marketing - POD & AMZ"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={cn(styles.head, { [styles.hidden]: visible })}
        >
          <Grid>
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
                <Grid.Col span={4} style={{
                  gap: "30px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#e2eaff",
                  flexWrap: "wrap",
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  border: "1px solid #4f80ff",
                  borderColor: "#4f80ff",
                }}>
                  <Checkbox.Group
                    value={query?.targetDate}
                    onChange={(value) => {
                      let realValue = value
                      if (isEmpty(value)) {
                        realValue = query?.targetDate
                      } else {
                        realValue = value[1] ? [value[1]] : value
                      }
                      switch (realValue[0]) {
                        case TARGET_DATES.TODAY:
                          setQuery({
                            ...query,
                            startDate: endDate,
                            endDate: endDate,
                            targetDate: realValue,
                          })
                          break;
                        case TARGET_DATES.THREE_DAYS:
                          setQuery({
                            ...query,
                            startDate: threeDayAgo,
                            endDate: endDate,
                            targetDate: realValue,
                          })
                          break;
                        case TARGET_DATES.SEVEN_DAYS:
                          setQuery({
                            ...query,
                            startDate: sevenDayAgo,
                            endDate: endDate,
                            targetDate: realValue,
                          })
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                    <Group styles={{
                      root: {
                        height: "100%",
                        display: "flex",
                        justifyContent: "start"
                      }
                    }}>
                      <Checkbox styles={{
                        input: {
                          borderRadius: "50%",
                        }
                      }} value={TARGET_DATES.TODAY} label={TARGET_DATES.TODAY} />
                      <Checkbox styles={{
                        input: {
                          borderRadius: "50%",
                        }
                      }} value={TARGET_DATES.THREE_DAYS} label={TARGET_DATES.THREE_DAYS} />
                      <Checkbox styles={{
                        input: {
                          borderRadius: "50%",
                        }
                      }} value={TARGET_DATES.SEVEN_DAYS} label={TARGET_DATES.SEVEN_DAYS} />
                    </Group>
                  </Checkbox.Group>
                </Grid.Col>
              </Flex>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                padding: "10px 0px",
                gap: "10px",
                width: "100%",
              }}
            >
              <Flex
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#EFF0F1",
                  width: "100%",
                }}
              >
                <Grid.Col span={6} style={{
                  gap: "30px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#e2eaff",
                  flexWrap: "wrap",
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  border: "1px solid #4f80ff",
                  borderColor: "#4f80ff",
                }}>
                  <Checkbox.Group
                    value={query?.competitors}
                    onChange={(value) => setQuery({ ...query, competitors: value })}
                  >
                    <Group styles={{
                      root: {
                        height: "100%",
                        display: "flex",
                        justifyContent: "space-between"
                      }
                    }}>
                      <Checkbox styles={{
                        input: {
                          borderRadius: "50%",
                        }
                      }} value={TARGET_COMPETITORS.WANDERPRINTS} label={TARGET_COMPETITORS.WANDERPRINTS} />
                      <Checkbox styles={{
                        input: {
                          borderRadius: "50%",
                        }
                      }} value={TARGET_COMPETITORS.MACORNER} label={TARGET_COMPETITORS.MACORNER} />
                      <Checkbox styles={{
                        input: {
                          borderRadius: "50%",
                        }
                      }} value={TARGET_COMPETITORS.PAWFECTHOUSE} label={TARGET_COMPETITORS.PAWFECTHOUSE} />
                    </Group>
                  </Checkbox.Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Checkbox.Group
                    value={query.mode}
                    label="SHOW ORDERS"
                    onChange={(value) => {
                      let realValue = value
                      if (isEmpty(value)) {
                        realValue = query.mode
                      } else {
                        realValue = value[1] ? [value[1]] : value
                      }
                      setQuery({ ...query, mode: realValue })
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
                      }
                    }}
                  >
                    <Group styles={{
                      root: {
                        height: "100%",
                        display: "flex",
                        justifyContent: "start"
                      },

                    }}>
                      <Checkbox styles={{
                        input: {
                          borderRadius: "50%",
                        }
                      }} value={TARGET_MODES.ORDERS} label={TARGET_MODES.ORDERS} />
                      <Checkbox styles={{
                        input: {
                          borderRadius: "50%",
                        }
                      }} value={TARGET_MODES.RANKING} label={TARGET_MODES.RANKING} />
                    </Group>
                  </Checkbox.Group>
                </Grid.Col>
              </Flex>
            </div>
            <Grid.Col span={12}>
              <Table
                tableData={productRankings}
                loading={loadingFetchRankings}
                pagination={pagination}
                setPagination={setPagination}
                setSorting={setSorting}
                setTrigger={setTrigger}
                setIsLoadmore={setIsLoadmore}
                sorting={sorting}
              />
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

export default SummaryDashboard;
