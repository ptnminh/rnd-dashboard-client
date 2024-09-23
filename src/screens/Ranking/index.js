import React, { useEffect, useRef, useState } from "react";
import styles from "./RankingPODShopifyProducts.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import {
  Affix,
  Button,
  Checkbox,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  rem,
  Text,
  Transition,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { rankingServices } from "../../services";
import Table from "./Table";
import { isEmpty, join, omit, toNumber, values } from "lodash";
import moment from "moment-timezone";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
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

const RankingPODShopifyProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [selectedProduct, setSelectedProduct] = useState({});
  const [openedPreviewImage, {
    close: closePreviewImage,
    open: openPreviewImage,
  }] = useDisclosure(false);
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
  const endDate = moment().format("YYYY-MM-DD");
  const [query, setQuery] = useState({
    competitors: values(TARGET_COMPETITORS),
    startDate: endDate,
    endDate: endDate,
    mode: [TARGET_MODES.ORDERS],
    targetDate: [TARGET_DATES.TODAY],
  });
  const [sorting, setSorting] = useState([
    {
      id: moment(endDate).format("MMM DD"),
      desc: true,
    },
  ]);
  const isMounted = useRef(false);

  const [trigger, setTrigger] = useState(false);
  const [loadingFetchRankings, setLoadingFetchRankings] = useState(true);
  const fetchRankings = async (page) => {
    setLoadingFetchRankings(true);
    const response = await rankingServices.fetchRankingMetrics({
      page,
      query: omit(
        {
          ...query,
          view: query.mode[0] === TARGET_MODES.ORDERS ? "order" : "rank",
          competitors: join(query.competitors, ","),
        },
        [
          "sortValue",
          "storeValues",
          "dateValue",
          "isConfirmed",
          "fulfillmentChannelValues",
          "salesDateValue",
          "mode",
          "targetDate",
        ]
      ),
      limit: 50,
      sorting,
    });
    const { data, metadata } = response;
    if (data) {
      if (isLoadmore) {
        setProductRankings((prev) => [...prev, ...data]);
      } else {
        setProductRankings(data);
      }
      setPagination({
        currentPage: toNumber(metadata.currentPage) || 1,
        totalPages: toNumber(metadata.totalPages) || 1,
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
    if (isMounted.current) {
      if (!isEmpty(sorting)) {
        setPagination({
          ...pagination,
          currentPage: 1,
        });
      }
    } else {
      isMounted.current = true;
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
          title="POD Ranking"
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
                      setPagination({
                        ...pagination,
                        currentPage: 1,
                      })
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
                    onChange={(value) => {
                      setPagination({
                        ...pagination,
                        currentPage: 1,
                      })
                      setQuery({ ...query, competitors: value })
                    }}
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
                      setPagination({
                        ...pagination,
                        currentPage: 1,
                      })
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
              {!isEmpty(productRankings) && (
                <Table
                  tableData={productRankings}
                  loading={loadingFetchRankings}
                  pagination={pagination}
                  setPagination={setPagination}
                  setSorting={setSorting}
                  setTrigger={setTrigger}
                  setIsLoadmore={setIsLoadmore}
                  sorting={sorting}
                  openPreviewImage={openPreviewImage}
                  setSelectedProduct={setSelectedProduct}
                  query={query}
                  setQuery={setQuery}
                />
              )}
              {loadingFetchRankings && (
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
              {
                isEmpty(productRankings) && !loadingFetchRankings && (
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}><Text style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}>Không tìm thấy Data</Text></div>
                )
              }
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
            selectedProduct?.image ||
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

export default RankingPODShopifyProducts;
