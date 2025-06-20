import mongoose from "mongoose";
import { IKpiTemplate, KpiTemplate } from "../../model/kpi/kpiModel";
import { IKpiAssignment, KpiAssignment } from "../../model/kpiemployee/kpiemloyeeModel";
import { KPI_FREQUENCY } from "../../../constants/kpiConstants";

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
  for (const key in updateData) {
    if (
      key !== "assignment_id" &&
      key !== "change_history" &&
      updateData[key as keyof IKpiAssignment] !== undefined
    ) {
      changes[key] = {
        oldValue: currentAssignment[key as keyof IKpiAssignment],
        newValue: updateData[key as keyof IKpiAssignment]
      };
    }
  }

  if (Object.keys(changes).length > 0) {
    updateData.change_History = [
      ...(currentAssignment.change_History || []),
      {
        changedBy,
        changedAt: new Date(),
        changes
      }
    ];
  }

  return await KpiAssignment.findOneAndUpdate({ assignment_id }, updateData, {
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
    isActive: templateData.isActive ?? true
  });
  return await newTemplate.save();
};

export const getAllKpiAssignmentsFromDb = async (): Promise<IKpiAssignment[]> => {
  return await KpiAssignment.find();
};
