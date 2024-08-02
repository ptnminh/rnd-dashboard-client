import {
  Autocomplete,
  Button,
  Fieldset,
  Grid,
  Modal,
  ScrollArea,
  TagsInput,
  Text,
} from "@mantine/core";
import styles from "./RootCampaign.module.sass";
import cn from "classnames";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { concat, filter, find, isEmpty, map } from "lodash";
import { accountServices } from "../../services/accounts";
import { campaignServices } from "../../services";
import { showNotification } from "../../utils/index";
import { useDisclosure } from "@mantine/hooks";
import CampaignTable from "./CampaignTable";
import { modals } from "@mantine/modals";
import CampaignsInfoTable from "./Campaigns";
const SampleSamples = ({
  campaigns,
  selectedSampleCampaign,
  setSelectedSampleCampaign,
  handleSelectSampleCampaign,
  setVisible,
  visible,
  setCollections,
  openModal,
  setEditCampaign,
  editAccountName,
  setEditAccountName,
  handleSaveNewAccountName,
  openModalConfirmDeleteSampleCampaign,
  openModalAddCampaign,
  openModalDeleteCampaign,
}) => {
  return (
    <Grid columns={12}>
      <Grid.Col span={4}>
        <Card
          className={styles.card}
          classCardHead={styles.cardHead}
          title="Accounts"
          classTitle={cn("title-purple", styles.title)}
          head={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #4E83FD",
                  cursor: "pointer",
                }}
                onClick={() => {
                  openModal();
                }}
              >
                <IconPlus color="#4E83FD" />
              </div>
            </div>
          }
        >
          <ScrollArea h={600} scrollbars="y" scrollbarSize={2}>
            <CampaignTable
              className={styles.table}
              activeTable={visible}
              setActiveTable={setVisible}
              setCollections={setCollections}
              collections={campaigns}
              setSelectedFilters={setSelectedSampleCampaign}
              handleSelectCollection={handleSelectSampleCampaign}
              selectedCollection={selectedSampleCampaign}
              setEditCollection={setEditAccountName}
              editCollectionName={editAccountName}
              setEditCollectionName={setEditCampaign}
              handleSaveNewCollectionName={handleSaveNewAccountName}
              openModalConfirmDeleteCollection={
                openModalConfirmDeleteSampleCampaign
              }
            />
          </ScrollArea>
        </Card>
      </Grid.Col>
      <Grid.Col span={8}>
        <Card
          className={styles.card}
          title="Campaigns"
          classTitle={cn("title-yellow", styles.title)}
          classCardHead={styles.cardHead}
          head={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #4E83FD",
                  cursor: "pointer",
                }}
                onClick={() => {
                  openModalAddCampaign();
                }}
              >
                <IconPlus color="#4E83FD" />
              </div>
            </div>
          }
        >
          <ScrollArea h={600} scrollbars="y" scrollbarSize={2}>
            <CampaignsInfoTable
              className={styles.table}
              activeTable={visible}
              setActiveTable={setVisible}
              setCollections={setCollections}
              productLines={
                find(campaigns, {
                  accountId: selectedSampleCampaign?.accountId,
                })?.campaigns || []
              }
              setSelectedFilters={setSelectedSampleCampaign}
              selectedFilters={selectedSampleCampaign}
              selectedCollection={selectedSampleCampaign}
              openModalDeleteCampaign={openModalDeleteCampaign}
            />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
const RootCampaign = () => {
  const [accounts, setAccounts] = useState([]);
  const [loadingCreateCampaign, setLoadingCreateCampaign] = useState(false);
  const [loadingFetchSampleCampaigns, setLoadingFetchSampleCampaigns] =
    useState(false);
  const [campaignInfo, setCampaignInfo] = useState({
    accountId: "",
    campaignIds: [],
  });
  const [sampleCampaignPagination, setSampleCampaignPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [sampleCampaigns, setSampleCampaigns] = useState();
  const [querySampleCampaigns, setQuerySampleCampaigns] = useState({
    keyword: "",
  });
  const fetchAllAccounts = async () => {
    const { data } = await accountServices.fetchAllAccounts({
      query: {
        ignoreAccounts: true,
      },
      page: 1,
      limit: -1,
    });
    setAccounts(data);
  };

  const fetchSampleCampaigns = async (page) => {
    setLoadingFetchSampleCampaigns(true);
    const { data, metadata } = await campaignServices.fetchSampleCampaigns({
      query: querySampleCampaigns,
      page,
      limit: 30,
    });
    if (!isEmpty(data)) {
      setSampleCampaigns(data);
      setSelectedSampleCampaign(data[0]);
      setSampleCampaignPagination(metadata);
    }
    setSampleCampaignPagination({
      currentPage: 1,
      totalPages: 1,
    });
    setLoadingFetchSampleCampaigns(false);
    console.log(data);
  };

  useEffect(() => {
    fetchAllAccounts();
  }, []);
  useEffect(() => {
    fetchSampleCampaigns(sampleCampaignPagination.currentPage);
  }, [sampleCampaignPagination.currentPage, querySampleCampaigns]);
  const handleCreateCampaign = async () => {
    console.log(campaignInfo);
    if (!campaignInfo.accountId || !campaignInfo.campaignIds.length) {
      showNotification("Thất bại", "Vui lòng nhập đủ thông tin", "red");
      return;
    }
    setLoadingCreateCampaign(true);
    const result = await campaignServices.createCampaign(campaignInfo);
    if (result) {
      showNotification("Thành công", "Tạo camp phôi thành công", "green");
      setCampaignInfo({
        accountId: "",
        campaignIds: [],
      });
      close();
    }
    await fetchSampleCampaigns(sampleCampaignPagination.currentPage);
    setLoadingCreateCampaign(false);
  };
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedModalAddCampaign,
    { open: openModalAddCampaign, close: closeModalAddCampaign },
  ] = useDisclosure(false);
  const handleSelectSampleCampaign = (accountId) => {
    setSelectedSampleCampaign(find(sampleCampaigns, { accountId }));
  };
  const [selectedSampleCampaign, setSelectedSampleCampaign] = useState([]);
  const [visible, setVisible] = useState(false);
  const handleSelectAllCampaigns = () => {};
  const [isCreateNewSampleCampaign, setIsCreateNewSampleCampaign] =
    useState(false);
  const [editCampaign, setEditCampaign] = useState({});
  const [editAccountName, setEditAccountName] = useState("");
  const handleSaveNewAccountName = async (newAccountName) => {};
  const handleRemoveSampleCampaign = async (uid) => {
    const result = await campaignServices.deleteSampleCampaign(uid);
    if (result) {
      showNotification("Thành công", "Xóa camp phôi thành công", "green");
      fetchSampleCampaigns(sampleCampaignPagination.currentPage);
    }
  };
  const openModalConfirmDeleteSampleCampaign = (uid) =>
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
      onConfirm: () => handleRemoveSampleCampaign(uid),
    });
  const openModalDeleteCampaign = (campaignId) => {
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
      onConfirm: () => handleRemoveCampaign(campaignId),
    });
  };
  const handleRemoveCampaign = async (campaignId) => {
    const campaignIds = filter(
      map(selectedSampleCampaign.campaigns, "campaignId"),
      (x) => x !== campaignId
    );
    if (isEmpty(campaignIds)) {
      const result = await campaignServices.deleteSampleCampaign(
        selectedSampleCampaign.uid
      );
      if (result) {
        const newCampaigns = map(sampleCampaigns, (campaign) => {
          if (campaign.accountId === selectedSampleCampaign.accountId) {
            return {
              ...campaign,
              campaigns: [],
            };
          }
          return campaign;
        });
        setSampleCampaigns(newCampaigns);
      }
      return;
    }
    const result = await campaignServices.createCampaign({
      accountId: selectedSampleCampaign.accountId,
      campaignIds,
    });
    if (result) {
      const newCampaigns = map(sampleCampaigns, (campaign) => {
        if (campaign.accountId === selectedSampleCampaign.accountId) {
          return {
            ...campaign,
            campaigns: filter(
              campaign.campaigns,
              (x) => x.campaignId !== campaignId
            ),
          };
        }
        return campaign;
      });
      setSampleCampaigns(newCampaigns);
    }
  };
  const handleAddCampaign = async () => {
    console.log(campaignInfo);
    if (!campaignInfo.campaignIds.length) {
      showNotification("Thất bại", "Vui lòng nhập đủ thông tin", "red");
      return;
    }
    const result = await campaignServices.createCampaign({
      accountId: selectedSampleCampaign.accountId,
      campaignIds: concat(
        map(selectedSampleCampaign?.campaigns, "campaignId"),
        campaignInfo.campaignIds
      ),
    });
    if (result) {
      setCampaignInfo({
        accountId: "",
        campaignIds: [],
      });
      closeModalAddCampaign();
    }
    await fetchSampleCampaigns(sampleCampaignPagination.currentPage);
    setLoadingCreateCampaign(false);
  };
  return (
    <>
      <SampleSamples
        campaigns={sampleCampaigns}
        setSelectedSampleCampaign={setSelectedSampleCampaign}
        selectedSampleCampaign={selectedSampleCampaign}
        handleSelectSampleCampaign={handleSelectSampleCampaign}
        visible={visible}
        setVisible={setVisible}
        handleSelectAllCampaigns={handleSelectAllCampaigns}
        openModal={open}
        setIsCreateNewSampleCampaign={setIsCreateNewSampleCampaign}
        editCampaign={editCampaign}
        setEditCampaign={setEditCampaign}
        editAccountName={editAccountName}
        setEditAccountName={setEditAccountName}
        handleSaveNewAccountName={handleSaveNewAccountName}
        openModalConfirmDeleteSampleCampaign={
          openModalConfirmDeleteSampleCampaign
        }
        openModalAddCampaign={openModalAddCampaign}
        openModalDeleteCampaign={openModalDeleteCampaign}
      />
      <Modal
        opened={opened}
        size="50%"
        onClose={close}
        style={{
          borderRadius: "10px",
          scrollbarWidth: "thin",
        }}
      >
        <Card
          className={cn(styles.card, styles.clipArtCard)}
          title="Camp Phôi"
          classTitle="title-green"
          classCardHead={styles.classCardHead}
          classSpanTitle={styles.classScaleSpanTitle}
        >
          <Fieldset
            legend="Thông tin"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Autocomplete
              label="Account Name"
              placeholder="Account Name"
              data={map(accounts, "name")}
              value={campaignInfo.accountName}
              onChange={(value) =>
                setCampaignInfo({
                  ...campaignInfo,
                  accountId: find(accounts, { name: value })?.uid,
                  accountName: value,
                })
              }
            />
            <TagsInput
              label="Camp IDs"
              data={campaignInfo.campaignIds}
              value={campaignInfo.campaignIds}
              onChange={(value) => {
                setCampaignInfo({ ...campaignInfo, campaignIds: value });
              }}
              placeholder="Enter CampId"
              splitChars={[",", " ", "|", "\r\n", "\n"]}
              clearable
            />
          </Fieldset>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={handleCreateCampaign}
          >
            <Button>Tạo</Button>
          </div>
        </Card>
      </Modal>
      <Modal
        opened={openedModalAddCampaign}
        size="50%"
        onClose={closeModalAddCampaign}
        style={{
          borderRadius: "10px",
          scrollbarWidth: "thin",
        }}
      >
        <Card
          className={cn(styles.card, styles.clipArtCard)}
          title="Camp Phôi"
          classTitle="title-green"
          classCardHead={styles.classCardHead}
          classSpanTitle={styles.classScaleSpanTitle}
        >
          <Fieldset
            legend="Thông tin"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <TagsInput
              label="Camp IDs"
              data={campaignInfo.campaignIds}
              value={campaignInfo.campaignIds}
              onChange={(value) => {
                setCampaignInfo({ ...campaignInfo, campaignIds: value });
              }}
              placeholder="Enter CampId"
              splitChars={[",", " ", "|", "\r\n", "\n"]}
              clearable
            />
          </Fieldset>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={handleAddCampaign}
          >
            <Button>Tạo</Button>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default RootCampaign;
