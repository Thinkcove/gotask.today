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
  useMediaQuery,
  TableSortLabel
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";
import { PAGE_OPTIONS } from "./tableConstants";
import { ASC, DESC } from "@/app/(portal)/asset/assetConstants";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#D8C7DD",
    fontSize: "15px",
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
    height: "100%",
    maxHeight: "100%"
  }
}));

const StyledTableSortLabel = styled(TableSortLabel)(({}) => ({
  color: "#000000",
  fontSize: "inherit",
  fontWeight: "inherit",

  "&.MuiTableSortLabel-root": {
    color: "#000000",
    "& .MuiTableSortLabel-icon": {
      transition: "opacity 0.2s"
    }
  },

  "&:hover": {
    color: "#000000",
    "& .MuiTableSortLabel-icon": {
      opacity: 1
    }
  },

  "&.Mui-active": {
    color: "#000000",
    "& .MuiTableSortLabel-icon": {
      color: "#000000"
    }
  },

  "& .MuiTableSortLabel-icon": {
    fontSize: "1.2rem",
    color: "#666666"
  }
}));

type Order = "asc" | "desc";

export interface Column<T> {
  id: keyof T | string;
  label: string;
  align?: "right" | "left" | "center";
  render?: (value: T[keyof T] | undefined, row: T) => ReactNode;
  minWidth?: number;
  sortable?: boolean;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  minWidth?: number;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  maxHeight?: string;
  onSortChange?: (key: string, order: "asc" | "desc") => void;
}

const CustomTable = <T extends object>({
  columns,
  rows,
  minWidth = 700,
  rowsPerPageOptions = [
    PAGE_OPTIONS.DEFAULT_ROWS_5,
    PAGE_OPTIONS.DEFAULT_ROWS_10,
    PAGE_OPTIONS.DEFAULT_ROWS_25
  ],
  defaultRowsPerPage = PAGE_OPTIONS.DEFAULT_ROWS_5,
  maxHeight = "60vh",
  onSortChange
}: CustomTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof T | string>("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRequestSort = (property: keyof T | string) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? DESC : ASC;
    setOrder(newOrder);
    setOrderBy(property);

    if (onSortChange) {
      onSortChange(String(property), newOrder);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedRows = React.useMemo(() => {
    if (onSortChange) return rows;
    if (!orderBy) return rows;

    const descendingComparator = (a: T, b: T, orderBy: keyof T | string) => {
      const aValue = orderBy in a ? a[orderBy as keyof T] : "";
      const bValue = orderBy in b ? b[orderBy as keyof T] : "";

      const aStr =
        typeof aValue === "string" || typeof aValue === "number" ? aValue : String(aValue);
      const bStr =
        typeof bValue === "string" || typeof bValue === "number" ? bValue : String(bValue);

      if (bStr < aStr) return -1;
      if (bStr > aStr) return 1;
      return 0;
    };

    const comparator =
      order === DESC
        ? (a: T, b: T) => descendingComparator(a, b, orderBy)
        : (a: T, b: T) => -descendingComparator(a, b, orderBy);

    return [...rows].sort(comparator);
  }, [rows, order, orderBy, onSortChange]);

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                  {column.sortable !== false ? (
                    <StyledTableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </StyledTableSortLabel>
                  ) : (
                    column.label
                  )}
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
          count={sortedRows.length}
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
