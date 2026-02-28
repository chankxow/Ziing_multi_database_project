import { useEffect, useState } from "react";

export default function WorkOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/workorders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold text-red-500 mb-6">
        Work Orders
      </h1>

      <div className="bg-zinc-900 rounded-xl shadow-lg border border-zinc-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.WorkOrderID}
                className="border-t border-zinc-700 hover:bg-zinc-800 transition"
              >
                <td className="p-4">{order.WorkOrderID}</td>
                <td className="p-4">{order.Description}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.Status === "Completed"
                        ? "bg-green-600"
                        : order.Status === "In Progress"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {order.Status}
                  </span>
                </td>
                <td className="p-4">{order.TotalCost} ฿</td>
                <td className="p-4">
                  {new Date(order.CreatedDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}