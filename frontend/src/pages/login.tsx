import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(username, password);
    if (success) {
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-red-600 rounded-full blur-[180px] opacity-30 top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-orange-500 rounded-full blur-[150px] opacity-20 bottom-[-100px] right-[-100px]" />

      {/* Road strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-800/60 border-t border-zinc-700/50">
        {/* Road dashes */}
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

      {/* Funny Motorcycle SVG - riding across screen */}
      <div
        className="absolute bottom-8 z-0"
        style={{ animation: 'rideAcross 6s linear infinite' }}
      >
        <svg width="160" height="90" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rear wheel */}
          <circle cx="30" cy="68" r="18" stroke="#555" strokeWidth="4" fill="#222" />
          <circle cx="30" cy="68" r="8" fill="#444" />
          {[0,45,90,135].map((angle, i) => (
            <line
              key={i}
              x1={30 + 8 * Math.cos(angle * Math.PI / 180)}
              y1={68 + 8 * Math.sin(angle * Math.PI / 180)}
              x2={30 + 18 * Math.cos(angle * Math.PI / 180)}
              y2={68 + 18 * Math.sin(angle * Math.PI / 180)}
              stroke="#666" strokeWidth="2"
            />
          ))}

          {/* Front wheel */}
          <circle cx="128" cy="68" r="18" stroke="#555" strokeWidth="4" fill="#222" />
          <circle cx="128" cy="68" r="8" fill="#444" />
          {[0,45,90,135].map((angle, i) => (
            <line
              key={i}
              x1={128 + 8 * Math.cos(angle * Math.PI / 180)}
              y1={68 + 8 * Math.sin(angle * Math.PI / 180)}
              x2={128 + 18 * Math.cos(angle * Math.PI / 180)}
              y2={68 + 18 * Math.sin(angle * Math.PI / 180)}
              stroke="#666" strokeWidth="2"
            />
          ))}

          {/* Bike body */}
          <polygon points="45,65 50,35 90,30 118,42 118,65" fill="#c0392b" />
          <polygon points="50,35 65,20 95,18 90,30" fill="#e74c3c" />

          {/* Exhaust pipe */}
          <rect x="20" y="58" width="30" height="5" rx="2" fill="#888" />
          {/* Exhaust smoke puffs */}
          <circle cx="10" cy="56" r="5" fill="white" opacity="0.5" style={{ animation: 'puff 0.6s ease-out infinite' }} />
          <circle cx="2" cy="50" r="4" fill="white" opacity="0.3" style={{ animation: 'puff 0.6s ease-out infinite', animationDelay: '0.2s' }} />

          {/* Handlebars */}
          <line x1="90" y1="30" x2="112" y2="25" stroke="#aaa" strokeWidth="3" strokeLinecap="round" />
          <line x1="112" y1="25" x2="115" y2="20" stroke="#aaa" strokeWidth="4" strokeLinecap="round" />

          {/* Fork */}
          <line x1="110" y1="42" x2="118" y2="55" stroke="#aaa" strokeWidth="3" />
          <line x1="115" y1="20" x2="125" y2="52" stroke="#aaa" strokeWidth="3" />

          {/* Rider body - leaning forward dramatically */}
          {/* Torso - super leaned */}
          <ellipse cx="78" cy="24" rx="14" ry="10" fill="#f39c12" transform="rotate(-30 78 24)" />
          {/* Helmet - big round funny */}
          <circle cx="90" cy="14" r="13" fill="#c0392b" />
          <circle cx="90" cy="14" r="11" fill="#e74c3c" />
          {/* Visor */}
          <path d="M80 13 Q90 8 100 13" stroke="#222" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Funny wide eyes on visor */}
          <circle cx="85" cy="15" r="3" fill="#ffe082" />
          <circle cx="95" cy="15" r="3" fill="#ffe082" />
          <circle cx="86" cy="15" r="1.5" fill="#222" />
          <circle cx="96" cy="15" r="1.5" fill="#222" />
          {/* Hair sticking out */}
          <line x1="82" y1="3" x2="80" y2="-3" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" />
          <line x1="88" y1="1" x2="87" y2="-5" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" />
          <line x1="94" y1="2" x2="95" y2="-4" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" />
          {/* Rider legs */}
          <line x1="70" y1="28" x2="60" y2="50" stroke="#34495e" strokeWidth="5" strokeLinecap="round" />
          <line x1="60" y1="50" x2="48" y2="55" stroke="#34495e" strokeWidth="5" strokeLinecap="round" />
          {/* Arms - reaching forward */}
          <line x1="82" y1="22" x2="105" y2="26" stroke="#34495e" strokeWidth="4" strokeLinecap="round" />
          {/* Speed lines */}
          <line x1="-10" y1="30" x2="10" y2="30" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
          <line x1="-15" y1="40" x2="8" y2="40" stroke="white" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          <line x1="-8" y1="50" x2="12" y2="50" stroke="white" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          {/* Headlight */}
          <ellipse cx="144" cy="55" rx="5" ry="4" fill="#ffe082" opacity="0.8" />
          <polygon points="144,51 160,45 160,65 144,59" fill="#ffe082" opacity="0.15" />
        </svg>
      </div>

      {/* Second bike going the other way (upside down funny one) */}
      <div
        className="absolute bottom-8 z-0"
        style={{ animation: 'rideAcrossReverse 9s linear infinite', animationDelay: '-4s' }}
      >
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
          <circle cx="20" cy="45" r="12" stroke="#666" strokeWidth="3" fill="#222" />
          <circle cx="20" cy="45" r="5" fill="#444" />
          <circle cx="80" cy="45" r="12" stroke="#666" strokeWidth="3" fill="#222" />
          <circle cx="80" cy="45" r="5" fill="#444" />
          <polygon points="28,42 32,22 62,20 76,30 76,42" fill="#27ae60" />
          <polygon points="32,22 42,12 65,10 62,20" fill="#2ecc71" />
          {/* Mini rider */}
          <circle cx="58" cy="10" r="8" fill="#e67e22" />
          <ellipse cx="48" cy="18" rx="8" ry="6" fill="#e67e22" transform="rotate(-20 48 18)" />
          {/* Tiny funny face */}
          <circle cx="55" cy="9" r="2" fill="#ffe082" />
          <circle cx="62" cy="9" r="2" fill="#ffe082" />
          <path d="M56 13 Q59 15 62 13" stroke="#222" strokeWidth="1.5" fill="none" />
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
        @keyframes puff {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-widest">
            KU <span className="text-red-500">ZLING</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            The best car customization shop in KU.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Username</label>
            <input
              type="text"
              placeholder="racing_driver01"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-zinc-400">
          No account?{" "}
          <Link to="/register" className="text-red-500 hover:text-red-400 transition font-semibold">
            Create Garage ID
          </Link>
        </div>
      </div>
    </div>
  );
}
