import { Grid, Typography } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { LEAVE_TYPE } from "@/app/common/constants/leave";
import { LeaveFormField } from "../interface/leaveInterface";
import ReusableEditor from "@/app/component/richText/textEditor";

interface LeaveInputsProps {
  formData: LeaveFormField;
  errors: { [key: string]: string };
  onInputChange: (name: string, value: string) => void;
  showReasons?: boolean;
}

const LeaveInputs: React.FC<LeaveInputsProps> = ({
  formData,
  errors,
  onInputChange,
  showReasons = true
}) => {
  const transleave = useTranslations(LOCALIZATION.TRANSITION.LEAVE);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FormField
          label={transleave("reqfromdate")}
          type="date"
          placeholder={transleave("dateformat")}
          value={formData.from_date}
          onChange={(value) => {
            const dateValue =
              value instanceof Date ? value.toISOString().split("T")[0] : String(value);
            onInputChange("from_date", dateValue);
          }}
          error={errors.from_date}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={transleave("reqtodate")}
          type="date"
          placeholder={transleave("dateformat")}
          value={formData.to_date}
          onChange={(value) => {
            const dateValue =
              value instanceof Date ? value.toISOString().split("T")[0] : String(value);
            onInputChange("to_date", dateValue);
          }}
          error={errors.to_date}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transleave("reqleavetype")}
          type="select"
          options={Object.values(LEAVE_TYPE).map((s) => s.toUpperCase())}
          required
          placeholder={transleave("selecttype")}
          value={formData.leave_type.toUpperCase()}
          onChange={(value) =>
            onInputChange(
              "leave_type",
              String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()
            )
          }
          error={errors.leave_type}
        />
      </Grid>
      {showReasons && (
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
            {transleave("reason")}
          </Typography>
          <ReusableEditor
            content={formData.reasons || ""}
            onChange={(html) => onInputChange("reasons", html)}
            placeholder={transleave("enterreason")}
            showSaveButton={false}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default LeaveInputs;
