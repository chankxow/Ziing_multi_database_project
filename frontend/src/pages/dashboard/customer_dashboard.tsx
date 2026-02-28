export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 border-r border-gray-800 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-500">AutoPerf</h1>
          <p className="text-xs text-gray-400">Customer Portal</p>
        </div>
        <nav className="space-y-2 text-sm">
          {["My Dashboard", "My Vehicles", "Build Status", "Invoices", "Appointments", "Messages", "Profile"].map(
            (item, i) => (
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
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">My Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Customer</span>
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold">C</div>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[ 
            { label: "My Vehicles", value: "2" },
            { label: "Active Builds", value: "1" },
            { label: "Total Spent", value: "$12,400" },
          ].map((card, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-6">
              <p className="text-sm text-gray-400">{card.label}</p>
              <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
            </div>
          ))}
        </section>

        {/* Vehicle & Status */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Build */}
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Current Build Status</h3>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-xl">
                <p className="font-medium">Toyota Supra MK5 – Turbo Upgrade</p>
                <p className="text-sm text-gray-400">Stage 2 • Estimated Finish: 5 days</p>
                <div className="mt-3 w-full bg-gray-700 h-2 rounded-full">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: "65%" }} />
                </div>
                <p className="text-xs text-gray-400 mt-2">Progress: 65%</p>
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Build Overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Status</span><span className="text-yellow-400">In Progress</span></div>
              <div className="flex justify-between"><span>Assigned Tuner</span><span>John Doe</span></div>
              <div className="flex justify-between"><span>Next Update</span><span>Tomorrow</span></div>
            </div>
          </div>
        </section>

        {/* History & Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Build History */}
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Build History</h3>
            <div className="space-y-3">
              {["Honda Civic FK8 – Track Setup", "Mazda MX-5 – Suspension Upgrade"].map((item, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded-xl">
                  <p className="font-medium">{item}</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-xl">Request Update</button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-xl">View Invoice</button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-xl">Book Appointment</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
