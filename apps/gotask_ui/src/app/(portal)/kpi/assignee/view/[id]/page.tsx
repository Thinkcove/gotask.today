"use client";
import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetchTemplatesByUserId } from "../../../service/templateAction";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import AssigneeDetail from "./assigneeDetails";
import { getUserById } from "@/app/(portal)/user/services/userAction";

const Page = () => {
  const params = useParams();
  const userId = params?.id as string;
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  const { data: assignedTemplates, mutate } = useSWR(
    userId ? `templates-user-${userId}` : null,
    () => fetchTemplatesByUserId(userId)
  );

  const { data: user } = useSWR(userId ? `user-${userId}` : null, () => getUserById(userId));

  if (!user || !assignedTemplates) return null;

  return (
    <>
      <ModuleHeader name={transkpi("assigneetitle")} />
      <AssigneeDetail user={user} assignedTemplates={assignedTemplates || []} mutate={mutate} />
    </>
  );
};

export default Page;
