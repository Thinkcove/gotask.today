import React, { useState } from "react";
import { Box, Typography, IconButton, Divider, Stack, Chip, Grid } from "@mui/material";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { IUserField, User } from "../../interfaces/userInterface";
import ModuleHeader from "@/app/component/header/moduleHeader";
import EditUser from "./editUser";
import { KeyedMutator } from "swr";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { deleteUser } from "../../services/userAction";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { getStatusColor } from "@/app/common/constants/task";
import LabelValueText from "@/app/component/text/labelValueText";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";

interface UserDetailProps {
  user: User;
  mutate: KeyedMutator<User>;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, mutate }) => {
  const { canAccess } = useUserPermission();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const router = useRouter();
  const { userId } = useParams();
  const userID = userId as string;
  const [editOpen, setEditOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // state for the delete confirmation dialog
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleBack = () => {
    setTimeout(() => router.back(), 2000);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userID);
      await mutate();
      setSnackbar({
        open: true,
        message: transuser("deletesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setOpenDeleteDialog(false);
      setTimeout(() => router.back(), 2000);
    } catch {
      setSnackbar({
        open: true,
        message: transuser("deleteerror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const mapUserToUserField = (user: User): IUserField => ({
    first_name: user.first_name,
    last_name: user.last_name,
    name: user.name,
    status: user.status,
    mobile_no: user.mobile_no,
    joined_date: user.joined_date,
    emp_id:user.emp_id,
    organization: user.organization,
    roleId: user.roleId._id,
    user_id: user.user_id
  });

  return (
    <>
      {/* Header */}
      <ModuleHeader name={transuser("userdetail")} />

      {/* Main Content */}
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            p: 4,
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0"
          }}
        >
          {/* User Info Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight={700} sx={{ textTransform: "capitalize" }}>
              {user.name}
            </Typography>
            <Box sx={{ flexGrow: 1 }} /> {/* This pushes the next icons to the right */}
            {canAccess(APPLICATIONS.USER, ACTIONS.UPDATE) && (
              <IconButton color="primary" onClick={() => setEditOpen(true)}>
                <Edit />
              </IconButton>
            )}
            {canAccess(APPLICATIONS.USER, ACTIONS.DELETE) && (
              <IconButton color="error" onClick={() => setOpenDeleteDialog(true)}>
                <Delete />
              </IconButton>
            )}
          </Box>

          {/* Basic Details */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <LabelValueText label={transuser("uesrid")} value={user.user_id} />
            </Grid>

             
          <Grid item xs={12} md={6}>
            <LabelValueText
              label={transuser("labelmobile_no")}
              value={user?.mobile_no || "-"}
              sx={{ textTransform: "capitalize" }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LabelValueText
              label={transuser("labeljoined_date")}
              value={
                user?.joined_date
                  ? new Date(user.joined_date).toLocaleDateString()
                  : "-"
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LabelValueText
              label={transuser("labelemp_id")}
              value={user?.emp_id || "-"}
            />
          </Grid>

            <Grid item xs={12} md={6}>
              <LabelValueText
                label={transuser("roleid")}
                value={user?.roleId.name}
                sx={{ textTransform: "capitalize" }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                {transuser("status")}
              </Typography>
              <Chip
                label={user.status ? "Active" : "Inactive"}
                color={user.status ? "success" : "error"}
                size="small"
              />
            </Grid>




            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                {transuser("organization")}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {user.orgDetails?.map((orgId) => (
                  <Chip
                    key={orgId.id}
                    label={orgId.name}
                    variant="outlined"
                    sx={{ textTransform: "capitalize" }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Project Details */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {transuser("projectdetails")}
          </Typography>

          {user.projectDetails && user.projectDetails.length > 0 ? (
            <Grid container spacing={2} sx={{ maxHeight: "300px", overflowY: "auto" }}>
              {user.projectDetails.map((project) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "#ffffff",
                      border: "1px solid #e0e0e0",
                      height: "100%",
                      justifyContent: "space-between"
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h4" fontWeight={700} fontSize="1rem">
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                      <StatusIndicator status={project.status} getColor={getStatusColor} />
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography color="text.secondary">No projects assigned yet.</Typography>
            </Grid>
          )}
        </Box>

        {/* Edit User Dialog */}
        <EditUser
          open={editOpen}
          onClose={() => setEditOpen(false)}
          data={mapUserToUserField(user)}
          mutate={mutate}
          userID={userID}
        />

        <CommonDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onSubmit={handleDelete}
          title={transuser("deleteuser")}
          submitLabel="Delete"
        >
          <Typography>{transuser("deleteornot")}</Typography>
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

export default UserDetail;
