import User from "../models/user.model";
import Post from "../models/post.model";
import Like from "../models/like.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const createLike = asyncHandler(async (req,res) => {
    try
    {
        const id = req?.user?._id;
        const {postId} = req.body;
        if(!id)
        {
            throw new ApiError(400,"Id is required");
        }
        if(!postId)
        {
            throw new ApiError(400,"Post Id is required");
        }
        const post = await Post.findById(postId);
        if(!post)
        {
            throw new ApiError(404,"Post not found");
        }

        const existingLike = await Like.findOne({user: id,post: postId});
        if(existingLike)
        {
            throw new ApiError(400,"You have already liked this post");
        }

        const like = await Like.create({user: id,post: postId});
        const updatePost = await Post.findByIdAndUpdate(postId,
            {
                $push:
                {
                    likes: like._id
                }
            },
            {
                new: true
            }
        );

        return res.status(201).json(new ApiResponse(201,updatePost,"Like added successfully"));
    }
    catch(e)
    {
        return res.status(e?.status || 500).json(new ApiResponse(e?.status || 500,null,e?.message || "Internal server error"));
    }
});

const deleteLike = asyncHandler(async (req,res) => {
    try
    {
        const {postId} = req.body;
        if(!postId)
        {
            throw new ApiError(400,"Post Id is required");
        }

        const id = req?.user?._id;
        if(!id)
        {
            throw new ApiError(400,"Id is required");
        }

        const user = await User.findById(id);
        if(!user)
        {
            throw new ApiError(404,"User not found");
        }

        const existingLike = await Like.findOne({user: id,post: postId});
        if(!existingLike)
        {
            throw new ApiError(404,"Like not found");
        }

        const post = await Post.findById(postId);
        if(!post)
        {
            throw new ApiError(404,"Post not found");
        }

        const updatePost = await Post.findByIdAndUpdate(post._id,{
            $pull:
            {
                likes: existingLike._id
            }
        },{
            new: true
        });

        const deleteLike = await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200,updatePost,"Like deleted successfully"));
    }
    catch(e)
    {
        return res.status(e?.status || 500).json(new ApiResponse(e?.status || 500,null,e?.message || "Internal server error"));
    }
});

export {createLike,deleteLike};