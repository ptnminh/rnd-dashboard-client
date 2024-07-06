import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Badge,
  Box,
  Button,
  Flex,
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
import { keywordServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import { compact, filter, includes, isEmpty, map, split, uniq } from "lodash";
import { useEdit } from "../../../hooks";
import { IconSearch } from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import { IconCheck, IconX } from "@tabler/icons-react";
import { BRIEF_TYPES } from "../../../constant";
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
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(productLines || []);
  const [templateName, setTemplateName] = useState(name);
  useEffect(() => {
    setData(productLines);
    setTemplateName(name);
  }, [productLines, templateName]);
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
      },
      {
        accessorKey: "date",
        header: "DATE",
        size: 120,
        enableEditing: false,
      },
      {
        accessorKey: "batch",
        header: "BATCH",
        size: 100,
        enableEditing: false,
      },
      {
        accessorKey: "sku",
        header: "SKU",
        size: 100,
        enableEditing: false,
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
        accessorKey: "briefType",
        header: "LOẠI BRIEF",
        enableEditing: false,
      },
      {
        id: "value",
        accessorFn: (row) => row?.value?.rnd,
        header: "VALUE",
        size: 100,
        enableEditing: false,
      },
      {
        id: "size",
        accessorFn: (row) => row?.size?.rnd,
        header: "SIZE",
        size: 100,
        enableEditing: false,
      },
      {
        accessorKey: "rndTeam",
        header: "TEAM",
        size: 100,
        enableEditing: false,
      },
      {
        id: "rndName",
        accessorFn: (row) => row?.rnd?.name,
        header: "RND",
        enableEditing: false,
        size: 130,
      },
      {
        id: "designer",
        accessorFn: (row) => row?.designer?.name,
        header: "DESIGNER",
        enableEditing: false,
        size: 130,
      },
      {
        accessorKey: "designLink",
        header: "LINK DESIGN",
        mantineTableHeadCellProps: { className: classes["designLink"] },
        size: 100,
      },
      {
        accessorKey: "status",
        header: "DONE",
        size: 100,
        mantineTableHeadCellProps: { className: classes["designLink"] },
        Edit: (props) => {
          const { value, handleOnChange, handleBlur } = useEdit(props);
          return (
            <Button
              variant="filled"
              color="#62d256"
              leftSection={<IconCheck />}
              disabled
            >
              Done
            </Button>
          );
        },
        mantineEditTextInputProps: ({ cell }) => ({
          //onBlur is more efficient, but could use onChange instead
          onBlur: (event) => {
            console.log("onBlur", event.target.value);
            // handleSaveCell(cell, event.target.value);
          },
          variant: "unstyled", //default for editDisplayMode="table"
        }),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        mantineTableHeadCellProps: { className: classes["designLink"] },
        Edit: ({ cell }) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Checkbox checked={true} />
            </div>
          );
        },
      },
      {
        accessorKey: "time",
        header: "Time",
        mantineTableHeadCellProps: { className: classes["head-cells"] },
        enableEditing: false,
        size: 100,
      },
      {
        accessorKey: "remove",
        header: "REMOVE",
        mantineTableHeadCellProps: { className: classes["remove"] },
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
      title: "Are you sure you want to delete this keyword?",
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete {row.original.keyword}? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteKeyword({ id: row.original.id }),
    });

  const table = useMantineReactTable({
    columns,
    data,
    editDisplayMode: "table", // ('modal', 'cell', 'table', and 'custom' are also available)
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
              leftSection={<IconSearch size={16} />}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.batch}
              onChange={(e) => setQuery({ ...query, batch: e.target.value })}
            />
            <TextInput
              placeholder="SKU"
              size="sm"
              width="100px"
              leftSection={<IconSearch size={16} />}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.sku}
              onChange={(e) => setQuery({ ...query, sku: e.target.value })}
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
              value={query?.size}
              onChange={(value) => setQuery({ ...query, size: value })}
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
              data={["Thảo Thảo", "Nhật Minh"]}
              styles={{
                input: {
                  width: "150px",
                },
              }}
            />
            <Select
              placeholder="Designer"
              data={["Phương Duy"]}
              styles={{
                input: {
                  width: "120px",
                },
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
              Undone: 3
            </div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Time to done: 15h
            </div>
          </Flex>
        </div>
      );
    },
    state: {
      isSaving: isCreatingKeyword || isUpdatingKeyword || isDeletingKeyword,
      showProgressBars:
        updateKeywordStatus === "pending" ||
        createKeywordStatus === "pending" ||
        deleteKeywordStatus === "pending",
    },
  });

  return <MantineReactTable table={table} />;
};

export default KeywordTable;
