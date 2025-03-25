export interface ISeverityProps {
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  info?: boolean;
}

export interface ISeverityStyles {
  bgColor: string;
  icon: React.ElementType;
}
