import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { ArrowBack, History } from "@mui/icons-material";

export interface FormHeaderProps {
  isEdit: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onShowHistory?: () => void;
  isSubmitting?: boolean;
  hasHistory?: boolean;
  edit: string;
  create: string;
  cancle: string;
  update: string;
  showhistory: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  isEdit,
  onCancel,
  onSubmit,
  onShowHistory,
  isSubmitting = false,
  hasHistory = false,
  cancle,
  create,
  update,
  edit
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
          gap: 2,
          p: 2
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <IconButton color="primary" onClick={onCancel}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
                {isEdit ? edit : create}
              </Typography>
            </Box>
            <Box>
              {hasHistory && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    cursor: "pointer",
                    color: "#741B92",
                    "&:hover": {
                      opacity: 0.8
                    }
                  }}
                  onClick={onShowHistory}
                >
                  <Typography
                    sx={{
                      textDecoration: "underline",
                      cursor: "inherit"
                    }}
                  >
                    Show History
                  </Typography>
                  <History />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {/* Right Section: Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2
          }}
        >
          <Button
            variant="outlined"
            sx={{
              borderRadius: "30px",
              color: "black",
              border: "2px solid #741B92",
              px: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)"
              }
            }}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancle}
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: "30px",
              backgroundColor: "#741B92",
              color: "white",
              px: 2,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgb(202, 187, 201)"
              }
            }}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (isEdit ? update : create) : isEdit ? update : create}
          </Button>
        </Box>
        {/* History Section - Only show if there's history */}
      </Box>
    </>
  );
};

export default FormHeader;
