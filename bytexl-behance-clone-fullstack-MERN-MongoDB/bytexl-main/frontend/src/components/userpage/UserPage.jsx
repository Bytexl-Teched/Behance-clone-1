import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    Button,
    Typography,
    Box,
    Grid2 as Grid,
    Chip,
    Rating,
    Snackbar,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useBooks } from "../../contexts/BookContext";

function UserPage() {
    const navigate = useNavigate();
    const context = useAuth();
    const booksContext = useBooks();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (!context.isAuthenticated) {
            navigate("/");
            return;
        }

        async function fetchLikedBooks() {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/users/${context?.userId}/liked_books/`
                );
                const data = await res.json();
                booksContext?.setLikedBooks(data?.likedBooks);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchLikedBooks();
    }, [context?.isAuthenticated, navigate]);

    async function handleUnlike(userId, bookId) {
        const token = localStorage.getItem("authToken");

        if (!token) {
            setSnackbar({
                open: true,
                message: "No auth token found",
                severity: "error",
            });
            return;
        }

        try {
            const response = await fetch(`/api/books/${bookId}/unlike`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setSnackbar({
                    open: true,
                    message: `Error unliking book: ${errorData.message}`,
                    severity: "error",
                });
                return;
            }

            const data = await response.json();
            booksContext?.setLikedBooks(data?.likedBooks);
            booksContext?.setTotalLikesCount((prev) => {
                const newState = prev?.map((item) => {
                    if (item?.id === bookId) {
                        return { ...item, totalLikes: item?.totalLikes - 1 };
                    } else {
                        return item;
                    }
                });
                return newState;
            });
            setSnackbar({
                open: true,
                message: data.message,
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "An error occurred while unliking the book",
                severity: "error",
            });
        }
    }

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Box
                id="userPageContainer"
                display="flex"
                flexDirection="column"
                minHeight="100vh"
                marginTop="70px"
            >
                {loading ? (
                    <Box
                        id="loadingContainer"
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 5,
                            minHeight: "100vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography id="loadingText" variant="h4">
                            Loading...
                        </Typography>
                    </Box>
                ) : booksContext?.likedBooks.length === 0 ? (
                    <Typography fontWeight="bold" variant="h4">
                        No liked books found
                    </Typography>
                ) : (
                    <Grid
                        container
                        id="booksGridContainer"
                        padding={2}
                        spacing={2}
                        style={{
                            width: "100vw",
                        }}
                    >
                        {booksContext?.likedBooks.map((item, idx) => (
                            <Grid
                                gap={5}
                                id="individualBookGridItem"
                                key={idx}
                                size={3}
                                sx={{
                                    position: "relative",
                                }}
                            >
                                <Box
                                    height="100%"
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                >
                                    <Chip
                                        color="warning"
                                        id="categoryChip"
                                        label={item.category?.toUpperCase()}
                                        onClick={() => {
                                            handleUnlike(
                                                context?.userId,
                                                item?._id
                                            );
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            borderRadius: "8px 0 8px 8px",
                                        }}
                                    />
                                    <img
                                        id="bookImage"
                                        src={item.image}
                                        style={{
                                            borderRadius: "4px",
                                            boxShadow: "1px 1px 10px grey",
                                            height: "150px",
                                            objectFit: "cover",
                                            width: "100%",
                                        }}
                                    />

                                    <Box
                                        id="titleAuthorContainer"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 5,
                                        }}
                                    >
                                        <Typography
                                            id="titleTypography"
                                            style={{
                                                fontWeight: "bolder",
                                                lineHeight: 1.2,
                                            }}
                                            variant="h6"
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography id="authorTypography">
                                            {item.author}
                                        </Typography>
                                    </Box>
                                    <Button
                                        color="black"
                                        fullWidth
                                        onClick={() => {
                                            handleUnlike(
                                                context?.userId,
                                                item?._id
                                            );
                                        }}
                                        sx={{
                                            backgroundColor: "teal",
                                        }}
                                    >
                                        REMOVE
                                    </Button>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={500}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default UserPage;
