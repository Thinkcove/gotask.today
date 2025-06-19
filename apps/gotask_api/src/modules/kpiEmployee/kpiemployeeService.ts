// import { KpiAssignmentMessages } from "../../constants/apiMessages/kpiemployeeMessages";
// import {
//   createKpiAssignmentInDb,
//   deleteKpiAssignmentByIdFromDb,
//   getKpiAssignmentByIdFromDb,
//   getKpiAssignmentsByUserIdFromDb,
//   saveKpiAsTemplateInDb,
//   updateKpiAssignmentInDb
// } from "../../domain/interface/kpiemployee/kpiemployeeInterface";
// import { getKpiTemplateByIdFromDb } from "../../domain/interface/kpi/kpiInterface";
// import { IKpiTemplate } from "../../domain/model/kpi/kpiModel";
// import { IKpiAssignment } from "../../domain/model/kpiemployee/kpiemloyeeModel";
// import { User } from "../../domain/model/user/user";

// // Helper to remove restricted fields from an object
// function removeRestrictedFields<T>(data: T, restrictedFields: string[]): Partial<T> {
//   const cleanedData = { ...data } as Record<string, any>;
//   restrictedFields.forEach((field) => {
//     if (field in cleanedData) {
//       delete cleanedData[field];
//     }
//   });
//   return cleanedData as Partial<T>;
// }

// // Create a new KPI assignment
// const createKpiAssignment = async (
//   assignmentData: Partial<IKpiAssignment>,
//   authUserId: string,
//   restrictedFields: string[] = []
// ): Promise<{ success: boolean; data?: IKpiAssignment; message?: string }> => {
//   console.log("authUserId", authUserId);
//   console.log("assignmentData", assignmentData);
//   try {
//     const filteredData = removeRestrictedFields(assignmentData, restrictedFields);

//     // Validate required fields
//     if (
//       !filteredData.user_id ||
//       !filteredData.measurementCriteria ||
//       !filteredData.frequency ||
//       !filteredData.weightage ||
//       !filteredData.assigned_by ||
//       (!filteredData.template_id && (!filteredData.kpiTitle || !filteredData.kpiDescription))
//     ) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.CREATE.REQUIRED
//       };
//     }

//     // Validate user IDs exist in User table (referencing User.id)
//     const userIdsToValidate = [filteredData.user_id, filteredData.assigned_by];
//     if (filteredData.reviewer_id) userIdsToValidate.push(filteredData.reviewer_id);
//     const users = await User.find({ id: { $in: userIdsToValidate } });
//     if (users.length !== userIdsToValidate.length) {
//       console.error(
//         `Invalid user IDs: ${userIdsToValidate.join(", ")} not found in User collection`
//       );
//       return {
//         success: false,
//         message: `${KpiAssignmentMessages.CREATE.INVALID_USER_IDS}: ${userIdsToValidate.join(", ")}`
//       };
//     }

//     // Validate authenticated user exists
//     const authUser = await User.find({ id: assignmentData.user_id });
//     console.log("authUserauthUser", assignmentData.user_id);
//     if (!authUser) {
//       console.error(`Authenticated user ID ${authUserId} not found in User collection`);
//       return {
//         success: false,
//         message: `${KpiAssignmentMessages.CREATE.INVALID_USER_IDS}: authUserId ${authUserId}`
//       };
//     }

//     // Restrict non-admin users to self-assignment
//     if (filteredData.user_id !== authUserId) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.CREATE.EMPLOYEE_SELF_ASSIGN_ONLY
//       };
//     }

//     // Check if reviewer_id is required (self-assignment)
//     if (filteredData.assigned_by === filteredData.user_id && !filteredData.reviewer_id) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.CREATE.REVIEWER_REQUIRED
//       };
//     }

//     // If assigned from template, fetch template details
//     if (filteredData.template_id) {
//       const template = await getKpiTemplateByIdFromDb(filteredData.template_id);
//       if (!template) {
//         return {
//           success: false,
//           message: KpiAssignmentMessages.CREATE.TEMPLATE_NOT_FOUND
//         };
//       }
//       filteredData.kpiTitle = template.title;
//       filteredData.kpiDescription = template.description;
//       filteredData.measurementCriteria = template.measurementCriteria;
//       filteredData.frequency = filteredData.frequency || template.frequency;
//     }

//     // Save as template if requested
//     if (filteredData.saveAsTemplate) {
//       const templateData: Partial<IKpiTemplate> = {
//         title: filteredData.kpiTitle,
//         description: filteredData.kpiDescription,
//         measurementCriteria: filteredData.measurementCriteria,
//         frequency: filteredData.frequency,
//         isActive: true
//       };
//       await saveKpiAsTemplateInDb(templateData);
//     }

//     const newAssignment = await createKpiAssignmentInDb(filteredData);

//     return {
//       success: true,
//       data: newAssignment
//     };
//   } catch (error: any) {
//     console.error("Error in createKpiAssignment:", error);
//     return {
//       success: false,
//       message: error.message || KpiAssignmentMessages.CREATE.FAILED
//     };
//   }
// };

// // Get all KPI assignments for a user
// const getAllKpiAssignments = async (
//   user_id_param: string,
//   authUserId: string
// ): Promise<{ success: boolean; data?: IKpiAssignment[] | null; message?: string }> => {
//   try {
//     // Validate authenticated user exists
//     const authUser = await User.findOne({ id: authUserId });
//     if (!authUser) {
//       console.error(`Authenticated user ID ${authUserId} not found in User collection`);
//       return {
//         success: false,
//         message: `${KpiAssignmentMessages.FETCH.INVALID_USER_IDS}: authUserId ${authUserId}`
//       };
//     }

//     // Restrict non-admin users to fetching their own assignments
//     if (user_id_param !== authUserId) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.FETCH.EMPLOYEE_OWN_ONLY
//       };
//     }

//     // Validate user_id_param exists in User table
//     const user = await User.findOne({ id: user_id_param });
//     if (!user) {
//       console.error(`User ID ${user_id_param} not found in User collection`);
//       return {
//         success: false,
//         message: `${KpiAssignmentMessages.FETCH.INVALID_USER_IDS}: user_id ${user_id_param}`
//       };
//     }

//     const assignments = await getKpiAssignmentsByUserIdFromDb(user_id_param);
//     return {
//       success: true,
//       data: assignments
//     };
//   } catch (error: any) {
//     console.error("Error in getAllKpiAssignments:", error);
//     return {
//       success: false,
//       message: error.message || KpiAssignmentMessages.FETCH.FAILED_ALL
//     };
//   }
// };

// // Get a specific KPI assignment by assignment_id
// const getKpiAssignmentById = async (
//   assignment_id: string,
//   authUserId: string
// ): Promise<{ success: boolean; data?: IKpiAssignment | null; message?: string }> => {
//   try {
//     const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
//     if (!assignment) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.FETCH.NOT_FOUND
//       };
//     }

//     // Validate authenticated user exists
//     const authUser = await User.findOne({ id: authUserId });
//     if (!authUser) {
//       console.error(`Authenticated user ID ${authUserId} not found in User collection`);
//       return {
//         success: false,
//         message: `${KpiAssignmentMessages.FETCH.INVALID_USER_IDS}: authUserId ${authUserId}`
//       };
//     }

//     // Restrict non-admin users to fetching their own assignments
//     if (assignment.user_id !== authUserId) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.FETCH.EMPLOYEE_OWN_ONLY
//       };
//     }

//     return {
//       success: true,
//       data: assignment
//     };
//   } catch (error: any) {
//     console.error("Error in getKpiAssignmentById:", error);
//     return {
//       success: false,
//       message: error.message || KpiAssignmentMessages.FETCH.FAILED_BY_ID
//     };
//   }
// };

// // Update KPI assignment
// const updateKpiAssignment = async (
//   assignment_id: string,
//   updateData: Partial<IKpiAssignment>,
//   authUserId: string,
//   restrictedFields: string[] = []
// ): Promise<{ success: boolean; data?: IKpiAssignment | null; message?: string }> => {
//   try {
//     const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
//     if (!assignment) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.UPDATE.NOT_FOUND
//       };
//     }

//     // Validate authenticated user exists
//     const authUser = await User.findOne({ id: authUserId });
//     if (!authUser) {
//       console.error(`Authenticated user ID ${authUserId} not found in User collection`);
//       return {
//         success: false,
//         message: `${KpiAssignmentMessages.UPDATE.INVALID_USER_IDS}: authUserId ${authUserId}`
//       };
//     }

//     // Restrict non-admin users to updating their own assignments
//     if (assignment.user_id !== authUserId) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.UPDATE.EMPLOYEE_OWN_ONLY
//       };
//     }

//     const filteredUpdateData = removeRestrictedFields(updateData, restrictedFields);

//     // Validate user IDs if provided in update (referencing User.id)
//     if (
//       filteredUpdateData.user_id ||
//       filteredUpdateData.assigned_by ||
//       filteredUpdateData.reviewer_id
//     ) {
//       const userIdsToValidate = [];
//       if (filteredUpdateData.user_id) userIdsToValidate.push(filteredUpdateData.user_id);
//       if (filteredUpdateData.assigned_by) userIdsToValidate.push(filteredUpdateData.assigned_by);
//       if (filteredUpdateData.reviewer_id) userIdsToValidate.push(filteredUpdateData.reviewer_id);
//       const users = await User.find({ id: { $in: userIdsToValidate } });
//       if (users.length !== userIdsToValidate.length) {
//         console.error(
//           `Invalid user IDs in update: ${userIdsToValidate.join(", ")} not found in User collection`
//         );
//         return {
//           success: false,
//           message: `${KpiAssignmentMessages.UPDATE.INVALID_USER_IDS}: ${userIdsToValidate.join(", ")}`
//         };
//       }
//     }

//     // Prevent updating reviewer_id after creation
//     if (filteredUpdateData.reviewer_id) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.UPDATE.REVIEWER_NOT_UPDATABLE
//       };
//     }

//     const updatedAssignment = await updateKpiAssignmentInDb(
//       assignment_id,
//       filteredUpdateData,
//       authUserId
//     );

//     return {
//       success: true,
//       data: updatedAssignment
//     };
//   } catch (error: any) {
//     console.error("Error in updateKpiAssignment:", error);
//     return {
//       success: false,
//       message: error.message || KpiAssignmentMessages.UPDATE.FAILED
//     };
//   }
// };

// // Delete KPI assignment
// const deleteKpiAssignmentById = async (
//   assignment_id: string,
//   authUserId: string
// ): Promise<{ success: boolean; data?: IKpiAssignment | null; message?: string }> => {
//   try {
//     const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
//     if (!assignment) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.DELETE.NOT_FOUND
//       };
//     }

//     // Validate authenticated user exists
//     const authUser = await User.findOne({ id: authUserId });
//     if (!authUser) {
//       console.error(`Authenticated user ID ${authUserId} not found in User collection`);
//       return {
//         success: false,
//         message: `${KpiAssignmentMessages.DELETE.INVALID_USER_IDS}: authUserId ${authUserId}`
//       };
//     }

//     // Restrict non-admin users from deleting
//     if (assignment.user_id !== authUserId) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.DELETE.EMPLOYEE_NOT_ALLOWED
//       };
//     }

//     const success = await deleteKpiAssignmentByIdFromDb(assignment_id);

//     if (!success) {
//       return {
//         success: false,
//         message: KpiAssignmentMessages.DELETE.FAILED
//       };
//     }
//     return {
//       success: true,
//       message: KpiAssignmentMessages.DELETE.SUCCESS
//     };
//   } catch (error: any) {
//     console.error("Error in deleteKpiAssignmentById:", error);
//     return {
//       success: false,
//       message: error.message || KpiAssignmentMessages.DELETE.FAILED
//     };
//   }
// };

// export {
//   createKpiAssignment,
//   getAllKpiAssignments,
//   getKpiAssignmentById,
//   updateKpiAssignment,
//   deleteKpiAssignmentById
// };

import { KpiAssignmentMessages } from "../../constants/apiMessages/kpiemployeeMessages";
import {
  createKpiAssignmentInDb,
  deleteKpiAssignmentByIdFromDb,
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
function removeRestrictedFields<T>(data: T, restrictedFields: string[]): Partial<T> {
  const cleanedData = { ...data } as Record<string, any>;
  restrictedFields.forEach((field) => {
    if (field in cleanedData) {
      delete cleanedData[field];
    }
  });
  return cleanedData as Partial<T>;
}

// Create a new KPI assignment
const createKpiAssignment = async (
  assignmentData: Partial<IKpiAssignment>,
  authUserId: string,
  restrictedFields: string[] = []
): Promise<{ success: boolean; data?: IKpiAssignment; message?: string }> => {
  console.log("authUserId", authUserId);
  console.log("assignmentData", assignmentData);
  try {
    const filteredData = removeRestrictedFields(assignmentData, restrictedFields);

    // Validate required fields
    if (
      !filteredData.user_id ||
      !filteredData.measurementCriteria ||
      !filteredData.frequency ||
      !filteredData.weightage ||
      !filteredData.assigned_by ||
      (!filteredData.template_id && (!filteredData.kpiTitle || !filteredData.kpiDescription))
    ) {
      console.error("Missing required fields in assignmentData");
      return {
        success: false,
        message: KpiAssignmentMessages.CREATE.REQUIRED
      };
    }

    // Validate user IDs exist in User table (referencing User.id)
    const userIdsToValidate = [filteredData.user_id, filteredData.assigned_by];
    if (filteredData.reviewer_id) userIdsToValidate.push(filteredData.reviewer_id);
    console.log(`Validating user IDs: ${userIdsToValidate.join(", ")}`);
    const users = await User.find({ id: { $in: userIdsToValidate } });
    console.log(`Found users: ${users.map((u) => u.id).join(", ") || "none"}`);

    // Check if all user IDs exist in the found users
    const foundUserIds = users.map((u) => u.id);
    const invalidIds = userIdsToValidate.filter((id) => !foundUserIds.includes(id));
    if (invalidIds.length > 0) {
      console.error(`Invalid user IDs: ${invalidIds.join(", ")} not found in User collection`);
      return {
        success: false,
        message: `${KpiAssignmentMessages.CREATE.INVALID_USER_IDS}: ${invalidIds.join(", ")}`
      };
    }

    // Validate authenticated user exists
    console.log(`Validating authUserId: ${authUserId}`);
    const authUser = await User.findOne({ id: authUserId });
    console.log(`Found authUser: ${authUser ? authUser.id : "none"}`);
    if (!authUser) {
      console.error(`Authenticated user ID ${authUserId} not found in User collection`);
      return {
        success: false,
        message: `${KpiAssignmentMessages.CREATE.INVALID_USER_IDS}: authUserId ${authUserId}`
      };
    }

    // Restrict non-admin users to self-assignment
    if (filteredData.user_id !== authUserId) {
      console.error(`Non-admin user ${authUserId} cannot assign to ${filteredData.user_id}`);
      return {
        success: false,
        message: KpiAssignmentMessages.CREATE.EMPLOYEE_SELF_ASSIGN_ONLY
      };
    }

    // Allow same user as reviewer (no restrictive check needed)

    // If assigned from template, fetch template details
    if (filteredData.template_id) {
      console.log(`Fetching template: ${filteredData.template_id}`);
      const template = await getKpiTemplateByIdFromDb(filteredData.template_id);
      if (!template) {
        console.error(`Template ${filteredData.template_id} not found`);
        return {
          success: false,
          message: KpiAssignmentMessages.CREATE.TEMPLATE_NOT_FOUND
        };
      }
      filteredData.kpiTitle = template.title;
      filteredData.kpiDescription = template.description;
      filteredData.measurementCriteria = template.measurementCriteria;
      filteredData.frequency = filteredData.frequency || template.frequency;
    }

    // Save as template if requested
    if (filteredData.saveAsTemplate) {
      console.log("Saving as template");
      const templateData: Partial<IKpiTemplate> = {
        title: filteredData.kpiTitle,
        description: filteredData.kpiDescription,
        measurementCriteria: filteredData.measurementCriteria,
        frequency: filteredData.frequency,
        isActive: true
      };
      await saveKpiAsTemplateInDb(templateData);
    }

    console.log("Creating new KPI assignment");
    const newAssignment = await createKpiAssignmentInDb(filteredData);

    return {
      success: true,
      data: newAssignment
    };
  } catch (error: any) {
    console.error("Error in createKpiAssignment:", error);
    return {
      success: false,
      message: error.message || KpiAssignmentMessages.CREATE.FAILED
    };
  }
};

// Get all KPI assignments for a user
const getAllKpiAssignments = async (
  user_id_param: string,
  authUserId: string
): Promise<{ success: boolean; data?: IKpiAssignment[] | null; message?: string }> => {
  try {
    // Validate authenticated user exists
    const authUser = await User.findOne({ id: authUserId });
    if (!authUser) {
      console.error(`Authenticated user ID ${authUserId} not found in User collection`);
      return {
        success: false,
        message: `${KpiAssignmentMessages.FETCH.INVALID_USER_IDS}: authUserId ${authUserId}`
      };
    }

    // Restrict non-admin users to fetching their own assignments
    if (user_id_param !== authUserId) {
      return {
        success: false,
        message: KpiAssignmentMessages.FETCH.EMPLOYEE_OWN_ONLY
      };
    }

    // Validate user_id_param exists in User table
    const user = await User.findOne({ id: user_id_param });
    if (!user) {
      console.error(`User ID ${user_id_param} not found in User collection`);
      return {
        success: false,
        message: `${KpiAssignmentMessages.FETCH.INVALID_USER_IDS}: user_id ${user_id_param}`
      };
    }

    const assignments = await getKpiAssignmentsByUserIdFromDb(user_id_param);
    return {
      success: true,
      data: assignments
    };
  } catch (error: any) {
    console.error("Error in getAllKpiAssignments:", error);
    return {
      success: false,
      message: error.message || KpiAssignmentMessages.FETCH.FAILED_ALL
    };
  }
};

// Get a specific KPI assignment by assignment_id
const getKpiAssignmentById = async (
  assignment_id: string,
  authUserId: string
): Promise<{ success: boolean; data?: IKpiAssignment | null; message?: string }> => {
  try {
    const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
    if (!assignment) {
      return {
        success: false,
        message: KpiAssignmentMessages.FETCH.NOT_FOUND
      };
    }

    // Validate authenticated user exists
    const authUser = await User.findOne({ id: authUserId });
    if (!authUser) {
      console.error(`Authenticated user ID ${authUserId} not found in User collection`);
      return {
        success: false,
        message: `${KpiAssignmentMessages.FETCH.INVALID_USER_IDS}: authUserId ${authUserId}`
      };
    }

    // Restrict non-admin users to fetching their own assignments
    if (assignment.user_id !== authUserId) {
      return {
        success: false,
        message: KpiAssignmentMessages.FETCH.EMPLOYEE_OWN_ONLY
      };
    }

    return {
      success: true,
      data: assignment
    };
  } catch (error: any) {
    console.error("Error in getKpiAssignmentById:", error);
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

    // Validate authenticated user exists
    const authUser = await User.findOne({ id: authUserId });
    if (!authUser) {
      console.error(`Authenticated user ID ${authUserId} not found in User collection`);
      return {
        success: false,
        message: `${KpiAssignmentMessages.UPDATE.INVALID_USER_IDS}: authUserId ${authUserId}`
      };
    }

    // Restrict non-admin users to updating their own assignments
    if (assignment.user_id !== authUserId) {
      return {
        success: false,
        message: KpiAssignmentMessages.UPDATE.EMPLOYEE_OWN_ONLY
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
      console.log(`Validating update user IDs: ${userIdsToValidate.join(", ") || "none"}`);
      const users = await User.find({ id: { $in: userIdsToValidate } });
      console.log(`Found users for update: ${users.map((u) => u.id).join(", ") || "none"}`);
      const foundUserIds = users.map((u) => u.id);
      const invalidIds = userIdsToValidate.filter((id) => !foundUserIds.includes(id));
      if (invalidIds.length > 0) {
        console.error(
          `Invalid user IDs in update: ${invalidIds.join(", ")} not found in User collection`
        );
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
    console.error("Error in updateKpiAssignment:", error);
    return {
      success: false,
      message: error.message || KpiAssignmentMessages.UPDATE.FAILED
    };
  }
};

// Delete KPI assignment
const deleteKpiAssignmentById = async (
  assignment_id: string,
  authUserId: string
): Promise<{ success: boolean; data?: IKpiAssignment | null; message?: string }> => {
  try {
    const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
    if (!assignment) {
      return {
        success: false,
        message: KpiAssignmentMessages.DELETE.NOT_FOUND
      };
    }

    // Validate authenticated user exists
    const authUser = await User.findOne({ id: authUserId });
    if (!authUser) {
      console.error(`Authenticated user ID ${authUserId} not found in User collection`);
      return {
        success: false,
        message: `${KpiAssignmentMessages.DELETE.INVALID_USER_IDS}: authUserId ${authUserId}`
      };
    }

    // Restrict non-admin users from deleting
    if (assignment.user_id !== authUserId) {
      return {
        success: false,
        message: KpiAssignmentMessages.DELETE.EMPLOYEE_NOT_ALLOWED
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
    console.error("Error in deleteKpiAssignmentById:", error);
    return {
      success: false,
      message: error.message || KpiAssignmentMessages.DELETE.FAILED
    };
  }
};

export {
  createKpiAssignment,
  getAllKpiAssignments,
  getKpiAssignmentById,
  updateKpiAssignment,
  deleteKpiAssignmentById
};
