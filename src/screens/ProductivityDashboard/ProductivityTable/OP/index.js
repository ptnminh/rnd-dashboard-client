import React, { useState, useMemo, useEffect, useCallback } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Flex,
  Group,
  MultiSelect,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import {
  debounce,
  find,
  groupBy,
  isEmpty,
  keys,
  map,
  max,
  min,
  orderBy,
  split,
  toNumber,
  uniqBy,
} from "lodash";
import classes from "./MyTable.module.css";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import {
  generateAscendingArray,
  generateDescendingArray,
} from "../../../../utils";

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
  const [payloads, setPayloads] = useState([]);
  const [customColumns, setCustomColumns] = useState([]);
  const handleSlideWeeks = (direction) => {
    const formattedWeeks = map(allWeeks, (week) => split(week, " ")[1]);
    const weeks = orderBy(
      map(keys(groupBy(tableData, "week")), (item) => toNumber(item)),
      [],
      "desc"
    );
    const maxWeek = toNumber(weeks[0]);
    const minWeek = toNumber(weeks[weeks.length - 1]);
    if (direction === "left") {
      if (maxWeek + 1 > max(formattedWeeks)) return;
      const weeks = generateAscendingArray(maxWeek + 1);
      setQuery({ ...query, weeks });
    } else {
      if (minWeek - 1 < min(formattedWeeks)) return;
      const weeks = generateDescendingArray(minWeek - 1);
      setQuery({ ...query, weeks });
    }
  };
  const [data, setData] = useState(tableData || []);
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
          const isExceed = actualQuota < quota;
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
                },
              }}
            />
          );
        },
      };
    });
    return columns;
  };
  useEffect(() => {
    setData(uniqBy(tableData, "team"));
    setPayloads(tableData);
    const columns = generateCustomColumn(tableData);
    setCustomColumns(columns);
  }, [tableData]);
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
      ...customColumns,
    ],
    [payloads, customColumns, data]
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
    // renderTopToolbar: () => {
    //   return (
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         alignItems: "center",
    //         padding: "10px 5px",
    //         gap: "10px",
    //         flexWrap: "wrap-reverse",
    //       }}
    //     >
    //       <MultiSelect
    //         data={allWeeks}
    //         placeholder="Choose Weeks"
    //         value={map(query?.weeks, (week) => `Week ${week}`) || []}
    //         searchable
    //         clearable
    //         onClear={() => {
    //           setQuery({
    //             ...query,
    //             weeks: [currentWeek],
    //           });
    //         }}
    //         onChange={(value) => {
    //           if (!isEmpty(value)) {
    //             setQuery({
    //               ...query,
    //               weeks: orderBy(
    //                 map(value, (week) => toNumber(split(week, " ")[1])),
    //                 [],
    //                 "desc"
    //               ),
    //             });
    //           }
    //         }}
    //       />
    //     </div>
    //   );
    // },
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
