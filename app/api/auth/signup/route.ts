import { registerUser } from "@/model/auth";
import { NextResponse,NextRequest } from 'next/server';
import type { userinputdata,modelstatus } from "@/model/auth";


export async function POST(req:NextRequest){
    try{
        const body = await req.json() as userinputdata;
        const {username,password} = body;
        if(!username || !password){
            return new Response(JSON.stringify({message:'email and password are required',data:null,success:false}),{status:400},);
        }
        const result = await registerUser({username,password}) as modelstatus;
        if (result.statuscode === 400){
            return NextResponse.json({message:'email and password are required',data:null,success:false},{status:400})
        }
        return NextResponse.json({message:"user registered successfully",data:null,success:true},{status:200})

    }catch(err){
        console.error('error came when :',err);
        return new Response(JSON.stringify({error:'Internal server error'}),{status:500});
    }
    

}
