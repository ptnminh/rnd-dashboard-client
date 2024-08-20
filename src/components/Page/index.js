import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Page.module.sass";
import Sidebar from "../Sidebar";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { readLocalStorageValue, useLocalStorage } from "@mantine/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { NAVIGATION } from "../../Routes";
import { find, forEach, includes, intersection, isEmpty, map } from "lodash";
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
const Page = ({ wide, children }) => {
  const [visible, setVisible] = useState(false);
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
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
        let auth0Token = readLocalStorageValue({
          key: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        });
        let userPermissions = readLocalStorageValue({
          key: LOCAL_STORAGE_KEY.PERMISSIONS,
        });
        if (!auth0Token) {
          auth0Token = await getAccessTokenSilently();
          setToken(auth0Token);
        }
        if (isEmpty(userPermissions)) {
          const { data } = await authServices.verifyToken(auth0Token);
          setPermissions(data?.permissions || []);
          userPermissions = data?.permissions || [];
        }
        const matchNavigation = findNavigationItem(NAVIGATION, pathname);
        if (matchNavigation) {
          const { permissions } = matchNavigation;
          if (
            !intersection(map(userPermissions, "name"), permissions).length !==
            0
          ) {
            if (isEmpty(userPermissions)) {
              setIsForbidden(true);
              navigate("/forbidden");
            } else {
              const foundFirstRoute = find(
                NAVIGATION,
                (item) =>
                  !isEmpty(
                    intersection(map(userPermissions, "name"), item.permissions)
                  )
              ); // find first route that user has permission
              if (foundFirstRoute) {
                setIsForbidden(false);
                navigate(foundFirstRoute.pathname || foundFirstRoute.url);
              } else {
                setIsForbidden(true);
                navigate("/forbidden");
              }
            }
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
    if (user?.email_verified === true) {
      fetchData();
    } else {
      navigate("/verify-email");
    }
  }, [isAuthenticated]);
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
