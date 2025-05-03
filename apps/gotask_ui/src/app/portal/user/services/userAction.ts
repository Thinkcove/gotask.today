import env from "@/app/common/env";
import { deleteData, getData, postData, putData } from "@/app/common/utils/apiData";
import { IUserField } from "../interfaces/userInterface";

//createUser
export const createUser = async (formData: IUserField) => {
  const url = `${env.API_BASE_URL}/createUser`;
  return await postData(url, formData as unknown as Record<string, unknown>);
};

//update a user
export const updateUser = async (userId: string, updatedFields: IUserField) => {
  const url = `${env.API_BASE_URL}/updateUser/${userId}`;
  return await putData(url, updatedFields as unknown as Record<string, unknown>);
};

// deleteUser
export const deleteUser = async (userId: string) => {
  const url = `${env.API_BASE_URL}/deleteUser/${userId}`; // Assuming the API accepts the userId in the URL
  return await deleteData(url);
};

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
        role: string;
      }) => ({
        id: user.id,
        name: user.name,
        status: user.status,
        user_id: user.user_id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        users: user.projects,
        organizations: user.organizations,
        role: user.role
      })
    ) || []
  );
};

// Fetching data using SWR
export const fetcherUserList = async () => {
  const data = await fetchUsers();
  return data;
};
