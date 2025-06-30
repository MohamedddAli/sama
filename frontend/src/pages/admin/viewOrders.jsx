"use client";

import AdminLayout from "../../components/adminLayout";
import OrdersTable from "../../components/ordersTable";

const viewOrders = () => {
  return (
    <AdminLayout currentPage="orders">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Orders Management
          </h1>
          <p className="text-gray-600">Track and manage all customer orders.</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <OrdersTable />
        </div>
      </div>
    </AdminLayout>
  );
};

export default viewOrders;
