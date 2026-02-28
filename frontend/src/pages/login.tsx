import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ เก็บ user หรือ token (ถ้ามี) ไว้
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // 🚀 ไปหน้า Dashboard
        navigate("/dashboard"); // ถ้า Dashboard คือ path "/"
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-red-600 rounded-full blur-[180px] opacity-30 top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-orange-500 rounded-full blur-[150px] opacity-20 bottom-[-100px] right-[-100px]" />

      <div className="relative z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-widest">
            SPEED<span className="text-red-500">GARAGE</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Performance Tuning & Racing Parts
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="racing_driver01"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-transform duration-200"
          >
            START ENGINE
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-zinc-400">
          No account?{" "}
          <Link
            to="/register"
            className="text-red-500 hover:text-red-400 transition font-semibold"
          >
            Create Garage ID
          </Link>
        </div>
      </div>
    </div>
  );
}