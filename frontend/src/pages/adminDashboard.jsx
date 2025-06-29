import AddProductForm from "../components/addProductForm";
import AddCategoryForm from "../components/addCategoryForm";
import OrdersTable from "../components/ordersTable";

const adminDashboard = () => {
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-sky-800 mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* Add Category Section */}
        <section className="bg-sky-100 rounded-2xl shadow-md p-6 mb-10 border border-sky-200">
          <h2 className="text-xl font-semibold text-sky-800 mb-4">
            Add Category
          </h2>
          <AddCategoryForm />
        </section>

        {/* Add Product Section */}
        <section className="bg-sky-100 rounded-2xl shadow-md p-6 mb-10 border border-sky-200">
          <h2 className="text-xl font-semibold text-sky-800 mb-4">
            Add Product
          </h2>
          <AddProductForm />
        </section>

        {/* Orders Section */}
        <section className="bg-sky-100 rounded-2xl shadow-md p-6 border border-sky-200">
          <h2 className="text-xl font-semibold text-sky-800 mb-4">
            Recent Orders
          </h2>
          <OrdersTable />
        </section>
      </div>
    </div>
  );
};

export default adminDashboard;
