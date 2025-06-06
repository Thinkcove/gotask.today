// components/FormattedDateTime.tsx
import React from "react";
import moment from "moment-timezone";
import DateFormats from "./dateFormat";

interface FormattedDateTimeProps {
  date: string | Date;
  format?: string;
}

const FormattedDateTime: React.FC<FormattedDateTimeProps> = ({
  date,
  format = DateFormats.FULL_DATE_TIME_12H
}) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("usertime zone", userTimeZone);
  const formattedDate = moment(date).tz(userTimeZone).format(format);

  return <span>{formattedDate}</span>;
};

export default FormattedDateTime;
