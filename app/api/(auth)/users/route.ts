import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;
//Get request
export const GET = async () => {
    try{
        //calls connect function from db.ts file
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});

    }
    catch (error: any) {
        return new NextResponse("Error in fetching users" + error.message, {status: 500}); 
    }
    
};

export const POST = async(request: Request) => {
    try{
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();
        //return response to client - browser e.g.
        return new NextResponse(JSON.stringify({message: "User is created", user: newUser}),
        
        {status: 200}
    );
    }
    catch (error: any){
        return new NextResponse("Error in creating user" + error.message,{
            status: 500,
        });
    }
};

export const PATCH = async (request: Request) => {
    try{
        //get user id to update
        const body = await request.json();
        const {userId, newUsername } = body;
        
        //await connection from database
        await connect();
        //if user Id or username is invalid
        if(!userId || !newUsername){
            return new NextResponse(
                JSON.stringify({ message: "ID or new username not found"}),
                {status: 400}
            );
        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID"}),
                {status: 400}
            );
        }
        //find if it exists in database, and then updates if it finds
        const updatedUser = await User.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {username: newUsername},
            {new: true}
        );

        if(!updatedUser){
        return new NextResponse(
            JSON.stringify({message: "User not found in the database"}),
            {status: 400}
        );
    }

        return new NextResponse(
            JSON.stringify({ message: "User is updated", user: updatedUser}),
            {status: 200}
        );
    }
    catch (error: any){
        return new NextResponse("Error in updating user" + error.message, {
            status:500
        });
    }
};

export const DELETE = async (request: Request) => {
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        //to verify if userID is being parsed or not
        if(!userId){
            return new NextResponse(
                JSON.stringify({ message: "ID not found"}),
                {status: 400}
            );
        }

        if (!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({ message: "Invalid User ID"}),
        {status: 400,});
        }

        await connect();

        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if(!deletedUser){
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database"}),
                {status: 400}
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is deleted", user: deletedUser }),
            {status: 200}
        );
    }
    catch (error: any){
        return new NextResponse("Error in deleting user" + error.message, {
                status: 500,
             });
        
    }
};