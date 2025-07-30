import React from "react";
import { TableRow, TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Column } from "./table";
import SkeletonLoader from "../loader/skeletonLoader";

const StyledTableRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
    padding: "8px 6px"
  }
}));

interface TableSkeletonRowsProps<T> {
  columns: Column<T>[];
  rowsPerPage: number;
}

const TableSkeletonRows = <T extends object>({
  columns,
  rowsPerPage
}: TableSkeletonRowsProps<T>) => {
  return (
    <>
      {Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
        <StyledTableRow key={`skeleton-${rowIndex}`}>
          {columns.map((column, colIndex) => (
            <StyledTableCell
              key={`skeleton-cell-${colIndex}`}
              align={column.align || "left"}
              sx={{ minWidth: column.minWidth }}
            >
              <SkeletonLoader count={1} height={20} width="100%"  />
            </StyledTableCell>
          ))}
        </StyledTableRow>
      ))}
    </>
  );
};

export default TableSkeletonRows;
