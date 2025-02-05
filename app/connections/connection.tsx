import { useState,useEffect, FormEvent } from "react";

import {connectioninputdata} from "@/lib/type";
import { Message } from "../message/message";
import { supabase, urm, userout } from "@/model/auth";
import { friendl } from "@/model/auth";
export interface fetchconnctionreqdata{
    id:string;
}

export function Connection({id}:{id:string}) {
    const [connection,setConnection] = useState<friendl[]>([]);
    const [fn,setfn] = useState<string>("");
    const [uss,setuss] = useState<friendl>();
    const [frie,setfrie] = useState<friendl>();
    const [conli,setconli] = useState<urm[]>([]);
    const [button,setbutton] = useState<number>(0);
    useEffect(()=>{
        async function fetchConnection(){
            const response = await fetch('/api/fetchconnection',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id} as fetchconnctionreqdata)});
            if(response.status === 200){
                const data =await response.json();
                const out=data.data ;
                //console.log("outi",out[0]);
                //console.log(out);
                const conn: friendl[] = out;

                setConnection(conn);
            }
            else{
                setConnection([]);
            }
        }
        fetchConnection();
        
        
        //console.log("connectionsss ",connection);

    },[id,uss,button]);
    useEffect(() => {
        async function updatecount() {
            const response = await fetch('/api/unreadcount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id } as fetchconnctionreqdata),
            });
            if (response.status === 200) {
                const data = await response.json();
                const out = data.data as urm[];
                setconli(out); // Update unread count
            } else {
                setconli([]);
            }
        }
    
        updatecount(); // Initial update on component mount

    
        const messageupdateChannel = supabase.channel('custom-update-channel')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'message' },
                async (payload) => {
                    console.log('New message inserted!', payload);
                    await updatecount(); // Re-fetch unread count when a new message is inserted
                }
            )
            .subscribe();
        const messageinsertChannel = supabase.channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'message' },
                async (payload) => {
                    console.log('New message inserted!', payload);
                    await updatecount();
                }
            )
            .subscribe();
        
    
        return () => {
            supabase.removeChannel(messageupdateChannel); // Cleanup on unmount
            supabase.removeChannel(messageinsertChannel);
        };
    
    }, [id]); // Runs when `id` changes
    // useEffect(() => {
    //     async function updatecount() {
    //         const response = await fetch('/api/unreadcount', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ id } as fetchconnctionreqdata),
    //         });
    //         if (response.status === 200) {
    //             const data = await response.json();
    //             const out = data.data as urm[];
    //             setconli(out); // Update unread count
    //         } else {
    //             setconli([]);
    //         }
    //     }
    
    //     updatecount(); // Initial update on component mount
    
    //     const messageChannel = supabase.channel('custom-insert-channel')
    //         .on(
    //             'postgres_changes',
    //             { event: 'INSERT', schema: 'public', table: 'message' },
    //             async (payload) => {
    //                 console.log('New message inserted!', payload);
    //                 await updatecount(); // Re-fetch unread count when a new message is inserted
    //             }
    //         )
    //         .subscribe();
        
    
    //     return () => {
    //         supabase.removeChannel(messageChannel); // Cleanup on unmount
    //     };
    
    // }, [id]);
    
    
    
    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        try{
            const res = await fetch('/api/connection',{method:'POST',headers:{'Content-Type': 'application/json',},body:JSON.stringify({user_id:id,friend_username:fn} as connectioninputdata)});
            const data = await res.json();
            if (res.status===200){
                setuss(data.data as userout);
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
            Username of your friend
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
        <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 mt-4 transition duration-200"
            onClick={()=>{setbutton((button)=>button+1)}}
          >
            Refresh Connections
        </button>
  
        {/* Friends List */}
        <div>
            <div className="mt-6 w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Connected Users</h2>
            {connection?.length > 0 ? (
                <div className="space-y-3">
                {connection.map((element:friendl) => (
                    <div key={element.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg shadow-md">
                    <span className="text-gray-900 font-medium">{element.username}   {conli?.length
  ? conli.find((e: urm) => e && e.friend === element.id)?.URMC || "0"
  : "0"}


                    </span>
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
