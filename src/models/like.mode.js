import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    post:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
},{timestamps: true});

export default Like = mongoose.model("Like", likeSchema);