import { addMessage,  } from "@/model/auth";
import { modelstatus } from "@/lib/type";
import { NextRequest,NextResponse } from "next/server";

export interface sendtoM{
    sender:string;
    reciever:string;
    chat:string;
}
export async function POST(req:NextRequest){
    const body = await req.json() as sendtoM;
    const{sender,reciever,chat} = body;
    const res = await addMessage(sender,reciever,chat) as modelstatus;
    if(res.statuscode!=200){
        return NextResponse.json({message:"faied",data:null,success:false},{status:400})
    }
    const response= {message:"message fetched",data:res.data,success:true};
    return NextResponse.json(response,{status:200});
}