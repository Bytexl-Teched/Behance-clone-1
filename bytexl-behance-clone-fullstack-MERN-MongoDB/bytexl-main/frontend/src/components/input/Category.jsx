import * as React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useBooks } from "../../contexts/BookContext";

export default function Category() {
    const context = useBooks();

    const categories = [
        ...new Set(context?.FULL_DATA.map((item) => item.category.toUpperCase())),
    ];

    const handleChange = (event) => {
        context?.setCategory(event.target.value);
    };

    return (
        <FormControl 
            fullWidth 
            id="categoryFormControl"
        >
            <InputLabel 
                id="categoryInputLabel"
            >
                Category
            </InputLabel>
            <Select
                id="categorySelect"
                label="Category"
                labelId="categoryInputLabel"
                onChange={handleChange}
                value={context?.category}
            >
                {categories.map((item, idx) => (
                    <MenuItem
                        id={`categoryMenuItem-${idx}`}
                        key={idx}
                        onClick={() => {
                            context?.handleFilterByCategoryOrRating(
                                item.toLowerCase(),
                                context?.rating
                            );
                            context?.setFilterBy((prevState) => ({
                                ...prevState,
                                category: `Category - ${item}`,
                            }));
                        }}
                        value={item}
                    >
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
