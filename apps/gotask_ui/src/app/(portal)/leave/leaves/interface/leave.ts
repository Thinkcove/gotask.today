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

// API Response interface with enhanced structure
export interface LeaveApiResponse {
  success: boolean;
  message: string;
  data: LeaveEntry[] | LeaveEntry | LeaveResponseData | null;
  count?: number;
  total_pages?: number;
  current_page?: number;
  error?: string;
}

// For the filtered response structure
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
  reasons: string;
}
export interface LeaveFilters {
  user_id?: string;
  leave_type?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_order?: string;
}
