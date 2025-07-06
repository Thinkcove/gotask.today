import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { KPI_FREQUENCY, STATUS_OPTIONS } from "@/app/common/constants/kpi";
import { KpiAssignment } from "../../../service/templateInterface";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { User } from "@/app/userContext";

interface KpiFormFieldsProps {
  form: Partial<KpiAssignment>;
  errors: { [key: string]: string };
  users?: User[];
  handleChange: (
    key: keyof Omit<
      KpiAssignment,
      "assignment_id" | "user_id" | "template_id" | "change_History" | "description"
    >,
    value: any
  ) => void;
  disabledFields?: (keyof KpiAssignment)[];
  showReviewerField?: boolean;
  showCommentsField?: boolean;
  userId?: string;
}

const KpiFormFields: React.FC<KpiFormFieldsProps> = ({
  form,
  errors,
  users = [],
  handleChange,
  disabledFields = [],
  showReviewerField = false,
  showCommentsField = true,
  userId
}) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  const assignedByName =
    users.find((u: User) => u.id === form.assigned_by)?.name || form.assigned_by || "";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4}>
        <FormField
          label={`${transkpi("title")} ${transkpi("required")}`}
          placeholder={transkpi("entertitle")}
          type="text"
          value={form.kpi_Title || ""}
          onChange={(val) => handleChange("kpi_Title", String(val))}
          error={errors.kpi_Title}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={transkpi("description")}
          placeholder={transkpi("enterdescription")}
          type="text"
          value={form.kpi_Description || ""}
          onChange={(val) => handleChange("kpi_Description", String(val))}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={`${transkpi("frequency")} ${transkpi("required")}`}
          placeholder={transkpi("enterfrequency")}
          type="select"
          options={Object.values(KPI_FREQUENCY)}
          value={form.frequency || ""}
          onChange={(val) => handleChange("frequency", String(val))}
          error={errors.frequency}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={`${transkpi("weightage")} ${transkpi("required")}`}
          placeholder={transkpi("enterweightage")}
          type="text"
          value={form.weightage || ""}
          onChange={(val) => handleChange("weightage", String(val))}
          error={errors.weightage}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={`${transkpi("targetvalue")} ${transkpi("required")}`}
          placeholder={transkpi("entertargetvalue")}
          type="text"
          value={form.target_value || ""}
          onChange={(val) => handleChange("target_value", String(val))}
          error={errors.target_value}
        />
      </Grid>
      {users.length > 0 && (
        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("assignedby")} ${transkpi("required")}`}
            type="select"
            options={users.map((u: User) => ({ id: u.name, name: u.name }))}
            value={assignedByName}
            onChange={(val) =>
              handleChange(
                "assigned_by",
                users.find((u: User) => u.name === val)?.id || String(val)
              )
            }
            error={errors.assigned_by}
            disabled
          />
        </Grid>
      )}
      {showReviewerField && userId === form.assigned_by && (
        <Grid item xs={12} md={4}>
          <FormField
            label={transkpi("reviewerid")}
            type="select"
            options={users.map((u: User) => ({ id: u.name, name: u.name }))}
            value={form.reviewer_id || ""}
            onChange={(val) => handleChange("reviewer_id", String(val))}
            disabled={disabledFields.includes("reviewer_id")}
          />
        </Grid>
      )}
      <Grid item xs={12} md={4}>
        <FormField
          label={`${transkpi("status")} ${transkpi("required")}`}
          placeholder={transkpi("enterstatus")}
          type="select"
          options={Object.values(STATUS_OPTIONS)}
          value={form.status || ""}
          onChange={(val) => handleChange("status", String(val))}
          error={errors.status}
        />
      </Grid>
      {showCommentsField && (
        <Grid item xs={12}>
          <FormField
            label={transkpi("comments")}
            placeholder={transkpi("entercomments")}
            type="text"
            value={Array.isArray(form.comments) ? form.comments[0] || "" : form.comments || ""}
            onChange={(val) => handleChange("comments", String(val))}
            multiline
          />
        </Grid>
      )}
    </Grid>
  );
};

export default KpiFormFields;
