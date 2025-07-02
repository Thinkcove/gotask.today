"use client";

import React, { RefObject, useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import FormField from "@/app/component/input/formField";
import {
  KPI_FREQUENCY,
  MEASUREMENT_CRITERIA_OPTIONS,
  STATUS_OPTIONS
} from "@/app/common/constants/kpi";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { Template } from "../service/templateInterface";
import ReusableEditor from "@/app/component/richText/textEditor";
import { RichTextEditorRef } from "mui-tiptap";
import useSWR from "swr";
import { fetchUsers } from "../../user/services/userAction";
import { mapUsersToMentions } from "@/app/common/utils/textEditor";

interface TemplateInputProps {
  formData: Partial<Template>;
  handleChange: <K extends keyof Partial<Template>>(field: K, value: Partial<Template>[K]) => void;
  errors: { [key: string]: string };
  handleInputChange?: (name: string, value: string) => void;
  readOnlyFields?: string[];
  onDescriptionSave?: () => void;
  rteRef?: RefObject<RichTextEditorRef | null>;
}

const TemplateInput: React.FC<TemplateInputProps> = ({
  formData,
  handleChange,
  errors,
  handleInputChange,
  onDescriptionSave,
  readOnlyFields = [],
  rteRef
}) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const isReadOnly = (field: string) => readOnlyFields.includes(field);
  const { data: fetchedUsers = [] } = useSWR("userList", fetchUsers);

  const userList = useMemo(() => {
    return mapUsersToMentions(fetchedUsers || []);
  }, [fetchedUsers]);

  const handleDescriptionSave = (html: string) => {
    handleInputChange?.("description", html);
    if (onDescriptionSave) {
      onDescriptionSave();
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <FormField
            label={`${transkpi("title")} ${transkpi("required")}`}
            type="text"
            required
            placeholder={transkpi("entername")}
            value={formData.title}
            onChange={(val) => handleChange("title", String(val))}
            error={errors.title}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("frequency")} ${transkpi("required")}`}
            placeholder={transkpi("enterfrequency")}
            type="select"
            options={Object.values(KPI_FREQUENCY)}
            value={formData.frequency}
            onChange={(val) => handleChange("frequency", String(val))}
            error={errors.frequency}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("weightage")} ${transkpi("required")}`}
            type="select"
            placeholder={transkpi("enterweightage")}
            options={MEASUREMENT_CRITERIA_OPTIONS.map((opt) => opt.label)}
            required
            value={formData.measurement_criteria}
            onChange={(val) => handleChange("measurement_criteria", Number(val))}
            error={errors.measurement_criteria}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={transkpi("status")}
            placeholder={transkpi("enterstatus")}
            type="select"
            options={STATUS_OPTIONS}
            value={formData.status}
            onChange={(val) => handleChange("status", String(val))}
            error={errors.status}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          {transkpi("labeldescription")}
        </Typography>
        <ReusableEditor
          content={formData.description || ""}
          onSave={handleDescriptionSave}
          placeholder={transkpi("placeholderdescription")}
          readOnly={isReadOnly("description")}
          showSaveButton={false}
          userList={userList}
          ref={rteRef}
        />
      </Box>
    </>
  );
};

export default TemplateInput;
