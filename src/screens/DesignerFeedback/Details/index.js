import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Badge,
  Button,
  Flex,
  Image,
  Rating,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";

import { filter, find, includes, isEmpty, keys, map } from "lodash";
import { IconSearch, IconFilterOff } from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import { DateRangePicker } from "rsuite";
import { IconX, IconHeart } from "@tabler/icons-react";
import { CHOOSE_BRIEF_TYPES, LOCAL_STORAGE_KEY } from "../../../constant";
import moment from "moment-timezone";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
  getStringAsEditorState,
} from "../../../utils";
import { rndServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import { useLocalStorage } from "../../../hooks";

const Table = ({
  briefs,
  query,
  setQuery,
  setSelectedSKU,
  openModal,
  users,
  setEditingCell,
  setUpdateBrief,
  updateBrief,
  loadingFetchBrief,
  setTrigger,
  setLinkDesign,
  sorting,
  setSorting,
  setFeedback,
  setOrderedData,
  setColorRating,
  setTypoRating,
  setLayoutRating,
}) => {
  let [permissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  permissions = map(permissions, "name");
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(briefs || []);
  useEffect(() => {
    setData(briefs);
  }, [briefs]);
  const handleUpdateStatus = async ({ uid, status }) => {
    await rndServices.updateBriefDesignFeedback({
      uid,
      data: {
        status: status === 1 ? 2 : 1,
      },
    });
    setTrigger(true);
  };
  const handleUpdatePriority = async ({ uid, priority }) => {
    await rndServices.updateBriefDesignFeedback({
      uid,
      data: {
        priority: priority === 1 ? 2 : 1,
      },
    });
    setTrigger(true);
  };
  const handleOrderedData = (uid, items) => {
    setOrderedData(uid);
  };
  const [rating, setRating] = useState(3);
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
        Cell: ({ row, table }) => {
          const data = map(table?.getRowModel()?.flatRows, "original");
          return (
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedSKU(row.original);
                setFeedback(
                  getStringAsEditorState(
                    row.original?.attribute?.feedback?.feedback
                  )
                );
                setLinkDesign(row.original.linkDesign);
                const uid = row.original.uid;
                handleOrderedData(uid, data);
                setColorRating(
                  row.original?.attribute?.feedback?.rating?.color || 0
                );
                setLayoutRating(
                  row.original?.attribute?.feedback?.rating?.layout || 0
                );
                setTypoRating(
                  row.original?.attribute?.feedback?.rating?.typo || 0
                );
                openModal();
              }}
            >
              <Badge color="blue" variant="filled">
                {" "}
                <u>{row.original.sku}</u>{" "}
              </Badge>
            </div>
          );
        },
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
        accessorKey: "rating",
        header: "RATING",
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        size: 100,
        enableSorting: false,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => (
          <Rating
            emptySymbol={<IconHeart size="2.5rem" color="#D9472A" />}
            fullSymbol={
              <IconHeart size="2.5rem" fill="#D54E30" color="#D9472A" />
            }
            value={row?.original?.attribute?.feedback?.rating?.summary || 0}
            readOnly
            fractions={2}
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
              {
                CONVERT_NUMBER_TO_STATUS[
                  row?.original?.size?.rnd || row?.original?.size?.design
                ]
              }
            </Badge>
          ) : (
            <span>
              {CONVERT_NUMBER_TO_STATUS[row?.original?.size?.rnd] ||
                row?.original?.size?.design}
            </span>
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
              onShortcutClick={(shortcut, event) => {
                setQuery({
                  ...query,
                  dateValue: shortcut.value,
                  date: {
                    startDate: moment(shortcut.value[0]).format("YYYY-MM-DD"),
                    endDate: moment(shortcut.value[1]).format("YYYY-MM-DD"),
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
              data={map(filter(users, { position: "rnd" }), "name") || []}
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
              data={map(filter(users, { position: "designer" }), "name") || []}
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
                  status: [2],
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
        </div>
      );
    },
    state: {
      showProgressBars: loadingFetchBrief,
      sorting,
    },
    mantineTableBodyCellProps: ({ row, table, cell }) => ({
      className: classes["body-cells"],
      onDoubleClick: () => {
        if (cell && cell.column.id === "linkDesign") {
          setEditingCell(true);
          table.setEditingCell(cell);
        }
      },
      onClick: () => {
        if (
          cell &&
          cell.column.id === "status" &&
          (includes(permissions, "update:design_feedback") ||
            includes(permissions, "update:brief"))
        ) {
          handleUpdateStatus({
            uid: row.original.uid,
            status: row.original.status,
          }).then((response) => {
            console.log(response);
          });
          return;
        }
        if (
          cell &&
          cell.column.id === "remove" &&
          (includes(permissions, "delete:design_feedback") ||
            includes(permissions, "delete:brief"))
        ) {
          openDeleteConfirmModal(row);
          return;
        }
        if (
          cell &&
          cell.column.id === "priority" &&
          (includes(permissions, "update:design_feedback") ||
            includes(permissions, "update:brief"))
        ) {
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
      onBlur: () => {
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
            .updateBriefDesignFeedback({
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
  });

  return <MantineReactTable table={table} />;
};

export default Table;
