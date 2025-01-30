import { useState,useEffect, FormEvent } from "react";
import mongoose from "mongoose";
import { interconnectionoutput,connectioninputdata, user } from "@/model/auth";
import { Message } from "../message/message";

export interface fetchconnctionreqdata{
    id:mongoose.Schema.Types.ObjectId;
}

export function Connection({id}:{id:mongoose.Schema.Types.ObjectId}) {
    const [connection,setConnection] = useState<user[]>([]);
    const [fn,setfn] = useState<string>();
    const [uss,setuss] = useState<user>();
    const [frie,setfrie] = useState<mongoose.Schema.Types.ObjectId>();
    useEffect(()=>{
        async function fetchConnection(){
            const response = await fetch('/api/fetchconnection',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id} as fetchconnctionreqdata)});
            if(response.status === 200){
                const data =await response.json();
                const out=data.data as interconnectionoutput;
                console.log(out);
                const conn: user[] = out.connection;

                setConnection(conn);
            }
            else{
                setConnection([]);
            }
        }
        fetchConnection()

    },[id,uss]);
    
    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        try{
            const res = await fetch('/api/connection',{method:'POST',headers:{'Content-Type': 'application/json',},body:JSON.stringify({user_id:id,friend_username:fn} as connectioninputdata)});
            const data = await res.json();
            if (res.status===200){
                setuss(data.data as user);
            }
            return ;

        }catch{
            console.log("nothing");
        }
        
        


    }



    return(
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="inp">Email of your friend</label>
                    <input
                        name="inp"
                        type="text"
                        value={fn}
                        onChange={(e) => setfn(e.target.value)}
                    />
                    <button type="submit">Connect</button>
                </form>
                <div>
                    {connection.map((element)=>(
                        <div key={element._id.toString()}>
                            <span>{element.username}</span>
                            <button onClick={()=>setfrie(element._id)}>select</button>
                        </div>
                    ))}
                </div>
                {frie && (
                    <div>
                        <Message sender={id} reciever={frie} />
                    </div>
                )}
            </div>

        </div>
    )
}
