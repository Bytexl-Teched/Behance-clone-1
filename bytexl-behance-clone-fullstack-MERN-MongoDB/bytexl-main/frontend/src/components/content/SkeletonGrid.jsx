import React from "react";
import { Box, Grid2 as Grid, Skeleton } from "@mui/material";

function SkeletonGrid() {
    return (
        <Box 
            id="skeletonContainer" 
            sx={{ padding: 2 }}
        >
            <Grid 
                container 
                id="gridContainer"
                spacing={2}
            >
                {[...Array(8)].map((_, index) => (
                    <Grid 
                        id="individualGridItem"
                        key={index} 
                        size={3}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Skeleton
                                animation="wave"
                                id={`skeletonImage${index}`}
                                sx={{
                                    borderRadius: "8px",
                                    height: 140,
                                    width: "100%",
                                }}
                                variant="rectangular"
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBlock: "4px",
                                    width: "100%",
                                }}
                            >
                                <Skeleton
                                    animation="wave"
                                    id={`skeletonTitle${index}`}
                                    sx={{ width: "45%" }}
                                    variant="text"
                                />
                                <Skeleton
                                    animation="wave"
                                    id={`skeletonSubtitle${index}`}
                                    sx={{ width: "45%" }}
                                    variant="text"
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBlock: "4px",
                                    width: "100%",
                                }}
                            >
                                <Skeleton
                                    animation="wave"
                                    id={`skeletonTitle${index}`}
                                    sx={{ width: "45%" }}
                                    variant="text"
                                />
                                <Skeleton
                                    animation="wave"
                                    id={`skeletonSubtitle${index}`}
                                    sx={{ width: "45%" }}
                                    variant="text"
                                />
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default SkeletonGrid;
