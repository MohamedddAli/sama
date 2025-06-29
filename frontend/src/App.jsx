import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import AdminDashboard from "./pages/adminDashboard";
import Shop from "./pages/shop";
import ProductDetails from "./pages/productDetails";
import CategoryProducts from "./pages/categoryProducts";
import LandingPage from "./pages/landingPage";
import ContactUs from "./pages/contactUs";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<h1>About Page</h1>} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/category/:categoryId" element={<CategoryProducts />} />
    </Routes>
  );
};

export default App;
