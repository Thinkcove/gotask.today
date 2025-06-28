import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  List,
  ListItem,
  Divider,
  Paper
} from "@mui/material";
import { ITaskHistory } from "../interface/taskInterface";
import { InfoOutlined } from "@mui/icons-material";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { getColorForUser } from "@/app/common/constants/avatar";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  history: ITaskHistory[];
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ open, onClose, history }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
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
        {/* Fixed Header */}
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
            {transtask("taskhistory")}
          </Typography>

          {/* Log Info Box */}
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
                alignItems: "center", // Centers items vertically
                backgroundColor: "#E1D7E0",
                borderRadius: 1.5,
                gap: 1
              }}
            >
              <InfoOutlined
                sx={{
                  height: 14,
                  width: 14,
                  display: "flex",
                  alignItems: "center"
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {transtask("log")}
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Scrollable History */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {history.map((item, index) => (
            <Card
              key={index}
              sx={{
                mb: 2,
                boxShadow: 2,
                borderRadius: 2,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { boxShadow: 3 }
              }}
            >
              <CardContent sx={{ pb: "10px" }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <Avatar
                    sx={{
                      bgcolor: getColorForUser(item.loginuser_name || ""),
                      height: 32,
                      width: 32
                    }}
                  >
                    {item.loginuser_name?.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.loginuser_name}
                  </Typography>
                </Stack>

                {/* Display formatted history as bullet points */}
                <List sx={{ pl: 2 }}>
                  {item.formatted_history
                    .split(". ")
                    .filter((entry) => entry.trim() !== "")
                    .map((sentence, i) => (
                      <ListItem key={i} sx={{ display: "list-item", pl: 1 }}>
                        <Typography variant="body2">{sentence.trim()}.</Typography>
                      </ListItem>
                    ))}
                </List>

                <Divider sx={{ my: 1 }} />

                {/* Align date to the right */}
                <Box sx={{ textAlign: "right", width: "100%" }}>
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

export default HistoryDrawer;
