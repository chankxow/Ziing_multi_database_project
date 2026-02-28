import { useState } from "react";

interface Employee {
  id: number;
  name: string;
  position: string;
  salary: number;
}

interface Bill {
  id: number;
  customer: string;
  amount: number;
  status: "PAID" | "NOT PAID";
}

interface Equipment {
  id: number;
  name: string;
  stock: number;
  price: number;
}

export default function RacingAdminDashboard() {
  const [employees] = useState<Employee[]>([
    { id: 1, name: "Puriwat", position: "Admin", salary: 30000 },
    { id: 2, name: "Somchai", position: "Technician", salary: 22000 },
  ]);

  const [bills] = useState<Bill[]>([
    { id: 1, customer: "Bank", amount: 5000, status: "PAID" },
    { id: 2, customer: "Ken", amount: 3200, status: "NOT PAID" },
  ]);

  const [equipment] = useState<Equipment[]>([
    { id: 1, name: "Turbo Kit", stock: 3, price: 15000 },
    { id: 2, name: "Racing Tire", stock: 0, price: 8000 },
  ]);

  const totalRevenue = bills
    .filter((b) => b.status === "PAID")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-red-500 mb-8">
        ADMIN DASHBOARD
      </h1>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 p-6 rounded-xl">
          <p className="text-zinc-400">Employees</p>
          <p className="text-2xl font-bold">{employees.length}</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <p className="text-zinc-400">Total Revenue</p>
          <p className="text-2xl font-bold text-green-500">
            {totalRevenue} ฿
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <p className="text-zinc-400">Equipment Items</p>
          <p className="text-2xl font-bold">{equipment.length}</p>
        </div>
      </div>

      {/* Employees Table */}
      <h2 className="text-xl font-bold text-red-400 mb-4">Employees</h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full bg-zinc-900 rounded-xl">
          <thead className="bg-zinc-800 text-red-400">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-zinc-800">
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.position}</td>
                <td className="p-3">{emp.salary} ฿</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bills Table */}
      <h2 className="text-xl font-bold text-red-400 mb-4">Bills</h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full bg-zinc-900 rounded-xl">
          <thead className="bg-zinc-800 text-red-400">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="border-b border-zinc-800">
                <td className="p-3">{bill.customer}</td>
                <td className="p-3">{bill.amount} ฿</td>
                <td
                  className={`p-3 font-bold ${
                    bill.status === "PAID"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {bill.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Equipment Table */}
      <h2 className="text-xl font-bold text-red-400 mb-4">Equipment</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-zinc-900 rounded-xl">
          <thead className="bg-zinc-800 text-red-400">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id} className="border-b border-zinc-800">
                <td className="p-3">{item.name}</td>
                <td
                  className={`p-3 ${
                    item.stock > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.stock}
                </td>
                <td className="p-3">{item.price} ฿</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}