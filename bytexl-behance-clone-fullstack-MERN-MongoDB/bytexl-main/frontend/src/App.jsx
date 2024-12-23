import Content from "./components/content/Content";
import Input from "./components/input/Input";
import Navbar from "./components/navbar/Navbar";
import Divider from "@mui/material/Divider";
import { Box, Typography } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import { useBooks } from "./contexts/BookContext";
import UserPage from "./components/userpage/UserPage";
import Admin from "./components/admin/Admin";
import SkeletonGrid from "./components/content/SkeletonGrid";

function App() {
    const context = useBooks();

    return (
        <Box id="mainContainer">
            <Box
                id="stickyHeaderContainer"
                style={{
                    backgroundColor: "#fff",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                }}
            >
                <Navbar />
                <Divider />
            </Box>
            <Routes>
                <Route
                    index
                    path="/"
                    element={
                        <>
                            <Input />
                            <Box
                                id="contentContainer"
                                style={{
                                    marginTop: "15px",
                                }}
                            >
                                {
                                    (context?.loading) ? 
                                    <SkeletonGrid/>
                                    : 
                                    <Content />
                                }
                            </Box>
                        </>
                    }
                />
                <Route path="/admin" element={<Admin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/userpage" element={<UserPage />} />
            </Routes>
        </Box>
    );
}

export default App;
