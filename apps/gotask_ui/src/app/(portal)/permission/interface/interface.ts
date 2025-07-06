export interface PermissionData {
  _id: string;
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  comments: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
export interface PermissionLoadingStateProps {
  title: string;
}
export interface PremissionFormProps {
  formData: {
    startDate: string;
    startTime: string;
    endTime: string;
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
}

export interface PermissionResponse {
  id?: string;
  date: string;
  start_time: string;
  end_time: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PermissionData {
  _id: string;
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  comments: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PermissionDetailsProps {
  permission: PermissionData;
  onBack: () => void;
}
