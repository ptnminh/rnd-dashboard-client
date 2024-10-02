import { Button, Flex, Image, Select, TextInput } from "@mantine/core";
import { IconFilterOff, IconSearch } from "@tabler/icons-react";
import { filter, find, keys, map } from "lodash";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { DateRangePicker } from "rsuite";
import { CONVERT_STATUS_TO_NUMBER } from "../../../utils";
import useTable from "./useTable";

import classes from "./index.module.css";
import { useState } from "react";

const SampleTable = ({ query, setQuery }) => {
  const {
    users,
    searchSKU,
    handleChangeStatus,
    handleClearStatus,
    clearFilters,
    handleChangeSKU,
    handleSubmitSKU,
    handleChangeDate,
    handleClearSizeValue,
    handleChangeSizeValue,
    handleChangeTeam,
    handleClearTeam,
  } = useTable({ query, setQuery });

  const [data, setData] = useState([
    {
      id: 1,
      date: "19/08/2024",
      sku: "ABC_123",
      design: "",
      fileIn: "https://localhost:3000",
      done: "",
      screener: "UID",
      time: "1h",
      value: "Big",
    },
    {
      id: 2,
      date: "19/08/2024",
      sku: "ABC_123",
      design: "",
      fileIn: "https://localhost:3000",
      done: "",
      screener: "BF",
      time: "3h",
      value: "Big",
    },
    {
      id: 3,
      date: "19/08/2024",
      sku: "ABC_123",
      design: "",
      fileIn: "https://localhost:3000",
      done: true,
      screener: "BF",
      time: "3h",
      value: "Big",
    },
    {
      id: 4,
      date: "19/08/2024",
      sku: "ABC_123",
      design: "",
      fileIn: "https://localhost:3000",
      done: true,
      screener: "UID",
      time: "3h",
      value: "Big",
    },
  ]);

  const table = useMantineReactTable({
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: { striped: "even" },
    columns: [
      {
        accessorKey: "date",
        header: "DATE",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "sku",
        header: "SKU",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
      },
      {
        accessorKey: "design",
        header: "DESIGN",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
        Cell() {
          return (
            <Image
              radius="md"
              src="/images/content/not_found_2.jpg"
              height={100}
              fit="contain"
            />
          );
        },
      },
      {
        accessorKey: "fileIn",
        header: "FILE IN",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
      },
      {
        accessorKey: "value",
        header: "VALUE",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["SKU"] },
        enableSorting: false,
      },
      {
        accessorKey: "screener",
        header: "Sup/UID quay",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
        Cell(record) {
          return (
            <Select
              defaultValue={record.row.original.screener}
              placeholder="Pick value"
              data={["UID", "", "BF", "KM"]}
            />
          );
        },
      },
      {
        accessorKey: "done",
        header: "DONE",
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
        Cell({ row }) {
          const value = row.original;
          const isUID = value.screener === "UID";
          const isDone = value.done;

          return (
            <Button
              onClick={() => {
                const index = data.findIndex((it) => it.id === row.original.id);
                if (index >= 0) {
                  const cloneRow = {
                    ...data[index],
                  };

                  cloneRow.done = !cloneRow.done;

                  setData([
                    ...data.slice(0, index),
                    cloneRow,
                    ...data.slice(index + 1),
                  ]);
                }
              }}
              color="green"
              variant={isDone ? "filled" : "default"}
            >
              {isUID ? "Có Sample" : "Có source Video"}
            </Button>
          );
        },
      },
      {
        accessorKey: "time",
        header: "TIME",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
      },
    ],
    data,
    editDisplayMode: "cell",
    enableEditing: true,
    enablePagination: false,
    enableRowSelection: false,
    enableFilters: false,
    enableColumnActions: false,
    getRowId: (row) => row.id,
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
              backgroundColor: "#EFF0F1",
            }}
          >
            <TextInput
              placeholder="SKU"
              size="sm"
              width="100px"
              leftSection={
                <span
                  onClick={handleSubmitSKU}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <IconSearch size={16} />
                </span>
              }
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={searchSKU}
              onChange={handleChangeSKU}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmitSKU();
                }
              }}
            />
            <DateRangePicker
              size="sx"
              placeholder="Date"
              style={{
                width: "100px",
              }}
              value={query.dateValue}
              onOk={(value) => handleChangeDate(value, value[0], value[1])}
              onClean={() => handleChangeDate(null, null, null)}
              onShortcutClick={(shortcut) => {
                const { value } = shortcut;
                handleChangeDate(value, value[0], value[1]);
              }}
            />
            <Select
              clearable
              placeholder="Value"
              data={keys(CONVERT_STATUS_TO_NUMBER)}
              styles={{
                input: {
                  width: "150px",
                },
              }}
              value={query?.valueName}
              onChange={(value) => handleChangeSizeValue(value)}
              onClear={handleClearSizeValue}
            />
            <Select
              clearable
              placeholder="Team"
              data={["BD1", "BD2", "BD3", "AMZ"]}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.rndTeam}
              onChange={handleChangeTeam}
              onClear={handleClearTeam}
            />
            <Select
              placeholder="RND"
              data={map(filter(users, { position: "rnd" }), "name") || []}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.rndName}
              onChange={(value) =>
                setQuery({
                  ...query,
                  rndName: find(users, { name: value })?.name,
                  rndId: find(users, { name: value })?.uid,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  rndName: null,
                  rndId: null,
                });
              }}
            />
            <Select
              clearable
              placeholder="Status"
              data={["Done", "Undone"]}
              styles={{
                input: {
                  width: "120px",
                },
              }}
              value={query?.statusValue}
              onChange={handleChangeStatus}
              onClear={handleClearStatus}
            />
            <Button onClick={clearFilters}>
              <IconFilterOff />
            </Button>
          </Flex>
        </div>
      );
    },
  });

  return <MantineReactTable table={table} />;
};

export default SampleTable;
