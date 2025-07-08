import mongoose from "mongoose";
import { IKpiTemplate, KpiTemplate } from "../../model/kpi/kpiModel";
import { IKpiAssignment, KpiAssignment } from "../../model/kpiemployee/kpiemloyeeModel";
import { KPI_FREQUENCY } from "../../../constants/kpiConstants";
import { IKpiPerformance } from "../../model/kpiemployee/kpiPerformanceModel";
import { v4 as uuidv4 } from "uuid";

// Create a new KPI assignment
export const createKpiAssignmentInDb = async (
  assignmentData: Partial<IKpiAssignment>
): Promise<IKpiAssignment> => {
  const newAssignment = new KpiAssignment(assignmentData);
  return await newAssignment.save();
};

// Get all KPI assignments for a user
export const getKpiAssignmentsByUserIdFromDb = async (
  user_id: string
): Promise<IKpiAssignment[]> => {
  return await KpiAssignment.find({ user_id });
};

// Get a specific KPI assignment by assignment_id
export const getKpiAssignmentByIdFromDb = async (
  assignment_id: string
): Promise<IKpiAssignment | null> => {
  return await KpiAssignment.findOne({ assignment_id });
};

// Update a KPI assignment
export const updateKpiAssignmentInDb = async (
  assignment_id: string,
  updateData: Partial<IKpiAssignment>,
  changedBy: string = "system"
): Promise<IKpiAssignment | null> => {
  const currentAssignment = await KpiAssignment.findOne({ assignment_id });
  if (!currentAssignment) return null;

  const changes: Record<string, any> = {};
  const updatePayload: any = {};

  // Handle regular field updates
  for (const key in updateData) {
    if (key !== "assignment_id" && key !== "change_History" && key !== "performance") {
      changes[key] = {
        oldValue: currentAssignment[key as keyof IKpiAssignment],
        newValue: updateData[key as keyof IKpiAssignment]
      };
      updatePayload[key] = updateData[key as keyof IKpiAssignment];
    }
  }

  // Handle performance update
  if (updateData.performance && Array.isArray(updateData.performance)) {
    const reviewerId =
      currentAssignment.reviewer_id && currentAssignment.reviewer_id.trim() !== ""
        ? currentAssignment.reviewer_id
        : currentAssignment.assigned_by;

    const newPerformance = updateData.performance.map((entry: IKpiPerformance) => ({
      ...entry,
      performance_id: entry.performance_id || uuidv4(),
      updated_at: new Date(),
      added_by: changedBy // Automatically capture who added it
    }));

    updatePayload.$push = { performance: { $each: newPerformance } };

    // Merge performance entries with currentAssignment
    const allPerformance = [...(currentAssignment.performance || []), ...newPerformance];

    // Find reviewer score for actual value calculation
    const reviewerEntry = allPerformance.find((entry) => entry.added_by === reviewerId);

    const reviewerScore = reviewerEntry ? Number(reviewerEntry.percentage) : null;
    const target = currentAssignment.target_value ? Number(currentAssignment.target_value) : null;

    if (reviewerScore !== null && target !== null && !isNaN(reviewerScore) && !isNaN(target)) {
      updatePayload.actual_value = ((reviewerScore * target) / 100).toFixed(2);
    }
  }

  // Handle change history
  if (Object.keys(changes).length > 0) {
    updatePayload.change_History = [
      ...(currentAssignment.change_History || []),
      {
        changedBy,
        changedAt: new Date(),
        changes
      }
    ];
  }

  return await KpiAssignment.findOneAndUpdate({ assignment_id }, updatePayload, {
    new: true,
    runValidators: true
  });
};

// Delete a KPI assignment
export const deleteKpiAssignmentByIdFromDb = async (assignment_id: string): Promise<boolean> => {
  const deletedAssignment = await KpiAssignment.findOneAndDelete({ assignment_id });
  return deletedAssignment !== null;
};

// Save KPI as template
export const saveKpiAsTemplateInDb = async (
  templateData: Partial<IKpiTemplate>
): Promise<IKpiTemplate> => {
  const newTemplate = new KpiTemplate({
    template_id: new mongoose.Types.UUID().toString(),
    title: templateData.title,
    description: templateData.description,
    measurement_criteria: templateData.measurement_criteria,
    frequency: templateData.frequency || KPI_FREQUENCY.QUARTERLY,
    status: templateData.status ?? true
  });
  return await newTemplate.save();
};

export const getAllKpiAssignmentsFromDb = async (): Promise<IKpiAssignment[]> => {
  return await KpiAssignment.find();
};
