'use client';

import React, { useState } from 'react';
import {useRouter} from 'next/navigation'
import { userinputdata } from '@/model/auth';

const Form = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [status,setstatus] = useState('');
  const router = useRouter();

  async function handleSubmit(e:any) {
    e.preventDefault(); // Prevent form reload

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
      setstatus(JSON.stringify(data));
      router.push('/dashboard');
    } catch (err) {
      console.error('Error registering user:', err);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className='block m-9 border border-purple-700 p-6 bg-purple-600 content-stretch'>
        <div className='p-3'>
            <label htmlFor="name" className='p-2'>Email</label>
            <input className='border border-cyan-800 bg-yellow-200'
            type="text" 
            name="name"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            />
        </div>
        <div className='p-3'>
            <label htmlFor="age" className='p-2'>Password</label>
            <input
            type="password" className='border border-cyan-800 bg-yellow-200'
            name="age"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            />
        </div>
        
        
        
        <button type="submit">Login</button>
      </form>
      <div><p>{status}</p></div>
    </div>
  );
};

export default Form;
