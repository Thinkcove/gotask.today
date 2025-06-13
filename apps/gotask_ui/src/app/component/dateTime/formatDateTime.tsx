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
  format = DateFormats.DATE_ONLY
}) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedDate = moment(date).tz(userTimeZone).format(format);

  return <span>{formattedDate}</span>;
};

export default FormattedDateTime;
