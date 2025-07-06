// app/component/common/CommonGridList.tsx
import React from "react";
import { Box, Grid, Typography } from "@mui/material";

interface CommonGridListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onScroll?: () => void;
  noDataMessage?: React.ReactNode; // Changed from string to React.ReactNode
  maxHeight?: string;
}

const CommonGridList = <T,>({
  items,
  renderItem,
  onScroll,
  noDataMessage = "No data found",
  maxHeight = "calc(100vh - 250px)"
}: CommonGridListProps<T>) => {
  return (
    <Box sx={{ width: "100%", pt: 4 }}>
      <Box sx={{ overflowY: "auto", maxHeight, px: 2 }} onScroll={onScroll}>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={4} xl={3}>
              {renderItem(item)}
            </Grid>
          ))}
        </Grid>

        {items.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            {/* Check if noDataMessage is a string or React element */}
            {typeof noDataMessage === "string" ? (
              <Typography variant="h6">{noDataMessage}</Typography>
            ) : (
              noDataMessage
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommonGridList;
