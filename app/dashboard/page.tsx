'use client';


import { useEffect, useState } from 'react';
import { NextResponse } from 'next/server';
import { Connection } from '../../components/connection';

interface tokenuser {
  id:string;
  username:string;
}

const Dashboard = () => {
  const [user, setUser] = useState<tokenuser>();
  const [loading,setloading] = useState<boolean>(true);

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
      }finally{
        setloading(false);
      }
    }

    fetchUser();

  }, []);


  return (
    <div 
    className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center  text-white p-6"
    style={{ backgroundImage: "url('/bgimg.jpg')" }} // Replace this with your actual image
  >
    {loading ? (
      <p className="text-lg font-semibold animate-pulse">Loading...</p>
    ) : user ? (
      <div className="w-full max-w-md bg-white text-gray-900 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-blue-700">Welcome to Your Dashboard</h1>
        <div className="mt-6 space-y-4">
          <p className="text-lg font-medium">
            <span className="text-blue-600 font-semibold">User ID:</span> {String(user.id)}
          </p>
          <p className="text-lg font-medium">
            <span className="text-blue-600 font-semibold">Username:</span> {user.username}
          </p>
        </div>

        <div className="mt-6">
          <Connection id={user.id} />
        </div>
      </div>
    ) : (
      <p className="text-lg font-semibold">Unauthorized: No user data available.</p>
    )}
  </div>
  );
};

export default Dashboard;
