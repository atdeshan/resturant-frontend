import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerOrder from './pages/userDashboard';
import AdminDashboard from './pages/adminDashboard';

function App() {
  return (
    <div>
  <Router>
    <div className="nav-container">
      <nav className="navbar">
        <Link to="/resturant-frontend" className="nav-link">Customer Order</Link>
        <Link to="/resturant-frontend/admin" className="nav-link">Admin Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/resturant-frontend" element={<CustomerOrder />} />
        <Route path="/resturant-frontend/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  </Router>
</div>

    
  );
}

export default App;
