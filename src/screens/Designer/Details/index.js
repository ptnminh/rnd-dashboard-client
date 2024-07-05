import React, { useState, useMemo, useEffect } from "react";
import {
  MantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
  useMantineReactTable,
} from "mantine-react-table";
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
import Icon from "../../../components/Icon";
import { keywordServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import { compact, filter, includes, isEmpty, map, split, uniq } from "lodash";
import { useEdit } from "../../../hooks";
import { IconSearch } from "@tabler/icons-react";
import DatePicker from "react-datepicker";
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

const KeywordTable = ({ productLines, name }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(productLines || []);
  const [templateName, setTemplateName] = useState(name);
  const [rowSelection, setRowSelection] = useState({});
  useEffect(() => {
    setData(productLines);
    setTemplateName(name);
  }, [productLines, templateName]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "uid",
        mantineTableHeadCellProps: {
          align: "right",
        },
        size: 50, //small column
        header: "No",
        Header: ({ column }) => (
          <div style={{ backgroundColor: "#E0EAFF", padding: "20px" }}>
            {column.columnDef.header}
          </div>
        ),
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
      {
        accessorKey: "date",
        header: "DATE",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "batch",
        header: "BATCH",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "imageRef",
        header: "SKU",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "briefType",
        header: "Loại Brief",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "rndValue",
        header: "VALUE",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "size",
        header: "SIZE",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "size",
        header: "TEAM",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "rnd",
        header: "RND",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "designer",
        header: "DESIGNER",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "designLink",
        header: "LINK DESIGN",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",
              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "DONE",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
          </div>
        ),
      },
      {
        accessorKey: "priority",
        header: "DONE",
        Header: ({ column }) => (
          <div
            style={{
              backgroundColor: "#E0EAFF",

              width: "100%",
            }}
          >
            {column.columnDef.header}
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
    // enableEditing: true,
    enablePagination: true,
    getRowId: (row) => row.id,
    enableFilters: false,
    enableColumnActions: false,
    mantineTableContainerProps: {
      sx: {
        minHeight: "500px",
        borderRadius: "20px",
      },
    },
    mantineTableHeadCellProps: {
      sx: {
        backgroundColor: "#3FA433", // Change this to your desired background color
        color: "#ffffff", // Optional: change the text color if needed
        fontSize: "20px",
      },
    },
    enableSorting: false,
    mantineTableProps: { striped: "even", borderColor: "#3FA433" },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateKeyword,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveKeyword,
    enableDensityToggle: false,
    positionActionsColumn: "last",
    renderTopToolbar: ({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("deactivating " + row.getValue("name"));
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("activating " + row.getValue("name"));
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("contact " + row.getValue("name"));
        });
      };

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
            />
            <Select
              placeholder="Loại Brief"
              data={["React", "Angular", "Vue", "Svelte"]}
              styles={{
                input: {
                  width: "150px",
                },
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
            />
            <Select
              placeholder="Team"
              data={["BD1", "BD2", "BD3"]}
              styles={{
                input: {
                  width: "100px",
                },
              }}
            />
            <Select
              placeholder="RND"
              data={["Thảo Thảo", "Lảo Đảo"]}
              styles={{
                input: {
                  width: "150px",
                },
              }}
            />
            <Select
              placeholder="Designer"
              data={["Lợi Lợi", "Hợi Hợi"]}
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
