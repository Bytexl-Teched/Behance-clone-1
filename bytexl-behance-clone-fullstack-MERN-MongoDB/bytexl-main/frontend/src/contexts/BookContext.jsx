import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

let FULL_DATA;
const ratingCategories = [1, 2, 3, 4];
const BookContext = createContext(null);

function BookProvider({ children }) {
    const authContext = useAuth();
    const [category, setCategory] = useState("");
    const [data, setData] = useState([]);
    const [filterBy, setFilterBy] = useState({
        category: "",
        rating: "",
    });
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(ratingCategories[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedBy, setSortedBy] = useState("");
    const [toggle, setToggle] = useState(true);
    const [likedBooks, setLikedBooks] = useState([]);
    const [totalLikesCount, setTotalLikesCount] = useState([]);

    useEffect(() => {
        if (authContext?.userId) {
            fetch(`/api/users/${authContext?.userId}/liked_books`)
                .then((res) => res.json())
                .then((data) => {
                    setLikedBooks(data.likedBooks);
                });
        }
    }, [authContext?.isAuthenticated]);

    useEffect(
        function () {
            setSortedBy("");
            setFilterBy({ category: "", rating: "" });

            // Two ways writing asynchronous JS code
            // 1. Fetching data using then and catch
            setLoading(true);
            fetch("/api/books")
                .then((response) => {
                    response.json().then((JSONResponse) => {
                        FULL_DATA = JSONResponse;
                        setData(JSONResponse);
                        setTotalLikesCount(
                            JSONResponse?.map((book) => ({
                                id: book?._id,
                                totalLikes: book?.totalLikes,
                            }))
                        );
                        setLoading(false);
                    });
                })
                .catch((errors) => console.log(errors));

            // 2. Using async and await
            // async function fetchData() {
            //     setLoading(true);
            //     const response = await fetch("http://localhost:5491/api/books");
            //     const temporaryData = await response.json();
            //     FULL_DATA = temporaryData;
            //     setData(temporaryData);
            //     setLoading(false);
            // }
            // fetchData();
        },
        [toggle]
    );

    function handleFilterByCategoryOrRating(category = "", rating = 0) {
        let filteredData = FULL_DATA;

        if (searchQuery) {
            filteredData = filteredData.filter((item) =>
                item?.title?.toLowerCase().includes(searchQuery)
            );
        }

        if (category) {
            filteredData = filteredData.filter(
                (item) =>
                    item?.category?.toLowerCase() === category?.toLowerCase()
            );
        }

        if (rating) {
            filteredData = filteredData.filter(
                (item) => item?.rating >= rating
            );
        }

        filteredData = checkSortCondition(filteredData);
        setData(filteredData);
    }

    function handleReset() {
        let data = checkSortCondition(FULL_DATA);
        setData(data);
    }

    function handleSearch(
        query,
        categoryLocal = category,
        ratingLocal = rating
    ) {
        if (!query) return;

        let searchedData = FULL_DATA?.filter((item) =>
            item?.title?.toLowerCase().includes(query)
        );

        if (categoryLocal) {
            searchedData = searchedData.filter(
                (item) =>
                    item?.category?.toLowerCase() === category?.toLowerCase()
            );
        }

        if (ratingLocal) {
            searchedData = searchedData.filter(
                (item) => item?.rating >= ratingLocal
            );
        }

        searchedData = checkSortCondition(searchedData);
        setData(searchedData);
    }

    function checkSortCondition(dataArray) {
        switch (sortedBy?.toLowerCase()) {
            case "Price (Low to High)".toLowerCase():
                dataArray = dataArray?.sort((a, b) => a?.price - b?.price);
                break;
            case "Price (High to Low)".toLowerCase():
                dataArray = dataArray?.sort((a, b) => b?.price - a?.price);
                break;
            case "Rating (Low to High)".toLowerCase():
                dataArray = dataArray?.sort((a, b) => a?.rating - b?.rating);
                break;
            case "Rating (High to Low)".toLowerCase():
                dataArray = dataArray?.sort((a, b) => b?.rating - a?.rating);
                break;
            default:
                break;
        }
        return dataArray;
    }

    function handleSortByPriceAscending() {
        setData((oldData) => {
            return [...oldData].sort((a, b) => a.price - b.price);
        });
    }

    function handleSortByPriceDescending() {
        setData((oldData) => {
            return [...oldData].sort((a, b) => b.price - a.price);
        });
    }

    function handleSortByRatingAscending() {
        setData((oldData) => {
            return [...oldData].sort((a, b) => a.rating - b.rating);
        });
    }

    function handleSortByRatingDescending() {
        setData((oldData) => {
            return [...oldData].sort((a, b) => b.rating - a.rating);
        });
    }

    return (
        <BookContext.Provider
            id="booksContextProvider"
            value={{
                category,
                data,
                filterBy,
                FULL_DATA,
                handleFilterByCategoryOrRating,
                handleReset,
                handleSearch,
                handleSortByPriceAscending,
                handleSortByPriceDescending,
                handleSortByRatingAscending,
                handleSortByRatingDescending,
                likedBooks,
                loading,
                rating,
                ratingCategories,
                searchQuery,
                setCategory,
                setData,
                setFilterBy,
                setLikedBooks,
                setLoading,
                setRating,
                setSearchQuery,
                setSortedBy,
                setToggle,
                sortedBy,
                totalLikesCount,
                setTotalLikesCount,
            }}
        >
            {children}
        </BookContext.Provider>
    );
}

function useBooks() {
    const context = useContext(BookContext);
    if (!context) {
        throw Error("You might be using the context outside of its provider");
    }
    return context;
}

export { BookProvider, useBooks };
