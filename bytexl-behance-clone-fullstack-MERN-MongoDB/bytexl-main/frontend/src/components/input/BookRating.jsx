import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useBooks } from "../../contexts/BookContext";

export default function BookRating() {
    // Note: We are using Context API to get globally available states, constants and functions
    // We are not using prop drilling approach in this app
    const context = useBooks(); 

    return (
        <FormControl 
            fullWidth 
            id="bookRatingFormControl"
        >
            <InputLabel 
                id="bookRatingInputLabel"
            >
                Rating
            </InputLabel>
            <Select
                id="bookRatingSelect"
                label="Rating"
                labelId="bookRatingInputLabel"
                onChange={(e) => context?.setRating(Number(e.target.value))}
                value={context?.rating}
            >
                {context?.ratingCategories?.map((item, idx) => (
                    <MenuItem
                        id={`ratingMenuItem-${idx}`}
                        key={idx}
                        onClick={() => {
                            context?.handleFilterByCategoryOrRating(
                                context?.category,
                                item
                            );
                            context?.setFilterBy((prevState) => ({
                                ...prevState,
                                rating: `Rating more than ${item}`,
                            }));
                        }}
                        value={item}
                    >
                        More than {item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
