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
  MultiSelect,
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
  IconMail
} from "@tabler/icons-react";
import classes from "./User.module.css";
import { useDisclosure } from "@mantine/hooks";
import cn from "classnames";
import styles from "./User.module.sass";
import Card from "../../components/Card";
import { mockUsers } from "../../mocks/viewers";
import moment from "moment-timezone";
import { mockPermissions } from "../../mocks/permissions";
import { Controller, useForm, useWatch } from "react-hook-form";
import { BD_TEAMS } from "../../constant";
import { userServices } from "../../services/users";
import { showNotification } from "../../utils/index";
import { compact, filter, find, includes, map, uniq } from "lodash";

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

const CreateUser = ({
  closeModal,
  roles
}) => {
  const [loadingCreateUser, setLoadingCreateUser] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      permissions: []
    }
  });
  // Watch for changes to the role
  const selectedRole = useWatch({
    control,
    name: "role", // Track changes to the role field
  });
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const onSubmit = async (data) => {
    setLoadingCreateUser(true);
    const role = find(roles, { name: data.role });
    const payload = {
      ...data,
      connection: "Username-Password-Authentication",
      roleId: role?.uid,
      permissions: filter(role?.permissions, (permission) => {
        return includes(data.permissions, permission?.name)
      })
    }
    console.log(payload);
    const createUserResponse = await userServices.createUser(payload);
    if (createUserResponse) {
      showNotification("Thành công", "Tạo người dùng thành công", "green");
      closeModal()
    }
    setLoadingCreateUser(false);
  }
  // Update permissions when the role changes
  useEffect(() => {
    if (selectedRole) {
      const rolePermissions = find(roles, { name: selectedRole })?.permissions || [];
      setAvailablePermissions(rolePermissions); // Set available permissions for the selected role
      setValue("permissions", []); // Reset permissions when role changes
    }
  }, [selectedRole]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <Grid.Col span={12} style={{
          display: "flex",
          gap: "20px"
        }}>
          <TextInput
            required
            withAsterisk
            name="name"
            label="Name"
            placeholder="John Doe"
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
            {
            ...register("name", {
              required: "Trường này là bắt buộc",
            })
            }
            error={errors.name ? errors.name.message : null}
          />
          <TextInput
            name="shortName"
            label="Short Name"
            placeholder="Member RnD để tạo Brief"
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
            {
            ...register("shortName")
            }
            error={errors.shortName ? errors.shortName.message : null}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            placeholder="email@example.com"
            required
            name="email"
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
            {
            ...register("email", {
              required: "Trường này là bắt buộc",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Email không hợp lệ",
              },
            })
            }
            error={errors.email ? errors.email.message : null}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <PasswordInput
            required
            name="password"
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
            {
            ...register("password", {
              required: "Trường này là bắt buộc",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
              // require First letter to be uppercase
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                message: "Mật khẩu phải có ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt",
              },
            })
            }
            error={errors.password ? errors.password.message : null}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <PasswordInput
            required
            name="confirmPassword"
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
            {
            ...register("confirmPassword", {
              required: "Trường này là bắt buộc",
              validate: (value) =>
                value === getValues("password") || "Mật khẩu không khớp",
            })
            }
            error={errors.confirmPassword ? errors.confirmPassword.message : null}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Controller
            name="role"
            control={control}
            rules={{ required: "Trường này là bắt buộc" }}
            render={({ field }) => (
              <Select
                {...field}
                withAsterisk
                data={compact(uniq(map(roles, (role) => role?.name))) || []}
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
                error={errors.role ? errors.role.message : null}
                clearable
              />
            )}
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
                  onClick={() => {
                    setValue("permissions", map(availablePermissions, (permission) => permission?.name));
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
                  onClick={() => {
                    setValue("permissions", []);
                  }}
                >
                  None
                </Button>
              </Group>
            </Group>
          </Flex>
          <Controller
            name="permissions"
            control={control}
            rules={{ required: "Trường này là bắt buộc" }}
            render={({ field }) => (
              <TagsInput
                withAsterisk
                {...field}
                data={map(availablePermissions, "name")}
                withScrollArea={true}
                maxDropdownHeight={100}
                name="permissions"
                error={errors.permissions ? errors.permissions.message : null}
                clearable
              />
            )}
          />

        </Grid.Col>
        <Grid.Col span={12}>
          <Controller
            name="team"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                data={BD_TEAMS}
                withScrollArea={true}
                maxDropdownHeight={300}
                label="Select Team"
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
                error={errors.team ? errors.team.message : null}
                clearable
              />
            )}
          />
        </Grid.Col>
        <Grid.Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button color="rgb(63, 89, 228)" w="95%" type="submit" loading={loadingCreateUser}>
            Create
          </Button>
        </Grid.Col>
      </Grid>
    </form>

  );
};

const ACTIONS = {
  ASSIGN_NEW_ROLE: "Assign New Role",
  ASSIGN_PERMISSIONS: "Add Permissions",
  VIEW_DETAILS: "VIEW_DETAILS",
  DELETE_ACCOUNT: "Delete Account",
  CREATE_USER: "Create User",
  RESEND_EMAIL_VERIFICATION: "Resend Email Verification",
};

const UserScreen = () => {
  const [loadingFetchUsers, setLoadingFetchUsers] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [triggerFetchUsers, setTriggerFetchUsers] = useState(false);
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
    setTriggerFetchUsers(false);
    setLoadingFetchUsers(false);
  };
  const fetchRoles = async () => {
    const { data } = await userServices.fetchRoles();
    if (data) {
      setRoles(data);
    }
  }
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
                  onClick={() => { }}
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
                    <IconMail
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={() => {
                    setAction(ACTIONS.RESEND_EMAIL_VERIFICATION);
                    open();
                  }}
                >
                  Resend Email
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
  }, [triggerFetchUsers, pagination.currentPage]);
  useEffect(() => {
    fetchRoles();
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
        {
          action === ACTIONS.RESEND_EMAIL_VERIFICATION && (
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
                  Are you sure you want to resend email verification?
                </Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Button color="rgb(63, 89, 228)" w="100%">
                  Resend Email Verification
                </Button>
              </Grid.Col>
            </Grid>
          )
        }
        {action === ACTIONS.CREATE_USER && <CreateUser closeModal={close} roles={roles} />}
      </Modal>
    </Card>
  );
};

export default UserScreen;
