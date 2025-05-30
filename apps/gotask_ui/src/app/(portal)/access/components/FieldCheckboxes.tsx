"use client";
import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Card,
  CardContent,
  Paper,
  Box,
  Grid
} from "@mui/material";
import { useTranslations } from "next-intl";

interface Props {
  module: string;
  action: string;
  fields: string[];
  selected: any;
  onChange: (module: string, action: string, field: string, checked: boolean) => void;
  readOnly?: boolean;
}

const FieldCheckboxes: React.FC<Props> = ({
  module,
  action,
  fields,
  selected,
  onChange,
  readOnly = false
}) => {
  const t = useTranslations("Access");
  console.log('action', action);
  console.log('selected', selected)
    const selectedFields = selected?.[action?.toLowerCase()] || [];
    const allChecked = fields.length > 0 && fields.every((field) => selectedFields.includes(field));
    const someChecked = selectedFields?.length > 0 && fields?.length > selectedFields?.length;

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    fields.forEach((field) => {
      if (isChecked && !selectedFields.includes(field)) {
        onChange(module,action?.toLowerCase(), field, true);
      }
      if (!isChecked && selectedFields.includes(field)) {
        onChange(module,action?.toLowerCase(), field, false);
      }
    });
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 300,
        height: 260,
        mt: 2,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <CardContent sx={{ padding: 2, flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          {t("fieldAccess")}: {action}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#e8f5e9",
            borderRadius: 1,
            px: 1,
            py: 0.5,
            mb: 1
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={allChecked}
                indeterminate={someChecked}
                onChange={handleSelectAllChange}
                disabled={readOnly}
                inputProps={{ "aria-label": t("selectallFields") }}
                sx={{ p: 0.5 }}
              />
            }
            label={<Typography variant="body2">{t("selectallFields")}</Typography>}
          />
        </Paper>

        <Box
          sx={{
            height: 160,
            overflowY: "auto",
            pr: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            "&::-webkit-scrollbar": {
              width: "6px"
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "4px"
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px"
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555"
            }
          }}
        >
                  {!fields?.length ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                      {t("noFieldsAvailable")}
                    </Typography>
                  ) : (
                    fields.map((field: any, index: number) => (
                      <Grid xs={12}>
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={selectedFields?.includes(field)}
                              onChange={(e) => 
                                onChange(module,action?.toLowerCase(), field, e.target.checked)
                              }
                              disabled={readOnly}
                              inputProps={{ "aria-label": `${t("field")}: ${field}` }}
                              sx={{ p: 0.5 }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                              {field}
                            </Typography>
                          }
                          sx={{ ml: 2 }}
                        />
                      </Grid>
                    ))
                  )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FieldCheckboxes;
