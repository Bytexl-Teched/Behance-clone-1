import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { BookProvider } from "./contexts/BookContext.jsx";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <BookProvider>
            <HashRouter>
                <App />
            </HashRouter>
        </BookProvider>
    </AuthProvider>
);
