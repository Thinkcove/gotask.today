import React, { useState } from "react";
import { Box, Typography, IconButton, Divider, Stack, Chip, Grid } from "@mui/material";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { User } from "../../interfaces/userInterface";
import ModuleHeader from "@/app/component/header/moduleHeader";
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
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import { IAssetAttributes } from "@/app/(portal)/asset/interface/asset";
import TaskToggle from "../../../../component/toggle/toggle";
import EllipsisText from "@/app/component/text/ellipsisText";

interface UserDetailProps {
  user: User;
  mutate: KeyedMutator<User>;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, mutate }) => {
  const { canAccess } = useUserPermission();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [selectedTab, setSelectedTab] = useState<string>(transuser("projectdetails"));
  const router = useRouter();
  const { userId } = useParams();
  const userID = userId as string;
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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h4" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                {user.name}
              </Typography>
              <StatusIndicator
                status={user.status ? "active" : "inactive"}
                getColor={(status) => (status === "active" ? "green" : "red")}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }} /> {/* This pushes the next icons to the right */}
            {canAccess(APPLICATIONS.USER, ACTIONS.UPDATE) && (
              <IconButton
                color="primary"
                onClick={() => router.push(`/user/viewUser/${userId}/editUser`)}
              >
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

          <Grid container spacing={2} flexDirection="column" mb={2}>

            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label={transuser("uesrid")} value={user.user_id} />
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={1}>

            <Grid item xs={6} sm={6} md={4}>
              <LabelValueText
                label={transuser("labelfirst_name")}
                value={user?.first_name || "-"}
                sx={{ textTransform: "capitalize" }}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <LabelValueText
                label={transuser("labellast_name")}
                value={user?.last_name || "-"}
                sx={{ textTransform: "capitalize" }}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <LabelValueText
                label={transuser("labeluser")}
                value={user?.name || "-"}
                sx={{ textTransform: "capitalize" }}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <LabelValueText label={transuser("labelmobile_no")} value={user?.mobile_no || "-"} />
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <LabelValueText
                label={transuser("labeljoined_date")}
                value={user?.joined_date ? <FormattedDateTime date={user?.joined_date} /> : "-"}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <LabelValueText label={transuser("labelemp_id")} value={user?.emp_id || "-"} />
            </Grid>

            <Grid item xs={6} sm={6} md={4}>
              <LabelValueText
                label={transuser("roleid")}
                value={user?.roleId.name}
                sx={{ textTransform: "capitalize" }}
              />
            </Grid>
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              {transuser("organization")}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {user.orgDetails && user.orgDetails.length > 0 ? (
                user.orgDetails.map((orgId) => (
                  <Chip
                    key={orgId.id}
                    label={orgId.name}
                    variant="outlined"
                    sx={{ textTransform: "capitalize" }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.disabled">
                  {transuser("noorganzationuser")}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <TaskToggle
              options={[transuser("projectdetails"), transasset("assetdetails")]}
              selected={selectedTab}
              onChange={setSelectedTab}
            />
          </Box>

          <Grid container spacing={2}>
            {selectedTab === transuser("projectdetails") && (
              <Grid item xs={12} md={8}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {transuser("projectdetails")}
                </Typography>

                {user.projectDetails && user.projectDetails.length > 0 ? (
                  <Grid container spacing={2}>
                    {user.projectDetails.map((project) => (
                      <Grid item xs={12} sm={6} key={project.id}>
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
                  <Typography color="text.secondary">No projects assigned yet.</Typography>
                )}
              </Grid>
            )}
            {selectedTab === transasset("assetdetails") && (
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {transasset("assets")}
                </Typography>

                {user.assetDetails && user.assetDetails.length > 0 && (
                  <Box
                    sx={{
                      display: "flex", //  Enables horizontal stacking
                      overflowX: "auto", //  Enables horizontal scroll
                      gap: 2, //  Adds spacing between cards
                      py: 1,
                      pr: 1
                    }}
                  >
                    {user.assetDetails.map((asset: IAssetAttributes, index: number) => (
                      <Box
                        key={asset.id || index}
                        sx={{
                          minWidth: 300, //  Ensures each card has a minimum width for scroll
                          maxWidth: 360,
                          flex: "0 0 auto", //  Prevents shrinking
                          p: 3,
                          borderRadius: 2,
                          bgcolor: "#ffffff",
                          border: "1px solid #e0e0e0"
                        }}
                      >
                        <Stack spacing={1}>
                          <EllipsisText text={asset.deviceName ?? ""} maxWidth="100%" />

                          {asset.modelName && (
                            <EllipsisText
                              text={`${transasset("modelname")}: ${asset.modelName}`}
                              maxWidth={250}
                            />
                          )}

                          {asset.os && (
                            <EllipsisText
                              text={`${transasset("os")}: ${asset.os}`}
                              maxWidth={250}
                            />
                          )}

                          {asset.processor && (
                            <EllipsisText
                              text={`${transasset("processor")}: ${asset.processor}`}
                              maxWidth={250}
                            />
                          )}

                          {asset.ram && (
                            <EllipsisText
                              text={`${transasset("ram")}: ${asset.ram}`}
                              maxWidth={250}
                            />
                          )}

                          {asset.storage && (
                            <EllipsisText
                              text={`${transasset("storage")}: ${asset.storage}`}
                              maxWidth={250}
                            />
                          )}

                          {asset.serialNumber && (
                            <EllipsisText
                              text={`${transasset("serialnumber")}: ${asset.serialNumber}`}
                              maxWidth={250}
                            />
                          )}

                          {asset.dateOfPurchase && (
                            <EllipsisText
                              text={`${transasset("dateOfPurchase")}: ${new Date(asset.dateOfPurchase).toLocaleDateString()}`}
                              maxWidth={250}
                            />
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            )}
          </Grid>
        </Box>

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
