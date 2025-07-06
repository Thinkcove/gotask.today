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
