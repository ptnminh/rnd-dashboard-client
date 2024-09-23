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
  Select,
  TextInput,
  ActionIcon,
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
} from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import {
  AMZ_SORTING,
  AMZ_STORES,
  FULFILLMENT_CHANNELS,
} from "../../../constant";
import moment from "moment-timezone";
import { arraysMatchUnordered, CONVERT_NUMBER_TO_STATUS, SIZES, VALUES } from "../../../utils";
import { DateRangePicker } from "rsuite";
import LazyLoad from "react-lazyload";

const mock = [
  {
    "sku": "PTM-L008",
    "title": "Pawfect House I Wish We Lived Closer, Personalized Bestie Coffee Mugs With Names, Christmas Birthday Gifts For Best Friend Woman, 11 Oz Pottery Mug, Sisters Gifts From Sister, Bestie Gifts For Women",
    "image": "https://m.media-amazon.com/images/I/41IdxguvgxL.jpg",
    "fulfillmentChannel": "FBM",
    "store": "PFH",
    size: 1,
    "data": [
      {
        "key": "21 Sep 24",
        "revenue": 855.01,
        "quantity": 28,
        "orders": 27
      },
      {
        "key": "20 Sep 24",
        "revenue": 1159.86,
        "quantity": 38,
        "orders": 38
      },
      {
        "key": "19 Sep 24",
        "revenue": 733.87,
        "quantity": 24,
        "orders": 24
      },
      {
        "key": "18 Sep 24",
        "revenue": 696.59,
        "quantity": 24,
        "orders": 24
      },
      {
        "key": "17 Sep 24",
        "revenue": 829.85,
        "quantity": 28,
        "orders": 28
      },
      {
        "key": "16 Sep 24",
        "revenue": 689.96,
        "quantity": 24,
        "orders": 24
      },
      {
        "key": "15 Sep 24",
        "revenue": 1398.66,
        "quantity": 47,
        "orders": 45
      },
      {
        "key": "14 Sep 24",
        "revenue": 1403.11,
        "quantity": 46,
        "orders": 46
      }
    ],
    "ASIN": "B0DF6ZBDZW",
    "createdDate": "2024-08-25",
    "ordersInRange": 256,
    "totalOrders": 415,
    "value": 3
  },
  {
    "sku": "MEP-SY-003",
    "title": "Pawfect House Dog Memorial Gifts for Loss of Dog, Dog Memorial Stone, Pet Memorial Gifts, Pet Loss Gifts, Pet Memorial Stone, Cemetery Decorations for Grave, Cat Memorial Gifts, Gifts for Cat Lovers",
    "image": "https://m.media-amazon.com/images/I/71lSQy1mxqL.jpg",
    "fulfillmentChannel": "FBM",
    "store": "PFH",
    size: 1,
    "data": [
      {
        "key": "21 Sep 24",
        "revenue": 873.7,
        "quantity": 18,
        "orders": 18
      },
      {
        "key": "20 Sep 24",
        "revenue": 1998.24,
        "quantity": 42,
        "orders": 42
      },
      {
        "key": "19 Sep 24",
        "revenue": 1405.51,
        "quantity": 30,
        "orders": 30
      },
      {
        "key": "18 Sep 24",
        "revenue": 1283.62,
        "quantity": 27,
        "orders": 27
      },
      {
        "key": "17 Sep 24",
        "revenue": 1106.98,
        "quantity": 24,
        "orders": 23
      },
      {
        "key": "16 Sep 24",
        "revenue": 1164.14,
        "quantity": 25,
        "orders": 24
      },
      {
        "key": "15 Sep 24",
        "revenue": 943.28,
        "quantity": 21,
        "orders": 21
      },
      {
        "key": "14 Sep 24",
        "revenue": 893.2,
        "quantity": 19,
        "orders": 18
      }
    ],
    "ASIN": "B0BXCF691R",
    "createdDate": "2023-03-02",
    "ordersInRange": 203,
    "totalOrders": 9726,
    "value": 2
  },
  {
    "sku": "PL-Q006",
    "title": "Pawfect House Personalized Pet Memorial Throw Pillow (Insert Included), Dog Memorial Gifts for Loss of Dog, Memorial Gift, Dog Pillows, Loss of Dog Sympathy Gift, Pet Loss Gifts, Dog Bereavement Gifts",
    "image": "https://m.media-amazon.com/images/I/71lpA3bvb6L.jpg",
    "fulfillmentChannel": "FBM",
    "store": "PFH",
    size: 1,
    "data": [
      {
        "key": "21 Sep 24",
        "revenue": 741.24,
        "quantity": 17,
        "orders": 17
      },
      {
        "key": "20 Sep 24",
        "revenue": 692.53,
        "quantity": 16,
        "orders": 15
      },
      {
        "key": "19 Sep 24",
        "revenue": 526.19,
        "quantity": 12,
        "orders": 12
      },
      {
        "key": "18 Sep 24",
        "revenue": 940.42,
        "quantity": 22,
        "orders": 17
      },
      {
        "key": "17 Sep 24",
        "revenue": 868.74,
        "quantity": 20,
        "orders": 19
      },
      {
        "key": "16 Sep 24",
        "revenue": 1178.16,
        "quantity": 28,
        "orders": 27
      },
      {
        "key": "15 Sep 24",
        "revenue": 788.83,
        "quantity": 20,
        "orders": 19
      },
      {
        "key": "14 Sep 24",
        "revenue": 638.73,
        "quantity": 16,
        "orders": 16
      }
    ],
    "ASIN": "B0C2Y9GG2L",
    "createdDate": "2023-04-18",
    "ordersInRange": 142,
    "totalOrders": 4873,
    "value": 2
  },
  {
    "sku": "WHSO-L004",
    "title": "Pawfect House You & Me Together Forever, Personalized Couple Suncatchers For Windows Hanging, Anniversary Birthday Gifts For Wife Husband, Housewarming Wedding Gifts For Couples 2024, Mr And Mrs Gifts",
    "image": "https://m.media-amazon.com/images/I/61Zjlu6ODuL.jpg",
    "fulfillmentChannel": "FBM",
    "store": "PFH",
    size: 1,
    "data": [
      {
        "key": "21 Sep 24",
        "revenue": 403.55,
        "quantity": 14,
        "orders": 14
      },
      {
        "key": "20 Sep 24",
        "revenue": 389.32,
        "quantity": 13,
        "orders": 13
      },
      {
        "key": "19 Sep 24",
        "revenue": 263.42,
        "quantity": 10,
        "orders": 10
      },
      {
        "key": "18 Sep 24",
        "revenue": 320.94,
        "quantity": 11,
        "orders": 11
      },
      {
        "key": "17 Sep 24",
        "revenue": 370.63,
        "quantity": 12,
        "orders": 12
      },
      {
        "key": "16 Sep 24",
        "revenue": 431.7,
        "quantity": 15,
        "orders": 15
      },
      {
        "key": "15 Sep 24",
        "revenue": 339.44,
        "quantity": 12,
        "orders": 12
      },
      {
        "key": "14 Sep 24",
        "revenue": 437.55,
        "quantity": 15,
        "orders": 15
      }
    ],
    "ASIN": "B0D99X2XN1",
    "createdDate": "2024-07-11",
    "ordersInRange": 102,
    "totalOrders": 1161,
    "value": 2
  },
  {
    "sku": "ME-H011-Cat",
    "title": "Pawfect House Cat Garden Decor, Pet Sympathy Gift, in Loving Memory Gifts for Loss of Cat, Pet Decorations, Pet Memorial Stones, Cat Mom, Dad Gifts, Cat Memorial Gifts, Custom Pet Grave Stones Gifts",
    "image": "https://m.media-amazon.com/images/I/71Ia4ocemKL.jpg",
    "fulfillmentChannel": "FBM",
    "store": "PFH",
    size: 1,
    "data": [
      {
        "key": "21 Sep 24",
        "revenue": 264.61,
        "quantity": 8,
        "orders": 8
      },
      {
        "key": "20 Sep 24",
        "revenue": 443.7,
        "quantity": 13,
        "orders": 13
      },
      {
        "key": "19 Sep 24",
        "revenue": 444,
        "quantity": 12,
        "orders": 12
      },
      {
        "key": "18 Sep 24",
        "revenue": 586.89,
        "quantity": 17,
        "orders": 17
      },
      {
        "key": "17 Sep 24",
        "revenue": 559.02,
        "quantity": 16,
        "orders": 16
      },
      {
        "key": "16 Sep 24",
        "revenue": 480.67,
        "quantity": 13,
        "orders": 13
      },
      {
        "key": "15 Sep 24",
        "revenue": 511.49,
        "quantity": 16,
        "orders": 18
      },
      {
        "key": "14 Sep 24",
        "revenue": 478.77,
        "quantity": 14,
        "orders": 14
      }
    ],
    "ASIN": "B0CJCC6SRK",
    "createdDate": "2023-09-19",
    "ordersInRange": 111,
    "totalOrders": 1274,
    "value": 2
  },
]

const SellerboardTable = ({
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

  // UseEffect to generate and sort columns based on tableData
  useEffect(() => {
    setData(mock);
  }, [tableData]);

  // UseMemo to construct final columns array
  const columns = useMemo(
    () => [
      {
        accessorKey: "sku",
        header: "SKU",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
      {
        accessorKey: "value",
        header: "Value",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
      {
        accessorKey: "size",
        header: "Size",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
      {
        accessorKey: "pod",
        header: "POD",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
      {
        accessorKey: "amz",
        header: "AMZ",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
      {
        accessorKey: "rnd",
        header: "RnD (Value/Size)",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
      {
        accessorKey: "design",
        header: "Design Time",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
      {
        accessorKey: "epm",
        header: "EPM Time",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
      {
        accessorKey: "video",
        header: "Video Time",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
      {
        accessorKey: "team",
        header: "Team Time",
        size: 200,
        maxSize: 200,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text>row</Text>
          );
        },
      },
    ],
    [data]
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

  return <MantineReactTable table={table} />;
};

export default SellerboardTable;
