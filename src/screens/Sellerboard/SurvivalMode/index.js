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
  Select,
  TextInput,
  Group,
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
  filter,
} from "lodash";
import { IconFilterOff } from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import {
  AMZ_SORTING,
  AMZ_STORES,
  FULFILLMENT_CHANNELS,
} from "../../../constant";
import { arraysMatchUnordered, CONVERT_NUMBER_TO_STATUS } from "../../../utils";
import { IconCalendarWeek, IconTarget } from "@tabler/icons-react";

const SurvivalModeTable = ({
  tableData,
  query,
  loading,
  sorting,
  setSorting,
  setQuery,
  activeTab,
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
        size: 250,
        maxSize: 300,
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
          const dayLefts = keyData?.dayLefts || 0;
          const targetSales = keyData?.targetSales || 0;
          const currentSales = keyData?.currentSales || 0;

          return dayLefts > 0 && targetSales > 0 ? (
            <Flex direction="column">
              <Group
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  <IconCalendarWeek color="#89CCFF" /> {keyData.orders} /{" "}
                  {keyData.orders}
                </Text>
                <span>-</span>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  <IconTarget color="#E74C3C" /> {keyData.orders} /{" "}
                  {keyData.orders}
                </Text>
              </Group>
            </Flex>
          ) : (
            <Flex direction="column">
              <Group
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  <IconCalendarWeek color="#89CCFF" /> {keyData.orders}
                </Text>
                <span>-</span>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  <IconTarget color="#E74C3C" /> {keyData.orders} /{" "}
                  {keyData.orders}
                </Text>
              </Group>
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
            className: classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          const { ASIN, title, image, store, fulfillmentChannel, sku } =
            row.original;
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
                      fit="contain"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        window.open(url, "_blank");
                      }}
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
                          {sku}
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
                          {ASIN}
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
                    primarySortBy = "revenue";
                    primarySortDir = "asc";
                    break;
                  case AMZ_SORTING.ordersDesc:
                    primarySortBy = "revenue";
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
              onClick={() => {
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
                  salesDateValue: null,
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

export default SurvivalModeTable;
