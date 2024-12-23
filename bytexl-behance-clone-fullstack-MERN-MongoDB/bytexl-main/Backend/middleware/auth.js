import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ message: "Invalid or expired token" });
        }

        req.user = decoded;
        next();
    });
};

// Add documentation for how to do authentication in the README
