import mongoose from "mongoose";
import { useState,useEffect, FormEvent } from "react";
// messageoutput,message input,getmessageinput type,NRBody,
import { messageOutput, SingleMessage } from "@/model/auth";
import { sendtoM} from "../api/message/sendmessage/route";
import { reqtoM } from "../api/message/getmessage/route";
import { NRBody } from "../api/fetchconnection/route";


export  function Message({sender,reciever}:{sender:mongoose.Schema.Types.ObjectId,reciever:mongoose.Schema.Types.ObjectId}) {
    const [chat,setchat] = useState<any>("");
    const [messages,setmessages] = useState<SingleMessage[]>();
    const [button,setbutton] = useState<number>(0);
    useEffect(()=>{
        async function fetchdata(){
            const ress = await fetch('/api/message/getmessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender,reciever} as reqtoM)});
            const body = await ress.json() as NRBody;
            const dat = body.data as messageOutput;
            setmessages(dat.chats);
        }
        fetchdata();

    },[button]);

    async function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        const responce = await fetch('/api/message/sendmessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender,reciever,chat} as sendtoM)});
        const body = await responce.json() as NRBody;
        console.log(body);
        setbutton((button)=>button+1);

    }
    return(
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="inp">Message</label>
                    <input
                        name="inp"
                        type="text"
                        value={chat}
                        onChange={(e) => setchat(e.target.value)}
                    />
                    <button type="submit">Send</button>
                </form>
                <p>{JSON.stringify(messages)}</p>
            </div>

        </div>
    )


    
}