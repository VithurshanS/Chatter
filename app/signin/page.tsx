'use client';

import React, { FormEvent, useState } from 'react';
import {useRouter} from 'next/navigation'
import { userinputdata } from '@/lib/type';
import Link from 'next/link';

const Form = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [status,setstatus] = useState('');
  const router = useRouter();

  async function handleSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent form reload

    if (!username || !password) {
      console.error('username and password are required');
      return;
    }

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password } as userinputdata),
      });

      if (response.status!=200) {
        console.log(response);
        throw new Error('Failed to register user');
      }

      const data = await response.json();
      console.log('User login attempt:');
      setstatus((data.success)?"login success":"login failed");
      router.push('/dashboard');
    } catch (err) {
      console.error('Error registering user:', err);
    }
  }

  return (
    <div
      className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/bgimg.jpg')" }} // Replace this with your actual image
    >
      <div className="mt-10 bg-gradient-to-b from-blue-700 to-blue-400 rounded-2xl p-10 sm:mx-auto sm:w-full sm:max-w-sm shadow-xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white">
              Username
            </label>
            <div className="mt-2">
              <input
                className="block w-full border-2 rounded-md bg-blue-200 px-3 py-2 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:outline-blue-500"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                className="block w-full border-2 rounded-md bg-blue-200 px-3 py-2 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:outline-blue-500"
                name="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className='flex flex-row'>
              <Link
                href="/signup"
                className="w-1/4 mr-3 bg-green-800 text-white p-3 rounded-lg mt-4 hover:bg-gray-800 hover:shadow-lg transition-all flex justify-center items-center"
              >
                Signup
              </Link>
              <button
                type="submit"
                className="w-3/4 bg-black text-white p-3 rounded-lg mt-4 hover:bg-gray-800 hover:shadow-lg transition-all flex justify-center items-center"
              >
                <span className="mr-2">🔅</span> SignIn
              </button>



          </div>
        </form>
      </div>

      <div className="text-center mt-4">
        <p className="text-white font-semibold">{status}</p>
      </div>
    </div>
  );
};

export default Form;
