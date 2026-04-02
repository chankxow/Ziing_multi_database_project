// pages/StaffDashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Search, RefreshCw, CheckCircle, XCircle, Package,
  LayoutDashboard, Play, Check, AlertTriangle, LogOut, Minus
} from "lucide-react";

import API_BASE_URL from "../config/api";
const API = API_BASE_URL;
type Section = "dashboard" | "parts";

interface WorkOrder {
  WorkOrderID: number; Description: string; Status: string; TotalCost: number;
  CreatedDate: string; CompletedDate: string | null;
  Make: string; Model: string; Year: number; LicensePlate: string;
  CustFirst: string; CustLast: string;
}
interface Part {
  part_id: string; name: string; category: string;
  brand?: string; price: number; stock: number;
  compatible_models?: string[];
}

function apiFetch(url: string, token: string, opts: RequestInit = {}) {
  return fetch(`${API}${url}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers ?? {}) },
  });
}

function useGet<T>(url: string, token: string, deps: unknown[] = []) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [tick, setTick]       = useState(0);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    apiFetch(url, token)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, token, tick, ...deps]);

  return { data, loading, error, refetch: () => setTick(n => n + 1) };
}

const STATUS_BADGE: Record<string, string> = {
  "In Progress": "bg-yellow-400/10 text-yellow-400",
  "Pending":     "bg-blue-400/10 text-blue-400",
  "Completed":   "bg-green-400/10 text-green-400",
  "Cancelled":   "bg-red-400/10 text-red-400",
};
const LOW_STOCK = 5;

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-xl ${className}`} />;
}

// ── Dashboard Section ─────────────────────────────────────
function DashboardSection({ token }: { token: string }) {
  const { data, loading, error, refetch } = useGet<any>("/dashboard/staff", token);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const myOrders: WorkOrder[] = data?.my_orders      ?? [];
  const summary               = data?.summary;
  const lowStock: any[]       = data?.low_stock_parts ?? [];
  const active  = myOrders.filter(o => o.Status === "In Progress");
  const pending = myOrders.filter(o => o.Status === "Pending");
  const done    = myOrders.filter(o => o.Status === "Completed");

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    await apiFetch(`/workorders/${id}/status`, token, {
      method: "PATCH", body: JSON.stringify({ status }),
    });
    setUpdatingId(null);
    showToast(`อัปเดตเป็น "${status}"`);
    refetch();
  };

  if (error) return <p className="text-red-400 text-sm flex items-center gap-1"><XCircle size={14}/> โหลดไม่สำเร็จ: {error}</p>;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 px-4 py-3 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Summary cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />) : (
          [
            { label: "Assigned",    value: summary?.total_assigned ?? 0, color: "" },
            { label: "In Progress", value: summary?.in_progress    ?? 0, color: "text-yellow-400" },
            { label: "Pending",     value: summary?.pending        ?? 0, color: "text-blue-400" },
            { label: "Completed",   value: summary?.completed      ?? 0, color: "text-green-400" },
          ].map((c, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <p className="text-sm text-gray-400">{c.label}</p>
              <h3 className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</h3>
            </div>
          ))
        )}
      </section>

      {/* Jobs + side panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Assigned Builds</h3>
            <button onClick={refetch} className="text-xs text-gray-400 hover:text-white bg-gray-800 px-3 py-1.5 rounded-lg transition"><RefreshCw size={14}/></button>
          </div>
          {loading
            ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
            : myOrders.length === 0
            ? <p className="text-gray-500 text-sm">ยังไม่มีงาน</p>
            : <div className="space-y-4">
                {[...active, ...pending, ...done].map(o => (
                  <div key={o.WorkOrderID} className="bg-gray-800 p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{o.Year} {o.Make} {o.Model}
                          <span className="text-gray-400 text-sm"> ({o.LicensePlate})</span>
                        </p>
                        <p className="text-sm text-gray-300 mt-0.5">{o.Description}</p>
                        <p className="text-xs text-gray-500 mt-1">{o.CustFirst} {o.CustLast} • {o.CreatedDate?.slice(0, 10)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${STATUS_BADGE[o.Status] ?? ""}`}>
                        {o.Status}
                      </span>
                    </div>
                    {o.Status !== "Completed" && o.Status !== "Cancelled" && (
                      <div className="mt-3 flex gap-2">
                        {o.Status === "Pending" && (
                          <button onClick={() => updateStatus(o.WorkOrderID, "In Progress")}
                            disabled={updatingId === o.WorkOrderID}
                            className="text-xs px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition disabled:opacity-50">
                            {updatingId === o.WorkOrderID ? "..." : <><Play size={13} className="inline mr-1"/>Start</>}
                          </button>
                        )}
                        {o.Status === "In Progress" && (
                          <button onClick={() => updateStatus(o.WorkOrderID, "Completed")}
                            disabled={updatingId === o.WorkOrderID}
                            className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50">
                            {updatingId === o.WorkOrderID ? "..." : <><Check size={13} className="inline mr-1"/>Complete</>}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Side panel */}
        <div className="space-y-5">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="font-semibold mb-1">Low Stock Parts</h3>
            <p className="text-xs text-gray-500 mb-4 flex items-center gap-1"><AlertTriangle size={12}/> stock &lt; 5</p>
            {loading
              ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              : lowStock.length === 0
              ? <p className="text-gray-500 text-sm flex items-center gap-1"><CheckCircle size={14}/> Stocks are fine</p>
              : <div className="space-y-2">
                  {lowStock.map((p, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-xl text-sm">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category}</p>
                      </div>
                      <span className="text-red-400 font-bold text-xs">x{p.stock}</span>
                    </div>
                  ))}
                </div>
            }
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="font-semibold mb-3">Today's Schedule</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              {active.length === 0
                ? <li className="text-gray-500">ไม่มีงาน In Progress</li>
                : active.slice(0, 3).map((o, i) => (
                    <li key={o.WorkOrderID}>
                      <span className="text-gray-500">{["09:00", "13:00", "16:00"][i]}</span> — {o.Make} {o.Model}
                    </li>
                  ))
              }
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Parts Section (Staff — ดู + ปรับ stock เท่านั้น) ───────
function PartsSection({ token }: { token: string }) {
  const [catFilter, setCatFilter] = useState("all");
  const [search,    setSearch]    = useState("");
  const [stockPart, setStockPart] = useState<Part | null>(null);
  const [toast,     setToast]     = useState("");

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const qp = new URLSearchParams();
  if (catFilter !== "all") qp.set("category", catFilter);
  if (search) qp.set("search", search);

  const { data: parts, loading, error, refetch } = useGet<Part[]>(`/parts?${qp}`, token, [catFilter, search]);
  const { data: categories } = useGet<string[]>("/parts/categories", token);

  const safeparts: Part[]    = Array.isArray(parts)      ? parts      : [];
  const safecats:  string[]  = Array.isArray(categories) ? categories : [];

  const adjustStock = async (part_id: string, delta: number) => {
    const res = await apiFetch(`/parts/${part_id}/stock`, token, {
      method: "PATCH", body: JSON.stringify({ delta }),
    });
    if (!res.ok) { const j = await res.json(); alert(j.error); return; }
    showToast("อัปเดต Stock สำเร็จ");
    setStockPart(null);
    refetch();
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 px-4 py-3 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Stock adjust modal */}
      {stockPart && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Package size={18}/> ปรับ Stock</h2>
            <p className="text-sm text-gray-400">{stockPart.name}</p>
            <StockAdjust part={stockPart} onClose={() => setStockPart(null)} onAdjust={adjustStock} />
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm flex items-center gap-1"><XCircle size={14}/> โหลดไม่สำเร็จ: {error}</p>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          placeholder="ค้นหา part..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 w-52"
        />
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none"
        >
          <option value="all">ทุก Category</option>
          {safecats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={refetch} className="ml-auto bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl text-sm transition"><RefreshCw size={14}/></button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                {["Part ID", "ชื่อ", "Category", "Brand", "ราคา", "Stock", "Compatible", "ปรับ Stock"].map(h => (
                  <th key={h} className={`px-4 py-3 ${h === "ราคา" ? "text-right" : h === "Stock" || h === "ปรับ Stock" ? "text-center" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      {Array.from({ length: 8 }).map((__, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-5" /></td>
                      ))}
                    </tr>
                  ))
                : safeparts.length === 0
                ? <tr><td colSpan={8} className="text-center py-10 text-gray-500">ไม่พบข้อมูล</td></tr>
                : safeparts.map(part => (
                    <tr key={part.part_id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{part.part_id}</td>
                      <td className="px-4 py-3 font-medium">{part.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded-lg">{part.category}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{part.brand ?? "—"}</td>
                      <td className="px-4 py-3 text-right">฿{part.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          part.stock === 0
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : part.stock < LOW_STOCK
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}>
                          {part.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-[130px] truncate">
                        {(part.compatible_models ?? []).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setStockPart(part)}
                          className="text-xs px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition"
                        >
                          <span className="flex items-center gap-1"><Package size={13}/> ปรับ</span>
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StockAdjust({ part, onClose, onAdjust }: {
  part: Part;
  onClose: () => void;
  onAdjust: (id: string, delta: number) => Promise<void>;
}) {
  const [delta,  setDelta]  = useState(0);
  const [saving, setSaving] = useState(false);
  const newStock = Math.max(0, part.stock + delta);

  return (
    <>
      <div className="flex items-center gap-4 justify-center py-2">
        <button onClick={() => setDelta(d => d - 1)}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl text-xl font-bold transition"><Minus size={16}/></button>
        <div className="text-center">
          <p className="text-3xl font-bold">{newStock}</p>
          <p className="text-xs text-gray-500 mt-1">
            {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "ไม่เปลี่ยน"} (ปัจจุบัน: {part.stock})
          </p>
        </div>
        <button onClick={() => setDelta(d => d + 1)}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl text-xl font-bold transition">+</button>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose}
          className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
        <button
          disabled={delta === 0 || saving}
          onClick={async () => { setSaving(true); await onAdjust(part.part_id, delta); setSaving(false); }}
          className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
          {saving ? "..." : "บันทึก"}
        </button>
      </div>
    </>
  );
}

// ── Main ──────────────────────────────────────────────────
const NAV: { label: string; section: Section; icon: string }[] = [
  { label: "My Dashboard", section: "dashboard", icon: <LayoutDashboard size={16}/>  },
  { label: "Parts",        section: "parts",     icon: <Package size={16}/> },
];

export default function StaffDashboard() {
  const { user, logout, token } = useAuth();
  const [active, setActive] = useState<Section>("dashboard");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 border-r border-gray-800 p-6 flex flex-col flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-500">KU ZLING</h1>
          <p className="text-xs text-gray-400">Staff / Tuner Panel</p>
        </div>
        <nav className="space-y-1 text-sm flex-1">
          {NAV.map(item => (
            <button
              key={item.section}
              onClick={() => setActive(item.section)}
              className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg transition ${
                active === item.section ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-gray-500">Mechanic</p>
            </div>
          </div>
          <button onClick={logout} className="text-xs text-gray-500 hover:text-red-400 transition">
            ออกจากระบบ →
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {NAV.find(n => n.section === active)?.label}
        </h2>
        {active === "dashboard" && <DashboardSection token={token!} />}
        {active === "parts"     && <PartsSection     token={token!} />}
      </main>
    </div>
  );
}