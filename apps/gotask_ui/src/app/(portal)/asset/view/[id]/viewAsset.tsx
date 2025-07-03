"use client";

import { Box, Typography, Grid, IconButton, CircularProgress, Paper, Stack } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import LabelValueText from "@/app/component/text/labelValueText";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import { useAssetById } from "../../services/assetActions";
import { ASSET_TYPE, getIssuesStatusColor } from "@/app/common/constants/asset";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommonDialog from "@/app/component/dialog/commonDialog";

const ViewAssetDetail: React.FC<{ id: string }> = ({ id }) => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const router = useRouter();
  const { asset, isLoading } = useAssetById(id);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showErkModal, setShowErkModal] = useState(false);
  const handleBack = () => router.back();
  const handleOpenRecoveryModal = () => setShowRecoveryModal(true);
  const handleCloseRecoveryModal = () => setShowRecoveryModal(false);
  const handleOpenErkModal = () => setShowErkModal(true);
  const handleCloseErkModal = () => setShowErkModal(false);

  if (isLoading) {
    return (
      <>
        <ModuleHeader name={trans("assets")} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh"
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <ModuleHeader name={trans("assets")} />
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          overflow: "auto",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)",
          p: 3
        }}
      >
        <Paper sx={{ p: 4, pb: 8, borderRadius: 4, border: "1px solid #e0e0e0" }}>
          {/* Header */}
          <Grid container alignItems="center" spacing={2} mb={3}>
            <Grid item>
              <IconButton color="primary" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography variant="h5">
                {asset?.deviceName
                  ? asset.deviceName
                  : asset?.accessCardNo
                    ? trans("accessdetails")
                    : "-"}
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton color="primary" onClick={() => router.push(`/asset/edit/${asset?.id}`)}>
                <Edit />
              </IconButton>
            </Grid>
          </Grid>

          {asset?.accessCardNo ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("assignedTo")} value={asset.assignedTo || "-"} />
                </Grid>

                {asset?.tags?.previouslyUsedBy && (
                  <Grid item xs={12} sm={6} md={4}>
                    <LabelValueText
                      label={trans("previouslyUsedBy")}
                      value={asset.tags.previouslyUsedBy || "-"}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("accesscardno")} value={asset.accessCardNo || "-"} />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("personalid")} value={asset.personalId || "-"} />
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  {trans("description")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.primary", lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                >
                  {asset?.commentService || "-"}
                </Typography>
              </Grid>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("modelname")} value={asset?.modelName || "-"} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("assignedTo")} value={asset?.assignedTo || "-"} />
                </Grid>
                {asset?.tags?.previouslyUsedBy && (
                  <Grid item xs={12} sm={6} md={4}>
                    <LabelValueText
                      label={trans("previouslyUsedBy")}
                      value={asset?.tags?.previouslyUsedBy || "-"}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText
                    label={trans("serialnumber")}
                    value={asset?.serialNumber || "-"}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("os")} value={asset?.os || "-"} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("ram")} value={asset?.ram || "-"} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("storage")} value={asset?.storage || "-"} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("processor")} value={asset?.processor || "-"} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("seller")} value={asset?.seller || "-"} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText
                    label={trans("dateOfPurchase")}
                    value={
                      asset?.dateOfPurchase ? (
                        <FormattedDateTime date={asset?.dateOfPurchase} />
                      ) : (
                        "-"
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText
                    label={trans("warrantyPeriod")}
                    value={asset?.warrantyPeriod || "-"}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText
                    label={trans("warrantyDate")}
                    value={
                      asset?.warrantyDate ? <FormattedDateTime date={asset?.warrantyDate} /> : "-"
                    }
                  />
                </Grid>

                {/* Laptop Fields */}
                {(asset?.type === ASSET_TYPE.LAPTOP || asset?.type === ASSET_TYPE.DESKTOP) && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText
                        label={trans("antivirus")}
                        value={asset.antivirus ? trans("enabled") : "-"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText
                        label={trans("recoveryKey")}
                        value={
                          <Box display="flex" alignItems="center">
                            <Typography
                              variant="body1"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "flex",
                                alignItems: "center"
                              }}
                            >
                              {asset.recoveryKey ? "********" : "-"}
                            </Typography>
                            {asset.recoveryKey && (
                              <IconButton
                                size="small"
                                sx={{ ml: 1, mb: 1 }}
                                onClick={handleOpenRecoveryModal}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText
                        label={trans("lastServicedDate")}
                        value={
                          asset.lastServicedDate ? (
                            <FormattedDateTime date={asset.lastServicedDate} />
                          ) : (
                            "-"
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText
                        label={trans("isencrypted")}
                        value={asset.isEncrypted ? trans("enc") : trans("notenc")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                        {trans("encryptedkey")}
                      </Typography>

                      <Box display="flex" alignItems="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                          }}
                        >
                          {asset.erk ? "********" : "-"}
                        </Box>
                        {asset.erk && (
                          <IconButton
                            size="small"
                            onClick={handleOpenErkModal}
                            sx={{ mb: 1, ml: 1 }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  </>
                )}

                {/* Mobile Fields */}
                {asset?.type === ASSET_TYPE.MOBILE && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText label={trans("imeiNumber")} value={asset.imeiNumber || "-"} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText label={trans("screenSize")} value={asset.screenSize || "-"} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText
                        label={trans("batteryCapacity")}
                        value={asset.batteryCapacity || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText
                        label={trans("cameraSpecs")}
                        value={asset.cameraSpecs || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText label={trans("simType")} value={asset.simType || "-"} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText
                        label={trans("insuranceProvider")}
                        value={asset.insuranceProvider || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText
                        label={trans("insurancePolicyNumber")}
                        value={asset.insurancePolicyNumber || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <LabelValueText
                        label={trans("insuranceExpiry")}
                        value={
                          asset.insuranceExpiry ? (
                            <FormattedDateTime date={asset.insuranceExpiry} />
                          ) : (
                            "-"
                          )
                        }
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </>
          )}
          {asset?.issues && asset.issues.length > 0 && (
            <>
              <Typography variant="h6" mt={4} mb={2}>
                {trans("issues")}
              </Typography>

              <Box sx={{ pr: 1 }}>
                <Grid container spacing={2}>
                  {asset.issues.map((issue) => (
                    <Grid item xs={12} sm={6} md={4} key={issue.id}>
                      <Box
                        onClick={() => router.push(`/asset/viewIssues/${issue.id}`)}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          display: "flex",
                          flexDirection: "column",
                          bgcolor: "#ffffff",
                          border: "1px solid #e0e0e0",
                          height: "100%",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          transition: "0.3s ease",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
                          }
                        }}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          {issue.issueType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5} mb={1}>
                          {issue.description || trans("nodescription")}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <StatusIndicator status={issue.status} getColor={getIssuesStatusColor} />
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
          <CommonDialog
            open={showErkModal}
            onClose={handleCloseErkModal}
            hideCancelButton={true}
            title={trans("encryptedkey")}
          >
            <Box
              sx={{
                p: 2
              }}
            >
              {asset?.erk || "-"}
            </Box>
          </CommonDialog>

          <CommonDialog
            open={showRecoveryModal}
            onClose={handleCloseRecoveryModal}
            title={trans("recoveryKey")}
            hideCancelButton={true}
          >
            <Box
              sx={{
                p: 2
              }}
            >
              {asset?.recoveryKey || "-"}
            </Box>
          </CommonDialog>
        </Paper>
      </Box>
    </>
  );
};

export default ViewAssetDetail;
