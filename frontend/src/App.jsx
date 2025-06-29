import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import AdminDashboard from "./pages/adminDashboard";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<h1>About Page</h1>} />
      <Route path="/contact" element={<h1>Contact Page</h1>} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
