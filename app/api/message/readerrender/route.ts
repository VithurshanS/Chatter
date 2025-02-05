import {  readerrenderMessage } from "@/model/auth";
import { modelstatus } from "@/lib/type";
import { NextRequest,NextResponse } from "next/server";

import { MOUT } from "@/model/auth";


export interface reqtoM{
    sender:string;
    reciever:string;
    chat?:string;
}

export async function POST(req:NextRequest){
    const body = await req.json() as reqtoM;
    const{sender,reciever} = body;
    const res = await readerrenderMessage(sender,reciever) as modelstatus;
    const ee = res.data as MOUT;
    console.log("cur4",ee);
    if(res.statuscode === 200){
        const response= {message:"message fetched",data:res.data as MOUT,success:true};
        return NextResponse.json(response,{status:200});

    }
    return NextResponse.json({message:"message doesnt fetched",data:null,success:true},{status:400});
    
}