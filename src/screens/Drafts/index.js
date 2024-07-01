import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Drafts.module.sass";
import Card from "../../components/Card";
import Form from "../../components/Form";
import Schedule from "../../components/Schedule";
import DuplicateCampaign from "./Schedule";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "./Table";
import { Box, LoadingOverlay, Pagination, Text } from "@mantine/core";
import Icon from "../../components/Icon";
import { isEmpty, map } from "lodash";
import { campaignServices } from "../../services";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "../../utils/index";
import Modal from "../../components/Modal";
import { modals } from "@mantine/modals";
import TextInput from "../../components/TextInput";

const CampaignHistories = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialPage = parseInt(queryParams.get("page") || "1", 10);
  const [search, setSearch] = useState(initialSearch);
  const [visibleModalDuplicate, setVisibleModalDuplicate] = useState(false);
  const [visibleModalSchedule, setVisibleModalSchedule] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [stores, setStores] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [duplicateCampaignResult, setDuplicateCampaignResult] = useState("");
  const [visibleCampaignResult, setVisibleCampaignResult] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
  });

  const [
    visibleLoadingCampaignHistories,
    {
      open: openLoadingCampaignHistories,
      close: closeLoadingCampaignHistories,
    },
  ] = useDisclosure(false);

  const openModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDuplicateCampaigns(),
    });

  const fetchCampaigns = async (page = 1) => {
    openLoadingCampaignHistories();
    try {
      const response = await campaignServices.getCampaignHistories({
        search,
        page,
      });
      const { data, pagination } = response;

      if (data) {
        setCampaigns(data);
        setPagination(pagination);
      } else {
        showNotification("Thất bại", "Không tìm thấy Campaigns", "red");
      }
    } catch (error) {
      showNotification("Thất bại", "Có lỗi xảy ra", "red");
    } finally {
      closeLoadingCampaignHistories();
    }
  };

  useEffect(() => {
    fetchCampaigns(pagination.currentPage);
    setSelectedFilters([]);
  }, [search, pagination.currentPage]);

  useEffect(() => {
    // Update the URL when search or page changes
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, pagination.currentPage, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSelectedFilters([]);
    fetchCampaigns(1);
  };

  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleChangeCampaignName = (id) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllCampaigns = () => {
    setSelectedFilters((prev) =>
      isEmpty(prev) ? map(campaigns, (x) => x.campaignName) : []
    );
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleDuplicateCampaigns = async () => {
    console.log(selectedFilters);
    console.log(stores);
    openLoadingCampaignHistories();
    try {
      const response = await campaignServices.duplicateCampaigns({
        campaignNames: selectedFilters,
        stores,
      });
      if (response) {
        showNotification(
          "Thành công",
          "Duplicate Campaigns thành công",
          "blue"
        );
        setSearch("");
        fetchCampaigns(1);
        setSelectedFilters([]);
        setVisibleCampaignResult(true);
        setDuplicateCampaignResult(response.data);
        setStores([]);
      } else {
        showNotification("Thất bại", "Duplicate Campaigns thất bại", "red");
      }
    } catch (error) {
      showNotification("Thất bại", "Có lỗi xảy ra", "red");
    } finally {
      closeLoadingCampaignHistories();
    }
  };

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={visibleLoadingCampaignHistories}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Card
          className={styles.card}
          classCardHead={styles.head}
          title="Campaigns History"
          classTitle={cn("title-purple", styles.title)}
          head={
            <>
              <Form
                className={styles.form}
                value={search}
                setValue={setSearch}
                onSubmit={handleSubmit}
                placeholder="Search Campaign"
                type="text"
                name="search"
                icon="search"
              />
              {!isEmpty(selectedFilters) && (
                <>
                  <div
                    style={{
                      marginLeft: "auto",
                    }}
                  >
                    <button
                      className={cn(
                        "button-stroke-red button-small",
                        styles.clearButton
                      )}
                      style={{ cursor: "pointer", marginLeft: "auto" }}
                      onClick={() => setVisibleModalDuplicate(true)}
                      disabled={isEmpty(selectedFilters)}
                    >
                      <Icon name="share" size="16" />
                      <span>Duplicate</span>
                    </button>
                    <button
                      className={cn(
                        "button-stroke-purple button-small",
                        styles.clearButton
                      )}
                      style={{ cursor: "pointer", marginLeft: "10px" }}
                      onClick={() => setVisibleModalSchedule(true)}
                      disabled={isEmpty(selectedFilters)}
                    >
                      <Icon name="schedule" size="16" />
                      <span>Schedule</span>
                    </button>
                  </div>
                </>
              )}
            </>
          }
        >
          <div className={styles.wrapper}>
            <Table
              items={campaigns}
              title="Last edited"
              handleChangeCampaignName={handleChangeCampaignName}
              selectedFilters={selectedFilters}
              visibleModalDuplicate={visibleModalDuplicate}
              setVisibleModalDuplicate={setVisibleModalDuplicate}
              handleSelectAllCampaigns={handleSelectAllCampaigns}
              stores={stores}
              setStores={setStores}
            />
          </div>
        </Card>
        <Pagination
          total={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="pink"
          size="md"
          style={{ marginTop: "20px", marginLeft: "auto" }}
        />
        <Modal
          visible={visibleModalSchedule}
          onClose={() => setVisibleModalSchedule(false)}
        >
          <Schedule
            startDate={startDate}
            setStartDate={setStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
            title={"Schedule Campaign"}
            note={"Chọn ngày và giờ trong tương lai muốn publish campaign"}
          />
        </Modal>
        <Modal
          visible={visibleModalDuplicate}
          onClose={() => setVisibleModalDuplicate(false)}
        >
          <DuplicateCampaign
            stores={stores}
            setStores={setStores}
            onConfirm={openModal}
            setVisibleModalDuplicate={setVisibleModalDuplicate}
          />
        </Modal>
      </Box>
      {duplicateCampaignResult && visibleCampaignResult && (
        <Box style={{ marginTop: 20 }}>
          <Card
            className={cn(styles.card)}
            title="Kết quả"
            classTitle="title-red"
            head={
              <div className={cn(styles.nav, "tablet-hide")}>
                <div
                  className={cn(styles.link, {
                    [styles.active]: visibleCampaignResult,
                  })}
                  onClick={() => setVisibleCampaignResult(false)}
                  style={{ cursor: "pointer" }}
                >
                  Hide
                </div>
              </div>
            }
          >
            <TextInput
              className={styles.maximumCamp}
              name="duplicateCampaignResult"
              type="text"
              label={"Chi tiết kết quả"}
              isTextArea={true}
              value={duplicateCampaignResult}
            />
          </Card>
        </Box>
      )}
    </>
  );
};

export default CampaignHistories;
