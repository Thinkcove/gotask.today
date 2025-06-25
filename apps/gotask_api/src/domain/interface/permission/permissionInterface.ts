import { IUser, User } from "../../model/user/user";
import logger from "../../../common/logger";
import { IPermission, Permission } from "../../model/permission/permission";
import { IPermissionComment, PermissionComment } from "../../model/permission/permissionComment";
import requestHelper from "../../../helpers/requestHelper";
import { SORT_ORDER } from "../../../constants/commonConstants/commonConstants";


export interface FilterQuery {
  user_id?: string;
  date?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_order?: typeof SORT_ORDER.ASC| typeof SORT_ORDER.DESC;
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
    sort[filters.sort_field] = filters.sort_order === SORT_ORDER.DESC ? -1 : 1;
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

const createCommentInPermission = async (
  commentData: IPermissionComment
): Promise<IPermissionComment> => {
  const { permission_id, user_id, comment, user_name } = commentData;
  const permission = await Permission.findOne({ id: permission_id });
  if (!permission) throw new Error("Permission not found");

  // Save the full comment in PermissionComment collection
  const newComment = new PermissionComment({ permission_id, user_id, comment, user_name });
  await newComment.save();

  // Add only the comment text to the Permission's comments array
  if (!permission.comments) {
    permission.comments = [];
  }
  permission.comments.unshift(comment); // Store only the comment string
  await permission.save();

  return newComment;
};

const updateCommentInPermission = async (
  id: string,
  newCommentText: Partial<IPermissionComment>
): Promise<IPermissionComment | null> => {
  try {
    // Log the input for debugging
    logger.info(`Updating comment with id: ${id}, new comment text: ${newCommentText.comment}`);

    // Find the comment in the PermissionComment collection
    const existingComment = await PermissionComment.findOne({ id });
    if (!existingComment) {
      logger.warn(`Comment with id ${id} not found in PermissionComment collection`);
      return null;
    }

    // Update the comment in the PermissionComment collection
    const updatedComment = await PermissionComment.findOneAndUpdate(
      { id },
      { comment: newCommentText.comment, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedComment) {
      logger.error(`Failed to update comment with id ${id}`);
      return null;
    }

    // Find the Permission document
    const permission = await Permission.findOne({ id: updatedComment.permission_id });
    if (!permission) {
      logger.warn(`Permission with id ${updatedComment.permission_id} not found`);
      return updatedComment;
    }

    // Find the index of the old comment text in the comments array
    const commentIndex = permission.comments.indexOf(existingComment.comment);
    if (commentIndex !== -1 && newCommentText.comment) {
      // Replace the old comment text with the new one
      permission.comments[commentIndex] = newCommentText.comment;
      await permission.save();
      logger.info(`Updated comment in Permission document ${permission.id} at index ${commentIndex}`);
    } else {
      logger.warn(`Comment "${existingComment.comment}" not found in Permission document ${permission.id} or no new comment text provided`);
    }

    return updatedComment;
  } catch (error) {
    logger.error(`Error updating comment with id ${id}: ${error}`);
    throw error;
  }
};

const deleteCommentFromPermission = async (id: string): Promise<IPermissionComment | null> => {
  const commentToDelete = await PermissionComment.findOne({ id });
  if (!commentToDelete) return null;

  const deletedComment = await PermissionComment.findOneAndDelete({ id });
  if (!deletedComment) return null;

  // Delete the comment from the Permission's comments array
  await Permission.deleteOne(
    { id: commentToDelete.permission_id },
    { $pull: { comments: commentToDelete.comment } }
  );

  return deletedComment;
};

export {
  createNewPermission,
  findAllPermissions,
  findPermissionById,
  updateAPermission,
  deleteByPermissionId,
  findPermissionsWithFilters,
  createCommentInPermission,
  updateCommentInPermission,
  deleteCommentFromPermission
};