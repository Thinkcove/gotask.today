import { PAGE, SORT_ORDER } from "../../constants/commonConstants/commonConstants";
import { SortOrder } from "../../constants/taskConstant";
import {
  createNewPermission,
  findAllPermissions,
  findPermissionById,
  updateAPermission,
  deleteByPermissionId,
  findPermissionsWithFilters,
  deleteCommentFromPermission,
  updateCommentInPermission,
  createCommentInPermission
} from "../../domain/interface/permission/permissionInterface";
import { IPermission, Permission } from "../../domain/model/permission/permission";
import { IPermissionComment } from "../../domain/model/permission/permissionComment";


const createPermissionService = async (permissionData: Partial<IPermission>) => {
  try {
    // Validate time format if end_time is provided
    if (permissionData.end_time && permissionData.start_time) {
      const startTime = new Date(`1970-01-01T${permissionData.start_time}:00`);
      const endTime = new Date(`1970-01-01T${permissionData.end_time}:00`);
      
      if (startTime >= endTime) {
        throw new Error("Start time must be before end time");
      }
    }

    const newPermission = await createNewPermission(permissionData);
    return {
      success: true,
      message: "Permission request created successfully",
      data: newPermission
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
};

const getAllPermissionsService = async () => {
  try {
    const permissions = await findAllPermissions();
    return {
      success: true,
      message: "Permission requests retrieved successfully",
      data: permissions
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
};

const getPermissionByIdService = async (id: string) => {
  try {
    const permission = await findPermissionById(id);
    if (!permission) {
      return {
        success: false,
        message: "Permission request not found"
      };
    }
    return {
      success: true,
      message: "Permission request retrieved successfully",
      data: permission
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
};

const updatePermissionService = async (id: string, updateData: Partial<IPermission>) => {
  try {
    // Validate time format if both times are provided
    if (updateData.end_time && updateData.start_time) {
      const startTime = new Date(`1970-01-01T${updateData.start_time}:00`);
      const endTime = new Date(`1970-01-01T${updateData.end_time}:00`);
      
      if (startTime >= endTime) {
        throw new Error("Start time must be before end time");
      }
    }

    const updatedPermission = await updateAPermission(id, updateData);
    if (!updatedPermission) {
      return {
        success: false,
        message: "Permission request not found"
      };
    }
    return {
      success: true,
      message: "Permission request updated successfully",
      data: updatedPermission
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
};

const deletePermissionService = async (id: string) => {
  try {
    const deletedPermission = await deleteByPermissionId(id);
    if (!deletedPermission) {
      return {
        success: false,
        message: "Permission request not found"
      };
    }
    return {
      success: true,
      message: "Permission request deleted successfully",
      data: deletedPermission
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
};

const getPermissionsWithFiltersService = async (filters: {
  user_id?: string;
  date?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_order?: typeof SORT_ORDER.ASC | typeof SORT_ORDER.DESC;
}) => {
  try {
    // Validate dates when both are provided
    if (filters.from_date && filters.to_date) {
      if (new Date(filters.from_date) > new Date(filters.to_date)) {
        throw new Error("From date cannot be later than To date");
      }
    }

    // Set default pagination values
    const page = filters.page || parseInt(PAGE.ONE);
    const page_size = filters.page_size || parseInt(PAGE.TEN);

    // Fetch filtered permissions
    const permissions = await findPermissionsWithFilters(filters);

    // Calculate total count for pagination
    const query: any = {};
    if (filters.user_id) query.user_id = filters.user_id;
    if (filters.date) query.date = new Date(filters.date);
    if (filters.from_date || filters.to_date) {
      const dateQuery: any = {};
      if (filters.from_date) {
        dateQuery.$gte = new Date(filters.from_date);
      }
      if (filters.to_date) {
        dateQuery.$lte = new Date(filters.to_date);
      }
      query.date = dateQuery;
    }

    const total_count = await Permission.countDocuments(query);

    return {
      success: true,
      message: "Permission requests retrieved successfully",
      data: {
        permissions,
        total_count,
        total_pages: Math.ceil(total_count / page_size),
        current_page: page
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve permission requests",
      data: {
        permissions: [],
        total_count: 0,
        total_pages: 0,
        current_page: 1
      }
    };
  }
};

const createPermissionComment = async (
  commentData: Partial<IPermissionComment>
): Promise<{ success: boolean; data?: IPermissionComment; message?: string }> => {
  try {
    const newComment = await createCommentInPermission(commentData as IPermissionComment);
    return {
      success: true,
      data: newComment,
      message: "Comment added successfully"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add comment"
    };
  }
};

const updatePermissionComment = async (
  id: string,
  newCommentText: Partial<IPermissionComment>
): Promise<{ success: boolean; data?: IPermissionComment; message?: string }> => {
  try {
    const updatedComment = await updateCommentInPermission(id, newCommentText);
    if (!updatedComment) {
      return {
        success: false,
        message: "Comment not found"
      };
    }
    return {
      success: true,
      data: updatedComment,
      message: "Comment updated successfully"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update comment"
    };
  }
};

const deletePermissionComment = async (
  id: string
): Promise<{ success: boolean; data?: IPermissionComment; message?: string }> => {
  try {
    const deletedComment = await deleteCommentFromPermission(id);
    if (!deletedComment) {
      return {
        success: false,
        message: "Comment not found"
      };
    }
    return {
      success: true,
      data: deletedComment,
      message: "Comment deleted successfully"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete comment"
    };
  }
};

export {
  createPermissionService,
  getAllPermissionsService,
  getPermissionByIdService,
  updatePermissionService,
  deletePermissionService,
  getPermissionsWithFiltersService,
  createPermissionComment,
  updatePermissionComment,
  deletePermissionComment
};