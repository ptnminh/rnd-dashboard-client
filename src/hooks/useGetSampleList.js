import { useCallback, useEffect, useState } from "react";
import apiClient from "../services/axiosClient";
import removeNullKeys from "../utils/removeNullKeys";
import usePagination from "./usePagination";

const useGetSampleList = ({ filters = {}, defaultFilters = {} }) => {
  const { pagination, handleChangePage, setTotalPages } = usePagination();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      const filter = removeNullKeys({
        videoStatus: filters?.status,
        rnd: filters?.rndId,
        rndTeam: filters?.rndTeam,
        value: filters.value,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sku: filters.sku,
      });

      const queryParams = {
        page: pagination.page,
      };

      if (Object.keys(filter).length > 0) {
        queryParams["filter"] = JSON.stringify(filter);
      } else {
        // load default filters
        queryParams["filter"] = JSON.stringify(defaultFilters);
      }

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
    filters?.status,
    filters?.rndId,
    filters?.rndTeam,
    filters.value,
    filters.startDate,
    filters.endDate,
    filters.sku,
    pagination.page,
    setTotalPages,
    defaultFilters,
  ]);

  useEffect(() => {
    getData();
  }, [pagination.page, pagination.totalPages, filters, getData]);

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