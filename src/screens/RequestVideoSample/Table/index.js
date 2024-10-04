import {
  Button,
  Flex,
  Image,
  Pagination,
  Select,
  TextInput,
} from "@mantine/core";
import { IconFilterOff, IconSearch } from "@tabler/icons-react";
import { filter, find, keys, map } from "lodash";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { DateRangePicker } from "rsuite";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
} from "../../../utils";
import useTable from "./useTable";

import formatDate from "../../../utils/formatDate";
import classes from "./index.module.css";
import Link from "../../../components/Link";

const SampleTable = ({ query, setQuery }) => {
  const {
    data,
    users,
    searchSKU,
    pagination,
    clearFilters,
    handleChangeDate,
    handleChangePage,
    handleChangeSizeValue,
    handleChangeSKU,
    handleChangeStatus,
    handleChangeTeam,
    handleClearSizeValue,
    handleClearStatus,
    handleClearTeam,
    handleSubmitSKU,
    handleUpdateSupplier,
    handleDoneSample,
    handleIncompleteSample,
  } = useTable({ query, setQuery });

  const table = useMantineReactTable({
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: { striped: "even" },
    columns: [
      {
        accessorKey: "createdAt",
        header: "DATE",
        size: 120,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell(row) {
          return formatDate(row.renderedCellValue);
        },
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
        accessorKey: "designInfo",
        header: "DESIGN",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
        Cell(row) {
          return (
            <Image
              radius="md"
              src={row.renderedCellValue.thumbLink}
              height={100}
              fit="contain"
            />
          );
        },
      },
      {
        header: "FILE IN",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
        Cell({ row }) {
          return <Link href={row.original.videoFileIn} />;
        },
      },
      {
        accessorKey: "value",
        header: "VALUE",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["SKU"] },
        enableSorting: false,
        Cell(record) {
          return CONVERT_NUMBER_TO_STATUS[record.row.original.value.rnd];
        },
      },
      {
        header: "Sup/UID quay",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
        Cell(record) {
          const row = record.row.original;
          return (
            <Select
              defaultValue={row.videoSupplier}
              onChange={(value) => handleUpdateSupplier(row.uid, value)}
              placeholder="Pick value"
              data={["UID", "BF", "KM"]}
              allowDeselect={false}
            />
          );
        },
      },
      {
        header: "DONE",
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
        Cell({ row }) {
          const isDone = row.original.videoStatus === 2;
          const isUID = row.original.videoSupplier === "UID";

          return (
            <Button
              onClick={() => {
                if (isDone) {
                  handleIncompleteSample(row.original.uid);
                } else {
                  handleDoneSample(row.original.uid);
                }
              }}
              color="green"
              variant={isDone ? "default" : "filled"}
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
        Cell(record) {
          return record.row.original.designInfo.time;
        },
      },
    ],
    data: data?.data || [],
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
                width: "200px",
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

  return (
    <>
      <MantineReactTable table={table} />
      <Flex justify="flex-end">
        {pagination.totalPages && (
          <Pagination
            total={pagination.totalPages}
            value={pagination.page}
            onChange={handleChangePage}
            color="pink"
            size="md"
            style={{ marginTop: "20px", marginLeft: "auto" }}
          />
        )}
      </Flex>
    </>
  );
};

export default SampleTable;
