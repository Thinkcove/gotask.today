import bcrypt from "bcrypt";
import { IKpiPerformance } from "../../domain/model/kpiemployee/kpiPerformanceModel";

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

export const calculateKpiScores = (
  allPerformance: IKpiPerformance[],
  reviewerId: string | undefined,
  assignedBy: string,
  targetValue: number
) => {
  const employeeEntries = allPerformance.filter((p) => p.added_by === assignedBy);

  const reviewerSourceId = reviewerId || assignedBy;
  const reviewerEntries = allPerformance.filter((p) => p.added_by === reviewerSourceId);

  const avg = (arr: IKpiPerformance[]) => {
    if (!arr || arr.length === 0) return 0;
    const total = arr.reduce((sum, p) => sum + Number(p.percentage || 0), 0);
    return total / arr.length;
  };

  const employeeScore = avg(employeeEntries);
  const reviewerScore = avg(reviewerEntries);
  const actualValue = (reviewerScore * targetValue) / 100;

  return {
    employeeScore,
    reviewerScore,
    actualValue
  };
};
