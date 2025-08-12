import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const SERVER_URL = 'https://restaurant-backend-production-4e8c.up.railway.app';

function AdminDashboard() {
  const [token, setToken] = useState('');
  const [orders, setOrders] = useState([]);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Connect socket once logged in
  useEffect(() => {
    if (!token) return;

    const newSocket = io(SERVER_URL, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('newOrder', order => {
      alert(`New order from Table ${order.tableNumber}`);
      setOrders(prev => [order, ...prev]);
    });

    newSocket.on('orderUpdated', updatedOrder => {
      setOrders(prev => prev.map(o => (o._id === updatedOrder._id ? updatedOrder : o)));
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token]);

  // Fetch orders after login
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios.get(`${SERVER_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(() => setError('Failed to load orders'))
    .finally(() => setLoading(false));
  }, [token]);

  // Handle login form submit
  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, loginData);
      setToken(res.data.token);
    } catch (err) {
      setError('Login failed');
    }
  };

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(`${SERVER_URL}/api/orders/${orderId}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } });
      // Update locally (socket also updates)
      setOrders(prev => prev.map(o => (o._id === orderId ? res.data : o)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (!token) {
    // Login form
    return (
      <div style={{ maxWidth: 300, margin: 'auto', marginTop: 50 }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={e => setLoginData({...loginData, username: e.target.value})}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={e => setLoginData({...loginData, password: e.target.value})}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
          <button type="submit" style={{ width: '100%' }}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  // Logged in: show orders dashboard
  return (
    <div style={{ maxWidth: 800, margin: 'auto', marginTop: 20 }}>
      <h2>Orders Dashboard</h2>
      {loading && <p>Loading orders...</p>}
      {!loading && orders.length === 0 && <p>No orders yet</p>}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Table</th>
            <th>Items</th>
            <th>Total (Rs.)</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.tableNumber}</td>
              <td>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>{item.name} x {item.quantity} {item.notes && `(Notes: ${item.notes})`}</li>
                  ))}
                </ul>
              </td>
              <td>{order.total}</td>
              <td>{order.status}</td>
              <td>
                {['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'].map(statusOption => (
                  <button
                    key={statusOption}
                    disabled={statusOption === order.status}
                    onClick={() => updateStatus(order._id, statusOption)}
                    style={{ marginRight: 4 }}
                  >
                    {statusOption}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setToken('')} style={{ marginTop: 20 }}>Logout</button>
    </div>
  );
}

export default AdminDashboard;
