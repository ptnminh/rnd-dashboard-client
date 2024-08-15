import React, { useState } from "react";
import styles from "./Sidebar.module.sass";
import { Link, NavLink } from "react-router-dom";
import cn from "classnames";
import Icon from "../Icon";
import Dropdown from "./Dropdown";
import { Logo } from "./logo";
import { ActionIcon, Avatar, Group, Tooltip } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocalStorage } from "@mantine/hooks";
import { NAVIGATION } from "../../Routes";
import { every, map } from "lodash";

const filterNavigation = (navigation, permissions) => {
  return navigation
    .filter((item) => every(item?.permissions, (p) => permissions.includes(p)))
    .map((item) => {
      if (item.dropdown) {
        item.dropdown = filterNavigation(item.dropdown, permissions);
      }
      return item;
    });
};
const Sidebar = ({ className, onClose }) => {
  const [visible, setVisible] = useState(false);
  const { logout, user } = useAuth0();
  const [token, setToken, removeToken] = useLocalStorage({
    key: "token",
    defaultValue: "",
  });
  const [userPermissions, setPermissions, removePermissions] = useLocalStorage({
    key: "permissions",
    defaultValue: [],
  });

  const userName =
    user?.family_name && user?.given_name
      ? user?.family_name + " " + user?.given_name
      : user.nickname;
  const filteredNavigation = filterNavigation(NAVIGATION, userPermissions);
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
        <button className={styles.toggle} onClick={() => setVisible(!visible)}>
          <Icon name="arrow-right" size="24" />
          <Icon name="close" size="24" />
        </button>
      </div>
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: "30px",
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
          <Tooltip label={`${userName}`} withArrow>
            <Avatar
              color="cyan"
              variant="filled"
              radius="xl"
              size="lg"
              src={user?.picture}
            />
          </Tooltip>
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
    </>
  );
};

export default Sidebar;
