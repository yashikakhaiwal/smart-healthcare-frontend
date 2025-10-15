import React, { useEffect, useState } from 'react';
import axios from 'axios';

function getToken() {
  return localStorage.getItem('token');
}

export default function Dashboard(){
  const [records, setRecords] = useState([]);
  const [metric, setMetric] = useState('');
  const [value, setValue] = useState('');

  async function fetchRecords(){
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:4000/api/health/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data || []);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location = '/login';
      }
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  async function addRecord(e){
    e.preventDefault();
    const token = getToken();
    if (!token) { alert('Login required'); window.location='/login'; return; }
    if (!metric || value === '') { alert('Enter metric and value'); return; }
    try {
      await axios.post('http://localhost:4000/api/health', {
        metric, value: parseFloat(value)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetric(''); setValue('');
      fetchRecords();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to add');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/login';
  }

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>Dashboard</h1>
        <div>
          <button onClick={logout} style={{marginLeft:10}}>Logout</button>
        </div>
      </div>

      <form onSubmit={addRecord} style={{marginBottom:20}}>
        <h3>Add health record</h3>
        <input placeholder="metric (e.g., heart_rate)" value={metric} onChange={e=>setMetric(e.target.value)} />
        <input placeholder="value (number)" value={value} onChange={e=>setValue(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <h3>Your Records</h3>
      <table border="1" cellPadding="6" style={{background:'white'}}>
        <thead><tr><th>Metric</th><th>Value</th><th>At</th></tr></thead>
        <tbody>
          {records.length === 0 && <tr><td colSpan="3">No records yet</td></tr>}
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.metric}</td>
              <td>{r.value}</td>
              <td>{new Date(r.recordedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
