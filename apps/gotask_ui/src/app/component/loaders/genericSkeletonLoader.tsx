"use client";
import { Box, Grid, Skeleton } from "@mui/material";
interface FilterSkeletonLoaderProps {
  count?: number;
}

export const FilterSkeletonLoader: React.FC<FilterSkeletonLoaderProps> = ({ count }) => {
  return (
    <Box sx={{ px: 3, py: 1 }}>
      <Grid container spacing={2}>
        {[...Array(count)].map((_, index) => (
          <Grid item xs={2} sm={2} md={2} key={`filter-skeleton-${index}`}>
            <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
