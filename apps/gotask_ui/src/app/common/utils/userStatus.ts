// src/app/common/utils/userstatus.ts

import { User } from "@/app/(portal)/user/interfaces/userInterface";

export const filterUsers = (
  users: User[] | null,
  searchTerm: string,
  userStatusFilter: string[]
): User[] | null => {
  if (!users) return null;

  return users
    .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((user) => {
      if (userStatusFilter.length === 0 || userStatusFilter.includes("All")) return true;
      return userStatusFilter.includes(user.status ? "Active" : "Inactive");
    });
};
