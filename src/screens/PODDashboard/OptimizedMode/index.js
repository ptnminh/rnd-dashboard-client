import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Text,
  Flex,
  Grid,
  Image,
  Button,
  Badge,
  Tooltip,
  Group,
  Select,
  ActionIcon,
  Checkbox,
} from "@mantine/core";
import { find, values, isEmpty } from "lodash";

import classes from "./MyTable.module.css";
import {
  IconSortAscending,
  IconSortDescending,
  IconArrowsSort,
} from "@tabler/icons-react";
import { CONVERT_NUMBER_TO_STATUS } from "../../../utils";
import LazyLoad from "react-lazyload";
import {
  CONVERT_NUMBER_TO_POD_DASHBOARD_STATUS,
  POD_DASHBOARD_STATUS,
} from "../../../constant/common";
import { dashboardServices } from "../../../services";
import moment from "moment-timezone";
import { OPTIMIZED_INFO_STATUS } from "./optimizedInfoStatus";

const OptimizedTableMode = ({
  tableData,
  query,
  loading,
  sorting,
  setSorting,
  setQuery,
  activeTab,
  setPagination,
  pagination,
  setIsLoadmore,
  setTableData,
  loadingUpdateOptimized,
  handleSubmitSKUOptimized,
}) => {
  const handleUpdatePODDashboard = async (id, data) => {
    await dashboardServices.handleUpdatePODDashboard({ id, data });
  };

  const [data, setData] = useState(tableData || []);
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  // UseMemo to construct final columns array
  const columns = useMemo(
    () => [
      {
        accessorKey: "checkbox",
        header: "",
        size: 50,
        maxSize: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["checkbox-body-cells"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        Cell: ({ row }) => {
          const { uid } = row.original;
          const foundData = find(data, { uid });
          if (row.id === `Total theo ${activeTab}`) {
            return null;
          }
          return (
            <Checkbox
              size="lg"
              checked={foundData?.isChecked}
              onChange={() => {
                const newData = data.map((item) => {
                  if (item.uid === uid) {
                    return {
                      ...item,
                      isChecked: !item.isChecked,
                    };
                  }
                  return item;
                });
                setTableData(newData);
                handleUpdatePODDashboard(uid, {
                  isChecked: !foundData?.isChecked,
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "product",
        header: "Product",
        size: 230,
        maxSize: 230,
        enableEditing: false,
        enableSorting: false,
        enableMultiSort: true,
        Header: () => {
          return (
            <Group gap={30}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Product
              </Text>

              <Flex direction="column">
                <Group justify="space-between">
                  <Text
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Ads:
                  </Text>
                  <Group>
                    {(!query?.sortBy || query?.sortBy !== "testDate") && (
                      <ActionIcon
                        aria-label="Settings"
                        variant="default"
                        size="sm"
                        style={{
                          background: "none",
                          border: "none",
                        }}
                        onClick={() => {
                          setPagination({
                            ...pagination,
                            currentPage: 1,
                          });
                          setQuery({
                            ...query,
                            sortBy: "testDate",
                            sortDir: "desc",
                          });
                        }}
                      >
                        <IconArrowsSort
                          style={{
                            width: "60%",
                            height: "60%",
                            fontWeight: "bold",
                          }}
                          stroke={2}
                          color="#ffffff"
                        />
                      </ActionIcon>
                    )}
                    {query?.sortBy === "testDate" &&
                      query?.sortDir === "desc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          color="transparent"
                          size="sm"
                          onClick={() => {
                            setQuery({
                              ...query,
                              sortBy: "testDate",
                              sortDir: "asc",
                            });
                          }}
                        >
                          <IconSortDescending
                            style={{ width: "70%", height: "70%" }}
                            stroke={2}
                            color="#70B1ED"
                          />
                        </ActionIcon>
                      )}
                    {query?.sortBy === "testDate" &&
                      query?.sortDir === "asc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          size="sm"
                          color="transparent"
                          onClick={() => {
                            setQuery({
                              ...query,
                              sortBy: null,
                              sortDir: null,
                            });
                          }}
                        >
                          <IconSortAscending
                            style={{
                              width: "70%",
                              height: "70%",
                              fontWeight: "bold",
                            }}
                            stroke={2}
                            color="#70B1ED"
                          />
                        </ActionIcon>
                      )}
                  </Group>
                </Group>
                <Group justify="space-between">
                  <Text
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    List:
                  </Text>
                  <Group>
                    {(!query?.sortBy || query?.sortBy !== "createdDate") && (
                      <ActionIcon
                        aria-label="Settings"
                        variant="default"
                        size="sm"
                        style={{
                          background: "none",
                          border: "none",
                        }}
                        onClick={() => {
                          setPagination({
                            ...pagination,
                            currentPage: 1,
                          });
                          setQuery({
                            ...query,
                            sortBy: "createdDate",
                            sortDir: "desc",
                          });
                        }}
                      >
                        <IconArrowsSort
                          style={{
                            width: "60%",
                            height: "60%",
                            fontWeight: "bold",
                          }}
                          stroke={2}
                          color="#ffffff"
                        />
                      </ActionIcon>
                    )}

                    {query?.sortBy === "createdDate" &&
                      query?.sortDir === "desc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          color="transparent"
                          size="sm"
                          onClick={() => {
                            setQuery({
                              ...query,
                              sortBy: "createdDate",
                              sortDir: "desc",
                            });
                          }}
                        >
                          <IconSortDescending
                            style={{ width: "70%", height: "70%" }}
                            stroke={2}
                            color="#70B1ED"
                          />
                        </ActionIcon>
                      )}
                    {query?.sortBy === "createdDate" &&
                      query?.sortDir === "asc" && (
                        <ActionIcon
                          variant="filled"
                          aria-label="Settings"
                          size="sm"
                          color="transparent"
                          onClick={() => {
                            setQuery({
                              ...query,
                              sortBy: null,
                              sortDir: null,
                            });
                          }}
                        >
                          <IconSortAscending
                            style={{
                              width: "70%",
                              height: "70%",
                              fontWeight: "bold",
                            }}
                            stroke={2}
                            color="#70B1ED"
                          />
                        </ActionIcon>
                      )}
                  </Group>
                </Group>
              </Flex>
            </Group>
          );
        },
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
            rowSpan: row.id === `Total theo ${activeTab}` ? 3 : 1, // Row span for Total theo ${activeTab} row
          };
        },
        mantineTableHeadCellProps: ({ row }) => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          if (row.id === `Total theo ${activeTab}`) {
            return (
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Total theo {activeTab}
              </Text>
            );
          }
          const {
            imageLink,
            sku,
            productLink,
            designLink,
            testDate,
            createdDate,
          } = row.original;
          return (
            <Flex direction="column">
              <Grid
                style={{
                  padding: 0,
                }}
              >
                <Grid.Col
                  span={6}
                  style={{
                    padding: 0,
                  }}
                >
                  <Tooltip label={productLink}>
                    <Image
                      src={imageLink || "/images/content/not_found_2.jpg"}
                      width="100%"
                      height="100%"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        window.open(productLink, "_blank");
                      }}
                      fit="contain"
                    />
                  </Tooltip>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Grid
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Grid.Col
                      span={12}
                      style={{
                        padding: "0 5px",
                      }}
                    >
                      <Flex
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (designLink) {
                            window.open(designLink, "_blank");
                          }
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          {sku}
                        </Text>
                      </Flex>
                    </Grid.Col>
                    {createdDate && (
                      <Grid.Col
                        span={12}
                        style={{
                          padding: 0,
                          marginTop: "5px",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: 11,
                            color: "gray",
                            marginLeft: "3px",
                          }}
                        >
                          List:{" "}
                          {moment(createdDate)
                            .subtract(createdDate)
                            .fromNow(true)}
                        </Text>
                      </Grid.Col>
                    )}
                    {testDate && (
                      <Grid.Col
                        span={12}
                        style={{
                          padding: 0,
                          marginTop: "5px",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: 11,
                            color: "gray",
                            marginLeft: "3px",
                          }}
                        >
                          Ads:{" "}
                          {moment(testDate).subtract(testDate).fromNow(true)}
                        </Text>
                      </Grid.Col>
                    )}
                  </Grid>
                </Grid.Col>
              </Grid>
            </Flex>
          );
        },
      },
      {
        accessorKey: "createdDate",
        size: 100,
        maxSize: 100,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Header: () => {
          return (
            <Group gap={5}>
              <Grid>
                <Grid.Col
                  span={8}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "100%",
                      wordBreak: "break-word", // Break long words
                      whiteSpace: "normal", // Allow text to wrap
                      overflowWrap: "break-word", // Break long words
                    }}
                  >
                    Lifetime Order
                  </Text>
                </Grid.Col>
                <Grid.Col
                  span={4}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {(!query?.sortBy ||
                    query?.sortBy !== "totalOrdersLifetime") && (
                    <ActionIcon
                      aria-label="Settings"
                      variant="default"
                      size="sm"
                      style={{
                        background: "none",
                        border: "none",
                      }}
                      onClick={() => {
                        setPagination({
                          ...pagination,
                          currentPage: 1,
                        });
                        setQuery({
                          ...query,
                          sortBy: "totalOrdersLifetime",
                          sortDir: "desc",
                        });
                      }}
                    >
                      <IconArrowsSort
                        style={{
                          width: "60%",
                          height: "60%",
                          fontWeight: "bold",
                        }}
                        stroke={2}
                        color="#ffffff"
                      />
                    </ActionIcon>
                  )}

                  {query?.sortBy === "totalOrdersLifetime" &&
                    query?.sortDir === "desc" && (
                      <ActionIcon
                        variant="filled"
                        aria-label="Settings"
                        color="transparent"
                        size="sm"
                        onClick={() => {
                          setQuery({
                            ...query,
                            sortBy: "totalOrdersLifetime",
                            sortDir: "asc",
                          });
                        }}
                      >
                        <IconSortDescending
                          style={{ width: "70%", height: "70%" }}
                          stroke={2}
                          color="#70B1ED"
                        />
                      </ActionIcon>
                    )}
                  {query?.sortBy === "totalOrdersLifetime" &&
                    query?.sortDir === "asc" && (
                      <ActionIcon
                        variant="filled"
                        aria-label="Settings"
                        size="sm"
                        color="transparent"
                        onClick={() => {
                          setQuery({
                            ...query,
                            sortBy: null,
                            sortDir: null,
                          });
                        }}
                      >
                        <IconSortAscending
                          style={{
                            width: "70%",
                            height: "70%",
                            fontWeight: "bold",
                          }}
                          stroke={2}
                          color="#70B1ED"
                        />
                      </ActionIcon>
                    )}
                </Grid.Col>
              </Grid>
            </Group>
          );
        },
        Cell: ({ row }) => {
          const { totalOrdersLifetime } = row.original;
          return (
            <Group
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {totalOrdersLifetime?.toLocaleString()}
              </Text>
            </Group>
          );
        },
      },
      {
        accessorKey: "value",
        header: "Value",
        size: 50,
        maxSize: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          let color = null;
          const value = row.original.value || 2;
          switch (value) {
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
              {CONVERT_NUMBER_TO_STATUS[value]}
            </Badge>
          ) : (
            <span>{CONVERT_NUMBER_TO_STATUS[value]}</span>
          );
        },
      },
      {
        accessorKey: "size",
        header: "Size",
        size: 50,
        maxSize: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          let color = null;
          const size = row.original.size || 2;
          switch (size) {
            case 1:
              color = "green";
              break;
            case 2:
              color = "yellow";
              break;
            case 3:
              color = "red";
              break;
            case 1.5:
              color = "#006400";
              break;
            default:
              break;
          }
          return color ? (
            <Badge color={color} variant="filled">
              {CONVERT_NUMBER_TO_STATUS[size]}
            </Badge>
          ) : (
            <span>{CONVERT_NUMBER_TO_STATUS[size]}</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className:
              row.id === `Total theo ${activeTab}`
                ? classes["summary-row"]
                : classes["body-cells-op-team"],
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-op-team"],
          };
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const optimized = payload?.optimized;
          return (
            <Select
              size="xs"
              readOnly={true}
              allowDeselect={false}
              data={values(POD_DASHBOARD_STATUS)}
              value={CONVERT_NUMBER_TO_POD_DASHBOARD_STATUS[optimized]}
            />
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-optimized-info"],
            style: {
              "--mrt-row-hover-background-color": "#ffffff",
            },
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-optimized-info"],
          };
        },
        Header: () => {
          return (
            <Group
              dir="column"
              style={{
                padding: "10px",
                gap: 2,
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                O - P1
              </Text>
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Giá/Variants
              </Text>
            </Group>
          );
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const { optimizedInfo } = payload || {};
          const price =
            optimizedInfo?.price || OPTIMIZED_INFO_STATUS?.PRICE?.NOT_CHECKED;
          switch (price) {
            case OPTIMIZED_INFO_STATUS?.PRICE?.DONE: {
              return <Button disabled={true}>DONE</Button>;
            }
            case OPTIMIZED_INFO_STATUS?.PRICE?.CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={true}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            price: OPTIMIZED_INFO_STATUS?.PRICE?.NOT_CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        price: OPTIMIZED_INFO_STATUS?.PRICE?.NOT_CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            case OPTIMIZED_INFO_STATUS?.PRICE?.NOT_CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={false}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            price: OPTIMIZED_INFO_STATUS?.PRICE?.CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        price: OPTIMIZED_INFO_STATUS?.PRICE?.CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            default: {
              return null;
            }
          }
        },
      },
      {
        accessorKey: "seedingPost",
        header: "Seeding Post",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-optimized-info"],
            style: {
              "--mrt-row-hover-background-color": "#ffffff",
            },
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-optimized-info"],
          };
        },
        Header: () => {
          return (
            <Group
              dir="column"
              style={{
                padding: "10px",
                gap: 2,
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                O - P2
              </Text>
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Seeding Post
              </Text>
            </Group>
          );
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const { optimizedInfo } = payload || {};
          const price =
            optimizedInfo?.seedingPost ||
            OPTIMIZED_INFO_STATUS?.SEEDING_POST?.NOT_CHECKED;
          switch (price) {
            case OPTIMIZED_INFO_STATUS?.SEEDING_POST?.DONE: {
              return <Button disabled={true}>DONE</Button>;
            }
            case OPTIMIZED_INFO_STATUS?.SEEDING_POST?.CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={true}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            seedingPost:
                              OPTIMIZED_INFO_STATUS?.SEEDING_POST?.NOT_CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        seedingPost:
                          OPTIMIZED_INFO_STATUS?.SEEDING_POST?.NOT_CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            case OPTIMIZED_INFO_STATUS?.SEEDING_POST?.NOT_CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={false}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            seedingPost:
                              OPTIMIZED_INFO_STATUS?.SEEDING_POST?.CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        seedingPost:
                          OPTIMIZED_INFO_STATUS?.SEEDING_POST?.CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            default: {
              return null;
            }
          }
        },
      },
      {
        accessorKey: "reviewStore",
        header: "reviewStore",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-optimized-info"],
            style: {
              "--mrt-row-hover-background-color": "#ffffff",
            },
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-optimized-info"],
          };
        },
        Header: () => {
          return (
            <Group
              dir="column"
              style={{
                padding: "10px",
                gap: 2,
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                O - P3
              </Text>
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Review Store
              </Text>
            </Group>
          );
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const { optimizedInfo } = payload || {};
          const price =
            optimizedInfo?.reviewStore ||
            OPTIMIZED_INFO_STATUS?.REVIEW_STORE?.NOT_CHECKED;
          switch (price) {
            case OPTIMIZED_INFO_STATUS?.REVIEW_STORE?.DONE: {
              return <Button disabled={true}>DONE</Button>;
            }
            case OPTIMIZED_INFO_STATUS?.REVIEW_STORE?.CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={true}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            reviewStore:
                              OPTIMIZED_INFO_STATUS?.REVIEW_STORE?.NOT_CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        reviewStore:
                          OPTIMIZED_INFO_STATUS?.REVIEW_STORE?.NOT_CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            case OPTIMIZED_INFO_STATUS?.REVIEW_STORE?.NOT_CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={false}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            reviewStore:
                              OPTIMIZED_INFO_STATUS?.REVIEW_STORE?.CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        reviewStore:
                          OPTIMIZED_INFO_STATUS?.REVIEW_STORE?.CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            default: {
              return null;
            }
          }
        },
      },
      {
        accessorKey: "custom",
        header: "Custom",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-optimized-info"],
            style: {
              "--mrt-row-hover-background-color": "#ffffff",
            },
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-optimized-info"],
          };
        },
        Header: () => {
          return (
            <Group
              dir="column"
              style={{
                padding: "10px",
                gap: 2,
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                O - P4
              </Text>
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Tối ưu Custom
              </Text>
            </Group>
          );
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const { optimizedInfo } = payload || {};
          const price =
            optimizedInfo?.custom || OPTIMIZED_INFO_STATUS?.CUSTOM?.NOT_CHECKED;
          switch (price) {
            case OPTIMIZED_INFO_STATUS?.CUSTOM?.DONE: {
              return <Button disabled={true}>DONE</Button>;
            }
            case OPTIMIZED_INFO_STATUS?.CUSTOM?.CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={true}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            custom: OPTIMIZED_INFO_STATUS?.CUSTOM?.NOT_CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        custom: OPTIMIZED_INFO_STATUS?.CUSTOM?.NOT_CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            case OPTIMIZED_INFO_STATUS?.CUSTOM?.NOT_CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={false}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            custom: OPTIMIZED_INFO_STATUS?.CUSTOM?.CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        custom: OPTIMIZED_INFO_STATUS?.CUSTOM?.CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            default: {
              return null;
            }
          }
        },
      },
      {
        accessorKey: "targetAndBudget",
        header: "Target & Budget",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-optimized-info"],
            style: {
              "--mrt-row-hover-background-color": "#ffffff",
            },
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-optimized-info-light-color"],
          };
        },
        Header: () => {
          return (
            <Group
              dir="column"
              style={{
                padding: "10px",
                gap: 2,
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                O - M1
              </Text>
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Target + Budget
              </Text>
            </Group>
          );
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const { optimizedInfo } = payload || {};
          const price =
            optimizedInfo?.targetAndBudget ||
            OPTIMIZED_INFO_STATUS?.TARGET_AND_BUDGET?.NOT_CHECKED;
          switch (price) {
            case OPTIMIZED_INFO_STATUS?.TARGET_AND_BUDGET?.DONE: {
              return <Button disabled={true}>DONE</Button>;
            }
            case OPTIMIZED_INFO_STATUS?.TARGET_AND_BUDGET?.CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={true}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            targetAndBudget:
                              OPTIMIZED_INFO_STATUS?.TARGET_AND_BUDGET
                                ?.NOT_CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        targetAndBudget:
                          OPTIMIZED_INFO_STATUS?.TARGET_AND_BUDGET?.NOT_CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            case OPTIMIZED_INFO_STATUS?.TARGET_AND_BUDGET?.NOT_CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={false}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            targetAndBudget:
                              OPTIMIZED_INFO_STATUS?.TARGET_AND_BUDGET?.CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        targetAndBudget:
                          OPTIMIZED_INFO_STATUS?.TARGET_AND_BUDGET?.CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            default: {
              return null;
            }
          }
        },
      },
      {
        accessorKey: "requestVideo",
        header: "Request Video",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-optimized-info"],
            style: {
              "--mrt-row-hover-background-color": "#ffffff",
            },
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-optimized-info-light-color"],
          };
        },
        Header: () => {
          return (
            <Group
              dir="column"
              style={{
                padding: "10px",
                gap: 2,
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                O - M2
              </Text>
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Request Video
              </Text>
            </Group>
          );
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const { optimizedInfo } = payload || {};
          const price =
            optimizedInfo?.requestVideo ||
            OPTIMIZED_INFO_STATUS?.REQUEST_VIDEO?.NOT_CHECKED;
          switch (price) {
            case OPTIMIZED_INFO_STATUS?.REQUEST_VIDEO?.DONE: {
              return <Button disabled={true}>DONE</Button>;
            }
            case OPTIMIZED_INFO_STATUS?.REQUEST_VIDEO?.CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={true}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            requestVideo:
                              OPTIMIZED_INFO_STATUS?.REQUEST_VIDEO?.NOT_CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        requestVideo:
                          OPTIMIZED_INFO_STATUS?.REQUEST_VIDEO?.NOT_CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            case OPTIMIZED_INFO_STATUS?.REQUEST_VIDEO?.NOT_CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={false}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            requestVideo:
                              OPTIMIZED_INFO_STATUS?.REQUEST_VIDEO?.CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        requestVideo:
                          OPTIMIZED_INFO_STATUS?.REQUEST_VIDEO?.CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            default: {
              return null;
            }
          }
        },
      },
      {
        accessorKey: "ascAndAPS",
        header: "ASC & APS",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-optimized-info"],
            style: {
              "--mrt-row-hover-background-color": "#ffffff",
            },
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-optimized-info-light-color"],
          };
        },
        Header: () => {
          return (
            <Group
              dir="column"
              style={{
                padding: "10px",
                gap: 2,
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                O - M3
              </Text>
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                ASC/APS
              </Text>
            </Group>
          );
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const { optimizedInfo } = payload || {};
          const price =
            optimizedInfo?.ascAndAPS ||
            OPTIMIZED_INFO_STATUS?.ASC_AND_APS?.NOT_CHECKED;
          switch (price) {
            case OPTIMIZED_INFO_STATUS?.ASC_AND_APS?.DONE: {
              return <Button disabled={true}>DONE</Button>;
            }
            case OPTIMIZED_INFO_STATUS?.ASC_AND_APS?.CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={true}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            ascAndAPS:
                              OPTIMIZED_INFO_STATUS?.ASC_AND_APS?.NOT_CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        ascAndAPS:
                          OPTIMIZED_INFO_STATUS?.ASC_AND_APS?.NOT_CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            case OPTIMIZED_INFO_STATUS?.ASC_AND_APS?.NOT_CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={false}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            ascAndAPS:
                              OPTIMIZED_INFO_STATUS?.ASC_AND_APS?.CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        ascAndAPS: OPTIMIZED_INFO_STATUS?.ASC_AND_APS?.CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            default: {
              return null;
            }
          }
        },
      },
      {
        accessorKey: "strategy",
        header: "Strategy",
        size: 130,
        maxSize: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: ({ row }) => {
          return {
            className: classes["body-cells-optimized-info"],
            style: {
              "--mrt-row-hover-background-color": "#ffffff",
            },
          };
        },
        mantineTableHeadCellProps: () => {
          return {
            className: classes["head-cells-optimized-info-light-color"],
          };
        },
        Header: () => {
          return (
            <Group
              dir="column"
              style={{
                padding: "10px",
                gap: 2,
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                O - M4
              </Text>
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Chiến thuật #
              </Text>
            </Group>
          );
        },
        Cell: ({ row }) => {
          const uid = row.original.uid;
          const payload = find(data, { uid });
          const { optimizedInfo } = payload || {};
          const price =
            optimizedInfo?.strategy ||
            OPTIMIZED_INFO_STATUS?.STRATEGY?.NOT_CHECKED;
          switch (price) {
            case OPTIMIZED_INFO_STATUS?.STRATEGY?.DONE: {
              return <Button disabled={true}>DONE</Button>;
            }
            case OPTIMIZED_INFO_STATUS?.STRATEGY?.CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={true}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            strategy:
                              OPTIMIZED_INFO_STATUS?.STRATEGY?.NOT_CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        strategy: OPTIMIZED_INFO_STATUS?.STRATEGY?.NOT_CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            case OPTIMIZED_INFO_STATUS?.STRATEGY?.NOT_CHECKED: {
              return (
                <Checkbox
                  size="lg"
                  styles={{
                    body: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                  checked={false}
                  onChange={() => {
                    const newData = data.map((item) => {
                      if (item.uid === uid) {
                        return {
                          ...item,
                          optimizedInfo: {
                            ...item.optimizedInfo,
                            strategy: OPTIMIZED_INFO_STATUS?.STRATEGY?.CHECKED,
                          },
                        };
                      }
                      return item;
                    });
                    setTableData(newData);
                    handleUpdatePODDashboard(uid, {
                      optimizedInfo: {
                        ...payload.optimizedInfo,
                        strategy: OPTIMIZED_INFO_STATUS?.STRATEGY?.CHECKED,
                      },
                    });
                  }}
                />
              );
            }
            default: {
              return null;
            }
          }
        },
      },
    ],
    [data]
  );

  const table = useMantineReactTable({
    columns,
    data,
    editDisplayMode: "cell",
    enablePagination: false,
    getRowId: (row) => row.id,
    enableRowSelection: false,
    enableFilters: false,
    enableToolbarInternalActions: false,
    enableTopToolbar: false,
    enableColumnActions: false,
    mantineTableHeadCellProps: { className: classes["head-cells"] },
    mantineTableProps: {
      className: classes["disable-hover"],
    },
    enableDensityToggle: false,
    state: {
      showProgressBars: loading,
      sorting,
      isLoading: loading,
    },
    mantineTableBodyCellProps: () => ({
      className: classes["body-cells"],
      sx: {
        cursor: "pointer",
      },
    }),
    onSortingChange: setSorting,
    enableColumnResizing: false,
    enableSorting: true,
    enableMultiSort: false,
    enableBottomToolbar: true,
    manualSorting: true,
    mantineBottomToolbarProps: () => {
      return {
        className: classes["bottom-toolbar"],
      };
    },
    // renderTopToolbar: () => {
    //   return (
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "end",
    //         alignItems: "center",
    //         padding: "10px 5px",
    //         gap: "10px",
    //         flexWrap: "wrap-reverse",
    //       }}
    //     >
    //       <Flex
    //         style={{
    //           gap: "8px",
    //           padding: "10px",
    //           borderRadius: "10px",
    //           flexWrap: "wrap",
    //         }}
    //       >
    //         <Button
    //           color="green"
    //           onClick={handleSubmitSKUOptimized}
    //           loading={loadingUpdateOptimized}
    //         >
    //           Đã báo đội ngũ
    //         </Button>
    //       </Flex>
    //     </div>
    //   );
    // },
    mantinePaperProps: {
      style: { "--mrt-row-hover-background-color": "#E1EAFF" },
    },
    renderBottomToolbarCustomActions: () => {
      return (
        <Button
          loading={loading}
          disabled={pagination.currentPage >= pagination.totalPages}
          onClick={() => {
            setPagination((prev) => ({
              ...prev,
              currentPage: prev.currentPage + 1,
            }));
            setIsLoadmore(true);
          }}
        >
          Load More
        </Button>
      );
    },
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: {
      style: {
        maxHeight: "550px",
      },
    },
  });

  return !isEmpty(tableData) ? <MantineReactTable table={table} /> : null;
};

export default OptimizedTableMode;
