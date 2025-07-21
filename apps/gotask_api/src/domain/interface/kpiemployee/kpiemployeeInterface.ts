import mongoose from "mongoose";
import { IKpiTemplate, KpiTemplate } from "../../model/kpi/kpiModel";
import { KPI_FREQUENCY } from "../../../constants/kpiConstants";
import { IKpiAssignment, KpiAssignment } from "../../model/kpiemployee/kpiEmployeeModel";
import { IKpiPerformance } from "../../model/kpiemployee/kpiPerformanceModel";

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
    updatePayload.performance = updateData.performance;
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

// Add performance to KPI assignment
export const addPerformanceToKpiAssignmentInDb = async (
  assignment_id: string,
  updateData: Partial<IKpiAssignment>,
  changedBy: string = "system"
): Promise<IKpiAssignment | null> => {
  const currentAssignment = await KpiAssignment.findOne({ assignment_id });
  if (!currentAssignment) return null;

  const updatePayload: any = {
    performance: updateData.performance,
    actual_value: updateData.actual_value,
    employee_score: updateData.employee_score
  };

  // Handle change history
  const changes: Record<string, any> = {
    performance: {
      oldValue: currentAssignment.performance,
      newValue: updateData.performance
    },
    actual_value: {
      oldValue: currentAssignment.actual_value,
      newValue: updateData.actual_value
    },
    employee_score: {
      oldValue: currentAssignment.employee_score,
      newValue: updateData.employee_score
    }
  };

  updatePayload.change_History = [
    ...(currentAssignment.change_History || []),
    {
      changedBy,
      changedAt: new Date(),
      changes
    }
  ];

  return await KpiAssignment.findOneAndUpdate({ assignment_id }, updatePayload, {
    new: true,
    runValidators: true
  });
};

// Get performance by performance_id within a specific assignment
export const getPerformanceByIdFromDb = async (
  performance_id: string
): Promise<{
  performance: IKpiPerformance;
  assignment: {
    assignment_id: string;
    assigned_to?: string;
    template_id?: string;
  };
} | null> => {
  const assignment = await KpiAssignment.findOne({
    "performance.performance_id": performance_id
  });

  if (!assignment) return null;
  if (!Array.isArray(assignment.performance)) return null;

  const performance = assignment.performance.find((perf) => perf.performance_id === performance_id);

  if (!performance) return null;

  return {
    performance,
    assignment: {
      assignment_id: assignment.assignment_id,
      assigned_to: assignment.user_id
    }
  };
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

// Get all KPI assignments
export const getAllKpiAssignmentsFromDb = async (): Promise<IKpiAssignment[]> => {
  return await KpiAssignment.find();
};

// Get all performances by assignment ID
export const getPerformancesByAssignmentId = async (
  assignment_id: string
): Promise<IKpiPerformance[] | null> => {
  const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
  if (!assignment) return null;
  return assignment.performance || [];
};
