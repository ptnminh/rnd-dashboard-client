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
} from "lodash";

import classes from "./MyTable.module.css";
import { CONVERT_NUMBER_TO_STATUS, CONVERT_STATUS_TO_NUMBER, SIZES, VALUES } from "../../../utils";
import LazyLoad from "react-lazyload";
import { rankingServices } from "../../../services";

const TARGET_MODES = {
  ORDERS: "Orders",
  RANKING: "Ranking",
}
const SellerboardTable = ({
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
}) => {
  const handleUpdateRanking = async (id, data) => {
    await rankingServices.updateRanking({ id, data });
  }
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
                {query?.mode[0] === TARGET_MODES.ORDERS ? keyData?.ordersChange || 0 : keyData?.rankChange || 0}
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

  // Compute the Total theo ${activeTab} row data
  const summaryRow = useMemo(() => {
    const columns = merge(
      {},
      ...customColumns.map((col) => {
        const key = col.accessorKey;
        const keyLevels = flatMap(data, "data");
        const keyData = filter(keyLevels, (keyLevel) => keyLevel.key === key);
        const header = join(split(key, " ")?.slice(0, -1), " ");
        const view = query?.mode[0] === TARGET_MODES.ORDERS ? "ordersChange" : "rankChange"
        const totalOrders = sumBy(keyData, view) || 0;
        return {
          [header]: totalOrders?.toLocaleString(),
        };
      })
    );
    return {
      id: `Total theo ${activeTab}`, // Unique ID for the Total theo ${activeTab} row
      product: `Summary`,
      totalInRanges: sumBy(data, (row) =>
        sumBy(row.data, query?.mode[0] === TARGET_MODES.ORDERS ? "ordersChange" : "rankChange")
      )?.toLocaleString() || 0, // Example: sum of orders
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
        accessorKey: "product",
        header: "Product",
        size: 200,
        maxSize: 200,
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
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return (
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Total theo {activeTab}
              </Text>
            );
          }
          const {
            image,
            createdDate,
            link,
          } = row.original;
          return (
            <Flex direction="column">
              <Grid>
                <Grid.Col span={4}>
                  <LazyLoad height={50} once={true}>
                    <Image
                      src={image || "/images/content/not_found_2.jpg"}
                      width="100%"
                      height="50px"
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
                    <Grid.Col
                      span={12}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "gray",
                          cursor: "pointer",
                        }}
                      >
                        {createdDate}
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
          return <Select
            data={keys(VALUES)}
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
              handleUpdateRanking(id, { value: CONVERT_STATUS_TO_NUMBER[value] });
            }}
          />
        },
      },
      {
        accessorKey: "size",
        header: "Size",
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
                handleUpdateRanking(id, { size: CONVERT_STATUS_TO_NUMBER[value] });
              }}
            />
          )
        },
      },
      {
        accessorKey: "totalInRanges",
        header: "Total Changes",
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
            return (
              <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
                {summaryRow.totalInRanges}
              </Text>
            );
          }
          const view = query?.mode[0] === TARGET_MODES.ORDERS ? "ordersChange" : "rankChange"
          const totalOrders = sumBy(row.original.data, view);
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

export default SellerboardTable;
