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

import { filter, find, includes, isEmpty, keys, map, set } from "lodash";
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
  BRIEF_TYPES,
  CHOOSE_BRIEF_TYPES,
  LOCAL_STORAGE_KEY,
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

const KeywordTable = ({
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
  setLinkDesign,
  sorting,
  setSorting,
  metadata,
  openNoteForEPM,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  let [permissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  permissions = map(permissions, "name");
  const [payloads, setPayloads] = useState([]);
  const [data, setData] = useState(briefs || []);
  useEffect(() => {
    setData(briefs);
    setPayloads(briefs);
  }, [briefs]);
  const handleUpdateStatus = async ({ uid, status, realStatus }) => {
    await rndServices.updateBriefDesign({
      uid,
      data: {
        status: status === 1 ? 2 : 1,
        ...(realStatus && { status: realStatus }),
      },
    });
    setTrigger(true);
  };
  const handleUpdatePriority = async ({ uid, priority }) => {
    await rndServices.updateBriefDesign({
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
        accessorKey: "priority",
        header: "PRIORITY",
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["SKU"] },
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
        size: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["SKU"] },
        Cell: ({ row }) => {
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Select
              size="xs"
              placeholder="Value"
              allowDeselect={false}
              disabled={foundBrief.status === STATUS.DESIGNED}
              data={["Small", "Medium", "Big", "Super Big"]}
              styles={{
                input: {
                  width: "100%",
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
                rndServices.updateBriefDesign({
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
      //         disabled={foundBrief.status === STATUS.DESIGNED}
      //         data={["Small", "Medium", "Big"]}
      //         styles={{
      //           input: {
      //             width: "100px",
      //           },
      //         }}
      //         value={
      //           CONVERT_NUMBER_TO_STATUS[foundBrief.size?.design] ||
      //           CONVERT_NUMBER_TO_STATUS[foundBrief.size?.rnd]
      //         }
      //         onChange={(value) => {
      //           setPayloads((prev) => {
      //             const newPayloads = map(prev, (x) => {
      //               if (x.uid === uid) {
      //                 return {
      //                   ...x,
      //                   size: {
      //                     ...x.size,
      //                     design: CONVERT_STATUS_TO_NUMBER[value],
      //                   },
      //                 };
      //               }
      //               return x;
      //             });
      //             return newPayloads;
      //           });
      //           rndServices.updateBriefDesign({
      //             uid,
      //             data: {
      //               size: {
      //                 ...foundBrief.size,
      //                 design: CONVERT_STATUS_TO_NUMBER[value],
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
          switch (row?.original?.size?.design) {
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
              {CONVERT_NUMBER_TO_STATUS[row?.original?.size?.design]}
            </Badge>
          ) : (
            <span>{CONVERT_NUMBER_TO_STATUS[row?.original?.size?.design]}</span>
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
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        Cell: ({ row }) => {
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Select
              data={["BD1", "BD2", "BD3", "AMZ"]}
              allowDeselect={false}
              size="xs"
              value={foundBrief.rndTeam}
              onChange={(value) => {
                setPayloads((prev) => {
                  const newPayloads = map(prev, (x) => {
                    if (x.uid === uid) {
                      return {
                        ...x,
                        rndTeam: value,
                      };
                    }
                    return x;
                  });
                  return newPayloads;
                });
                rndServices.updateBriefDesign({
                  uid,
                  data: {
                    rndTeam: value,
                  },
                });
              }}
            />
          );
        },
      },
      {
        id: "rndName",
        accessorFn: (row) => row?.rnd?.name,
        header: "RND",
        enableEditing: false,
        enableSorting: false,
        size: 150,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        Cell: ({ row }) => {
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Select
              size="xs"
              data={map(filter(users, { position: "rnd" }), "name") || []}
              allowDeselect={false}
              value={foundBrief?.rnd?.name}
              onChange={(value) => {
                setPayloads((prev) => {
                  const newPayloads = map(prev, (x) => {
                    if (x.uid === uid) {
                      return {
                        ...x,
                        rnd: {
                          ...x.rnd,
                          name: value,
                        },
                        rndId: find(users, { name: value })?.uid,
                      };
                    }
                    return x;
                  });
                  return newPayloads;
                });
                rndServices.updateBriefDesign({
                  uid,
                  data: {
                    rndId: find(users, { name: value })?.uid,
                  },
                });
              }}
            />
          );
        },
      },
      {
        id: "designer",
        accessorFn: (row) => row?.designer?.name,
        header: "DESIGNER",
        enableEditing: false,
        enableSorting: false,
        size: 150,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        Cell: ({ row }) => {
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Select
              size="xs"
              data={map(filter(users, { position: "designer" }), "name") || []}
              allowDeselect={false}
              value={foundBrief?.designer?.name}
              onChange={(value) => {
                setPayloads((prev) => {
                  const newPayloads = map(prev, (x) => {
                    if (x.uid === uid) {
                      return {
                        ...x,
                        designer: {
                          ...x.designer,
                          name: value,
                        },
                        designerId: find(users, { name: value })?.uid,
                      };
                    }
                    return x;
                  });
                  return newPayloads;
                });
                rndServices.updateBriefDesign({
                  uid,
                  data: {
                    designerId: find(users, { name: value })?.uid,
                  },
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "linkDesign",
        header: "LINK DESIGN",
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        size: 100,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Edit: ({ row, table }) => {
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });

          return (
            <TextInput
              value={foundBrief.linkDesign}
              onChange={(e) => {
                const value = e.target.value;
                setPayloads((prev) => {
                  const newPayloads = map(prev, (x) => {
                    if (x.uid === uid) {
                      return {
                        ...x,
                        linkDesign: value,
                      };
                    }
                    return x;
                  });
                  return newPayloads;
                });
              }}
              onBlur={(e) => {
                const value = e.target.value;
                const urlPattern =
                  /^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[\w-]*)?$/i;
                if (!urlPattern.test(value)) {
                  showNotification(
                    "Thất bại",
                    "Link Design không hợp lệ",
                    "red"
                  );
                  setPayloads((prev) => {
                    const newPayloads = map(prev, (x) => {
                      if (x.uid === uid) {
                        return {
                          ...x,
                          linkDesign: "",
                        };
                      }
                      return x;
                    });
                    return newPayloads;
                  });
                  return;
                } else {
                  rndServices
                    .updateBriefDesign({
                      uid,
                      data: {
                        linkDesign: value,
                      },
                    })
                    .then((response) => {
                      table.setEditingCell(null);
                    });
                }
              }}
              readOnly={[
                STATUS.DESIGNED,
                STATUS.OPTIMIZED_LISTING_DESIGNED,
                STATUS.OPTIMIZED_ADS_DESIGNED,
              ].includes(row?.original?.status)}
            />
          );
        },
        Cell: ({ row }) => {
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <a
              style={{
                cursor: "pointer",
              }}
              target="_blank"
              href={foundBrief?.linkDesign}
            >
              {foundBrief.linkDesign ? (
                <Badge color="blue" variant="filled">
                  {" "}
                  <u>Link</u>{" "}
                </Badge>
              ) : null}
            </a>
          );
        },
      },
      {
        accessorKey: "noteForEPM",
        header: "NOTE FOR EPM",
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        size: 100,
        enableSorting: false,
        Cell: ({ row }) => {
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });
          const note = foundBrief?.note?.noteForEPM;
          return (
            <Button
              onClick={() => {
                setSelectedSKU(foundBrief);
                openNoteForEPM();
              }}
              color={note ? "#f1f3f5" : "blue"}
            >
              Note
            </Button>
          );
        },
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
          const uid = row?.original?.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Button
              variant="filled"
              color={
                [
                  STATUS.DESIGNED,
                  STATUS.OPTIMIZED_LISTING_DESIGNED,
                  STATUS.OPTIMIZED_ADS_DESIGNED,
                ].includes(row?.original?.status)
                  ? "red"
                  : "green"
              }
              leftSection={
                [
                  STATUS.DESIGNED,
                  STATUS.OPTIMIZED_LISTING_DESIGNED,
                  STATUS.OPTIMIZED_ADS_DESIGNED,
                ].includes(row?.original?.status) ? (
                  <IconBan />
                ) : (
                  <IconCheck />
                )
              }
              disabled={foundBrief.status === 1 && !foundBrief?.linkDesign}
              onClick={() => {
                let realStatus = null;
                switch (foundBrief?.briefType) {
                  case BRIEF_TYPES[6]:
                    if (foundBrief?.status === STATUS.BRIEF_CREATED) {
                      realStatus = STATUS.OPTIMIZED_LISTING_DESIGNED;
                    } else {
                      realStatus = STATUS.BRIEF_CREATED;
                    }
                    break;
                  case BRIEF_TYPES[7]:
                    if (foundBrief?.status === STATUS.BRIEF_CREATED) {
                      realStatus = STATUS.OPTIMIZED_ADS_DESIGNED;
                    } else {
                      realStatus = STATUS.BRIEF_CREATED;
                    }
                    break;
                  case BRIEF_TYPES[8]:
                    if (foundBrief?.status === STATUS.BRIEF_CREATED) {
                      realStatus = STATUS.DESIGNED;
                    } else {
                      realStatus = STATUS.BRIEF_CREATED;
                    }
                    break;
                  default:
                    realStatus = null;
                    break;
                }
                openUpdateStatusConfirmModal({
                  uid,
                  status: foundBrief?.status,
                  sku: foundBrief?.sku,
                  realStatus,
                });
              }}
            >
              {[
                STATUS.DESIGNED,
                STATUS.OPTIMIZED_LISTING_DESIGNED,
                STATUS.OPTIMIZED_ADS_DESIGNED,
              ].includes(row?.original?.status)
                ? "Undone"
                : "Done"}
            </Button>
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
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
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
    [validationErrors, data, payloads]
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

  // CONFIRM UPDATE STATUS
  const openUpdateStatusConfirmModal = ({ uid, status, sku, realStatus }) =>
    modals.openConfirmModal({
      title: "Confirm Modal",
      centered: true,
      children: <Text>Are you sure you want to update {sku}?</Text>,
      labels: { confirm: "Update", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () =>
        handleUpdateStatus({
          uid,
          status,
          realStatus,
        }),
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
            position: "sticky",
            top: 0,
            right: 0,
            zindex: 10,
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
              onChange={(e) => {
                const value = e.target.value;
                setBatch(value);
                if (!value) {
                  setQuery({ ...query, batch: value });
                }
              }}
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
              onChange={(e) => {
                const value = e.target.value;
                setSearchSKU(value);
                if (!value) {
                  setQuery({ ...query, sku: value });
                }
              }}
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
                  size: {
                    "size.design": CONVERT_STATUS_TO_NUMBER[value],
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
              data={["BD1", "BD2", "BD3", "AMZ"]}
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
                  status: value === "Done" ? [2, 12, 22] : [1],
                  statusValue: value,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  status: [1, 2, 12, 22],
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
                  status: [1, 2, 12, 22],
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
          cell.column.id === "remove" &&
          (includes(permissions, "delete:design") ||
            includes(permissions, "delete:brief"))
        ) {
          openDeleteConfirmModal(row);
          return;
        }
        if (
          cell &&
          cell.column.id === "priority" &&
          (includes(permissions, "update:design") ||
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
        table.setEditingCell(null);
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
