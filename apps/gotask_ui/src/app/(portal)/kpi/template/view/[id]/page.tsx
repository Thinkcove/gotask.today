"use client";
import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import TemplateDetail from "./templateDetails";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { fetchTemplateById } from "../../../service/templateAction";
import { Template } from "../../../service/templateInterface";

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
      <ModuleHeader name={transkpi("templatetitle")} />
      <TemplateDetail template={data as Template} mutate={mutate} />
    </>
  ) : null;
};

export default Page;
