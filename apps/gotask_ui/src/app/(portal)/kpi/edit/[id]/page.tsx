"use client";
import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetchTemplateById } from "../../service/templateAction";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import EditTemplate from "./editTemplate";

const Page = () => {
  const { id } = useParams();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const { data, mutate } = useSWR(
    id ? `template-${id}` : null,
    () => fetchTemplateById(id as string),
    {
      revalidateOnFocus: false
    }
  );
  return data && !("error" in data) ? (
    <>
      <ModuleHeader name={transkpi("edittemplate")} />
      <EditTemplate template={data} mutate={mutate} />
    </>
  ) : null;
};

export default Page;
