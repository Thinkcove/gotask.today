import { ILeave, Leave } from "../../model/leave/leaveModel";
import { User } from "../../model/user/user";
import logger from "../../../common/logger";
import { SORT_ORDER } from "../../../constants/commonConstants/commonConstants";
import { getStartAndEndOfDay } from "../../../constants/utils/date";

export interface LeaveFilters {
  user_id?: string[];
  leave_type?: string[];
  from_date?: string | undefined;
  to_date?: string | undefined;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_order?: "asc" | "desc";
}

export interface FilterQuery {
  user_id?: string | string[];
  leave_type?: string | string[];
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_order?: string;
}

const findLeavesWithFilters = async (filters: FilterQuery): Promise<ILeave[]> => {
  const query: any = {};

  if (filters.user_id) {
    query.user_id = Array.isArray(filters.user_id) ? { $in: filters.user_id } : filters.user_id;
  }

  if (filters.leave_type) {
    query.leave_type = Array.isArray(filters.leave_type)
      ? { $in: filters.leave_type }
      : filters.leave_type;
  }

  // Handle date filters only if they are string values (raw dates)
  if (
    (filters.from_date && typeof filters.from_date === "string") ||
    (filters.to_date && typeof filters.to_date === "string")
  ) {
    const dateConditions: any[] = [];

    if (filters.from_date && typeof filters.from_date === "string") {
      const { start } = getStartAndEndOfDay(filters.from_date);
      dateConditions.push({
        from_date: { $gte: start }
      });
    }

    if (filters.to_date && typeof filters.to_date === "string") {
      const { end } = getStartAndEndOfDay(filters.to_date);
      dateConditions.push({
        to_date: { $lte: end }
      });
    }

    if (dateConditions.length === 1) {
      Object.assign(query, dateConditions[0]);
    } else if (dateConditions.length === 2) {
      query.$and = dateConditions;
    }
  }

  const sort: any = {};
  if (filters.sort_field) {
    sort[filters.sort_field] = filters.sort_order === SORT_ORDER.DESC ? -1 : 1;
  } else {
    sort.updatedAt = -1;
  }

  let queryBuilder = Leave.find(query).sort(sort);

  if (filters.page && filters.page_size) {
    const skip = (filters.page - 1) * filters.page_size;
    queryBuilder = queryBuilder.skip(skip).limit(filters.page_size);
  }

  return await queryBuilder.exec();
};

const createNewLeave = async (leaveData: Partial<ILeave>): Promise<ILeave> => {
  const user = await User.findOne({ id: leaveData.user_id });

  if (!user) {
    throw new Error("Invalid user_id");
  }
  // Check for overlapping leaves for the same user
  const existingLeave = await Leave.findOne({
    user_id: leaveData.user_id,
    $or: [
      {
        from_date: { $lte: leaveData.to_date },
        to_date: { $gte: leaveData.from_date }
      }
    ]
  });
  if (existingLeave) {
    throw new Error("A leave request already exists for the specified date range");
  }

  const newLeave = new Leave({
    ...leaveData,
    user_name: user.name
  });

  return await newLeave.save();
};

const findAllLeaves = async (): Promise<ILeave[]> => {
  const leaves = await Leave.find().sort({ updatedAt: -1 });

  const enrichedLeaves = await Promise.all(
    leaves.map(async (leave: any) => {
      const user = await User.findOne({ id: leave.user_id });
      return {
        ...leave.toObject(),
        user_name: user?.name || null
      };
    })
  );

  return enrichedLeaves;
};

const findLeaveById = async (id: string): Promise<ILeave | null> => {
  return await Leave.findOne({ id });
};

const updateALeave = async (id: string, updateData: Partial<ILeave>): Promise<ILeave | null> => {
  try {
    const existingLeave = await Leave.findOne({ id });
    if (!existingLeave) return null;

    if (updateData.user_id && updateData.user_id !== existingLeave.user_id) {
      const user = await User.findOne({ id: updateData.user_id });
      if (!user) throw new Error("Invalid user_id");
      updateData.user_name = user.name;
    }
    // Check for overlapping leaves if dates are being updated
    if (updateData.from_date || updateData.to_date) {
      const checkFromDate = updateData.from_date || existingLeave.from_date;
      const checkToDate = updateData.to_date || existingLeave.to_date;
      const checkUserId = updateData.user_id || existingLeave.user_id;
      const overlappingLeave = await Leave.findOne({
        user_id: checkUserId,
        id: { $ne: id }, // Exclude the leave being updated
        $or: [
          {
            from_date: { $lte: checkToDate },
            to_date: { $gte: checkFromDate }
          }
        ]
      });
      if (overlappingLeave) {
        throw new Error("A leave request already exists for the specified date range");
      }
    }

    const updatedLeave = await Leave.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    return updatedLeave;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const deleteByLeaveId = async (id: string): Promise<ILeave | null> => {
  return await Leave.findOneAndDelete({ id });
};

export {
  createNewLeave,
  findAllLeaves,
  findLeaveById,
  updateALeave,
  deleteByLeaveId,
  findLeavesWithFilters
};
