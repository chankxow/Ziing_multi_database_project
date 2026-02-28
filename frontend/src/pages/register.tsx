import { useState } from "react";

export default function RacingRegister() {
  const [form, setForm] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Password ไม่ตรงกัน");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.username,
        phone: form.phone,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("สมัครสมาชิกสำเร็จ");
      window.location.href = "/";
    } else {
      alert(data.detail || "Register failed");
    }
  } catch {
    alert("Server error");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center relative overflow-hidden">
      
      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-red-600 rounded-full blur-[180px] opacity-30 top-[-120px] left-[-120px]" />
      <div className="absolute w-[400px] h-[400px] bg-orange-500 rounded-full blur-[150px] opacity-20 bottom-[-100px] right-[-100px]" />

      <div className="relative z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl p-8">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-widest">
            KU <span className="text-red-500">ZLING</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Create your performance account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="racer123"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="08XXXXXXXX"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-transform duration-200"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <p className="text-center text-zinc-500 text-xs mt-6">
          Already have an account?
          <a href="/" className="text-red-500 hover:text-red-400 ml-1 font-semibold transition">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}