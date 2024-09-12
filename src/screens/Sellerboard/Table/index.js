import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Text,
  Flex,
  Grid,
  Image,
  Select,
  Button,
  MultiSelect,
} from "@mantine/core";
import { find, map, flatten, uniq, join } from "lodash";
import { IconCurrencyDollar, IconFilterOff } from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import {
  AMZ_SORTING,
  AMZ_STORES,
  FULFILLMENT_CHANNELS,
} from "../../../constant";

const SellerboardTable = ({
  tableData,
  query,
  loading,
  sorting,
  setSorting,
  setQuery,
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
        header: keyLevel,
        size: 50,
        enableEditing: false,
        enableSorting: false,
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
                  fontSize: 14,
                  fontWeight: "bold",
                }}
                left={<IconCurrencyDollar />}
              >
                ${keyData.revenue}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "gray",
                }}
              >
                Order: {keyData.orders}
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

  // UseMemo to construct final columns array
  const columns = useMemo(
    () => [
      {
        accessorKey: "product",
        header: "Product",
        size: 200,
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
          const { ASIN, title, image, store, fulfillmentChannel, sku } =
            row.original;
          return (
            <Flex direction="column">
              <Grid>
                <Grid.Col span={4}>
                  <Image
                    src={image || "/images/content/not_found_2.jpg"}
                    width="100%"
                    height="50px"
                  />
                </Grid.Col>
                <Grid.Col span={8}>
                  <Grid>
                    <Grid.Col span={12}>
                      <Flex>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "gray",
                          }}
                        >
                          <span
                            style={{
                              color: "orange",
                            }}
                          >
                            {store}
                          </span>{" "}
                          -{" "}
                          <span
                            style={{
                              color: "green",
                            }}
                          >
                            {fulfillmentChannel}
                          </span>{" "}
                          - {ASIN} - {sku}
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
                      <Text
                        style={{
                          display: "inline-block",
                          width: "250px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textDecoration: "none",
                          fontSize: 14,
                        }}
                      >
                        {title}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </Grid>
            </Flex>
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
    enableSorting: false,
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
                  width: "300px",
                },
              }}
              value={query?.storeValues}
              onChange={(value) =>
                setQuery({
                  ...query,
                  stores: join(value, ","),
                  storeValues: value,
                })
              }
              clearable
              searchable
              onClear={() => {
                setQuery({
                  ...query,
                  stores: null,
                });
              }}
            />
            <Select
              placeholder="Channel"
              data={FULFILLMENT_CHANNELS}
              styles={{
                input: {
                  width: "250px",
                },
              }}
              value={query?.fulfillmentChannel}
              onChange={(value) =>
                setQuery({ ...query, fulfillmentChannel: value })
              }
              clearable
              searchable
              onClear={() => {
                setQuery({
                  ...query,
                  fulfillmentChannel: null,
                });
              }}
            />
            <Select
              placeholder="Sorting"
              data={AMZ_SORTING}
              styles={{
                input: {
                  width: "250px",
                },
              }}
              value={query?.sortValue}
              onChange={(value) => {
                let sortBy = "";
                let sortDir = "";
                switch (value) {
                  case "Revenue (A-Z)":
                    sortBy = "revenue";
                    sortDir = "asc";
                    break;
                  case "Revenue (Z-A)":
                    sortBy = "revenue";
                    sortDir = "desc";
                    break;
                  case "Orders (A-Z)":
                    sortBy = "orders";
                    sortDir = "asc";
                    break;
                  case "Orders (Z-A)":
                    sortBy = "orders";
                    sortDir = "desc";
                    break;
                  default:
                    value = null;
                }
                setQuery({ ...query, sortValue: value, sortBy, sortDir });
              }}
              clearable
              searchable
              onClear={() => {
                setQuery({
                  ...query,
                  sortValue: null,
                  sortBy: null,
                  sortDir: null,
                });
              }}
            />
            <Button
              onClick={() => {
                setQuery({
                  stores: null,
                  fulfillmentChannel: null,
                  sortValue: null,
                  sortBy: null,
                  sortDir: null,
                  storeValues: [],
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
  });

  return <MantineReactTable table={table} />;
};

export default SellerboardTable;
