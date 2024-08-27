import { Tabs } from "@mantine/core";
import { useState } from "react";
import MockupTask from "../MockupTask";
import OptimizedMockupTask from "../OptimizedMockupTask";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../../constant";
import { includes, map } from "lodash";

const Mockup = () => {
  const [activeTab, setActiveTab] = useState("mockup");
  let [permissions] = useLocalStorage({
    key: LOCAL_STORAGE_KEY.PERMISSIONS,
    defaultValue: [],
  });
  permissions = map(permissions, "name");
  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="mockup">Mockup Task</Tabs.Tab>
        <Tabs.Tab value="optimized">Optimized</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="mockup">
        {includes(permissions, "read:mockup") && <MockupTask />}
      </Tabs.Panel>
      <Tabs.Panel value="optimized">
        {includes(permissions, "read:optimized_mockup") && (
          <OptimizedMockupTask />
        )}
      </Tabs.Panel>
    </Tabs>
  );
};

export default Mockup;
