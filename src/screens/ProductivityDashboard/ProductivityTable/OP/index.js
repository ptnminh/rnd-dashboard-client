import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  ActionIcon,
  Flex,
  Group,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
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
          const payload = find(payloads, {
            team: opTeam,
            week: toNumber(week),
          });
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
    setData(tableData);
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
            justifyContent: "end",
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
