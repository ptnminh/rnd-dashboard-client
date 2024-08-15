import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Button,
  Flex,
  Group,
  List,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import {
  cloneDeep,
  forEach,
  isEmpty,
  isObject,
  keys,
  map,
  toUpper,
} from "lodash";
import classes from "./Setting.module.css";
import { toPascalCase } from "../../utils";
import { settingServices } from "../../services/settings";
import { showNotification } from "../../utils/index";
import { useDisclosure } from "@mantine/hooks";
import cn from "classnames";
import styles from "./Setting.module.sass";
import Card from "../../components/Card";

const transformData = (data) => {
  let refactoredData = [];
  forEach(data, (item, index) => {
    const { attribute } = item;
    const attributeKeys = keys(attribute);
    forEach(attributeKeys, (key) => {
      if (isObject(attribute[key])) {
        const childKeys = keys(attribute[key]);
        const childValues = map(childKeys, (childKey) => {
          return {
            key: childKey,
            value: attribute[key][childKey],
          };
        });
        refactoredData.push({
          ...item,
          id: index + 1,
          key,
          value: childValues,
          valueType: "object",
        });
      } else {
        refactoredData.push({
          ...item,
          id: index + 1,
          key,
          value: attribute[key],
          valueType: "string",
        });
      }
    });
  });
  return map(refactoredData, (item, index) => ({
    ...item,
    id: index + 1,
  }));
};

const MarketingSetting = ({ name }) => {
  const [loadingFetchSetting, setLoadingFetchSetting] = useState(false);
  const [updatePayload, setUpdatePayload] = useState({});
  const [createPayload, setCreatePayload] = useState({
    key: "",
    value: "",
  });
  const [opened, { open, close }] = useDisclosure(false);
  const fetchSettings = async () => {
    setLoadingFetchSetting(true);
    const response = await settingServices.fetchSetting({
      identifier: name,
    });
    if (response) {
      const { data } = response;
      const transformedData = transformData([data]);
      setSettings(transformedData);
    }
    setLoadingFetchSetting(false);
  };
  const [settings, setSettings] = useState([]);
  const updateSettingHandler = async ({ uid, data }) => {
    await settingServices.updateSetting({
      uid,
      data,
    });
  };
  const createSettingHandler = async () => {
    if (isEmpty(createPayload?.key) || isEmpty(createPayload?.value)) {
      showNotification("Thất bại", "Vui lòng điền đầy đủ thông tin", "red");
      return;
    }
    const setting = settings[0];
    const payload = {
      ...setting,
      attribute: {
        ...setting.attribute,
        [createPayload.key]: createPayload.value,
      },
    };
    await settingServices.updateSetting({
      uid: setting.uid,
      data: payload,
    });
  };
  useEffect(() => {
    if (!isEmpty(updatePayload)) {
      updateSettingHandler({
        uid: updatePayload.uid,
        data: updatePayload.data,
      });
    }
  }, [updatePayload]);

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
        accessorKey: "key",
        accessorFn: (row) => toPascalCase(row?.key),
        header: "KEY",
        size: 120,
        enableEditing: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableSorting: false,
      },
      {
        accessorKey: "value",
        header: "VALUE",
        size: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          const { value, valueType, key } = row.original;
          return valueType === "string" ? (
            <Text>{value}</Text>
          ) : (
            <List spacing="xs" size="sm" center>
              {map(value, (item, index) => {
                return (
                  <List.Item key={index}>
                    <Group>
                      <Text
                        style={{
                          width: "100px",
                          maxWidth: "200px",
                        }}
                      >
                        {toPascalCase(item.key)}
                      </Text>
                      <TextInput
                        value={item.value}
                        onChange={(event) => {
                          const value = event.target.value;
                          const clonedSettings = cloneDeep(settings);
                          const newValue = map(
                            clonedSettings[row.index].value,
                            (x) => {
                              if (item.key === x.key) {
                                return {
                                  key: x.key,
                                  value,
                                };
                              }
                              return x;
                            }
                          );
                          clonedSettings[row.index].value = newValue;
                          clonedSettings[row.index].attribute[key][item.key] =
                            value;
                          console.log("clonedSettings", clonedSettings);
                          setSettings(clonedSettings);
                          setUpdatePayload({
                            uid: clonedSettings[row.index].uid,
                            data: clonedSettings[row.index],
                          });
                        }}
                      />
                    </Group>
                  </List.Item>
                );
              })}
            </List>
          );
        },
      },
    ],
    [settings, updatePayload]
  );

  const table = useMantineReactTable({
    columns,
    data: settings,
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
    enableDensityToggle: false,
    state: {
      showProgressBars: loadingFetchSetting,
    },
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
            position: "sticky",
            top: 0,
            right: 0,
            zIndex: 100,
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
            <Button
              onClick={() => {
                open();
              }}
            >
              New Value
            </Button>
          </Flex>
        </div>
      );
    },
    mantineTableBodyCellProps: ({ cell }) => ({
      className: classes["body-cells"],
      onClick: () => {
        if (cell && cell.column.id === "priority") {
          return;
        }
      },
      sx: {
        cursor: "pointer", //you might want to change the cursor too when adding an onClick
      },
    }),
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Card
      className={cn(styles.card, styles.clipArtCard)}
      title={`Setting ${toPascalCase(name)}`}
      classTitle="title-green"
      classCardHead={styles.classCardHead}
      classSpanTitle={styles.classScaleSpanTitle}
    >
      <MantineReactTable table={table} />
      <Modal
        opened={opened}
        onClose={close}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="md"
      >
        <Flex gap={10}>
          <TextInput
            label="Key"
            placeholder="Your key"
            data-autofocus
            value={createPayload?.key || ""}
            onChange={(event) => {
              const key = event.target.value;
              setCreatePayload((prevPayload) => {
                const newPayload = {
                  ...prevPayload,
                  key,
                };
                console.log("Updated Payload:", newPayload); // Debugging line
                return newPayload;
              });
            }}
          />
          <TextInput
            label="Value"
            placeholder="Your Value"
            value={createPayload?.value || ""}
            onChange={(event) => {
              const value = event.target.value;
              setCreatePayload((prevPayload) => ({
                ...prevPayload,
                value,
              }));
            }}
          />
        </Flex>
        <Button
          fullWidth
          onClick={async () => {
            await createSettingHandler();
            await fetchSettings();
            close();
          }}
          mt="md"
        >
          Submit
        </Button>
      </Modal>
    </Card>
  );
};

export default MarketingSetting;
