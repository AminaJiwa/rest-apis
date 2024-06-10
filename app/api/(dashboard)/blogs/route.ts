import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blog";

export const GET = async (request: Request) =>{
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if (!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing user ID"}),
                {status: 400}
            );
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing category ID"}),
                {status: 400}
            );
        }

        await connect();

        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(
                JSON.stringify({message: "User not found"}),
                {status: 404}
            );
        }

        const category = await Category.findById(categoryId);
        if (!category){
            return new NextResponse(
                JSON.stringify({message: "Category not found"}),
                {status: 404}
            );
        }

        const filter: any = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),

        }
        //Add 

        const blogs = await Blog.find(filter);

        return new NextResponse(JSON.stringify({ blogs }), {
            status: 200,
        });
    }
    catch (error: any){
        return new NextResponse("Error in fetching blogs" + error.message, {
            status: 500,
        });
    }
}

export const POST = async (request: Request) => {
    
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        const body = await request.json();
        const {title, description} = body;

        if (!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing user ID"}),
                {status: 400}
            );
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing category ID"}),
                {status: 400}
            );
        }
        await connect();

        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(
                JSON.stringify({message: "User not found"}),
                {status: 404}
            );
        }

        const category = await Category.findById(categoryId);
        if (!category){
            return new NextResponse(
                JSON.stringify({message: "Category not found"}),
                {status: 404}
            );
        }

        const newBlog = new Blog({
            title, 
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        });

        await newBlog.save();
        return new NextResponse(
            JSON.stringify({ message: "Blog is created", blog: newBlog}),
            {status: 200}
        )
    }
    catch (error: any){
        return new NextResponse("Error in fetching categories" + error.message, {
            status: 500,
        });
    }
}

