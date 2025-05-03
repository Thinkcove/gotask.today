import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { AccessData } from "../interfaces/accessInterfaces";

interface Props {
  data: AccessData[];
  loading?: boolean;
}

const AccessTable: React.FC<Props> = ({ data, loading = false }) => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (id: string) => {
    router.push(`access/pages/view/${id}`);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ maxWidth: '100%', overflowX: 'auto', mt: 2 }}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            maxHeight: '60vh',
            overflow: 'auto',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["S.No.", "Access Name", "Created At", "Updated At"].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      backgroundColor: "rgb(55, 65, 81)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: { xs: '0.8rem', sm: '1rem' },
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Access Roles Found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((access, index) => (
                  <TableRow
                    key={access.id}
                    hover
                    onClick={() => handleRowClick(access.id)}
                    className="cursor-pointer"
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{access.name}</TableCell>
                    <TableCell>{access.createdAt ? new Date(access.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{access.updatedAt ? new Date(access.updatedAt).toLocaleDateString() : 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </>
  );
};

export default AccessTable;
