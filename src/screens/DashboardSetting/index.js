import React, { useEffect, useState } from "react";
import styles from "./DashboardSetting.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import { filter, map, orderBy, toLower } from "lodash";
import { Flex, Grid, Tabs, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { artistServices, dashboardServices } from "../../services";
import DesignerTable from './DesignerTable'
import QuotaOP from "./QuotaOP";
import QuotaBD from "./QuotaBD";

const TABS_VIEW = {
  DESIGNER: "Designer",
  EPM: "EPM",
  MOCKUP: "Mockup",
  ARTIST: "Artist",
}

const DashboardSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [visible, setVisible] = useState(true);
  const [defaultQuota, setDefaultQuota] = useState([]);
  const [defaultQuotaDemand, setDefaultQuotaDemand] = useState([]);
  const [dashboardSettings, setDashboardSettings] = useState([]);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });
  const [query, setQuery] = useState({
    status: [1],
    statusValue: "Undone",
  });
  const [sorting, setSorting] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [loadingFetchDashboardSettings, setLoadingFetchDashboardSettings] = useState(false);

  const fetchDashboardSettings = async () => {
    setLoadingFetchDashboardSettings(true);
    const response = await dashboardServices.fetchDashboardsSetting({
      page: -1,
      query,
      limit: 30,
    });
    const { data } = response;
    if (data) {
      setDashboardSettings(
        orderBy(filter(data, (item) => item.team === toLower(activeTab)), ["no"], ["asc"])
      );
    } else {
      setDashboardSettings([]);
    }
    setLoadingFetchDashboardSettings(false);
    setTrigger(false);
  };
  const fetchDefaultQuota = async () => {
    const response = await dashboardServices.fetchDefaultQuota({
      page: -1,
      query: {},
      limit: 30,
    });
    const { data } = response;
    if (data) {
      setDefaultQuota(data);
    } else {
      setDefaultQuota([]);
    }
  }
  const fetchDefaultQuotaDemand = async () => {
    const response = await dashboardServices.fetchDefaultQuotaDemand({
      page: -1,
      query: {},
      limit: 30,
    });
    const { data } = response;
    if (data) {
      setDefaultQuotaDemand(data);
    } else {
      setDefaultQuotaDemand([]);
    }
  }
  useEffect(() => {
    fetchDashboardSettings(pagination.currentPage);
  }, [search, query, trigger, sorting]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, navigate]);

  const [activeTab, setActiveTab] = useState(TABS_VIEW.DESIGNER);
  useEffect(() => {
    fetchDefaultQuota()
    fetchDefaultQuotaDemand()
  }, [])

  return (
    <>
      <Card
        className={styles.card}
        title="DASHBOARD - Setting"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
      >
        <Grid>
          <Grid.Col span="12">
            <Text align="center" size="xl" fw={700}>
              TIME CỦA CÁC LOẠI ĐỀ
            </Text>
          </Grid.Col>
          <Grid.Col span="12">
            <Tabs value={activeTab} onChange={setActiveTab} style={{
              width: "100%",
            }}>
              <Tabs.List>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0px",
                    gap: "10px",
                    flexWrap: "wrap-reverse",
                    width: "100%",
                  }}
                >
                  <Flex
                    style={{
                      gap: "8px",
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor: "#EFF0F1",
                      flexWrap: "wrap",
                      width: "100%",
                    }}
                  >
                    <Tabs.Tab value={TABS_VIEW.DESIGNER} styles={{
                      ...(activeTab === TABS_VIEW.DESIGNER && {
                        tab: {
                          backgroundColor: "#7C4DFF",
                          color: "#fff",
                          borderRadius: "10px",
                        }
                      })
                    }}>{
                        TABS_VIEW.DESIGNER}</Tabs.Tab>
                    <Tabs.Tab value={TABS_VIEW.ARTIST} styles={{
                      ...(activeTab === TABS_VIEW.ARTIST && {
                        tab: {
                          backgroundColor: "#7C4DFF",
                          color: "#fff",
                          borderRadius: "10px",
                        }
                      })
                    }}>{TABS_VIEW.ARTIST}</Tabs.Tab>
                    <Tabs.Tab value={TABS_VIEW.MOCKUP} styles={{
                      ...(activeTab === TABS_VIEW.MOCKUP && {
                        tab: {
                          backgroundColor: "#7C4DFF",
                          color: "#fff",
                          borderRadius: "10px",
                        }
                      })
                    }}>{TABS_VIEW.MOCKUP}</Tabs.Tab>
                    <Tabs.Tab value={TABS_VIEW.EPM} styles={{
                      ...(activeTab === TABS_VIEW.EPM && {
                        tab: {
                          backgroundColor: "#7C4DFF",
                          color: "#fff",
                          borderRadius: "10px",
                        }
                      })
                    }}>{TABS_VIEW.EPM}</Tabs.Tab>
                  </Flex>
                </div>
              </Tabs.List>
              <Tabs.Panel value={TABS_VIEW.DESIGNER}>
                <DesignerTable
                  className={styles.Table}
                  tableData={dashboardSettings}
                  query={query}
                  setQuery={setQuery}
                  loadingFetchDashboardSettings={loadingFetchDashboardSettings}
                  setTrigger={setTrigger}
                  setSorting={setSorting}
                  sorting={sorting}
                />
              </Tabs.Panel>
              <Tabs.Panel value={TABS_VIEW.ARTIST}>Second panel</Tabs.Panel>
              <Tabs.Panel value="first">First panel</Tabs.Panel>
              <Tabs.Panel value={TABS_VIEW.ARTIST}>Second panel</Tabs.Panel>
            </Tabs>

          </Grid.Col>
        </Grid>
      </Card>
      <Card
        className={styles.quotaCard}
        title="Quota"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
      >
        <Grid>
          <Grid.Col span="5">
            <Flex justify="center" style={{
              marginBottom: "20px",
            }}>
              <Text align="center" size="xl" fw={700}>DEFAULT QUOTA (OP)</Text>
            </Flex>
            <QuotaOP
              className={styles.Table}
              tableData={defaultQuota}
              query={query}
              setQuery={setQuery}
              loadingFetchDashboardSettings={loadingFetchDashboardSettings}
              setTrigger={setTrigger}
              setSorting={setSorting}
              sorting={sorting}
            />
          </Grid.Col>
          <Grid.Col span="7">
            <Flex justify="center" style={{
              marginBottom: "20px",
            }}>
              <Text align="center" size="xl" fw={700}>DEFAULT QUOTA (BD)</Text>
            </Flex>
            <QuotaBD
              className={styles.Table}
              tableData={defaultQuotaDemand}
              defaultQuota={defaultQuota}
              query={query}
              setQuery={setQuery}
              loadingFetchDashboardSettings={loadingFetchDashboardSettings}
              setTrigger={setTrigger}
              setSorting={setSorting}
              sorting={sorting}
            />
          </Grid.Col>

        </Grid>
      </Card>
    </>
  );
};

export default DashboardSetting;
