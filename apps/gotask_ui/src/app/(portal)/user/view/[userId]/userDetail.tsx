import React, { useState } from "react";
import { Box, Typography, IconButton, Stack, Chip, Grid } from "@mui/material";
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
import Toggle from "../../../../component/toggle/toggle";
import EllipsisText from "@/app/component/text/ellipsisText";
import CardComponent from "@/app/component/card/cardComponent";
import { labelTextStyle } from "@/app/(portal)/asset/styles/styles";
import SkillInput from "../../components/skillInput";

interface UserDetailProps {
  user: User;
  mutate: KeyedMutator<User>;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, mutate }) => {
  const { canAccess } = useUserPermission();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const [selectedTab, setSelectedTab] = useState<string>(transuser("general"));
  const router = useRouter();
  const { userId } = useParams();
  const userID = userId as string;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
      <ModuleHeader name={transuser("userdetail")} />

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
          {/* Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h5" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                {user.name}
              </Typography>
              <StatusIndicator
                status={user.status ? "active" : "inactive"}
                getColor={(status) => (status === "active" ? "green" : "red")}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {canAccess(APPLICATIONS.USER, ACTIONS.UPDATE) && (
              <IconButton color="primary" onClick={() => router.push(`/user/edit/${userId}`)}>
                <Edit />
              </IconButton>
            )}
            {canAccess(APPLICATIONS.USER, ACTIONS.DELETE) && (
              <IconButton color="error" onClick={() => setOpenDeleteDialog(true)}>
                <Delete />
              </IconButton>
            )}
          </Box>

          {/* Toggle */}
          <Box sx={{ mb: 3 }}>
            <Toggle
              options={[
                transuser("general"),
                transuser("userskill"),
                transuser("projectdetails"),
                transasset("assetdetails")
              ]}
              selected={selectedTab}
              onChange={setSelectedTab}
            />
          </Box>

          {/* General Info */}
          {selectedTab === transuser("general") && (
            <Box sx={{ flex: 1, maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}>
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
                  <LabelValueText
                    label={transuser("labelmobile_no")}
                    value={user?.mobile_no || "-"}
                  />
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
            </Box>
          )}

          {/* Skills */}
          {selectedTab === transuser("userskill") && (
            <SkillInput
              userId={userID}
              skills={user.skills ?? []}
              onChange={async () => {
                await mutate();
              }}
            />
          )}

          {/* Projects */}
          {selectedTab === transuser("projectdetails") && (
            <Grid item xs={8} md={8}>
              {user.projectDetails && user.projectDetails.length > 0 ? (
                <Grid container spacing={2}>
                  {user.projectDetails.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
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
                <Typography color="text.secondary" fontStyle="italic">
                  {transuser("noprojects")}
                </Typography>
              )}
            </Grid>
          )}

          {selectedTab === transasset("assetdetails") && (
            <Grid item xs={12}>
              {user.assetDetails && user.assetDetails.length > 0 ? (
                <Box sx={{ display: "flex", overflowX: "auto", gap: 2, py: 1, pr: 1 }}>
                  {user.assetDetails.map((asset: IAssetAttributes, index: number) => {
                    const isAccessCard = Boolean(asset.accessCardNo);

                    return (
                      <Box
                        key={asset.id || index}
                        sx={{
                          minWidth: 300,
                          maxWidth: 360,
                          flex: "0 0 auto",
                          cursor: "pointer"
                        }}
                        onClick={() => router.push(`/asset/view/${asset.id}`)}
                      >
                        <CardComponent
                          sx={{
                            minWidth: 300,
                            maxWidth: 360
                          }}
                        >
                          <Stack spacing={1}>
                            {isAccessCard ? (
                              <>
                                <Typography {...labelTextStyle}>
                                  {transasset("accesscarddetails")}
                                </Typography>
                                <Box display="flex" justifyContent="space-between">
                                  <Typography {...labelTextStyle}>
                                    {transasset("accesscardno")}:
                                  </Typography>
                                  <EllipsisText text={asset.accessCardNo ?? "-"} maxWidth={160} />
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                  <Typography {...labelTextStyle}>
                                    {transasset("personalid")}:
                                  </Typography>
                                  <EllipsisText text={asset.personalId ?? "-"} maxWidth={160} />
                                </Box>
                              </>
                            ) : (
                              <>
                                <Typography {...labelTextStyle}>
                                  {asset.deviceName ?? ""}
                                </Typography>
                                {asset.modelName && (
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography {...labelTextStyle}>
                                      {transasset("modelname")}:
                                    </Typography>
                                    <EllipsisText text={asset.modelName} maxWidth={160} />
                                  </Box>
                                )}
                                {asset.os && (
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography {...labelTextStyle}>{transasset("os")}:</Typography>
                                    <EllipsisText text={asset.os} maxWidth={160} />
                                  </Box>
                                )}
                                {asset.processor && (
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography {...labelTextStyle}>
                                      {transasset("processor")}:
                                    </Typography>
                                    <EllipsisText text={asset.processor} maxWidth={160} />
                                  </Box>
                                )}
                                {asset.ram && (
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography {...labelTextStyle}>
                                      {transasset("ram")}:
                                    </Typography>
                                    <EllipsisText text={asset.ram} maxWidth={160} />
                                  </Box>
                                )}
                                {asset.storage && (
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography {...labelTextStyle}>
                                      {transasset("storage")}:
                                    </Typography>
                                    <EllipsisText text={asset.storage} maxWidth={160} />
                                  </Box>
                                )}
                                {asset.serialNumber && (
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography {...labelTextStyle}>
                                      {transasset("serialnumber")}:
                                    </Typography>
                                    <EllipsisText text={asset.serialNumber} maxWidth={160} />
                                  </Box>
                                )}
                                {asset.dateOfPurchase && (
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography {...labelTextStyle}>
                                      {transasset("dateOfPurchase")}:
                                    </Typography>
                                    <FormattedDateTime date={asset.dateOfPurchase} />
                                  </Box>
                                )}
                              </>
                            )}
                          </Stack>
                        </CardComponent>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  {transuser("noassets")}
                </Typography>
              )}
            </Grid>
          )}
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
