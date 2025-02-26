import express from "express";
import User from "../models/user.model";
import Post from "../models/post.model";
import Comment from "../models/comment.model";
import Like from "../models/like.model";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";

const createPost = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        const { caption } = req.body;
        if (!id) {
            throw new ApiError(400, "Id is required");
        }
        if (!caption) {
            throw new ApiError(400, "Caption is required");
        }

        let filePath = req?.file?.path;

        if (!filePath) {
            throw new ApiError(400, "Please upload a file");
        }

        const uploadedPost = await uploadOnCloudinary(filePath);
        if (!uploadedPost) {
            throw new ApiError(500, "Error while uploading file");
        }

        const post = await Post.create({
            user: id,
            caption,
            content: uploadedPost.secure_url,
            type: uploadedPost.resource_type,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, post, "Post created successfully"));
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

const makePostArchived = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new ApiError(400, "Post Id is required");
        }
        const post = await Post.findByIdAndUpdate(
            new mongoose.Types.ObjectId(postId),
            { isArchived: true },
            { new: true }
        );
        if (!post) {
            throw new ApiError(404, "Post not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, post, "Post archived successfully"));
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

const makePostPublic = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new ApiError(400, "Post Id is required");
        }
        const post = await Post.findByIdAndUpdate(
            new mongoose.Types.ObjectId(postId),
            { isArchived: false },
            { new: true }
        );
        if (!post) {
            throw new ApiError(404, "Post not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, post, "Post made public successfully"));
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

const getPostsByUser = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        if (!id) {
            throw new ApiError(400, "Id is required");
        }

        const posts = await Post.find({ user: id })
            .populate("user", "username")
            .populate("likes", "user")
            .populate("comments", "user comment")
            .sort("-createdAt");
        return res
            .status(200)
            .json(new ApiResponse(200, posts, "Posts fetched successfully"));
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

const getPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username")
            .populate("likes", "user")
            .populate("comments", "user comment")
            .sort("-createdAt");
        return res
            .status(200)
            .json(new ApiResponse(200, posts, "Posts fetched successfully"));
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

const getPostById = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new ApiError(400, "Post Id is required");
        }
        const posts = await Post.find(new mongoose.Types.ObjectId(postId))
            .populate("user", "username")
            .populate("likes", "user")
            .populate("comments", "user comment")
            .sort("-createdAt");
        if (!posts) {
            throw new ApiError(404, "Post not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, posts, "Post fetched successfully"));
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

const updateCaption = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        const { caption } = req.body;
        if (!postId) {
            throw new ApiError(400, "Post Id is required");
        }
        if (!caption) {
            throw new ApiError(400, "Caption is required");
        }
        const post = await Post.findByIdAndUpdate(
            new mongoose.Types.ObjectId(postId),
            { caption },
            { new: true }
        );
        if (!post) {
            throw new ApiError(404, "Post not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, post, "Caption updated successfully"));
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

const deletePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new ApiError(400, "Post Id is required");
        }
        const post = await Post.findByIdAndDelete(
            new mongoose.Types.ObjectId(postId)
        );
        if (!post) {
            throw new ApiError(404, "Post not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Post deleted successfully"));
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

export {
    createPost,
    getPostsByUser,
    makePostArchived,
    makePostPublic,
    getPosts,
    getPostById,
    updateCaption,
    deletePost,
};
