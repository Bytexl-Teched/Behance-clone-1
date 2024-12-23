import Grid from "@mui/material/Grid2";
import styles from "./Content.module.css";
import { Alert, Box, Chip, Rating, Snackbar, Typography } from "@mui/material";
import { useBooks } from "../../contexts/BookContext";
import { useAuth } from "../../contexts/AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const Content = () => {
    // Note: We are using Context API to get globally available states, constants and functions
    // We are not using prop drilling approach in this app
    const authContext = useAuth();
    const booksContext = useBooks();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const bookIds = booksContext?.likedBooks?.map((item) => item?._id);

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        setSnackbar({ ...snackbar, open: false });
    };

    async function handleLike(userId, book) {
        const { _id: bookId } = book;
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
            const response = await fetch(`/api/books/${bookId}/like/`, {
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
                    message: errorData.message,
                    severity: "error",
                });
                return;
            }

            const data = await response.json();
            booksContext?.setLikedBooks(data?.likedBooks);
            booksContext?.setTotalLikesCount((prev) => {
                const newState = prev?.map((item) => {
                    if (item?.id === bookId) {
                        return { ...item, totalLikes: item?.totalLikes + 1 };
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
                message:
                    error?.message || "An error occurred while liking the book",
                severity: "error",
            });
        }
    }

    const totalLikes = booksContext?.totalLikesCount?.map(
        (book) => book?.totalLikes
    );

    return (
        <>
            <Typography
                fontWeight="bold"
                id="booksCountTypography"
                textAlign="center"
            >
                {booksContext?.data.length === 0
                    ? "No book found"
                    : `${booksContext?.data?.length} books found`}
            </Typography>
            <Grid
                container
                id="booksGridContainer"
                padding={2}
                spacing={2}
                style={{
                    width: "100vw",
                }}
            >
                {booksContext?.data?.map((item, index) => (
                    <Grid
                        gap={5}
                        id="individualBookGridItem"
                        key={item?._id}
                        size={3}
                        style={{
                            position: "relative",
                        }}
                    >
                        {authContext?.isAuthenticated && (
                            <FavoriteIcon
                                id="likeChip"
                                onClick={() =>
                                    handleLike(authContext?.userId, item)
                                }
                                style={{
                                    color: `${
                                        bookIds?.includes(item?._id)
                                            ? "red"
                                            : "powderblue"
                                    }`,
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    fontSize: 24,
                                    cursor: "pointer",
                                }}
                            />
                        )}
                        <Chip
                            color="warning"
                            id="categoryChip"
                            label={item.category.toUpperCase()}
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
                            className={styles.container}
                            id="titleAuthorPriceRatingContainer"
                        >
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
                            <Box
                                id="priceRatingContainer"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 5,
                                }}
                            >
                                <Typography
                                    fontWeight="bold"
                                    id="priceTypography"
                                    textAlign="right"
                                >
                                    &#x24;{item.price}
                                </Typography>
                                <Typography id="ratingTypography">
                                    <Rating
                                        defaultValue={item.rating}
                                        id="ratingInput"
                                        name="half-rating-read"
                                        precision={0.1}
                                        readOnly
                                        size="small"
                                        style={{ color: "red", zIndex: -1 }}
                                    />
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <ThumbUpIcon />
                                    <Typography>
                                        {totalLikes[index] ?? 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

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
};

export default Content;
