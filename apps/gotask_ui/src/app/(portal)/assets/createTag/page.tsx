"use client";
import React from "react";
import { CreateTag } from "./createtag";

interface CreateTagProps {
  onClose: () => void;
  open: boolean;
}

const CreateAction: React.FC<CreateTagProps> = ({ onClose, open }) => {
  return (
    <>
      <CreateTag onClose={onClose} open={open} />
    </>
  );
};

export default CreateAction;
