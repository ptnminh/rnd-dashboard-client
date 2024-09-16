import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Text, TextInput } from "@mantine/core";
import {
  ceil,
  find,
  groupBy,
  keys,
  map,
  orderBy,
  round,
  toNumber,
  uniqBy,
} from "lodash";
import classes from "./MyTable.module.css";

const ProductivityBDTable = ({
  tableData,
  loading,
  sorting,
  setSorting,
  weeks: allWeeks,
  setQuery,
  currentWeek,
}) => {
  const [customColumns, setCustomColumns] = useState([]);
  const [data, setData] = useState(tableData || []);
  const generateCustomColumn = (data) => {
    const weeks = keys(groupBy(data, "week"));
    return map(weeks, (week) => {
      return {
        accessorKey: `W${week}`,
        header: `W${week}`,
        size: 120,
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
          const quota = payload?.totalQuota || 0;
          const actualQuota = payload?.actualRevenue || 0;
          return (
            <TextInput
              placeholder="Quota"
              value={ceil(round(actualQuota / quota, 0))}
              readOnly={true}
              styles={{
                input: {
                  width: "150px",
                },
              }}
            />
          );
        },
      };
    });
  };
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
        header: "BD",
        size: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-bd-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-bd-team"],
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
        enableSorting: false,
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
    enableTopToolbar: true,
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
      sorting,
      hoveredColumn: false,
      hoveredRow: false,
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
    //       <Flex
    //         style={{
    //           gap: "8px",
    //           padding: "10px",
    //           borderRadius: "10px",
    //           flexWrap: "wrap",
    //         }}
    //       >
    //         <Select
    //           data={allWeeks}
    //           placeholder="Choose Week"
    //           value={`Week ${query?.week}` || null}
    //           onChange={(value) => {
    //             const realWeek = split(value, " ")[1];
    //             setQuery({
    //               ...query,
    //               week: realWeek,
    //               weeks: null,
    //             });
    //           }}
    //         />
    //       </Flex>
    //       <Flex
    //         style={{
    //           gap: "8px",
    //           padding: "10px",
    //           borderRadius: "10px",
    //           flexWrap: "wrap",
    //         }}
    //       >
    //         <Group>
    //           <span
    //             style={{
    //               cursor: "pointer",
    //             }}
    //             onClick={() => handleSlideWeeks("left")}
    //           >
    //             <IconArrowNarrowLeft
    //               style={{ width: "100%", height: "100%" }}
    //               stroke={1.5}
    //               color="#3751D7"
    //             />
    //           </span>
    //           <span
    //             style={{
    //               cursor: "pointer",
    //             }}
    //             onClick={() => handleSlideWeeks("right")}
    //           >
    //             <IconArrowNarrowRight
    //               style={{ width: "100%", height: "100%" }}
    //               stroke={1.5}
    //               color="#3751D7"
    //             />
    //           </span>
    //         </Group>
    //       </Flex>
    //     </div>
    //   );
    // },
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

export default ProductivityBDTable;
