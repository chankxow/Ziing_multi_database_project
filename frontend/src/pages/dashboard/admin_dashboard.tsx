export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-500">AutoPerf</h1>
          <p className="text-xs text-gray-400">Performance Ecosystem</p>
        </div>
        <nav className="space-y-2 text-sm">
          {[
            "Dashboard",
            "Build Logs",
            "Parts & Inventory",
            "Bookings",
            "Clients",
            "Suppliers",
            "Logistics",
            "Analytics",
            "Messages",
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                i === 0
                  ? "bg-red-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <input
              placeholder="Search..."
              className="bg-gray-800 px-4 py-2 rounded-xl text-sm focus:outline-none"
            />
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold">
              U
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[ 
            { label: "Total Revenue", value: "$84,500", trend: "+2.8%" },
            { label: "Active Builds", value: "12", trend: "+1.2%" },
            { label: "Parts in Stock", value: "1,284", trend: "+3.4%" },
            { label: "Pending Orders", value: "7", trend: "-1.1%" },
          ].map((card, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-6">
              <p className="text-sm text-gray-400">{card.label}</p>
              <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
              <span className="text-xs text-green-400">{card.trend}</span>
            </div>
          ))}
        </section>

        {/* Charts + Status */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings */}
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Performance Revenue</h3>
              <select className="bg-gray-800 text-sm px-3 py-1 rounded-lg">
                <option>Last 8 Months</option>
              </select>
            </div>
            <div className="h-48 flex items-center justify-center text-gray-500">
              📈 Revenue Chart (API)
            </div>
          </div>

          {/* Status */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Build Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="text-green-400">58%</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress</span>
                <span className="text-yellow-400">24%</span>
              </div>
              <div className="flex justify-between">
                <span>Delayed</span>
                <span className="text-red-400">18%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Builds */}
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Recent Build Logs</h3>
            <div className="space-y-3">
              {["Nissan GTR R35 – 900HP", "Civic FK8 – Track Spec", "Supra MK5 – Turbo Upgrade"].map(
                (build, i) => (
                  <div key={i} className="bg-gray-800 p-4 rounded-xl">
                    <p className="font-medium">{build}</p>
                    <p className="text-xs text-gray-400">Updated recently</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Parts Category</h3>
            <div className="space-y-4 text-sm">
              {[ 
                { name: "Engine", pct: "30%" },
                { name: "Suspension", pct: "25%" },
                { name: "Electronics", pct: "20%" },
              ].map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span>{p.name}</span>
                    <span>{p.pct}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: p.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
