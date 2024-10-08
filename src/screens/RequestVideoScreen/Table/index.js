import {
  Badge,
  Button,
  Checkbox,
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
import AppSelect from "../../../components/AppSelect";
import Link from "../../../components/Link";
import EditLink from "../../../components/EditLink";

const VideoTable = ({ query, setQuery }) => {
  const {
    data,
    users,
    searchSKU,
    pagination,
    listUserOptions,
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
    handleDoneSample,
    handleIncompleteSample,
    handleUpdateDoneScene,
    handleUpdateLinkVideo,
    handleUpdateVideoEditor,
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
        accessorKey: "value",
        header: "VALUE",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["SKU"] },
        enableSorting: false,
        Cell: ({ row }) => {
          let color = null;
          switch (row?.original?.value?.rnd) {
            case 1:
              color = "#cfcfcf";
              break;
            case 2:
              color = "yellow";
              break;
            case 3:
              color = "green";
              break;
            case 4:
              color = "#38761C";
              break;
            default:
              break;
          }
          return color ? (
            <Badge color={color} variant="filled">
              {CONVERT_NUMBER_TO_STATUS[row?.original?.value?.rnd]}
            </Badge>
          ) : (
            <span>{CONVERT_NUMBER_TO_STATUS[row?.original?.value?.rnd]}</span>
          );
        },
      },
      {
        header: "PIC Quay",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
        Cell(record) {
          const row = record.row.original;
          return row.videoSupplier;
        },
      },
      {
        header: "Done source Quay",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },

        enableSorting: false,
        Cell(record) {
          const row = record.row.original;

          const isChecked = row?.isDoneSource;

          return (
            <Flex justify="center">
              <Checkbox
                onChange={() => handleUpdateDoneScene(row.uid, !isChecked)}
                checked={isChecked}
              />
            </Flex>
          );
        },
      },
      {
        accessorKey: "picEdit",
        header: "PIC Edit",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell(record) {
          const row = record.row.original;

          return (
            <AppSelect
              defaultValue={record.row.original.videoEditorId}
              options={listUserOptions}
              onChange={(e) => handleUpdateVideoEditor(row.uid, e.value)}
            />
          );
        },
      },
      {
        accessorKey: "linkVideo",
        header: "Link Video",
        size: 120,
        enableEditing: true,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell(record) {
          return <Link href={record.row.original.videoLink} />;
        },
        Edit({ row }) {
          return (
            <EditLink
              onBlurSuccess={(value) => {
                handleUpdateLinkVideo(row.original.uid, value);
              }}
            />
          );
        },
      },
      {
        header: "DONE",
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell({ row }) {
          const isDone = row.original.videoStatus === 3;

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
              DONE
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
    mantineTableBodyCellProps: ({ row, table, cell }) => ({
      onDoubleClick: () => {
        if (cell && cell.column.id === "linkVideo") {
          table.setEditingCell(cell);
        }
      },
      onBlur: () => {
        table.setEditingCell(null);
      },
    }),
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

export default VideoTable;
