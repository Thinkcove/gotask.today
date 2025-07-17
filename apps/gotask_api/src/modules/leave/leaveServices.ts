import { PAGE, SORT_ORDER } from "../../constants/commonConstants/commonConstants";
import { getStartAndEndOfDay } from "../../constants/utils/date";
import {
  createNewLeave,
  findAllLeaves,
  findLeaveById,
  updateALeave,
  deleteByLeaveId,
  findLeavesWithFilters
} from "../../domain/interface/leave/leaveInterface";
import { ILeave, Leave } from "../../domain/model/leave/leaveModel";

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
    const page = filters.page || parseInt(PAGE.ONE); // 1-based indexing
    const page_size = filters.page_size || parseInt(PAGE.TEN);

    // Build query for filtering
    const query: any = {};
    if (filters.user_id) query.user_id = filters.user_id;
    if (filters.leave_type) query.leave_type = filters.leave_type;

    // Updated date filtering logic
    if (filters.from_date || filters.to_date) {
      const dateConditions: any[] = [];

      // If From Date is selected: show leaves that start on or after that date
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

      // Combine conditions based on what filters are provided
      if (dateConditions.length === 1) {
        Object.assign(query, dateConditions[0]);
      } else if (dateConditions.length === 2) {
        query.$and = dateConditions;
      }
    }

    // Fetch total count for pagination
    const total_count = await Leave.countDocuments(query);

    // Fetch paginated leaves with sorting
    const filteredLeaves = await findLeavesWithFilters({
      ...query,
      page,
      page_size,
      sort_field: filters.sort_field || "updatedAt",
      sort_order: filters.sort_order || SORT_ORDER.DESC
    });

    return {
      success: true,
      message: "Leave requests retrieved successfully",
      data: {
        leaves: filteredLeaves,
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
