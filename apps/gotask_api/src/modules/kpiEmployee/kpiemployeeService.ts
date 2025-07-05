import { v4 as uuidv4 } from "uuid";
import { KpiAssignmentMessages } from "../../constants/apiMessages/kpiemployeeMessages";
import {
  createKpiAssignmentInDb,
  deleteKpiAssignmentByIdFromDb,
  getAllKpiAssignmentsFromDb,
  getKpiAssignmentByIdFromDb,
  getKpiAssignmentsByUserIdFromDb,
  saveKpiAsTemplateInDb,
  updateKpiAssignmentInDb
} from "../../domain/interface/kpiemployee/kpiemployeeInterface";
import { getKpiTemplateByIdFromDb } from "../../domain/interface/kpi/kpiInterface";
import { IKpiTemplate } from "../../domain/model/kpi/kpiModel";
import { IKpiAssignment } from "../../domain/model/kpiemployee/kpiemloyeeModel";
import { User } from "../../domain/model/user/user";

// Helper to remove restricted fields from an object
const removeRestrictedFields = <T extends Record<string, any>>(
  data: T,
  restrictedFields: string[]
): Partial<T> => {
  const cleanedData: Record<string, any> = { ...data };
  for (const field of restrictedFields) {
    if (field in cleanedData) {
      delete cleanedData[field];
    }
  }
  return cleanedData as Partial<T>;
};

// Create a new KPI assignment
const createKpiAssignment = async (
  assignmentData: Partial<IKpiAssignment>,
  authUserId: string,
  restrictedFields: string[] = []
): Promise<{ success: boolean; data?: IKpiAssignment; message?: string }> => {
  try {
    const filteredData = removeRestrictedFields(assignmentData, restrictedFields);

    if (filteredData.template_id) {
      delete filteredData.kpi_Title;
      delete filteredData.kpi_Description;
    }

    // Validate required fields
    if (
      !filteredData.user_id ||
      !filteredData.frequency ||
      !filteredData.weightage ||
      !filteredData.assigned_by ||
      (!filteredData.template_id && !filteredData.kpi_Title)
    ) {
      return {
        success: false,
        message: KpiAssignmentMessages.CREATE.REQUIRED
      };
    }

    const userIdsToValidate = [filteredData.user_id, filteredData.assigned_by];
    if (filteredData.reviewer_id) userIdsToValidate.push(filteredData.reviewer_id);
    const users = await User.find({ id: { $in: userIdsToValidate } }).lean();

    // Check if all user IDs exist in the found users
    const foundUserIds = users.map((u) => u.id);
    const invalidIds = userIdsToValidate.filter((id) => !foundUserIds.includes(id));
    if (invalidIds.length > 0) {
      return {
        success: false,
        message: `${KpiAssignmentMessages.CREATE.INVALID_USER_IDS}: ${invalidIds.join(", ")}`
      };
    }

    // Generate unique assignment_id if not provided
    if (!filteredData.assignment_id) {
      filteredData.assignment_id = uuidv4();
    }

    // If assigned from template, fetch template details
    if (filteredData.template_id) {
      const template = await getKpiTemplateByIdFromDb(filteredData.template_id);
      if (!template) {
        return {
          success: false,
          message: KpiAssignmentMessages.CREATE.TEMPLATE_NOT_FOUND
        };
      }
      filteredData.kpi_Title = template.title;
      filteredData.kpi_Description = template.description; 
      filteredData.frequency = filteredData.frequency || template.frequency;
      filteredData.target_value= filteredData.target_value;
    }

    // Save as template if requested
    if (filteredData.saveAs_Template) {
      const templateData: Partial<IKpiTemplate> = {
        title: filteredData.kpi_Title,
        measurement_criteria: undefined,
        frequency: filteredData.frequency,
        status: filteredData.status
      };
      await saveKpiAsTemplateInDb(templateData);
    }

    const newAssignment = await createKpiAssignmentInDb(filteredData);

    return {
      success: true,
      data: newAssignment
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiAssignmentMessages.CREATE.FAILED
    };
  }
};
// Get all KPI assignments for a user
const getAllKpiAssignments = async (): Promise<{
  success: boolean;
  data?: IKpiAssignment[] | null;
  message?: string;
}> => {
  try {
    // Fetch all KPI assignments from the database
    const assignments = await getAllKpiAssignmentsFromDb();
    return {
      success: true,
      data: assignments || [],
      message: assignments.length === 0 ? "No KPI assignments found" : undefined
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiAssignmentMessages.FETCH.FAILED_ALL
    };
  }
};

// Get a specific KPI assignment by assignment_id
const getKpiAssignmentById = async (
  assignment_id: string
): Promise<{ success: boolean; data?: IKpiAssignment | null; message?: string }> => {
  try {
    const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
    if (!assignment) {
      return {
        success: false,
        message: KpiAssignmentMessages.FETCH.NOT_FOUND
      };
    }

    return {
      success: true,
      data: assignment
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiAssignmentMessages.FETCH.FAILED_BY_ID
    };
  }
};

// Update KPI assignment
const updateKpiAssignment = async (
  assignment_id: string,
  updateData: Partial<IKpiAssignment>,
  authUserId: string,
  restrictedFields: string[] = []
): Promise<{ success: boolean; data?: IKpiAssignment | null; message?: string }> => {
  try {
    const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
    if (!assignment) {
      return {
        success: false,
        message: KpiAssignmentMessages.UPDATE.NOT_FOUND
      };
    }

    const filteredUpdateData = removeRestrictedFields(updateData, restrictedFields);

    // Validate user IDs if provided in update (referencing User.id)
    if (
      filteredUpdateData.user_id ||
      filteredUpdateData.assigned_by ||
      filteredUpdateData.reviewer_id
    ) {
      const userIdsToValidate = [];
      if (filteredUpdateData.user_id) userIdsToValidate.push(filteredUpdateData.user_id);
      if (filteredUpdateData.assigned_by) userIdsToValidate.push(filteredUpdateData.assigned_by);
      if (filteredUpdateData.reviewer_id) userIdsToValidate.push(filteredUpdateData.reviewer_id);
      const users = await User.find({ id: { $in: userIdsToValidate } }).lean();
      const foundUserIds = users.map((u) => u.id);
      const invalidIds = userIdsToValidate.filter((id) => !foundUserIds.includes(id));
      if (invalidIds.length > 0) {
        return {
          success: false,
          message: `${KpiAssignmentMessages.UPDATE.INVALID_USER_IDS}: ${invalidIds.join(", ")}`
        };
      }
    }

    // Prevent updating reviewer_id after creation
    if (filteredUpdateData.reviewer_id) {
      return {
        success: false,
        message: KpiAssignmentMessages.UPDATE.REVIEWER_NOT_UPDATABLE
      };
    }

    const updatedAssignment = await updateKpiAssignmentInDb(
      assignment_id,
      filteredUpdateData,
      authUserId
    );

    return {
      success: true,
      data: updatedAssignment
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiAssignmentMessages.UPDATE.FAILED
    };
  }
};

// Delete KPI assignment
const deleteKpiAssignmentById = async (
  assignment_id: string
): Promise<{ success: boolean; data?: IKpiAssignment | null; message?: string }> => {
  try {
    const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
    if (!assignment) {
      return {
        success: false,
        message: KpiAssignmentMessages.DELETE.NOT_FOUND
      };
    }

    const success = await deleteKpiAssignmentByIdFromDb(assignment_id);

    if (!success) {
      return {
        success: false,
        message: KpiAssignmentMessages.DELETE.FAILED
      };
    }
    return {
      success: true,
      message: KpiAssignmentMessages.DELETE.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || KpiAssignmentMessages.DELETE.FAILED
    };
  }
};

// Get templates by user ID
async function getTemplatesByUserId(user_id: string): Promise<{
  success: boolean;
  data?: Array<Partial<IKpiAssignment> & { template: Array<Partial<IKpiTemplate>> }> | null;
  message?: string;
}> {
  try {
    const user = await User.findOne({ id: user_id }).lean();
    if (!user) {
      return {
        success: false,
        message: `User ID ${user_id} not found in User collection`
      };
    }

    const assignments = await getKpiAssignmentsByUserIdFromDb(user_id);
    if (!assignments || assignments.length === 0) {
      return {
        success: true,
        data: [],
        message: `No KPI assignments found for user ID ${user_id}`
      };
    }

    const enrichedAssignments = await Promise.all(
      assignments.map(async (assignment: IKpiAssignment) => {
        const templateArray: Array<Partial<IKpiTemplate>> = [];

        if (assignment.template_id) {
          const template = await getKpiTemplateByIdFromDb(assignment.template_id);
          if (template) {
            templateArray.push(template);
          }
        } else {
          templateArray.push({
            title: assignment.kpi_Title,
            description: assignment.kpi_Description,
            measurement_criteria: assignment.measurement_criteria,
            frequency: assignment.frequency,
            status:assignment.status
          });
        }

        return {
          assignment_id: assignment.assignment_id,
          user_id: assignment.user_id,
          frequency: assignment.frequency,
          target_value: assignment.target_value,
          weightage: assignment.weightage,
          assigned_by: assignment.assigned_by,
          reviewer_id: assignment.reviewer_id,
          template: templateArray
        };
      })
    );

    return {
      success: true,
      data: enrichedAssignments
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
}

export {
  createKpiAssignment,
  getAllKpiAssignments,
  getKpiAssignmentById,
  updateKpiAssignment,
  deleteKpiAssignmentById,
  getTemplatesByUserId
};
