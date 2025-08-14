import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerOrder from './pages/userDashboard';
import AdminDashboard from './pages/adminDashboard';

function App() {
  return (
    <Router>
      <div style={{ padding: 20 }}>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/resturant-frontend" style={{ marginRight: 10 }}>Customer Order</Link>
          <Link to="/resturant-frontend/admin">Admin Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/resturant-frontend" element={<CustomerOrder />} />
          <Route path="/resturant-frontend/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
