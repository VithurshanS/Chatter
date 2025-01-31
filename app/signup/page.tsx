'use client';

import React, { FormEvent, useState } from 'react';

const Form = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent form reload

    if (!username || !password) {
      console.error('Username and password are required');
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

      if (response.status !== 200) {
        throw new Error('Failed to register user');
      }

      const data = await response.json();
      console.log('User registered:', data);
    } catch (err) {
      console.error('Error registering user:', err);
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bgimg.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b from-blue-700 to-blue-400 px-11 py-6 rounded-2xl shadow-xl w-96"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">Sign Up</h2>

        <div className="mb-2 pt-5">
          <label className="block text-white mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded-lg bg-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-lg bg-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-lg mt-4 hover:bg-gray-800 hover:shadow-lg transition-all flex justify-center items-center"
        >
          <span className="mr-2">🔅</span> Sign Up
        </button>
      </form>
    </div>
  );
};

export default Form;
