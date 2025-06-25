"use client";

import { Box, Typography, Grid, IconButton, CircularProgress, Paper } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import LabelValueText from "@/app/component/text/labelValueText";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import { useAssetById } from "../../services/assetActions";
import { ASSET_TYPE } from "@/app/common/constants/asset";

const ViewAssetDetail: React.FC<{ id: string }> = ({ id }) => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const router = useRouter();
  const { asset, isLoading } = useAssetById(id);
  const handleBack = () => router.back();

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
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)",
          minHeight: "100vh"
        }}
      >
        <Paper sx={{ p: 4, borderRadius: 4, border: "1px solid #e0e0e0" }}>
          {/* Header */}
          <Grid container alignItems="center" spacing={2} mb={3}>
            <Grid item>
              <IconButton color="primary" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography variant="h5">{asset?.deviceName}</Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton color="primary" onClick={() => router.push(`/asset/edit/${asset?.id}`)}>
                <Edit />
              </IconButton>
            </Grid>
          </Grid>

          {/* Description */}
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
            {/* Common Fields */}
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
              <LabelValueText label={trans("serialnumber")} value={asset?.serialNumber || "-"} />
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
                  asset?.dateOfPurchase ? <FormattedDateTime date={asset?.dateOfPurchase} /> : "-"
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
                value={asset?.warrantyDate ? <FormattedDateTime date={asset?.warrantyDate} /> : "-"}
              />
            </Grid>

            {/* Laptop Fields */}
            {asset?.type === ASSET_TYPE.LAPTOP && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("isencrypted")} value={asset.erk || "-"} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("antivirus")} value={asset.antivirus || "-"} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <LabelValueText label={trans("recoveryKey")} value={asset.recoveryKey || "-"} />
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
                  <LabelValueText label={trans("cameraSpecs")} value={asset.cameraSpecs || "-"} />
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
        </Paper>
      </Box>
    </>
  );
};

export default ViewAssetDetail;
