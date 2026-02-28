import { useState } from "react";

interface Vehicle {
  vid: number;
  model: string;
  license: string;
  status: "PAID" | "NOT PAID";
}

interface DashboardProps {
  username: string;
}

export default function RacingDashboard({ username }: DashboardProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      vid: 101,
      model: "Yamaha R3",
      license: "CPE 6738",
      status: "PAID",
    },
    {
      vid: 102,
      model: "Kawasaki Ninja 400",
      license: "KU 9999",
      status: "NOT PAID",
    },
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-500">
          KU ZLING DASHBOARD
        </h1>
        <div className="text-right">
          <p className="text-zinc-400 text-sm">Welcome</p>
          <p className="font-bold text-lg">{username}</p>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {vehicles.map((car) => (
          <div
            key={car.vid}
            className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800"
          >
            <h2 className="text-xl font-bold text-red-400 mb-2">
              {car.model}
            </h2>

            <p className="text-zinc-400">License: {car.license}</p>

            <div className="mt-4">
              <p className="text-sm text-zinc-400">Payment Status</p>
              <p
                className={`font-bold ${
                  car.status === "PAID"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {car.status}
              </p>
            </div>

            {car.status === "NOT PAID" && (
              <button className="mt-4 w-full bg-red-600 hover:bg-red-700 transition p-2 rounded-lg font-bold">
                PAY NOW
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}