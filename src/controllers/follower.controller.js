import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";


const followUser = asyncHandler(async(req,res) => {
    try
    {
        const id = req?.user?._id;
        const {userId} = req.body;
        if(!userId)
        {
            throw new ApiError(400,"Please provide userId");
        }
        const validateFollowUser = await User.findById(userId);
        if(!validateFollowUser)
        {
            throw new ApiError(400,"User not found");
        }
        const followUser = await User.findByIdAndUpdate(id,{$push: {following: userId}},{new: true});
        if(!followUser)
        {
            throw new ApiError(400,"User not found");
        }
        const followedUser = await User
        .findByIdAndUpdate(userId,{$push: {followers: id}},{new: true})
        .select("-password -refreshToken");
        return res.status(200).json(new ApiResponse(200,{followUser,followedUser}));
    }
    catch(e)
    {
        return res.status(e.statusCode || 500).json(new ApiResponse(e.statusCode || 500,null,e.message));
    }
});

const getAllFollowers = asyncHandler(async(req,res) => {
    try
    {
        const id = req?.user?._id;
        const user = await User.aggregate([
            {
                $match: {_id:id}
            },
            {
                $project: {followers: 1}
            }
        ]);

        if(!user)
        {
            throw new ApiError(400,"User not found");
        }
        return res.status(200).json(new ApiResponse(200,user,"Followers"));
    }
    catch(e)
    {
        return res.status(e.statusCode || 500).json(new ApiResponse(e.statusCode || 500,null,e.message));
    }
});

const unfollowUser = asyncHandler(async(req,res) => {
    try
    {
        const id = req?.user?._id;
        const {userId} = req.body;
        if(!userId)
        {
            throw new ApiError(400,"Please provide userId");
        }
        const validateFollowUser = await User.findById(userId);
        if(!validateFollowUser)
        {
            throw new ApiError(400,"User not found");
        }
        const followUser = await User.findByIdAndUpdate(id,{$pull: {following: userId}},{new: true});
        if(!followUser)
        {
            throw new ApiError(400,"User not found");
        }
        const followedUser = await User
        .findByIdAndUpdate(userId,{$pull: {followers: id}},{new: true})
        .select("-password -refreshToken");
        return res.status(200).json(new ApiResponse(200,{followUser,followedUser}));
    }
    catch(e)
    {
        return res.status(e.statusCode || 500).json(new ApiResponse(e.statusCode || 500,null,e.message));
    }
});

export {followUser, getAllFollowers, unfollowUser};