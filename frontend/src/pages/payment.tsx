import { useState } from "react";

interface PaymentProps {
  username: string;
}

export default function RacingPayment({ username }: PaymentProps) {
  const [method, setMethod] = useState("PromptPay");
  const [status, setStatus] = useState<"NOT PAID" | "PAID">("NOT PAID");

  const handlePayment = () => {
    alert("ชำระเงินสำเร็จ 🚗💨");
    setStatus("PAID");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-96 space-y-6">
        
        <h1 className="text-2xl font-bold text-center text-red-500">
          PAYMENT
        </h1>

        <div className="text-center">
          <p className="text-zinc-400">Username</p>
          <p className="text-lg font-bold">{username}</p>
        </div>

        <div>
          <label className="block mb-2 text-zinc-400">
            Select Payment Method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-red-500"
          >
            <option>PromptPay</option>
            <option>Credit Card</option>
            <option>Bank Transfer</option>
          </select>
        </div>

        <div className="text-center">
          <p className="text-zinc-400">Status</p>
          <p
            className={`font-bold ${
              status === "PAID" ? "text-green-500" : "text-red-500"
            }`}
          >
            {status}
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={status === "PAID"}
          className={`w-full p-3 rounded-lg font-bold transition ${
            status === "PAID"
              ? "bg-green-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {status === "PAID" ? "PAID ✔" : "PAY NOW"}
        </button>
      </div>
    </div>
  );
}