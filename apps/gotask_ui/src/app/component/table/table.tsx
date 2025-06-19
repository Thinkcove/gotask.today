import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

// Styled table cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#D8C7DD",
    color: theme.palette.common.white,
    fontWeight: "bold"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

// Styled table row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

// Column interface
export interface Column<T> {
  id: keyof T | string;
  label: string;
  align?: "right" | "left" | "center";
  render?: (value: T[keyof T] | undefined, row: T) => ReactNode;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  minWidth?: number;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
}

// Generic Custom Table component
const CustomTable = <T extends object>({
  columns,
  rows,
  minWidth = 700,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5
}: CustomTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth }} stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={String(column.id)} align={column.align || "left"}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {columns.map((column) => {
                  const value = column.id in row ? row[column.id as keyof T] : undefined;
                  return (
                    <StyledTableCell key={String(column.id)} align={column.align || "left"}>
                      {column.render ? column.render(value, row) : (value as ReactNode)}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default CustomTable;
