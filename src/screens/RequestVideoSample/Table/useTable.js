import { useState } from "react";
import { campaignServices } from "../../../services";
import { CONVERT_STATUS_TO_NUMBER } from "../../../utils";
import formatDate from "../../../utils/formatDate";
import { showNotification } from "../../../utils/index";
import useGetSampleList from "./useGetSampleList";
import useGetUser from "./useGetUser";

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
      status: value === "Done" ? [2] : [1],
      statusValue: value,
    });
    handleChangePage();
  };

  const handleClearStatus = () => {
    setQuery({
      ...query,
      status: [1, 2],
      statusValue: null,
    });
    handleChangePage();
  };

  const handleUpdateSupplier = async (briefId, videoSupplier) => {
    const result = await campaignServices.updateVideoBrief(briefId, {
      videoSupplier,
    });
    if (result.success) {
      showNotification("Thành công", "Update Supplier thành công", "green");
      refetch();
    }
  };

  const handleDoneSample = async (briefId) => {
    const result = await campaignServices.updateVideoBrief(briefId, {
      videoStatus: 2,
    });
    if (result.success) {
      showNotification("Thành công", "Update status thành công", "green");
      refetch();
    }
  };

  const handleIncompleteSample = async (briefId) => {
    const result = await campaignServices.updateVideoBrief(briefId, {
      videoStatus: 1,
    });
    if (result.success) {
      showNotification("Thành công", "Update status thành công", "green");
      refetch();
    }
  };

  return {
    data,
    users,
    searchSKU,
    pagination,
    clearFilters,
    handleChangeSKU,
    handleSubmitSKU,
    handleChangeDate,
    handleClearSizeValue,
    handleChangeSizeValue,
    handleChangeTeam,
    handleClearTeam,
    handleChangeStatus,
    handleClearStatus,
    handleChangePage,
    handleUpdateSupplier,
    handleDoneSample,
    handleIncompleteSample,
  };
};

export default useTable;
