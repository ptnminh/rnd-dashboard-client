import React, { useState, useMemo, useEffect, useRef } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Text,
  Flex,
  Grid,
  Image,
  Button,
  MultiSelect,
  Badge,
  Tooltip,
  Group,
  Select,
  TextInput,
  ActionIcon,
  Affix,
  Transition,
  rem,
} from "@mantine/core";
import {
  find,
  map,
  flatten,
  uniq,
  join,
  split,
  values,
  filter,
  sumBy,
  flatMap,
  merge,
  isEmpty,
  toNumber,
  keys,
} from "lodash";
import {
  IconFilterOff,
  IconSortDescending,
  IconSortAscending,
  IconArrowsSort,
  IconArrowUp,
} from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import {
  AMZ_DASHBOARD_STATUS,
  AMZ_STORES,
  CONVERT_NUMBER_TO_AMZ_DASHBOARD_STATUS,
  CONVERT_STATUS_TO_AMZ_DASHBOARD_NUMBER,
} from "../../../constant";
import moment from "moment-timezone";
import {
  arraysMatchUnordered,
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
  VALUES,
} from "../../../utils";
import { DateRangePicker } from "rsuite";
import LazyLoad from "react-lazyload";
import { amzServices } from "../../../services";

const moveOverrideColorToStart = (array) => {
  return array.sort((a, b) => {
    if (a.overrideColor && !b.overrideColor) {
      return -1;
    }
    if (!a.overrideColor && b.overrideColor) {
      return 1;
    }
    return 0;
  });
};

const SellerboardTable = ({
  tableData,
  query,
  loading,
  sorting,
  setSorting,
  setQuery,
  activeTab,
  setIsConfirmedQuery,
  setPagination,
  pagination,
  setIsLoadmore,
  setOverrideMetrics,
  overrideMetrics,
  setTableData,
  adDaysNum,
  setAdDaysNum,
  listingDays,
  setListingDays,
}) => {
  const handleUpdateAMZDashboard = async (sku, data) => {
    await amzServices.handleUpdateAMZDashboard(sku, data);
  };
  // Function to extract unique keys from the data array
  const extractUniqueKeys = (dataset) => {
    // Flatten the 'data' arrays from each item and map to the 'key' property
    const allKeys = flatten(map(dataset, (item) => map(item.data, "key")));

    // Remove duplicates using uniq
    const uniqueKeys = uniq(allKeys);

    return uniqueKeys;
  };
  const [data, setData] = useState(tableData || []);
  const [customColumns, setCustomColumns] = useState([]);
  // Function to generate columns based on the data
  const generateCustomColumn = (data) => {
    const keyLevels = extractUniqueKeys(data);
    const columns = map(keyLevels, (keyLevel) => {
      const header = join(split(keyLevel, " ")?.slice(0, -1), " ");
      return {
        accessorKey: keyLevel,
        header,
        size: 100,
        maxSize: 150,
        enableEditing: false,
        enableSorting: true,
        mantineTableBodyCellProps: ({ row }) => ({
          className:
            row.id === `Total theo ${activeTab}`
              ? classes["summary-row"]
              : classes["body-cells-op-team"],
        }),
        mantineTableHeadCellProps: {
          className: classes["edit-header"],
        },
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return (
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {row.original[header]}
              </Text>
            );
          }
          const { data } = row.original;
          const keyData = find(data, { key: keyLevel });
          return (
            <Flex direction="column">
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {keyData?.orders}
              </Text>
            </Flex>
          );
        },
      };
    });
    return columns;
  };

  useEffect(() => {
    if (!isEmpty(overrideMetrics)) {
      const orderedData = moveOverrideColorToStart(
        map(data, (item) => {
          if (overrideMetrics.includes(item.sku)) {
            return {
              ...item,
              overrideColor: true,
            };
          }
          return item;
        })
      );
      setData(orderedData);
      setCustomColumns(generateCustomColumn(orderedData));
    }
  }, [overrideMetrics]);

  // UseEffect to generate and sort columns based on tableData
  useEffect(() => {
    setData(tableData);
    setCustomColumns(generateCustomColumn(tableData));
  }, [tableData]);

  // Compute the Total theo ${activeTab} row data
  const summaryRow = useMemo(() => {
    const columns = merge(
      {},
      ...customColumns.map((col) => {
        const key = col.accessorKey;
        const keyLevels = flatMap(data, "data");
        const keyData = filter(keyLevels, (keyLevel) => keyLevel.key === key);
        const header = join(split(key, " ")?.slice(0, -1), " ");
        const totalOrders = sumBy(keyData, "orders");
        return {
          [header]: totalOrders?.toLocaleString(),
        };
      })
    );
    return {
      id: `Total theo ${activeTab}`, // Unique ID for the Total theo ${activeTab} row
      product: `Summary`,
      totalInRanges: sumBy(data, (row) =>
        sumBy(row.data, "orders")
      )?.toLocaleString(), // Example: sum of orders
      ...columns,
    };
  }, [data, customColumns]);

  // Combine table data with the Total theo ${activeTab} row
  const tableDataWithSummary = useMemo(
    () => [...data, summaryRow],
    [data, summaryRow]
  );

  useEffect(() => {
    if (
      customColumns.length < 8 &&
      customColumns.length > 0 &&
      activeTab === "Month"
    ) {
      let virtualColumn = [];
      virtualColumn = Array(10 - customColumns.length)
        .fill(0)
        .map((_, i) => ({
          accessorKey: `virtualColumn${i}`,
          header: "",
          size: 100, // Set default size
          maxSize: 150, // Maximum size
          enableEditing: false,
          enableSorting: false,
          mantineTableBodyCellProps: {
            className: classes["body-cells"],
          },
          mantineTableHeadCellProps: {
            className: classes["edit-header"],
          },
          Cell: () => {
            return <Text style={{ fontSize: 16, fontWeight: "bold" }}></Text>;
          },
        }));
      setCustomColumns([...customColumns, ...virtualColumn]);
    }
  }, [data]);
  // UseMemo to construct final columns array
  const columns = useMemo(
    () => [
      {
        accessorKey: "product",
        header: "Product",
        size: 250,
        maxSize: 250,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        Header: () => {
          return (
            <Group gap={30}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Product
              </Text>

              <Flex direction="column">
                <Group justify="space-between">
                  <Text
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Ads:
                  </Text>
                  <Group>
                    {(!query?.primarySortBy ||
                      query?.primarySortBy !== "testDate") && (
                      <ActionIcon
                        aria-label="Settings"
                        variant="default"
                        size="sm"
                        style={{
                          background: "none",
                          border: "none",
                        }}
                        onClick={() => {
                          setPagination({
                            ...pagination,
                            currentPage: 1,
                          });
                          setIsConfirmedQuery(true);
                          setQuery({
                            ...query,
                            primarySortBy: "testDate",
                            primarySortDir: "desc",
                          });
                        }}
                      >
                        <IconArrowsSort
                          style={{
                            width: "60%",
                            height: "60%",
                            fontWeight: "bold",
                          }}
                          stroke={2}
                          color="#ffffff"
                        />
                      </ActionIcon>
                    )}
                    {query?.primarySortBy === "testDate" &&
                      query?.primarySortDir === "desc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          color="transparent"
                          size="sm"
                          onClick={() => {
                            setIsConfirmedQuery(true);
                            setPagination({
                              ...pagination,
                              currentPage: 1,
                            });
                            setQuery({
                              ...query,
                              primarySortBy: "testDate",
                              primarySortDir: "asc",
                            });
                          }}
                        >
                          <IconSortDescending
                            style={{ width: "70%", height: "70%" }}
                            stroke={2}
                            color="#70B1ED"
                          />
                        </ActionIcon>
                      )}
                    {query?.primarySortBy === "testDate" &&
                      query?.primarySortDir === "asc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          size="sm"
                          color="transparent"
                          onClick={() => {
                            setIsConfirmedQuery(true);
                            setPagination({
                              ...pagination,
                              currentPage: 1,
                            });
                            setQuery({
                              ...query,
                              primarySortBy: null,
                              primarySortDir: null,
                            });
                          }}
                        >
                          <IconSortAscending
                            style={{
                              width: "70%",
                              height: "70%",
                              fontWeight: "bold",
                            }}
                            stroke={2}
                            color="#70B1ED"
                          />
                        </ActionIcon>
                      )}
                  </Group>
                </Group>
                <Group justify="space-between">
                  <Text
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    List:
                  </Text>
                  <Group>
                    {(!query?.primarySortBy ||
                      query?.primarySortBy !== "createdDate") && (
                      <ActionIcon
                        aria-label="Settings"
                        variant="default"
                        size="sm"
                        style={{
                          background: "none",
                          border: "none",
                        }}
                        onClick={() => {
                          setIsConfirmedQuery(true);
                          setPagination({
                            ...pagination,
                            currentPage: 1,
                          });
                          setQuery({
                            ...query,
                            primarySortBy: "createdDate",
                            primarySortDir: "desc",
                          });
                        }}
                      >
                        <IconArrowsSort
                          style={{
                            width: "60%",
                            height: "60%",
                            fontWeight: "bold",
                          }}
                          stroke={2}
                          color="#ffffff"
                        />
                      </ActionIcon>
                    )}

                    {query?.primarySortBy === "createdDate" &&
                      query?.primarySortDir === "desc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          color="transparent"
                          size="sm"
                          onClick={() => {
                            setIsConfirmedQuery(true);
                            setPagination({
                              ...pagination,
                              currentPage: 1,
                            });
                            setQuery({
                              ...query,
                              primarySortBy: "createdDate",
                              primarySortDir: "desc",
                            });
                          }}
                        >
                          <IconSortDescending
                            style={{ width: "70%", height: "70%" }}
                            stroke={2}
                            color="#70B1ED"
                          />
                        </ActionIcon>
                      )}
                    {query?.primarySortBy === "createdDate" &&
                      query?.primarySortDir === "asc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          size="sm"
                          color="transparent"
                          onClick={() => {
                            setIsConfirmedQuery(true);
                            setPagination({
                              ...pagination,
                              currentPage: 1,
                            });
                            setQuery({
                              ...query,
                              primarySortBy: null,
                              primarySortDir: null,
                            });
                          }}
                        >
                          <IconSortAscending
                            style={{
                              width: "70%",
                              height: "70%",
                              fontWeight: "bold",
                            }}
                            stroke={2}
                            color="#70B1ED"
                          />
                        </ActionIcon>
                      )}
                  </Group>
                </Group>
              </Flex>
            </Group>
          );
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return (
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Total theo {activeTab}
              </Text>
            );
          }
          const {
            ASIN,
            image,
            fulfillmentChannel,
            sku,
            createdDate,
            testDate,
          } = row.original;
          const url = `https://www.amazon.com/dp/${ASIN}`;
          return (
            <Flex direction="column">
              <Grid>
                <Grid.Col span={6}>
                  <Tooltip label={url}>
                    <Image
                      src={image || "/images/content/not_found_2.jpg"}
                      width="100%"
                      height="100%"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        window.open(url, "_blank");
                      }}
                      fit="contain"
                    />
                  </Tooltip>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Grid>
                    <Grid.Col
                      span={12}
                      style={{
                        paddingLeft: 0,
                        paddingRight: 0,
                      }}
                    >
                      <Flex>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            textAlign: "left",
                          }}
                        >
                          {sku}
                        </Text>
                      </Flex>
                    </Grid.Col>
                    {createdDate && (
                      <Grid.Col
                        span={12}
                        style={{
                          padding: 0,
                          marginTop: "5px",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: 11,
                            color: "gray",
                          }}
                        >
                          List:{" "}
                          {moment(createdDate)
                            .subtract(createdDate)
                            .fromNow(true)}
                        </Text>
                      </Grid.Col>
                    )}
                    {testDate && (
                      <Grid.Col
                        span={12}
                        style={{
                          padding: 0,
                          marginTop: "5px",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: 11,
                            color: "gray",
                          }}
                        >
                          Ads:{" "}
                          {moment(testDate).subtract(testDate).fromNow(true)}
                        </Text>
                      </Grid.Col>
                    )}

                    <Grid.Col
                      span={12}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        paddingLeft: 0,
                        paddingRight: 0,
                      }}
                    >
                      <Tooltip label={url}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "gray",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          onClick={() => {
                            window.open(url, "_blank");
                          }}
                        >
                          {ASIN} - {fulfillmentChannel}
                        </Text>
                      </Tooltip>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </Grid>
            </Flex>
          );
        },
      },
      {
        accessorKey: "createdDate",
        size: 100,
        maxSize: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Header: () => {
          return (
            <Group gap={5}>
              <Grid>
                <Grid.Col
                  span={8}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "100%",
                      wordBreak: "break-word", // Break long words
                      whiteSpace: "normal", // Allow text to wrap
                      overflowWrap: "break-word", // Break long words
                    }}
                  >
                    Lifetime Order
                  </Text>
                </Grid.Col>
                <Grid.Col
                  span={4}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {(!query?.primarySortBy ||
                    query?.primarySortBy === "ordersInRange" ||
                    query?.primarySortBy === "createdDate" ||
                    query?.primarySortBy === "testDate") && (
                    <ActionIcon
                      aria-label="Settings"
                      variant="default"
                      style={{
                        background: "none",
                        border: "none",
                      }}
                      onClick={() => {
                        setIsConfirmedQuery(true);
                        setPagination({
                          ...pagination,
                          currentPage: 1,
                        });
                        setQuery({
                          ...query,
                          primarySortBy: "totalOrders",
                          primarySortDir: "desc",
                        });
                      }}
                    >
                      <IconArrowsSort
                        style={{
                          width: "60%",
                          height: "60%",
                          fontWeight: "bold",
                        }}
                        stroke={2}
                        color="#ffffff"
                      />
                    </ActionIcon>
                  )}

                  {query?.primarySortBy === "totalOrders" &&
                    query?.primarySortDir === "desc" && (
                      <ActionIcon
                        variant="filled"
                        aria-label="Settings"
                        color="transparent"
                        onClick={() => {
                          setIsConfirmedQuery(true);
                          setPagination({
                            ...pagination,
                            currentPage: 1,
                          });
                          setQuery({
                            ...query,
                            primarySortBy: "totalOrders",
                            primarySortDir: "asc",
                          });
                        }}
                      >
                        <IconSortDescending
                          style={{ width: "70%", height: "70%" }}
                          stroke={2}
                          color="#70B1ED"
                        />
                      </ActionIcon>
                    )}
                  {query?.primarySortBy === "totalOrders" &&
                    query?.primarySortDir === "asc" && (
                      <ActionIcon
                        variant="filled"
                        aria-label="Settings"
                        color="transparent"
                        onClick={() => {
                          setIsConfirmedQuery(true);
                          setPagination({
                            ...pagination,
                            currentPage: 1,
                          });
                          setQuery({
                            ...query,
                            primarySortBy: null,
                            primarySortDir: null,
                          });
                        }}
                      >
                        <IconSortAscending
                          style={{
                            width: "70%",
                            height: "70%",
                            fontWeight: "bold",
                          }}
                          stroke={2}
                          color="#70B1ED"
                        />
                      </ActionIcon>
                    )}
                </Grid.Col>
              </Grid>
            </Group>
          );
        },
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return null;
          }
          const { totalOrders } = row.original;
          return (
            <Group
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {totalOrders?.toLocaleString()}
              </Text>
              {/* <Text
                style={{
                  fontSize: "12px",
                  fontWeight: "thin",
                  color: "gray",
                }}
              >
                {moment(createdDate)
                  .tz("America/Los_Angeles")
                  .format("DD MMM YYYY")}
              </Text> */}
            </Group>
          );
        },
      },
      {
        accessorKey: "value",
        header: "Value",
        size: 50,
        maxSize: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return null;
          }
          let color = null;
          const value = row.original.value || 2;
          switch (value) {
            case 1:
              color = "#cfcfcf";
              break;
            case 2:
              color = "yellow";
              break;
            case 3:
              color = "green";
              break;
            case 4:
              color = "#38761C";
              break;
            default:
              break;
          }
          return color ? (
            <Badge color={color} variant="filled">
              {CONVERT_NUMBER_TO_STATUS[value]}
            </Badge>
          ) : (
            <span>{CONVERT_NUMBER_TO_STATUS[value]}</span>
          );
        },
      },
      {
        accessorKey: "size",
        header: "Size",
        size: 50,
        maxSize: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return null;
          }
          let color = null;
          const size = row.original.size || 2;
          switch (size) {
            case 1:
              color = "green";
              break;
            case 2:
              color = "yellow";
              break;
            case 3:
              color = "red";
              break;
            case 1.5:
              color = "#006400";
              break;
            default:
              break;
          }
          return color ? (
            <Badge color={color} variant="filled">
              {CONVERT_NUMBER_TO_STATUS[size]}
            </Badge>
          ) : (
            <span>{CONVERT_NUMBER_TO_STATUS[size]}</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return null;
          }
          const sku = row?.original?.sku;
          const optimized = row?.original?.optimized || 0;
          return (
            <Select
              size="xs"
              allowDeselect={false}
              data={values(AMZ_DASHBOARD_STATUS)}
              value={CONVERT_NUMBER_TO_AMZ_DASHBOARD_STATUS[optimized]}
              onChange={(value) => {
                const newFollow = CONVERT_STATUS_TO_AMZ_DASHBOARD_NUMBER[value];
                const newData = data.map((item) => {
                  if (item.sku === sku) {
                    if (newFollow === 1) {
                      setOverrideMetrics([...overrideMetrics, sku]);
                    } else {
                      setOverrideMetrics(
                        overrideMetrics.filter((x) => x !== sku)
                      );
                    }
                    return {
                      ...item,
                      optimized: newFollow,
                      ...(newFollow === 1
                        ? {
                            overrideColor: true,
                          }
                        : {
                            overrideColor: false,
                          }),
                    };
                  }
                  return item;
                });
                const orderedData = moveOverrideColorToStart(newData, sku);
                setData(orderedData);
                setTableData(orderedData);
                setCustomColumns(generateCustomColumn(orderedData));
                handleUpdateAMZDashboard(sku, { optimized: newFollow });
              }}
            />
          );
        },
      },
      {
        accessorKey: "totalInRanges",
        header: "Total Orders",
        size: 150,
        maxSize: 150,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Header: () => {
          return (
            <Group gap={5}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Total Orders
              </Text>
              {(!query?.primarySortBy ||
                query?.primarySortBy !== "ordersInRange") && (
                <ActionIcon
                  aria-label="Settings"
                  variant="default"
                  size="sm"
                  style={{
                    background: "none",
                    border: "none",
                  }}
                  onClick={() => {
                    setIsConfirmedQuery(true);
                    setPagination({
                      ...pagination,
                      currentPage: 1,
                    });
                    setQuery({
                      ...query,
                      primarySortBy: "ordersInRange",
                      primarySortDir: "desc",
                    });
                  }}
                >
                  <IconArrowsSort
                    style={{
                      width: "60%",
                      height: "60%",
                      fontWeight: "bold",
                    }}
                    stroke={2}
                    color="#ffffff"
                  />
                </ActionIcon>
              )}

              {query?.primarySortBy === "ordersInRange" &&
                query?.primarySortDir === "desc" && (
                  <ActionIcon
                    variant="filled"
                    aria-label="Settings"
                    color="transparent"
                    size="sm"
                    onClick={() => {
                      setIsConfirmedQuery(true);
                      setPagination({
                        ...pagination,
                        currentPage: 1,
                      });
                      setQuery({
                        ...query,
                        primarySortBy: "ordersInRange",
                        primarySortDir: "asc",
                      });
                    }}
                  >
                    <IconSortDescending
                      style={{ width: "70%", height: "70%" }}
                      stroke={2}
                      color="#70B1ED"
                    />
                  </ActionIcon>
                )}
              {query?.primarySortBy === "ordersInRange" &&
                query?.primarySortDir === "asc" && (
                  <ActionIcon
                    variant="filled"
                    aria-label="Settings"
                    size="sm"
                    color="transparent"
                    onClick={() => {
                      setIsConfirmedQuery(true);
                      setPagination({
                        ...pagination,
                        currentPage: 1,
                      });
                      setQuery({
                        ...query,
                        primarySortBy: null,
                        primarySortDir: null,
                      });
                    }}
                  >
                    <IconSortAscending
                      style={{
                        width: "70%",
                        height: "70%",
                        fontWeight: "bold",
                      }}
                      stroke={2}
                      color="#70B1ED"
                    />
                  </ActionIcon>
                )}
            </Group>
          );
        },
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return (
              <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
                {summaryRow.totalInRanges}
              </Text>
            );
          }
          const totalOrders = sumBy(row.original.data, "orders");
          return (
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {totalOrders}
            </Text>
          );
        },
      },
      ...customColumns,
    ],
    [customColumns, data, summaryRow]
  );

  const tableContainerRef = useRef(null); // Create a ref for the scrollable container

  // Function to scroll to the top of the table container
  const scrollToTop = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const table = useMantineReactTable({
    columns,
    data: tableDataWithSummary,
    editDisplayMode: "cell",
    enablePagination: false,
    getRowId: (row) => row.id,
    enableRowSelection: false,
    enableFilters: false,
    enableColumnActions: false,
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: {
      className: classes["disable-hover"],
    },
    enableDensityToggle: false,
    state: {
      showProgressBars: loading,
      sorting,
      isLoading: loading,
    },
    renderTopToolbar: () => {
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
              alignItems: "end",
            }}
          >
            <TextInput
              label="SKU"
              value={query?.sku || ""}
              onChange={(event) => {
                const value = event.target.value;
                setQuery({
                  ...query,
                  sku: value,
                });
              }}
              styles={{
                root: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: "10px",
                },
                input: {
                  width: "100px",
                },
                label: {
                  fontSize: "12px",
                  fontWeight: "bold",
                },
              }}
            />
            <MultiSelect
              placeholder="Store"
              data={AMZ_STORES}
              label="Store"
              // styles={{
              //   root: {
              //     display: "flex",
              //     alignItems: "center",
              //     gap: "10px",
              //   },
              //   label: {
              //     fontSize: "12px",
              //     fontWeight: "bold",
              //   },
              //   input: {
              //     width: "130px",
              //     minHeight: "35px",
              //   },
              //   inputField: {
              //     display: "none",
              //   },
              // }}
              styles={{
                root: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: "10px",
                },
                label: {
                  fontSize: "12px",
                  fontWeight: "bold",
                },
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
            {/* <MultiSelect
              label="Channel"
              placeholder="Channel"
              data={FULFILLMENT_CHANNELS}
              // styles={{
              //   root: {
              //     display: "flex",
              //     alignItems: "center",
              //     gap: "10px",
              //   },
              //   input: {
              //     width: "130px",
              //     minHeight: "35px",
              //   },
              //   label: {
              //     fontSize: "12px",
              //     fontWeight: "bold",
              //   },
              //   inputField: {
              //     display: "none",
              //   },
              // }}
              styles={{
                root: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: "10px",
                },
                input: {
                  width: "130px",
                  minHeight: "35px",
                },
                label: {
                  fontSize: "12px",
                  fontWeight: "bold",
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

            /> */}
            <Select
              data={keys(VALUES)}
              placeholder="Value"
              label="Value"
              // styles={{
              //   root: {
              //     display: "flex",
              //     alignItems: "center",
              //     gap: "10px",
              //   },
              //   input: {
              //     width: "100px",
              //   },
              //   label: {
              //     fontSize: "12px",
              //     fontWeight: "bold",
              //   },
              // }}
              styles={{
                root: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: "10px",
                },
                input: {
                  width: "100px",
                },
                label: {
                  fontSize: "12px",
                  fontWeight: "bold",
                },
              }}
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
            />
            {/* {activeTab === "Date" && (
       
        )} */}
            <Group>
              <TextInput
                label="List"
                value={listingDays}
                onChange={(event) => {
                  const value = event.target.value;
                  setListingDays(value);
                  if (value) {
                    setQuery({
                      ...query,
                      listingDays: toNumber(value),
                    });
                  }
                }}
                // styles={{
                //   root: {
                //     display: "flex",
                //     alignItems: "center",
                //     gap: "10px",
                //   },
                //   input: {
                //     width: "70px",
                //   },
                //   label: {
                //     fontSize: "12px",
                //     fontWeight: "bold",
                //   },
                // }}
                styles={{
                  root: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "10px",
                  },
                  input: {
                    width: "70px",
                  },
                  label: {
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                }}
              />
              <TextInput
                label="Ads"
                value={adDaysNum}
                onChange={(event) => {
                  const value = event.target.value;
                  setAdDaysNum(value);
                  if (value) {
                    setQuery({
                      ...query,
                      adDays: toNumber(value),
                    });
                  }
                }}
                // styles={{
                //   root: {
                //     display: "flex",
                //     alignItems: "center",
                //     gap: "10px",
                //   },
                //   input: {
                //     width: "70px",
                //   },
                //   label: {
                //     fontSize: "12px",
                //     fontWeight: "bold",
                //   },
                // }}
                styles={{
                  root: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "10px",
                  },
                  input: {
                    width: "70px",
                  },
                  label: {
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                }}
              />
            </Group>
            {/* {activeTab === "Week" && (
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
        )} */}

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
                setListingDays("");
                setAdDaysNum("");
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
                  listingDays: "",
                  adDays: "",
                });
              }}
            >
              <IconFilterOff />
            </Button>
          </Flex>
        </div>
      );
    },
    mantineTableBodyCellProps: () => ({
      className: classes["body-cells"],
      sx: {
        cursor: "pointer",
      },
    }),
    mantinePaperProps: {
      style: { "--mrt-row-hover-background-color": "#E1EAFF" },
    },
    onSortingChange: setSorting,
    enableColumnResizing: false,
    enableSorting: true,
    enableMultiSort: false,
    enableBottomToolbar: true,
    manualSorting: true,
    mantineBottomToolbarProps: () => {
      return {
        className: classes["bottom-toolbar"],
      };
    },
    renderBottomToolbarCustomActions: () => {
      return (
        <Button
          loading={loading}
          disabled={pagination.currentPage >= pagination.totalPages}
          onClick={() => {
            setPagination((prev) => ({
              ...prev,
              currentPage: prev.currentPage + 1,
            }));
            setIsLoadmore(true);
            setIsConfirmedQuery(true);
          }}
        >
          Load More
        </Button>
      );
    },
    mantineTableContainerProps: {
      style: {
        maxHeight: "63vh", // 70% of the viewport height
      },
      ref: tableContainerRef, // Attach ref to the scrollable container
    },
    enableStickyHeader: true,
    enableStickyFooter: true,
  });

  return !isEmpty(tableData) ? (
    <div>
      <MantineReactTable table={table} />
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition mounted={true}>
          {(transitionStyles) => (
            <Button
              leftSection={
                <IconArrowUp style={{ width: rem(16), height: rem(16) }} />
              }
              style={transitionStyles}
              onClick={scrollToTop} // Call the scroll function on click
            >
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
    </div>
  ) : null;
};

export default SellerboardTable;
