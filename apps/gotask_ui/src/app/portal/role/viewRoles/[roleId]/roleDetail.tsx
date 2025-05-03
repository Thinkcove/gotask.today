import { useParams, useRouter } from "next/navigation";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  Chip,
  Stack,
  Tooltip,
  Grid,
  Card,
  CardHeader,
  CardContent
} from "@mui/material";
import { Add, ArrowBack, Delete } from "@mui/icons-material";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { Role } from "../../interfaces/roleInterface";
import CommonDialog from "@/app/component/dialog/commonDialog";
import FormField from "@/app/component/formField";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { fetchAllAccess, removeAccessFromRole, updateRole } from "../../services/roleAction";
import { scrollStyles } from "@/app/styles/style";

interface RoleDetailProps {
  role: Role;
  mutate: KeyedMutator<Role>;
}

const RoleDetail: React.FC<RoleDetailProps> = ({ role, mutate }) => {
  const router = useRouter();
  const { roleId } = useParams();
  const roleID = roleId as string;
  const { getAllAccess } = fetchAllAccess();

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAccessIds, setSelectedAccessIds] = useState<string[]>([]);
  const [selectedAccessId, setSelectedAccessId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleBack = () => setTimeout(() => router.back(), 200);

  const handleAddAccess = async () => {
    setOpenAddDialog(false);
    try {
      const payload = {
        accessIds: selectedAccessIds
      };
      const response = await updateRole(roleID, payload as Role);
      await mutate();
      setSelectedAccessIds([]);
      setSnackbar({ open: true, message: response.message, severity: SNACKBAR_SEVERITY.SUCCESS });
    } catch (error) {
      console.error("Error updating access:", error);
      setSnackbar({
        open: true,
        message: "Error while adding access",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAccessId) return;
    try {
      const response = await removeAccessFromRole(roleID, selectedAccessId);
      await mutate();
      setOpenDeleteDialog(false);
      setSelectedAccessId(null);
      setSnackbar({ open: true, message: response.message, severity: SNACKBAR_SEVERITY.SUCCESS });
    } catch (error) {
      console.error("Error removing access:", error);
      setSnackbar({
        open: true,
        message: "Error while removing access",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <>
      <ModuleHeader name="Role Detail View" />
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <Box sx={{ borderRadius: 4, p: 4, bgcolor: "#f9fafb", border: "1px solid #e0e0e0" }}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Typography variant="h4" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                {role.name}
              </Typography>
              <Tooltip title="Add Access">
                <IconButton
                  onClick={() => setOpenAddDialog(true)}
                  sx={{ backgroundColor: "#741B92", "&:hover": { backgroundColor: "#741B92" } }}
                >
                  <Add sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="h6" fontWeight={200}>
            Access Details for this Role
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Below are the areas and actions that this role has access to.
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ ...scrollStyles }}>
            {role.accessDetails?.length ? (
              role.accessDetails.map((access) => (
                <Card key={access.id} variant="outlined" sx={{ mb: 4, borderRadius: 3 }}>
                  <CardHeader
                    title={
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ textTransform: "capitalize", color: "#222" }}
                      >
                        {access.name}
                      </Typography>
                    }
                    action={
                      <Tooltip title="Delete Access">
                        <IconButton
                          onClick={() => {
                            setSelectedAccessId(access.id);
                            setOpenDeleteDialog(true);
                          }}
                          sx={{ transition: "0.2s ease", "&:hover": { transform: "scale(1.1)" } }}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    }
                    sx={{ pb: 0 }}
                  />
                  <CardContent sx={{ pt: 1 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                      {access.application.map((app) => (
                        <Grid item xs={12} sm={6} md={4} key={app._id}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "#fafafa",
                              height: "100%",
                              border: "1px solid #eeee",
                              transition: "all 0.3s ease"
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              sx={{ textTransform: "capitalize", mb: 1, color: "#555" }}
                            >
                              {app.access}
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                              {app.actions.map((action) => (
                                <Chip
                                  key={action}
                                  label={action}
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No Access Details Available
              </Typography>
            )}
          </Box>
        </Box>

        {/* Add Access Dialog */}
        <CommonDialog
          open={openAddDialog}
          onClose={() => {
            setSelectedAccessIds([]);
            setOpenAddDialog(false);
          }}
          onSubmit={handleAddAccess}
          title="Add Access"
          submitLabel=" Add Access"
        >
          <FormField
            label="Access"
            type="multiselect"
            placeholder="Select Access"
            options={getAllAccess}
            value={selectedAccessIds}
            onChange={(ids) => setSelectedAccessIds(ids as string[])}
          />
        </CommonDialog>

        {/* Delete Access Dialog */}
        <CommonDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onSubmit={handleDelete}
          title="Delete Access"
          submitLabel="Delete"
        >
          <Typography>
            Are you sure you want to remove this access from the role?
            <br />
            This will revoke the permissions granted by this access.
          </Typography>
        </CommonDialog>

        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </>
  );
};

export default RoleDetail;
