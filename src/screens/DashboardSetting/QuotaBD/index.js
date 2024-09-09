import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Text,
  TextInput,
} from "@mantine/core";
import { filter, find, map, sumBy, toNumber } from "lodash";
import classes from "./MyTable.module.css";
import { LOCAL_STORAGE_KEY } from "../../../constant";
import { IconStack } from "@tabler/icons-react";

import { dashboardServices } from "../../../services";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

const QuotaBD = ({
  tableData,
  query,
  loadingFetchDashboardSettings,
  setTrigger,
  sorting,
  setSorting,
  defaultQuota
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
    setData(defaultQuota);
    setPayloads(tableData);
  }, [tableData, defaultQuota]);

  const handleUpdate = async ({ uid, data, isTrigger = false }) => {
    await dashboardServices.updateDefaultDemandQuota({
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
          }
        }
      },
      {
        accessorKey: "team",
        header: "Team OP",
        size: 50,
        enableEditing: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells"],
          }
        },
        enableSorting: false,
      },
      {
        accessorKey: "quota",
        header: "Quota",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"]
        },
        enableSorting: false,
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const payload = find(data, (item) => item.team === opTeam);
          return (
            <Text
              rightSection={<IconStack />}
            >{payload?.numOfMember * 8 * 5}</Text>
          )
        },
      },
      {
        accessorKey: "BD1",
        header: "BD1",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"]
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const bdTeam = "BD1";
          const payload = find(payloads, (item) => item.team === opTeam && item.partnerTeam === bdTeam);
          const bdQuotas = filter(payloads, (item) => item.team === opTeam);
          const opPayload = find(data, (item) => item.team === opTeam);
          const quota = opPayload?.numOfMember * 8 * 5 || 0;
          const totalQuotas = sumBy(bdQuotas, "quota") || 0;
          return (
            <TextInput
              rightSection={<IconStack />}
              value={payload?.quota}
              error={totalQuotas > quota ? true : false}
              onChange={(event) => {
                const newPayloads = payloads.map((item) => {
                  if (item.team === opTeam && item.partnerTeam === bdTeam) {
                    return {
                      ...item,
                      quota: toNumber(event.target.value),
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                handleUpdate({
                  uid: payload?.uid,
                  data: {
                    quota: toNumber(event.target.value),
                  }
                })
              }}
            />
          )
        },
      },
      {
        accessorKey: "BD2",
        header: "BD2",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"]
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const bdTeam = "BD2";
          const payload = find(payloads, (item) => item.team === opTeam && item.partnerTeam === bdTeam);
          const bdQuotas = filter(payloads, (item) => item.team === opTeam);
          const opPayload = find(data, (item) => item.team === opTeam);
          const quota = opPayload?.numOfMember * 8 * 5;
          const totalQuotas = sumBy(bdQuotas, "quota");
          return (
            <TextInput
              rightSection={<IconStack />}
              value={payload?.quota}
              error={totalQuotas > quota ? true : false}
              onChange={(event) => {
                const newPayloads = payloads.map((item) => {
                  if (item.team === opTeam && item.partnerTeam === bdTeam) {
                    return {
                      ...item,
                      quota: toNumber(event.target.value),
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                handleUpdate({
                  uid: payload?.uid,
                  data: {
                    quota: toNumber(event.target.value),
                  }
                })
              }}
            />
          )
        },
      },
      {
        accessorKey: "BD3",
        header: "BD3",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"]
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const bdTeam = "BD3";
          const payload = find(payloads, (item) => item.team === opTeam && item.partnerTeam === bdTeam);
          const bdQuotas = filter(payloads, (item) => item.team === opTeam);
          const opPayload = find(data, (item) => item.team === opTeam);
          const quota = opPayload?.numOfMember * 8 * 5;
          const totalQuotas = sumBy(bdQuotas, "quota");
          return (
            <TextInput
              rightSection={<IconStack />}
              value={payload?.quota}
              error={totalQuotas > quota ? true : false}
              onChange={(event) => {
                const newPayloads = payloads.map((item) => {
                  if (item.team === opTeam && item.partnerTeam === bdTeam) {
                    return {
                      ...item,
                      quota: toNumber(event.target.value),
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                handleUpdate({
                  uid: payload?.uid,
                  data: {
                    quota: toNumber(event.target.value),
                  }
                })
              }}
            />
          )
        },
      },
      {
        accessorKey: "AMZ",
        header: "AMZ",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"]
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const bdTeam = "AMZ";
          const payload = find(payloads, (item) => item.team === opTeam && item.partnerTeam === bdTeam);
          const bdQuotas = filter(payloads, (item) => item.team === opTeam);
          const opPayload = find(data, (item) => item.team === opTeam);
          const quota = opPayload?.numOfMember * 8 * 5;
          const totalQuotas = sumBy(bdQuotas, "quota");
          return (
            <TextInput
              rightSection={<IconStack />}
              value={payload?.quota}
              error={totalQuotas > quota ? true : false}
              onChange={(event) => {
                const newPayloads = payloads.map((item) => {
                  if (item.team === opTeam && item.partnerTeam === bdTeam) {
                    return {
                      ...item,
                      quota: toNumber(event.target.value),
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                handleUpdate({
                  uid: payload?.uid,
                  data: {
                    quota: toNumber(event.target.value),
                  }
                })
              }}
            />
          )
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
    enableTopToolbar: false,
    enableRowSelection: false,
    enableFilters: false,
    enableColumnActions: false,
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: {
      className: classes["disable-hover"],
    }, // Apply the custom class here },
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
        cursor: "pointer", //you might want to change the cursor too when adding an onClick
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

export default QuotaBD;
