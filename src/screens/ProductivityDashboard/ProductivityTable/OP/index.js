import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { TextInput, Text } from "@mantine/core";
import { find, groupBy, map, orderBy, keys, toNumber, uniqBy } from "lodash";
import classes from "./MyTable.module.css";

const ProductivityOPTable = ({
  tableData,
  query,
  loading,
  setTrigger,
  sorting,
  setSorting,
  setQuery,
  weeks: allWeeks,
  currentWeek,
}) => {
  const [data, setData] = useState(tableData || []);
  const [customColumns, setCustomColumns] = useState([]);

  // Function to generate columns based on the data
  const generateCustomColumn = (data) => {
    const weeks = orderBy(
      map(keys(groupBy(data, "week")), (item) => toNumber(item)),
      [],
      "desc"
    );
    const columns = map(weeks, (week) => {
      return {
        accessorKey: `W${week}`,
        header: `W${week}`,
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: {
          className: classes["edit-header"],
        },
        Cell: ({ row }) => {
          const { team: opTeam } = row.original;
          const payload = find(data, {
            team: opTeam,
            week: toNumber(week),
          });
          const quota = payload?.quota || 0;
          const actualQuota = payload?.actualQuota || 0;
          return (
            <TextInput
              placeholder="Quota"
              value={`${actualQuota}/${quota}`}
              readOnly={true}
              styles={{
                input: {
                  ...(actualQuota === quota && {
                    color: "#32A645",
                  }),
                  ...(actualQuota < quota && {
                    color: "#ea102d",
                  }),
                  width: "90px",
                  textAlign: "center",
                },
              }}
            />
          );
        },
      };
    });
    return columns;
  };

  // UseEffect to generate and sort columns based on tableData
  useEffect(() => {
    setData(uniqBy(tableData, "team"));
    setCustomColumns(generateCustomColumn(tableData));
  }, [tableData]);

  // Sorting the columns right after generating them
  const sortedCustomColumns = useMemo(() => {
    return orderBy(
      customColumns,
      (col) => {
        // Extract the numeric part of the accessorKey (e.g., 'W50' -> 50)
        return toNumber(col.accessorKey.replace("W", ""));
      },
      "desc" // or 'asc' for ascending order
    );
  }, [customColumns]);

  // UseMemo to construct final columns array
  const columns = useMemo(
    () => [
      {
        accessorKey: "team",
        header: "OP",
        size: 50,
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
          return (
            <Text
              fw={700}
              style={{
                fontSize: "14px",
              }}
            >
              {row.original?.team}
            </Text>
          );
        },
      },
      ...sortedCustomColumns,
    ],
    [sortedCustomColumns, data]
  );

  const table = useMantineReactTable({
    columns,
    data,
    editDisplayMode: "cell",
    enableEditing: true,
    enablePagination: false,
    enableSorting: false,
    getRowId: (row) => row.id,
    enableRowSelection: false,
    enableFilters: false,
    enableColumnActions: false,
    enableTopToolbar: true,
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: {
      className: classes["disable-hover"],
    },
    enableDensityToggle: false,
    state: {
      showProgressBars: loading,
      sorting,
      hoveredColumn: false,
      hoveredRow: false,
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

export default ProductivityOPTable;
