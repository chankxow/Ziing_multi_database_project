import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-red-500">
          🚗 Car Custom Shop Dashboard
        </h1>
        <p className="text-zinc-400 mt-2">
          Performance Management System
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg hover:scale-105 transition">
          <h2 className="text-zinc-400">Total Work Orders</h2>
          <p className="text-3xl font-bold text-red-500 mt-2">128</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg hover:scale-105 transition">
          <h2 className="text-zinc-400">In Progress</h2>
          <p className="text-3xl font-bold text-yellow-500 mt-2">24</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg hover:scale-105 transition">
          <h2 className="text-zinc-400">Revenue This Month</h2>
          <p className="text-3xl font-bold text-green-500 mt-2">450,000 ฿</p>
        </div>

      </div>

      {/* Navigation Section */}
      <div>
        <h2 className="text-2xl font-bold text-red-500 mb-6">
          Management Sections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link to="/workorders">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg hover:bg-red-600 hover:text-black transition cursor-pointer">
              <h3 className="text-xl font-bold mb-2">📋 Work Orders</h3>
              <p>Manage repair & customization jobs</p>
            </div>
          </Link>

          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg opacity-50">
            <h3 className="text-xl font-bold mb-2">🧩 Parts Inventory</h3>
            <p>Coming Soon</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg opacity-50">
            <h3 className="text-xl font-bold mb-2">👤 Customers</h3>
            <p>Coming Soon</p>
          </div>

        </div>
      </div>
    </div>
  );
}