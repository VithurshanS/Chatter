import { addConnection,connectioninputdata, modelstatus, user } from "@/model/auth";
import { NextRequest,NextResponse } from "next/server";
import { NRBody } from "../fetchconnection/route";


export async function POST(req:NextRequest) {
    const body = await req.json() as connectioninputdata;
    const response = await addConnection(body) as modelstatus;
    if (response.statuscode === 200){
        return NextResponse.json({'message':'connection created successfully',"data":response.data as user,"success":true} as NRBody,{status:200});
    }
    return NextResponse.json({'message':'connection created successfully',"data":null,"success":true} as NRBody,{status:400});
    
}