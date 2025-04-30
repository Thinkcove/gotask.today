'use client';
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
  data: AccessData[];  // Data is expected to be of type AccessData[]
  loading?: boolean;
}

const AccessTable: React.FC<Props> = ({ data, loading = false }) => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default: 5 rows per page

  // Handle pagination page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle change in rows per page
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navigate to detailed view of the access role
  const handleRowClick = (id: string) => {  // Use string for UUID
    router.push(`access/pages/view/${id}`);
  };

  // Slice the data for current pagination
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
                {["S.No.", "Access Name", "Modules & Operations"].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      backgroundColor: "rgb(55, 65, 81)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: { xs: '0.8rem', sm: '1rem' },  // Adjust font size
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
                  <TableCell colSpan={3} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No Access Roles Found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((access, index) => {
                  // Mapping over application data (AccessRole)
                  const applications = Array.isArray(access.accesses)
                    ? access.accesses
                    : [access.accesses];

                  return (
                    <TableRow
                      key={access.id}
                      hover
                      onClick={() => handleRowClick(access.id)}  // Handle row click for more details
                      className="cursor-pointer"
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{access.name}</TableCell>
                      <TableCell>
                        {applications.map((app, idx) => (
                          <div key={idx} className="mb-2">
                            <strong>{app.access}:</strong> {app.actions.join(", ")}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination controls */}
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
  