import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ISeverityProps, ISeverityStyles } from "./snackBarInterface";

const getErrorStyles = (): ISeverityStyles => ({
  bgColor: "#F24646",
  icon: ErrorOutlineOutlinedIcon
});

const getWarningStyles = (): ISeverityStyles => ({
  bgColor: "#FFA629",
  icon: WarningAmberOutlinedIcon
});

const getSuccessStyles = (): ISeverityStyles => ({
  bgColor: "#05BE4F",
  icon: CheckCircleOutlinedIcon
});

const getInfoStyles = (): ISeverityStyles => ({
  bgColor: "#009DFF",
  icon: InfoOutlinedIcon
});

const getDefaultStyles = (): ISeverityStyles => ({
  bgColor: "",
  icon: () => null
});

export const getSeverityStyles = ({
  error,
  warning,
  success,
  info
}: ISeverityProps): ISeverityStyles => {
  if (error) return getErrorStyles();
  if (warning) return getWarningStyles();
  if (success) return getSuccessStyles();
  if (info) return getInfoStyles();
  return getDefaultStyles();
};
