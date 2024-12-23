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

function Login() {
    const context = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [severity, setSeverity] = useState("");
    const [email, setEmail] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await fetch(
                "/api/auth/login",
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
            id="loginContainer"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <Typography 
                gutterBottom
                id="loginTitle" 
                variant="h4" 
            >
                Login
            </Typography>
            <form 
                id="loginForm" 
                onSubmit={handleSubmit} 
                style={{ width: "300px" }}
            >
                <TextField
                    id="emailInput"
                    fullWidth
                    label="Email"
                    margin="normal"
                    required
                    type="text"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    id="passwordInput"
                    fullWidth
                    label="Password"
                    margin="normal"
                    required
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    id="loginButton"
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Please wait..." : "Login"}
                </Button>
            </form>
            <Typography id="signupPrompt" variant="body2" mt={2}>
                Don't have an account?{" "}
                <Link
                    id="signupLink"
                    onClick={() => navigate("/signup")}
                    style={{ cursor: "pointer" }}
                >
                    Sign up
                </Link>
            </Typography>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
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

export default Login;
