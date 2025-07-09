import { ILeave, Leave } from "../../model/leave/leaveModel";
import { User } from "../../model/user/user";
import logger from "../../../common/logger";
import { SORT_ORDER } from "../../../constants/commonConstants/commonConstants";

export interface FilterQuery {
  user_id?: string;
  leave_type?: string;
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
    query.user_id = filters.user_id;
  }

  if (filters.leave_type) {
    query.leave_type = filters.leave_type;
  }

  // Updated date filtering logic to match the service
  if (filters.from_date || filters.to_date) {
    const dateConditions: any[] = [];

    // If From Date is selected: show leaves that start on or after that date
    if (filters.from_date) {
      const fromDate = new Date(filters.from_date);
      dateConditions.push({
        from_date: { $gte: fromDate }
      });
    }

    // If To Date is selected: show leaves that end on or before that date
    if (filters.to_date) {
      const toDate = new Date(filters.to_date);
      // Set to end of day to include the entire selected date
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);

      dateConditions.push({
        to_date: { $lte: endOfDay }
      });
    }

    // Combine conditions based on what filters are provided
    if (dateConditions.length === 1) {
      // Only one date filter is applied
      Object.assign(query, dateConditions[0]);
    } else if (dateConditions.length === 2) {
      // Both date filters are applied - leaves must satisfy both conditions
      query.$and = dateConditions;
    }
  }

  const sort: any = {};
  if (filters.sort_field) {
    sort[filters.sort_field] = filters.sort_order === SORT_ORDER.DESC ? -1 : 1;
  } else {
    sort.created_on = -1; // Default sort
  }

  let queryBuilder = Leave.find(query).sort(sort);

  // Add pagination
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

  const newLeave = new Leave({
    ...leaveData,
    user_name: user.name
  });

  return await newLeave.save();
};

const findAllLeaves = async (): Promise<ILeave[]> => {
  return await Leave.find().sort({ created_on: -1 });
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

    const updatedLeave = await Leave.findOneAndUpdate(
      { id },
      { ...updateData, updated_on: new Date() },
      { new: true }
    );

    return updatedLeave;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to update leave request");
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
