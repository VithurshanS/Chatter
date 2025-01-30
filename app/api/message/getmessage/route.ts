import { getMessage,messageOutput, modelstatus } from "@/model/auth";
import { NextRequest,NextResponse } from "next/server";
import mongoose from "mongoose";
import { NRBody } from "../../fetchconnection/route";

export interface reqtoM{
    sender:mongoose.Schema.Types.ObjectId;
    reciever:mongoose.Schema.Types.ObjectId;
    chat?:string;
}

export async function POST(req:NextRequest){
    const body = await req.json() as reqtoM;
    const{sender,reciever} = body;
    const res = await getMessage(sender,reciever) as modelstatus;
    const response:NRBody = {message:"message fetched",data:res.data as messageOutput,success:true};
    return NextResponse.json(response,{status:200});
}