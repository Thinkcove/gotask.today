export interface ILeave {
  id?: string;
  user_id: string;
  leave_type: 'sick' | 'personal';
  from_date: Date | string;
  to_date: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface ILeaveDisplayRow {
  id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  duration: string;
  appliedDate: string;
}

export interface IUser {
  id: string;
  name: string; 
  email?: string;
}

export interface ILeaveFilters {
  user_id?: string;
  leave_type?: 'sick' | 'personal';
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_order?: 'asc' | 'desc';
}