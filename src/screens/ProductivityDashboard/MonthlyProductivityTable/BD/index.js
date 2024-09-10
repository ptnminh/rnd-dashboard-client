import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Flex, Group, Select, Text, TextInput } from "@mantine/core";
import {
  find,
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
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

import classes from "./MyTable.module.css";
import {
  generateAscendingArray,
  generateDescendingArray,
} from "../../../../utils";

const ProductivityBDTable = ({
  tableData,
  query,
  loading,
  setTrigger,
  sorting,
  setSorting,
  weeks: allWeeks,
  setQuery,
  currentWeek,
}) => {
  const [payloads, setPayloads] = useState([]);
  const [customColumns, setCustomColumns] = useState([]);
  const [data, setData] = useState(tableData || []);
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
              value={`${actualQuota}$/${quota}h`}
              readOnly={true}
            />
          );
        },
      };
    });
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
        header: "BD",
        size: 50,
        enableEditing: false,
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
        enableSorting: false,
      },
      ...customColumns,
    ],
    [tableData, query, payloads, customColumns]
  );

  const table = useMantineReactTable({
    columns,
    data,
    editDisplayMode: "cell",
    enableEditing: true,
    enablePagination: false,
    enableTopToolbar: true,
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
          <Flex
            style={{
              gap: "8px",
              padding: "10px",
              borderRadius: "10px",
              flexWrap: "wrap",
            }}
          >
            <Group>
              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() => handleSlideWeeks("left")}
              >
                <IconArrowNarrowLeft
                  style={{ width: "100%", height: "100%" }}
                  stroke={1.5}
                  color="#3751D7"
                />
              </span>
              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() => handleSlideWeeks("right")}
              >
                <IconArrowNarrowRight
                  style={{ width: "100%", height: "100%" }}
                  stroke={1.5}
                  color="#3751D7"
                />
              </span>
            </Group>
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

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
};

export default ProductivityBDTable;
