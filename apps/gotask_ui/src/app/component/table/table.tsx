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

// Styled cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#D8C7DD",
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

// Styled row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

// Column interface
interface Column {
  id: string;
  label: string;
  align?: "right" | "left" | "center";
  render?: (value: any, row: any) => React.ReactNode;
}

// Props
interface CustomTableProps {
  columns: Column[];
  rows: any[];
  minWidth?: number;
}

// Responsive CustomTable
const CustomTable: React.FC<CustomTableProps> = ({ columns, rows, minWidth = 700 }) => {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <TableContainer component={Paper} sx={{ minWidth: "100%", width: "max-content" }}>
        <Table sx={{ minWidth }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id} align={column.align || "left"}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                {columns.map((column) => (
                  <StyledTableCell key={column.id} align={column.align || "left"}>
                    {column.render ? column.render(row[column.id], row) : row[column.id]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomTable;
