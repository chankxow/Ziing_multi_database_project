import { useState } from "react";
import VehicleDetail from "./detailed/VehicleDetail";

interface Vehicle {
  id: number;
  model: string;
  license: string;
  status: "PAID" | "NOT PAID";
}

export default function CustomerDashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const vehicles: Vehicle[] = [
    { id: 1, model: "Yamaha R3", license: "CPE 6738", status: "PAID" },
    { id: 2, model: "Kawasaki Ninja 400", license: "KU 9999", status: "NOT PAID" },
  ];

  if (selectedVehicle) {
    return (
      <VehicleDetail
        vehicle={selectedVehicle}
        onBack={() => setSelectedVehicle(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-red-500 mb-8">
        MY VEHICLES
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {vehicles.map((car) => (
          <div
            key={car.id}
            onClick={() => setSelectedVehicle(car)}
            className="bg-zinc-900 p-6 rounded-xl cursor-pointer hover:border hover:border-red-500 transition"
          >
            <h2 className="text-xl font-bold text-red-400">
              {car.model}
            </h2>
            <p className="text-zinc-400">{car.license}</p>
          </div>
        ))}
      </div>
    </div>
  );
}