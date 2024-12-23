import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Category from "./Category";
import { Box, Typography } from "@mui/material";
import BookRating from "./BookRating";
import { useBooks } from "../../contexts/BookContext";

export default function Filter() {
    // Note: We are using Context API to get globally available states, constants and functions
    // We are not using prop drilling approach in this app
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
        <Box id="filterContainer">
            <Button
                id="filterButton"
                aria-controls={open ? "basic-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                style={{
                    color: "black",
                    paddingInline: 24,
                    borderRadius: 16,
                    border: "1px solid black",
                    margin: "0px auto 4px 0px",
                }}
            >
                Filter
            </Button>
            <Menu
                id="filterMenu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "filterButton",
                }}
            >
                <MenuItem id="categoryMenuItem">
                    <Category />
                </MenuItem>
                <MenuItem id="bookRatingMenuItem">
                    <BookRating />
                </MenuItem>
                <Button
                    id="clearFilterButton"
                    onClick={() => {
                        context?.setFilterBy({
                            category: "",
                            rating: "",
                        });
                        context?.setRating(context?.ratingCategories[0]);
                        context?.setCategory("");
                        if (context?.searchQuery) {
                            context?.handleSearch(context?.searchQuery, "", 0);
                        } else {
                            context?.handleReset();
                        }
                        handleClose();
                    }}
                    style={{ display: "block", marginInline: "auto" }}
                >
                    Clear Filter
                </Button>
                <Button
                    id="closeButton"
                    onClick={handleClose}
                    style={{ display: "block", marginInline: "auto" }}
                >
                    Close
                </Button>
            </Menu>

            {context?.filterBy.category && (
                <Typography id="filteredByCategoryTypography">
                    Filtered by {context?.filterBy.category}
                </Typography>
            )}

            {context?.filterBy.rating && (
                <Typography id="filteredByRatingTypography">
                    Filtered by {context?.filterBy.rating}
                </Typography>
            )}
        </Box>
    );
}
