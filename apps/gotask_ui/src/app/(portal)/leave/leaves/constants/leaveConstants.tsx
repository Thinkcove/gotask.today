import { ILeaveDisplayRow } from "../interface/leave";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

export const LEAVE_TYPES = ['sick', 'personal'];

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
        {params.value}
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
    field: "appliedDate",
    headerName: trans("appliedDate"),
    width: 120
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

export const calculateDuration = (fromDate: string, toDate: string): string => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffTime = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
};