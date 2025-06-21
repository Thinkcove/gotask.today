export const getMultiSelectStyles = (
  sxRoot = {},
  sxInputBase = {},
  sxInput = {},
  sxChip = {},
  customWidth?: string | number | object
) => {
  return {
    width: customWidth ?? {
      xs: "100%",
      sm: "100%",
      md: "60%",
      lg: "400px"
    },
    minWidth: {
      xs: "100%",
      sm: "300px",
      md: "360px"
    },
    "& .MuiInputBase-root": {
      padding: "10px 12px",
      minHeight: "40px",
      borderRadius: "8px",
      fontSize: {
        xs: "0.9rem",
        sm: "1rem"
      },
      ...sxInputBase
    },
    "& .MuiInputBase-input": {
      padding: "0 !important",
      minHeight: "0",
      fontSize: {
        xs: "0.9rem",
        sm: "1rem"
      },
      ...sxInput
    },
    "& .MuiChip-root": {
      height: {
        xs: "24px",
        sm: "26px"
      },
      fontSize: {
        xs: "0.7rem",
        sm: "0.8rem"
      },
      ...sxChip
    },
    ...sxRoot
  };
};
