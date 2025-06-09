import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import {
  IconButton,
  Box,
  Typography,
  Button
} from "../../../../../node_modules/@mui/material/index";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { uploadAttendance } from "../service/uploadaction";

const Upload: React.FC = () => {
  const transchatbot = useTranslations(LOCALIZATION.TRANSITION.CHATBOT);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
      setSnackbarMessage(transchatbot("invalidFile"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSelectedFile(null);
      return;
    }

    try {
      const result = await uploadAttendance(selectedFile);
      if (result.message === transchatbot("validation")) {
        setSnackbarMessage(result.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setSelectedFile(null);
        return;
      }
      setSnackbarMessage(transchatbot("uploadsuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      const message = transchatbot("Uploaderror");
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFile(null);
    }
  }, [selectedFile, transchatbot]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <Box
          sx={{
            bgcolor: "#EEEEEE",
            border: "2px solid #BDBDBD",
            borderRadius: "12px",
            padding: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            minHeight: "200px",
            minWidth: "300px"
          }}
        >
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{ bgcolor: "#EEEEEE", "&:hover": { bgcolor: "#D3D3D3" } }}
          >
            <CloudUploadOutlinedIcon fontSize="large" sx={{ color: "#741B92" }} />
          </IconButton>
          {!selectedFile && (
            <Typography sx={{ color: "#741B92", fontSize: "1rem" }}>
              {transchatbot("uploadfile")}
            </Typography>
          )}
          {selectedFile && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#F5F5F5",
                  border: "1px solid #BDBDBD",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  gap: 1,
                  maxWidth: "80%"
                }}
              >
                <InsertDriveFileIcon sx={{ color: "#741B92", fontSize: "1.2rem" }} />
                <Typography
                  sx={{
                    color: "#741B92",
                    fontSize: "1rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {selectedFile.name}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleFileUpload}
                sx={{
                  bgcolor: "#741B92",
                  color: "white",
                  "&:hover": { bgcolor: "#660066" },
                  mt: 1
                }}
              >
                Upload
              </Button>
            </>
          )}
        </Box>
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
      />
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  );
};

export default Upload;
