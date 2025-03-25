import bcrypt from "bcrypt";

export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};
