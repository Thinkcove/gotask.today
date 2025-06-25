import {
  createNewPermission,
  findAllPermissions,
  findPermissionById,
  updateAPermission,
  deleteByPermissionId,
  findPermissionsWithFilters
} from "../../domain/interface/permission/permissionInterface";
import { IPermission, Permission } from "../../domain/model/permission/permission";


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
      message: error.message || "Failed to create permission request",
      data: null
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
      message: error.message || "Failed to retrieve permission requests",
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
        message: "Permission request not found",
        data: null
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
      message: error.message || "Failed to retrieve permission request",
      data: null
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
        message: "Permission request not found",
        data: null
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
      message: error.message || "Failed to update permission request",
      data: null
    };
  }
};

const deletePermissionService = async (id: string) => {
  try {
    const deletedPermission = await deleteByPermissionId(id);
    if (!deletedPermission) {
      return {
        success: false,
        message: "Permission request not found",
        data: null
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
      message: error.message || "Failed to delete permission request",
      data: null
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
  sort_order?: "asc" | "desc";
}) => {
  try {
    // Validate dates when both are provided
    if (filters.from_date && filters.to_date) {
      if (new Date(filters.from_date) > new Date(filters.to_date)) {
        throw new Error("From date cannot be later than To date");
      }
    }

    // Set default pagination values
    const page = filters.page || 1;
    const page_size = filters.page_size || 10;

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

export {
  createPermissionService,
  getAllPermissionsService,
  getPermissionByIdService,
  updatePermissionService,
  deletePermissionService,
  getPermissionsWithFiltersService
};