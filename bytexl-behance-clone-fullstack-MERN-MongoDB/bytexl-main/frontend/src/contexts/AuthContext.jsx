import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [email, setEmail] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const isExpired = decodedToken?.exp * 1000 < Date.now();

                if (isExpired) {
                    localStorage.removeItem("authToken");
                    setIsAuthenticated(false);
                } else {
                    setEmail(decodedToken?.email);
                    setUserId(decodedToken?.userId);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                localStorage.removeItem("authToken");
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider
            id="authContextProvider" 
            value={{
                email,
                isAuthenticated,
                setIsAuthenticated,
                userId,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw Error("You might be using the context outside of its provider");
    }
    return context;
}

export { AuthProvider, useAuth };
