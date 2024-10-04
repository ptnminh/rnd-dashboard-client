import React, { useState, useMemo, useEffect, useRef } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Text,
  Flex,
  Grid,
  Image,
  Button,
  Badge,
  Tooltip,
  Group,
  Select,
  ActionIcon,
  Checkbox,
  Affix,
  Transition,
  rem,
} from "@mantine/core";
import {
  find,
  map,
  flatten,
  uniq,
  values,
  filter,
  sumBy,
  flatMap,
  merge,
  isEmpty,
} from "lodash";

import classes from "./MyTable.module.css";
import {
  IconSortAscending,
  IconSortDescending,
  IconArrowsSort,
  IconArrowUp,
} from "@tabler/icons-react";
import { CONVERT_NUMBER_TO_STATUS } from "../../../utils";
import {
  CONVERT_NUMBER_TO_POD_DASHBOARD_STATUS,
  CONVERT_STATUS_TO_POD_DASHBOARD_NUMBER,
  POD_DASHBOARD_STATUS,
} from "../../../constant/common";
import { dashboardServices } from "../../../services";
import moment from "moment-timezone";
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
const PODTableBoard = ({
  tableData,
  query,
  loading,
  sorting,
  setSorting,
  setQuery,
  activeTab,
  setPagination,
  pagination,
  setIsLoadmore,
  setOverridePODMetrics,
  overridePODMetrics,
  setTableData,
}) => {
  const handleUpdatePODDashboard = async (id, data) => {
    await dashboardServices.handleUpdatePODDashboard({ id, data });
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
      return {
        accessorKey: keyLevel,
        header: keyLevel,
        size: 100,
        maxSize: 150,
        enableEditing: false,
        enableSorting: true,
        mantineTableBodyCellProps: ({ row }) => {
          const rankChange = find(row.original.data, {
            key: keyLevel,
          })?.rankChange;
          const uid = row?.original?.uid;
          const foundData = find(data, { uid });

          const { latestRank } = row?.original;
          let color = null;
          if (latestRank > 1 && latestRank <= 50) {
            if (rankChange > 1) {
              color = "#A2E09C";
            }
          } else if (latestRank > 50 && latestRank <= 100) {
            if (rankChange > 3) {
              color = "#A2E09C";
            }
          } else if (latestRank > 100) {
            if (rankChange > 5) {
              color = "#A2E09C";
            }
          }
          let classnames = null;
          if (color && query?.sortBy === keyLevel) {
            classnames = classes["highlight"];
          }
          // if (foundData?.overrideColor || overridePODMetrics?.includes(uid)) {
          //   classnames = classes["highlight-follow-row"];
          // }
          if (row.id === `Total theo ${activeTab}`) {
            classnames = classes["summary-row"];
          }
          return {
            className: classnames || classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: {
          className: classes["edit-header"],
        },
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return (
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {row.original[keyLevel]}
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
                {keyData?.totalOrders || 0}
              </Text>
            </Flex>
          );
        },
      };
    });
    return columns;
  };

  // UseEffect to generate and sort columns based on tableData
  useEffect(() => {
    setData(tableData);
    setCustomColumns(generateCustomColumn(tableData));
  }, [tableData]);

  useEffect(() => {
    if (!isEmpty(overridePODMetrics)) {
      const orderedData = moveOverrideColorToStart(
        map(data, (item) => {
          if (overridePODMetrics.includes(item.uid)) {
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
  }, [overridePODMetrics]);

  // Compute the Total theo ${activeTab} row data
  const summaryRow = useMemo(() => {
    const columns = merge(
      {},
      ...customColumns.map((col) => {
        const key = col.accessorKey;
        const keyLevels = flatMap(data, "data");
        const keyData = filter(keyLevels, (keyLevel) => keyLevel.key === key);
        const totalOrders = sumBy(keyData, "orders");
        return {
          [key]: totalOrders?.toLocaleString(),
        };
      })
    );
    return {
      id: `Total theo ${activeTab}`, // Unique ID for the Total theo ${activeTab} row
      product: `Lifetime Order`,
      totalInRanges: sumBy(data, "totalOrdersInRange")?.toLocaleString(), // Example: sum of orders
      ...columns,
    };
  }, [data, customColumns]);

  // Combine table data with the Total theo ${activeTab} row
  const tableDataWithSummary = useMemo(
    () => [...data, summaryRow],
    [data, summaryRow]
  );

  // UseMemo to construct final columns array
  const columns = useMemo(
    () => [
      {
        accessorKey: "checkbox",
        header: "",
        size: 50,
        maxSize: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["checkbox-body-cells"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        Cell: ({ row }) => {
          const { uid } = row.original;
          const foundData = find(data, { uid });
          if (row.id === `Total theo ${activeTab}`) {
            return null;
          }
          return (
            <Checkbox
              size="lg"
              checked={foundData?.isChecked}
              onChange={() => {
                const newData = data.map((item) => {
                  if (item.uid === uid) {
                    return {
                      ...item,
                      isChecked: !item.isChecked,
                    };
                  }
                  return item;
                });
                setTableData(newData);
                handleUpdatePODDashboard(uid, {
                  isChecked: !foundData?.isChecked,
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "product",
        header: "Product",
        size: 230,
        maxSize: 230,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
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
                    {(!query?.sortBy || query?.sortBy !== "testDate") && (
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
                          setQuery({
                            ...query,
                            sortBy: "testDate",
                            sortDir: "desc",
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
                    {query?.sortBy === "testDate" &&
                      query?.sortDir === "desc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          color="transparent"
                          size="sm"
                          onClick={() => {
                            setQuery({
                              ...query,
                              sortBy: "testDate",
                              sortDir: "asc",
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
                    {query?.sortBy === "testDate" &&
                      query?.sortDir === "asc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          size="sm"
                          color="transparent"
                          onClick={() => {
                            setQuery({
                              ...query,
                              sortBy: null,
                              sortDir: null,
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
                    {(!query?.sortBy || query?.sortBy !== "createdDate") && (
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
                          setQuery({
                            ...query,
                            sortBy: "createdDate",
                            sortDir: "desc",
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

                    {query?.sortBy === "createdDate" &&
                      query?.sortDir === "desc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          color="transparent"
                          size="sm"
                          onClick={() => {
                            setQuery({
                              ...query,
                              sortBy: "createdDate",
                              sortDir: "desc",
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
                    {query?.sortBy === "createdDate" &&
                      query?.sortDir === "asc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          size="sm"
                          color="transparent"
                          onClick={() => {
                            setQuery({
                              ...query,
                              sortBy: null,
                              sortDir: null,
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
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
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
            imageLink,
            sku,
            productLink,
            designLink,
            testDate,
            createdDate,
          } = row.original;
          return (
            <Flex direction="column">
              <Grid
                style={{
                  padding: 0,
                }}
              >
                <Grid.Col
                  span={6}
                  style={{
                    padding: 0,
                  }}
                >
                  <Tooltip label={productLink}>
                    <Image
                      src={imageLink || "/images/content/not_found_2.jpg"}
                      width="100%"
                      height="100%"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        window.open(productLink, "_blank");
                      }}
                      fit="contain"
                    />
                  </Tooltip>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Grid
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Grid.Col
                      span={12}
                      style={{
                        padding: "0 5px",
                      }}
                    >
                      <Flex
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (designLink) {
                            window.open(designLink, "_blank");
                          }
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            textDecoration: "underline",
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
                            marginLeft: "3px",
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
                            marginLeft: "3px",
                          }}
                        >
                          Ads:{" "}
                          {moment(testDate).subtract(testDate).fromNow(true)}
                        </Text>
                      </Grid.Col>
                    )}
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
                  {(!query?.sortBy ||
                    query?.sortBy !== "totalOrdersLifetime") && (
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
                        setQuery({
                          ...query,
                          sortBy: "totalOrdersLifetime",
                          sortDir: "desc",
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

                  {query?.sortBy === "totalOrdersLifetime" &&
                    query?.sortDir === "desc" && (
                      <ActionIcon
                        variant="filled"
                        aria-label="Settings"
                        color="transparent"
                        size="sm"
                        onClick={() => {
                          setQuery({
                            ...query,
                            sortBy: "totalOrdersLifetime",
                            sortDir: "asc",
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
                  {query?.sortBy === "totalOrdersLifetime" &&
                    query?.sortDir === "asc" && (
                      <ActionIcon
                        variant="filled"
                        aria-label="Settings"
                        size="sm"
                        color="transparent"
                        onClick={() => {
                          setQuery({
                            ...query,
                            sortBy: null,
                            sortDir: null,
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
          const { totalOrdersLifetime } = row.original;
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
                {totalOrdersLifetime?.toLocaleString()}
              </Text>
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
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const optimized = payload?.optimized;
          return (
            <Select
              size="xs"
              allowDeselect={false}
              data={values(POD_DASHBOARD_STATUS)}
              value={CONVERT_NUMBER_TO_POD_DASHBOARD_STATUS[optimized]}
              onChange={(value) => {
                const newFollow = CONVERT_STATUS_TO_POD_DASHBOARD_NUMBER[value];
                const newData = data.map((item) => {
                  if (item.uid === uid) {
                    if (newFollow === 1) {
                      setOverridePODMetrics([...overridePODMetrics, uid]);
                    } else {
                      setOverridePODMetrics(
                        overridePODMetrics.filter((x) => x !== uid)
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
                const orderedData = moveOverrideColorToStart(newData, uid);
                setData(orderedData);
                setTableData(orderedData);
                setCustomColumns(generateCustomColumn(orderedData));
                handleUpdatePODDashboard(uid, { optimized: newFollow });
              }}
            />
          );
        },
      },
      {
        accessorKey: "totalInRanges",
        header: "Total Orders",
        size: 120,
        maxSize: 120,
        enableEditing: false,
        enableSorting: false,
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
              {(!query?.sortBy || query?.sortBy !== "totalOrdersInRange") && (
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
                    setQuery({
                      ...query,
                      sortBy: "totalOrdersInRange",
                      sortDir: "desc",
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

              {query?.sortBy === "totalOrdersInRange" &&
                query?.sortDir === "desc" && (
                  <ActionIcon
                    variant="filled"
                    aria-label="Settings"
                    color="transparent"
                    size="sm"
                    onClick={() => {
                      setQuery({
                        ...query,
                        sortBy: "totalOrdersInRange",
                        sortDir: "asc",
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
              {query?.sortBy === "totalOrdersInRange" &&
                query?.sortDir === "asc" && (
                  <ActionIcon
                    variant="filled"
                    aria-label="Settings"
                    size="sm"
                    color="transparent"
                    onClick={() => {
                      setQuery({
                        ...query,
                        sortBy: null,
                        sortDir: null,
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
            return (
              <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
                {summaryRow.totalInRanges}
              </Text>
            );
          }
          const totalOrders = row.original.totalOrdersInRange || 0;
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
    enableToolbarInternalActions: false,
    enableTopToolbar: false,
    enableColumnActions: false,
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    enableDensityToggle: false,
    state: {
      showProgressBars: loading,
      sorting,
      isLoading: loading,
    },
    mantineTableBodyCellProps: () => ({
      className: classes["body-cells"],
      sx: {
        cursor: "pointer",
      },
    }),
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
    mantinePaperProps: {
      style: { "--mrt-row-hover-background-color": "#E1EAFF" },
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
          }}
        >
          Load More
        </Button>
      );
    },
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: {
      ref: tableContainerRef, // Attach ref to the scrollable container
    },
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

export default PODTableBoard;
