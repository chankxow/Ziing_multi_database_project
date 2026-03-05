// pages/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const API = "http://localhost:5000";
type Section = "dashboard" | "workorders" | "parts" | "staff";

interface WorkOrder {
  WorkOrderID: number; Description: string; Status: string; TotalCost: number;
  CreatedDate: string; CompletedDate: string | null;
  VehicleID: number; UserID: number;
  Make: string; Model: string; Year: number; LicensePlate: string;
  CustFirst: string; CustLast: string; StaffFirst: string; StaffLast: string;
}
interface Part {
  part_id: string; name: string; category: string;
  brand?: string; price: number; stock: number;
  compatible_models?: string[];
}
interface Vehicle { VehicleID: number; Make: string; Model: string; Year: number; LicensePlate: string; CustFirst: string; CustLast: string; }
interface Staff   { UserID: number; FirstName: string; LastName: string; RoleName: string; }

function apiFetch(url: string, token: string, opts: RequestInit = {}) {
  return fetch(`${API}${url}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers ?? {}) },
  });
}

function useGet<T>(url: string, token: string, deps: unknown[] = []) {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [tick,    setTick]    = useState(0);
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    setLoading(true); setError("");
    fetch(`${API}${url}`, {
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { if (!controller.signal.aborted) { setData(d); setLoading(false); } })
      .catch(e => { if (e.name !== "AbortError") { setError(e.message); setLoading(false); } });
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, token, tick, ...deps]);
  return { data, loading, error, refetch: () => setTick(n => n + 1) };
}

const STATUS_STYLE: Record<string, string> = {
  "Pending":     "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "In Progress": "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  "Completed":   "bg-green-500/15 text-green-400 border border-green-500/30",
  "Cancelled":   "bg-red-500/15 text-red-400 border border-red-500/30",
};
const NEXT: Record<string, string> = { "Pending": "In Progress", "In Progress": "Completed" };
const STATUSES = ["Pending", "In Progress", "Completed", "Cancelled"] as const;
const LOW_STOCK = 5;

function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-xl ${className}`} />;
}
function Toast({ msg }: { msg: string }) {
  return msg ? (
    <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 px-4 py-3 rounded-xl text-sm shadow-xl">{msg}</div>
  ) : null;
}

// ── Overview ──────────────────────────────────────────────
function OverviewSection({ token }: { token: string }) {
  const { data, loading, error } = useGet<any>("/dashboard/admin", token);
  const summary        = data?.summary;
  const breakdown: Record<string, number> = data?.status_breakdown  ?? {};
  const recent: any[]  = data?.recent_orders ?? [];
  const staff: any[]   = data?.staff_list    ?? [];
  const parts: any[]   = data?.parts_summary ?? [];
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  if (error) return <p className="text-red-400 text-sm">❌ {error}</p>;

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {loading ? Array.from({ length: 4 }).map((_, i) => <Sk key={i} className="h-28" />) : (
          [
            { label: "Total Revenue",   value: `฿${summary?.total_revenue?.toLocaleString() ?? 0}`, color: "text-green-400" },
            { label: "Customers",       value: summary?.total_customers  ?? 0, color: "" },
            { label: "Work Orders",     value: summary?.total_workorders ?? 0, color: "" },
            { label: "Vehicles",        value: summary?.total_vehicles   ?? 0, color: "" },
          ].map((c, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <p className="text-sm text-gray-400">{c.label}</p>
              <h3 className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</h3>
            </div>
          ))
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-semibold mb-4">Recent Work Orders</h3>
          {loading
            ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Sk key={i} className="h-16" />)}</div>
            : recent.map(o => (
                <div key={o.WorkOrderID} className="bg-gray-800 p-4 rounded-xl flex justify-between gap-3 mb-3 last:mb-0">
                  <div>
                    <p className="font-medium text-sm">{o.Year} {o.Make} {o.Model}
                      <span className="text-gray-400"> — {o.CustFirst} {o.CustLast}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{o.Description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[o.Status]}`}>{o.Status}</span>
                    <p className="text-sm font-semibold mt-1">฿{o.TotalCost?.toLocaleString()}</p>
                  </div>
                </div>
              ))
          }
        </div>
        <div className="space-y-5">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="font-semibold mb-4">Status</h3>
            {loading
              ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Sk key={i} className="h-8" />)}</div>
              : Object.entries(breakdown).map(([s, c]) => {
                  const pct = total > 0 ? Math.round((c / total) * 100) : 0;
                  return (
                    <div key={s} className="mb-4 last:mb-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{s}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
            }
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="font-semibold mb-4">Staff</h3>
            {loading
              ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Sk key={i} className="h-12" />)}</div>
              : staff.map(s => (
                  <div key={s.UserID} className="flex justify-between items-center mb-3 last:mb-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">
                        {s.FirstName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{s.FirstName} {s.LastName}</p>
                        <p className="text-xs text-gray-500">{s.RoleName}</p>
                      </div>
                    </div>
                    <span className="text-yellow-400 text-sm font-semibold">{s.assigned_jobs} jobs</span>
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="font-semibold mb-4">Parts Overview <span className="text-xs text-gray-500 font-normal ml-1">📦 MongoDB</span></h3>
        {loading
          ? <div className="grid grid-cols-3 md:grid-cols-6 gap-4">{Array.from({ length: 6 }).map((_, i) => <Sk key={i} className="h-16" />)}</div>
          : <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {parts.map((p, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1 capitalize">{p.category}</p>
                  <p className="text-2xl font-bold">{p.total_stock}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.count} SKUs</p>
                  {p.total_stock < LOW_STOCK && <p className="text-xs text-red-400 mt-1">⚠️ Low</p>}
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ── Work Orders ───────────────────────────────────────────
function WorkOrdersSection({ token, canEdit, canDelete }: { token: string; canEdit: boolean; canDelete: boolean }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText,   setSearchText]   = useState("");
  const [showCreate,   setShowCreate]   = useState(false);
  const [editOrder,    setEditOrder]    = useState<WorkOrder | null>(null);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const qp = new URLSearchParams();
  if (statusFilter !== "all") qp.set("status", statusFilter);
  const { data: orders, loading, error, refetch } = useGet<WorkOrder[]>(`/workorders?${qp}`, token, [statusFilter]);
  const { data: vehicles } = useGet<Vehicle[]>("/vehicles", token);
  const { data: staffList } = useGet<Staff[]>("/staff", token);

  const safeOrders:   WorkOrder[] = Array.isArray(orders)   ? orders   : [];
  const safeVehicles: Vehicle[]   = Array.isArray(vehicles) ? vehicles : [];
  const safeStaff:    Staff[]     = Array.isArray(staffList)? staffList: [];

  const filtered = safeOrders.filter(o => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return `${o.Make} ${o.Model} ${o.LicensePlate} ${o.CustFirst} ${o.CustLast} ${o.Description}`.toLowerCase().includes(q);
  });

  const counts = STATUSES.reduce((a, s) => { a[s] = safeOrders.filter(o => o.Status === s).length; return a; }, {} as Record<string, number>);

  const updateStatus = async (id: number, status: string) => {
    await apiFetch(`/workorders/${id}/status`, token, { method: "PATCH", body: JSON.stringify({ status }) });
    showToast(`✅ อัปเดตเป็น "${status}"`); refetch();
  };
  const deleteOrder = async (id: number) => {
    if (!confirm(`ลบ #${id}?`)) return;
    await apiFetch(`/workorders/${id}`, token, { method: "DELETE" });
    showToast("🗑 ลบสำเร็จ"); refetch();
  };

  return (
    <div className="space-y-5">
      <Toast msg={toast} />
      {showCreate && (
        <CreateWOModal vehicles={safeVehicles} staffList={safeStaff} token={token}
          onClose={() => setShowCreate(false)}
          onCreated={() => { refetch(); showToast("✅ สร้างสำเร็จ"); }} />
      )}
      {editOrder && (
        <EditWOModal order={editOrder} staffList={safeStaff} token={token}
          onClose={() => setEditOrder(null)}
          onSaved={() => { refetch(); showToast("✅ บันทึกสำเร็จ"); }} />
      )}

      {error && <p className="text-red-400 text-sm">❌ {error}</p>}

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{safeOrders.length} รายการ</p>
        {canEdit && (
          <button onClick={() => setShowCreate(true)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition">
            + สร้างใหม่
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap items-center">
        {[{ label: "ทั้งหมด", value: "all", count: safeOrders.length },
          ...STATUSES.map(s => ({ label: s, value: s, count: counts[s] ?? 0 }))
        ].map(({ label, value, count }) => (
          <button key={value} onClick={() => setStatusFilter(value)}
            className={`px-3 py-1.5 rounded-xl text-sm transition flex items-center gap-1.5 ${
              statusFilter === value ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}>
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === value ? "bg-red-700" : "bg-gray-700"}`}>
              {count}
            </span>
          </button>
        ))}
        <input placeholder="🔍 ค้นหา..." value={searchText} onChange={e => setSearchText(e.target.value)}
          className="ml-auto bg-gray-800 px-4 py-1.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 w-44" />
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                {["#ID", "รถ / ลูกค้า", "รายละเอียด", "สถานะ", "ช่าง", "ราคา", "วันที่", "Actions"].map(h => (
                  <th key={h} className={`px-4 py-3 ${h === "ราคา" ? "text-right" : h === "#ID" || h === "สถานะ" || h === "Actions" ? "text-center" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      {Array.from({ length: 8 }).map((__, j) => (
                        <td key={j} className="px-4 py-3"><Sk className="h-5" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                ? <tr><td colSpan={8} className="text-center py-10 text-gray-500">ไม่พบข้อมูล</td></tr>
                : filtered.map(o => (
                    <tr key={o.WorkOrderID} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                      <td className="px-4 py-3 text-center font-mono text-xs text-gray-500">#{o.WorkOrderID}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{o.Year} {o.Make} {o.Model}</p>
                        <p className="text-xs text-gray-400">{o.LicensePlate} • {o.CustFirst} {o.CustLast}</p>
                      </td>
                      <td className="px-4 py-3 max-w-[180px]"><p className="truncate">{o.Description}</p></td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLE[o.Status]}`}>{o.Status}</span>
                      </td>
                      <td className="px-4 py-3">{o.StaffFirst} {o.StaffLast}</td>
                      <td className="px-4 py-3 text-right">{o.TotalCost > 0 ? `฿${o.TotalCost.toLocaleString()}` : "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {o.CreatedDate?.slice(0, 10)}
                        {o.CompletedDate && <p className="text-green-400">✓ {o.CompletedDate.slice(0, 10)}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1.5 flex-wrap">
                          {NEXT[o.Status] && (
                            <button onClick={() => updateStatus(o.WorkOrderID, NEXT[o.Status])}
                              className="text-xs px-2 py-1 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 rounded-lg transition whitespace-nowrap">
                              ▶ {NEXT[o.Status] === "In Progress" ? "Start" : "Done"}
                            </button>
                          )}
                          {canEdit && o.Status !== "Completed" && o.Status !== "Cancelled" && (
                            <button onClick={() => updateStatus(o.WorkOrderID, "Cancelled")}
                              className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition">✕</button>
                          )}
                          {canEdit && (
                            <button onClick={() => setEditOrder(o)}
                              className="text-xs px-2 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition">✏️</button>
                          )}
                          {canDelete && (
                            <button onClick={() => deleteOrder(o.WorkOrderID)}
                              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition">🗑</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-800 text-xs text-gray-500">
            แสดง {filtered.length} จาก {safeOrders.length} รายการ
          </div>
        )}
      </div>
    </div>
  );
}

function CreateWOModal({ vehicles, staffList, token, onClose, onCreated }: {
  vehicles: Vehicle[]; staffList: Staff[]; token: string;
  onClose: () => void; onCreated: () => void;
}) {
  const [form, setForm] = useState({ vehicle_id: "", user_id: "", description: "", total_cost: "", status: "Pending" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const mechanics = staffList.filter(s => s.RoleName === "Mechanic");

  const submit = async () => {
    if (!form.vehicle_id || !form.user_id || !form.description) { setErr("กรุณากรอกข้อมูลที่จำเป็น"); return; }
    setSaving(true);
    const res = await apiFetch("/workorders", token, { method: "POST", body: JSON.stringify({
      vehicle_id: parseInt(form.vehicle_id), user_id: parseInt(form.user_id),
      description: form.description, total_cost: parseFloat(form.total_cost) || 0, status: form.status,
    })});
    setSaving(false);
    if (!res.ok) { const j = await res.json(); setErr(j.error); return; }
    onCreated(); onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">🔧 สร้าง Work Order ใหม่</h2>
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">รถ *</label>
            <select value={form.vehicle_id} onChange={e => set("vehicle_id", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500">
              <option value="">-- เลือกรถ --</option>
              {vehicles.map(v => <option key={v.VehicleID} value={v.VehicleID}>{v.Year} {v.Make} {v.Model} ({v.LicensePlate}) — {v.CustFirst} {v.CustLast}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">ช่าง *</label>
            <select value={form.user_id} onChange={e => set("user_id", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500">
              <option value="">-- เลือกช่าง --</option>
              {mechanics.map(s => <option key={s.UserID} value={s.UserID}>{s.FirstName} {s.LastName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">รายละเอียด *</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">ราคา (฿)</label>
              <input type="number" value={form.total_cost} onChange={e => set("total_cost", e.target.value)}
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">สถานะ</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
          <button onClick={submit} disabled={saving} className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
            {saving ? "..." : "สร้าง"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditWOModal({ order, staffList, token, onClose, onSaved }: {
  order: WorkOrder; staffList: Staff[]; token: string;
  onClose: () => void; onSaved: () => void;
}) {
  const [desc, setDesc] = useState(order.Description);
  const [cost, setCost] = useState(String(order.TotalCost));
  const [uid,  setUid]  = useState(String(order.UserID));
  const [saving, setSaving] = useState(false);
  const mechanics = staffList.filter(s => s.RoleName === "Mechanic");

  const submit = async () => {
    setSaving(true);
    await apiFetch(`/workorders/${order.WorkOrderID}`, token, {
      method: "PUT", body: JSON.stringify({ description: desc, total_cost: parseFloat(cost) || 0, user_id: parseInt(uid) }),
    });
    setSaving(false); onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">✏️ แก้ไข #{order.WorkOrderID} — {order.Year} {order.Make} {order.Model}</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">รายละเอียด</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">ราคา (฿)</label>
              <input type="number" value={cost} onChange={e => setCost(e.target.value)}
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">ช่าง</label>
              <select value={uid} onChange={e => setUid(e.target.value)}
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none">
                {mechanics.map(s => <option key={s.UserID} value={s.UserID}>{s.FirstName} {s.LastName}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
          <button onClick={submit} disabled={saving} className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
            {saving ? "..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Parts ─────────────────────────────────────────────────
function PartsSection({ token, canEdit }: { token: string; canEdit: boolean }) {
  const [catFilter, setCatFilter] = useState("all");
  const [search,    setSearch]    = useState("");
  const [lowOnly,   setLowOnly]   = useState(false);
  const [editPart,  setEditPart]  = useState<Part | null | "new">(null);
  const [stockPart, setStockPart] = useState<Part | null>(null);
  const [delPart,   setDelPart]   = useState<Part | null>(null);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const qp = new URLSearchParams();
  if (catFilter !== "all") qp.set("category", catFilter);
  if (search)   qp.set("search",    search);
  if (lowOnly)  qp.set("low_stock", "true");

  const { data: parts,      loading, error, refetch } = useGet<Part[]>(`/parts?${qp}`, token, [catFilter, search, lowOnly]);
  const { data: categories }                           = useGet<string[]>("/parts/categories", token);

  const safeParts: Part[]   = Array.isArray(parts)      ? parts      : [];
  const safeCats:  string[] = Array.isArray(categories) ? categories : [];

  const savePart = async (data: any, isEdit: boolean) => {
    const res = isEdit
      ? await apiFetch(`/parts/${data.part_id}`, token, { method: "PUT",  body: JSON.stringify(data) })
      : await apiFetch("/parts",                  token, { method: "POST", body: JSON.stringify(data) });
    if (!res.ok) { const j = await res.json(); alert(j.error); return; }
    showToast(isEdit ? "✅ แก้ไขสำเร็จ" : "✅ เพิ่มสำเร็จ");
    setEditPart(null); refetch();
  };

  const adjustStock = async (part_id: string, delta: number) => {
    const res = await apiFetch(`/parts/${part_id}/stock`, token, { method: "PATCH", body: JSON.stringify({ delta }) });
    if (!res.ok) { const j = await res.json(); alert(j.error); return; }
    showToast("✅ อัปเดต Stock"); setStockPart(null); refetch();
  };

  const deletePart = async (part: Part) => {
    await apiFetch(`/parts/${part.part_id}`, token, { method: "DELETE" });
    showToast("🗑 ลบสำเร็จ"); setDelPart(null); refetch();
  };

  return (
    <div className="space-y-5">
      <Toast msg={toast} />
      {editPart !== null && (
        <PartModal part={editPart === "new" ? null : editPart} categories={safeCats}
          onClose={() => setEditPart(null)} onSave={savePart} />
      )}
      {stockPart && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">📦 ปรับ Stock — {stockPart.name}</h2>
            <p className="text-xs text-gray-400">ปัจจุบัน: {stockPart.stock}</p>
            <StockAdjust part={stockPart} onClose={() => setStockPart(null)} onAdjust={adjustStock} />
          </div>
        </div>
      )}
      {delPart && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="font-semibold">ยืนยันการลบ</h2>
            <p className="text-sm text-gray-400">ลบ <span className="text-white">{delPart.name}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDelPart(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
              <button onClick={() => deletePart(delPart)} className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition">ลบ</button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">❌ {error}</p>}

      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">📦 MongoDB — {safeParts.length} รายการ</p>
        {canEdit && (
          <button onClick={() => setEditPart("new")}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition">+ เพิ่ม Part</button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <input placeholder="🔍 ค้นหา..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 w-52" />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none">
          <option value="all">ทุก Category</option>
          {safeCats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={lowOnly} onChange={e => setLowOnly(e.target.checked)} className="accent-red-500" />
          Low Stock
        </label>
        <button onClick={refetch} className="ml-auto bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl text-sm transition">🔄</button>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                {["Part ID", "ชื่อ", "Category", "Brand", "ราคา", "Stock", "Compatible", "Actions"].map(h => (
                  <th key={h} className={`px-4 py-3 ${h === "ราคา" ? "text-right" : h === "Stock" || h === "Actions" ? "text-center" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      {Array.from({ length: 8 }).map((__, j) => <td key={j} className="px-4 py-3"><Sk className="h-5" /></td>)}
                    </tr>
                  ))
                : safeParts.length === 0
                ? <tr><td colSpan={8} className="text-center py-10 text-gray-500">ไม่พบข้อมูล</td></tr>
                : safeParts.map(part => (
                    <tr key={part.part_id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{part.part_id}</td>
                      <td className="px-4 py-3 font-medium">{part.name}</td>
                      <td className="px-4 py-3"><span className="text-xs bg-gray-800 px-2 py-1 rounded-lg">{part.category}</span></td>
                      <td className="px-4 py-3 text-gray-400">{part.brand ?? "—"}</td>
                      <td className="px-4 py-3 text-right">฿{part.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          part.stock === 0 ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : part.stock < LOW_STOCK ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}>{part.stock}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-[130px] truncate">
                        {(part.compatible_models ?? []).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1.5">
                          <button onClick={() => setStockPart(part)}
                            className="text-xs px-2 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition">📦</button>
                          {canEdit && (<>
                            <button onClick={() => setEditPart(part)}
                              className="text-xs px-2 py-1 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 rounded-lg transition">✏️</button>
                            <button onClick={() => setDelPart(part)}
                              className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition">🗑</button>
                          </>)}
                        </div>
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

function PartModal({ part, categories, onClose, onSave }: {
  part: Part | null; categories: string[];
  onClose: () => void; onSave: (d: any, isEdit: boolean) => Promise<void>;
}) {
  const isEdit = !!part;
  const [form, setForm] = useState(part
    ? { ...part, price: String(part.price), stock: String(part.stock), compatible_models: (part.compatible_models ?? []).join(", ") }
    : { part_id: "", name: "", category: "", brand: "", price: "", stock: "", compatible_models: "" });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.part_id || !form.name || !form.category || !form.price || !form.stock) { setErr("กรุณากรอกข้อมูลที่จำเป็น"); return; }
    setSaving(true);
    await onSave({ part_id: form.part_id, name: form.name, category: form.category, brand: form.brand,
      price: parseFloat(form.price), stock: parseInt(form.stock),
      compatible_models: form.compatible_models ? form.compatible_models.split(",").map(s => s.trim()).filter(Boolean) : [],
    }, isEdit);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">{isEdit ? "✏️ แก้ไข Part" : "➕ เพิ่ม Part ใหม่"}</h2>
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Part ID *</label>
            <input disabled={isEdit} value={form.part_id} onChange={e => set("part_id", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">ชื่อ *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Category *</label>
            <input list="cats" value={form.category} onChange={e => set("category", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
            <datalist id="cats">{categories.map(c => <option key={c} value={c} />)}</datalist>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Brand</label>
            <input value={form.brand} onChange={e => set("brand", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">ราคา *</label>
            <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Stock *</label>
            <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Compatible Models (คั่น ,)</label>
            <input value={form.compatible_models} onChange={e => set("compatible_models", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
          <button onClick={submit} disabled={saving} className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
            {saving ? "..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StockAdjust({ part, onClose, onAdjust }: {
  part: Part; onClose: () => void; onAdjust: (id: string, delta: number) => Promise<void>;
}) {
  const [delta, setDelta]   = useState(0);
  const [saving, setSaving] = useState(false);
  const newStock = Math.max(0, part.stock + delta);
  return (
    <>
      <div className="flex items-center gap-4 justify-center py-2">
        <button onClick={() => setDelta(d => d - 1)} className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl text-xl font-bold transition">−</button>
        <div className="text-center">
          <p className="text-3xl font-bold">{newStock}</p>
          <p className="text-xs text-gray-500 mt-1">{delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "ไม่เปลี่ยน"}</p>
        </div>
        <button onClick={() => setDelta(d => d + 1)} className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl text-xl font-bold transition">+</button>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
        <button disabled={delta === 0 || saving}
          onClick={async () => { setSaving(true); await onAdjust(part.part_id, delta); setSaving(false); }}
          className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
          {saving ? "..." : "บันทึก"}
        </button>
      </div>
    </>
  );
}


// ── Staff Management ──────────────────────────────────────
interface StaffUser {
  UserID: number; Username: string; FirstName: string; LastName: string;
  RoleID: number; RoleName: string; IsActive: boolean; CreatedDate: string;
}

function StaffSection({ token }: { token: string }) {
  const { data, loading, error, refetch } = useGet<StaffUser[]>("/users/staff", token);
  const safeStaff: StaffUser[] = Array.isArray(data) ? data : [];

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ username:"", firstName:"", lastName:"", password:"", role_id:"2" });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };
  const set = (k: string, v: string) => setForm(f => ({...f, [k]: v}));

  const ROLE_LABELS: Record<number, string> = { 1: "Admin", 2: "Mechanic", 3: "Receptionist" };
  const ROLE_COLORS: Record<number, string> = {
    1: "bg-red-500/20 text-red-400 border border-red-500/30",
    2: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    3: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  };

  const handleCreate = async () => {
    if (!form.username || !form.firstName || !form.lastName || !form.password) {
      setFormErr("กรุณากรอกข้อมูลให้ครบ"); return;
    }
    setSaving(true);
    const res = await apiFetch("/users/staff", token, {
      method: "POST", body: JSON.stringify({ ...form, role_id: parseInt(form.role_id) }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setFormErr(json.error); return; }
    showToast("✅ สร้างบัญชีพนักงานสำเร็จ");
    setShowCreate(false);
    setForm({ username:"", firstName:"", lastName:"", password:"", role_id:"2" });
    setFormErr("");
    refetch();
  };

  const toggleActive = async (id: number, current: boolean) => {
    await apiFetch(`/users/staff/${id}`, token, {
      method: "PATCH", body: JSON.stringify({ is_active: !current }),
    });
    showToast(current ? "⛔ ระงับบัญชีแล้ว" : "✅ เปิดใช้งานแล้ว");
    refetch();
  };

  const handleDelete = async (u: StaffUser) => {
    if (!confirm(`ลบบัญชี "${u.Username}"?`)) return;
    const res = await apiFetch(`/users/staff/${u.UserID}`, token, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    showToast("🗑 ลบบัญชีสำเร็จ"); refetch();
  };

  return (
    <div className="space-y-5">
      <Toast msg={toast} />
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{safeStaff.length} บัญชีพนักงาน</p>
        <button onClick={() => setShowCreate(!showCreate)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition">
          {showCreate ? "ยกเลิก" : "+ สร้างบัญชีพนักงาน"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">สร้างบัญชีพนักงานใหม่</h3>
          {formErr && <p className="text-red-400 text-sm">{formErr}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">ตำแหน่ง *</label>
              <select value={form.role_id} onChange={e => set("role_id", e.target.value)}
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500">
                <option value="2">Mechanic (ช่าง)</option>
                <option value="1">Admin</option>
                <option value="3">Receptionist</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">ชื่อ *</label>
              <input value={form.firstName} onChange={e => set("firstName", e.target.value)}
                placeholder="สมชาย" className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500"/>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">นามสกุล *</label>
              <input value={form.lastName} onChange={e => set("lastName", e.target.value)}
                placeholder="ใจดี" className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500"/>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Username *</label>
              <input value={form.username} onChange={e => set("username", e.target.value)}
                placeholder="mech_som" className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500"/>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Password *</label>
              <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
                placeholder="••••••••" className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500"/>
            </div>
          </div>
          <button onClick={handleCreate} disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
            {saving ? "กำลังสร้าง..." : "สร้างบัญชี"}
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">❌ {error}</p>}

      {/* Staff table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              {["ชื่อ-นามสกุล", "Username", "ตำแหน่ง", "สถานะ", "วันที่สร้าง", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({length: 3}).map((_, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    {Array.from({length: 6}).map((__, j) => <td key={j} className="px-4 py-3"><Sk className="h-5"/></td>)}
                  </tr>
                ))
              : safeStaff.length === 0
              ? <tr><td colSpan={6} className="text-center py-10 text-gray-500">ไม่มีพนักงาน</td></tr>
              : safeStaff.map(u => (
                  <tr key={u.UserID} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                    <td className="px-4 py-3 font-medium">{u.FirstName} {u.LastName}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{u.Username}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${ROLE_COLORS[u.RoleID] ?? ""}`}>
                        {ROLE_LABELS[u.RoleID] ?? u.RoleName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.IsActive ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-500"}`}>
                        {u.IsActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{u.CreatedDate?.slice(0,10)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => toggleActive(u.UserID, u.IsActive)}
                          className={`text-xs px-2 py-1 rounded-lg transition ${u.IsActive ? "bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400" : "bg-green-600/20 hover:bg-green-600/40 text-green-400"}`}>
                          {u.IsActive ? "ระงับ" : "เปิด"}
                        </button>
                        <button onClick={() => handleDelete(u)}
                          className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition">
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────
const NAV: { label: string; section: Section; icon: string }[] = [
  { label: "Dashboard",         section: "dashboard",  icon: "▦"  },
  { label: "Work Orders",       section: "workorders", icon: "🔧" },
  { label: "Parts & Inventory", section: "parts",      icon: "📦" },
  { label: "จัดการพนักงาน",    section: "staff",      icon: "👥" },
];

export default function AdminDashboard() {
  const { user, logout, token } = useAuth();
  const [active, setActive] = useState<Section>("dashboard");
  const canEdit   = user?.role === 1 || user?.role === 3;
  const canDelete = user?.role === 1;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <aside className="w-60 bg-gray-900 border-r border-gray-800 p-6 flex flex-col flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-500">AutoPerf</h1>
          <p className="text-xs text-gray-400">{user?.role === 1 ? "Admin Panel" : "Receptionist Panel"}</p>
        </div>
        <nav className="space-y-1 text-sm flex-1">
          {NAV.map(item => (
            <button key={item.section} onClick={() => setActive(item.section)}
              className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg transition ${
                active === item.section ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}>
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
              <p className="text-xs text-gray-500">{user?.role === 1 ? "Admin" : "Receptionist"}</p>
            </div>
          </div>
          <button onClick={logout} className="text-xs text-gray-500 hover:text-red-400 transition">ออกจากระบบ →</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-semibold mb-6">{NAV.find(n => n.section === active)?.label}</h2>
        {active === "dashboard"  && <OverviewSection    token={token!} />}
        {active === "workorders" && <WorkOrdersSection  token={token!} canEdit={canEdit} canDelete={canDelete} />}
        {active === "parts"      && <PartsSection       token={token!} canEdit={canEdit} />}
        {active === "staff"      && <StaffSection        token={token!} />}
      </main>
    </div>
  );
}