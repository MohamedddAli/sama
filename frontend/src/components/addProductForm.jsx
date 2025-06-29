// components/AddProductForm.jsx
import { useState } from "react";
import axios from "axios";

const addProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/products", product);
      alert("✅ Product added!");
      setProduct({ name: "", price: "", image: "", category: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Name"
        value={product.name}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="image"
        placeholder="Image URL"
        value={product.image}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="category"
        placeholder="Category ID"
        value={product.category}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Add Product
      </button>
    </form>
  );
};

export default addProductForm;
