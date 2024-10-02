import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { CONVERT_STATUS_TO_NUMBER } from "../../../utils";
import { rndServices } from "../../../services";

const useTable = ({ query, setQuery }) => {
  const [searchSKU, setSearchSKU] = useState("");
  const [users, setUsers] = useState([]);

  const handleChangeSKU = (e) => {
    setSearchSKU(e.target.value);
  };

  const handleSubmitSKU = () => {
    setQuery({
      ...query,
      sku: searchSKU,
    });
  };

  const handleChangeDate = (dateValue, startDate, endDate) => {
    setQuery({
      ...query,
      dateValue,
      startDate: moment(startDate).format("YYYY-MM-DD"),
      endDate: moment(endDate).format("YYYY-MM-DD"),
    });
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
  };

  const handleClearSizeValue = () => {
    setQuery({
      ...query,
      value: null,
      valueName: null,
    });
  };

  const handleChangeTeam = (value) => {
    setQuery({ ...query, rndTeam: value });
  };

  const handleClearTeam = () => {
    setQuery({
      ...query,
      rndTeam: null,
    });
  };

  const handleChangeStatus = (value) => {
    setQuery({
      ...query,
      status: value === "Done" ? [2] : [1],
      statusValue: value,
    });
  };

  const handleClearStatus = () => {
    setQuery({
      ...query,
      status: [1, 2],
      statusValue: null,
    });
  };

  const fetchUsers = async () => {
    const { data } = await rndServices.getUsers({
      limit: -1,
    });
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    searchSKU,
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
  };
};

export default useTable;
