import {
  Button,
  Chip,
  Fieldset,
  Flex,
  Grid,
  LoadingOverlay,
  Pagination,
  TextInput,
  Box,
  Select,
  Checkbox,
} from "@mantine/core";
import styles from "./ManageAccounts.module.sass";
import cn from "classnames";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { isEmpty, map } from "lodash";
import { showNotification } from "../../utils/index";
import { IconFilterOff, IconSearch } from "@tabler/icons-react";
import { accountServices } from "../../services/accounts";

const ListAccounts = ({
  accounts,
  handleUpdateAccount,
  setQueryAccount,
  availableStores,
}) => {
  const [data, setData] = useState(accounts);
  const [searchCaption, setSearchCaption] = useState("");
  useEffect(() => {
    setData(accounts);
  }, [accounts]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 5px",
          flexWrap: "wrap-reverse",
          backgroundColor: "#EFF0F1",
          borderRadius: "10px",
          marginBottom: "10px",
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
            placeholder="Account/Category/Store ..."
            size="sm"
            leftSection={
              <span
                onClick={() => {
                  setQueryAccount({
                    keyword: searchCaption,
                  });
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
                width: "300px",
              },
            }}
            value={searchCaption}
            onChange={(e) => setSearchCaption(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setQueryAccount({
                  keyword: searchCaption,
                });
              }
            }}
          />
          <Button
            onClick={() => {
              setSearchCaption("");
              setQueryAccount({
                keyword: "",
              });
            }}
          >
            <IconFilterOff />
          </Button>
        </Flex>
      </div>
      <Grid>
        {map(data, (account) => (
          <Grid.Col span={4} key={account.uid}>
            <Fieldset
              legend="Thông tin"
              style={{
                display: "flex",
                gap: "10px",
                position: "relative",
              }}
            >
              <Flex
                style={{
                  position: "absolute",
                  top: "-24px",
                  right: "10px",
                  gap: "10px",
                }}
              >
                <Chip
                  checked={account.checked}
                  onChange={() => {
                    setData((prev) => {
                      return map(prev, (x) => {
                        if (x.uid === account.uid) {
                          return {
                            ...x,
                            checked: !x.checked,
                          };
                        }
                        return x;
                      });
                    });
                    handleUpdateAccount(account);
                  }}
                  color="red"
                  variant="filled"
                >
                  Update
                </Chip>
              </Flex>

              <Grid
                style={{
                  width: "100%",
                }}
              >
                <Grid.Col span={12}>
                  <Flex direction="column" gap="md">
                    <Checkbox
                      color="lime.4"
                      size="sm"
                      checked={account.active === 1}
                      label="Active"
                      onChange={(event) => {
                        setData((prev) => {
                          return map(prev, (x) => {
                            if (x.uid === account.uid) {
                              return {
                                ...x,
                                active: event.currentTarget.checked ? 1 : 2,
                              };
                            }
                            return x;
                          });
                        });
                      }}
                    />
                    <TextInput
                      label="ID"
                      placeholder="Id"
                      value={account.uid}
                      styles={{
                        label: {
                          marginBottom: "5px",
                        },
                      }}
                      readOnly
                    />
                    <TextInput
                      label="Name"
                      placeholder="Name"
                      value={account.name}
                      readOnly
                      styles={{
                        label: {
                          marginBottom: "5px",
                        },
                      }}
                    />
                    <Select
                      data={availableStores}
                      label="Store"
                      value={account?.attribute?.store}
                      onChange={(value) => {
                        setData((prev) => {
                          return map(prev, (x) => {
                            if (x.uid === account.uid) {
                              return {
                                ...x,
                                attribute: {
                                  ...x.attribute,
                                  store: value,
                                },
                              };
                            }
                            return x;
                          });
                        });
                      }}
                    />
                    <Select
                      data={["POD", "Politics"]}
                      label="Category"
                      value={account.category}
                      onChange={(value) => {
                        setData((prev) => {
                          return map(prev, (x) => {
                            if (x.uid === account.uid) {
                              return {
                                ...x,
                                category: value,
                              };
                            }
                            return x;
                          });
                        });
                      }}
                    />
                  </Flex>
                </Grid.Col>
              </Grid>
            </Fieldset>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};

const ManageAccounts = () => {
  const [accountsPagination, setAccountsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [accounts, setAccounts] = useState([]);
  const [availableStores, setAvailableStores] = useState([]);
  const [queryAccount, setQueryAccount] = useState("");
  const [loadingAccount, setLoadingAccount] = useState(false);

  const fetchAccounts = async (page) => {
    setLoadingAccount(true);
    const { data, metadata } = await accountServices.fetchAllAccounts({
      limit: 6,
      page,
      query: queryAccount,
    });
    if (isEmpty(data)) {
      setLoadingAccount(false);
      setAccounts([]);
      setAccountsPagination({
        currentPage: 1,
        totalPages: 1,
      });
      return;
    }
    setLoadingAccount(false);
    setAccounts(
      map(data, (x) => ({
        ...x,
        checked: false,
      })) || []
    );
    setAvailableStores(metadata.pamStores);
    setAccountsPagination(metadata);
    return;
  };

  useEffect(() => {
    fetchAccounts(accountsPagination.currentPage);
  }, [accountsPagination.currentPage, queryAccount]);

  const handlePageChangeCaption = (page) => {
    setAccountsPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleUpdateAccount = async (account) => {
    const result = await accountServices.updateAccount({
      ...account,
      id: account.uid,
    });
    if (result) {
      showNotification("Thành công", "Update caption thành công", "green");
    }
    await fetchAccounts(accountsPagination.currentPage);
  };
  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={loadingAccount}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Card
          className={cn(styles.card, styles.clipArtCard)}
          title="Danh sách Accounts"
          classTitle="title-green"
          classCardHead={styles.classCardHead}
          classSpanTitle={styles.classScaleSpanTitle}
        >
          <ListAccounts
            accounts={accounts}
            handleUpdateAccount={handleUpdateAccount}
            setQueryAccount={setQueryAccount}
            availableStores={availableStores}
            title="Chọn Product Base"
          />
          <Pagination
            total={accountsPagination.totalPages}
            page={accountsPagination.currentPage}
            onChange={handlePageChangeCaption}
            color="pink"
            size="md"
            style={{ marginTop: "20px", marginLeft: "auto" }}
          />
        </Card>
      </Box>
    </>
  );
};

export default ManageAccounts;
