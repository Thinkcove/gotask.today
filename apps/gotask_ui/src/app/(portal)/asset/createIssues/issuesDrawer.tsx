import React from "react";
import { Drawer, Box, Typography, Card, CardContent, Avatar, Stack, Paper } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getColorForUser } from "@/app/common/constants/avatar";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import { IIssuesHistories } from "../interface/asset";

interface IssueHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  history: IIssuesHistories[];
  mode?: "asset" | "issues";
}

const IssueHistoryDrawer: React.FC<IssueHistoryDrawerProps> = ({
  open,
  onClose,
  history,
  mode
}) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 360,
          display: "flex",
          flexDirection: "column"
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh"
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            position: "sticky",
            top: 0,
            zIndex: 1000
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transasset("issueshistory")}
          </Typography>

          {history.length > 0 && (
            <Paper
              variant="outlined"
              sx={{
                px: 1,
                py: 0.5,
                mt: 1,
                border: "none",
                color: "#741B92",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#E1D7E0",
                borderRadius: 1.5,
                gap: 1
              }}
            >
              <InfoOutlined sx={{ height: 14, width: 14 }} />
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                {transasset("assetslog")}
              </Typography>
            </Paper>
          )}
        </Box>

        {/* History Body */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {history.map((item) => (
            <Card
              key={item.id}
              sx={{
                mb: 2,
                boxShadow: 2,
                borderRadius: 2,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { boxShadow: 3 }
              }}
            >
              <CardContent sx={{ pb: "10px !important" }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <Avatar
                    sx={{
                      bgcolor: getColorForUser(item.userData?.name ?? "U"),
                      height: 32,
                      width: 32
                    }}
                  >
                    {(item.userData?.name ?? "U").charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.userData?.name}
                  </Typography>
                </Stack>

                {/* History Description */}
                {mode === "asset"
                  ? item.formatted_history
                      .split(" | ")
                      .filter((entry) => !entry.toLowerCase().includes("tag"))
                      .map((entry, index) => (
                        <Box key={index} sx={{ mb: 1.5 }}>
                          <Typography variant="body2" sx={{ ml: 2 }}>
                            {entry.trim().replace(/\.+$/, "")}
                          </Typography>
                        </Box>
                      ))
                  : !item.formatted_history.toLowerCase().includes("tag") && (
                      <Typography variant="body2" sx={{ ml: 2, mb: 1.5 }}>
                        Status changed to {item.formatted_history.trim().replace(/\.+$/, "")}
                      </Typography>
                    )}
                <Box sx={{ textAlign: "right", width: "100%", mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedDateTime
                      date={item.created_date}
                      format={DateFormats.FULL_DATE_TIME_12H}
                    />
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default IssueHistoryDrawer;
