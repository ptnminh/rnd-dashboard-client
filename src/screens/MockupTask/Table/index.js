import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Badge,
  Button,
  Flex,
  Group,
  Image,
  rem,
  Select,
  TextInput,
} from "@mantine/core";
import Checkbox from "../../../components/Checkbox";
import { filter, find, map } from "lodash";
import { IconSearch, IconFilterOff, IconLink } from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import { DateRangePicker } from "rsuite";
import { LOCAL_STORAGE_KEY, MEMBER_POSITIONS } from "../../../constant";
import moment from "moment-timezone";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
} from "../../../utils";
import { productlineService } from "../../../services";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { showNotification } from "../../../utils/index";

const BriefsTable = ({
  briefs,
  query,
  setQuery,
  openModal,
  loadingFetchBrief,
  setTrigger,
  sorting,
  setSorting,
  metadata,
  users,
  setSelectedBrief,
}) => {
  const [loadingUpdateBriefUID, setLoadingUpdateBriefUID] = useState("");
  let [permissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  const urlPattern =
    /^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[\w-]*)?$/i;
  const [payloads, setPayloads] = useState([]);
  permissions = map(permissions, "name");
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(briefs || []);
  useEffect(() => {
    setData(briefs);
    setPayloads(briefs);
  }, [briefs]);

  const handleUpdateBrief = async ({ uid, data, isTrigger = false }) => {
    if (isTrigger) {
      setLoadingUpdateBriefUID(uid);
    }
    await productlineService.updateMockup({
      uid,
      data,
    });
    if (isTrigger) {
      setLoadingUpdateBriefUID("");
      setTrigger(true);
    }
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: true,
      },
      {
        accessorKey: "rndTeam",
        header: "Team",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: true,
      },
      {
        accessorKey: "rnd",
        accessorFn: (row) => row?.rnd?.name,
        header: "RnD",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
      },
      {
        accessorKey: "productName",
        accessorFn: (row) => row?.name,
        header: "Tên Product",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
      },
      {
        accessorKey: "imageRef",
        header: "Hình Ref",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => (
          <Image
            radius="md"
            src={row?.original?.imageRef || "/images/content/not_found_2.jpg"}
            height={100}
            fit="contain"
          />
        ),
      },
      {
        accessorKey: "modal",
        header: "Brief",
        size: 120,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          return (
            <Button
              leftSection={
                <IconLink
                  style={{
                    width: rem(16),
                    height: rem(16),
                  }}
                />
              }
              onClick={() => {
                setSelectedBrief(row.original);
                openModal();
              }}
            >
              Preview
            </Button>
          );
        },
      },
      {
        accessorKey: "value",
        header: "Value",
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
        accessorKey: "priority",
        header: "PRIORITY",
        enableSorting: false,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        size: 100,
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Checkbox value={foundBrief?.priority === 2} />
            </div>
          );
        },
      },
      {
        id: "linkTemplate",
        header: "Link Template (Library)",
        enableEditing: false,
        enableSorting: false,
        size: 170,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <TextInput
              styles={{
                input: {
                  cursor: "pointer",
                },
              }}
              value={foundBrief?.templateLink || ""}
              readOnly
              onClick={() => {
                window.open(foundBrief?.templateLink, "_blank");
              }}
            />
          );
        },
      },
      {
        id: "linkDoc",
        header: "Brief Cho Mockup (Link Doc)",
        enableEditing: false,
        enableSorting: false,
        size: 150,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <TextInput
              styles={{
                input: {
                  cursor: "pointer",
                },
              }}
              value={foundBrief?.readyToLaunchInfo?.docLink || ""}
              readOnly
              onClick={() => {
                window.open(foundBrief?.readyToLaunchInfo?.docLink, "_blank");
              }}
            />
          );
        },
      },
      {
        id: "artistName",
        header: "Mockup PIC",
        enableEditing: false,
        enableSorting: false,
        size: 150,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          const artistNames = map(
            filter(users, { position: MEMBER_POSITIONS.MOCKUP }),
            "name"
          );
          return (
            <Select
              data={artistNames || []}
              value={foundBrief?.mockup?.name || null}
              onChange={(name) => {
                const foundMockup = find(users, { name });
                setPayloads((prev) => {
                  return map(prev, (x) => {
                    if (x.uid === uid) {
                      return {
                        ...x,
                        mockup: {
                          name,
                          uid: foundMockup?.uid,
                        },
                      };
                    }
                    return x;
                  });
                });
                const data = {
                  mockupId: foundMockup?.uid || "",
                };
                handleUpdateBrief({ uid, data });
              }}
            />
          );
        },
      },
      {
        accessorKey: "screenShot",
        header: "Chụp SP",
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        size: 100,
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              onClick={() => {
                const data = {
                  isPhotography:
                    foundBrief?.isPhotography === true ? false : true,
                };
                handleUpdateBrief({ uid, data, isTrigger: true });
              }}
            >
              <Checkbox value={foundBrief?.isPhotography === true} />
            </div>
          );
        },
      },
      {
        id: "photographyLink",
        header: "Hình chụp",
        enableEditing: false,
        enableSorting: false,
        size: 170,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <TextInput
              styles={{
                input: {
                  cursor: "pointer",
                },
              }}
              value={foundBrief?.photographyLink || ""}
              readOnly
              onClick={() => {
                window.open(foundBrief?.photographyLink, "_blank");
              }}
            />
          );
        },
      },
      {
        id: "mockupLink",
        header: "Link Mockup (Library)",
        enableEditing: false,
        enableSorting: false,
        size: 170,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <TextInput
              value={foundBrief?.mockupLink || ""}
              onChange={(e) => {
                const payload = {
                  ...foundBrief,
                  mockupLink: e.target.value,
                };
                setPayloads((prev) => {
                  return map(prev, (x) => {
                    if (x.uid === uid) {
                      return payload;
                    }
                    return x;
                  });
                });
              }}
              onBlur={(e) => {
                const value = e.target.value;
                let data = {};
                if (value === "") {
                  data = {
                    mockupLink: "",
                  };
                } else {
                  if (!urlPattern.test(value)) {
                    showNotification("Thất bại", "Link không hợp lệ", "red");
                    return;
                  }
                  data = {
                    mockupLink: value,
                  };
                }
                handleUpdateBrief({ uid, data });
              }}
              onPaste={(e) => {
                const value = e.clipboardData.getData("Text");
                if (!urlPattern.test(value)) {
                  showNotification("Thất bại", "Link không hợp lệ", "red");
                  return;
                }
                const data = {
                  mockupLink: value,
                };
                handleUpdateBrief({ uid, data });
              }}
            />
          );
        },
      },
      {
        accessorKey: "status",
        header: "DONE",
        enableSorting: false,
        enableEditing: false,
        size: 150,
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Group justify="center">
              <Button
                variant="filled"
                color="green"
                size="sx"
                loading={loadingUpdateBriefUID === uid}
                disabled={
                  foundBrief?.status === 4 ||
                  foundBrief?.mockupLink === "" ||
                  (foundBrief?.isPhotography === true &&
                    foundBrief?.photographyLink === "")
                }
                onClick={() => {
                  if (
                    foundBrief?.mockupLink === "" ||
                    (foundBrief?.isPhotography === true &&
                      foundBrief?.photographyLink === "")
                  ) {
                    showNotification(
                      "Thất bại",
                      "Vui lòng nhập đủ thông tin",
                      "red"
                    );
                    return;
                  }
                  const data = {
                    status: 4,
                  };
                  handleUpdateBrief({ uid, data, isTrigger: true });
                }}
              >
                DONE
              </Button>
            </Group>
          );
        },
      },
      {
        id: "time",
        accessorFn: (row) => row?.newProductLineInfo?.time,
        header: "TIME",
        mantineTableHeadCellProps: { className: classes["head-cells"] },
        enableEditing: false,
        size: 50,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
    ],
    [validationErrors, briefs, query, payloads, loadingUpdateBriefUID]
  );

  const [clipartName, setClipartName] = useState("");

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
    renderTopToolbar: () => {
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
              flexWrap: "wrap",
            }}
          >
            <TextInput
              placeholder="Tên Product"
              size="sm"
              width="100px"
              leftSection={
                <span
                  onClick={() => {
                    setQuery({ ...query, name: clipartName });
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
              value={clipartName}
              onChange={(e) => setClipartName(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setQuery({ ...query, name: clipartName });
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
                  startDate: moment(value[0]).format("YYYY-MM-DD"),
                  endDate: moment(value[1]).format("YYYY-MM-DD"),
                })
              }
              onClean={() => {
                setQuery({
                  ...query,
                  dateValue: null,
                  date: null,
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
            <Select
              placeholder="Size"
              data={["Small", "Medium", "Big"]}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.sizeValue}
              onChange={(value) =>
                setQuery({
                  ...query,
                  size: CONVERT_STATUS_TO_NUMBER[value],
                  sizeValue: value,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  size: null,
                  sizeValue: null,
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
            <Select
              placeholder="RND"
              data={map(filter(users, { position: "rnd" }), "name") || []}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.rndName}
              onChange={(value) =>
                setQuery({
                  ...query,
                  rndName: find(users, { name: value })?.name,
                  rndId: find(users, { name: value })?.uid,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  rndName: null,
                  rndId: null,
                });
              }}
            />
            <Select
              placeholder="Mockup"
              data={
                map(
                  filter(users, { position: MEMBER_POSITIONS.MOCKUP }),
                  "name"
                ) || []
              }
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.mockupName}
              onChange={(value) =>
                setQuery({
                  ...query,
                  mockupName: find(users, { name: value })?.name,
                  mockupId: find(users, { name: value })?.uid,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  mockupName: null,
                  mockupId: null,
                });
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
              value={query?.statusValue}
              onChange={(value) =>
                setQuery({
                  ...query,
                  status: value === "Done" ? [4] : [3],
                  statusValue: value,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  status: [3, 4],
                  statusValue: null,
                });
              }}
            />
            <Button
              onClick={() => {
                setQuery({
                  date: null,
                  name: "",
                  size: null,
                  rndTeam: null,
                  rndId: null,
                  epm: null,
                  status: [3, 4],
                  sizeValue: null,
                  rndName: null,
                  statusValue: null,
                  dateValue: null,
                  startDate: null,
                  endDate: null,
                  mockupName: null,
                  mockupId: null,
                });
                setClipartName("");
              }}
            >
              <IconFilterOff />
            </Button>
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
              Undone: {metadata?.totalUndoneNewProductLineBriefsWithFilter}
            </div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Time to done:{" "}
              {metadata?.totalTimeToDoneNewProductLineBriefsWithFilter}h
            </div>
          </Flex>
        </div>
      );
    },
    state: {
      showProgressBars: loadingFetchBrief,
      sorting,
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

export default BriefsTable;
