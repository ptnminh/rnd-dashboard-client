import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { NumberInput, Text } from "@mantine/core";
import {
  filter,
  find,
  groupBy,
  includes,
  keys,
  map,
  max,
  sumBy,
  toNumber,
} from "lodash";
import classes from "./MyTable.module.css";
import { IconStack } from "@tabler/icons-react";

import { dashboardServices } from "../../../services";
import { OGZ_BD_TEAMS, OP_TEAMS } from "../../../constant";

const QuotaBD = ({
  tableData,
  query,
  loadingFetchDashboardSettings,
  setTrigger,
  sorting,
  setSorting,
  defaultQuota,
}) => {
  const [payloads, setPayloads] = useState([]);
  const [data, setData] = useState(tableData || []);
  const [uidOnChange, setUidOnChange] = useState(null);
  useEffect(() => {
    const groupByTeam = groupBy(tableData, "team");
    const teams = keys(groupByTeam);
    const teamData = map(teams, (team, index) => {
      const highestPartnerTeamQuotas = max(
        map(
          filter(tableData, (item) => item.team === team),
          "quota"
        )
      );
      return {
        id: index,
        team: team,
        ...(find(defaultQuota, (item) => item.team === team) || {}),
        no: index + 1,
        highestPartnerTeamQuotas,
      };
    });
    setData(teamData);
    setPayloads(tableData);
  }, [tableData]);

  const handleUpdate = async ({ uid, data, isTrigger = false }) => {
    await dashboardServices.updateDefaultDemandQuota({
      uid,
      data,
    });
    if (isTrigger) {
      setTrigger(true);
    }
  };
  const calcQuotas = ({ opTeam, payload, payloads }) => {
    const bdQuotas = !includes(
      [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3],
      opTeam
    )
      ? sumBy(
          filter(payloads, (item) => item.team === opTeam),
          "quota"
        ) || 0
      : payload?.quota;

    return bdQuotas;
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
        size: 50,
        enableEditing: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells"],
          };
        },
        enableSorting: false,
      },
      {
        accessorKey: "quota",
        header: "Quota",
        size: 120,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const payload = find(data, (item) => item.team === opTeam);
          return (
            <Text rightSection={<IconStack />}>
              {payload?.numOfMember * 8 * 5}
            </Text>
          );
        },
      },
      {
        accessorKey: OGZ_BD_TEAMS.BD1,
        header: OGZ_BD_TEAMS.BD1,
        size: 120,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const bdTeam = OGZ_BD_TEAMS.BD1;
          const isRender = opTeam !== OP_TEAMS.DS2 && opTeam !== OP_TEAMS.DS3;
          const payload = find(
            payloads,
            (item) => item.team === opTeam && item.partnerTeam === bdTeam
          );
          const bdQuotas = !includes(
            [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3],
            opTeam
          )
            ? sumBy(
                filter(payloads, (item) => item.team === opTeam),
                "quota"
              ) || 0
            : payload?.quota;
          const opPayload = find(data, (item) => item.team === opTeam);
          const opQuota = opPayload?.numOfMember * 8 * 5 || 0;
          const isError = bdQuotas > opQuota && uidOnChange === payload?.uid;
          return isRender ? (
            <NumberInput
              rightSection={<IconStack />}
              value={payload?.quota}
              error={isError}
              onChange={(value) => {
                const newPayloads = payloads.map((item) => {
                  if (item.team === opTeam && item.partnerTeam === bdTeam) {
                    return {
                      ...item,
                      quota: toNumber(value),
                    };
                  }
                  return item;
                });
                setUidOnChange(payload?.uid);
                setPayloads(newPayloads);
                const highestPartnerTeamQuotas = max(
                  map(
                    filter(newPayloads, (item) => item.team === opTeam),
                    "quota"
                  )
                );
                setData((prev) => {
                  return prev.map((item) => {
                    if (item.team === opTeam) {
                      return {
                        ...item,
                        highestPartnerTeamQuotas,
                      };
                    }
                    return item;
                  });
                });
                const newPayload = find(
                  newPayloads,
                  (item) => item.team === opTeam && item.partnerTeam === bdTeam
                );
                const newBDQuotas = calcQuotas({
                  opTeam,
                  payload: newPayload,
                  payloads: newPayloads,
                });
                if (newBDQuotas <= opQuota) {
                  handleUpdate({
                    uid: payload?.uid,
                    data: {
                      quota: toNumber(value),
                    },
                  });
                }
              }}
            />
          ) : null;
        },
      },
      {
        accessorKey: OGZ_BD_TEAMS.BD2,
        header: OGZ_BD_TEAMS.BD2,
        size: 120,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const bdTeam = OGZ_BD_TEAMS.BD2;
          const payload = find(
            payloads,
            (item) => item.team === opTeam && item.partnerTeam === bdTeam
          );
          const isRender = opTeam !== OP_TEAMS.DS1 && opTeam !== OP_TEAMS.DS3;
          const bdQuotas = !includes(
            [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3],
            opTeam
          )
            ? sumBy(
                filter(payloads, (item) => item.team === opTeam),
                "quota"
              ) || 0
            : payload?.quota;
          const opPayload = find(data, (item) => item.team === opTeam);
          const opQuota = opPayload?.numOfMember * 8 * 5 || 0;
          const isError = bdQuotas > opQuota && uidOnChange === payload?.uid;
          return isRender ? (
            <NumberInput
              rightSection={<IconStack />}
              value={payload?.quota}
              error={isError}
              onChange={(value) => {
                const newPayloads = payloads.map((item) => {
                  if (item.team === opTeam && item.partnerTeam === bdTeam) {
                    return {
                      ...item,
                      quota: toNumber(value),
                    };
                  }
                  return item;
                });
                setUidOnChange(payload?.uid);
                setPayloads(newPayloads);
                const highestPartnerTeamQuotas = max(
                  map(
                    filter(newPayloads, (item) => item.team === opTeam),
                    "quota"
                  )
                );
                setData((prev) => {
                  return prev.map((item) => {
                    if (item.team === opTeam) {
                      return {
                        ...item,
                        highestPartnerTeamQuotas,
                      };
                    }
                    return item;
                  });
                });
                const newPayload = find(
                  newPayloads,
                  (item) => item.team === opTeam && item.partnerTeam === bdTeam
                );
                const newBDQuotas = calcQuotas({
                  opTeam,
                  payload: newPayload,
                  payloads: newPayloads,
                });
                if (newBDQuotas <= opQuota) {
                  handleUpdate({
                    uid: payload?.uid,
                    data: {
                      quota: toNumber(value),
                    },
                  });
                }
              }}
            />
          ) : null;
        },
      },
      {
        accessorKey: OGZ_BD_TEAMS.BD3,
        header: OGZ_BD_TEAMS.BD3,
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const bdTeam = OGZ_BD_TEAMS.BD3;
          const payload = find(
            payloads,
            (item) => item.team === opTeam && item.partnerTeam === bdTeam
          );
          const isRender = opTeam !== OP_TEAMS.DS2 && opTeam !== OP_TEAMS.DS1;
          const bdQuotas = !includes(
            [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3],
            opTeam
          )
            ? sumBy(
                filter(payloads, (item) => item.team === opTeam),
                "quota"
              ) || 0
            : payload?.quota;
          const opPayload = find(data, (item) => item.team === opTeam);
          const opQuota = opPayload?.numOfMember * 8 * 5 || 0;
          const isError = bdQuotas > opQuota && uidOnChange === payload?.uid;
          return isRender ? (
            <NumberInput
              rightSection={<IconStack />}
              value={payload?.quota}
              error={isError}
              onChange={(value) => {
                const newPayloads = payloads.map((item) => {
                  if (item.team === opTeam && item.partnerTeam === bdTeam) {
                    return {
                      ...item,
                      quota: toNumber(value),
                    };
                  }
                  return item;
                });
                setUidOnChange(payload?.uid);
                setPayloads(newPayloads);
                const highestPartnerTeamQuotas = max(
                  map(
                    filter(newPayloads, (item) => item.team === opTeam),
                    "quota"
                  )
                );
                setData((prev) => {
                  return prev.map((item) => {
                    if (item.team === opTeam) {
                      return {
                        ...item,
                        highestPartnerTeamQuotas,
                      };
                    }
                    return item;
                  });
                });
                const newPayload = find(
                  newPayloads,
                  (item) => item.team === opTeam && item.partnerTeam === bdTeam
                );
                const newBDQuotas = calcQuotas({
                  opTeam,
                  payload: newPayload,
                  payloads: newPayloads,
                });
                if (newBDQuotas <= opQuota) {
                  handleUpdate({
                    uid: payload?.uid,
                    data: {
                      quota: toNumber(value),
                    },
                  });
                }
              }}
            />
          ) : null;
        },
      },
      {
        accessorKey: OGZ_BD_TEAMS.AMZ,
        header: OGZ_BD_TEAMS.AMZ,
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const opTeam = row.original?.team;
          const bdTeam = OGZ_BD_TEAMS.AMZ;
          const payload = find(
            payloads,
            (item) => item.team === opTeam && item.partnerTeam === bdTeam
          );
          const isRender =
            opTeam !== OP_TEAMS.DS1 &&
            opTeam !== OP_TEAMS.DS2 &&
            opTeam !== OP_TEAMS.DS3 &&
            opTeam !== OP_TEAMS.ARTIST &&
            opTeam !== OP_TEAMS.EPM;
          const bdQuotas = !includes(
            [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3],
            opTeam
          )
            ? sumBy(
                filter(payloads, (item) => item.team === opTeam),
                "quota"
              ) || 0
            : payload?.quota;
          const opPayload = find(data, (item) => item.team === opTeam);
          const opQuota = opPayload?.numOfMember * 8 * 5 || 0;
          const isError = bdQuotas > opQuota && uidOnChange === payload?.uid;
          return isRender ? (
            <NumberInput
              rightSection={<IconStack />}
              value={payload?.quota}
              error={isError}
              onChange={(value) => {
                setUidOnChange(payload?.uid);
                const newPayloads = payloads.map((item) => {
                  if (item.team === opTeam && item.partnerTeam === bdTeam) {
                    return {
                      ...item,
                      quota: toNumber(value),
                    };
                  }
                  return item;
                });
                setPayloads(newPayloads);
                const highestPartnerTeamQuotas = max(
                  map(
                    filter(newPayloads, (item) => item.team === opTeam),
                    "quota"
                  )
                );
                setData((prev) => {
                  return prev.map((item) => {
                    if (item.team === opTeam) {
                      return {
                        ...item,
                        highestPartnerTeamQuotas,
                      };
                    }
                    return item;
                  });
                });
                const newPayload = find(
                  newPayloads,
                  (item) => item.team === opTeam && item.partnerTeam === bdTeam
                );
                const newBDQuotas = calcQuotas({
                  opTeam,
                  payload: newPayload,
                  payloads: newPayloads,
                });
                if (newBDQuotas <= opQuota) {
                  handleUpdate({
                    uid: payload?.uid,
                    data: {
                      quota: toNumber(value),
                    },
                  });
                }
              }}
            />
          ) : null;
        },
      },
    ],
    [tableData, query, payloads]
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
    },
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

export default QuotaBD;
