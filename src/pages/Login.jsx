import React, { useState } from 'react';
import axios from 'axios';

export default function Login(){
  const [email,setEmail]=useState('');
  const [pw,setPw]=useState('');
  async function submit(e){
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password: pw });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user || {}));
      window.location = '/';
    } catch (err) {
      alert(err?.response?.data?.error || 'Login failed');
    }
  }
  return (
    <form onSubmit={submit} className="card">
      <h2>Login</h2>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
      <button type="submit">Login</button>
      <p style={{fontSize:13}}>No account? <a href="/register">Register</a></p>
    </form>
  );
}
