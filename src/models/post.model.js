import mongoose from "mongoose";

const postSchema = new monoogse.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    caption:
    {
        type: String,
        required: true,
    },
    content:
    {
        type: String,
    },
    likes:
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
    }],
    comments:
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    share:
    {
        type: Number,
        default: 0,
    }
},{timestamps: true});

export default Post = mongoose.model("Post",postSchema);