"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import EditAsset from "./editAsset";
import env from "@/app/common/env";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";

const fetchAsset = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const EditAction: React.FC = () => {
  const { id } = useParams();
  const url = `${env.API_BASE_URL}/asset/${id}`;
  const { data, mutate } = useSWR(id ? url : null, fetchAsset, {
    revalidateOnFocus: false
  });

  const [open, setOpen] = useState(true);
  const selectedTask = data?.data || null;

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
