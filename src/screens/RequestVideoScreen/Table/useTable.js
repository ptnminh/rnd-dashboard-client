import { useMemo, useState } from "react";
import useGetUser from "../../../hooks/useGetUser";
import { campaignServices } from "../../../services";
import { CONVERT_STATUS_TO_NUMBER } from "../../../utils";
import formatDate from "../../../utils/formatDate";
import { showNotification } from "../../../utils/index";
import useGetSampleList from "./useGetSampleList";

const useTable = ({ query, setQuery }) => {
  const { users } = useGetUser();

  const { data, pagination, handleChangePage, refetch } = useGetSampleList({
    filters: query,
  });

  const [searchSKU, setSearchSKU] = useState("");

  const handleChangeSKU = (e) => {
    setSearchSKU(e.target.value);
  };

  const handleSubmitSKU = () => {
    setQuery({
      ...query,
      sku: searchSKU,
    });
    handleChangePage();
  };

  const handleChangeDate = (dateValue, startDate, endDate) => {
    if (!startDate) {
      setQuery({
        ...query,
        startDate: "",
        endDate: "",
        dateValue: null,
      });
      return;
    }

    setQuery({
      ...query,
      dateValue,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    });
    handleChangePage();
  };

  const clearFilters = () => {
    setQuery({
      sku: null,
      dateValue: null,
      startDate: null,
      endDate: null,
      value: null,
      valueName: null,
      rndTeam: null,
      rndName: null,
      rndId: null,
      status: null,
      statusValue: null,
    });
    setSearchSKU("");
  };

  const handleChangeSizeValue = (value) => {
    setQuery({
      ...query,
      value: CONVERT_STATUS_TO_NUMBER[value],
      valueName: value,
    });
    handleChangePage();
  };

  const handleClearSizeValue = () => {
    setQuery({
      ...query,
      value: null,
      valueName: null,
    });
    handleChangePage();
  };

  const handleChangeTeam = (value) => {
    setQuery({ ...query, rndTeam: value });
    handleChangePage();
  };

  const handleClearTeam = () => {
    setQuery({
      ...query,
      rndTeam: null,
    });
    handleChangePage();
  };

  const handleChangeStatus = (value) => {
    setQuery({
      ...query,
      status: value === "Done" ? [3] : [2],
      statusValue: value,
    });
    handleChangePage();
  };

  const handleClearStatus = () => {
    setQuery({
      ...query,
      status: [3, 2],
      statusValue: null,
    });
    handleChangePage();
  };

  const handleDoneSample = async (briefId) => {
    const result = await campaignServices.updateVideoBrief(briefId, {
      videoStatus: 3,
    });
    if (result.success) {
      showNotification("Thành công", "Update status thành công", "green");
      refetch();
    }
  };

  const handleIncompleteSample = async (briefId) => {
    const result = await campaignServices.updateVideoBrief(briefId, {
      videoStatus: 2,
    });
    if (result.success) {
      showNotification("Thành công", "Update status thành công", "green");
      refetch();
    }
  };

  const handleUpdateDoneScene = async (briefId, isDoneSource) => {
    const result = await campaignServices.updateVideoBrief(briefId, {
      isDoneSource,
    });
    if (result.success) {
      showNotification("Thành công", "Update status thành công", "green");
      refetch();
    }
  };

  const handleUpdateLinkVideo = async (briefId, videoLink) => {
    const result = await campaignServices.updateVideoBrief(briefId, {
      videoLink,
    });
    if (result.success) {
      showNotification("Thành công", "Update status thành công", "green");
      refetch();
    }
  };

  const handleUpdateVideoEditor = async (briefId, videoEditorId) => {
    const result = await campaignServices.updateVideoBrief(briefId, {
      videoEditorId,
    });
    if (result.success) {
      showNotification("Thành công", "Update status thành công", "green");
      refetch();
    }
  };

  const listUserOptions = useMemo(() => {
    return users.map((user) => ({
      value: user.uid,
      label: user.name,
    }));
  }, [users]);

  return {
    data,
    users,
    searchSKU,
    pagination,
    listUserOptions,
    clearFilters,
    handleChangeDate,
    handleChangePage,
    handleChangeSizeValue,
    handleChangeSKU,
    handleChangeStatus,
    handleChangeTeam,
    handleClearSizeValue,
    handleClearStatus,
    handleClearTeam,
    handleDoneSample,
    handleIncompleteSample,
    handleSubmitSKU,
    handleUpdateDoneScene,
    handleUpdateLinkVideo,
    handleUpdateVideoEditor,
  };
};

export default useTable;
