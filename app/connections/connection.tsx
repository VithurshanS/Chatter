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
    const [frie,setfrie] = useState<user>();
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
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <label htmlFor="inp" className="block text-lg font-medium text-gray-700">
            Email of your friend
          </label>
          <input
            name="inp"
            type="text"
            value={fn}
            onChange={(e) => setfn(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200"
          >
            Connect
          </button>
        </form>
  
        {/* Friends List */}
        <div>
            <div className="mt-6 w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Connected Users</h2>
            {connection.length > 0 ? (
                <div className="space-y-3">
                {connection.map((element) => (
                    <div key={element._id.toString()} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg shadow-md">
                    <span className="text-gray-900 font-medium">{element.username}</span>
                    <button
                        onClick={() => setfrie(element)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-500 transition duration-200"
                    >
                        Select
                    </button>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-gray-500">No connections found.</p>
            )}
            </div>
    
            {/* Chat Section */}
            {frie && (
            <div className="mt-6 w-full">
                <Message sender={id} reciever={frie} />
            </div>
            )}

        </div>
        
      </div>
    );
}
