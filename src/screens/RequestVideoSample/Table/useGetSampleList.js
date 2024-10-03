import { useCallback, useEffect, useState } from "react";
import apiClient from "../../../services/axiosClient";
import usePagination from "./usePagination";

const useGetSampleList = ({ filters = {} }) => {
  const { pagination, handleChangePage, setTotalPages } = usePagination();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      const queryParams = {
        page: pagination.page,
        filter: JSON.stringify({
          videoStatus: filters?.status,
          rnd: filters?.rndId,
          rndTeam: filters?.rndTeam,
          value: filters.value,
          startDate: filters.startDate,
          endDate: filters.endDate,
          sku: filters.sku,
        }),
      };

      const result = await apiClient.get("/briefs/video", {
        params: queryParams,
      });

      setData(result.data);
      setTotalPages(result.data.metadata.totalPages);
    } catch (error) {
      if (error.message) {
        return setError(error.message);
      }
      setError("Unhandle error");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    filters?.status,
    filters?.rndId,
    filters?.rndTeam,
    filters.value,
    filters.startDate,
    filters.endDate,
    filters.sku,
    setTotalPages,
  ]);

  useEffect(() => {
    getData();
  }, [pagination.page, pagination.totalPages, filters, getData]);

  console.log("pagination", pagination);

  return {
    pagination,
    data,
    loading,
    error,
    handleChangePage,
    refetch: getData,
  };
};

export default useGetSampleList;
