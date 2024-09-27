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
  Radio,
  rem,
  Text,
  Transition,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { rankingServices } from "../../services";
import Table from "./Table";
import { filter, includes, isEmpty, map, omit, toNumber, uniq } from "lodash";
import moment from "moment-timezone";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

const TARGET_DATES = {
  TODAY: "Today",
  THREE_DAYS: "3 Days",
  SEVEN_DAYS: "7 Days",
};
const TARGET_MODES = {
  ORDERS: "Orders",
  RANKING: "Change Rank",
  DEFAULT_RANKING: "Rank",
};

// for sorting client opinion
const priorityList = ["WP", "MC", "TC", "PSN", "PSN (LT)", "PFH", "PFH (LT)"];
const sortByPriority = (array, priorityList) => {
  return array.sort((a, b) => {
    const indexA = priorityList.indexOf(a?.shortName);
    const indexB = priorityList.indexOf(b?.shortName);

    // If the item is not in the priority list, place it at the end
    const adjustedIndexA = indexA === -1 ? priorityList.length : indexA;
    const adjustedIndexB = indexB === -1 ? priorityList.length : indexB;

    return adjustedIndexA - adjustedIndexB;
  });
};
const moveIdsToStart = (array, ids) => {
  return array.sort((a, b) => {
    if (ids.includes(a.id) && !ids.includes(b.id)) {
      return -1;
    }
    if (!ids.includes(a.id) && ids.includes(b.id)) {
      return 1;
    }
    return 0;
  });
};

const RankingPODShopifyProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [selectedProduct, setSelectedProduct] = useState({});
  const [
    openedPreviewImage,
    { close: closePreviewImage, open: openPreviewImage },
  ] = useDisclosure(false);
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [overrideProductRankings, setOverrideProductRankings] = useState([]);
  // const [isConfirmedQuery, setIsConfirmedQuery] = useState(true);
  const [isLoadmore, setIsLoadmore] = useState(false);
  const [productRankings, setProductRankings] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [competitors, setCompetitors] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const endDate = moment().format("YYYY-MM-DD");
  const [query, setQuery] = useState({
    competitor: "Wanderprints",
    mode: [TARGET_MODES.RANKING],
    targetDate: TARGET_DATES.THREE_DAYS,
    dateRange: 3,
    sortBy: "totalRankChanges",
    sortDir: "desc",
  });
  const [sorting, setSorting] = useState([]);
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
          view:
            query.mode[0] === TARGET_MODES.ORDERS
              ? "order"
              : query.mode[0] === TARGET_MODES.RANKING
              ? "rankChange"
              : "rank",
        },
        [
          "sortValue",
          "storeValues",
          "dateValue",
          "isConfirmed",
          "fulfillmentChannelValues",
          "salesDateValue",
          "mode",
          "startDate",
          "endDate",
          "targetDate",
        ]
      ),
      limit: 50,
      sorting,
    });
    const { data, metadata } = response;
    if (!isEmpty(data)) {
      if (isLoadmore) {
        const oldProductRankings = map(productRankings, (x) => {
          if (includes(overrideProductRankings, x.id)) {
            return {
              ...x,
              follow: 1,
            };
          }
          return {
            ...x,
          };
        });
        const newProductRankings = [...oldProductRankings, ...data];
        const sortedProductRankings = moveIdsToStart(
          newProductRankings,
          uniq(overrideProductRankings)
        );
        setProductRankings(sortedProductRankings);
      } else {
        const sortedProductRankings = moveIdsToStart(
          data,
          uniq(overrideProductRankings)
        );
        setProductRankings(sortedProductRankings);
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
  const fetchCompetitors = async () => {
    const competitors = await rankingServices.fetchCompetitors();
    setCompetitors(filter(competitors, { alive: true }));
  };
  useEffect(() => {
    fetchRankings(pagination.currentPage);
  }, [search, query, trigger, sorting, pagination.currentPage]);

  useEffect(() => {
    fetchCompetitors();
  }, []);

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
                justifyContent: "start",
                alignItems: "center",
                padding: "10px 0px",
                gap: "5px",
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
                <Grid.Col
                  span={3.5}
                  style={{
                    gap: "5px",
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
                    marginRight: "2px",
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
                        case TARGET_DATES.TODAY:
                          setQuery({
                            ...query,
                            dateRange: 1,
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
                        value={TARGET_DATES.TODAY}
                        label={TARGET_DATES.TODAY}
                      />
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
                    </Group>
                  </Radio.Group>
                </Grid.Col>
                <Grid.Col span={8.5}>
                  <Checkbox.Group
                    value={query.mode}
                    label="SHOW DATA"
                    onChange={(value) => {
                      let realValue = value;
                      if (isEmpty(value)) {
                        realValue = query.mode;
                      } else {
                        realValue = value[1] ? [value[1]] : value;
                      }
                      setPagination({
                        ...pagination,
                        currentPage: 1,
                      });
                      setQuery({
                        ...query,
                        mode: realValue,
                        sortBy: "totalRankChanges",
                        sortDir: "desc",
                      });
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
                      <Checkbox
                        styles={{
                          input: {
                            borderRadius: "50%",
                          },
                        }}
                        value={TARGET_MODES.RANKING}
                        label={TARGET_MODES.RANKING}
                      />
                      <Checkbox
                        styles={{
                          input: {
                            borderRadius: "50%",
                          },
                        }}
                        value={TARGET_MODES.DEFAULT_RANKING}
                        label={TARGET_MODES.DEFAULT_RANKING}
                      />
                      <Checkbox
                        styles={{
                          input: {
                            borderRadius: "50%",
                          },
                        }}
                        value={TARGET_MODES.ORDERS}
                        label={TARGET_MODES.ORDERS}
                      />
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
                gap: "5px",
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
                <Grid.Col
                  span={12}
                  style={{
                    borderRadius: "10px",
                    flexWrap: "wrap",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid
                    style={{
                      width: "100%",
                    }}
                  >
                    <Grid.Col span={8}>
                      <Radio.Group
                        value={query?.competitor}
                        label="POD: "
                        styles={{
                          root: {
                            display: "flex",
                            justifyContent: "center",
                          },
                          label: {
                            marginRight: "10px",
                            fontSize: "14px",
                            fontWeight: "bold",
                          },
                        }}
                        onChange={(value) => {
                          setQuery({
                            ...query,
                            competitor: value,
                          });
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
                          {map(
                            filter(sortByPriority(competitors, priorityList), {
                              category: "POD",
                            }),
                            (x) => {
                              return (
                                <Radio
                                  styles={{
                                    input: {
                                      borderRadius: "50%",
                                    },
                                  }}
                                  value={x?.name}
                                  label={x?.shortName || x?.name}
                                />
                              );
                            }
                          )}
                        </Group>
                      </Radio.Group>
                    </Grid.Col>
                    <Grid.Col
                      span={4}
                      style={{
                        borderLeft: "1px solid gray",
                      }}
                    >
                      <Radio.Group
                        value={query?.competitor}
                        styles={{
                          root: {
                            display: "flex",
                            justifyContent: "center",
                            gap: "10px",
                          },
                          label: {
                            marginRight: "10px",
                            fontSize: "14px",
                            fontWeight: "bold",
                          },
                        }}
                        label="Politics: "
                        onChange={(value) => {
                          setQuery({
                            ...query,
                            competitor: value,
                          });
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
                          {map(
                            filter(competitors, { category: "Politics" }),
                            (x) => {
                              return (
                                <Radio
                                  styles={{
                                    input: {
                                      borderRadius: "50%",
                                    },
                                  }}
                                  value={x?.name}
                                  label={x?.shortName || x?.name}
                                />
                              );
                            }
                          )}
                        </Group>
                      </Radio.Group>
                    </Grid.Col>
                  </Grid>
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
                  setOverrideProductRankings={setOverrideProductRankings}
                  overrideProductRankings={overrideProductRankings}
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
              {isEmpty(productRankings) && !loadingFetchRankings && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    Không tìm thấy Data
                  </Text>
                </div>
              )}
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
          src={selectedProduct?.image || "/images/content/not_found_2.jpg"}
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
