import styles from "./Navbar.module.css";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UserMenu from "./UserMenu";

export default function Navbar() {
    const context = useAuth();

    const activeStyle = {
        color: "red",
        textDecoration: "none",
    };

    const defaultStyle = {
        color: "black",
        textDecoration: "none",
    };

    return (
        <Box className={styles.navbar} id="navbarContainer">
            <Stack
                id="leftNavbarContainer"
                style={{
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 16,
                    justifyContent: "flex-start",
                }}
            >
                <Typography id="appTitle" variant="h5">
                    Behance
                </Typography>
                <NavLink
                    to="/"
                    style={({ isActive }) =>
                        isActive ? activeStyle : defaultStyle
                    }
                >
                    <Typography id="exploreLink" variant="body1">
                        Explore
                    </Typography>
                </NavLink>
                <Typography id="assetsLink" variant="body1">
                    Assets
                </Typography>
                <Typography id="jobsLink" variant="body1">
                    Jobs
                </Typography>
                <Typography id="behancePro" variant="body1">
                    Behance
                    <span className={styles.pro}>pro</span>
                </Typography>
                <Typography id="hireFreelancersLink" variant="body1">
                    Hire Freelancers
                </Typography>
                <NavLink
                    to="/admin"
                    style={({ isActive }) =>
                        isActive ? activeStyle : defaultStyle
                    }
                >
                    {context?.isAuthenticated && (
                        <Typography id="adminLink" variant="body1">
                            Admin
                        </Typography>
                    )}
                </NavLink>
            </Stack>

            <Stack
                id="rightNavbarContainer"
                style={{
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 16,
                    justifyContent: "flex-start",
                }}
            >
                <NotificationsIcon id="notificationsIcon" />
                {context.isAuthenticated ? (
                    <UserMenu />
                ) : (
                    <>
                        <NavLink to="/login">
                            <Button id="loginButton" variant="outlined">
                                Log In
                            </Button>
                        </NavLink>
                        <NavLink to="/signup">
                            <Button id="signupButton" variant="contained">
                                Sign Up
                            </Button>
                        </NavLink>
                    </>
                )}
            </Stack>
        </Box>
    );
}
