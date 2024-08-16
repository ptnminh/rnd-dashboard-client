import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Menu,
  Modal,
  Pagination,
  PasswordInput,
  rem,
  Select,
  TagsInput,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconDots,
  IconEye,
  IconUserCheck,
  IconSquareRoundedCheck,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import classes from "./User.module.css";
import { useDisclosure } from "@mantine/hooks";
import cn from "classnames";
import styles from "./User.module.sass";
import Card from "../../components/Card";
import { mockUsers } from "../../mocks/viewers";
import moment from "moment-timezone";
import { mockPermissions } from "../../mocks/permissions";

const AssignPermissions = () => {
  return (
    <Grid>
      <Grid.Col span={12}>
        <Flex align="center" justify="space-between">
          <Text
            style={{
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: "1.57143",
              letterSpacing: "0em",
              color: "rgb(25, 25, 25)",
            }}
          >
            Selected Permissions
          </Text>
        </Flex>
        <Grid.Col span={12}>
          <TagsInput
            data={mockPermissions}
            withScrollArea={true}
            maxDropdownHeight={300}
            value={["create:brief", "create:mkt_camp"]}
          />
        </Grid.Col>

        <Divider style={{ margin: "10px 0" }} />
        <Flex align="center" justify="space-between">
          <Text
            style={{
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: "1.57143",
              letterSpacing: "0em",
              color: "rgb(25, 25, 25)",
            }}
          >
            Permissions
          </Text>
          <Group>
            <Text
              style={{
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: "1.57143",
                letterSpacing: "0em",
                color: "rgb(25, 25, 25)",
              }}
            >
              Select:
            </Text>
            <Group>
              <Button
                size="xs"
                color="gray"
                variant="outline"
                style={{
                  border: 0,
                  color: "rgb(52, 73, 186)",
                }}
              >
                All
              </Button>
              <Text>|</Text>
              <Button
                size="xs"
                color="gray"
                variant="outline"
                style={{
                  border: 0,
                  color: "rgb(52, 73, 186)",
                }}
              >
                None
              </Button>
            </Group>
          </Group>
        </Flex>
      </Grid.Col>
      <Grid.Col span={12}>
        <TagsInput
          data={mockPermissions}
          withScrollArea={true}
          maxDropdownHeight={300}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Button color="rgb(63, 89, 228)" w="100%">
          Add Permissions
        </Button>
      </Grid.Col>
    </Grid>
  );
};

const AssignNewRole = () => {
  return (
    <Grid>
      <Grid.Col span={12}>
        <Grid.Col span={12}>
          <Select
            data={["Admin", "Manager", "Lead", "User"]}
            withScrollArea={true}
            maxDropdownHeight={300}
            label="Select Role"
            styles={{
              label: {
                marginBottom: "10px",
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: "1.57143",
                letterSpacing: "0em",
                color: "rgb(25, 25, 25)",
              },
            }}
          />
        </Grid.Col>
      </Grid.Col>
      <Grid.Col
        span={12}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button color="rgb(63, 89, 228)" w="95%">
          Assign New Role
        </Button>
      </Grid.Col>
    </Grid>
  );
};

const CreateUser = () => {
  return (
    <Grid>
      <Grid.Col span={12}>
        <TextInput
          placeholder="email@example.com"
          required
          label="Email"
          styles={{
            label: {
              marginBottom: "10px",
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: "1.57143",
              letterSpacing: "0em",
              color: "rgb(25, 25, 25)",
            },
          }}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <PasswordInput
          required
          label="Password"
          styles={{
            label: {
              marginBottom: "10px",
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: "1.57143",
              letterSpacing: "0em",
              color: "rgb(25, 25, 25)",
            },
          }}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <PasswordInput
          required
          label="Confirm Password"
          styles={{
            label: {
              marginBottom: "10px",
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: "1.57143",
              letterSpacing: "0em",
              color: "rgb(25, 25, 25)",
            },
          }}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Select
          data={["Admin", "Manager", "Lead", "User"]}
          withScrollArea={true}
          maxDropdownHeight={300}
          label="Select Role"
          styles={{
            label: {
              marginBottom: "10px",
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: "1.57143",
              letterSpacing: "0em",
              color: "rgb(25, 25, 25)",
            },
          }}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Flex align="center" justify="space-between">
          <Text
            style={{
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: "1.57143",
              letterSpacing: "0em",
              color: "rgb(25, 25, 25)",
            }}
          >
            Permissions
          </Text>
          <Group>
            <Text
              style={{
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: "1.57143",
                letterSpacing: "0em",
                color: "rgb(25, 25, 25)",
              }}
            >
              Select:
            </Text>
            <Group>
              <Button
                size="xs"
                color="gray"
                variant="outline"
                style={{
                  border: 0,
                  color: "rgb(52, 73, 186)",
                }}
              >
                All
              </Button>
              <Text>|</Text>
              <Button
                size="xs"
                color="gray"
                variant="outline"
                style={{
                  border: 0,
                  color: "rgb(52, 73, 186)",
                }}
              >
                None
              </Button>
            </Group>
          </Group>
        </Flex>
        <TagsInput
          data={mockPermissions}
          withScrollArea={true}
          maxDropdownHeight={300}
        />
      </Grid.Col>
      <Grid.Col
        span={12}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button color="rgb(63, 89, 228)" w="95%">
          Create
        </Button>
      </Grid.Col>
    </Grid>
  );
};

const ACTIONS = {
  ASSIGN_NEW_ROLE: "Assign New Role",
  ASSIGN_PERMISSIONS: "Add Permissions",
  VIEW_DETAILS: "VIEW_DETAILS",
  DELETE_ACCOUNT: "Delete Account",
  CREATE_USER: "Create User",
};

const UserScreen = () => {
  const [loadingFetchUsers, setLoadingFetchUsers] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [users, setUsers] = useState([]);
  const [action, setAction] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const fetchUsers = async (page = 1) => {
    setLoadingFetchUsers(true);
    // const response = await userServices.fetchUsers({
    //   page,
    //   limit: 30,
    // });
    const response = true;
    if (response) {
      //   const { data } = response;
      setUsers(mockUsers);
    }
    setLoadingFetchUsers(false);
  };
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        accessorFn: (row) => 1,
        mantineTableHeadCellProps: {
          align: "right",
        },
        size: 50,
        header: "No",
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 130,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        Cell: ({ row }) => {
          const { given_name, family_name, email, picture, nickname } =
            row.original;
          return (
            <Flex
              style={{
                gap: "10px",
                height: "60px",
              }}
            >
              <Image
                src={picture}
                alt={nickname}
                width={40}
                height="80%"
                radius="xl"
              />
              <Group
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "5px",
                  height: "100%",
                }}
              >
                <Text
                  style={{
                    color: "rgb(52, 73, 186)",
                    cursor: "pointer",
                  }}
                >
                  {!given_name && !family_name
                    ? nickname
                    : `${given_name} ${family_name}`}
                </Text>
                <Text
                  style={{
                    color: "rgb(104, 104, 104)",
                  }}
                >
                  {email}
                </Text>
              </Group>
            </Flex>
          );
        },
      },
      {
        accessorKey: "logins_count",
        header: "Logins",
        accessorFn: (row) => row?.logins_count,
        size: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "role",
        header: "Role",
        accessorFn: (row) => row?.role?.name || "Admin",
        size: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tham gia",
        accessorFn: (row) => moment(row?.created_at).format("DD/MM/YYYY"),
        size: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "remove",
        header: "Action",
        enableSorting: false,
        size: 50,
        mantineTableHeadCellProps: { className: classes["remove"] },
        mantineTableBodyCellProps: { className: classes["body-cells"] },
        enableEditing: false,
        Cell: ({ row }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  variant="filled"
                  color="#ffffff"
                  size="sx"
                  disabled={row.original.key === "budget"}
                  onClick={() => {}}
                >
                  <IconDots color="rgb(25, 25, 25)" />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconEye style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  View
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconUserCheck
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={() => {
                    setAction(ACTIONS.ASSIGN_NEW_ROLE);
                    open();
                  }}
                >
                  Assign New Role
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSquareRoundedCheck
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={() => {
                    setAction(ACTIONS.ASSIGN_PERMISSIONS);
                    open();
                  }}
                >
                  Assign Permissions
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={() => {
                    setAction(ACTIONS.DELETE_ACCOUNT);
                    open();
                  }}
                >
                  Delete account
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        ),
      },
    ],
    [users]
  );

  const table = useMantineReactTable({
    columns,
    data: users,
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
      showProgressBars: loadingFetchUsers,
    },
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
              color="rgb(52, 73, 186)"
              leftSection={
                <IconPlus style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => {
                setAction(ACTIONS.CREATE_USER);
                open();
              }}
            >
              Create User
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
    fetchUsers();
  }, []);

  return (
    <Card
      className={cn(styles.card, styles.clipArtCard)}
      title="Users"
      classTitle="title-green"
      classCardHead={styles.classCardHead}
      classSpanTitle={styles.classScaleSpanTitle}
    >
      <MantineReactTable table={table} />
      <Pagination
        total={pagination.totalPages}
        page={pagination.currentPage}
        onChange={handlePageChange}
        color="pink"
        size="md"
        style={{ marginTop: "20px", marginLeft: "auto" }}
      />
      <Modal
        opened={opened}
        onClose={close}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="md"
        title={action}
      >
        {action === ACTIONS.ASSIGN_PERMISSIONS && <AssignPermissions />}
        {action === ACTIONS.ASSIGN_NEW_ROLE && <AssignNewRole />}
        {action === ACTIONS.DELETE_ACCOUNT && (
          <Grid>
            <Grid.Col span={12}>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  lineHeight: "1.57143",
                  letterSpacing: "0em",
                  color: "rgb(25, 25, 25)",
                }}
              >
                Are you sure you want to delete this account?
              </Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Button color="red" w="100%">
                Delete Account
              </Button>
            </Grid.Col>
          </Grid>
        )}
        {action === ACTIONS.CREATE_USER && <CreateUser />}
      </Modal>
    </Card>
  );
};

export default UserScreen;
