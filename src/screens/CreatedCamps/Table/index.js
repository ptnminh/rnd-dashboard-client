import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Badge, Button, Flex, Image, Select, TextInput } from "@mantine/core";
import { ceil, keys } from "lodash";
import { IconSearch, IconFilterOff } from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import { DateRangePicker } from "rsuite";
import moment from "moment-timezone";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
} from "../../../utils";
import { rndServices } from "../../../services";

const CampaignsTable = ({
  campaigns,
  name,
  query,
  setQuery,
  loadingFetchBrief,
  setTrigger,
  sorting,
  setSorting,
  accounts,
  campsPayload,
  sampleCampaigns,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(campaigns || []);
  const [templateName, setTemplateName] = useState(name);
  useEffect(() => {
    setData(campaigns);
    setTemplateName(name);
  }, [campaigns, templateName]);

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
        size: 50,
        header: "NO",
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "date",
        accessorFn: (row) =>
          moment(row?.createdAt).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"),
        header: "DATE",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: true,
      },
      {
        accessorKey: "campaignName",
        header: "CAMP",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
      },
      {
        accessorKey: "adsName",
        header: "AD",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
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
          >
            <Badge color="blue" variant="filled">
              {" "}
              <u>{row?.original?.briefInfo?.sku}</u>{" "}
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
              row?.original?.briefInfo?.designInfo?.thumbLink ||
              "/images/content/not_found_2.jpg"
            }
            height={100}
            fit="contain"
          />
        ),
      },
      {
        accessorKey: "value",
        header: "VALUE",
        size: 100,
        enableEditing: false,
        enableSorting: true,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          let color = null;
          switch (row?.original?.briefInfo?.value?.rnd) {
            case 1:
              color = "#cfcfcf";
              break;
            case 2:
              color = "yellow";
              break;
            case 3:
              color = "green";
              break;
            case 4:
              color = "#38761C";
              break;
            default:
              break;
          }
          return color ? (
            <Badge color={color} variant="filled">
              {CONVERT_NUMBER_TO_STATUS[row?.original?.briefInfo?.value?.rnd]}
            </Badge>
          ) : (
            <span>
              {CONVERT_NUMBER_TO_STATUS[row?.original?.briefInfo?.value?.rnd]}
            </span>
          );
        },
      },
      {
        accessorKey: "rndTeam",
        accessorFn: (row) => row?.briefInfo?.rndTeam,
        header: "TEAM",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "linkCamp",
        header: "LINK CAMP",
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        size: 100,
        enableSorting: false,
        enableEditing: false,
        Cell: ({ row }) => (
          <a
            style={{
              cursor: "pointer",
            }}
            target="_blank"
            href={row?.original?.linkAds}
          >
            <Badge color="blue" variant="filled">
              <u>Link</u>{" "}
            </Badge>
          </a>
        ),
      },
      {
        id: "dailyBudget",
        header: "BUDGET",
        accessorFn: (row) =>
          `${ceil(row?.attribute?.campaignData?.dailyBudget / 100)}💲`,
        enableEditing: false,
        enableSorting: true,
        size: 100,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
    ],
    [validationErrors, accounts, sampleCampaigns, campaigns, campsPayload]
  );

  const [searchSKU, setSearchSKU] = useState("");
  const [searchCampaignName, setSearchCampaignName] = useState("");
  const [searchAdName, setSearchAdName] = useState("");
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
    mantinePaperProps: {
      style: { "--mrt-striped-row-background-color": "#eff0f1" },
    },
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: { striped: "even" },
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
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
            <TextInput
              placeholder="Camp Name"
              size="sm"
              width="100px"
              leftSection={
                <span
                  onClick={() => {
                    setQuery({ ...query, campaignName: searchCampaignName });
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
                  width: "150px",
                },
              }}
              value={searchCampaignName}
              onChange={(e) => setSearchCampaignName(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setQuery({ ...query, campaignName: searchCampaignName });
                }
              }}
            />
            <TextInput
              placeholder="Ad Name"
              size="sm"
              width="100px"
              leftSection={
                <span
                  onClick={() => {
                    setQuery({ ...query, adsName: searchAdName });
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
                  width: "150px",
                },
              }}
              value={searchAdName}
              onChange={(e) => setSearchAdName(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setQuery({ ...query, adsName: searchAdName });
                }
              }}
            />
            <Select
              placeholder="Value"
              data={keys(CONVERT_STATUS_TO_NUMBER)}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.valueName}
              onChange={(value) =>
                setQuery({
                  ...query,
                  value: CONVERT_STATUS_TO_NUMBER[value],
                  valueName: value,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  value: null,
                  valueName: null,
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
                  startDate: moment(value[0]).format("YYYY-MM-DD"),
                  endDate: moment(value[1]).format("YYYY-MM-DD"),
                })
              }
              onClean={() => {
                setQuery({
                  ...query,
                  dateValue: null,
                  startDate: null,
                  endDate: null,
                });
              }}
              onShortcutClick={(shortcut) => {
                setQuery({
                  ...query,
                  dateValue: shortcut.value,
                  startDate: moment(shortcut.value[0]).format("YYYY-MM-DD"),
                  endDate: moment(shortcut.value[1]).format("YYYY-MM-DD"),
                });
              }}
            />
            <Button
              onClick={() => {
                setQuery({
                  startDate: null,
                  endDate: null,
                  valueName: null,
                  rndTeam: null,
                  rnd: null,
                  epm: null,
                  sizeValue: null,
                  rndName: null,
                  statusValue: null,
                  dateValue: null,
                });
                setSearchSKU("");
                setSearchCampaignName("");
                setSearchAdName("");
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
    mantineTableBodyCellProps: ({ row, cell }) => ({
      className: classes["body-cells"],
      onClick: () => {
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

export default CampaignsTable;
