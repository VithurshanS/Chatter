'use client';

import React, { FormEvent, useState } from 'react';


const Form = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');

  async function handleSubmit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent form reload

    if (!username || !password) {
      console.error('email and password are required');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if(response.status!=200) {
        throw new Error('Failed to register user');
      }

      const data = await response.json();
      console.log('User registered:',data);
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
        
        
        
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Form;
