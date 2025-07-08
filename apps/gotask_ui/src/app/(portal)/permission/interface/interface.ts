export interface PermissionData {
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  comments: string[];
  id: string;
  createdAt: string;
}

export interface PermissionListProps {
  handleScroll?: () => void;
  onPermissionClick?: (permissionId: string) => void;
}

export interface CommonGridListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onScroll?: () => void;
  noDataMessage?: React.ReactNode;
  maxHeight?: string;
}

export interface PremissionFormProps {
  formData: {
    startDate: string;
    startTime: string;
    endTime: string;
    comments: string;
  };
  errors: {
    startDate?: string;
    startTime?: string;
    endTime?: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  isSubmitting: boolean;
  user?: string;
}
export interface PermissionPayload {
  date: string;
  start_time: string;
  end_time: string;
  comment: string;
}

export interface PermissionResponse {
  id?: string;
  date: string;
  start_time: string;
  end_time: string;
  status?: string;
  created_at?: string;
}

export interface PermissionData {
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  comments: string[];
  id: string;
  createdAt: string;
}

export interface PermissionDetailsProps {
  permission: PermissionData;
  onBack: () => void;
  handleDeleteClick: () => void;
}
export interface PermissionFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
  showClear?: boolean;
  clearText?: string;
  onClearFilters?: () => void;
}

export interface PermissionColumnsConfig {
  onViewClick: (permission: PermissionData) => void;
  onDeleteClick: (permission: PermissionData) => void;
  isDeleting?: boolean;
  translations: {
    username: string;
    date: string;
    starttime: string;
    endtime: string;
    actions: string;
    viewdetails: string;
    deletepermission: string;
  };
}
