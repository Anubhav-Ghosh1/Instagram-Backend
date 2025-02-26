import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const getFollowing = asyncHandler(async(req,res) => {
    try
    {
        const {userId} = req.body;
        if(!userId)
        {
            throw new ApiError(400,"Please provide userId");
        }
        const user = await User.aggregate([
            {
                $match: {_id:userId}
            },
            {
                $project: {following: 1}
            }
        ]);

        if(!user)
        {
            throw new ApiError(400,"User not found");
        }
        return res.status(200).json(new ApiResponse(200,user,"Following list fetched successfully"));
    }
    catch(e)
    {
        return res.status(e.statusCode || 500).json(new ApiResponse(e.statusCode || 500,null,e.message));
    }
});

export {getFollowing};