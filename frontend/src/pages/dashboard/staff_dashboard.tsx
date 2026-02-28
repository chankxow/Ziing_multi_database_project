
export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 border-r border-gray-800 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-500">AutoPerf</h1>
          <p className="text-xs text-gray-400">Staff / Tuner Panel</p>
        </div>
        <nav className="space-y-2 text-sm">
          {["Work Dashboard", "Assigned Builds", "My Tasks", "Parts Request", "Schedule", "Messages", "Profile"].map(
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
          <h2 className="text-2xl font-semibold">Work Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Tuner</span>
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold">T</div>
          </div>
        </div>

        {/* Work Summary */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[ 
            { label: "Assigned Builds", value: "4" },
            { label: "Tasks Today", value: "6" },
            { label: "Delayed Jobs", value: "1" },
            { label: "Completed This Week", value: "9" },
          ].map((card, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-6">
              <p className="text-sm text-gray-400">{card.label}</p>
              <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
            </div>
          ))}
        </section>

        {/* Assigned Builds & Tasks */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builds */}
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Assigned Builds</h3>
            <div className="space-y-4">
              {["Supra MK5 – Turbo Install", "GTR R35 – ECU Tune", "Civic FK8 – Suspension Setup"].map(
                (build, i) => (
                  <div key={i} className="bg-gray-800 p-4 rounded-xl">
                    <div className="flex justify-between">
                      <p className="font-medium">{build}</p>
                      <span className="text-xs text-yellow-400">In Progress</span>
                    </div>
                    <div className="mt-3 w-full bg-gray-700 h-2 rounded-full">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "55%" }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Progress: 55%</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Today's Tasks</h3>
            <div className="space-y-3 text-sm">
              {["Install intercooler", "Dyno test", "Upload build photos", "Update ECU map"].map(
                (task, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-800 p-3 rounded-xl">
                    <input type="checkbox" className="accent-red-600" />
                    <span>{task}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parts Request */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Parts Request</h3>
            <p className="text-sm text-gray-400 mb-3">Need additional parts for your build?</p>
            <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-xl">Request Parts</button>
          </div>

          {/* Schedule */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Today's Schedule</h3>
            <ul className="text-sm space-y-2">
              <li>09:00 – Turbo Install</li>
              <li>13:00 – Dyno Session</li>
              <li>16:00 – ECU Tuning</li>
            </ul>
          </div>

          {/* Notes */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Notes</h3>
            <textarea
              className="w-full h-28 bg-gray-800 rounded-xl p-3 text-sm focus:outline-none"
              placeholder="Add work notes..."
            />
          </div>
        </section>
      </main>
    </div>
  );
}
