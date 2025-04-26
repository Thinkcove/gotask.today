"use client";
import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

interface CreateUserProps {
  open: boolean;
  onClose: () => void;
}

const CreateProject = ({ open, onClose }: CreateUserProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Project</DialogTitle>
      <DialogContent>
        {/* <ProjectInput formData={formData} handleChange={handleChange} /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProject;
