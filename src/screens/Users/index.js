import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  Button,
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
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconDots,
  IconBrandSamsungpass,
  IconSquareRoundedCheck,
  IconTrash,
  IconPlus,
  IconSearch,
  IconFilterOff,
  IconMailFilled,
} from "@tabler/icons-react";
import classes from "./User.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import cn from "classnames";
import styles from "./User.module.sass";
import Card from "../../components/Card";
import moment from "moment-timezone";
import { Controller, useForm } from "react-hook-form";
import { BD_TEAMS, LOCAL_STORAGE_KEY, MEMBER_POSITIONS } from "../../constant";
import { userServices } from "../../services/users";
import { showNotification } from "../../utils/index";
import {
  compact,
  filter,
  find,
  keys,
  map,
  omit,
  toLower,
  toNumber,
  toUpper,
  uniq,
  values,
} from "lodash";
import { toPascalCase } from "../../utils";

const AssignPermissions = ({ closeModal, user, setTriggerFetchUsers }) => {
  const [currentUserPermissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  const [loadingAssignPermissions, setLoadingAssignPermissions] =
    useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState(
    user?.permissions || []
  );
  const updateUserPermission = async () => {
    setLoadingAssignPermissions(true);
    const response = await userServices.update({
      uid: user?.uid,
      data: {
        ...user,
        permissions: selectedPermissions,
      },
    });
    if (response) {
      showNotification("Thành công", "Cập nhật thành công", "green");
      closeModal();
      setTriggerFetchUsers(true);
    }
    setLoadingAssignPermissions(false);
  };
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
                setSelectedPermissions(currentUserPermissions);
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
                setSelectedPermissions([]);
              }}
            >
              None
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
                setSelectedPermissions(user?.permissions || []);
              }}
            >
              Roll Back
            </Button>
          </Group>
        </Flex>
      </Grid.Col>
      <Grid.Col span={12}>
        <MultiSelect
          data={map(currentUserPermissions, (x) => {
            return {
              value: x.name,
              label: x.description,
            };
          })}
          withAsterisk
          withScrollArea={true}
          maxDropdownHeight={300}
          value={map(selectedPermissions, "name")}
          onChange={(selectedNames) => {
            setSelectedPermissions(
              currentUserPermissions?.filter((perm) =>
                selectedNames.includes(perm.name)
              )
            );
          }}
          searchable
          clearable
          scrollAreaProps={{
            h: "200px",
            scrollbars: "y",
            scrollbarSize: "sm",
          }}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Button
          color="rgb(63, 89, 228)"
          w="100%"
          loading={loadingAssignPermissions}
          onClick={updateUserPermission}
        >
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
  roles,
  setTriggerFetchUsers,
  currentUser,
}) => {
  const [loadingCreateUser, setLoadingCreateUser] = useState(false);
  const [permissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
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
      permissions: [],
      position: "",
      name: "",
      team: "",
    },
  });

  const onSubmit = async (data) => {
    setLoadingCreateUser(true);
    const role = find(roles, { name: data.role });
    const payload = {
      ...data,
      connection: "Username-Password-Authentication",
      roleId: role?.uid,
      ...(data?.position && { position: toLower(data.position) }),
    };
    const createUserResponse = await userServices.createUser(payload);
    if (createUserResponse) {
      showNotification("Thành công", "Tạo người dùng thành công", "green");
      closeModal();
    }
    setLoadingCreateUser(false);
    setTriggerFetchUsers(true);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <Grid.Col
          span={12}
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
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
            {...register("name", {
              required: "Trường này là bắt buộc",
            })}
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
            {...register("shortName")}
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
            {...register("email", {
              required: "Trường này là bắt buộc",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Email không hợp lệ",
              },
            })}
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
            {...register("password", {
              required: "Trường này là bắt buộc",
              // require First letter to be uppercase
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                message:
                  "Mật khẩu phải có ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt và ít nhất 8 ký tự",
              },
            })}
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
            {...register("confirmPassword", {
              required: "Trường này là bắt buộc",
              validate: (value) =>
                value === getValues("password") || "Mật khẩu không khớp",
            })}
            error={
              errors.confirmPassword ? errors.confirmPassword.message : null
            }
          />
        </Grid.Col>
        <Grid.Col
          span={12}
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <Controller
            name="role"
            control={control}
            rules={{ required: "Trường này là bắt buộc" }}
            render={({ field }) => (
              <Select
                {...field}
                withAsterisk
                data={
                  currentUser?.role
                    ? compact(
                        uniq(
                          map(
                            filter(
                              roles,
                              (x) =>
                                toNumber(x.level) <
                                toNumber(currentUser?.roleInfo?.level)
                            ),
                            (role) => role?.name
                          )
                        )
                      )
                    : compact(uniq(map(roles, (role) => role?.name)))
                }
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
          <Controller
            name="position"
            control={control}
            rules={{ required: "Trường này là bắt buộc" }}
            render={({ field }) => (
              <Select
                {...field}
                withAsterisk
                data={
                  toLower(currentUser?.role) === "admin" || !currentUser?.role
                    ? map(values(MEMBER_POSITIONS), (value) =>
                        toPascalCase(value)
                      )
                    : [
                        toPascalCase(
                          MEMBER_POSITIONS[toUpper(currentUser?.position)]
                        ),
                      ]
                }
                withScrollArea={true}
                maxDropdownHeight={300}
                label="Select Position"
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
                error={errors.position ? errors.position.message : null}
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
                    setValue("permissions", permissions);
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
              <MultiSelect
                {...field}
                data={map(permissions, (perm) => ({
                  value: perm.name, // Using 'name' as the value for submission
                  label: perm.description, // Display 'description' in the dropdown
                }))}
                withAsterisk
                error={errors.permissions ? errors.permissions.message : null}
                clearable
                searchable
                onChange={(selectedNames) => {
                  // Map selected descriptions back to full objects
                  const selectedPermissions = permissions.filter((perm) =>
                    selectedNames.includes(perm.name)
                  );
                  field.onChange(selectedPermissions); // Set the selected permissions as full objects
                }}
                value={field.value.map((perm) => perm.name)} // Convert selected objects back to 'name' for display
                maxDropdownHeight={200}
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
          <Button
            color="rgb(63, 89, 228)"
            w="100%"
            type="submit"
            loading={loadingCreateUser}
          >
            Create
          </Button>
        </Grid.Col>
      </Grid>
    </form>
  );
};

const UpdateUser = ({ closeModal, user, roles, setTriggerFetchUsers }) => {
  const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
  const [permissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    defaultValues: {
      email: user?.email,
      password: user?.password,
      confirmPassword: user?.password,
      role: user?.role,
      permissions: user?.permissions,
      position: toUpper(user?.position),
      name: user?.name,
      team: user?.team,
      shortName: user?.shortName,
    },
  });

  const onSubmit = async (data) => {
    setLoadingUpdateUser(true);
    const role = find(roles, { name: data.role });
    const payload = {
      ...data,
      connection: "Username-Password-Authentication",
      roleId: role?.uid,
      ...(data?.position && { position: toLower(data.position) }),
    };
    const createUserResponse = await userServices.update({
      uid: user?.uid,
      data: {
        ...user,
        ...omit(payload, "confirmPassword"),
      },
    });
    if (createUserResponse) {
      showNotification("Thành công", "Tạo người dùng thành công", "green");
      setTriggerFetchUsers(true);
      closeModal();
    }
    setLoadingUpdateUser(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <Grid.Col
          span={12}
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
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
            {...register("name", { required: "Trường này là bắt buộc" })}
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
            {...register("shortName")}
            error={errors.shortName ? errors.shortName.message : null}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            placeholder="email@example.com"
            required
            name="email"
            label="Email"
            readOnly
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
            {...register("email", {
              required: "Trường này là bắt buộc",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Email không hợp lệ",
              },
            })}
            error={errors.email ? errors.email.message : null}
          />
        </Grid.Col>
        <Grid.Col
          span={12}
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
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
          <Controller
            name="position"
            control={control}
            rules={{ required: "Trường này là bắt buộc" }}
            render={({ field }) => (
              <Select
                {...field}
                withAsterisk
                data={map(values(MEMBER_POSITIONS), (value) => toUpper(value))}
                value={field.value}
                withScrollArea={true}
                maxDropdownHeight={300}
                label="Select Position"
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
                error={errors.position ? errors.position.message : null}
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
                    setValue("permissions", permissions);
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
            render={({ field }) => (
              <MultiSelect
                {...field}
                data={map(permissions, (perm) => ({
                  value: perm.name, // Using 'name' as the value for submission
                  label: perm.description, // Display 'description' in the dropdown
                }))}
                withAsterisk
                error={errors.permissions ? errors.permissions.message : null}
                clearable
                searchable
                onChange={(selectedNames) => {
                  // Map selected descriptions back to full objects
                  const selectedPermissions = permissions.filter((perm) =>
                    selectedNames.includes(perm.name)
                  );
                  field.onChange(selectedPermissions); // Set the selected permissions as full objects
                }}
                value={field.value.map((perm) => perm.name)} // Convert selected objects back to 'name' for display
                maxDropdownHeight={200}
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
                value={field.value}
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
          <Button
            color="rgb(63, 89, 228)"
            w="100%"
            type="submit"
            loading={loadingUpdateUser}
          >
            Update
          </Button>
        </Grid.Col>
      </Grid>
    </form>
  );
};

const UpdatePassword = ({ closeModal, user }) => {
  const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data) => {
    setLoadingUpdatePassword(true);
    const payload = {
      ...data,
    };
    const updatePasswordResponse = await userServices.updatePassword({
      uid: user?.uid,
      data: {
        ...omit(payload, "confirmPassword"),
      },
    });
    if (updatePasswordResponse) {
      showNotification("Thành công", "Cập nhật mật khẩu thành công", "green");
      closeModal();
    }
    setLoadingUpdatePassword(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
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
            {...register("password", {
              required: "Trường này là bắt buộc",
              // require First letter to be uppercase
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                message:
                  "Mật khẩu phải có ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt và ít nhất 8 ký tự",
              },
            })}
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
            {...register("confirmPassword", {
              required: "Trường này là bắt buộc",
              validate: (value) =>
                value === getValues("password") || "Mật khẩu không khớp",
            })}
            error={
              errors.confirmPassword ? errors.confirmPassword.message : null
            }
          />
        </Grid.Col>
        <Grid.Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            color="rgb(63, 89, 228)"
            w="100%"
            type="submit"
            loading={loadingUpdatePassword}
          >
            Update
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
  UPDATE_PASSWORD: "Update Password",
  UPDATE_USER: "Update User",
};

const UserScreen = () => {
  const [loadingFetchUsers, setLoadingFetchUsers] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [loadingSendEmail, setLoadingSendEmail] = useState(false);
  const [roles, setRoles] = useState([]);
  const [queryUser, setQueryUser] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [triggerFetchUsers, setTriggerFetchUsers] = useState(false);
  const [action, setAction] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const fetchUsers = async (page = 1) => {
    setLoadingFetchUsers(true);
    const response = await userServices.fetchUsers({
      page,
      limit: 20,
      query: queryUser,
    });
    if (response) {
      const { data, metadata } = response;
      setPagination(metadata);
      setUsers(map(data, (x, index) => ({ ...x, id: index + 1 })));
    } else {
      setUsers([]);
      setPagination({ currentPage: 1, totalPages: 1 });
    }
    setTriggerFetchUsers(false);
    setLoadingFetchUsers(false);
  };
  const fetchRoles = async () => {
    const { data, metadata } = await userServices.fetchRoles();
    if (data) {
      setRoles(data);
      setCurrentUser(metadata?.currentUser);
    }
  };
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };
  const handleResendEmailVerify = async () => {
    setLoadingSendEmail(true);
    const response = await userServices.resendEmailVerification(
      selectedUser?.uid
    );
    if (response) {
      showNotification("Thành công", "Gửi email thành công", "green");
      close();
    }
    setLoadingSendEmail(false);
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
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
          const { name, email, imageSrc } = row.original;
          return (
            <Flex
              style={{
                gap: "10px",
                height: "60px",
              }}
              onClick={() => {
                setSelectedUser(row.original);
                setAction(ACTIONS.UPDATE_USER);
                open();
              }}
            >
              <Image
                src={imageSrc}
                alt={name}
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
                  {name}
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
        accessorKey: "team",
        header: "Team",
        accessorFn: (row) => row?.team,
        size: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "role",
        header: "Role",
        accessorFn: (row) => row?.role,
        size: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "position",
        accessorFn: (row) => toUpper(row?.position),
        header: "Position",
        size: 50,
        enableEditing: false,
        enableSorting: false,
        mantineTableBodyCellProps: { className: classes["body-cells"] },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        accessorFn: (row) =>
          moment(row?.createdAt).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"),
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
                    <IconBrandSamsungpass
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={() => {
                    setAction(ACTIONS.UPDATE_PASSWORD);
                    setSelectedUser(row.original);
                    open();
                  }}
                >
                  Change Password
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconMailFilled
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={() => {
                    setAction(ACTIONS.RESEND_EMAIL_VERIFICATION);
                    setSelectedUser(row.original);
                    open();
                  }}
                >
                  Resend Email
                </Menu.Item>

                <Menu.Item
                  leftSection={
                    <IconSquareRoundedCheck
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  onClick={() => {
                    setAction(ACTIONS.ASSIGN_PERMISSIONS);
                    setSelectedUser(row.original);
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

  const [keyword, setKeyword] = useState("");
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
            zindex: 10,
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
            <TextInput
              placeholder="Keyword"
              size="sm"
              width="200px"
              leftSection={
                <span
                  onClick={() => {
                    setQueryUser({ ...queryUser, keyword });
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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setQueryUser({ ...queryUser, keyword });
                }
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
              value={queryUser?.team}
              onChange={(value) => setQueryUser({ ...queryUser, team: value })}
              clearable
              onClear={() => {
                setQueryUser({
                  ...queryUser,
                  team: null,
                });
              }}
            />
            <Select
              placeholder="Position"
              data={keys(MEMBER_POSITIONS) || []}
              styles={{
                input: {
                  width: "150px",
                },
              }}
              value={queryUser?.position}
              onChange={(value) =>
                setQueryUser({
                  ...queryUser,
                  position: toLower(value),
                })
              }
              clearable
              onClear={() => {
                setQueryUser({
                  ...queryUser,
                  position: null,
                });
              }}
            />
            <Select
              placeholder="Role"
              data={uniq(map(roles, "name")) || []}
              styles={{
                input: {
                  width: "150px",
                },
              }}
              value={queryUser?.role}
              onChange={(value) =>
                setQueryUser({
                  ...queryUser,
                  role: value,
                })
              }
              clearable
              onClear={() => {
                setQueryUser({
                  ...queryUser,
                  role: null,
                });
              }}
            />
            <Button
              onClick={() => {
                setQueryUser({
                  keyword: null,
                  team: null,
                  position: null,
                  role: null,
                });
                setKeyword("");
              }}
            >
              <IconFilterOff />
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
    fetchUsers(pagination.currentPage);
  }, [triggerFetchUsers, pagination.currentPage, queryUser]);
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
        {action === ACTIONS.ASSIGN_PERMISSIONS && (
          <AssignPermissions
            closeModal={close}
            user={selectedUser}
            setTriggerFetchUsers={setTriggerFetchUsers}
          />
        )}
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
        {action === ACTIONS.RESEND_EMAIL_VERIFICATION && (
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
              <Button
                color="rgb(63, 89, 228)"
                w="100%"
                onClick={handleResendEmailVerify}
                loading={loadingSendEmail}
              >
                Resend Email Verification
              </Button>
            </Grid.Col>
          </Grid>
        )}
        {action === ACTIONS.CREATE_USER && (
          <CreateUser
            closeModal={close}
            roles={roles}
            setTriggerFetchUsers={setTriggerFetchUsers}
            currentUser={currentUser}
          />
        )}
        {action === ACTIONS.UPDATE_PASSWORD && (
          <UpdatePassword closeModal={close} user={selectedUser} />
        )}
        {action === ACTIONS.UPDATE_USER && (
          <UpdateUser
            closeModal={close}
            user={selectedUser}
            roles={roles}
            setTriggerFetchUsers={setTriggerFetchUsers}
          />
        )}
      </Modal>
    </Card>
  );
};

export default UserScreen;
