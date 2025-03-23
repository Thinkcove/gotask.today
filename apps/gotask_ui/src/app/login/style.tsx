import { styled } from "@mui/system";
import { TextField, Button, Box, Paper } from "@mui/material";

export const BackgroundContainer = styled(Box)({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #f3e7ff, #e3d1f8)",
});

export const LoginCard = styled(Paper)({
  padding: "50px",
  borderRadius: "20px",
  background: "#ffffff",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  maxWidth: "420px",
  width: "100%",
  color: "#333",
  border: "2px solid #741B92",
});

export const StyledButton = styled(Button)({
  marginTop: "20px",
  padding: "12px",
  fontSize: "1rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  background: "#741B92",
  color: "#fff",
  borderRadius: "8px",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 0px 15px #741B92",
  },
});

export const StyledTextField = styled(TextField)({
  input: { color: "#333" },
  label: { color: "#555" },
  fieldset: { borderColor: "rgba(0, 0, 0, 0.3)" },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#741B92",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#741B92",
    },
  },
});
