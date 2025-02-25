import Post from "../models/post.model";
import Comment from "../models/comment.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const createComment = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        const { postId, comment } = req.body;
        if (!id) {
            throw new ApiError(400, "Id is required");
        }
        if (!postId) {
            throw new ApiError(400, "Post Id is required");
        }
        if (!comment) {
            throw new ApiError(400, "Comment is required");
        }

        const post = await Post.findById(postId);
        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        const newComment = await Comment.create({
            user: id,
            post: postId,
            comment,
        });
        const updatePost = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: newComment._id,
                },
            },
            {
                new: true,
            }
        );

        return res
            .status(201)
            .json(
                new ApiResponse(201, updatePost, "Comment added successfully")
            );
    } catch (e) {
        return res
            .status(e?.status || 500)
            .json(
                new ApiResponse(
                    e?.status || 500,
                    null,
                    e?.message || "Internal server error"
                )
            );
    }
});

const updateComment = asyncHandler(async (req, res) => {
    try {
        const { commentId, comment } = req.body;
        if (!commentId) {
            throw new ApiError(400, "Comment Id is required");
        }
        if (!comment) {
            throw new ApiError(400, "Comment is required");
        }

        const updateComment = await Comment.findByIdAndUpdate(
            commentId,
            { comment },
            { new: true }
        );
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updateComment,
                    "Comment updated successfully"
                )
            );
    } catch (e) {
        return res
            .status(e?.status || 500)
            .json(
                new ApiResponse(
                    e?.status || 500,
                    null,
                    e?.message || "Internal server error"
                )
            );
    }
});

const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.body;
        if (!commentId) {
            throw new ApiError(400, "Comment Id is required");
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }

        const updatePost = await Post.findByIdAndUpdate(
            comment.post,
            {
                $pull: {
                    comments: commentId,
                },
            },
            {
                new: true,
            }
        );

        await Comment.findByIdAndDelete(commentId);
        return res
            .status(200)
            .json(
                new ApiResponse(200, updatePost, "Comment deleted successfully")
            );
    } catch (e) {
        return res
            .status(e?.status || 500)
            .json(
                new ApiResponse(
                    e?.status || 500,
                    null,
                    e?.message || "Internal server error"
                )
            );
    }
});

export { createComment, updateComment, deleteComment };
