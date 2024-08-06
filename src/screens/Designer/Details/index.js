import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Badge,
  Button,
  Flex,
  Image,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import Checkbox from "../../../components/Checkbox";

import { filter, find, includes, isEmpty, keys, map } from "lodash";
import { IconSearch, IconFilterOff } from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import { DateRangePicker } from "rsuite";
import {
  IconCheck,
  IconX,
  IconDeviceFloppy,
  IconBan,
} from "@tabler/icons-react";
import { BRIEF_TYPES, CHOOSE_BRIEF_TYPES } from "../../../constant";
import moment from "moment-timezone";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
} from "../../../utils";
import { rndServices } from "../../../services";
import { showNotification } from "../../../utils/index";

const KeywordTable = ({
  productLines,
  name,
  query,
  setQuery,
  setSelectedSKU,
  openModal,
  users,
  setEditingCell,
  setUpdateBrief,
  updateBrief,
  editingCell,
  loadingFetchBrief,
  setTrigger,
  setLinkDesign,
  sorting,
  setSorting,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(productLines || []);
  const [templateName, setTemplateName] = useState(name);
  useEffect(() => {
    setData(productLines);
    setTemplateName(name);
  }, [productLines, templateName]);
  const handleUpdateStatus = async ({ uid, status }) => {
    await rndServices.updateBrief({
      uid,
      data: {
        status: status === 1 ? 2 : 1,
      },
    });
    setTrigger(true);
  };
  const handleUpdatePriority = async ({ uid, priority }) => {
    await rndServices.updateBrief({
      uid,
      data: {
        priority: priority === 1 ? 2 : 1,
      },
    });
    setTrigger(true);
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        mantineTableHeadCellProps: {
          align: "right",
        },
        size: 50, //small column
        header: "NO",
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "date",
        header: "DATE",
        size: 120,
        enableEditing: false,
        enableSorting: true,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "batch",
        header: "BATCH",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "sku",
        header: "SKU",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Header: ({ column }) => (
          <div
            style={{
              color: "#ffffff",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
        mantineTableHeadCellProps: { className: classes["SKU"] },
        Cell: ({ row }) => (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedSKU(row.original);
              setLinkDesign(row.original.linkDesign);
              openModal();
            }}
          >
            <Badge color="blue" variant="filled">
              {" "}
              <u>{row.original.sku}</u>{" "}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "imageRef",
        header: "HÌNH REF",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => (
          <Image
            radius="md"
            src={row?.original?.imageRef || "/images/content/not_found_2.jpg"}
            height="100%"
            fit="contain"
          />
        ),
      },
      {
        accessorKey: "briefType",
        header: "LOẠI BRIEF",
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "value",
        header: "VALUE",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
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
        accessorKey: "size",
        header: "SIZE",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          let color = null;
          switch (row?.original?.size?.rnd) {
            case 1:
              color = "green";
              break;
            case 2:
              color = "yellow";
              break;
            case 3:
              color = "red";
              break;
            default:
              break;
          }
          return color ? (
            <Badge color={color} variant="filled">
              {CONVERT_NUMBER_TO_STATUS[row?.original?.size?.rnd]}
            </Badge>
          ) : (
            <span>{CONVERT_NUMBER_TO_STATUS[row?.original?.size?.rnd]}</span>
          );
        },
      },
      {
        accessorKey: "rndTeam",
        header: "TEAM",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        id: "rndName",
        accessorFn: (row) => row?.rnd?.name,
        header: "RND",
        enableEditing: false,
        enableSorting: false,
        size: 130,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        id: "designer",
        accessorFn: (row) => row?.designer?.name,
        header: "DESIGNER",
        enableEditing: false,
        enableSorting: false,
        size: 130,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "linkDesign",
        header: "LINK DESIGN",
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        size: 100,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Edit: ({ row }) => {
          return (
            <TextInput
              value={updateBrief[row.original.uid]?.linkDesign}
              onChange={(e) => {
                setUpdateBrief({
                  ...updateBrief,
                  [row.original.uid]: {
                    ...updateBrief[row.original.uid],
                    linkDesign: e.target.value,
                  },
                });
              }}
            />
          );
        },
        Cell: ({ row }) => (
          <a
            style={{
              cursor: "pointer",
            }}
            target="_blank"
            href={
              row.original.linkDesign ||
              updateBrief[row.original.uid]?.linkDesign
            }
          >
            {row.original.linkDesign ||
            updateBrief[row.original.uid]?.linkDesign ? (
              <Badge color="blue" variant="filled">
                {" "}
                <u>Link</u>{" "}
              </Badge>
            ) : null}
          </a>
        ),
      },
      {
        accessorKey: "status",
        header: "DONE",
        size: 100,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        Cell: (props) => {
          const { row } = props;
          return (
            <Button
              variant="filled"
              color={row.original.status === 2 ? "red" : "green"}
              leftSection={
                row.original.status === 2 ? <IconBan /> : <IconCheck />
              }
              disabled={
                row?.original?.status === 1 &&
                !row?.original?.linkDesign &&
                !updateBrief[row.original.uid]?.linkDesign
              }
            >
              {row.original.status === 2 ? "Undone" : "Done"}
            </Button>
          );
        },
      },
      {
        accessorKey: "priority",
        header: "PRIORITY",
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        size: 100,
        Cell: ({ row }) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Checkbox value={row?.original?.priority === 2} />
            </div>
          );
        },
      },
      {
        id: "time",
        accessorFn: (row) => row?.designInfo?.time,
        header: "TIME",
        enableSorting: true,
        mantineTableHeadCellProps: { className: classes["head-cells"] },
        enableEditing: false,
        size: 50,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "remove",
        header: "ACTIONS",
        enableSorting: false,
        mantineTableHeadCellProps: { className: classes["remove"] },
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Edit: ({ cell, column, table }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button variant="filled" color="red">
              <IconX />
            </Button>
          </div>
        ),
        Cell: ({ cell, column, table }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button variant="filled" color="red" size="sx">
              <IconX />
            </Button>
          </div>
        ),
      },
    ],
    [validationErrors]
  );

  //DELETE action
  const openDeleteConfirmModal = (row) =>
    modals.openConfirmModal({
      title: "Are you sure you want to delete this SKU?",
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete {row.original.sku}? This action cannot
          be revert.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDeleteBrief(row.original.uid),
    });

  const handleDeleteBrief = async (uid) => {
    await rndServices.deleteBrief(uid);
    setTrigger(true);
  };

  const [batch, setBatch] = useState("");
  const [searchSKU, setSearchSKU] = useState("");

  const table = useMantineReactTable({
    columns,
    data,
    editDisplayMode: "cell", // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enablePagination: false,
    getRowId: (row) => row.id,
    enableRowSelection: false,
    enableFilters: false,
    enableColumnActions: false,
    mantinePaperProps: {
      style: { "--mrt-striped-row-background-color": "#eff0f1" },
    },
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: { striped: "even" },
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    enableDensityToggle: false,
    renderTopToolbar: ({ table }) => {
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
              flexWrap: "wrap",
            }}
          >
            <TextInput
              placeholder="Batch"
              size="sm"
              width="100px"
              leftSection={
                <span
                  onClick={() => {
                    setQuery({ ...query, batch });
                  }}
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
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setQuery({ ...query, batch });
                }
              }}
            />
            <TextInput
              placeholder="SKU"
              size="sm"
              width="100px"
              leftSection={
                <span
                  onClick={() => {
                    setQuery({ ...query, sku: searchSKU });
                  }}
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
              onChange={(e) => setSearchSKU(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setQuery({ ...query, sku: searchSKU });
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
              onOk={(value) =>
                setQuery({
                  ...query,
                  dateValue: value,
                  date: {
                    startDate: moment(value[0]).format("YYYY-MM-DD"),
                    endDate: moment(value[1]).format("YYYY-MM-DD"),
                  },
                })
              }
              onClean={() => {
                setQuery({
                  ...query,
                  dateValue: null,
                  date: null,
                });
              }}
              onShortcutClick={(shorcut, event) => {
                setQuery({
                  ...query,
                  dateValue: shorcut.value,
                  date: {
                    startDate: moment(shorcut.value[0]).format("YYYY-MM-DD"),
                    endDate: moment(shorcut.value[1]).format("YYYY-MM-DD"),
                  },
                });
              }}
            />
            <Select
              placeholder="Loại Brief"
              data={CHOOSE_BRIEF_TYPES}
              styles={{
                input: {
                  width: "150px",
                },
              }}
              value={query?.briefType}
              onChange={(value) => setQuery({ ...query, briefType: value })}
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  briefType: null,
                });
              }}
            />
            <Select
              placeholder="Size"
              data={["Small", "Medium", "Big"]}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.sizeValue}
              onChange={(value) =>
                setQuery({
                  ...query,
                  size: CONVERT_STATUS_TO_NUMBER[value],
                  sizeValue: value,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  size: null,
                  sizeValue: null,
                });
              }}
            />
            <Select
              placeholder="Team"
              data={["BD1", "BD2", "BD3", "POD-Biz"]}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.rndTeam}
              onChange={(value) => setQuery({ ...query, rndTeam: value })}
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  rndTeam: null,
                });
              }}
            />
            <Select
              placeholder="RND"
              data={map(filter(users, { role: "rnd" }), "name") || []}
              styles={{
                input: {
                  width: "150px",
                },
              }}
              value={query?.rndName}
              onChange={(value) =>
                setQuery({
                  ...query,
                  rndName: find(users, { name: value })?.name,
                  rnd: find(users, { name: value })?.uid,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  rndName: null,
                  rnd: null,
                });
              }}
            />
            <Select
              placeholder="Designer"
              data={map(filter(users, { role: "designer" }), "name") || []}
              styles={{
                input: {
                  width: "120px",
                },
              }}
              value={query?.designerName}
              onChange={(value) =>
                setQuery({
                  ...query,
                  designerName: find(users, { name: value })?.name,
                  designer: find(users, { name: value })?.uid,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  designerName: null,
                  designer: null,
                });
              }}
            />
            <Select
              placeholder="Status"
              data={["Done", "Undone"]}
              styles={{
                input: {
                  width: "120px",
                },
              }}
              value={query?.statusValue}
              onChange={(value) =>
                setQuery({
                  ...query,
                  status: value === "Done" ? [2] : [1],
                  statusValue: value,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  status: [1, 2],
                  statusValue: null,
                });
              }}
            />
            <Button
              onClick={() => {
                setQuery({
                  date: null,
                  batch: "",
                  sku: "",
                  briefType: null,
                  size: null,
                  rndTeam: null,
                  rnd: null,
                  designer: null,
                  status: [1, 2],
                  sizeValue: null,
                  rndName: null,
                  designerName: null,
                  statusValue: null,
                  dateValue: null,
                });
                setBatch("");
                setSearchSKU("");
              }}
            >
              <IconFilterOff />
            </Button>
          </Flex>
          <Flex
            style={{
              gap: "30px",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "#EFF0F1",
            }}
            justify="end"
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Undone: {filter(data, { status: 1 }).length}
            </div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Time to done: {filter(data, { status: 1 }).length}h
            </div>
          </Flex>
          {editingCell && !isEmpty(updateBrief.linkDesigns) && (
            <Flex>
              <Button
                variant="filled"
                color="blue"
                leftSection={<IconDeviceFloppy />}
              >
                Save
              </Button>
            </Flex>
          )}
        </div>
      );
    },
    state: {
      showProgressBars: loadingFetchBrief,
      sorting,
    },
    mantineTableBodyCellProps: ({ row, table, cell }) => ({
      className: classes["body-cells"],
      onDoubleClick: (event) => {
        console.log(`cell----`, cell);
        console.info(row.original);
        if (cell && cell.column.id === "linkDesign") {
          setEditingCell(true);
          table.setEditingCell(cell);
        }
      },
      onClick: (event) => {
        if (cell && cell.column.id === "status") {
          handleUpdateStatus({
            uid: row.original.uid,
            status: row.original.status,
          }).then((response) => {
            console.log(response);
          });
          return;
        }
        if (cell && cell.column.id === "remove") {
          openDeleteConfirmModal(row);
          return;
        }
        if (cell && cell.column.id === "priority") {
          handleUpdatePriority({
            uid: row.original.uid,
            priority: row.original.priority,
          }).then((response) => {
            console.log(response);
          });
          return;
        }
      },
      // when leaving the cell, we want to reset the editing cell
      onBlur: (event) => {
        if (isEmpty(updateBrief.linkDesigns)) {
          setEditingCell(false);
        }
        const uidKeys = keys(updateBrief);
        const newData = map(data, (x) => {
          if (includes(uidKeys, x.uid)) {
            return {
              ...x,
              ...updateBrief[x.uid],
            };
          }
          return x;
        });
        const uid = uidKeys[0];
        if (uid && updateBrief[uid] && updateBrief[uid].linkDesign) {
          const urlPattern =
            /^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[\w-]*)?$/i;

          if (!urlPattern.test(updateBrief[uid].linkDesign)) {
            showNotification("Thất bại", "Link Design không hợp lệ", "red");
            setUpdateBrief({
              ...updateBrief,
              [uid]: {
                ...updateBrief[uid],
                linkDesign: "",
              },
            });
            table.setEditingCell(null);
            return;
          }
          rndServices
            .updateBrief({
              uid,
              data: updateBrief[uid],
            })
            .then((response) => {
              console.log(response);
            });
          setData(newData);
          table.setEditingCell(null);
        } else {
          table.setEditingCell(null);
        }
      },
      sx: {
        cursor: "pointer", //you might want to change the cursor too when adding an onClick
      },
    }),
    onSortingChange: setSorting,
    enableStickyHeader: true,
  });

  return <MantineReactTable table={table} />;
};

export default KeywordTable;
