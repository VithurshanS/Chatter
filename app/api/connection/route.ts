import {connectioninputdata, modelstatus } from "@/lib/type";
import { addConnection,userout } from "@/model/auth";
import { NextRequest,NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    const body = await req.json() as connectioninputdata;
    const response = await addConnection(body) as modelstatus;
    if (response.statuscode === 200){
        return NextResponse.json({'message':'connection created successfully',"data":response.data as userout,"success":true},{status:200});
    }
    return NextResponse.json({'message':'connection created successfully',"data":null,"success":true},{status:400});
    
}