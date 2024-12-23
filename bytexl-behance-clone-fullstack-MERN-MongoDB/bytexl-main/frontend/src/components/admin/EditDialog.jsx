import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import BookForm from "./BookForm";

const EditDialog = ({ book, handleClose, open }) => {
    return (
        <Dialog
            fullWidth
            id="editDialogContainer"
            onClose={handleClose}
            open={open}
        >
            <DialogTitle 
                id="dialogTitle"
            >
                Update {book?.title}
            </DialogTitle>
            <DialogContent 
                id="dialogContent"
            >
                <BookForm 
                    id={book?._id} 
                    initialValues={book} 
                    method="PUT" 
                />
            </DialogContent>
            <DialogActions 
                id="dialogActions"
            >
                <Button 
                    color="primary" 
                    id="closeButton" 
                    onClick={handleClose}>
                        Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
