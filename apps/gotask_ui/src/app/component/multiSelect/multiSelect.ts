export const getMultiSelectStyles = (sxRoot = {}, sxInputBase = {}, sxInput = {}, sxChip = {}) => {
  return {
    width: "100%",
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
