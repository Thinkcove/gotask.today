import bcrypt from "bcrypt";

export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

export interface UserCredentials {
  id: string;
  email: string;
  role: string;
}

export const formatDate = (date: Date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// src/constants/paginationConstants.ts
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
