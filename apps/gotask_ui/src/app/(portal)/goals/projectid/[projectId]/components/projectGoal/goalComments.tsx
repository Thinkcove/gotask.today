import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FormField from "@/app/component/input/formField";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import {
  GoalCommentProps
} from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";

const GoalComments: React.FC<GoalCommentProps> = ({ comments, onSave, onEdit, onDelete }) => {

  const [editValue, setEditValue] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);



  const handleDeleteConfirm = () => {
    if (commentToDeleteId && onDelete) {
      onDelete(commentToDeleteId);
    }
    setDeleteDialogOpen(false);
    setCommentToDeleteId(null);
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      onSave(newComment.trim());
      setNewComment("");
      setIsFocused(false);
    }
  };


  return (
    <Box sx={{ mt: 2 }}>
      {/* New Comment Input */}
      <Box sx={{ mt: 3 }}>
        <FormField
          label={transGoal("addcomment")}
          value={newComment}
          multiline
          height={100}
          onChange={(val) => setNewComment(val as string)}
          type="text"
          onFocus={() => setIsFocused(true)}
        />
        {isFocused && (
          <Box display="flex" gap={1} mt={1}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#741B92", textTransform: "none" }}
              onClick={handlePostComment}
            >
              {transGoal("savecomment")}
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "black",
                border: "2px solid #741B92",
                px: 2,
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }
              }}
              onClick={() => {
                setNewComment("");
                setIsFocused(false);
              }}
            >
              {transGoal("cancelcomment")}
            </Button>
          </Box>
        )}
      </Box>

      {/* Comment List */}
      <Box
        sx={{
          maxHeight: { xs: 300, sm: 400, md: 500 },
          overflowY: "auto",
          pr: { xs: 0, sm: 1 },
          width: "100%",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "3px"
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#741B92",
            borderRadius: "3px"
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#5a1472"
          }
        }}
      ></Box>

      {/* Delete Dialog */}
      <CommonDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSubmit={handleDeleteConfirm}
        title={transGoal("deletetitle")}
        submitLabel={transGoal("deletecomment")}
        cancelLabel={transGoal("cancelcomment")}
        submitColor="#b71c1c"
      >
        <Typography sx={{ pt: 2 }}>{transGoal("commmentmessage")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default GoalComments;
