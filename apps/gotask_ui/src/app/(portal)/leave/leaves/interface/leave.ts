// interfaces/leave.ts
export interface ILeave {
  id?: string;
  user_id: string;
  leave_type: string;
  from_date: Date | string;
  to_date: Date | string;
  reason?: string;
  status?: 'pending' | 'approved' | 'rejected';
  applied_date?: Date | string;
  approved_by?: string;
  approved_date?: Date | string;
  comments?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface ILeaveDisplayRow {
  id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  duration: string;
  status: string;
  reason: string;
  appliedDate: string;
  approvedBy?: string;
}

export interface IUser {
  id: string;
  name: string; 
  email?: string;
}

export interface ILeaveFilters {
  user_id?: string;
  leave_type?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_order?: 'asc' | 'desc';
}