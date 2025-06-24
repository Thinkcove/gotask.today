import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TablePagination,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#D8C7DD",
    fontSize: "18px",
    color: "#000000",
    borderBottom: "2px solid #B8A7BD",
    position: "sticky",
    top: 0,
    zIndex: 10,
    padding: "16px",

    [theme.breakpoints.down("sm")]: {
      fontSize: "12px",
      padding: "8px 6px"
    }
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    [theme.breakpoints.down("sm")]: {
      fontSize: "12px",
      padding: "8px 6px"
    }
  }
}));

const StyledTableRow = styled(TableRow)(({}) => ({
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const FixedHeaderTableContainer = styled(TableContainer)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  borderRadius: "4px 4px 0 0",
  border: "1px solid rgba(224, 224, 224, 1)",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch",
  "& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root": {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: "#D8C7DD",
    borderBottom: "2px solid #B8A7BD"
  },
  [theme.breakpoints.down("sm")]: {
    height: "100%", // Let it grow inside the wrapper
    maxHeight: "100%"
  }
}));

export interface Column<T> {
  id: keyof T | string;
  label: string;
  align?: "right" | "left" | "center";
  render?: (value: T[keyof T] | undefined, row: T) => ReactNode;
  minWidth?: number;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  minWidth?: number;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  maxHeight?: string;
}

const CustomTable = <T extends object>({
  columns,
  rows,
  minWidth = 700,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5,
  maxHeight = "60vh"
}: CustomTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "calc(100vh - 240px)" : "auto",
        overflow: "hidden"
      }}
    >
      <FixedHeaderTableContainer
        sx={{
          minWidth: isMobile ? "100%" : minWidth,
          maxHeight: isMobile ? "100%" : maxHeight
        }}
      >
        <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={String(column.id)}
                  align={column.align || "left"}
                  sx={{ minWidth: column.minWidth }}
                >
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
                    <StyledTableCell
                      key={String(column.id)}
                      align={column.align || "left"}
                      sx={{ minWidth: column.minWidth }}
                    >
                      {column.render
                        ? column.render(value, row)
                        : typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : (value as ReactNode)}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </FixedHeaderTableContainer>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 5,
          backgroundColor: "#fff",
          mt: "auto"
        }}
      >
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          size={isMobile ? "small" : "medium"}
        />
      </Box>
    </Box>
  );
};

export default CustomTable;
