import { User } from "../../model/user/user";
import logger from "../../../common/logger";
import { IPermission, Permission } from "../../model/permission/permission";

export interface FilterQuery {
  user_id?: string;
  date?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_order?: "asc" | "desc";
}

const findPermissionsWithFilters = async (filters: FilterQuery): Promise<IPermission[]> => {
  const query: any = {};
  
  if (filters.user_id) {
    query.user_id = filters.user_id;
  }
  
  if (filters.date) {
    query.date = new Date(filters.date);
  }
  
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

  const sort: any = {};
  if (filters.sort_field) {
    sort[filters.sort_field] = filters.sort_order === "desc" ? -1 : 1;
  } else {
    sort.created_on = -1; // Default sort
  }

  let queryBuilder = Permission.find(query).sort(sort);

  // Add pagination
  if (filters.page && filters.page_size) {
    const skip = (filters.page - 1) * filters.page_size;
    queryBuilder = queryBuilder.skip(skip).limit(filters.page_size);
  }

  return await queryBuilder.exec();
};

const createNewPermission = async (permissionData: Partial<IPermission>): Promise<IPermission> => {
  const user = await User.findOne({ id: permissionData.user_id });
  if (!user) {
    throw new Error("Invalid user_id");
  }

  const newPermission = new Permission({
    ...permissionData,
    user_name: user.name
  });

  return await newPermission.save();
};

const findAllPermissions = async (): Promise<IPermission[]> => {
  return await Permission.find().sort({ created_on: -1 });
};

const findPermissionById = async (id: string): Promise<IPermission | null> => {
  return await Permission.findOne({ id });
};

const updateAPermission = async (id: string, updateData: Partial<IPermission>): Promise<IPermission | null> => {
  try {
    const existingPermission = await Permission.findOne({ id });
    if (!existingPermission) return null;

    if (updateData.user_id && updateData.user_id !== existingPermission.user_id) {
      const user = await User.findOne({ id: updateData.user_id });
      if (!user) throw new Error("Invalid user_id");
      updateData.user_name = user.name;
    }

    const updatedPermission = await Permission.findOneAndUpdate(
      { id },
      { ...updateData, updated_on: new Date() },
      { new: true }
    );

    return updatedPermission;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to update permission request");
  }
};

const deleteByPermissionId = async (id: string): Promise<IPermission | null> => {
  return await Permission.findOneAndDelete({ id });
};

export {
  createNewPermission,
  findAllPermissions,
  findPermissionById,
  updateAPermission,
  deleteByPermissionId,
  findPermissionsWithFilters
};