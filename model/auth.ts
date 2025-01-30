import connectDatabase from "@/lib/database";
import bcrypt from 'bcryptjs';

import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
});

export interface SingleMessage{
    sender:mongoose.Schema.Types.ObjectId;
    timestamp:Date;
    message:string;
}

export interface messageOutput{
    _id?:mongoose.Schema.Types.ObjectId;
    friends:string;
    chats:SingleMessage[];

}

const connectionSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    connection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const messageSchema = new mongoose.Schema({
    friends:{type: String, required: true},
    chats:[{
        sender:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        timestamp:{type:Date,default:Date.now},
        message:{type:String,required:true},
    }]
})

function keyCombiner(key1:mongoose.Schema.Types.ObjectId,key2:mongoose.Schema.Types.ObjectId){
    const combinedstring = [key1,key2].sort();
    return combinedstring.join('_');
}
async function addMessage(sender:mongoose.Schema.Types.ObjectId,reciever:mongoose.Schema.Types.ObjectId,chat:string) {
    const message_id = keyCombiner(sender,reciever);
    connectDatabase();
    const message = mongoose.models.Message || mongoose.model('Message',messageSchema);
    const messageHistory = await message.findOne({friends:message_id}) as messageOutput;
    if (messageHistory===null){
        const res:modelstatus={statuscode:400,data:null,message:"connection doesnt exists"};
        return res;
    }
    const chatobj ={sender,timestamp:new Date(),message:chat} as SingleMessage
    const updatedMessage = await message.findOneAndUpdate({friends:message_id},{$addToSet:{chats:chatobj}},{new:true,upsert:true}) as messageOutput;

    const res:modelstatus = {statuscode:200,data:updatedMessage,message:"successfully sent"};
    return res;
}
async function getMessage(sender:mongoose.Schema.Types.ObjectId,reciever:mongoose.Schema.Types.ObjectId){
    connectDatabase();
    const message_id = keyCombiner(sender,reciever);
    const message = mongoose.models.Message || mongoose.model('Message',messageSchema);
    const messageHistory = await message.findOne({friends:message_id}) as messageOutput;
    if (messageHistory===null){
        const res:modelstatus={statuscode:400,data:null,message:"connection doesnt exists"};
        return res;
    }
    const res:modelstatus = {statuscode:200,data:messageHistory,message:"got the chats"}
    return res;

}

export interface userinputdata {
    username:string;
    password:string;
};
export interface connectioninputdata{
    user_id:mongoose.Schema.Types.ObjectId;
    friend_username:string;
}

export interface modelstatus{
    statuscode:number;
    data:any;
    message:string;

}


export interface userli{
    _id:mongoose.Schema.Types.ObjectId;
    username:string;
    password:string;
}


export interface user{
    _id:mongoose.Schema.Types.ObjectId;
    username:string;
    password:string;
}

export interface connectionoutput{
    _id?:mongoose.Schema.Types.ObjectId;
    id:mongoose.Schema.Types.ObjectId;
    connection:mongoose.Schema.Types.ObjectId[];
}

export interface interconnectionoutput{
    _id?:mongoose.Schema.Types.ObjectId;
    id:mongoose.Schema.Types.ObjectId;
    connection:user[];
}

async function registerUser(registerdata:userinputdata){
    await connectDatabase();
    const {username} = registerdata;
    const user = mongoose.models.User || mongoose.model('User', userSchema);
    const getuser =await user.findOne({'username':username}) as user;
    if(getuser != null){
        const ress:modelstatus = {statuscode:400,data:null,message:"username is already exists"};
        return ress;
    }
    const hashedPassword = await bcrypt.hash(registerdata.password,10);
    registerdata.password = hashedPassword;
    const newUser = new user(registerdata);
    const saveduser:user = await newUser.save();
    const connection  = mongoose.models.Connection || mongoose.model('Connection', connectionSchema);
    const newConnection = new connection({'id':saveduser._id,'connection':[]});
    await newConnection.save();
    const resss:modelstatus = {statuscode:200,data:null,message:"user registered successfully"}
    return resss;


}

async function getUser(data:userinputdata){
    await connectDatabase();
    const {username,password} = data;
    const user =mongoose.models.User || mongoose.model('User', userSchema);
    const getser:user|null =await user.findOne({'username':username});
    if(getser===null){
        const res:modelstatus = {statuscode:400,data:null,message:"can't find the user"};
        console.log("nullgoted");
        return res;
    }
    const auth = await bcrypt.compare(password,getser.password);

    if(auth){
        const res:modelstatus = {statuscode:200,data:getser,message:"fetched the user"};
        return res;
    }
    const res:modelstatus = {statuscode:300,data:null,message:"invalid credentials"};
    console.log("fucked");
    return res;
    

}

async function addConnection(data:connectioninputdata){
    await connectDatabase();
    const {user_id,friend_username} = data;
    const user = mongoose.models.User || mongoose.model('User', userSchema);
    const friend:user|null = await user.findOne({'username':friend_username});
    if(friend === null){
        console.log("nofriend");
        const res:modelstatus = {statuscode:400,data:null,message:"no such friend found"};
        return res;
    }
    const conn = mongoose.models.Connection || mongoose.model('Connection', connectionSchema);
    await conn.findOneAndUpdate({'id':user_id},{$addToSet:{connection:friend._id}},{new:true,upsert:true});
    await conn.findOneAndUpdate({'id':friend._id},{$addToSet:{connection:user_id}},{new:true,upsert:true});
    const message = mongoose.models.Message || mongoose.model('Message',messageSchema);
    const newmessage =await  message.findOne({'friends':keyCombiner(user_id,friend._id)}) ||await new message({'friends':keyCombiner(user_id,friend._id),'chats':[]}).save();
    const ress:modelstatus = {statuscode:200,data:friend as user,message:"connection added successfull"};
    return ress;
}

async function getConnection(data:mongoose.Schema.Types.ObjectId){
    await connectDatabase();
    const user_id = data;
    //const user = mongoose.models.User || mongoose.model('User', userSchema);
    //const friend = await user.findOne({'email':connect_mail});
    //if(friend === null){
    //    return 0;
    //}
    const conn = mongoose.models.Connection || mongoose.model('Connection', connectionSchema);
    const ee:interconnectionoutput = await conn.findOne({'id':user_id},{connection:1,_id:0}).populate('connection');
    const res:modelstatus = {statuscode:200,data:ee,message:"connection got successfully"};
    return res;
}

export {registerUser,getUser,addConnection,getConnection,addMessage,getMessage};