import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Group, Text, TextInput } from "@mantine/core";
import { find, isEmpty, map, toNumber } from "lodash";
import classes from "./MyTable.module.css";
import { LOCAL_STORAGE_KEY } from "../../../constant";
import { IconUser } from "@tabler/icons-react";

import { dashboardServices } from "../../../services";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

const QuotaOP = ({
  tableData,
  query,
  loadingFetchDashboardSettings,
  setTrigger,
  sorting,
  setSorting,
}) => {
  let [permissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  const [payloads, setPayloads] = useState([]);
  permissions = map(permissions, "name");
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(tableData || []);
  useEffect(() => {
    setData(tableData);
    setPayloads(tableData);
  }, [tableData]);

  const handleUpdate = async ({ uid, data, isTrigger = false }) => {
    await dashboardServices.updateDefaultQuota({
      uid,
      data,
    });
    if (isTrigger) {
      setTrigger(true);
    }
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "no",
        header: "No",
        size: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells"],
          };
        },
      },
      {
        accessorKey: "team",
        header: "Team OP",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells"],
          };
        },
        enableSorting: false,
      },
      {
        accessorKey: "option",
        header: "Số member",
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        size: 150,
        enableEditing: false,
        enableSorting: false,
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(payloads, (item) => item.uid === uid);
          return (
            <TextInput
              value={payload?.numOfMember}
              rightSection={<IconUser />}
              onChange={(event) => {
                const newPayloads = payloads.map((item) => {
                  if (item.uid === uid) {
                    return {
                      ...item,
                      numOfMember: !isEmpty(event.target.value)
                        ? toNumber(event.target.value)
                        : 0,
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                handleUpdate({
                  uid,
                  data: {
                    numOfMember: !isEmpty(event.target.value)
                      ? toNumber(event.target.value)
                      : 0,
                  },
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "quota",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        enableSorting: false,
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(payloads, (item) => item.uid === uid);
          return (
            <Text rightSection={<IconUser />}>
              {payload?.numOfMember * 8 * 5}
            </Text>
          );
        },
        Header: () => {
          return (
            <Group
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Text
                fw={700}
                style={{
                  fontSize: "14px",
                }}
              >
                Quota
              </Text>
              <Text
                fw={300}
                size="sx"
                style={{
                  color: "#8c939d",
                  fontSize: "12px",
                }}
              >
                (member x8 x5)
              </Text>
            </Group>
          );
        },
      },
    ],
    [validationErrors, tableData, query, payloads]
  );

  const table = useMantineReactTable({
    columns,
    data,
    editDisplayMode: "cell",
    enableEditing: true,
    enablePagination: false,
    getRowId: (row) => row.id,
    enableRowSelection: false,
    enableFilters: false,
    enableColumnActions: false,
    enableTopToolbar: false,
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: {
      className: classes["disable-hover"],
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    enableDensityToggle: false,
    state: {
      showProgressBars: loadingFetchDashboardSettings,
      sorting,
      hoveredColumn: false,
      hoveredRow: false,
    },
    mantineTableBodyCellProps: () => ({
      className: classes["body-cells"],
      sx: {
        cursor: "pointer",
      },
    }),
    onSortingChange: setSorting,
  });

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
};

export default QuotaOP;
