
import { useState,useEffect, FormEvent, useRef } from "react";
import { sendtoM} from "../app/api/message/sendmessage/route";
import { reqtoM } from "../app/api/message/getmessage/route";
import { userout } from "@/model/auth";
import { messageout,MOUT } from "@/model/auth";
import { supabase } from "@/model/auth";


export  function Message({sender,reciever}:{sender:string,reciever:userout}) {
    const [chat,setchat] = useState<string>("");
    const [messages,setmessages] = useState<messageout[]>([]);
    const [scid,setscid] = useState<number>();
    const [rcid,setrcid] = useState<number>();
    const [changer,setchanger] = useState<number>(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        async function fetchdata(){
            const ress = await fetch('/api/message/readerrender',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender,reciever:reciever.id} as reqtoM)});
            const body = await ress.json();
            const dat = body.data as MOUT;
            const chatss = dat.messages;
            if(chatss === messages){
                return null;
            }
            setmessages(chatss);
            setrcid(dat.reciever_connection_id);
            setscid(dat.sender_connection_id);

            
        }
        fetchdata();



    },[sender,reciever,changer]);
  
    useEffect(()=>{
        const channel = supabase
        .channel('message-listener')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'message' },
          (payload) => {
            const newMessages = Array.isArray(payload.new) ? payload.new : [payload.new];
            console.log("newmessages",newMessages);
            
            setmessages((prev) => [...prev, ...newMessages.filter((element) => element.connection_id === rcid || element.connection_id === scid)]);
          }
        )
        .subscribe();
    
      return () => {
        supabase.removeChannel(channel);
      };
    },[sender,reciever,messages])

    async function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        const responce = await fetch('/api/message/sendmessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender,reciever:reciever.id,chat} as sendtoM)});
        const body = await responce.json();
        console.log(body);
        //fetchdata();
        setchat("");

    }
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);
    
    return(
        <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-3xl font-bold text-black text-center mb-6">{reciever.username}</h3>
        {/* Chat Messages */}
        <div className="flex flex-col space-y-2 overflow-y-auto max-h-80 p-3 border-b border-gray-300">
          {messages.map((element, index) => (
            <div
              key={index}
              className={`flex ${
                element.connection_id === scid ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-2 max-w-xs ${
                  element.connection_id === rcid
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{element.message}</p>
                <p className="text-xs text-gray-300 mt-1">{new Date(element.created_at).toLocaleTimeString()}</p>
                
              </div>
              <div ref={messagesEndRef}/>
            </div>
          ))}
          
        </div>
  
        {/* Message Input */}
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <input
            name="inp"
            type="text"
            value={chat}
            onChange={(e) => setchat(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200"
          >
            Send
          </button>


        </form>
        <button
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200"
            onClick={()=>{setchanger((e)=>e+1)}}
          >
            Mark as Read
          </button>
      </div>
    )


    
}