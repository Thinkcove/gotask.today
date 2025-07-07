const formatCTC = (value: number): string => {
  return `₹${value.toLocaleString("en-IN")} L`;
};

export default formatCTC;
