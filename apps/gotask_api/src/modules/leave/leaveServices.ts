import { PAGE, SORT_ORDER } from "../../constants/commonConstants/commonConstants";
import { getStartAndEndOfDay } from "../../constants/utils/date";
import {
  createNewLeave,
  findAllLeaves,
  findLeaveById,
  updateALeave,
  deleteByLeaveId
} from "../../domain/interface/leave/leaveInterface";
import { ILeave, Leave } from "../../domain/model/leave/leaveModel";
import { User } from "../../domain/model/user/user";

const createLeaveService = async (leaveData: Partial<ILeave>) => {
  try {
    if (new Date(leaveData.from_date!) > new Date(leaveData.to_date!)) {
      throw new Error("From date cannot be later than To date");
    }

    const newLeave = await createNewLeave(leaveData);

    return {
      success: true,
      message: "Leave request created successfully",
      data: newLeave
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create leave request"
    };
  }
};

const getAllLeavesService = async () => {
  try {
    const leaves = await findAllLeaves();
    return {
      success: true,
      message: "Leave requests retrieved successfully",
      data: leaves
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve leave requests",
      data: []
    };
  }
};

const getLeaveByIdService = async (id: string) => {
  try {
    const leave = await findLeaveById(id);

    if (!leave) {
      return {
        success: false,
        message: "Leave request not found"
      };
    }

    return {
      success: true,
      message: "Leave request retrieved successfully",
      data: leave
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve leave request"
    };
  }
};

const updateLeaveService = async (id: string, updateData: Partial<ILeave>) => {
  try {
    if (updateData.from_date && updateData.to_date) {
      if (new Date(updateData.from_date) > new Date(updateData.to_date)) {
        throw new Error("From date cannot be later than To date");
      }
    }

    const updatedLeave = await updateALeave(id, updateData);

    if (!updatedLeave) {
      return {
        success: false,
        message: "Leave request not found"
      };
    }

    return {
      success: true,
      message: "Leave request updated successfully",
      data: updatedLeave
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update leave request"
    };
  }
};

const deleteLeaveService = async (id: string) => {
  try {
    const deletedLeave = await deleteByLeaveId(id);

    if (!deletedLeave) {
      return {
        success: false,
        message: "Leave request not found"
      };
    }

    return {
      success: true,
      message: "Leave request deleted successfully",
      data: deletedLeave
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete leave request"
    };
  }
};

const getLeavesWithFiltersService = async (filters: {
  user_id?: string;
  leave_type?: string;
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

    // Build query for filtering
    const query: any = {};

    if (filters.user_id) query.user_id = filters.user_id;
    if (filters.leave_type) query.leave_type = filters.leave_type;

    // Process date filtering logic here
    if (filters.from_date || filters.to_date) {
      const dateConditions: any[] = [];

      if (filters.from_date) {
        const { start } = getStartAndEndOfDay(filters.from_date);
        dateConditions.push({
          from_date: { $gte: start }
        });
      }

      if (filters.to_date) {
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

    // Fetch total count for pagination
    const total_count = await Leave.countDocuments(query);

    // Set up sorting
    const sort: any = {};
    if (filters.sort_field) {
      sort[filters.sort_field] = filters.sort_order === SORT_ORDER.DESC ? -1 : 1;
    } else {
      sort.updatedAt = -1;
    }

    // Build query with pagination and sorting
    let queryBuilder = Leave.find(query).sort(sort);

    if (page && page_size) {
      const skip = (page - 1) * page_size;
      queryBuilder = queryBuilder.skip(skip).limit(page_size);
    }

    const filteredLeaves = await queryBuilder.exec();

    // Build query with pagination and sorting
    let queryBuilder = Leave.find(query).sort(sort);

    if (page && page_size) {
      const skip = (page - 1) * page_size;
      queryBuilder = queryBuilder.skip(skip).limit(page_size);
    }

    if (page && page_size) {
      const skip = (page - 1) * page_size;
      queryBuilder = queryBuilder.skip(skip).limit(page_size);
    }

    const filteredLeaves = await queryBuilder.exec();

    const enrichedLeaves = await Promise.all(
      filteredLeaves.map(async (leave: any) => {
        const user = await User.findOne({ id: leave.user_id });
        return {
          ...leave.toObject(),
          user_name: user?.name || null
        };
      })
    );
    return {
      success: true,
      message: "Leave requests retrieved successfully",
      data: {
        leaves: enrichedLeaves,
        total_count,
        total_pages: Math.ceil(total_count / page_size),
        current_page: page
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve leave requests",
      data: {
        leaves: [],
        total_count: 0,
        total_pages: 0,
        current_page: filters.page || 1
      }
    };
  }
};

export {
  createLeaveService,
  getAllLeavesService,
  getLeaveByIdService,
  updateLeaveService,
  deleteLeaveService,
  getLeavesWithFiltersService
};
