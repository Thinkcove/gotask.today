export interface User {
  id: string;
  name: string;
}

// Leave interface
export interface LeaveEntry {
  id: string;
  user_id: string;
  user_name: string;
  from_date: string;
  to_date: string;
  leave_type: string;
  reasons: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveGridProps {
  data: LeaveEntry[];
  fromDate: string;
  toDate: string;
}

export interface LeaveApiResponse {
  success: boolean;
  message: string;
  data: LeaveEntry[] | LeaveEntry | LeaveResponseData | null;
  count?: number;
  total_pages?: number;
  current_page?: number;
  error?: string;
}
export interface LeaveResponseData {
  leaves: LeaveEntry[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export interface LeavePayload {
  from_date: string;
  to_date: string;
  leave_type: string;
  user_name?: string;
}
export interface LeaveFilters {
  user_id?: string | string[];
  leave_type?: string | string[];
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_order?: string;
}

export interface LeaveFormField {
  from_date: string;
  to_date: string;
  leave_type: string;
  reasons?: string;
}

export interface Item {
  id: string;
  name: string | null | undefined;
}

export interface leaveFilterProps {
  userIdFilter: string[];
  leaveTypeFilter: string[];
  fromDate: string;
  toDate: string;
  allUserIds: string[];
  allUserNames: string[];
  allLeaveTypes: string[];
  onUserIdChange: (val: string[]) => void;
  onLeaveTypeChange: (val: string[]) => void;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onClearFilters: () => void;
  loading?: boolean;
}
