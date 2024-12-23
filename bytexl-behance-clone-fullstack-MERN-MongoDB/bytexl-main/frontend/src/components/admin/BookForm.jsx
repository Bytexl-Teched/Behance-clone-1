import React, { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Rating,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { useBooks } from "../../contexts/BookContext";

function BookForm({
    id = "",
    initialValues = {
        title: "",
        author: "",
        category: "",
        price: "",
        rating: 0,
        year: "",
        image: "",
    },
    method = "POST",
}) {
    // Context API to get globally available states, constants, and functions
    const context = useBooks();
    const [base64String, setBase64String] = useState("");
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        message: "",
        open: false,
        severity: "success",
    });

    // Function to handle file input and convert to base64
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64String(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    function validate() {
        const newErrors = {};
        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.image) newErrors.image = "Image is required";
        if (!formData.author) newErrors.author = "Author is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.price || isNaN(formData.price) || formData.price <= 0)
            newErrors.price = "Valid price is required";
        if (formData.rating < 1 || formData.rating > 5)
            newErrors.rating = "Rating must be between 1 and 5";
        if (!formData.year || isNaN(formData.year) || formData.year < 1900)
            newErrors.year = "Valid publication year is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleRatingChange(_, newValue) {
        setFormData({ ...formData, rating: newValue });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const url = `/api/books/${method.toUpperCase() === "POST" ? "" : id}`;

        if (validate()) {
            try {
                setLoading(true);
                const token = localStorage.getItem("authToken");
                const res = await fetch(url, {
                    body: JSON.stringify({
                        ...formData,
                        price: Number(formData.price),
                        year: Number(formData.year),
                        image: base64String,
                    }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    method,
                });

                if (!res.ok) {
                    setSnackbar({
                        message:
                            res.statusText ||
                            "Please fix the errors in the form.",
                        open: true,
                        severity: "error",
                    });
                    return;
                }

                const data = await res.json();
                if (data._id) {
                    setSnackbar({
                        message: `Book ${
                            method.toUpperCase() === "POST"
                                ? "added"
                                : "updated"
                        } successfully!`,
                        open: true,
                        severity: "success",
                    });
                    setFormData({
                        title: "",
                        author: "",
                        category: "",
                        price: "",
                        rating: 0,
                        year: "",
                    });
                    setBase64String("");
                    context?.setToggle((prev) => !prev);
                }
            } catch (error) {
                setSnackbar({
                    message:
                        error.message || "Please fix the errors in the form.",
                    open: true,
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        }
    }

    function handleCloseSnackbar() {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }

    return (
        <Box
            component="form"
            id="bookFormContainer"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                margin: "auto",
                maxWidth: 400,
            }}
        >
            <Typography id="formHeader" textAlign="center" variant="h5">
                Book Details Form
            </Typography>
            <TextField
                error={!!errors.title}
                helperText={errors.title}
                id="titleInput"
                label="Title"
                name="title"
                onChange={handleChange}
                size="small"
                value={formData.title}
            />
            <TextField
                error={!!errors.author}
                helperText={errors.author}
                id="authorInput"
                label="Author"
                name="author"
                onChange={handleChange}
                size="small"
                value={formData.author}
            />
            <TextField
                error={!!errors.category}
                helperText={errors.category}
                id="categoryInput"
                label="Category"
                name="category"
                onChange={handleChange}
                size="small"
                value={formData.category}
            />
            <TextField
                error={!!errors.price}
                helperText={errors.price}
                id="priceInput"
                label="Price"
                name="price"
                onChange={handleChange}
                size="small"
                type="number"
                value={formData.price}
            />
            <Box
                id="ratingContainer"
                sx={{ alignItems: "center", display: "flex", gap: 1 }}
            >
                <Typography>Rating:</Typography>
                <Rating
                    id="ratingInput"
                    name="rating"
                    onChange={handleRatingChange}
                    precision={0.1}
                    value={formData.rating}
                />
                <Typography marginLeft={4}>{formData.rating}</Typography>
            </Box>
            {errors.rating && (
                <Typography color="error" id="ratingErrorText">
                    {errors.rating}
                </Typography>
            )}
            <TextField
                error={!!errors.year}
                helperText={errors.year}
                id="yearInput"
                label="Publication Year"
                name="year"
                onChange={handleChange}
                size="small"
                type="number"
                value={formData.year}
            />
            <Box
                sx={{
                    display: "flex",
                    gap: 16,
                }}
            >
                <input
                    accept="image/*"
                    name="image"
                    id="imageInput"
                    onChange={(e) => {
                        handleChange(e);
                        handleImageUpload(e);
                    }}
                    style={{ display: "none" }}
                    type="file"
                />
                <label htmlFor="imageInput">
                    <Button
                        component="span"
                        id="uploadButton"
                        variant="contained"
                    >
                        Choose Image
                    </Button>
                    {errors.image && (
                        <Typography variant="body2" color="red">
                            {errors.image}
                        </Typography>
                    )}
                </label>
                {(base64String || initialValues.image) && (
                    <img
                        alt="Uploaded preview"
                        id="uploadedImage"
                        src={base64String || initialValues.image}
                        width={50}
                        height={50}
                    />
                )}
            </Box>
            <Button
                color="primary"
                disabled={loading}
                id="submitButton"
                type="submit"
                variant="contained"
            >
                Submit
            </Button>
            <Snackbar
                autoHideDuration={3000}
                id="snackbar"
                onClose={handleCloseSnackbar}
                open={snackbar.open}
            >
                <Alert
                    id="alert"
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default BookForm;
