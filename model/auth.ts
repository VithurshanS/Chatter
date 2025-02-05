import { modelstatus, userinputdata, connectioninputdata } from "@/lib/type";
import bcrypt from "bcryptjs";
import { Database, Tables } from "@/lib/supabase";
import { QueryData } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://gbqsxzehsptjfjqywkou.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicXN4emVoc3B0amZqcXl3a291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzY4ODcsImV4cCI6MjA1NDAxMjg4N30.my2zafchafD2nxyhkPsPAuvTa-giBbRKATf1Oj3rEJ0";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export { supabase };


async function registerUser(registerdata: userinputdata) {
  const { username } = registerdata;
  let { error } = await supabase
    .from("user")
    .select("id")
    .eq("username", username);
  if (error) {
    const ress: modelstatus = {
      statuscode: 400,
      data: "s",
      message: "username is already exists",
    };
    return ress;
  }
  const hashedPassword = await bcrypt.hash(registerdata.password, 10);
  registerdata.password = hashedPassword;
  const { data, error: inserterror } = await supabase
    .from("user")
    .insert([registerdata]);
  const resss: modelstatus = {
    statuscode: 200,
    data: "su",
    message: "user registered successfully",
  };
  return resss;
}

async function getUser(data: userinputdata) {
  const { username, password } = data;
  const userquery = supabase.from("user").select("*").eq("username", username);
  const { data: getser } = await userquery;
  if (getser === null) {
    const res: modelstatus = {
      statuscode: 400,
      data: "su",
      message: "can't find the user",
    };
    console.log("nullgoted");
    return res;
  }

  const auth = await bcrypt.compare(password, getser[0].password);

  if (auth) {
    const res: modelstatus = {
      statuscode: 200,
      data: getser[0],
      message: "fetched the user",
    };
    return res;
  }
  const res: modelstatus = {
    statuscode: 300,
    data: "su",
    message: "invalid credentials",
  };
  console.log("fucked");
  return res;
}

//----------------------------------------------------------------------------------------------------------------------------------------------
export type userout = Tables<"user">;
async function addConnection(data: connectioninputdata) {
  const { user_id, friend_username } = data;
  const { data: friend } = await supabase
    .from("user")
    .select("*")
    .eq("username", friend_username);
  if (friend === null) {
    console.log("nofriend");
    const res: modelstatus = {
      statuscode: 400,
      data: "su",
      message: "no such friend found",
    };
    return res;
  }
  const { data: resu } = await supabase
    .from("connection")
    .select("id")
    .match({ creator: user_id, friend: friend[0].id });
  if (resu != null && resu.length === 0) {
    const { data: d1, error: e1 } = await supabase.from("connection").insert([
      { creator: user_id, friend: friend[0].id },
      { creator: friend[0].id, friend: user_id },
    ]);
  }

  const ress: modelstatus = {
    statuscode: 200,
    data: friend[0],
    message: "connection added successfull",
  };
  return ress;
}
export type userType = Tables<"user">;

export interface modell {
  statuscode: number;
  data: userType;
  message: string;
}

async function getConnection(data: string) {
  const user_id = data;
  const { data: conns, error } = await supabase
    .from("connection")
    .select("user!connection_friend_fkey!id(*)")
    .eq("creator", user_id);
  if (error) {
    console.log("fuvckere", error);
  }
  const listu: userType[] = [];
  conns?.map((ele: any) => {
    listu.push(ele.user as userType);
  });
  const res: modelstatus = {
    statuscode: 200,
    data: listu,
    message: "connection got successfully",
  };
  return res;
}

export interface urm {
  friend: string | null;
  URMC: number;
}

export async function getsenderandcount(data: string) {
  const user_id = data;
  const { data: conns, error } = await supabase
    .from("connection")
    .select("friend,URMC")
    .eq("creator", user_id);
  if (error) {
    // console.log("------------------------------------------------------------------------------------------------------------");
  }
  const listu: urm[] = [];
  conns?.map((ele: any) => {
    listu.push(ele as urm);
  });
  //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",listu

  //);
  const res: modelstatus = {
    statuscode: 200,
    data: listu,
    message: "connection got successfully",
  };
  return res;
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------

async function addMessage(sender: string, reciever: string, chat: string) {
  const { data: con_id, error: err } = await supabase
    .from("connection")
    .select("id")
    .match({ creator: sender, friend: reciever });
  if (err) {
    console.log("error in insert message");
  }
  if (con_id != null) {
    const { data: sum, error: er } = await supabase
      .from("message")
      .insert([{ connection_id: con_id[0].id, message: chat }]);
    const res1: modelstatus = {
      statuscode: 200,
      data: "su",
      message: "successfully sent",
    };
    return res1;
  }

  const res: modelstatus = {
    statuscode: 200,
    data: "su",
    message: "cant find connection",
  };
  return res;

  //const updatedMessage = await message.findOneAndUpdate({friends:message_id},{$addToSet:{chats:chatobj}},{new:true,upsert:true}) as messageOutput;
}
export type messageout = Tables<"message">;
export interface MOUT {
  sender_connection_id: number;
  reciever_connection_id: number;
  messages: messageout[];
}
async function getMessage(sender: string, reciever: string) {
  const { data: sender_side } = await supabase
    .from("connection")
    .select("id")
    .match({ creator: sender, friend: reciever });
  const { data: reciever_side } = await supabase
    .from("connection")
    .select("id")
    .match({ creator: reciever, friend: sender });

  if (sender_side != null && reciever_side != null) {
    const { data: messages, error: msg_err } = await supabase
      .from("message")
      .select("*")
      .in("connection_id", [sender_side[0].id, reciever_side[0].id]);
    if (msg_err) {
      console.log("you fuckedup", msg_err);
    }
    console.log("current", messages);
    const mout: messageout[] = [];
    if (messages != null) {
      messages.map((ele) => {
        mout.push(ele);
      });
    }

    const result: MOUT = {
      sender_connection_id: sender_side[0].id,
      reciever_connection_id: reciever_side[0].id,
      messages: mout,
    };
    console.log("cur3", result);
    const res: modelstatus = {
      statuscode: 200,
      data: result,
      message: "got the chats",
    };
    return res;
  }

  // const message = mongoose.models.Message || mongoose.model('Message',messageSchema);

  const resi: modelstatus = {
    statuscode: 400,
    data: "su",
    message: "error when reciev message from db",
  };
  return resi;
}

async function readerrenderMessage(sender: string, reciever: string) {
  const { data: sender_side } = await supabase
    .from("connection")
    .select("id")
    .match({ creator: sender, friend: reciever });
  const { data: reciever_side } = await supabase
    .from("connection")
    .select("id")
    .match({ creator: reciever, friend: sender });

  if (sender_side != null && reciever_side != null) {
    const { data: messages, error: msg_err } = await supabase.rpc(
      "advfetcher",
      {
        _sender_connection: sender_side[0].id,
        _receiver_connection: reciever_side[0].id,
      }
    );
    if (msg_err) {
      console.log("you fuckedup", msg_err);
    }
    console.log(
      "current",
      "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    );
    const mout: messageout[] = [];
    if (messages != null) {
      messages.map((ele) => {
        mout.push(ele);
      });
    }

    const result: MOUT = {
      sender_connection_id: sender_side[0].id,
      reciever_connection_id: reciever_side[0].id,
      messages: mout,
    };
    console.log("cur3", result);
    const res: modelstatus = {
      statuscode: 200,
      data: result,
      message: "got the chats",
    };
    return res;
  }

  // const message = mongoose.models.Message || mongoose.model('Message',messageSchema);

  const resi: modelstatus = {
    statuscode: 400,
    data: "su",
    message: "error when reciev message from db",
  };
  return resi;
}

export {
  registerUser,
  getUser,
  addConnection,
  getConnection,
  addMessage,
  getMessage,
  readerrenderMessage,
};
