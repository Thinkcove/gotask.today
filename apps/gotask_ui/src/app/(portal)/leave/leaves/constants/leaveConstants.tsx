// constants/leaveConstants.ts
import { ILeaveDisplayRow } from "../interface/leave";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Chip } from "@mui/material";

export const LEAVE_TYPES = [
  'sick_leave',
  'annual_leave',
  'maternity_leave',
  'paternity_leave',
  'emergency_leave',
  'casual_leave',
  'personal_leave'
];

export const LEAVE_STATUSES = [
  'pending',
  'approved',
  'rejected'
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

export const calculateDuration = (fromDate: string, toDate: string): string => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffTime = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
};

export const getLeaveColumns = (
  trans: (key: string) => string,
  handleEdit: (row: ILeaveDisplayRow) => void,
  handleView: (row: ILeaveDisplayRow) => void,
  handleDelete?: (row: ILeaveDisplayRow) => void
) => [
  {
    field: "leaveType",
    headerName: trans("leaveType"),
    width: 150,
    renderCell: (params: any) => (
      <span style={{ textTransform: 'capitalize' }}>
        {params.value.replace('_', ' ')}
      </span>
    )
  },
  {
    field: "fromDate",
    headerName: trans("fromDate"),
    width: 120
  },
  {
    field: "toDate",
    headerName: trans("toDate"),
    width: 120
  },
  {
    field: "duration",
    headerName: trans("duration"),
    width: 100
  },
  {
    field: "status",
    headerName: trans("status"),
    width: 120,
    renderCell: (params: any) => (
      <Chip
        label={params.value}
        color={getStatusColor(params.value) as any}
        size="small"
        sx={{ textTransform: 'capitalize' }}
      />
    )
  },
  {
    field: "reason",
    headerName: trans("reason"),
    width: 200,
    renderCell: (params: any) => (
      <span title={params.value}>
        {params.value.length > 30 ? `${params.value.substring(0, 30)}...` : params.value}
      </span>
    )
  },
  {
    field: "appliedDate",
    headerName: trans("appliedDate"),
    width: 120
  },
  {
    field: "approvedBy",
    headerName: trans("approvedBy"),
    width: 150,
    renderCell: (params: any) => params.value || '-'
  },
  {
    field: "actions",
    headerName: trans("actions"),
    width: 150,
    sortable: false,
    renderCell: (params: any) => (
      <div style={{ display: 'flex', gap: '4px' }}>
        <IconButton
          size="small"
          onClick={() => handleView(params.row)}
          title={trans("view")}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handleEdit(params.row)}
          title={trans("edit")}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        {handleDelete && (
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row)}
            title={trans("delete")}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    )
  }
];