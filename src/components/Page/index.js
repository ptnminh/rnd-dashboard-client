import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Page.module.sass";
import Sidebar from "../Sidebar";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { readLocalStorageValue, useLocalStorage } from "@mantine/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { NAVIGATION } from "../../Routes";
import { forEach, intersection } from "lodash";
import { LOCAL_STORAGE_KEY } from "../../constant";
import { authServices } from "../../services/auth";

const findNavigationItem = (navigation, pathname) => {
  let result = null;

  forEach(navigation, (item) => {
    if (item.pathname === pathname || item.url === pathname) {
      result = item;
      return false; // exit loop
    }
    if (item.dropdown) {
      result = findNavigationItem(item.dropdown, pathname);
      if (result) return false; // exit loop
    }
  });

  return result;
};
const Page = ({ wide, children, title }) => {
  const [visible, setVisible] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [isForbidden, setIsForbidden] = useState(true);

  const { pathname } = useLocation();

  const [permissions, setPermissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });

  const [token, setToken] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
    defaultValue: "",
  });
  const fetchData = async () => {
    if (isAuthenticated) {
      try {
        let auth0Token = readLocalStorageValue({ key: "token" });
        if (!auth0Token) {
          auth0Token = await getAccessTokenSilently();
          setToken(auth0Token);
        }
        const { data } = await authServices.verifyToken(auth0Token);
        const userPermissions = data?.permissions || [];
        setPermissions(userPermissions || []);
        const matchNavigation = findNavigationItem(NAVIGATION, pathname);
        if (matchNavigation) {
          const { permissions } = matchNavigation;
          if (!intersection(userPermissions, permissions).length) {
            setIsForbidden(true);
            navigate("/forbidden");
          } else {
            setIsForbidden(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [isAuthenticated, getAccessTokenSilently]);
  return !isForbidden ? (
    <div className={styles.page}>
      <Sidebar
        className={cn(styles.sidebar, { [styles.visible]: visible })}
        onClose={() => setVisible(false)}
      />
      <div className={styles.inner}>
        <div
          className={cn(styles.container, {
            [styles.wide]: wide,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  ) : null;
};

export default withAuthenticationRequired(Page);
