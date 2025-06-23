"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import EditAsset from "./editAsset";
import { useAssetById } from "../services/assetActions";

const EditAction: React.FC = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(true);
  const { asset: selectedTask, mutate } = useAssetById(id as string);

  return (
    <>
      {selectedTask && (
        <EditAsset
          data={selectedTask}
          open={open}
          onClose={() => setOpen(false)}
          assetID={id as string}
          mutate={mutate}
        />
      )}
    </>
  );
};

export default EditAction;
