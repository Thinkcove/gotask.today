"use client";

import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { KpiAssignment, IKpiPerformance } from "../../../service/templateInterface";
import KpiFormFields from "../../addTemplate/[id]/assignmentInput";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { updateKpiAssignment } from "../../../service/templateAction";
import { useUser } from "@/app/userContext";
import useSWR from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";

interface UpdateProps {
  assignment: KpiAssignment;
  mutate: () => void;
  transkpi: (key: string) => string;
}

const UpdateScorePage: React.FC<UpdateProps> = ({ assignment, mutate, transkpi }) => {
  const { user: loginUser } = useUser();
  const router = useRouter();
  const { data: users = [] } = useSWR("fetch-users", fetcherUserList);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const defaultPerformance: IKpiPerformance = {
    start_date: "",
    end_date: "",
    percentage: "",
    notes: [],
    performance_id: "",
    added_by: loginUser?.id || "",
    updated_at: ""
  };

  const [form, setForm] = useState<Partial<KpiAssignment>>({
    ...assignment,
    performance: [defaultPerformance],
    comments: Array.isArray(assignment.comments)
      ? assignment.comments
      : assignment.comments
        ? [assignment.comments]
        : []
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleChange = (key: keyof KpiAssignment, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.performance?.[0]?.start_date) newErrors.start_date = transkpi("startdateerror");
    if (!form.performance?.[0]?.end_date) newErrors.end_date = transkpi("enddateerror");
    if (!form.performance?.[0]?.percentage) newErrors.percentage = transkpi("scoreerror");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      await updateKpiAssignment(assignment.assignment_id, {
        ...form,
        comments: typeof form.comments === "string" ? [form.comments] : form.comments,
        authUserId: loginUser?.id
      });

      mutate();
      setSnackbarMessage(transkpi("updatesuccessassignment"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => router.back(), 1000);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(transkpi("updateFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Typography variant="h6" fontWeight="bold" mb={2} color="#741B92" px={3} pt={3}>
        {transkpi("addperformance")}
      </Typography>

      <Box flex={1} overflow="auto" maxHeight="calc(100vh - 200px)" px={3}>
        <KpiFormFields
          form={form}
          errors={errors}
          users={users}
          handleChange={handleChange}
          showOnlyPerformanceFields
          isPerformancePage
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={2} px={3} pb={3}>
        <Button variant="outlined" onClick={() => router.back()}>
          {transkpi("cancel")}
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#741B92" }} onClick={handleUpdate}>
          {transkpi("update")}
        </Button>
      </Box>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default UpdateScorePage;
