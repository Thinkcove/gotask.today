import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery,
  TableSortLabel,
  useTheme
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";
import { PAGE_OPTIONS } from "./tableConstants";
import { ASC, CREATED_AT, DESC } from "@/app/(portal)/asset/assetConstants";
import TableSkeletonRows from "./row";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

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

const StyledTableSortLabel = styled(TableSortLabel)(() => ({
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
  isLoading?: boolean;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  minWidth?: number;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  maxHeight?: string;
  onSortChange?: (key: string, order: "asc" | "desc") => void;
  isLoading?: boolean;
  onPageChange?: (page: number, limit: number) => void;
  totalCount?: number;
}

const CustomTable = <T extends object>({
  columns,
  rows,
  minWidth = 700,
  rowsPerPageOptions = [
    PAGE_OPTIONS.DEFAULT_ROWS_25,
    PAGE_OPTIONS.DEFAULT_ROWS_35,
    PAGE_OPTIONS.DEFAULT_ROWS_45
  ],
  defaultRowsPerPage = PAGE_OPTIONS.DEFAULT_ROWS_25,
  maxHeight = "60vh",
  onSortChange,
  isLoading,
  onPageChange,
  totalCount
}: CustomTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof T | string>("");
  const transkey = useTranslations(LOCALIZATION.TRANSITION.COMMON);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRequestSort = (property: keyof T | string) => {
    let newOrder: Order = ASC;
    if (orderBy === property && order === DESC) {
      setOrder(DESC);
      setOrderBy(CREATED_AT);

      if (onSortChange) {
        onSortChange(CREATED_AT, DESC);
      }
      return;
    }

    if (orderBy === property) {
      newOrder = order === ASC ? DESC : ASC;
    }

    setOrder(newOrder);
    setOrderBy(property);

    if (onSortChange) {
      onSortChange(String(property), newOrder);
    }
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

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: maxHeight,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <TableContainer
          sx={{
            minWidth,
            flex: 1,
            overflow: "auto",
            scrollBehavior: "smooth",
            marginBottom: isMobile ? "40px" : "20px",
            "&::-webkit-scrollbar": {
              width: "8px"
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1"
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: "4px"
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#a8a8a8"
            }
          }}
        >
          <Table stickyHeader sx={{ tableLayout: "fixed", minWidth }}>
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
                        direction={orderBy === column.id ? order : DESC}
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
              {isLoading ? (
                <TableSkeletonRows columns={columns} rowsPerPage={rowsPerPage} />
              ) : sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: "#888" }}>
                    {transkey("nodatafound")}
                  </TableCell>
                </TableRow>
              ) : (
                sortedRows.map((row, rowIndex) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Sticky footer pagination */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#fff",
          borderTop: "1px solid #ddd",
          px: 2
        }}
      >
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => {
            setPage(newPage);
            onPageChange?.(newPage, rowsPerPage);
          }}
          onRowsPerPageChange={(event) => {
            const newLimit = parseInt(event.target.value, 10);
            setRowsPerPage(newLimit);
            setPage(0);
            onPageChange?.(0, newLimit);
          }}
          count={totalCount ?? sortedRows.length}
        />
      </Box>
    </>
  );
};

export default CustomTable;
