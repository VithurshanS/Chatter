import { addMessage,messageOutput, modelstatus } from "@/model/auth";
import { NextRequest,NextResponse } from "next/server";
import mongoose from "mongoose";
import { NRBody } from "../../fetchconnection/route";

export interface sendtoM{
    sender:mongoose.Schema.Types.ObjectId;
    reciever:mongoose.Schema.Types.ObjectId;
    chat:string;
}
export async function POST(req:NextRequest){
    const body = await req.json() as sendtoM;
    const{sender,reciever,chat} = body;
    const res = await addMessage(sender,reciever,chat) as modelstatus;
    if(res.statuscode!=200){
        return NextResponse.json({message:"faied",data:null,success:false} as NRBody,{status:400})
    }
    const response:NRBody = {message:"message fetched",data:res.data,success:true};
    return NextResponse.json(response,{status:200});
}