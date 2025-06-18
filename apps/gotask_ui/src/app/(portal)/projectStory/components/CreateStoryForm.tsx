"use client";

import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { createProjectStory } from "@/app/(portal)/projectStory/services/projectStoryService";

const CreateStoryForm = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProjectStory({
        title,
        description,
        projectId: projectId as string,
        createdBy: "user-id" // Replace with dynamic user ID later
      });

      router.push(`/project/${projectId}/stories`);
    } catch (error) {
      console.error("Failed to create story:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 2,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 2
      }}
    >
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={!title.trim()}
      >
        Create
      </Button>
    </Box>
  );
};

export default CreateStoryForm;
