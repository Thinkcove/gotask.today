import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { IKpiPerformance } from "../../../service/templateInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface Props {
  performance: IKpiPerformance[];
  assignedById: string;
  reviewerId: string;
  targetValue: number;
}

const PerformanceChart: React.FC<Props> = ({
  performance,
  assignedById,
  reviewerId,
  targetValue
}) => {
  const responsibleId = reviewerId || assignedById;
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  const formattedData = performance
    .filter(
      (entry) =>
        entry.percentage && !isNaN(Number(entry.percentage)) && entry.added_by === responsibleId
    )
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .map((entry) => {
      const normalizedActual = targetValue > 0 ? Number(entry.percentage) / targetValue : 0;
      return {
        name: `${new Date(entry.start_date).toLocaleDateString()} - ${new Date(entry.end_date).toLocaleDateString()}`,
        actual_value: parseFloat(normalizedActual.toFixed(2))
      };
    });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual_value"
          stroke="#741B92"
          name={transkpi("reviewerscore")}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
