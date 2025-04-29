import { useParams, useRouter } from "next/navigation";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Button,
  Tooltip
} from "@mui/material";
import { Add, ArrowBack, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { Role } from "../../interfaces/roleInterface";
import CommonDialog from "@/app/component/dialog/commonDialog";
import FormField from "@/app/component/formField";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { fetchAllAccess, updateRole } from "../../services/roleAction";

interface RoleDetailProps {
  role: Role;
  mutate: KeyedMutator<Role>;
}

const RoleDetail: React.FC<RoleDetailProps> = ({ role, mutate }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const router = useRouter();
  const { roleId } = useParams();
  const roleID = roleId as string;
  const { getAllAccess } = fetchAllAccess();
  const handleBack = () => {
    setTimeout(() => router.back(), 200);
  };

  const onClose = () => {
    setOpen(false);
  };
  const [selectedAccessIds, setSelectedAccessIds] = useState<string[]>([]);
  const handleAddAccess = async () => {
    setOpen(false);
    try {
      const payload = {
        accessIds: selectedAccessIds
      };
      const response = await updateRole(roleID, payload as Role); // Using roleID from useParams
      await mutate(); // Refresh data
      setSnackbar({
        open: true,
        message: response.message,
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch (error) {
      console.error("Error updating access:", error);
      setSnackbar({
        open: true,
        message: "Error while adding access",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };
  return (
    <>
      <ModuleHeader name="Role Detail View" />
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        {/* Main Card */}
        <Box
          sx={{
            borderRadius: 4,
            p: 4,
            bgcolor: "#f9fafb",
            border: "1px solid #e0e0e0"
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Typography variant="h4" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                {role.name}
              </Typography>
              <Tooltip title="Add Access">
                <IconButton
                  onClick={() => setOpen(true)}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#741B92",
                    "&:hover": {
                      backgroundColor: "#741B92"
                    }
                  }}
                >
                  <Add sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Role Access Section */}
          <Typography variant="h6" fontWeight={200}>
            Access Details for this Role
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Below are the areas and actions that this role has access to.
          </Typography>

          <Divider sx={{ mb: 3 }} />
          <Box>
            {role.accessDetails && role.accessDetails.length > 0 ? (
              role.accessDetails.map((access) => (
                <Accordion key={access.id} defaultExpanded sx={{ mb: 2, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" fontWeight={400} sx={{ textTransform: "capitalize" }}>
                      {access.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List disablePadding>
                      {access.application.map((app) => (
                        <ListItem
                          key={app._id}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            mb: 2,
                            bgcolor: "#f4f6f8",
                            borderRadius: 2,
                            p: 2
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={500}
                            sx={{ textTransform: "capitalize" }}
                          >
                            {app.access}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                            {app.actions.map((action) => (
                              <Chip key={action} label={action} color="secondary" size="small" />
                            ))}
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography>No Access Details Available</Typography>
            )}
          </Box>
        </Box>

        <CommonDialog
          open={open}
          onClose={onClose}
          onSubmit={handleAddAccess}
          title="Add Access"
          submitLabel=" Add Access"
        >
          <FormField
            label="Access"
            type="multiselect"
            placeholder="Select Access"
            options={getAllAccess}
            value={selectedAccessIds} // This is an array of user IDs: ["123", "456"]
            onChange={(ids) => setSelectedAccessIds(ids as string[])}
          />
        </CommonDialog>
        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </>
  );
};

export default RoleDetail;
