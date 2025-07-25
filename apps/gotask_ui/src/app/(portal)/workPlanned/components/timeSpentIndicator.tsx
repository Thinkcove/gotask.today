import { formatEstimation, getTimeSpentColor } from "@/app/common/utils/leaveCalculate";
import { Box } from "@mui/material";

export const TimeSpentIndicator: React.FC<{
    spent: string | number | null | undefined;
    estimated: string | number | null | undefined;
}> = ({ spent, estimated }) => {
    const color = getTimeSpentColor(spent, estimated);
    const spentValue = spent !== null && spent !== undefined ? parseFloat(spent.toString()) : NaN;
    const estimatedValue = estimated !== null && estimated !== undefined ? parseFloat(estimated.toString()) : NaN;



    if (isNaN(spentValue) || isNaN(estimatedValue)) {
        return <span>{formatEstimation(spent)}</span>;
    }

    return (
        <Box display="flex" alignItems="center" gap={1} justifyContent="center">
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: color,
                    flexShrink: 0
                }}
            />
            <span>{formatEstimation(spent)}</span>
        </Box>
    );
};
