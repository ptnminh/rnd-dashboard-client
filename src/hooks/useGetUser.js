import { useEffect, useState } from "react";
import { rndServices } from "../services";

const useGetUser = () => {
  const [users, setUsers] = useState([]);

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
  };
};

export default useGetUser;
