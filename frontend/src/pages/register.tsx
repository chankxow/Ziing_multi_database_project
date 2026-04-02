import { useState, type ChangeEvent, type FormEvent } from "react";
import API_BASE_URL from "../config/api";

export default function RacingRegister() {
  const [form, setForm] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password ไม่ตรงกัน");
      return;
    }

    if (!/^0[0-9]{9}$/.test(form.phone)) {
      alert("กรุณากรอกเบอร์โทรให้ถูกต้อง");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/register/customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username:  form.username,
          password:  form.password,
          firstName: form.username,
          lastName:  "User",
          phone:     form.phone,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน");
        window.location.href = "/";
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-red-600 rounded-full blur-[180px] opacity-30 top-[-120px] left-[-120px]" />
      <div className="absolute w-[400px] h-[400px] bg-orange-500 rounded-full blur-[150px] opacity-20 bottom-[-100px] right-[-100px]" />

      {/* Road strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-800/60 border-t border-zinc-700/50">
        <div className="absolute top-1/2 left-0 right-0 flex gap-8 overflow-hidden" style={{ transform: 'translateY(-50%)' }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="h-1 w-12 bg-yellow-400/60 flex-shrink-0 rounded"
              style={{
                animation: `roadDash 1.2s linear infinite`,
                animationDelay: `${-i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Funny Motorcycle 1 - wheelie pose */}
      <div
        className="absolute bottom-8 z-0"
        style={{ animation: 'rideAcross 7s linear infinite', animationDelay: '-2s' }}
      >
        <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rear wheel on ground, front wheel up (wheelie!) */}
          <circle cx="35" cy="72" r="20" stroke="#555" strokeWidth="4" fill="#222" />
          <circle cx="35" cy="72" r="8" fill="#444" />
          {[0,45,90,135].map((angle, i) => (
            <line key={i}
              x1={35 + 8 * Math.cos(angle * Math.PI / 180)}
              y1={72 + 8 * Math.sin(angle * Math.PI / 180)}
              x2={35 + 20 * Math.cos(angle * Math.PI / 180)}
              y2={72 + 20 * Math.sin(angle * Math.PI / 180)}
              stroke="#666" strokeWidth="2" />
          ))}

          {/* Front wheel - UP in the air (wheelie) */}
          <circle cx="120" cy="25" r="16" stroke="#555" strokeWidth="4" fill="#222" />
          <circle cx="120" cy="25" r="6" fill="#444" />

          {/* Bike body - angled up for wheelie */}
          <polygon points="50,68 55,40 100,20 118,22 118,35 90,50 55,68" fill="#8e44ad" />
          <polygon points="55,40 70,15 100,12 100,20" fill="#9b59b6" />

          {/* Fork angled */}
          <line x1="100" y1="20" x2="112" y2="12" stroke="#aaa" strokeWidth="3" />
          <line x1="112" y1="12" x2="122" y2="15" stroke="#aaa" strokeWidth="4" strokeLinecap="round" />
          <line x1="118" y1="22" x2="120" y2="25" stroke="#aaa" strokeWidth="3" />

          {/* Rider - arms up celebrating */}
          <ellipse cx="80" cy="32" rx="12" ry="9" fill="#e67e22" transform="rotate(-40 80 32)" />
          {/* Helmet */}
          <circle cx="72" cy="20" r="13" fill="#e74c3c" />
          <circle cx="72" cy="20" r="11" fill="#c0392b" />
          {/* Visor */}
          <path d="M62 19 Q72 14 82 19" stroke="#ffe082" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Big surprised eyes */}
          <circle cx="67" cy="21" r="3.5" fill="#ffe082" />
          <circle cx="77" cy="21" r="3.5" fill="#ffe082" />
          <circle cx="67" cy="21" r="2" fill="#111" />
          <circle cx="77" cy="21" r="2" fill="#111" />
          {/* Star eyes sparkles */}
          <text x="63" y="17" fontSize="6" fill="yellow">✦</text>
          <text x="74" y="17" fontSize="6" fill="yellow">✦</text>
          {/* Arms up in the air */}
          <line x1="74" y1="27" x2="60" y2="12" stroke="#34495e" strokeWidth="4" strokeLinecap="round" />
          <line x1="78" y1="26" x2="92" y2="12" stroke="#34495e" strokeWidth="4" strokeLinecap="round" />
          {/* Hands waving */}
          <circle cx="60" cy="11" r="4" fill="#f39c12" />
          <circle cx="92" cy="11" r="4" fill="#f39c12" />
          {/* Legs */}
          <line x1="80" y1="38" x2="65" y2="60" stroke="#34495e" strokeWidth="5" strokeLinecap="round" />
          <line x1="65" y1="60" x2="52" y2="65" stroke="#34495e" strokeWidth="5" strokeLinecap="round" />

          {/* Exhaust fire from rear */}
          <ellipse cx="18" cy="72" rx="10" ry="5" fill="#e74c3c" opacity="0.8" style={{ animation: 'flamePulse 0.3s ease-in-out infinite alternate' }} />
          <ellipse cx="10" cy="72" rx="7" ry="4" fill="#f39c12" opacity="0.6" style={{ animation: 'flamePulse 0.3s ease-in-out infinite alternate', animationDelay: '0.1s' }} />
          <ellipse cx="4" cy="72" rx="4" ry="3" fill="#ffe082" opacity="0.4" style={{ animation: 'flamePulse 0.3s ease-in-out infinite alternate', animationDelay: '0.15s' }} />

          {/* Speed lines */}
          <line x1="-5" y1="50" x2="18" y2="50" stroke="white" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
          <line x1="-12" y1="60" x2="10" y2="60" stroke="white" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
          <line x1="-6" y1="70" x2="15" y2="70" stroke="white" strokeWidth="1" opacity="0.2" strokeLinecap="round" />

          {/* Exclamation marks flying */}
          <text x="130" y="15" fontSize="14" fill="#ffe082" fontWeight="bold" style={{ animation: 'floatUp 1s ease-in-out infinite alternate' }}>!</text>
          <text x="142" y="20" fontSize="10" fill="#e74c3c" fontWeight="bold" style={{ animation: 'floatUp 1s ease-in-out infinite alternate', animationDelay: '0.3s' }}>!</text>
        </svg>
      </div>

      {/* Motorcycle 2 - tiny one going opposite direction */}
      <div
        className="absolute bottom-8 z-0"
        style={{ animation: 'rideAcrossReverse 10s linear infinite', animationDelay: '-5s' }}
      >
        <svg width="90" height="65" viewBox="0 0 90 65" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <circle cx="18" cy="48" r="14" stroke="#666" strokeWidth="3" fill="#222" />
          <circle cx="18" cy="48" r="6" fill="#444" />
          <circle cx="72" cy="48" r="14" stroke="#666" strokeWidth="3" fill="#222" />
          <circle cx="72" cy="48" r="6" fill="#444" />
          <polygon points="28,45 32,24 58,18 74,28 74,45" fill="#16a085" />
          <polygon points="32,24 42,10 60,8 58,18" fill="#1abc9c" />
          {/* Tiny rider */}
          <circle cx="50" cy="8" r="9" fill="#e67e22" />
          <ellipse cx="42" cy="16" rx="9" ry="7" fill="#e74c3c" transform="rotate(-25 42 16)" />
          {/* Tiny silly face */}
          <circle cx="47" cy="7" r="2" fill="#ffe082" />
          <circle cx="54" cy="7" r="2" fill="#ffe082" />
          <circle cx="47" cy="7" r="1" fill="#222" />
          <circle cx="54" cy="7" r="1" fill="#222" />
          <path d="M48 11 Q51 13 54 11" stroke="#222" strokeWidth="1.5" fill="none" />
          {/* Helmet spike */}
          <line x1="51" y1="0" x2="51" y2="-6" stroke="#ffe082" strokeWidth="2" strokeLinecap="round" />
          <circle cx="51" cy="-7" r="2" fill="#ffe082" />
          {/* Mini speed lines */}
          <line x1="-4" y1="35" x2="8" y2="35" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
          <line x1="-8" y1="44" x2="6" y2="44" stroke="white" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
        </svg>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes rideAcross {
          0%   { left: -200px; }
          100% { left: 110%; }
        }
        @keyframes rideAcrossReverse {
          0%   { right: -150px; left: auto; }
          100% { right: 110%; left: auto; }
        }
        @keyframes roadDash {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-80px); }
        }
        @keyframes flamePulse {
          0%   { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(1.4) scaleY(1.2); }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-widest">
            KU <span className="text-red-500">ZLING</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-2">Create your performance account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Username</label>
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
            <label className="block text-sm text-zinc-400 mb-1">Phone Number</label>
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
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
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
            <label className="block text-sm text-zinc-400 mb-1">Confirm Password</label>
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
