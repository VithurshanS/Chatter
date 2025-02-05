import { userout } from "@/model/auth";

export interface SingleMessage{
    sender:string;
    timestamp:Date;
    message:string;
}

export interface messageOutput{
    _id?:string;
    friends:string;
    chats:SingleMessage[];

}


export interface userinputdata {
    username:string;
    password:string;
};
export interface connectioninputdata{
    user_id:string;
    friend_username:string;
}

export interface modelstatus<T = unknown>{
    statuscode:number;
    data?: T;
    message:string;

}


export interface userli{
    _id:string;
    username:string;
    password:string;
}


export interface user{
    _id:string;
    username:string;
    password:string;
}

export interface connectionoutput{
    _id?:string;
    id:string;
    connection:string[];
}

export interface interconnectionoutput{
    _id?:string;
    id:string;
    connection:userout[];
}