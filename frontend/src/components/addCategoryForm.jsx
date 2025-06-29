// components/addCategoryForm.jsx
import { useState } from "react";
import axios from "axios";

const addCategoryForm = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await axios.post("http://localhost:5000/category", { name });
      alert("✅ Category added");
      setName("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add category");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center">
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border text-black border-gray-300 rounded-md px-4 py-2 w-full"
      />
      <button
        type="submit"
        className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700"
      >
        Add
      </button>
    </form>
  );
};

export default addCategoryForm;
