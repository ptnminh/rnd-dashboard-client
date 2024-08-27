import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import styles from "./Details.module.sass";
import {
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  rem,
  Select,
  TextInput,
  Tooltip,
} from "@mantine/core";
import Checkbox from "../../../components/Checkbox";
import { filter, find, isEmpty, map, omit } from "lodash";
import {
  IconSearch,
  IconFilterOff,
  IconEdit,
  IconPlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import classes from "./MyTable.module.css";
import { DateRangePicker } from "rsuite";
import { MEMBER_POSITIONS, NewProductLineBriefStatus } from "../../../constant";
import moment from "moment-timezone";
import {
  CONVERT_NUMBER_TO_STATUS,
  CONVERT_STATUS_TO_NUMBER,
  generateRandomString,
  getEditorStateAsString,
  getStringAsEditorState,
} from "../../../utils";
import { productlineService } from "../../../services";
import { showNotification } from "../../../utils/index";
import { useDisclosure } from "@mantine/hooks";
import Editor from "../../../components/Editor";
import { uploadServices } from "../../../services/uploads";
import { useAuth0 } from "@auth0/auth0-react";

const defaultRow = {
  name: "",
  imageRef: "",
  status: NewProductLineBriefStatus.OPTIMIZED_MOCKUP_UNDONE,
  note: {
    newProductLine: "",
  },
  value: {
    rnd: 1,
  },
  priority: 1,
  rndId: "",
  mockupId: "",
  mockupLink: "",
  date: moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"),
  uid: generateRandomString(10),
  isDraft: true,
  newProductLineInfo: {
    time: "0h",
  },
};

const BriefsTable = ({
  briefs,
  query,
  setQuery,
  loadingFetchBrief,
  setTrigger,
  sorting,
  setSorting,
  metadata,
  users,
}) => {
  const [loadingUploadFile, setLoadingUploadFile] = useState("");
  const { user } = useAuth0();
  const [opened, { open, close }] = useDisclosure(false);
  const [productLineNote, setProductLineNote] = useState("");
  const [selectedBrief, setSelectedBrief] = useState({});
  const [loadingUpdateBriefUID, setLoadingUpdateBriefUID] = useState("");
  const urlPattern =
    /^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[\w-]*)?$/i;
  const [payloads, setPayloads] = useState([]);
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
    await productlineService.updateOptimizedMockup({
      uid,
      data,
    });
    if (isTrigger) {
      setLoadingUpdateBriefUID("");
      setTrigger(true);
    }
  };
  const handleCreateNewBrief = async ({ data }) => {
    const payload = omit(
      {
        ...data,
        rndId: user.sub,
      },
      ["id", "uid", "isDraft", "newProductLineInfo", "date"]
    );
    await productlineService.createOptimizedMockup({
      payloads: [payload],
    });
    setTrigger(true);
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
        accessorKey: "productName",
        header: "Tên Product",
        size: 170,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <TextInput
              value={foundBrief?.name || ""}
              onChange={(e) => {
                const payload = {
                  ...foundBrief,
                  name: e.target.value,
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
                if (!foundBrief?.isDraft) {
                  const value = e.target.value;
                  const data = {
                    name: value,
                  };
                  handleUpdateBrief({ uid, data });
                }
              }}
              onPaste={(e) => {
                if (!foundBrief?.isDraft) {
                  const value = e.clipboardData.getData("Text");
                  const data = {
                    name: value,
                  };
                  handleUpdateBrief({ uid, data });
                }
              }}
            />
          );
        },
      },
      {
        accessorKey: "imageRef",
        header: "Hình Ref",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        Cell: ({ row }) => {
          const { uid, isDraft } = row?.original;
          const generateTempUID = () => `temp-${Date.now()}`;
          const uniqueId = uid || generateTempUID();
          const foundBrief = find(payloads, { uid });
          const handleImageChange = async (event) => {
            setLoadingUploadFile(uid);
            const file = event.target.files[0];
            if (!file) return;

            try {
              const fileName = generateRandomString(10);
              const response = await uploadServices.upload(file, fileName); // Adjust this to your upload API call
              if (response && response.data) {
                const newImageUrl = response.data.shortUrl;
                // Update the imageRef in the relevant row
                const updatedBriefs = map(payloads, (brief) =>
                  brief.uid === uid
                    ? { ...brief, imageRef: newImageUrl }
                    : brief
                );
                setPayloads(updatedBriefs); // Update state
                if (!isDraft) {
                  // update the imageRef in the database
                  const data = {
                    imageRef: newImageUrl,
                  };
                  handleUpdateBrief({ uid, data });
                }
                setLoadingUploadFile("");
              }
            } catch (error) {
              setLoadingUploadFile("");
              console.error("Image upload failed", error);
            }
          };
          return (
            <>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id={`upload-image-${uniqueId}`}
                onChange={handleImageChange}
              />
              {isDraft && !foundBrief?.imageRef ? (
                <Button
                  radius="xl"
                  style={{
                    width: rem(50),
                    height: rem(50),
                  }}
                  loading={loadingUploadFile === uid}
                  onClick={() => {
                    document.getElementById(`upload-image-${uniqueId}`).click(); // Trigger file input click
                  }}
                  color="#3751D7"
                >
                  <IconPlus
                    style={{
                      width: rem(20),
                      height: rem(20),
                    }}
                  />
                </Button>
              ) : (
                <Tooltip label="Click to edit">
                  {loadingUploadFile === uid ? (
                    <Loader color="blue" size={30} />
                  ) : (
                    <Image
                      style={{
                        cursor: "pointer",
                      }}
                      radius="md"
                      src={
                        foundBrief?.imageRef ||
                        "/images/content/not_found_2.jpg"
                      }
                      height={100}
                      fit="contain"
                      onClick={() => {
                        document
                          .getElementById(`upload-image-${uniqueId}`)
                          .click(); // Trigger file input click
                      }}
                    />
                  )}
                </Tooltip>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "value",
        header: "Value",
        size: 150,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Select
              data={["Small", "Medium", "Big", "Super Big"]}
              value={CONVERT_NUMBER_TO_STATUS[foundBrief.value?.rnd]}
              onChange={(value) => {
                const data = {
                  value: {
                    rnd: CONVERT_STATUS_TO_NUMBER[value],
                  },
                };
                setPayloads((prev) => {
                  return map(prev, (x) => {
                    if (x.uid === uid) {
                      return {
                        ...x,
                        value: {
                          rnd: CONVERT_STATUS_TO_NUMBER[value],
                        },
                      };
                    }
                    return x;
                  });
                });
                if (!foundBrief?.isDraft) {
                  handleUpdateBrief({ uid, data });
                }
              }}
            />
          );
        },
      },
      {
        accessorKey: "priority",
        header: "PRIORITY",
        enableSorting: false,
        enableEditing: false,
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
                  priority: foundBrief?.priority === 2 ? 1 : 2,
                };
                if (!foundBrief?.isDraft) {
                  handleUpdateBrief({ uid, data, isTrigger: true });
                }
              }}
            >
              <Checkbox value={foundBrief?.priority === 2} />
            </div>
          );
        },
      },
      {
        accessorKey: "note",
        header: "Brief cho Mockup",
        enableSorting: false,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        mantineTableHeadCellProps: { className: classes["edit-header"] },
        size: 100,
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const foundBrief = find(payloads, { uid });
          return (
            <Button
              onClick={() => {
                setSelectedBrief(foundBrief);
                setProductLineNote(
                  getStringAsEditorState(foundBrief?.note?.newProductLine)
                );
                open();
              }}
            >
              <IconEdit
                style={{
                  width: rem(20),
                  height: rem(20),
                }}
              />
            </Button>
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
          const uid = row?.original?.uid;
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
                        mockupId: foundMockup?.uid,
                      };
                    }
                    return x;
                  });
                });
                const data = {
                  mockupId: foundMockup?.uid || "",
                };
                if (!foundBrief?.isDraft) {
                  handleUpdateBrief({ uid, data });
                }
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
                    setPayloads((prev) => {
                      return map(prev, (x) => {
                        if (x.uid === uid) {
                          return {
                            ...x,
                            mockupLink: "",
                          };
                        }
                        return x;
                      });
                    });
                    return;
                  }
                  data = {
                    mockupLink: value,
                  };
                }
                if (!foundBrief?.isDraft) {
                  handleUpdateBrief({ uid, data });
                }
              }}
              onPaste={(e) => {
                const value = e.clipboardData.getData("Text");
                if (!urlPattern.test(value)) {
                  showNotification("Thất bại", "Link không hợp lệ", "red");
                  setPayloads((prev) => {
                    return map(prev, (x) => {
                      if (x.uid === uid) {
                        return {
                          ...x,
                          mockupLink: "",
                        };
                      }
                      return x;
                    });
                  });
                  return;
                }
                const data = {
                  mockupLink: value,
                };
                if (!foundBrief?.isDraft) {
                  handleUpdateBrief({ uid, data });
                }
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
              {!foundBrief?.isDraft && (
                <Button
                  variant="filled"
                  color="green"
                  size="sx"
                  loading={loadingUpdateBriefUID === uid}
                  disabled={
                    foundBrief?.status ===
                      NewProductLineBriefStatus.OPTIMIZED_MOCKUP_DONE ||
                    foundBrief?.mockupLink === "" ||
                    isEmpty(foundBrief?.mockup?.name) ||
                    isEmpty(foundBrief?.imageRef) ||
                    isEmpty(foundBrief?.name)
                  }
                  onClick={() => {
                    if (
                      foundBrief?.mockupLink === "" ||
                      isEmpty(foundBrief?.mockup?.name) ||
                      isEmpty(foundBrief?.imageRef) ||
                      isEmpty(foundBrief?.name) ||
                      isEmpty(foundBrief?.name)
                    ) {
                      showNotification(
                        "Thất bại",
                        "Vui lòng nhập đủ thông tin",
                        "red"
                      );
                      return;
                    }
                    if (foundBrief?.isDraft) {
                      // create a new brief
                      handleCreateNewBrief({ data: foundBrief });
                    } else {
                      const data = {
                        status: NewProductLineBriefStatus.OPTIMIZED_MOCKUP_DONE,
                      };
                      handleUpdateBrief({ uid, data, isTrigger: true });
                    }
                  }}
                >
                  Done
                </Button>
              )}
              {foundBrief?.isDraft && (
                <ButtonGroup
                  style={{
                    display: "flex",
                  }}
                >
                  <Button
                    variant="filled"
                    color="green"
                    size="sx"
                    loading={loadingUpdateBriefUID === uid}
                    disabled={
                      foundBrief?.status ===
                        NewProductLineBriefStatus.OPTIMIZED_MOCKUP_DONE ||
                      foundBrief?.mockupLink === "" ||
                      isEmpty(foundBrief?.mockup?.name) ||
                      isEmpty(foundBrief?.imageRef) ||
                      isEmpty(foundBrief?.name)
                    }
                    onClick={() => {
                      if (
                        foundBrief?.mockupLink === "" ||
                        isEmpty(foundBrief?.mockup?.name) ||
                        isEmpty(foundBrief?.imageRef) ||
                        isEmpty(foundBrief?.name) ||
                        isEmpty(foundBrief?.name)
                      ) {
                        showNotification(
                          "Thất bại",
                          "Vui lòng nhập đủ thông tin",
                          "red"
                        );
                        return;
                      }
                      if (foundBrief?.isDraft) {
                        // create a new brief
                        handleCreateNewBrief({ data: foundBrief });
                      } else {
                        const data = {
                          status:
                            NewProductLineBriefStatus.OPTIMIZED_MOCKUP_DONE,
                        };
                        handleUpdateBrief({ uid, data, isTrigger: true });
                      }
                    }}
                  >
                    <IconPlus
                      style={{
                        width: rem(20),
                        height: rem(20),
                      }}
                    />
                  </Button>
                  <Button
                    color="red"
                    variant="filled"
                    size="sx"
                    radius="md"
                    onClick={() => {
                      setPayloads((prev) => {
                        return filter(prev, (x) => x.uid !== uid);
                      });
                      setData((prev) => {
                        return filter(prev, (x) => x.uid !== uid);
                      });
                    }}
                  >
                    <IconX
                      style={{
                        width: rem(20),
                        height: rem(20),
                      }}
                    />
                  </Button>
                </ButtonGroup>
              )}
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
    [
      validationErrors,
      briefs,
      query,
      payloads,
      loadingUpdateBriefUID,
      loadingUploadFile,
    ]
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
                  status:
                    value === "Done"
                      ? [NewProductLineBriefStatus.OPTIMIZED_MOCKUP_DONE]
                      : [NewProductLineBriefStatus.OPTIMIZED_MOCKUP_UNDONE],
                  statusValue: value,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  status: [
                    NewProductLineBriefStatus.OPTIMIZED_MOCKUP_UNDONE,
                    NewProductLineBriefStatus.OPTIMIZED_MOCKUP_DONE,
                  ],
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
                  status: [
                    NewProductLineBriefStatus.OPTIMIZED_MOCKUP_UNDONE,
                    NewProductLineBriefStatus.OPTIMIZED_MOCKUP_DONE,
                  ],
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
      <Button
        radius="xl"
        style={{
          marginTop: "20px",
          width: rem(60),
          height: rem(60),
        }}
        color="#3751D7"
        onClick={() => {
          setPayloads([
            ...payloads,
            {
              ...defaultRow,
            },
          ]);
          setData([
            ...data,
            {
              ...defaultRow,
            },
          ]);
        }}
      >
        <IconPlus
          style={{
            width: rem(20),
            height: rem(20),
          }}
        />
      </Button>
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
        <Grid>
          <Grid.Col span={12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                backgroundColor: "#D9F5D6",
                border: "1px solid #62D256",
                color: "#000000",
                borderColor: "#62D256",
                fontSize: "18px",
                borderRadius: "12px",
              }}
            >
              Edit Note
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <Editor
              state={productLineNote}
              onChange={setProductLineNote}
              classEditorWrapper={styles.editor}
            />
          </Grid.Col>
          <Grid.Col
            span={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              color="green"
              style={{
                width: rem(100),
              }}
              loading={!isEmpty(loadingUpdateBriefUID)}
              onClick={async () => {
                const data = {
                  note: {
                    newProductLine: getEditorStateAsString(productLineNote),
                  },
                };
                if (!selectedBrief?.isDraft) {
                  await handleUpdateBrief({
                    uid: selectedBrief.uid,
                    data,
                    isTrigger: true,
                  });
                } else {
                  setPayloads((prev) => {
                    return map(prev, (x) => {
                      if (x.uid === selectedBrief.uid) {
                        return {
                          ...x,
                          note: {
                            newProductLine:
                              getEditorStateAsString(productLineNote),
                          },
                        };
                      }
                      return x;
                    });
                  });
                }
                close();
              }}
            >
              <IconCheck
                style={{
                  width: rem(20),
                  height: rem(20),
                }}
              />
            </Button>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
};

export default BriefsTable;
