import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Autocomplete,
  Badge,
  Button,
  Flex,
  Group,
  Image,
  rem,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import Checkbox from "../../../components/Checkbox";
import {
  compact,
  filter,
  find,
  flatMap,
  isEmpty,
  keys,
  map,
  toNumber,
} from "lodash";
import {
  IconSearch,
  IconFilterOff,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import { DateRangePicker } from "rsuite";
import { CREATE_CAMP_FLOWS } from "../../../constant";
import moment from "moment-timezone";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
} from "../../../utils";
import { rndServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import { useDisclosure } from "@mantine/hooks";

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
  setCampsPayload,
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
        accessorKey: "postName",
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
              <u>{row.original.sku}</u>{" "}
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
              row?.original?.designInfo?.thumbLink ||
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
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          let color = null;
          switch (row?.original?.value?.rnd) {
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
              {CONVERT_NUMBER_TO_STATUS[row?.original?.value?.rnd]}
            </Badge>
          ) : (
            <span>{CONVERT_NUMBER_TO_STATUS[row?.original?.value?.rnd]}</span>
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
      },
      {
        accessorKey: "linkCamp",
        header: "LINK CAMP",
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
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
          >
            <Badge color="blue" variant="filled">
              {" "}
              <u>Link</u>{" "}
            </Badge>
          </a>
        ),
      },
      {
        id: "budget",
        accessorFn: (row) => 0,
        header: "BUDGET",
        enableEditing: false,
        enableSorting: false,
        size: 130,
        mantineTableHeadCellProps: { className: classes["linkDesign"] },
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          return (
            <Text
              placeholder="Budget"
              type="number"
              size="sm"
              styles={{
                input: {
                  width: "100px",
                },
              }}
              leftSection={
                <IconCurrencyDollar
                  style={{ width: rem(16), height: rem(16) }}
                />
              }
              value={find(campsPayload, { sku: row.original.sku })?.budget}
              onChange={(event) => {
                setCampsPayload((prev) => {
                  return map(prev, (x) => {
                    if (x.sku === row.original.sku) {
                      return {
                        ...x,
                        budget: toNumber(event.target.value),
                      };
                    }
                    return x;
                  });
                });
              }}
            />
          );
        },
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
                    setQuery({ ...query, postName: searchAdName });
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
                  setQuery({ ...query, postName: searchAdName });
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
              onShortcutClick={(shortcut) => {
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
            <Button
              onClick={() => {
                setQuery({
                  date: null,
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
