import mongoose from "mongoose";
import { useState,useEffect, FormEvent, useRef } from "react";
// messageoutput,message input,getmessageinput type,NRBody,
import { messageOutput, SingleMessage, user } from "@/model/auth";
import { sendtoM} from "../api/message/sendmessage/route";
import { reqtoM } from "../api/message/getmessage/route";


export  function Message({sender,reciever}:{sender:mongoose.Schema.Types.ObjectId,reciever:user}) {
    const [chat,setchat] = useState<string>("");
    const [messages,setmessages] = useState<SingleMessage[]>([]);
    const [button,setbutton] = useState<number>(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        async function fetchdata(){
            const ress = await fetch('/api/message/getmessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender,reciever:reciever._id} as reqtoM)});
            const body = await ress.json();
            const dat = body.data as messageOutput;
            const chatss = dat.chats;
            if(chatss === messages){
                return null;
            }
            setmessages(dat.chats);
            
        }
        fetchdata();

    },[sender,reciever,button]);

    async function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        const responce = await fetch('/api/message/sendmessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender,reciever:reciever._id,chat} as sendtoM)});
        const body = await responce.json();
        console.log(body);
        setbutton((button)=>button+1);
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
                element.sender === sender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-2 max-w-xs ${
                  element.sender === sender
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{element.message}</p>
                <p className="text-xs text-gray-300 mt-1">{new Date(element.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
            onClick={()=>{setbutton((button)=>button+1)}}
          >
            refresh
        </button>
      </div>
    )


    
}