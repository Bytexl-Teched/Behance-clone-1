import Sort from "./Sort";
import { useBooks } from "../../contexts/BookContext";
import { useState } from "react";
import styles from "./Input.module.css";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import Filter from "./Filter";

function Input() {
    // Note: We are using Context API to get globally available states, constants and functions
    // We are not using prop drilling approach in this app
    const context = useBooks();
    const [inputValue, setInputValue] = useState("");
    const options = context?.FULL_DATA?.map(item=> item?.title) || [];

    function handleSearch() {
        context?.setSearchQuery(inputValue);
        context?.handleSearch(inputValue.toLowerCase());
    }

    function handleResetSearch() {
        context?.handleReset();
        context?.setSearchQuery("");
        context?.setSortedBy("");
        context?.setFilterBy({
            category: "",
            rating: "",
        });
    }

    return (
        <Box id="inputContainer">
            <Box className={styles.inputContainer}>
                <Filter />
                <Box 
                    className={styles.input} id="searchInputContainer"
                >
                    <Autocomplete
                        fullWidth
                        id="autocompleteTextInput"
                        options={options}
                        freeSolo
                        inputValue={inputValue}
                        onInputChange={(_, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            id="textInput"
                            label="Search for a book..."
                            variant="outlined"
                            />
                        )}
                    />
                    <Button 
                        id="searchButton" 
                        onClick={handleSearch}
                    >
                        <SearchIcon />
                    </Button>
                    <Button 
                        id="resetSearchButton" 
                        onClick={handleResetSearch}
                    >
                        <ClearIcon />
                    </Button>
                </Box>
                <Sort />
            </Box>
        </Box>
    );
}

export default Input;
