import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const usePagination = () => {
  const location = useLocation();

  const [page, setPage] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page") || "1", 10);
    return currentPage;
  });
  const [totalPages, setTotalPages] = useState(1);

  const handleChangePage = (page = 1) => {
    setPage(page);
  };

  useEffect(() => {
    if (!totalPages) setPage(1);
  }, [totalPages]);

  return {
    pagination: {
      page,
      totalPages,
    },
    setPage,
    setTotalPages,
    handleChangePage,
  };
};

export default usePagination;
