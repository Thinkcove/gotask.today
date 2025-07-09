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
  editheading?: string;
  create?: string;
  cancel?: string;
  update?: string;
  createHeading?: string;
  showhistory?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  isEdit,
  onCancel,
  onSubmit,
  isSubmitting = false,
  cancel,
  create,
  editheading,
  update,
  createHeading,
  hasHistory,
  onShowHistory,
  showhistory
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
        {/* Left Section: Arrow + Title */}
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
              alignItems: "center",
              gap: 1
            }}
          >
            {isEdit && (
              <IconButton color="primary" onClick={onCancel}>
                <ArrowBack />
              </IconButton>
            )}
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
              {isEdit ? editheading : createHeading}
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
                  {showhistory}
                </Typography>
                <History />
              </Box>
            )}
          </Box>
        </Box>
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
            {cancel}
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
      </Box>
    </>
  );
};

export default FormHeader;
