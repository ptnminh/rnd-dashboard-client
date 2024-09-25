import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Text,
  Flex,
  Grid,
  Image,
  Button,
  Badge,
  Select,
  Group,
  ActionIcon,
} from "@mantine/core";
import {
  find,
  map,
  flatten,
  uniq,
  join,
  split,
  filter,
  sumBy,
  flatMap,
  merge,
  keys,
  isEmpty,
  orderBy,
  slice,
} from "lodash";

import classes from "./MyTable.module.css";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
  SIZES,
  VALUES,
} from "../../../utils";
import LazyLoad from "react-lazyload";
import { rankingServices } from "../../../services";
import {
  IconSortAscending,
  IconArrowsSort,
  IconSortDescending,
  IconHeart,
} from "@tabler/icons-react";
import moment from "moment-timezone";

const TARGET_MODES = {
  ORDERS: "Orders",
  RANKING: "Ranking",
};

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

const RankingTable = ({
  tableData,
  query,
  loading,
  sorting,
  setSorting,
  setQuery,
  activeTab = "date",
  setPagination,
  pagination,
  setIsLoadmore,
  openPreviewImage,
  setSelectedProduct,
  setOverrideProductRankings,
  overrideProductRankings,
}) => {
  const handleUpdateRanking = async (id, data) => {
    await rankingServices.updateRanking({ id, data });
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
    let keyLevels = extractUniqueKeys(data);
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
          const { latestRank } = row?.original;
          const id = row?.original?.id;
          const foundData = find(data, { id });
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
          if (color && query?.mode[0] === TARGET_MODES.RANKING) {
            classnames = classes["highlight"];
          }
          if (
            foundData?.overrideColor ||
            overrideProductRankings.includes(id)
          ) {
            classnames = classes["highlight-follow-row"];
          }
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
                {query?.mode[0] === TARGET_MODES.ORDERS
                  ? keyData?.ordersChange || 0
                  : keyData?.rankChange || 0}
              </Text>
            </Flex>
          );
        },
      };
    });
    return orderBy(columns, "header", "desc");
  };

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
        let keyLevels = flatMap(data, "data");

        const keyData = filter(keyLevels, (keyLevel) => keyLevel.key === key);
        const header = join(split(key, " ")?.slice(0, -1), " ");
        const view =
          query?.mode[0] === TARGET_MODES.ORDERS
            ? "ordersChange"
            : "rankChange";
        const totalOrders = sumBy(keyData, view) || 0;
        return {
          [header]: totalOrders?.toLocaleString(),
        };
      })
    );
    return {
      id: `Total theo ${activeTab}`, // Unique ID for the Total theo ${activeTab} row
      product: `Summary`,
      totalInRanges:
        sumBy(data, (row) => {
          const view =
            query?.mode[0] === TARGET_MODES.ORDERS
              ? "totalOrdersChanges"
              : "totalRankChanges";
          const totalOrders = row?.[view] || 0;
          return totalOrders;
        })?.toLocaleString() || 0, // Example: sum of orders
      ...columns,
    };
  }, [data, customColumns]);

  // Combine table data with the Total theo ${activeTab} row
  const tableDataWithSummary = useMemo(
    () => [...data, summaryRow],
    [data, summaryRow]
  );

  // UseMemo to construct final columns array with sorted custom columns
  const columns = useMemo(() => {
    const baseColumns = [
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
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Header: ({ row }) => {
          const isShow = query?.mode[0] === TARGET_MODES.RANKING;
          return (
            <Group gap={5}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Product
              </Text>
              {isShow && !query?.sortBy && (
                <ActionIcon
                  aria-label="Settings"
                  variant="default"
                  style={{
                    background: "none",
                    border: "none",
                  }}
                  onClick={() => {
                    setPagination({
                      ...pagination,
                      currentPage: 1,
                    });
                    setSorting([]);
                    setQuery({
                      ...query,
                      sortBy: "latestRank",
                      sortDir: "desc",
                    });
                  }}
                >
                  <IconArrowsSort
                    style={{ width: "60%", height: "60%", fontWeight: "bold" }}
                    stroke={2}
                  />
                </ActionIcon>
              )}

              {isShow &&
                query?.sortBy === "latestRank" &&
                query?.sortDir === "desc" && (
                  <ActionIcon
                    variant="filled"
                    aria-label="Settings"
                    color="transparent"
                    onClick={() => {
                      setSorting([]);
                      setPagination({
                        ...pagination,
                        currentPage: 1,
                      });
                      setQuery({
                        ...query,
                        sortBy: "latestRank",
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
              {isShow &&
                query?.sortBy === "latestRank" &&
                query?.sortDir === "asc" && (
                  <ActionIcon
                    variant="filled"
                    aria-label="Settings"
                    color="transparent"
                    onClick={() => {
                      setSorting([]);
                      setPagination({
                        ...pagination,
                        currentPage: 1,
                      });
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
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return (
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Total theo {activeTab}
              </Text>
            );
          }
          const { image, createdDate, link, originalData } = row.original;
          let changesData = slice(originalData, 0, 3)
            ?.map((x) => x.rank)
            ?.map((x, index) => {
              return (
                <Text
                  style={{
                    ...(index === 0
                      ? {
                          fontSize: 10,
                        }
                      : {
                          fontSize: 10,
                          color: "gray",
                        }),
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  {index !== 0 ? " <- " : ""} {x}
                </Text>
              );
            });

          return (
            <Flex direction="column">
              <Grid
                style={{
                  padding: "0",
                }}
              >
                <Grid.Col
                  span={6}
                  style={{
                    padding: "0",
                  }}
                >
                  <LazyLoad height={50} once={true}>
                    <Image
                      src={image || "/images/content/not_found_2.jpg"}
                      width="100%"
                      height="100%"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedProduct(row.original);
                        openPreviewImage();
                      }}
                      fit="contain"
                    />
                  </LazyLoad>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Grid>
                    <Grid.Col
                      span={12}
                      style={{
                        padding: "0 5px",
                      }}
                    >
                      <Flex align="center">
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            window.open(link, "_blank");
                          }}
                        >
                          <Badge color="blue" style={{ marginRight: 5 }}>
                            link
                          </Badge>
                        </Text>
                      </Flex>
                    </Grid.Col>
                    {query?.mode[0] === TARGET_MODES.RANKING && (
                      <Grid.Col span={12}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "2px",
                          }}
                        >
                          {changesData}
                        </div>
                      </Grid.Col>
                    )}

                    <Grid.Col span={12}>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        Đã tạo:{" "}
                        {moment(createdDate).subtract(createdDate).fromNow()}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </Grid>
            </Flex>
          );
        },
      },
      {
        accessorKey: "value",
        header: "Value",
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
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return null;
          }
          const id = row.original.id;
          const payload = find(data, { id });
          const value = payload?.value || 2;
          let color = null;
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
          return (
            <Select
              data={keys(VALUES)}
              allowDeselect={false}
              value={CONVERT_NUMBER_TO_STATUS[value]}
              onChange={(value) => {
                const newData = data.map((item) => {
                  if (item.id === id) {
                    return {
                      ...item,
                      value: CONVERT_STATUS_TO_NUMBER[value],
                    };
                  }
                  return item;
                });
                setData(newData);
                handleUpdateRanking(id, {
                  value: CONVERT_STATUS_TO_NUMBER[value],
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "size",
        header: "Size",
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
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return null;
          }
          let color = null;
          const id = row.original.id;
          const payload = find(data, { id });
          const size = payload?.size || 2;
          switch (size) {
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
          return (
            <Select
              data={keys(SIZES)}
              value={CONVERT_NUMBER_TO_STATUS[size]}
              onChange={(value) => {
                const newData = data.map((item) => {
                  if (item.id === id) {
                    return {
                      ...item,
                      size: CONVERT_STATUS_TO_NUMBER[value],
                    };
                  }
                  return item;
                });
                setData(newData);
                handleUpdateRanking(id, {
                  size: CONVERT_STATUS_TO_NUMBER[value],
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 30,
        maxSize: 30,
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
          const id = row.original.id;
          const payload = find(data, { id });
          const follow = payload?.follow;
          return (
            <ActionIcon
              variant={follow ? "gradient" : "default"}
              size="xl"
              gradient={follow ? { from: "red", to: "red", deg: 90 } : {}}
              onClick={() => {
                const value = follow ? 0 : 1;
                const newData = data.map((item) => {
                  if (item.id === id) {
                    if (value === 1) {
                      setOverrideProductRankings([
                        ...overrideProductRankings,
                        id,
                      ]);
                    } else {
                      setOverrideProductRankings(
                        overrideProductRankings.filter((x) => x !== id)
                      );
                    }
                    return {
                      ...item,
                      follow: value,
                      ...(value === 1
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

                const orderedData = moveOverrideColorToStart(newData, id);
                setData(orderedData);
                setCustomColumns(generateCustomColumn(orderedData));
                handleUpdateRanking(id, {
                  follow: value,
                });
              }}
            >
              <IconHeart />
            </ActionIcon>
          );
        },
      },
      {
        accessorKey: "totalInRanges",
        header: "Total Changes",
        size: 150,
        maxSize: 150,
        enableEditing: false,
        enableSorting: false,
        Header: ({ row }) => {
          const view =
            query?.mode[0] === TARGET_MODES.ORDERS
              ? "totalOrdersChanges"
              : "totalRankChanges";
          return (
            <Group gap={5}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Total Changes
              </Text>
              {!query?.sortBy && (
                <ActionIcon
                  aria-label="Settings"
                  variant="default"
                  style={{
                    background: "none",
                    border: "none",
                  }}
                  onClick={() => {
                    setPagination({
                      ...pagination,
                      currentPage: 1,
                    });
                    setSorting([]);
                    setQuery({
                      ...query,
                      sortBy: view,
                      sortDir: "desc",
                    });
                  }}
                >
                  <IconArrowsSort
                    style={{ width: "60%", height: "60%", fontWeight: "bold" }}
                    stroke={2}
                  />
                </ActionIcon>
              )}
              {query?.sortBy === view && query?.sortDir === "desc" && (
                <ActionIcon
                  variant="filled"
                  aria-label="Settings"
                  color="transparent"
                  onClick={() => {
                    setSorting([]);
                    setPagination({
                      ...pagination,
                      currentPage: 1,
                    });
                    setQuery({
                      ...query,
                      sortBy: view,
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
              {query?.sortBy === view && query?.sortDir === "asc" && (
                <ActionIcon
                  variant="filled"
                  aria-label="Settings"
                  color="transparent"
                  onClick={() => {
                    setSorting([]);
                    setPagination({
                      ...pagination,
                      currentPage: 1,
                    });
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
          const view =
            query?.mode[0] === TARGET_MODES.ORDERS
              ? "totalOrdersChanges"
              : "totalRankChanges";
          const totalChanges = row?.original[view] || 0;
          return (
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {totalChanges}
            </Text>
          );
        },
      },
    ];
    // Combine base columns and custom columns, ensuring custom columns are always sorted
    return [...baseColumns, ...orderBy(customColumns, "header", "desc")];
  }, [customColumns, data, summaryRow]);

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
        ></div>
      );
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
  });

  return !isEmpty(tableData) && !isEmpty(customColumns) ? (
    <MantineReactTable table={table} />
  ) : null;
};

export default RankingTable;
