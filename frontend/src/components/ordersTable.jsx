// components/OrdersTable.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const ordersTable = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2 text-black">Order ID</th>
          <th className="border p-2 text-black">User</th>
          <th className="border p-2 text-black">Total</th>
          <th className="border p-2 text-black">Status</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  );
};

export default ordersTable;
