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
          <th className="border p-2">Order ID</th>
          <th className="border p-2">User</th>
          <th className="border p-2">Total</th>
          <th className="border p-2">Status</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  );
};

export default ordersTable;
