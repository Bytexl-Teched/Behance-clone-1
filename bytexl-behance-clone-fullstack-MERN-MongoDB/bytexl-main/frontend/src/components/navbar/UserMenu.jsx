import React, { useState } from "react";
import { Avatar, Box, Button, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom"; // for navigation
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function UserMenu() {
    const context = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    // Function to open the menu
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Function to close the menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Function to handle logout
    function handleLogout() {
        localStorage.removeItem("authToken");
        context?.setIsAuthenticated(false);
        navigate("/");
    }

    return (
        <Box>
            <Button
                id="user-menu-button"
                aria-controls={anchorEl ? "user-menu" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <Avatar
                    alt="User Profile Picture"
                    id="userProfilePicture"
                    src="/dp.png"
                />
            </Button>

            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    id="user-page-link"
                    component={Link}
                    to="/userpage"
                    onClick={handleClose}
                >
                    User Page
                </MenuItem>
                <MenuItem
                    id="logout-button"
                    onClick={handleLogout}
                    sx={{ color: "red" }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default UserMenu;
