import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Autocomplete,
  Badge,
  Button,
  Flex,
  Group,
  Image,
  Modal,
  rem,
  Select,
  TextInput,
} from "@mantine/core";
import Checkbox from "../../../components/Checkbox";
import {
  compact,
  filter,
  find,
  flatMap,
  includes,
  isEmpty,
  map,
  omit,
  toNumber,
} from "lodash";
import {
  IconSearch,
  IconFilterOff,
  IconCurrencyDollar,
  IconX,
} from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import { DateRangePicker } from "rsuite";
import { CREATE_CAMP_FLOWS } from "../../../constant";
import moment from "moment-timezone";
import { CONVERT_NUMBER_TO_STATUS } from "../../../utils";
import { rndServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import { useDisclosure } from "@mantine/hooks";
import RunFlows from "../RunFlows";

const BriefsTable = ({
  briefs,
  name,
  query,
  setQuery,
  setSelectedSKU,
  openModal,
  loadingFetchBrief,
  setTrigger,
  sorting,
  setSorting,
  accounts,
  setCampsPayload,
  campsPayload,
  sampleCampaigns,
  openModalPreview,
  setSelectedCreateCampPayload,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedCreateCustomCamp, setSelectedCreateCustomCamp] = useState({});
  const [data, setData] = useState(briefs || []);
  const [templateName, setTemplateName] = useState(name);
  useEffect(() => {
    setData(briefs);
    setTemplateName(name);
  }, [briefs, templateName]);

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
        id: "adsImage",
        header: "POST HÌNH",
        enableEditing: false,
        enableSorting: false,
        size: 130,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["ads-image"] },
        Cell: ({ row }) => {
          const adsLinksLength = filter(
            row?.original?.designInfo?.adsLinks,
            (x) => x.postId && (x.type === "image" || !x.type) && !x.campaignId
          ).length;
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                ...(adsLinksLength === 0 && {
                  color: "#8f959f",
                }),
                fontWeight: "bold",
              }}
            >
              {adsLinksLength}
            </div>
          );
        },
      },
      {
        id: "video",
        header: "POST VIDEO",
        enableEditing: false,
        enableSorting: false,
        size: 130,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["ads-image"] },
        Cell: ({ row }) => {
          const adsLinksLength = filter(
            row?.original?.designInfo?.adsLinks,
            (x) => x.postId && x.type === "video" && !x.campaignId
          ).length;
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                color: "#8f959f",
                fontWeight: "bold",
              }}
            >
              {adsLinksLength}
            </div>
          );
        },
      },
      {
        accessorKey: "priority",
        header: "PRIORITY",
        enableSorting: false,
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
        accessorFn: (row) => row?.productInfo?.time,
        header: "TIME",
        mantineTableHeadCellProps: { className: classes["head-cells"] },
        enableEditing: false,
        size: 50,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        id: "facebookAccount",
        header: "FB Acc",
        enableEditing: false,
        enableSorting: false,
        size: 150,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["ads-image"] },
        Cell: ({ row }) => {
          const accountValue =
            find(campsPayload, { sku: row.original.sku })?.accountName || "";
          return (
            <Autocomplete
              data={map(accounts, "name")}
              placeholder="FB Account"
              rightSection={
                accountValue && (
                  <IconX
                    size={14}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setCampsPayload((prevCampsPayload) =>
                        prevCampsPayload.map((prev) =>
                          prev.sku === row.original.sku
                            ? omit(prev, ["account", "accountName"])
                            : prev
                        )
                      );
                    }}
                  />
                )
              }
              value={accountValue}
              onChange={(value) => {
                setCampsPayload((prev) => {
                  const payloads = map(prev, (x) => {
                    if (x.sku === row.original.sku) {
                      return {
                        ...x,
                        account: find(accounts, { name: value }),
                        accountName: value,
                      };
                    }
                    return x;
                  });
                  return payloads;
                });
              }}
            />
          );
        },
      },
      {
        id: "runFlows",
        header: "Cách chạy",
        enableEditing: false,
        enableSorting: false,
        size: 200,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["ads-image"] },
        Cell: ({ row }) => {
          return (
            <Select
              data={map(CREATE_CAMP_FLOWS, "title")}
              placeholder="Chọn cách chạy"
              value={
                find(campsPayload, { sku: row.original.sku })?.runFlow || null
              }
              onChange={(value) => {
                setCampsPayload((prev) => {
                  return map(prev, (x) => {
                    if (x.sku === row.original.sku) {
                      return {
                        ...x,
                        runFlow: value,
                      };
                    }
                    return x;
                  });
                });
              }}
              clearable
              onClear={() => {
                setCampsPayload((prev) => {
                  return map(prev, (x) => {
                    if (x.sku === row.original.sku) {
                      const newPayload = omit(x, ["runFlow"]);
                      return newPayload;
                    }
                    return x;
                  });
                });
              }}
            />
          );
        },
      },
      {
        id: "budget",
        accessorFn: (row) => 0,
        header: "Budget",
        enableEditing: false,
        enableSorting: false,
        size: 130,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["ads-image"] },
        Cell: ({ row }) => {
          return (
            <TextInput
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
      {
        id: "rootCampaign",
        header: "Camp phôi",
        enableEditing: false,
        enableSorting: false,
        size: 200,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["ads-image"] },
        Cell: ({ row }) => {
          const rootCampaignValue =
            find(campsPayload, { sku: row.original.sku })?.rootCampaignName ||
            "";
          return (
            <Autocomplete
              data={
                compact(
                  map(sampleCampaigns, (campaign) => {
                    const foundAccountId = find(campsPayload, {
                      sku: row.original.sku,
                    })?.account?.uid;
                    if (
                      foundAccountId &&
                      foundAccountId !== campaign?.accountInfo?.uid
                    ) {
                      return null;
                    }
                    return {
                      group: campaign?.accountInfo?.name,
                      items: map(campaign?.campaigns, "campaignName"),
                    };
                  })
                ) ||
                map(sampleCampaigns, (campaign) => {
                  return {
                    group: campaign?.accountInfo?.name,
                    items: map(campaign?.campaigns, "campaignName"),
                  };
                })
              }
              rightSection={
                rootCampaignValue && (
                  <IconX
                    size={14}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setCampsPayload((prevCampsPayload) =>
                        prevCampsPayload.map((prev) =>
                          prev.sku === row.original.sku
                            ? omit(prev, ["rootCampaign", "rootCampaignName"])
                            : prev
                        )
                      );
                    }}
                  />
                )
              }
              placeholder="Chọn Camp phôi"
              value={rootCampaignValue}
              onChange={(value) => {
                setCampsPayload((prev) => {
                  return map(prev, (x) => {
                    if (x.sku === row.original.sku) {
                      return {
                        ...x,
                        rootCampaign: find(
                          flatMap(map(sampleCampaigns, "campaigns")),
                          (camp) => {
                            return camp?.campaignName === value;
                          }
                        ),
                        rootCampaignName: value,
                      };
                    }
                    return x;
                  });
                });
              }}
              onOptionSubmit={(value) => {
                const sku = row.original.sku;
                const foundSKU = find(campsPayload, { sku });
                if (isEmpty(foundSKU.account)) {
                  const accountId = find(sampleCampaigns, (campaign) =>
                    includes(map(campaign.campaigns, "campaignName"), value)
                  )?.accountId;
                  const foundAccount = find(accounts, { uid: accountId });
                  setCampsPayload((prev) => {
                    return map(prev, (x) => {
                      if (x.sku === sku) {
                        return {
                          ...x,
                          account: foundAccount,
                        };
                      }
                      return x;
                    });
                  });
                }
              }}
            />
          );
        },
      },
      {
        accessorKey: "createCamp",
        header: "ACTIONS",
        enableSorting: false,
        enableEditing: false,
        size: 300,
        mantineTableHeadCellProps: { className: classes["remove"] },
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          return (
            <Group>
              <Button
                variant="filled"
                color="green"
                size="sx"
                onClick={() => {
                  const sku = row.original.sku;
                  const foundSKUPayload = find(campsPayload, { sku });
                  if (isEmpty(foundSKUPayload.rootCampaign)) {
                    showNotification(
                      "Thất bại",
                      `Vui lòng chọn Camp phôi cho ${sku}`,
                      "red"
                    );
                    return;
                  } else if (!foundSKUPayload.budget) {
                    showNotification(
                      "Thất bại",
                      `Vui lòng nhập Budget cho ${sku}`,
                      "red"
                    );
                    return;
                  } else if (isEmpty(foundSKUPayload.runFlow)) {
                    showNotification(
                      "Thất bại",
                      `Vui lòng chọn cách chạy cho ${sku}`,
                      "red"
                    );
                    return;
                  }
                  setSelectedCreateCampPayload(
                    omit(foundSKUPayload, ["accountName", "rootCampaignName"])
                  );
                  openModalPreview();
                }}
              >
                Lên Camp
              </Button>
              <Button
                variant="filled"
                color="#BBBFC4"
                size="sx"
                onClick={() => {
                  const sku = row.original.sku;
                  const foundSKUPayload = find(campsPayload, { sku });
                  if (isEmpty(foundSKUPayload.rootCampaign)) {
                    showNotification(
                      "Thất bại",
                      `Vui lòng chọn Camp phôi cho ${sku}`,
                      "red"
                    );
                    return;
                  }
                  setSelectedCreateCustomCamp(
                    omit(foundSKUPayload, ["accountName", "rootCampaignName"])
                  );
                  open();
                }}
              >
                Custom Camp
              </Button>
            </Group>
          );
        },
      },
    ],
    [validationErrors, accounts, sampleCampaigns, briefs, campsPayload]
  );

  const [searchSKU, setSearchSKU] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

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
                  batch: "",
                  sku: "",
                  briefType: null,
                  size: null,
                  rndTeam: null,
                  rnd: null,
                  epm: null,
                  designer: null,
                  status: [3],
                  postStatus: ["fulfilled", "partial"],
                  campaignStatus: ["unfulfilled", "partial"],
                  sizeValue: null,
                  rndName: null,
                  designerName: null,
                  epmName: null,
                  statusValue: null,
                  dateValue: null,
                });
                setSearchSKU("");
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
      {!isEmpty(selectedCreateCustomCamp) && (
        <Modal
          opened={opened}
          onClose={close}
          transitionProps={{ transition: "fade", duration: 200 }}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          radius="md"
          size="lg"
        >
          <RunFlows
            selectedPayload={selectedCreateCustomCamp}
            closeModal={close}
            setTrigger={setTrigger}
          />
        </Modal>
      )}
    </>
  );
};

export default BriefsTable;
