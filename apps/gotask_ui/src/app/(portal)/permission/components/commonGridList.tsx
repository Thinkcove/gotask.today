import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { CommonGridListProps } from "../interface/interface";

const CommonGridList = <T,>({
  items,
  renderItem,
  onScroll,
  noDataMessage,
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
            <Typography variant="h6">{noDataMessage}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommonGridList;
