// pages/WorkOrders.tsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

import API_BASE_URL from "../config/api";
const API = API_BASE_URL;

// ─── Types ──────────────────────────────────────────────
interface WorkOrder {
  WorkOrderID: number;
  Description: string;
  Status: string;
  TotalCost: number;
  CreatedDate: string;
  CompletedDate: string | null;
  VehicleID: number;
  UserID: number;
  Make: string;
  Model: string;
  Year: number;
  LicensePlate: string;
  CustFirst: string;
  CustLast: string;
  StaffFirst: string;
  StaffLast: string;
}

interface Vehicle { VehicleID: number; Make: string; Model: string; Year: number; LicensePlate: string; CustFirst: string; CustLast: string; }
interface Staff   { UserID: number; FirstName: string; LastName: string; RoleName: string; }

const STATUSES = ["Pending", "In Progress", "Completed", "Cancelled"] as const;

// ─── Helpers ────────────────────────────────────────────
function apiFetch(url: string, token: string, opts: RequestInit = {}) {
  return fetch(`${API}${url}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers ?? {}) },
  });
}

const statusStyle: Record<string, string> = {
  "Pending":     "bg-blue-500/15   text-blue-400   border border-blue-500/30",
  "In Progress": "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  "Completed":   "bg-green-500/15  text-green-400  border border-green-500/30",
  "Cancelled":   "bg-red-500/15    text-red-400    border border-red-500/30",
};

const nextStatus: Record<string, string> = {
  "Pending":     "In Progress",
  "In Progress": "Completed",
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-xl ${className}`} />;
}

// ─── Create Work Order Modal ─────────────────────────────
function CreateModal({
  vehicles, staffList, onClose, onCreated,
}: {
  vehicles: Vehicle[]; staffList: Staff[];
  onClose: () => void; onCreated: () => void;
}) {
  const { token } = useAuth();
  const [form, setForm] = useState({ vehicle_id: "", user_id: "", description: "", total_cost: "", status: "Pending" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.vehicle_id || !form.user_id || !form.description) {
      setErr("กรุณากรอกข้อมูลที่จำเป็น"); return;
    }
    setSaving(true);
    const res = await apiFetch("/workorders", token!, {
      method: "POST",
      body: JSON.stringify({
        vehicle_id:  parseInt(form.vehicle_id),
        user_id:     parseInt(form.user_id),
        description: form.description,
        total_cost:  parseFloat(form.total_cost) || 0,
        status:      form.status,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setErr(json.error); return; }
    onCreated();
    onClose();
  };

  const mechanics = staffList.filter((s) => s.RoleName === "Mechanic");

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">🔧 สร้าง Work Order ใหม่</h2>
        {err && <p className="text-red-400 text-sm">{err}</p>}

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">รถ *</label>
            <select value={form.vehicle_id} onChange={(e) => set("vehicle_id", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500">
              <option value="">-- เลือกรถ --</option>
              {vehicles.map((v) => (
                <option key={v.VehicleID} value={v.VehicleID}>
                  {v.Year} {v.Make} {v.Model} ({v.LicensePlate}) — {v.CustFirst} {v.CustLast}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">มอบหมายให้ช่าง *</label>
            <select value={form.user_id} onChange={(e) => set("user_id", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500">
              <option value="">-- เลือกช่าง --</option>
              {mechanics.map((s) => (
                <option key={s.UserID} value={s.UserID}>{s.FirstName} {s.LastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">รายละเอียดงาน *</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={3} placeholder="เช่น ติดตั้ง Turbo Stage 2, เปลี่ยนช่วงล่าง..."
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">ราคา (฿)</label>
              <input type="number" min="0" value={form.total_cost} onChange={(e) => set("total_cost", e.target.value)}
                placeholder="0"
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">สถานะเริ่มต้น</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
          <button onClick={handleCreate} disabled={saving}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
            {saving ? "กำลังสร้าง..." : "สร้าง Work Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Work Order Modal ───────────────────────────────
function EditModal({
  order, staffList, onClose, onSaved,
}: {
  order: WorkOrder; staffList: Staff[];
  onClose: () => void; onSaved: () => void;
}) {
  const { token } = useAuth();
  const [desc, setDesc]   = useState(order.Description);
  const [cost, setCost]   = useState(String(order.TotalCost));
  const [uid,  setUid]    = useState(String(order.UserID));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await apiFetch(`/workorders/${order.WorkOrderID}`, token!, {
      method: "PUT",
      body: JSON.stringify({ description: desc, total_cost: parseFloat(cost) || 0, user_id: parseInt(uid) }),
    });
    setSaving(false);
    onSaved();
    onClose();
  };

  const mechanics = staffList.filter((s) => s.RoleName === "Mechanic");

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">✏️ แก้ไข Work Order #{order.WorkOrderID}</h2>
        <p className="text-sm text-gray-400">{order.Year} {order.Make} {order.Model}</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">รายละเอียดงาน</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">ราคา (฿)</label>
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)}
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">ช่างที่รับผิดชอบ</label>
              <select value={uid} onChange={(e) => setUid(e.target.value)}
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none">
                {mechanics.map((s) => (
                  <option key={s.UserID} value={s.UserID}>{s.FirstName} {s.LastName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
            {saving ? "..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────
export default function WorkOrders() {
  const { token, user } = useAuth();
  const canEdit   = user?.role === 1 || user?.role === 3;
  const canDelete = user?.role === 1;

  const [orders,    setOrders]    = useState<WorkOrder[]>([]);
  const [vehicles,  setVehicles]  = useState<Vehicle[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading,   setLoading]   = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText,   setSearchText]   = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editOrder,  setEditOrder]  = useState<WorkOrder | null>(null);
  const [toast,      setToast]      = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // ─── Fetch ───────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    const res = await apiFetch(`/workorders?${params}`, token!);
    setOrders(await res.json());
    setLoading(false);
  }, [token, statusFilter]);

  const fetchVehicles = useCallback(async () => {
    const res = await apiFetch("/vehicles", token!);
    setVehicles(await res.json());
  }, [token]);

  const fetchStaff = useCallback(async () => {
    const res = await apiFetch("/staff", token!);
    setStaffList(await res.json());
  }, [token]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { fetchVehicles(); fetchStaff(); }, [fetchVehicles, fetchStaff]);

  // ─── Status update ───────────────────────────────────
  const handleStatusUpdate = async (order: WorkOrder, newStatus: string) => {
    const res = await apiFetch(`/workorders/${order.WorkOrderID}/status`, token!, {
      method: "PATCH", body: JSON.stringify({ status: newStatus }),
    });
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    showToast(`✅ อัปเดตเป็น "${newStatus}" สำเร็จ`);
    fetchOrders();
  };

  // ─── Delete ─────────────────────────────────────────
  const handleDelete = async (orderId: number) => {
    if (!confirm(`ลบ Work Order #${orderId}?`)) return;
    const res = await apiFetch(`/workorders/${orderId}`, token!, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    showToast("🗑 ลบสำเร็จ");
    fetchOrders();
  };

  // ─── Filter ─────────────────────────────────────────
  const filtered = orders.filter((o) => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return (
      o.Description?.toLowerCase().includes(q) ||
      `${o.Make} ${o.Model}`.toLowerCase().includes(q) ||
      o.LicensePlate?.toLowerCase().includes(q) ||
      `${o.CustFirst} ${o.CustLast}`.toLowerCase().includes(q)
    );
  });

  // ─── Summary counts ──────────────────────────────────
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.Status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 px-4 py-3 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      {showCreate && (
        <CreateModal vehicles={vehicles} staffList={staffList}
          onClose={() => setShowCreate(false)} onCreated={fetchOrders} />
      )}
      {editOrder && (
        <EditModal order={editOrder} staffList={staffList}
          onClose={() => setEditOrder(null)} onSaved={fetchOrders} />
      )}

      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Work Orders</h1>
            <p className="text-sm text-gray-400 mt-0.5">จัดการงานซ่อมและแต่งรถทั้งหมด</p>
          </div>
          {canEdit && (
            <button onClick={() => setShowCreate(true)}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-sm font-medium transition">
              + สร้าง Work Order
            </button>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap">
          {[{ label: "ทั้งหมด", value: "all", count: orders.length }, ...STATUSES.map((s) => ({ label: s, value: s, count: counts[s] ?? 0 }))]
            .map(({ label, value, count }) => (
              <button key={value} onClick={() => setStatusFilter(value)}
                className={`px-4 py-1.5 rounded-xl text-sm transition flex items-center gap-2 ${
                  statusFilter === value ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}>
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === value ? "bg-red-700" : "bg-gray-700"}`}>
                  {count}
                </span>
              </button>
            ))}
          <input
            placeholder="🔍 ค้นหา..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="ml-auto bg-gray-800 px-4 py-1.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 w-48"
          />
        </div>

        {/* Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                  <th className="text-left px-5 py-3">#ID</th>
                  <th className="text-left px-5 py-3">รถ / ลูกค้า</th>
                  <th className="text-left px-5 py-3">รายละเอียด</th>
                  <th className="text-center px-5 py-3">สถานะ</th>
                  <th className="text-left px-5 py-3">ช่าง</th>
                  <th className="text-right px-5 py-3">ราคา</th>
                  <th className="text-left px-5 py-3">วันที่</th>
                  <th className="text-center px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      {Array.from({ length: 8 }).map((__, j) => (
                        <td key={j} className="px-5 py-3"><Skeleton className="h-5" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-10 text-gray-500">ไม่พบข้อมูล</td></tr>
                ) : (
                  filtered.map((order) => (
                    <tr key={order.WorkOrderID} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                      <td className="px-5 py-3 font-mono text-xs text-gray-400">#{order.WorkOrderID}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium">{order.Year} {order.Make} {order.Model}</p>
                        <p className="text-xs text-gray-400">{order.LicensePlate} • {order.CustFirst} {order.CustLast}</p>
                      </td>
                      <td className="px-5 py-3 max-w-[200px]">
                        <p className="truncate text-gray-200">{order.Description}</p>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[order.Status]}`}>
                          {order.Status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-300">{order.StaffFirst} {order.StaffLast}</td>
                      <td className="px-5 py-3 text-right font-medium">
                        {order.TotalCost > 0 ? `฿${order.TotalCost.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400">
                        {order.CreatedDate?.slice(0, 10)}
                        {order.CompletedDate && (
                          <p className="text-green-400">✓ {order.CompletedDate.slice(0, 10)}</p>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center gap-1.5 flex-wrap">
                          {/* Next status button */}
                          {nextStatus[order.Status] && (
                            <button
                              onClick={() => handleStatusUpdate(order, nextStatus[order.Status])}
                              title={`เปลี่ยนเป็น ${nextStatus[order.Status]}`}
                              className="text-xs px-2 py-1 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 rounded-lg transition whitespace-nowrap">
                              ▶ {nextStatus[order.Status] === "In Progress" ? "Start" : "Done"}
                            </button>
                          )}
                          {/* Cancel */}
                          {order.Status !== "Completed" && order.Status !== "Cancelled" && canEdit && (
                            <button onClick={() => handleStatusUpdate(order, "Cancelled")}
                              title="ยกเลิก"
                              className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition">
                              ✕
                            </button>
                          )}
                          {/* Edit */}
                          {canEdit && (
                            <button onClick={() => setEditOrder(order)}
                              title="แก้ไข"
                              className="text-xs px-2 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition">
                              ✏️
                            </button>
                          )}
                          {/* Delete */}
                          {canDelete && (
                            <button onClick={() => handleDelete(order.WorkOrderID)}
                              title="ลบ"
                              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition">
                              🗑
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {!loading && (
            <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-500">
              แสดง {filtered.length} จาก {orders.length} รายการ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}