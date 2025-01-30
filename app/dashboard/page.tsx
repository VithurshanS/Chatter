'use client';


import { useEffect, useState } from 'react';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Connection } from '../connections/connection';

interface tokenuser {
  id:mongoose.Schema.Types.ObjectId;
  username:string;
}

const Dashboard = () => {
  const [user, setUser] = useState<tokenuser>();

  useEffect(() => {
    async function fetchUser() {
      try {
        console.log("hii");
        const response = await fetch('/api/auth/signin', { method: 'GET' }) as NextResponse;
        {console.log("jg",response.status);}

        if (response.status!=200) {
          
          throw new Error('Unauthorized: Unable to fetch user details');
        }
        console.log("dededewdewd");
        const data = await response.json();
        console.log("eferef",data.data.id);
        setUser(data.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchUser();

  }, []);


  return (
    <div>
      {user ? (
        <div>

          <h1>Welcome, User Dashboard</h1>
          <p>User ID: {String(user.id)}</p>
          <p>Email: {user.username}</p>
          <Connection id={user.id}/>*
          
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
