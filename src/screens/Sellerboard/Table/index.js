import React, { useState, useMemo, useEffect } from "react";
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
  ActionIcon,
  Select,
  TextInput,
} from "@mantine/core";
import {
  find,
  map,
  flatten,
  uniq,
  join,
  isEmpty,
  split,
  includes,
  values,
  every,
  filter,
  difference,
} from "lodash";
import { IconFilterOff } from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import {
  AMZ_SORTING,
  AMZ_STORES,
  FULFILLMENT_CHANNELS,
} from "../../../constant";
import moment from "moment-timezone";
import { arraysMatchUnordered, CONVERT_NUMBER_TO_STATUS } from "../../../utils";
import { DateRangePicker } from "rsuite";
import {
  IconArrowsSort,
  IconSortDescending,
  IconSortAscending,
} from "@tabler/icons-react";

const SellerboardTable = ({
  tableData,
  query,
  loading,
  sorting,
  setSorting,
  setQuery,
  activeTab,
  setIsConfirmedQuery,
}) => {
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
        header: join(split(keyLevel, " ").slice(0, -1), " "),
        size: 100,
        maxSize: 150,
        enableEditing: false,
        enableSorting: true,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: {
          className: classes["edit-header"],
        },
        Cell: ({ row }) => {
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
                {keyData.orders}
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
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          const {
            ASIN,
            title,
            image,
            store,
            fulfillmentChannel,
            sku,
            totalOrders,
          } = row.original;
          const url = `https://www.amazon.com/dp/${ASIN}`;
          return (
            <Flex direction="column">
              <Grid>
                <Grid.Col span={4}>
                  <Tooltip label={url}>
                    <Image
                      src={image || "/images/content/not_found_2.jpg"}
                      width="100%"
                      height="50px"
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
                <Grid.Col span={8}>
                  <Grid>
                    <Grid.Col
                      span={12}
                      style={{
                        padding: "0 5px",
                      }}
                    >
                      <Flex>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                          {sku} - {totalOrders}
                        </Text>
                      </Flex>
                    </Grid.Col>

                    <Grid.Col
                      span={12}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                      }}
                    >
                      <Tooltip label={url}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "gray",
                            cursor: "pointer",
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
        size: 150,
        maxSize: 150,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
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
                Created time
              </Text>
              {!query?.primarySortBy && (
                <ActionIcon
                  aria-label="Settings"
                  variant="default"
                  style={{
                    background: "none",
                    border: "none",
                  }}
                  onClick={() => {
                    setIsConfirmedQuery(true);
                    setQuery({
                      ...query,
                      primarySortBy: "createdDate",
                      primarySortDir: "desc",
                    });
                  }}
                >
                  <IconArrowsSort
                    style={{ width: "60%", height: "60%", fontWeight: "bold" }}
                    stroke={2}
                  />
                </ActionIcon>
              )}

              {query?.primarySortBy === "createdDate" &&
                query?.primarySortDir === "desc" && (
                  <ActionIcon
                    variant="filled"
                    aria-label="Settings"
                    color="transparent"
                    onClick={() => {
                      setIsConfirmedQuery(true);
                      setQuery({
                        ...query,
                        primarySortBy: "createdDate",
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
              {query?.primarySortBy === "createdDate" &&
                query?.primarySortDir === "asc" && (
                  <ActionIcon
                    variant="filled"
                    aria-label="Settings"
                    color="transparent"
                    onClick={() => {
                      setIsConfirmedQuery(true);
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
          const { createdDate } = row.original;
          return (
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {moment(createdDate)
                .tz("America/Los_Angeles")
                .format("YYYY-MM-DD")}
            </Text>
          );
        },
      },
      {
        accessorKey: "value",
        header: "Value",
        size: 150,
        maxSize: 150,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
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
      ...customColumns,
    ],
    [customColumns, data]
  );

  const table = useMantineReactTable({
    columns,
    data,
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
      isLoading: loading,
      sorting,
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
                    endCreatedDate: moment(shortcut.value[1]).format(
                      "YYYY-MM-DD"
                    ),
                  });
                }}
              />
            )}
            {activeTab === "Week" && (
              <DateRangePicker
                size="sx"
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
                    endCreatedDate: moment(shortcut.value[1]).format(
                      "YYYY-MM-DD"
                    ),
                  });
                }}
              />
            )}
            {activeTab === "Month" && (
              <DateRangePicker
                size="sx"
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
                    endCreatedDate: moment(shortcut.value[1]).format(
                      "YYYY-MM-DD"
                    ),
                  });
                }}
              />
            )}
            {activeTab === "Date" && (
              <>
                <DateRangePicker
                  size="sx"
                  placeholder="Sales Date"
                  style={{
                    width: "100px",
                  }}
                  value={query.salesDateValue}
                  onOk={(value) =>
                    setQuery({
                      ...query,
                      salesDateValue: value,
                      startDate: moment(value[0]).format("YYYY-MM-DD"),
                      endDate: moment(value[1]).format("YYYY-MM-DD"),
                      ordersInRange: 1,
                    })
                  }
                  onOpen={() => {
                    console.log("open");
                  }}
                  onClean={() => {
                    setQuery({
                      ...query,
                      salesDateValue: null,
                      startDate: null,
                      endDate: null,
                      ordersInRange: "",
                    });
                  }}
                  onShortcutClick={(shortcut) => {
                    setQuery({
                      ...query,
                      salesDateValue: shortcut.value,
                      startDate: moment(shortcut.value[0]).format("YYYY-MM-DD"),
                      endDate: moment(shortcut.value[1]).format("YYYY-MM-DD"),
                      ordersInRange: 1,
                    });
                  }}
                />
                <TextInput
                  placeholder="Min Orders"
                  style={{
                    width: "90px",
                  }}
                  value={query?.ordersInRange}
                  onChange={(event) => {
                    setQuery({
                      ...query,
                      ordersInRange: event.target.value,
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
                    primarySortBy = "saleInRange";
                    primarySortDir = "asc";
                    break;
                  case AMZ_SORTING.saleInRangeDesc:
                    primarySortBy = "saleInRange";
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
                setIsConfirmedQuery(true);
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={() => {
                setIsConfirmedQuery(true);
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
                  ordersInRange: "",
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
    onSortingChange: setSorting,
    enableColumnResizing: false,
    enableSorting: true,
    enableMultiSort: false,
    manualSorting: true,
  });

  return <MantineReactTable table={table} />;
};

export default SellerboardTable;
