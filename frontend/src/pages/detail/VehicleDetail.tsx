interface Vehicle {
  id: number;
  model: string;
  license: string;
  status: "PAID" | "NOT PAID";
}

interface Props {
  vehicle: Vehicle;
  onBack: () => void;
}

export default function VehicleDetail({ vehicle, onBack }: Props) {
  const serviceHistory = [
    { date: "01/02/2026", detail: "เปลี่ยนยางหน้า", cost: 3000 },
    { date: "15/01/2026", detail: "เปลี่ยนน้ำมันเครื่อง", cost: 1200 },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button
        onClick={onBack}
        className="mb-6 bg-red-600 px-4 py-2 rounded-lg"
      >
        ← BACK
      </button>

      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          {vehicle.model}
        </h1>

        <p className="mb-2">License: {vehicle.license}</p>

        <p className="mb-4">
          Payment Status:{" "}
          <span
            className={
              vehicle.status === "PAID"
                ? "text-green-500 font-bold"
                : "text-red-500 font-bold"
            }
          >
            {vehicle.status}
          </span>
        </p>

        <h2 className="text-xl font-bold text-red-400 mb-3">
          Service History
        </h2>

        <div className="space-y-3">
          {serviceHistory.map((service, index) => (
            <div
              key={index}
              className="bg-zinc-800 p-4 rounded-lg"
            >
              <p className="text-sm text-zinc-400">{service.date}</p>
              <p>{service.detail}</p>
              <p className="text-green-500 font-bold">
                {service.cost} ฿
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}