import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Box, Button, Flex, Text, Textarea, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";
import Icon from "../../../components/Icon";
import { keywordServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import { compact, filter, includes, isEmpty, map, split, uniq } from "lodash";
import { useEdit } from "../../../hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
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

const KeywordTable = ({ keywords, name }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(keywords || []);
  const [templateName, setTemplateName] = useState(name);
  const [rowSelection, setRowSelection] = useState({});
  useEffect(() => {
    setData(keywords);
    setTemplateName(name);
  }, [keywords, templateName]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "keyword",
        header: "Keyword",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.data,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              data: undefined,
            }),
        },
        Edit: (props) => {
          const { value, handleOnChange, handleBlur } = useEdit(props);
          return (
            <Textarea
              data={data}
              value={value}
              onBlur={handleBlur}
              onChange={(event) => handleOnChange(event.currentTarget.value)}
            />
          );
        },
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

  const handleExportRows = (rows) => {
    console.log(rows);
  };

  const handleDeleteSelectedRows = async ({ rows }) => {
    await deleteKeyword({ ids: map(rows, "id") });
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
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "row", // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enablePagination: false,
    getRowId: (row) => row.id,
    mantineTableContainerProps: {
      sx: {
        minHeight: "500px",
        borderRadius: "20px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateKeyword,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveKeyword,
    enableDensityToggle: false,
    initialState: { density: "xs" },
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <div
            onClick={() => table.setEditingRow(row)}
            style={{ cursor: "pointer" }}
          >
            <Icon name="edit" size={24} fill="gray" />
          </div>
        </Tooltip>
        <Tooltip label="Delete">
          <div
            onClick={() => openDeleteConfirmModal(row)}
            style={{ cursor: "pointer" }}
          >
            <Icon name="trash" size={24} fill="gray" />
          </div>
        </Tooltip>
      </Flex>
    ),
    positionActionsColumn: "last",
    enableRowSelection: true,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "24px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        {/* <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          leftSection={<IconDownload />}
          style={{ marginRight: "16px", backgroundColor: "#83BF6E" }}
          variant="filled"
        >
          Export All Rows
        </Button> */}
        <Button
          onClick={() => {
            table.setCreatingRow(true);
          }}
          leftSection={<IconPlus />}
        >
          Create New Keyword
        </Button>
        {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
          <>
            {/* <Button
              //only export selected rows
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              leftSection={<IconDownload />}
              style={{
                marginLeft: "16px",
                backgroundColor: "#8E59FF",
              }}
              variant="filled"
            >
              Export Selected Rows
            </Button> */}
            <Button
              //only export selected rows
              onClick={() =>
                handleDeleteSelectedRows(table.getSelectedRowModel())
              }
              leftSection={<IconTrash />}
              style={{
                marginLeft: "16px",
                backgroundColor: "#FF6A55",
              }}
              variant="filled"
            >
              Delete
            </Button>
          </>
        )}
      </Box>
    ),
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
