// components/addProductForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const addProductForm = () => {
  const [product, setProduct] = useState({
    productId: "",
    name: "",
    price: "",
    discount: 0,
    description: "",
    image: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/category");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/product", product);
      alert("✅ Product added!");
      setProduct({
        productId: "",
        name: "",
        price: "",
        discount: 0,
        description: "",
        image: "",
        category: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <input
        name="productId"
        placeholder="Product ID"
        value={product.productId}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="name"
        placeholder="Name"
        value={product.name}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        className="border p-2 w-full"
        required
        min={0}
      />
      <input
        name="discount"
        type="number"
        placeholder="Discount (%)"
        value={product.discount}
        onChange={handleChange}
        className="border p-2 w-full"
        min={0}
        max={100}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="image"
        placeholder="Image URL"
        value={product.image}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <select
        name="category"
        value={product.category}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-sky-700 text-white px-4 py-2 rounded-md hover:bg-sky-800"
      >
        Add Product
      </button>
    </form>
  );
};

export default addProductForm;
