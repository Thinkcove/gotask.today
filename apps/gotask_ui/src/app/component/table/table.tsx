import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
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
}

// Generic Custom Table component
const CustomTable = <T extends object>({ columns, rows, minWidth = 700 }: CustomTableProps<T>) => {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <TableContainer component={Paper} sx={{ minWidth: "100%", width: "max-content" }}>
        <Table sx={{ minWidth }} aria-label="customized table">
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
            {rows.map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {columns.map((column) => {
                  // Safely fetch value if column.id exists in row
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
      </TableContainer>
    </Box>
  );
};

export default CustomTable;
