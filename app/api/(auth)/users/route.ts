import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";

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