import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";
import Checkbox from "../../../components/Checkbox";
import { keywordServices, rndServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import {
  cloneDeep,
  compact,
  filter,
  find,
  includes,
  isEmpty,
  keys,
  map,
  split,
  sumBy,
  uniq,
} from "lodash";
import { useEdit } from "../../../hooks";
import { IconSearch } from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import { DateRangePicker } from "rsuite";
import {
  IconCheck,
  IconX,
  IconDeviceFloppy,
  IconBan,
} from "@tabler/icons-react";
import { BRIEF_TYPES } from "../../../constant";
import moment from "moment-timezone";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
} from "../../../utils";
//CREATE hook (post new user to api)
function useCreateKeyword(name, exKeywords, setKeywords) {
  return useMutation({
    mutationFn: async (keyword) => {
      const { keyword: keywordValue } = keyword;
      const transformedKeywordValues = compact(split(keywordValue, "\n"));
      const originalKeywordLength = transformedKeywordValues.length;
      const filteredKeywordValues = filter(
        transformedKeywordValues,
        (item) => !includes(map(exKeywords, "keyword"), item)
      );
      const uniqueKeywordValues = map(
        uniq(filteredKeywordValues),
        (keyword) => ({ keyword })
      );
      const newKeywordLength = uniqueKeywordValues.length;
      if (newKeywordLength > 0)
        showNotification(
          "Thông tin",
          `${newKeywordLength}/${originalKeywordLength} được add-in thêm`,
          "yellow"
        );
      if (isEmpty(uniqueKeywordValues))
        return Promise.reject("Không có keyword mới");
      //send api update request here
      const newKeywords = exKeywords
        ? [...uniqueKeywordValues, ...exKeywords]
        : uniqueKeywordValues;
      const transformedKeywords = uniq(map(newKeywords, "keyword"));
      const createNewKeywordResponse =
        await keywordServices.createNewKeywordInTemplate({
          name,
          keywords: compact(transformedKeywords),
        });
      return createNewKeywordResponse;
    },
    //client side optimistic update
    onSuccess: (response) => {
      setKeywords(
        map(response.data, (keyword, index) => {
          return {
            id: index,
            keyword: keyword,
          };
        })
      );
    },
    onError: (error) => {
      showNotification("Thất bại", error, "red");
    },
  });
}

//UPDATE hook (put keyword in api)
function useUpdateKeyword(name, exKeywords, setKeywords) {
  return useMutation({
    mutationFn: async (keyword) => {
      const { id, values } = keyword;
      let uniqueKeywordValues = [];
      if (id === undefined) {
        const { keyword: keywordValue } = values;
        const transformedKeywordValues = compact(split(keywordValue, "\n"));
        const originalKeywordLength = transformedKeywordValues.length;
        const filteredKeywordValues = filter(
          transformedKeywordValues,
          (item) => !includes(map(exKeywords, "keyword"), item)
        );
        uniqueKeywordValues = map(uniq(filteredKeywordValues), (keyword) => ({
          keyword,
        }));
        const newKeywordLength = uniqueKeywordValues.length;
        if (newKeywordLength > 0) {
          showNotification(
            "Thông tin",
            `${newKeywordLength}/${originalKeywordLength} được add-in thêm`,
            "yellow"
          );
        }

        if (isEmpty(uniqueKeywordValues))
          return Promise.reject("Không có keyword mới");
      }

      let newKeywords = [];
      if (id !== undefined) {
        if (includes(map(exKeywords, "keyword"), values.keyword)) {
          return Promise.reject("Keyword đã tồn tại");
        }
        newKeywords = exKeywords.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              keyword: values.keyword,
            };
          }
          return item;
        });
      } else {
        newKeywords = [...uniqueKeywordValues, ...exKeywords];
      }

      const transformedKeywords = uniq(map(newKeywords, "keyword"));
      //send api update request here
      const createNewKeywordResponse =
        await keywordServices.createNewKeywordInTemplate({
          name,
          keywords: compact(transformedKeywords),
        });
      return createNewKeywordResponse;
    },
    //client side optimistic update
    onSuccess: (response) => {
      setKeywords(
        map(response.data, (keyword, index) => {
          return {
            id: index,
            keyword: keyword,
          };
        })
      );
    },
    onError: (error) => {
      showNotification("Thất bại", error.message || error, "red");
    },
  });
}

//DELETE hook (delete keyword in api)
function useDeleteKeyword(name, exKeywords, setKeywords) {
  return useMutation({
    mutationFn: async (keyword) => {
      const { id, ids } = keyword;
      let newKeywords = [];
      if (id !== undefined) {
        newKeywords = filter(exKeywords, (item) => {
          return item.id !== id;
        });
      } else {
        newKeywords = filter(exKeywords, (item) => {
          return !includes(ids, item.id);
        });
      }

      const transformedKeywords = uniq(map(newKeywords, "keyword"));
      //send api update request here
      const createNewKeywordResponse =
        await keywordServices.createNewKeywordInTemplate({
          name,
          keywords: compact(transformedKeywords),
        });
      return createNewKeywordResponse;
    },
    //client side optimistic update
    onSuccess: (response) => {
      setKeywords(
        map(response.data, (keyword, index) => {
          return {
            id: index,
            keyword: keyword,
          };
        })
      );
    },
    onError: (error) => {
      showNotification("Thất bại", error.message, "red");
    },
  });
}

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
  setLoadingFetchBrief,
  setTrigger,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(productLines || []);
  const [templateName, setTemplateName] = useState(name);
  const [date, sateDate] = useState();
  useEffect(() => {
    setData(productLines);
    setTemplateName(name);
  }, [productLines, templateName]);
  const handleUpdateStatus = async ({ uid, status }) => {
    const newData = map(data, (x) => {
      if (x.uid === uid) {
        return {
          ...x,
          status: status === 1 ? 2 : 1,
        };
      }
      return x;
    });
    setData(newData);
    await rndServices.updateBrief({
      uid,
      data: {
        status: status === 1 ? 2 : 1,
      },
    });
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
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "date",
        header: "DATE",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "batch",
        header: "BATCH",
        size: 100,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "sku",
        header: "SKU",
        size: 100,
        enableEditing: false,
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
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => (
          <Image
            radius="md"
            src={row?.original?.imageRef || "/images/content/not_found_2.jpg"}
            height={100}
          />
        ),
      },
      {
        accessorKey: "briefType",
        header: "LOẠI BRIEF",
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        id: "value",
        accessorFn: (row) => CONVERT_NUMBER_TO_STATUS[row?.size?.rnd],
        header: "VALUE",
        size: 100,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        id: "size",
        accessorFn: (row) => CONVERT_NUMBER_TO_STATUS[row?.size?.rnd],
        header: "SIZE",
        size: 100,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "rndTeam",
        header: "TEAM",
        size: 100,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        id: "rndName",
        accessorFn: (row) => row?.rnd?.name,
        header: "RND",
        enableEditing: false,
        size: 130,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        id: "designer",
        accessorFn: (row) => row?.designer?.name,
        header: "DESIGNER",
        enableEditing: false,
        size: 130,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "linkDesign",
        header: "LINK DESIGN",
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        size: 100,
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
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        Cell: (props) => {
          const { value, handleOnChange, handleBlur } = useEdit(props);
          const { row, table } = props;
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
        header: "Priority",
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
        accessorFn: (row) => row?.time + "h",
        header: "Time",
        mantineTableHeadCellProps: { className: classes["head-cells"] },
        enableEditing: false,
        size: 50,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "remove",
        header: "REMOVE",
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

  //call CREATE hook
  const {
    mutateAsync: createKeyword,
    isLoading: isCreatingKeyword,
    status: createKeywordStatus,
  } = useCreateKeyword(templateName, data, setData);

  //call UPDATE hook
  const {
    mutateAsync: updateKeyword,
    isLoading: isUpdatingKeyword,
    status: updateKeywordStatus,
  } = useUpdateKeyword(templateName, data, setData);
  //call DELETE hook
  const {
    mutateAsync: deleteKeyword,
    isLoading: isDeletingKeyword,
    status: deleteKeywordStatus,
  } = useDeleteKeyword(templateName, data, setData);

  //CREATE action
  const handleCreateKeyword = async ({ values, exitCreatingMode }) => {
    try {
      await createKeyword(values);
      exitCreatingMode();
    } catch (e) {
      console.log(e);
    }
  };

  //UPDATE action
  const handleSaveKeyword = async ({ values, table, row }) => {
    try {
      setValidationErrors({});
      const id = row.original.id;
      await updateKeyword({ values, id });
      table?.setEditingRow(null); //exit editing mode
    } catch (error) {
      console.log(error);
    }
  };
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
    mantineTableBodyCellProps: { className: classes["body-cells"] },
    enableSorting: false,
    mantineTableProps: { striped: "even" },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateKeyword,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveKeyword,
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
              data={BRIEF_TYPES}
              styles={{
                input: {
                  width: "150px",
                },
              }}
              value={query?.briefType}
              onChange={(value) => setQuery({ ...query, briefType: value })}
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
            />
            <Select
              placeholder="Team"
              data={["BD1", "BD2", "BD3"]}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.rndTeam}
              onChange={(value) => setQuery({ ...query, rndTeam: value })}
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
                  status: value === "Done" ? 2 : 1,
                  statusValue: value,
                })
              }
            />
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
              Time to done: {sumBy(filter(data, { status: 1 }), "time")}h
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
      isSaving: isCreatingKeyword || isUpdatingKeyword || isDeletingKeyword,
      showProgressBars:
        updateKeywordStatus === "pending" ||
        createKeywordStatus === "pending" ||
        deleteKeywordStatus === "pending" ||
        loadingFetchBrief,
    },
    mantineTableBodyCellProps: ({ row, table, cell }) => ({
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
        console.log(updateBrief);
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
        console.log(updateBrief[uid]);
        if (uid && updateBrief[uid] && updateBrief[uid].linkDesign) {
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
        }
      },
      sx: {
        cursor: "pointer", //you might want to change the cursor too when adding an onClick
      },
    }),
  });

  return <MantineReactTable table={table} />;
};

export default KeywordTable;
