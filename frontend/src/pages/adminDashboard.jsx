// pages/AdminDashboard.jsx
import AddProductForm from "../components/addProductForm";
import OrdersTable from "../components/ordersTable";

const adminDashboard = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Product</h2>
        <AddProductForm />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        <OrdersTable />
      </section>
    </div>
  );
};

export default adminDashboard;
