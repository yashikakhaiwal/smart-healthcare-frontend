import React, { useState } from 'react';
import axios from 'axios';

// Read the backend URL from your .env file
const API_BASE = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password: pw,
      });

      // Save token + user info locally
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user || {}));

      alert('Login successful!');
      window.location = '/';
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <button type="submit">Login</button>
      <p style={{ fontSize: 13 }}>
        No account? <a href="/register">Register</a>
      </p>
    </form>
  );
}
