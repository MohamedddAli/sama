"use client";

import AdminLayout from "../../components/adminLayout";
import AddCategoryForm from "../../components/addCategoryForm";

const AddCategory = () => {
  return (
    <AdminLayout currentPage="add-category">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Category
          </h1>
          <p className="text-gray-600">
            Create a new category to organize your products.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <AddCategoryForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddCategory;
