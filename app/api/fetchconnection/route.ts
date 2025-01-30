import { getConnection,connectionoutput, modelstatus } from "@/model/auth";
import { NextRequest,NextResponse } from "next/server";
import { fetchconnctionreqdata } from "@/app/connections/connection";


export async function POST(req:NextRequest) {
    const body = await req.json() as fetchconnctionreqdata;
    const response = await getConnection(body.id) as modelstatus;
    if(response.statuscode === 200){
        const connections:connectionoutput = response.data;
        return NextResponse.json({message:'fetched',data:connections,success:true},{status:200})
    }
    return NextResponse.json({message:'not fetched',data:null,success:true},{status:400})


    
}