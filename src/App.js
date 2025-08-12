import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerOrder from './pages/userDashboard';
import AdminDashboard from './pages/adminDashboard';

function App() {
  return (
    <Router>
      <div style={{ padding: 20 }}>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/" style={{ marginRight: 10 }}>Customer Order</Link>
          <Link to="/admin">Admin Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/" element={<CustomerOrder />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
