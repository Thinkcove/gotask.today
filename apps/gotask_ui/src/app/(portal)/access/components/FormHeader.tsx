import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { ArrowBack, History } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { GoalFormHeaderProps } from "../../project/view/[projectId]/goals/interface/projectGoal";

const FormHeader: React.FC<GoalFormHeaderProps> = ({
  isEdit,
  onCancel,
  onSubmit,
  onShowHistory,
  isSubmitting = false,
  hasHistory = false,
  showModuleHeader = false
}) => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  return (
    <>
      {showModuleHeader && <ModuleHeader name={transGoal("goal")} />}

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
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <IconButton color="primary" onClick={onCancel}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {isEdit ? transGoal("editgoal") : transGoal("creategoal")}
          </Typography>
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
            {transGoal("cancel")}
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
            {isSubmitting
              ? isEdit
                ? transGoal("update")
                : transGoal("create")
              : isEdit
                ? transGoal("update")
                : transGoal("create")}
          </Button>
        </Box>
      </Box>

      {/* History Link */}
      {hasHistory && onShowHistory && (
        <Box
          onClick={onShowHistory}
          sx={{
            textDecoration: "underline",
            display: "flex",
            color: "#741B92",
            px: 3,
            cursor: "pointer",
            alignItems: "center"
          }}
        >
          <Typography>{transGoal("showhistory")}</Typography>
          <History />
        </Box>
      )}
    </>
  );
};
export default FormHeader;
