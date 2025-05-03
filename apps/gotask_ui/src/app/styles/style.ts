// styles/scrollStyles.js or similar
export const scrollStyles = {
  maxHeight: "70vh",
  overflowY: "auto",
  pr: 1,
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": {
    width: "8px"
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#ccc",
    borderRadius: "4px"
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#999"
  }
};
