import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { TextInput } from "@mantine/core";
import { find, omit, toNumber } from "lodash";
import classes from "./MyTable.module.css";
import { IconCalendarDue, IconCashRegister } from "@tabler/icons-react";

import { settingServices } from "../../../services/settings";

const AMZTableSetting = ({
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
    setPayloads(tableData.settings || []);
  }, [tableData]);

  const handleUpdateDashboardSetting = async ({
    uid,
    data,
    isTrigger = false,
  }) => {
    await settingServices.updateSetting({
      uid,
      data,
      view: "amz-setting",
    });
    if (isTrigger) {
      setTrigger(true);
    }
  };
  // Helper function to calculate rowSpan
  const calculateRowSpan = (index, key) => {
    const currentItem = payloads[index];
    const previousItem = payloads[index - 1];
    if (index > 0 && previousItem[key] === currentItem[key]) {
      return 0; // If the previous item has the same value, return 0 to avoid rendering
    }
    // Count how many items share the same value
    return payloads
      ?.slice(index)
      .filter((item) => item[key] === currentItem[key])?.length;
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
        accessorKey: "textValue",
        header: "Value",
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
          style: {
            borderRight: "1px solid #E3E4E6",
          },
        },
        size: 120,
        enableEditing: false,
        enableSorting: false,
      },
      {
        accessorKey: "deadlineDays",
        header: "Deadline Days",
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
          const index = row.original.index;
          const payload = find(payloads, (item) => item.index === index);
          return (
            <TextInput
              allowDeselect={false}
              value={payload.deadlineDays}
              rightSection={<IconCalendarDue />}
              onChange={(event) => {
                const value = event.target.value;
                const newPayloads = payloads.map((item) => {
                  if (item.index === index) {
                    return {
                      ...item,
                      deadlineDays: toNumber(value) || 0,
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                handleUpdateDashboardSetting({
                  uid: data.uid,
                  data: {
                    attribute: {
                      survivalMode: omit(newPayloads, [
                        "index",
                        "no",
                        "scaleType",
                      ]),
                    },
                  },
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "deadlineOrders",
        header: "Deadline Orders",
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
          const index = row.original.index;
          const payload = find(payloads, (item) => item.index === index);
          return (
            <TextInput
              value={payload.deadlineOrders}
              rightSection={<IconCashRegister />}
              onChange={(event) => {
                const value = event.target.value;
                const newPayloads = payloads.map((item) => {
                  if (item.index === index) {
                    return {
                      ...item,
                      deadlineOrders: toNumber(value) || 0,
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                handleUpdateDashboardSetting({
                  uid: data.uid,
                  data: {
                    attribute: {
                      survivalMode: omit(newPayloads, [
                        "index",
                        "no",
                        "scaleType",
                      ]),
                    },
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
    data: payloads,
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

export default AMZTableSetting;
