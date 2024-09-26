import React, { useState } from "react";
import styles from "./Sidebar.module.sass";
import { Link, NavLink } from "react-router-dom";
import cn from "classnames";
import Icon from "../Icon";
import Dropdown from "./Dropdown";
import { Logo } from "./logo";
import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Grid,
  Group,
  Menu,
  Modal,
  PasswordInput,
  rem,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { IconLogout, IconBrandSamsungpass } from "@tabler/icons-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDisclosure } from "@mantine/hooks";
import { NAVIGATION, PATH_NAMES } from "../../Routes";
import { filter, isEmpty, map, omit, some } from "lodash";
import { LOCAL_STORAGE_KEY } from "../../constant";
import { userServices } from "../../services/users";
import { useForm } from "react-hook-form";
import { showNotification } from "../../utils/index";
import { useLocalStorage } from "../../hooks";

const filterNavigation = (navigation, permissions) => {
  return navigation
    .filter(
      (item) =>
        some(item?.permissions, (p) => permissions.includes(p)) ||
        isEmpty(item?.permissions)
    )
    .map((item) => {
      if (item.dropdown) {
        item.dropdown = filterNavigation(item.dropdown, permissions);
      }
      return item;
    });
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
      uid: user?.sub,
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
const Sidebar = ({ className, onClose }) => {
  const [visible, setVisible] = useState(false);
  const { logout, user } = useAuth0();
  const [opened, { open, close }] = useDisclosure(false);
  const [token, setToken, removeToken] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
    defaultValue: "",
  });
  const [permissions, setPermissions, removePermissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  const [userInfo, setUserInfo, removeUserInfo] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.USER_INFO,
    defaultValue: {},
  });
  const userPermissions = map(permissions, "name");
  const filteredNavigation = filterNavigation(NAVIGATION, userPermissions)?.map(
    (item) => {
      if (item.dropdown) {
        return {
          ...item,
          dropdown: filter(
            item?.dropdown,
            (subItem) => !(subItem?.dropdown && subItem?.dropdown?.length === 0)
          ),
        };
      }
      return item;
    }
  );
  return (
    <>
      <div
        className={cn(styles.sidebar, className, { [styles.active]: visible })}
      >
        <button className={styles.close} onClick={onClose}>
          <Icon name="close" size="24" />
        </button>
        <Link className={styles.logo} to="/" onClick={onClose}>
          <Logo />
        </Link>
        <ScrollArea
          scrollbars="y"
          scrollbarSize={4}
          scrollHideDelay={1000}
          style={{ height: "80%" }}
        >
          <div className={styles.menu}>
            {map(filteredNavigation, (x, index) =>
              x.url ? (
                <>
                  <NavLink
                    className={styles.item}
                    activeClassName={styles.active}
                    to={x.url}
                    key={index}
                    exact
                    onClick={onClose}
                  >
                    <Icon name={x.icon} size="24" />
                    {x.title}
                  </NavLink>
                </>
              ) : (
                <Dropdown
                  className={styles.dropdown}
                  visibleSidebar={visible}
                  setValue={setVisible}
                  key={index}
                  item={x}
                  onClose={onClose}
                />
              )
            )}
          </div>
        </ScrollArea>
        <button className={styles.toggle} onClick={() => setVisible(!visible)}>
          <Icon name="arrow-right" size="24" />
          <Icon name="close" size="24" />
        </button>
      </div>
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: "10px",
          cursor: "pointer",
          width: "290px",
          padding: "24px",
        }}
      >
        <Group
          style={{
            justifyContent: "space-between",
          }}
        >
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Flex direction="column" gap="5px">
                <Avatar
                  color="cyan"
                  variant="filled"
                  radius="xl"
                  size="lg"
                  src={user?.picture}
                />
              </Flex>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconBrandSamsungpass
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
                onClick={() => {
                  open();
                }}
              >
                Change Password
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Tooltip label="Đăng xuất" withArrow>
            <ActionIcon
              variant="filled"
              size="xl"
              color="#EFEFEF"
              onClick={() => {
                removeToken();
                removePermissions();
                logout();
              }}
            >
              <IconLogout color="#1A1D1F" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="md"
        title={"Change Password"}
      >
        <UpdatePassword closeModal={close} user={user} />
      </Modal>
    </>
  );
};

export default Sidebar;
