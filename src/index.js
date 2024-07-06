import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "mantine-react-table/styles.css"; //import MRT styles
import "react-tooltip/dist/react-tooltip.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LicenseInfo } from "@mui/x-license";

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUIX_LISENCE_KEY);

const container = document.getElementById("root");
const queryClient = new QueryClient();
if (!container) {
  console.error("Root container missing in index.html");
} else {
  const root = createRoot(container);

  root.render(
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </MantineProvider>{" "}
    </QueryClientProvider>
  );
}
