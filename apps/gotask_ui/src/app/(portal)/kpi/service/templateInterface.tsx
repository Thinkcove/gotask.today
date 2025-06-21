// templateInterface.ts
export interface Template {
  id: string;
  name: string;
  description?: string;
  weightage: string; // Aligns with measurement_criteria
  frequency?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
