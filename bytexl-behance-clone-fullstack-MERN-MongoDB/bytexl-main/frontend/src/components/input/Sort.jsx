import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box, Typography } from "@mui/material";
import { useBooks } from "../../contexts/BookContext";

export default function Sort() {
    const context = useBooks();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box id="sortContainer">
            <Button
                id="sortButton"
                aria-controls={open ? "sortMenu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                style={{
                    color: "black",
                    paddingInline: 24,
                    borderRadius: 16,
                    border: "1px solid black",
                    display: "block",
                    margin: "0px 0px 4px auto",
                }}
            >
                Sort
            </Button>
            <Menu
                id="sortMenu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "sortButton",
                }}
            >
                <Box
                    id="sortOptionsContainer"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}
                >
                    <MenuItem
                        id="sortByPriceAscending"
                        onClick={() => {
                            context?.handleSortByPriceAscending();
                            handleClose();
                            context?.setSortedBy("Price (Low to High)");
                        }}
                        style={{ fontWeight: "bold" }}
                    >
                        <Typography 
                            id="priceLowToHigh"
                        >
                            Price (Low to High)
                        </Typography>
                    </MenuItem>
                    <MenuItem
                        id="sortByPriceDescending"
                        onClick={() => {
                            context?.handleSortByPriceDescending();
                            handleClose();
                            context?.setSortedBy("Price (High to Low)");
                        }}
                        style={{ fontWeight: "bold" }}
                    >
                        <Typography 
                            id="priceHighToLow"
                        >
                            Price (High to Low)
                        </Typography>
                    </MenuItem>
                    <MenuItem
                        id="sortByRatingAscending"
                        onClick={() => {
                            context?.handleSortByRatingAscending();
                            handleClose();
                            context?.setSortedBy("Rating (Low to High)");
                        }}
                        style={{ fontWeight: "bold" }}
                    >
                        <Typography 
                            id="ratingLowToHigh"
                        >
                            Rating (Low to High)
                        </Typography>
                    </MenuItem>
                    <MenuItem
                        id="sortByRatingDescending"
                        onClick={() => {
                            context?.handleSortByRatingDescending();
                            handleClose();
                            context?.setSortedBy("Rating (High to Low)");
                        }}
                        style={{ fontWeight: "bold" }}
                    >
                        <Typography 
                            id="ratingHighToLow"
                        >
                            Rating (High to Low)
                        </Typography>
                    </MenuItem>
                </Box>
            </Menu>

            {context?.sortedBy && (
                <Typography 
                    id="sortedByText"
                >
                    Sorted by {context?.sortedBy}
                </Typography>
            )}
        </Box>
    );
}
