import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Select, TextInput } from "@mantine/core";
import { find, toNumber } from "lodash";
import classes from "./MyTable.module.css";
import { IconClock } from "@tabler/icons-react";

import { dashboardServices } from "../../../services";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
} from "../../../utils";

const ScaleTimeSetting = ({
  tableData,
  query,
  loadingFetchDashboardSettings,
  setTrigger,
  sorting,
  setSorting,
}) => {
  const [payloads, setPayloads] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(tableData || []);
  useEffect(() => {
    setData(tableData);
    setPayloads(tableData);
  }, [tableData]);

  const handleUpdateDashboardSetting = async ({
    uid,
    data,
    isTrigger = false,
  }) => {
    await dashboardServices.update({
      uid,
      data,
    });
    if (isTrigger) {
      setTrigger(true);
    }
  };
  // Helper function to calculate rowSpan
  const calculateRowSpan = (index, key) => {
    const currentItem = data[index];
    const previousItem = data[index - 1];
    if (index > 0 && previousItem[key] === currentItem[key]) {
      return 0; // If the previous item has the same value, return 0 to avoid rendering
    }
    // Count how many items share the same value
    return data?.slice(index).filter((item) => item[key] === currentItem[key])
      ?.length;
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "no",
        header: "No",
        size: 50,
        enableEditing: false,
        enableSorting: false,
        Cell: ({ row }) => {
          const rowSpan = calculateRowSpan(row.index, "scaleType");
          return rowSpan > 0 ? row.original.no : null; // Render `null` if rowSpan is 0
        },
        mantineTableBodyCellProps: ({ row }) => {
          const rowSpan = calculateRowSpan(row.index, "scaleType");
          return {
            rowSpan,
            className: classes["body-cells"],
            style: {
              borderRight: "1px solid #E3E4E6",
            },
            ...(rowSpan === 0 && {
              style: {
                display: "none",
              },
            }),
          };
        },
      },
      {
        accessorKey: "scaleType",
        header: "Loại đề",
        size: 240,
        enableEditing: false,
        mantineTableHeadCellProps: {
          colSpan: 2,
        },
        mantineTableBodyCellProps: ({ row }) => {
          const rowSpan = calculateRowSpan(row.index, "scaleType");
          return {
            rowSpan,
            className: classes["body-cells"],
            style: {
              borderRight: "1px solid #E3E4E6",
            },
            ...(rowSpan === 0 && {
              style: {
                display: "none",
              },
            }),
          };
        },
        enableSorting: false,
        Cell: ({ row }) => {
          const rowSpan = calculateRowSpan(row.index, "scaleType");
          return rowSpan > 0 ? row.original.scaleType : null;
        },
      },
      {
        accessorKey: "option",
        header: "Chi tiết",
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
          style: {
            borderRight: "1px solid #E3E4E6",
          },
        },
        size: 120,
        enableEditing: false,
        mantineTableHeadCellProps: {
          style: {
            display: "none",
          },
        },
        enableSorting: false,
      },
      {
        accessorKey: "size",
        header: "Size",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
          style: {
            borderRight: "1px solid #E3E4E6",
          },
        },
        enableSorting: false,
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(payloads, (item) => item.uid === uid);
          return (
            <Select
              data={["Small", "+Small", "Medium", "Big"]}
              allowDeselect={false}
              value={CONVERT_NUMBER_TO_STATUS[payload.size]}
              onChange={(value) => {
                const newPayloads = payloads.map((item) => {
                  if (item.uid === uid) {
                    return {
                      ...item,
                      size: CONVERT_STATUS_TO_NUMBER[value],
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                handleUpdateDashboardSetting({
                  uid,
                  data: {
                    size: CONVERT_STATUS_TO_NUMBER[value],
                  },
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "time",
        header: "Time (h)",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
          style: {
            borderRight: "1px solid #E3E4E6",
          },
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(payloads, (item) => item.uid === uid);
          return (
            <TextInput
              value={payload.time}
              rightSection={<IconClock />}
              onChange={(event) => {
                const newPayloads = payloads.map((item) => {
                  if (item.uid === uid) {
                    return {
                      ...item,
                      time: event.target.value,
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                handleUpdateDashboardSetting({
                  uid,
                  data: {
                    time: toNumber(event.target.value),
                  },
                });
              }}
            />
          );
        },
      },
    ],
    [validationErrors, tableData, query, payloads]
  );

  const table = useMantineReactTable({
    columns,
    data,
    editDisplayMode: "cell",
    enableEditing: true,
    enablePagination: false,
    getRowId: (row) => row.id,
    enableTopToolbar: false,
    enableRowSelection: false,
    enableFilters: false,
    enableColumnActions: false,
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: {
      className: classes["disable-hover"],
    }, // Apply the custom class here },
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    enableDensityToggle: false,
    state: {
      showProgressBars: loadingFetchDashboardSettings,
      sorting,
      hoveredColumn: false,
      hoveredRow: false,
    },
    mantineTableBodyCellProps: () => ({
      className: classes["body-cells"],
      sx: {
        cursor: "pointer", //you might want to change the cursor too when adding an onClick
        backgroundColor: "red !important",
      },
    }),
    onSortingChange: setSorting,
  });

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
};

export default ScaleTimeSetting;
