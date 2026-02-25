import { Bike } from "lucide-react";

/* ================= LOGIN PAGE ================= */
const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        
        {/* Left Side */}
        <div className="hidden w-1/2 bg-[#1a1a2e] p-8 md:block">
          <div className="h-full w-full rounded-2xl border-4 border-orange-500 bg-[url('/your-bike-art.png')] bg-cover bg-center" />
        </div>

        {/* Right Side */}
        <div className="flex w-full flex-col justify-center p-12 md:w-1/2">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-widest text-gray-800">
            LOGIN
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="EMAIL OR PHONE NUMBER"
              className="w-full rounded-full bg-gray-200 px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full rounded-full bg-gray-200 px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button className="w-full rounded-full bg-gray-300 py-3 font-bold transition hover:bg-gray-400">
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= DASHBOARD PAGE ================= */
const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-indigo-900 px-8 py-3 text-white">
        <span className="font-bold underline">MENU</span>
        <span className="text-sm uppercase">Puriwat Pahusuwanno</span>
      </nav>

      {/* Card */}
      <div className="p-10">
        <div className="flex max-w-2xl items-center gap-8 rounded-3xl bg-gray-200 p-8 shadow-inner">
          
          <div className="h-48 w-64 overflow-hidden rounded-2xl bg-white">
            <img
              src="/green-bike.jpg"
              alt="Motorcycle"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-2 text-lg font-semibold text-gray-800">
            <p>VID : 101</p>
            <p>MODEL : R3</p>
            <p className="underline">LICENSE : CPE 6738</p>
            <p>
              STATUS : <span className="text-red-600">NOT PAY</span>
            </p>

            <button className="mt-4 rounded-full bg-white px-8 py-1 text-sm font-bold shadow-sm hover:bg-gray-100">
              PAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= REGISTER PAGE ================= */
const RegisterPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      <div
        className="absolute inset-0 bg-[url('/your-graffiti-bg.jpg')] bg-cover bg-center"
        style={{ filter: "brightness(0.8)" }}
      />

      <div className="relative z-10 w-full max-w-md rounded-[40px] bg-white/95 p-10 shadow-2xl backdrop-blur-sm">
        
        <div className="mb-6 flex flex-col items-center">
          <Bike size={48} className="mb-2 text-gray-800" />
          <h2 className="text-2xl font-bold tracking-[0.2em] text-gray-800">
            REGISTER
          </h2>
        </div>

        <div className="space-y-4">
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="FIRSTNAME"
              className="w-1/2 rounded-full bg-gray-200 px-5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              placeholder="LASTNAME"
              className="w-1/2 rounded-full bg-gray-200 px-5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <input
            type="email"
            placeholder="EMAIL"
            className="w-full rounded-full bg-gray-200 px-5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="password"
            placeholder="PASSWORD"
            className="w-full rounded-full bg-gray-200 px-5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="password"
            placeholder="CONFIRM PASSWORD"
            className="w-full rounded-full bg-gray-200 px-5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button className="mt-4 w-full rounded-full bg-[#a393eb] py-2 text-xs font-bold text-white transition hover:bg-[#8e7cd9] shadow-lg">
            REGISTER
          </button>
        </div>
      </div>
    </div>
  );
};

export { LoginPage, DashboardPage, RegisterPage };