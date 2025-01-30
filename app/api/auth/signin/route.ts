import { getUser} from "@/model/auth";
import jwt from 'jsonwebtoken';
import { NextResponse,NextRequest } from 'next/server';
import type { userinputdata,modelstatus } from "@/model/auth";
import mongoose from "mongoose";

interface tokendata{
    id:mongoose.Schema.Types.ObjectId;
    username:string;
}

export async function POST(req:NextRequest){
    try{
        const {username,password} =await req.json() as userinputdata;
        if(!username || !password){
            return NextResponse.json({message:'email and password are required',data:null,success:false},{status:400});
        }
        const result = await getUser({username,password}) as modelstatus;
        console.log(result.statuscode,"ddd");
        if(result.statuscode === 200){
            //console.log("login succeed")
            const tokenData:tokendata = {
                id:result.data._id,
                username:result.data.username,
            }
            const token = await jwt.sign(tokenData,"vithurshansivan",{expiresIn:'2h'});
            const response = NextResponse.json({
                message:"Login successfull",
                data:null,
                success:true,
            },{status:200});
            response.cookies.set("token",token,{
                httpOnly:true,
            })
    
            return response;

        }
        return NextResponse.json({message:"internal server error"},{status:500});

    }catch(err){
        console.log(err)
        return NextResponse.json({message:"Server Failed",err},{status:500});
    }
    
    


}

export async function GET(request:NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided',data:null, success:false },
        { status: 401 }
      );
    }
    const decoded = jwt.verify(token, "vithurshansivan") as tokendata;
    console.log(JSON.stringify(decoded));
    return NextResponse.json({message: 'Token verified successfully',data:decoded,success:true},{status:200});
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: 'Unauthorized: Invalid or expired token', success: false },
      { status: 401 }
    );
  }
}
