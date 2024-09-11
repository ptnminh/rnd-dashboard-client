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
import {
  CHOOSE_BRIEF_TYPES,
  LOCAL_STORAGE_KEY,
  MEMBER_POSITIONS,
  STATUS,
} from "../../../constant";
import moment from "moment-timezone";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
} from "../../../utils";
import { rndServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import { useLocalStorage } from "../../../hooks";

const BriefsTable = ({
  briefs,
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
  setLinkProduct,
  sorting,
  setSorting,
  metadata,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  let [permissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  const [payloads, setPayloads] = useState([]);
  permissions = map(permissions, "name");
  const [data, setData] = useState(briefs || []);
  useEffect(() => {
    setData(briefs);
    setPayloads(briefs);
  }, [briefs]);
  const handleUpdateStatus = async ({ uid, status }) => {
    await rndServices.updateBriefListing({
      uid,
      data: {
        status: status === 2 ? 3 : 2,
      },
    });
    setTrigger(true);
  };
  const handleUpdatePriority = async ({ uid, priority }) => {
    await rndServices.updateBriefListing({
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
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: true,
      },
      {
        accessorKey: "batch",
        header: "BATCH",
        size: 100,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
        Cell: ({ row }) => (
          <Badge color={row?.original?.attribute?.batchColor} variant="filled">
            {row.original.batch}
          </Badge>
        ),
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
              setLinkProduct(row.original.linkProduct);
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
        header: "HÌNH SKU",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => (
          <Image
            radius="md"
            src={
              row?.original?.designInfo?.thumbLink ||
              "/images/content/not_found_2.jpg"
            }
            height={100}
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
        accessorKey: "value",
        header: "VALUE",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        Cell: ({ row }) => {
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Select
              placeholder="Value"
              disabled={foundBrief?.status === STATUS.LISTED}
              allowDeselect={false}
              data={["Small", "Medium", "Big", "Super Big"]}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={CONVERT_NUMBER_TO_STATUS[foundBrief.value?.rnd]}
              onChange={(value) => {
                setPayloads((prev) => {
                  const newPayloads = map(prev, (x) => {
                    if (x.uid === uid) {
                      return {
                        ...x,
                        value: {
                          ...x.value,
                          rnd: CONVERT_STATUS_TO_NUMBER[value],
                        },
                      };
                    }
                    return x;
                  });
                  return newPayloads;
                });
                rndServices.updateBriefListing({
                  uid,
                  data: {
                    value: {
                      ...foundBrief.value,
                      rnd: CONVERT_STATUS_TO_NUMBER[value],
                    },
                  },
                });
              }}
            />
          );
        },
      },
      // {
      //   accessorKey: "size",
      //   header: "SIZE",
      //   size: 100,
      //   enableEditing: false,
      //   enableSorting: false,
      //   mantineTableBodyCellProps: { className: classes["body-cells"] },
      //   mantineTableHeadCellProps: { className: classes["linkDesign"] },
      //   Cell: ({ row }) => {
      //     const uid = row?.original?.uid;
      //     const foundBrief = find(payloads, { uid });
      //     return (
      //       <Select
      //         placeholder="Size"
      //         allowDeselect={false}
      //         disabled={foundBrief?.status === STATUS.LISTED}
      //         data={["Small", "Medium", "Big"]}
      //         styles={{
      //           input: {
      //             width: "100px",
      //           },
      //         }}
      //         value={
      //           CONVERT_NUMBER_TO_STATUS[foundBrief?.size?.epm] ||
      //           CONVERT_NUMBER_TO_STATUS[foundBrief?.size?.rnd]
      //         }
      //         onChange={(value) => {
      //           setPayloads((prev) => {
      //             const newPayloads = map(prev, (x) => {
      //               if (x.uid === uid) {
      //                 return {
      //                   ...x,
      //                   size: {
      //                     ...x.size,
      //                     epm: CONVERT_STATUS_TO_NUMBER[value],
      //                   },
      //                 };
      //               }
      //               return x;
      //             });
      //             return newPayloads;
      //           });
      //           rndServices.updateBriefListing({
      //             uid,
      //             data: {
      //               size: {
      //                 ...foundBrief.size,
      //                 epm: CONVERT_STATUS_TO_NUMBER[value],
      //               },
      //             },
      //           });
      //         }}
      //       />
      //     );
      //   },
      // },
      {
        accessorKey: "size",
        header: "SIZE",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          let color = null;
          switch (row?.original?.size?.epm) {
            case 1:
              color = "green";
              break;
            case 2:
              color = "yellow";
              break;
            case 3:
              color = "red";
              break;
            case 1.5:
              color = "#006400";
              break;
            default:
              break;
          }
          return color ? (
            <Badge color={color} variant="filled">
              {CONVERT_NUMBER_TO_STATUS[row?.original?.size?.epm]}
            </Badge>
          ) : (
            <span>{CONVERT_NUMBER_TO_STATUS[row?.original?.size?.epm]}</span>
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
        id: "epm",
        accessorFn: (row) => row?.epm?.name,
        header: "EPM",
        enableEditing: false,
        size: 130,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Select
              placeholder="Size"
              allowDeselect={false}
              data={filter(users, { position: MEMBER_POSITIONS.EPM }).map(
                (x) => x.name
              )}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={foundBrief?.epm?.name}
              onChange={(value) => {
                setPayloads((prev) => {
                  const newPayloads = map(prev, (x) => {
                    if (x.uid === uid) {
                      return {
                        ...x,
                        epm: {
                          name: value,
                        },
                      };
                    }
                    return x;
                  });
                  return newPayloads;
                });
                rndServices.updateBriefListing({
                  uid,
                  data: {
                    epmId: find(users, { name: value })?.uid,
                  },
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "linkProduct",
        header: "LINK LISTING",
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        size: 100,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Edit: ({ row }) => {
          return (
            <TextInput
              value={updateBrief[row.original.uid]?.linkProduct}
              readOnly={row.original.status === STATUS.LISTED}
              onChange={(e) => {
                setUpdateBrief({
                  ...updateBrief,
                  [row.original.uid]: {
                    ...updateBrief[row.original.uid],
                    linkProduct: e.target.value,
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
              row.original.linkProduct ||
              updateBrief[row.original.uid]?.linkProduct
            }
          >
            {row.original.linkProduct ||
            updateBrief[row.original.uid]?.linkProduct ? (
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
              color={row.original.status === 3 ? "red" : "green"}
              leftSection={
                row.original.status === 3 ? <IconBan /> : <IconCheck />
              }
              disabled={
                (row?.original?.status === 2 &&
                  !row?.original?.linkProduct &&
                  !updateBrief[row.original.uid]?.linkProduct) ||
                row.original.status === 3
              }
            >
              {row.original.status === 3 ? "Undone" : "Done"}
            </Button>
          );
        },
      },
      {
        id: "time",
        accessorFn: (row) => row?.productInfo?.time,
        header: "TIME",
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
    [validationErrors, users, payloads]
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
              onShortcutClick={(shortcut) => {
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
                  width: "100px",
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
                  size: {
                    "size.epm": CONVERT_STATUS_TO_NUMBER[value],
                  },
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
                  width: "100px",
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
                  width: "100px",
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
              placeholder="EPM"
              data={map(filter(users, { position: "epm" }), "name") || []}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.epmName}
              onChange={(value) =>
                setQuery({
                  ...query,
                  epmName: find(users, { name: value })?.name,
                  epm: find(users, { name: value })?.uid,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  epmName: null,
                  epm: null,
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
                  status: value === "Done" ? [3] : [2],
                  statusValue: value,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  status: [2, 3],
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
                  epm: null,
                  designer: null,
                  status: [2, 3],
                  sizeValue: null,
                  rndName: null,
                  designerName: null,
                  epmName: null,
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
              Undone: {metadata?.totalUndoneBriefsWithFilter}
            </div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Time to done: {metadata?.totalTimeToDoneBriefsWithFilter}h
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
      onDoubleClick: () => {
        if (cell && cell.column.id === "linkProduct") {
          setEditingCell(true);
          table.setEditingCell(cell);
        }
      },
      onClick: () => {
        if (
          cell &&
          cell.column.id === "status" &&
          (includes(permissions, "update:epm") ||
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
          (includes(permissions, "delete:epm") ||
            includes(permissions, "delete:brief"))
        ) {
          openDeleteConfirmModal(row);
          return;
        }
        if (
          cell &&
          cell.column.id === "priority" &&
          (includes(permissions, "update:epm") ||
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
        if (uid && updateBrief[uid] && updateBrief[uid].linkProduct) {
          const urlPattern =
            /^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[\w-]*)?$/i;

          if (!urlPattern.test(updateBrief[uid].linkProduct)) {
            showNotification("Thất bại", "Link Listing không hợp lệ", "red");
            setUpdateBrief({
              ...updateBrief,
              [uid]: {
                ...updateBrief[uid],
                linkProduct: "",
              },
            });
            table.setEditingCell(null);
            return;
          }
          rndServices
            .updateBriefListing({
              uid,
              data: updateBrief[uid],
            })
            .then((response) => {
              if (!response) {
                setUpdateBrief({
                  ...updateBrief,
                  [uid]: {
                    ...updateBrief[uid],
                    linkProduct: "",
                  },
                });
              } else {
                setData(newData);
              }
            });
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

export default BriefsTable;
