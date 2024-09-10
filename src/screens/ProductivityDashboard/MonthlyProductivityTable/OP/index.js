import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Flex, Group, Select, Text, TextInput } from "@mantine/core";
import {
  find,
  flatMap,
  groupBy,
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
  sorting,
  setSorting,
  setQuery,
  weeks: allWeeks,
}) => {
  const [payloads, setPayloads] = useState([]);
  const [customColumns, setCustomColumns] = useState([]);
  const [data, setData] = useState(tableData || []);
  const generateCustomColumn = (data) => {
    const columns = map(data, (item) => {
      return {
        accessorKey: `T${item?.month}`,
        header: `T${item?.month}`,
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
          const monthData = find(data, {
            month: toNumber(item?.month),
          });
          const payload = find(monthData?.teamData, { team: opTeam });

          const quota = payload?.quota || 0;
          const actualQuota = payload?.actualQuota || 0;
          const isExceed = actualQuota < quota;
          return (
            <TextInput
              placeholder="Quota"
              error={isExceed ? true : false}
              value={`${actualQuota}/${quota}`}
              readOnly={true}
            />
          );
        },
      };
    });
    return columns;
  };
  useEffect(() => {
    const allTeams = uniqBy(
      flatMap(tableData, (item) => item.teamData),
      "team"
    );
    setData(allTeams);
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
              flexWrap: "wrap",
            }}
          >
            <Select
              data={Array.from({ length: 12 }, (_, i) => `T${i + 1}`)}
              placeholder="Choose Month"
              value={`Week ${query?.month}` || null}
              onChange={(value) => {
                const realMonth = parseInt(value.slice(1), 10);
                setQuery({
                  ...query,
                  month: realMonth,
                  months: null,
                });
              }}
            />
          </Flex>
        </div>
      );
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

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
};

export default ProductivityOPTable;
