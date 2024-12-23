import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    likedBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
    ],
});

export const User = mongoose.model("User", userSchema);
