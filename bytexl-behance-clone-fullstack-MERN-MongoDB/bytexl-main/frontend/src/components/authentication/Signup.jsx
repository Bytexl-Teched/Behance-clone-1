import React, { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Link,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Signup() {
    const context = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await fetch(
                "/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("authToken", data.token);
                setSeverity("success");
                setMessage("Login successful!");
                setOpen(true);
                context?.setIsAuthenticated(true);
                navigate("/");
            } else {
                setSeverity("error");
                setMessage(data.message || "Invalid email or password");
                setOpen(true);
            }
        } catch (error) {
            setSeverity("error");
            setMessage("Something went wrong. Please try again.");
            setOpen(true);
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <Typography
                gutterBottom
                id="signupTitle"
                variant="h4"
            >
                Signup
            </Typography>
            <form 
                id="signupForm"
                onSubmit={handleSubmit}
                style={{ width: "300px" }} 
            >
                <TextField
                    fullWidth
                    id="emailInput"
                    label="Email"
                    margin="normal"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    variant="outlined"
                    value={email}
                />
                <TextField
                    fullWidth
                    id="passwordInput"
                    label="Password"
                    margin="normal"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    variant="outlined"
                    value={password}
                />
                <Button
                    id="signupButton"
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Please wait..." : "Signup"}
                </Button>
            </form>
            <Typography
                id="loginPrompt"
                variant="body2"
                mt={2}
            >
                Already have an account?{" "}
                <Link
                    id="loginLink"
                    onClick={() => navigate("/login")}
                    style={{ cursor: "pointer" }}
                >
                    Login
                </Link>
            </Typography>

            <Snackbar 
                autoHideDuration={3000} 
                onClose={handleClose}
                open={open} 
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Signup;
