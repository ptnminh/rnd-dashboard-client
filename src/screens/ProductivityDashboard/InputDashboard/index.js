import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Button, NumberInput, Text, TextInput } from "@mantine/core";
import { filter, find, includes, map, max, sumBy, toNumber } from "lodash";
import classes from "./MyTable.module.css";
import { IconCheck } from "@tabler/icons-react";

import { dashboardServices } from "../../../services";
import { OGZ_BD_TEAMS, OP_TEAMS } from "../../../constant";

const InputDashboard = ({
  tableData,
  query,
  loadingFetchDashboardSettings,
  setTrigger,
  sorting,
  setSorting,
}) => {
  const [uidOnChange, setUidOnChange] = useState(null);
  const [payloads, setPayloads] = useState([]);
  const [data, setData] = useState(tableData || []);
  useEffect(() => {
    const transformedData = map(tableData, (item) => {
      return {
        ...item,
        highestQuota: max(map(item.distributions, "quota")) || 0,
      };
    });
    setData(transformedData);
    setPayloads(transformedData);
  }, [tableData]);

  const handleUpdate = async ({ uid, data, isTrigger = false }) => {
    await dashboardServices.updateQuota({
      uid,
      data,
    });
    if (isTrigger) {
      setTrigger(true);
    }
  };
  const calcQuotas = ({ opTeam, payload, bdTeam }) => {
    const distributions = payload?.distributions || [];
    const distribution = find(
      distributions,
      (dist) => dist.partnerTeam === bdTeam
    );
    const bdQuotas = [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3].includes(opTeam)
      ? distribution?.quota || 0
      : sumBy(distributions, "quota") || 0;
    return bdQuotas;
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "team",
        size: 20,
        enableEditing: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          return (
            <Text
              fw={700}
              style={{
                fontSize: "14px",
              }}
            >
              {row.original?.team}
            </Text>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "quota",
        header: "Quota",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: { className: classes["quota-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const uid = row.original?.uid;
          const payload = find(payloads, (item) => item.uid === uid);
          const currentQuota = payload?.defaultQuota;
          const quota = payload?.quota;
          return (
            <NumberInput
              value={quota}
              defaultValue={currentQuota}
              error={currentQuota < payload?.quota ? true : false}
              disabled={payload?.isConfirm}
              onChange={(value) => {
                const newPayloads = data.map((item) => {
                  if (item.uid === uid) {
                    return {
                      ...item,
                      quota: toNumber(value),
                    };
                  }
                  return item;
                });
                setData(newPayloads);
                handleUpdate({
                  uid,
                  data: {
                    quota: toNumber(value),
                  },
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "button",
        header: "CONFIRM",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: { className: classes["quota-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const uid = row.original?.uid;
          const payload = find(payloads, (item) => item.uid === uid);
          return (
            <Button
              color="#3751D7"
              disabled={payload?.isConfirm}
              size="md"
              onClick={() => {
                handleUpdate({
                  uid,
                  data: {
                    isConfirm: true,
                  },
                  isTrigger: true,
                });
              }}
            >
              Confirm
            </Button>
          );
        },
      },
      {
        accessorKey: OGZ_BD_TEAMS.BD1,
        header: OGZ_BD_TEAMS.BD1,
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const uid = row.original?.uid;
          const bdTeam = OGZ_BD_TEAMS.BD1;
          const payload = find(payloads, (item) => item.uid === uid);
          const opTeam = row.original?.team;
          const isRender = opTeam !== OP_TEAMS.DS2 && opTeam !== OP_TEAMS.DS3;
          const distributions = payload?.distributions || [];
          const distribution = find(
            distributions,
            (dist) => dist.partnerTeam === bdTeam
          );
          const bdQuota = distribution?.quota || 0;
          const bdQuotas = [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3].includes(
            opTeam
          )
            ? distribution?.quota || 0
            : sumBy(distributions, "quota") || 0;
          const opQuota = payload?.quota || payload?.defaultQuota || 0;
          const isError =
            bdQuotas > opQuota && uidOnChange === OGZ_BD_TEAMS.BD1;
          return isRender ? (
            <NumberInput
              rightSection={
                <IconCheck color={isError ? "#F76964" : "#4E83FD"} />
              }
              value={bdQuota}
              error={isError}
              onChange={(value) => {
                let distributionsPayload = [];
                const newPayloads = payloads.map((item) => {
                  if (item.uid === uid) {
                    const newDistributions = item.distributions.map((dist) => {
                      if (dist.partnerTeam === bdTeam) {
                        return {
                          ...dist,
                          quota: toNumber(value),
                        };
                      }
                      return dist;
                    });
                    distributionsPayload = newDistributions;
                    return {
                      ...item,
                      distributions: newDistributions,
                    };
                  }
                  return item;
                });
                setUidOnChange(distribution?.partnerTeam);
                setPayloads(newPayloads);
                setData(newPayloads);
                const newPayload = find(
                  newPayloads,
                  (item) => item.uid === uid
                );
                const newBDQuotas = calcQuotas({
                  bdTeam,
                  payload: newPayload,
                  opTeam,
                });
                if (newBDQuotas <= opQuota) {
                  handleUpdate({
                    uid: payload?.uid,
                    data: {
                      distributions: distributionsPayload,
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
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const uid = row.original?.uid;
          const bdTeam = OGZ_BD_TEAMS.BD2;
          const payload = find(payloads, (item) => item.uid === uid);
          const opTeam = row.original?.team;
          const isRender = opTeam !== OP_TEAMS.DS1 && opTeam !== OP_TEAMS.DS3;
          const highestQuota = row.original?.highestQuota;

          const distributions = payload?.distributions || [];
          const distribution = find(
            distributions,
            (dist) => dist.partnerTeam === bdTeam
          );
          const bdQuota = distribution?.quota || 0;
          const opQuota = payload?.quota || payload?.defaultQuota || 0;
          const bdQuotas = [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3].includes(
            opTeam
          )
            ? distribution?.quota || 0
            : sumBy(distributions, "quota") || 0;
          const isError =
            bdQuotas > opQuota && uidOnChange === OGZ_BD_TEAMS.BD2;
          return isRender ? (
            <NumberInput
              rightSection={<IconCheck color="#4E83FD" />}
              value={bdQuota}
              error={isError}
              onChange={(value) => {
                let distributionsPayload = [];
                const newPayloads = payloads.map((item) => {
                  if (item.uid === uid) {
                    const newDistributions = item.distributions.map((dist) => {
                      if (dist.partnerTeam === bdTeam) {
                        return {
                          ...dist,
                          quota: toNumber(value),
                        };
                      }
                      return dist;
                    });
                    distributionsPayload = newDistributions;
                    return {
                      ...item,
                      distributions: newDistributions,
                    };
                  }
                  return item;
                });
                setUidOnChange(distribution?.partnerTeam);
                setPayloads(newPayloads);
                setData(newPayloads);
                const newPayload = find(
                  newPayloads,
                  (item) => item.uid === uid
                );
                const newBDQuotas = calcQuotas({
                  bdTeam,
                  payload: newPayload,
                  opTeam,
                });
                if (newBDQuotas <= opQuota) {
                  handleUpdate({
                    uid: payload?.uid,
                    data: {
                      distributions: distributionsPayload,
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
          const uid = row.original?.uid;
          const bdTeam = OGZ_BD_TEAMS.BD3;
          const payload = find(payloads, (item) => item.uid === uid);
          const opTeam = row.original?.team;
          const isRender = opTeam !== OP_TEAMS.DS2 && opTeam !== OP_TEAMS.DS1;
          const highestQuota = row.original?.highestQuota;

          const distributions = payload?.distributions || [];
          const distribution = find(
            distributions,
            (dist) => dist.partnerTeam === bdTeam
          );
          const bdQuotas = [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3].includes(
            opTeam
          )
            ? distribution?.quota || 0
            : sumBy(distributions, "quota") || 0;
          const bdQuota = distribution?.quota || 0;
          const opQuota = payload?.quota || payload?.defaultQuota || 0;
          const isError =
            bdQuotas > opQuota && uidOnChange === OGZ_BD_TEAMS.BD3;

          return isRender ? (
            <NumberInput
              rightSection={<IconCheck color="#4E83FD" />}
              value={bdQuota}
              error={isError}
              onChange={(value) => {
                let distributionsPayload = [];
                const newPayloads = payloads.map((item) => {
                  if (item.uid === uid) {
                    const newDistributions = item.distributions.map((dist) => {
                      if (dist.partnerTeam === bdTeam) {
                        return {
                          ...dist,
                          quota: toNumber(value),
                        };
                      }
                      return dist;
                    });
                    distributionsPayload = newDistributions;
                    return {
                      ...item,
                      distributions: newDistributions,
                    };
                  }
                  return item;
                });
                setUidOnChange(distribution?.partnerTeam);
                setPayloads(newPayloads);
                setData(newPayloads);
                const newPayload = find(
                  newPayloads,
                  (item) => item.uid === uid
                );
                const newBDQuotas = calcQuotas({
                  bdTeam,
                  payload: newPayload,
                  opTeam,
                });
                if (newBDQuotas <= opQuota) {
                  handleUpdate({
                    uid: payload?.uid,
                    data: {
                      distributions: distributionsPayload,
                    },
                  });
                }
              }}
            />
          ) : null;
        },
      },
      {
        accessorKey: "AMZ",
        header: "AMZ",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: {
          className: classes["body-cells"],
        },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        enableSorting: false,
        Cell: ({ row }) => {
          const uid = row.original?.uid;
          const bdTeam = OGZ_BD_TEAMS.AMZ;
          const payload = find(payloads, (item) => item.uid === uid);
          const opTeam = row.original?.team;
          const isRender =
            opTeam !== OP_TEAMS.DS1 &&
            opTeam !== OP_TEAMS.DS2 &&
            opTeam !== OP_TEAMS.DS3 &&
            opTeam !== OP_TEAMS.ARTIST &&
            opTeam !== OP_TEAMS.EPM;
          const highestQuota = row.original?.highestQuota;

          const distributions = payload?.distributions || [];
          const distribution = find(
            distributions,
            (dist) => dist.partnerTeam === bdTeam
          );
          const bdQuotas = [OP_TEAMS.DS1, OP_TEAMS.DS2, OP_TEAMS.DS3].includes(
            opTeam
          )
            ? distribution?.quota || 0
            : sumBy(distributions, "quota") || 0;
          const bdQuota = distribution?.quota || 0;
          const opQuota = payload?.quota || payload?.defaultQuota || 0;
          const isError =
            bdQuotas > opQuota && uidOnChange === OGZ_BD_TEAMS.AMZ;

          return isRender ? (
            <NumberInput
              rightSection={<IconCheck color="#4E83FD" />}
              value={bdQuota}
              error={isError}
              onChange={(value) => {
                let distributionsPayload = [];
                const newPayloads = payloads.map((item) => {
                  if (item.uid === uid) {
                    const newDistributions = item.distributions.map((dist) => {
                      if (dist.partnerTeam === bdTeam) {
                        return {
                          ...dist,
                          quota: toNumber(value),
                        };
                      }
                      return dist;
                    });
                    distributionsPayload = newDistributions;
                    return {
                      ...item,
                      distributions: newDistributions,
                    };
                  }
                  return item;
                });
                setUidOnChange(distribution?.partnerTeam);
                setPayloads(newPayloads);
                setData(newPayloads);
                const newPayload = find(
                  newPayloads,
                  (item) => item.uid === uid
                );
                const newBDQuotas = calcQuotas({
                  bdTeam,
                  payload: newPayload,
                  opTeam,
                });
                if (newBDQuotas <= opQuota) {
                  handleUpdate({
                    uid: payload?.uid,
                    data: {
                      distributions: distributionsPayload,
                    },
                  });
                }
              }}
            />
          ) : null;
        },
      },
    ],
    [query, payloads, data, uidOnChange]
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

export default InputDashboard;
