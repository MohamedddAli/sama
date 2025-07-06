import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/adminDashboard";
import Shop from "./pages/shop";
import ProductDetails from "./pages/productDetails";
import CategoryProducts from "./pages/categoryProducts";
import LandingPage from "./pages/landingPage";
import ContactUs from "./pages/contactUs";
import AddProduct from "./pages/admin/addProduct";
import AddCategory from "./pages/admin/addCategory";
import ViewProducts from "./pages/admin/viewProducts";
import ManageCategories from "./pages/admin/manageCategories";
import Categories from "./pages/categories";
import ManageMessages from "./pages/admin/manageMessages";
import ViewCart from "./pages/viewCart";
import Checkout from "./pages/checkout";
import ViewOrders from "./pages/admin/viewOrders";
import ViewOrderDetails from "./pages/admin/viewOrderDetails";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<h1>About Page</h1>} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/add-product" element={<AddProduct />} />
      <Route path="/admin/view-products" element={<ViewProducts />} />
      <Route path="/admin/manage-categories" element={<ManageCategories />} />
      <Route path="/admin/manage-messages" element={<ManageMessages />} />
      <Route path="/admin/view-orders" element={<ViewOrders />} />
      <Route path="/admin/view-orders/:id" element={<ViewOrderDetails />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:categoryId" element={<CategoryProducts />} />
      <Route path="view-cart" element={<ViewCart />} />
      <Route path="checkout" element={<Checkout />} />
    </Routes>
  );
};

export default App;
