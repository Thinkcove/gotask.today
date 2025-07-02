"use client";
import React, { RefObject, useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { IProjectField, PROJECT_WORKFLOW } from "../interfaces/projectInterface";
import { useAllOrganizations } from "../../organization/services/organizationAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import ReusableEditor from "@/app/component/richText/textEditor";
import { RichTextEditorRef } from "mui-tiptap";
import useSWR from "swr";
import { fetchUsers } from "../../user/services/userAction";
import { mapUsersToMentions } from "@/app/common/utils/textEditor";

interface IProjectInputProps {
  formData: IProjectField;
  errors?: { [key: string]: string };
  readOnlyFields?: string[];
  handleChange: (field: keyof IProjectField, value: string) => void;
  rteRef?: RefObject<RichTextEditorRef | null>;
}

const ProjectInput = ({
  formData,
  errors,
  readOnlyFields = [],
  handleChange,
  rteRef
}: IProjectInputProps) => {
  console.log("description", formData.description);
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const currentStatus = formData.status;
  const allowedStatuses = PROJECT_WORKFLOW[currentStatus] || [];
  const uniqueStatuses = Array.from(new Set([currentStatus, ...allowedStatuses]));
  const { getOrganizations } = useAllOrganizations();
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  const { data: fetchedUsers = [] } = useSWR("userList", fetchUsers);
  const userList = useMemo(() => {
    return mapUsersToMentions(fetchedUsers || []);
  }, [fetchedUsers]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label={transproject("labelname")}
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
          error={errors?.name}
          disabled={isReadOnly("name")}
          placeholder={transproject("placeholdername")}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          {transproject("labeldescription")}
        </Typography>
        <ReusableEditor
          ref={rteRef}
          content={formData.description || ""}
          placeholder={transproject("placeholderdescription")}
          readOnly={isReadOnly("description")}
          showSaveButton={false}
          userList={userList}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={transproject("labelstatus")}
          type="select"
          options={uniqueStatuses.map((s) => s.toUpperCase())}
          required
          error={errors?.status}
          placeholder={transproject("placeholderstatus")}
          value={currentStatus.toUpperCase()}
          disabled={isReadOnly("status")}
          onChange={(value) => handleChange("status", String(value).toLowerCase())}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={transproject("labelorganization")}
          type="select"
          value={formData.organization_id}
          onChange={(value) => handleChange("organization_id", String(value))}
          options={getOrganizations}
          required
          disabled={isReadOnly("organization_id")}
          placeholder={transproject("placeholderorganization")}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectInput;
