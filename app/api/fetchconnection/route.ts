import { getConnection } from "@/model/auth";
import { modelstatus} from "@/lib/type";
import { NextRequest,NextResponse } from "next/server";
import { fetchconnctionreqdata } from "@/components/connection";
import { userType } from "@/model/auth";


export async function POST(req:NextRequest) {
    const body = await req.json() as fetchconnctionreqdata;
    const response = await getConnection(body.id) as modelstatus;
    if(response.statuscode === 200){
        const connections = response.data as userType[];
        return NextResponse.json({message:'fetched',data:connections,success:true},{status:200})
    }
    return NextResponse.json({message:'not fetched',data:null,success:true},{status:400})


    
}