import React, { useState } from 'react';
import axios from 'axios';

export default function Register(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [pw,setPw] = useState('');

  async function submit(e){
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/auth/register', {
        name, email, password: pw
      });
      alert('Registered. Now log in.');
      window.location = '/login';
    } catch (err) {
      alert(err?.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <h2>Register</h2>
      <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
      <button type="submit">Register</button>
      <p style={{fontSize:13}}>Already have an account? <a href="/login">Login</a></p>
    </form>
  );
}
