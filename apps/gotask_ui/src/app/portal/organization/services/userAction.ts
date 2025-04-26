import env from "@/app/common/env";
import { getData } from "@/app/common/utils/apiData";

//createProject

//fetch users
export const fetchUsers = async () => {
  const { data } = await getData(`${env.API_BASE_URL}/getAllUsers`);

  return (
    data?.map(
      (user: {
        name: string;
        id: string;
        status: string;
        user_id: string;
        createdAt: string;
        updatedAt: string;
        projects: string[];
        organizations: string[];
      }) => ({
        id: user.id,
        name: user.name,
        status: user.status,
        user_id: user.user_id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        users: user.projects,
        organizations: user.organizations
      })
    ) || []
  );
};

// Fetching data using SWR
export const fetcherUserList = async () => {
  const data = await fetchUsers();
  return data;
};
