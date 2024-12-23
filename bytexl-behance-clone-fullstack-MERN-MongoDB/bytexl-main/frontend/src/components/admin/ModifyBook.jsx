import React, { useState } from "react";
import {
    Alert,
    Box,
    Divider,
    Grid2 as Grid,
    Snackbar,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBooks } from "../../contexts/BookContext";
import EditDialog from "./EditDialog";

function ModifyBook() {
    const context = useBooks();
    const [open, setOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState();

    const handleClose = () => {
        setOpen(false);
    };

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleEdit = (book) => {
        setOpen(true);
        setSelectedBook(book);
    };

    async function handleDelete(book) {
        const token = localStorage.getItem("authToken");
        const url = `/api/books/${book._id}`;

        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "DELETE",
            });

            if (!res.ok) {
                setSnackbar({
                    message: res.statusText || "Something went wrong",
                    open: true,
                    severity: "error",
                });
                return;
            }
            const data = await res.json();
            if (data.message) {
                setSnackbar({
                    message: data.message,
                    open: true,
                    severity: "success",
                });
                context?.setToggle((prev) => !prev);
            }
        } catch (error) {
            setSnackbar({
                message: error.message || "Something went wrong",
                open: true,
                severity: "error",
            });
        }
    }

    function handleCloseSnackbar() {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }

    return (
        <>
            <Grid 
                container 
                id="modifyBookContainer"
                padding={2} 
                spacing={2}
                style={{
                    width: "100vw"
                }}
            >
                {
                    context?.data.map((book) => (
                        <Grid 
                            id={`bookContainer-${book._id}`}  
                            key={book._id}>
                            <Box
                                border={1}
                                borderColor="gray"
                                borderRadius={1}
                                display="flex"
                                flexDirection="column"
                                height="100%"
                                id={`bookBox-${book._id}`}
                                justifyContent="space-between"
                                padding={1}
                                width="200px"
                            >
                                <img
                                    alt="Book Image"
                                    id={`bookImage-${book._id}`}
                                    src={book.image}
                                    style={{
                                        borderRadius: "4px",
                                        boxShadow: "1px 1px 10px grey",
                                        height: "150px",
                                        objectFit: "cover",
                                        width: "100%"
                                    }}
                                />
                                <Box id={`bookDetails-${book._id}`}>
                                    <Typography
                                        fontWeight="bold"
                                        id={`bookTitle-${book._id}`}
                                        lineHeight={1.25}
                                        textAlign="left"
                                        variant="subtitle1"
                                    >
                                        {book.title}
                                    </Typography>
                                    <Typography
                                        color="textSecondary"
                                        id={`bookAuthor-${book._id}`}
                                        textAlign="left"
                                        variant="body2"
                                    >
                                        {book.author}
                                    </Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    id={`actionIcons-${book._id}`}
                                    justifyContent="space-between"
                                    mt={1}
                                    width="100%"
                                >
                                    <EditIcon
                                        id={`editIcon-${book._id}`}
                                        onClick={() => handleEdit(book)}
                                        style={{
                                            color: "green",
                                            cursor: "pointer",
                                        }}
                                    />

                                    <DeleteIcon
                                        id={`deleteIcon-${book._id}`}
                                        onClick={() => handleDelete(book)}
                                        style={{
                                            color: "red",
                                            cursor: "pointer",
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Divider />
                        </Grid>
                    ))
                }
            </Grid>

            <EditDialog
                book={selectedBook}
                handleClose={handleClose}
                open={open}
            />

            <Snackbar
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                open={snackbar.open}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default ModifyBook;
