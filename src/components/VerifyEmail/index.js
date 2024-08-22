import { useAuth0 } from "@auth0/auth0-react";
import { ActionIcon, Tooltip } from "@mantine/core";
import React from "react";
import { IconLogout } from "@tabler/icons-react";
import { LOCAL_STORAGE_KEY } from "../../constant/localStorage";
import { useLocalStorage } from "../../hooks";

const EmailVerify = () => {
  const { logout } = useAuth0();
  const [token, setToken, removeToken] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.ACCESS_TOKEN,
    defaultValue: "",
  });
  const [userPermissions, setPermissions, removePermissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  return (
    <div
      style={{
        padding: "1rem",
        position: "relative",
        backgroundColor: "black",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        color: "#54FE55",
        textShadow: "0px 0px 10px",
        fontSize: "6rem",
        flexDirection: "column",
        fontFamily: "'Press Start 2P', cursive",
        boxSizing: "border-box",
      }}
    >
      <div>401</div>
      <div
        style={{
          fontSize: "1.8rem",
        }}
      >
        Please Verify Email<span style={blinkStyle}>_</span>
      </div>
      <Tooltip label="Đăng xuất" withArrow>
        <ActionIcon
          variant="filled"
          size="xl"
          color="#54FE55"
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
          }}
          onClick={() => {
            removeToken();
            removePermissions();
            logout();
          }}
        >
          <IconLogout color="#1A1D1F" />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

// Define the blink style separately for reusability
const blinkStyle = {
  animation: "blink 1s infinite",
};

export default EmailVerify;
