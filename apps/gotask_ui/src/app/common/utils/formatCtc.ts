import { NUMBER_FORMAT } from "../constants/regex";

const formatCTC = (value: number): string => {
  const rounded = Math.round(value).toString();
  const lastThree = rounded.slice(-3);
  const rest = rounded.slice(0, -3);

  const formatted =
    rest.length > 0 ? rest.replace(NUMBER_FORMAT, ",") + "," + lastThree : lastThree;

  return `₹${formatted} LPA`;
};

export default formatCTC;
