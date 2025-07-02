"use client";

import AdminLayout from "../../components/adminLayout";
import AddProductForm from "../../components/addProductForm";

const AddProduct = () => {
  return (
    <AdminLayout currentPage="add-product">
      <div className="min-w-screen mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">
            Create a new product for your store inventory.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <AddProductForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;
