// pages/dashboard/CustomerDashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard, Car, Wrench, Package, LogOut,
  RefreshCw, AlertCircle, Plus, X, Menu
} from "lucide-react";

const API = "http://localhost:5000";
type Section = "dashboard" | "vehicles" | "workorders" | "parts";

interface Vehicle { VehicleID: number; Make: string; Model: string; Year: number; Color: string; LicensePlate: string; }
interface WorkOrder { WorkOrderID: number; Description: string; Status: string; TotalCost: number; CreatedDate: string; CompletedDate: string | null; Make: string; Model: string; Year: number; LicensePlate: string; StaffFirst: string; StaffLast: string; }
interface Part { part_id: string; name: string; category: string; brand?: string; stock: number; compatible_models?: string[]; }

function apiFetch(url: string, token: string, opts: RequestInit = {}) {
  return fetch(`${API}${url}`, { ...opts, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers ?? {}) } });
}

function useGet<T>(url: string, token: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
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

function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-xl ${className}`} />;
}
function Toast({ msg }: { msg: string }) {
  return msg
    ? <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 px-4 py-3 rounded-xl text-sm shadow-xl max-w-xs">{msg}</div>
    : null;
}

// ── Overview ──────────────────────────────────────────────
function OverviewSection({ token }: { token: string }) {
  const { data, loading, error } = useGet<any>("/dashboard/customer", token);
  const summary = data?.summary;
  const customer = data?.customer;
  const vehicles: Vehicle[] = data?.vehicles ?? [];
  const workOrders: WorkOrder[] = data?.work_orders ?? [];
  const active = workOrders.filter(w => w.Status === "In Progress");

  if (error) return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
      <AlertCircle size={16}/> ไม่พบโปรไฟล์ลูกค้า — กรุณาสมัครใหม่ผ่านหน้า Register
    </div>
  );

  return (
    <div className="space-y-5">
      {customer && (
        <p className="text-gray-400 text-sm">สวัสดี, <span className="text-white font-medium">{customer.FirstName} {customer.LastName}</span></p>
      )}

      {/* KPI cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? Array.from({length:3}).map((_,i) => <Sk key={i} className="h-24"/>) : (
          [
            { label:"รถของฉัน",       value: summary?.total_vehicles ?? 0,  color: "" },
            { label:"งานที่กำลังทำ",  value: summary?.active_builds  ?? 0,  color: "text-yellow-400" },
            { label:"ยอดรวมที่ชำระ",  value: `฿${(summary?.total_spent ?? 0).toLocaleString()}`, color: "text-green-400" },
          ].map((c, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <p className="text-sm text-gray-400">{c.label}</p>
              <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${c.color}`}>{c.value}</h3>
            </div>
          ))
        )}
      </section>

      {/* Active builds */}
      {active.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Wrench size={16} className="text-yellow-400"/> งานที่กำลังดำเนินการ</h3>
          <div className="space-y-3">
            {active.map(w => (
              <div key={w.WorkOrderID} className="bg-gray-800 p-4 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <p className="font-medium">{w.Year} {w.Make} {w.Model}
                      <span className="text-gray-400 text-sm"> ({w.LicensePlate})</span>
                    </p>
                    <p className="text-sm text-gray-300 mt-0.5">{w.Description}</p>
                    <p className="text-xs text-gray-500 mt-1">ช่าง: {w.StaffFirst} {w.StaffLast}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full self-start ${STATUS_STYLE[w.Status]}`}>{w.Status}</span>
                </div>
                <div className="mt-3 w-full bg-gray-700 h-1.5 rounded-full">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{width:"60%"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* รถ + ประวัติ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Car size={15}/> รถของฉัน</h3>
          {loading ? <Sk className="h-16"/>
            : vehicles.length === 0 ? <p className="text-gray-500 text-sm">ยังไม่มีรถ</p>
            : <div className="space-y-2">
                {vehicles.map(v => (
                  <div key={v.VehicleID} className="bg-gray-800 px-4 py-3 rounded-xl">
                    <p className="font-medium text-sm">{v.Year} {v.Make} {v.Model}</p>
                    <p className="text-xs text-gray-400">{v.Color} • {v.LicensePlate}</p>
                  </div>
                ))}
              </div>
          }
        </div>
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h3 className="font-semibold mb-4">ประวัติงาน</h3>
          {loading ? <Sk className="h-16"/>
            : workOrders.filter(w => w.Status === "Completed").length === 0
            ? <p className="text-gray-500 text-sm">ยังไม่มีประวัติ</p>
            : <div className="space-y-2">
                {workOrders.filter(w => w.Status === "Completed").map(w => (
                  <div key={w.WorkOrderID} className="bg-gray-800 px-4 py-3 rounded-xl flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{w.Year} {w.Make} {w.Model}</p>
                      <p className="text-xs text-gray-400 truncate">{w.Description}</p>
                      <p className="text-xs text-gray-500">{w.CompletedDate?.slice(0,10)}</p>
                    </div>
                    <p className="text-sm font-semibold text-green-400 flex-shrink-0">฿{w.TotalCost.toLocaleString()}</p>
                  </div>
                ))}
              </div>
          }
        </div>
      </section>
    </div>
  );
}

// ── Vehicles ──────────────────────────────────────────────
function VehiclesSection({ token }: { token: string }) {
  const { data, loading, error, refetch } = useGet<Vehicle[]>("/customer/vehicles", token);
  const safeV: Vehicle[] = Array.isArray(data) ? data : [];
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ make:"", model:"", year:"", color:"", license_plate:"" });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };
  const set = (k: string, v: string) => setForm(f => ({...f, [k]: v}));

  const handleAdd = async () => {
    if (!form.make || !form.model || !form.year || !form.license_plate) { setFormErr("กรุณากรอกข้อมูลที่จำเป็น"); return; }
    setSaving(true);
    const res = await apiFetch("/customer/vehicles", token, { method:"POST", body:JSON.stringify({...form, year:parseInt(form.year)}) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { setFormErr(json.error); return; }
    showToast("✅ เพิ่มรถสำเร็จ");
    setShowAdd(false); setForm({make:"",model:"",year:"",color:"",license_plate:""}); setFormErr(""); refetch();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ลบรถคันนี้?")) return;
    const res = await apiFetch(`/customer/vehicles/${id}`, token, { method:"DELETE" });
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    showToast("🗑 ลบรถสำเร็จ"); refetch();
  };

  return (
    <div className="space-y-5">
      <Toast msg={toast}/>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{safeV.length} คัน</p>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition">
          {showAdd ? <><X size={14}/> ยกเลิก</> : <><Plus size={14}/> เพิ่มรถ</>}
        </button>
      </div>

      {showAdd && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold">เพิ่มรถใหม่</h3>
          {formErr && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={13}/> {formErr}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {k:"make",  l:"ยี่ห้อ *",       p:"Toyota"},
              {k:"model", l:"รุ่น *",           p:"Supra"},
              {k:"year",  l:"ปี *",             p:"2020"},
              {k:"color", l:"สี",               p:"Black"},
            ].map(f => (
              <div key={f.k}>
                <label className="text-xs text-gray-400 mb-1 block">{f.l}</label>
                <input value={(form as any)[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.p}
                  className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500"/>
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">ป้ายทะเบียน *</label>
              <input value={form.license_plate} onChange={e=>set("license_plate",e.target.value)} placeholder="ABC-1234"
                className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500"/>
            </div>
          </div>
          <button onClick={handleAdd} disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      )}

      {loading
        ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({length:2}).map((_,i)=><Sk key={i} className="h-20"/>)}</div>
        : error ? <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={13}/> {error}</p>
        : safeV.length === 0 ? <p className="text-gray-500 text-sm">ยังไม่มีรถ กดเพิ่มรถด้านบนได้เลย</p>
        : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {safeV.map(v => (
              <div key={v.VehicleID} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold">{v.Year} {v.Make} {v.Model}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{v.Color} • {v.LicensePlate}</p>
                </div>
                <button onClick={()=>handleDelete(v.VehicleID)}
                  className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition flex-shrink-0">
                  ลบ
                </button>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── Work Orders ───────────────────────────────────────────
function WorkOrdersSection({ token }: { token: string }) {
  const { data: dashData, loading, refetch } = useGet<any>("/dashboard/customer", token);
  const vehicles: Vehicle[] = dashData?.vehicles ?? [];
  const workOrders: WorkOrder[] = dashData?.work_orders ?? [];
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ vehicle_id:"", description:"" });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const handleCreate = async () => {
    if (!form.vehicle_id || !form.description) { setFormErr("กรุณากรอกข้อมูลให้ครบ"); return; }
    setSaving(true);
    const res = await apiFetch("/customer/workorders", token, {
      method:"POST", body:JSON.stringify({vehicle_id:parseInt(form.vehicle_id), description:form.description}),
    });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { setFormErr(json.error); return; }
    showToast("✅ ส่งคำขอสำเร็จ ทีมงานจะติดต่อกลับเร็วๆ นี้");
    setShowCreate(false); setForm({vehicle_id:"",description:""}); setFormErr(""); refetch();
  };

  return (
    <div className="space-y-5">
      <Toast msg={toast}/>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{workOrders.length} รายการ</p>
        <button onClick={()=>setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition">
          {showCreate ? <><X size={14}/> ยกเลิก</> : <><Plus size={14}/> ขอซ่อม / แต่ง</>}
        </button>
      </div>

      {showCreate && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold">ส่งคำขอซ่อม / แต่งรถ</h3>
          {formErr && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={13}/> {formErr}</p>}
          {vehicles.length === 0
            ? <p className="text-yellow-400 text-sm">⚠️ กรุณาเพิ่มรถก่อนในหน้า "รถของฉัน"</p>
            : <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">เลือกรถ *</label>
                  <select value={form.vehicle_id} onChange={e=>setForm(f=>({...f,vehicle_id:e.target.value}))}
                    className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500">
                    <option value="">-- เลือกรถ --</option>
                    {vehicles.map(v => (
                      <option key={v.VehicleID} value={v.VehicleID}>
                        {v.Year} {v.Make} {v.Model} ({v.LicensePlate})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">รายละเอียดที่ต้องการ *</label>
                  <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                    rows={3} placeholder="เช่น ติดตั้ง Turbo, เปลี่ยนช่วงล่าง..."
                    className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"/>
                </div>
                <button onClick={handleCreate} disabled={saving}
                  className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
                  {saving ? "กำลังส่ง..." : "ส่งคำขอ"}
                </button>
              </div>
          }
        </div>
      )}

      {loading
        ? <div className="space-y-3">{Array.from({length:2}).map((_,i)=><Sk key={i} className="h-24"/>)}</div>
        : workOrders.length === 0
        ? <p className="text-gray-500 text-sm">ยังไม่มีรายการ</p>
        : <div className="space-y-4">
            {workOrders.map(w => (
              <div key={w.WorkOrderID} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold">{w.Year} {w.Make} {w.Model}
                      <span className="text-gray-400 text-sm font-normal"> ({w.LicensePlate})</span>
                    </p>
                    <p className="text-sm text-gray-300 mt-1">{w.Description}</p>
                    <p className="text-xs text-gray-500 mt-1">ช่าง: {w.StaffFirst} {w.StaffLast} • {w.CreatedDate?.slice(0,10)}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLE[w.Status]}`}>{w.Status}</span>
                    {w.TotalCost > 0 && <p className="text-sm font-semibold">฿{w.TotalCost.toLocaleString()}</p>}
                  </div>
                </div>
                {w.Status === "In Progress" && (
                  <div className="mt-3 w-full bg-gray-700 h-1.5 rounded-full">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{width:"60%"}}/>
                  </div>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── Parts ─────────────────────────────────────────────────
function PartsSection({ token }: { token: string }) {
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");

  const qp = new URLSearchParams();
  if (catFilter !== "all") qp.set("category", catFilter);
  if (search) qp.set("search", search);

  // ใช้ /parts/categories (เปิดให้ role 4 แล้ว) เพื่อดึง category list
  const { data: parts, loading, error, refetch } = useGet<Part[]>(
    `/customer/parts?${qp}`, token, [catFilter, search]
  );
  const { data: categories } = useGet<string[]>("/parts/categories", token);

  const safeParts: Part[]   = Array.isArray(parts)      ? parts      : [];
  const safeCats:  string[] = Array.isArray(categories) ? categories : [];

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Package size={13}/> อะไหล่ในสต็อก — อ่านข้อมูลได้อย่างเดียว
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          placeholder="ค้นหาอะไหล่..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 w-44 sm:w-52"
        />
        {/* Category tabs — scroll ได้บนมือถือ */}
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1 min-w-0">
          <button
            onClick={() => setCatFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition flex-shrink-0 ${
              catFilter === "all" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            ทั้งหมด
          </button>
          {safeCats.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition flex-shrink-0 ${
                catFilter === c ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <button onClick={refetch}
          className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl text-sm transition flex items-center gap-1 flex-shrink-0">
          <RefreshCw size={13}/>
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm flex items-center gap-1">
          <AlertCircle size={14}/> {error}
        </p>
      )}

      {/* Parts grid */}
      {loading
        ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length:6}).map((_,i) => <Sk key={i} className="h-28"/>)}
          </div>
        : safeParts.length === 0
        ? <p className="text-gray-500 text-sm">ไม่พบอะไหล่{catFilter !== "all" ? ` ใน "${catFilter}"` : ""}</p>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeParts.map(p => (
              <div key={p.part_id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded-lg">{p.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                    p.stock === 0 ? "bg-red-500/20 text-red-400"
                    : p.stock < 5 ? "bg-orange-500/20 text-orange-400"
                    : "bg-green-500/20 text-green-400"
                  }`}>
                    {p.stock === 0 ? "หมด" : `มี ${p.stock} ชิ้น`}
                  </span>
                </div>
                <p className="font-semibold mt-2">{p.name}</p>
                {p.brand && <p className="text-xs text-gray-400 mt-0.5">{p.brand}</p>}
                {(p.compatible_models ?? []).length > 0 && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex items-start gap-1">
                    <Car size={11} className="mt-0.5 flex-shrink-0"/>
                    {p.compatible_models!.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────
const NAV: { label: string; section: Section; icon: React.ReactNode }[] = [
  { label:"Dashboard",     section:"dashboard",  icon: <LayoutDashboard size={16}/> },
  { label:"รถของฉัน",     section:"vehicles",   icon: <Car size={16}/> },
  { label:"งานซ่อม/แต่ง", section:"workorders", icon: <Wrench size={16}/> },
  { label:"อะไหล่",        section:"parts",      icon: <Package size={16}/> },
];

// ── Main ──────────────────────────────────────────────────
export default function CustomerDashboard() {
  const { user, logout, token } = useAuth();
  const [active, setActive] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (s: Section) => { setActive(s); setSidebarOpen(false); };

  const Sidebar = () => (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 p-6 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-red-500">AutoPerf</h1>
        <p className="text-xs text-gray-400">Customer Portal</p>
      </div>
      <nav className="space-y-1 text-sm flex-1">
        {NAV.map(item => (
          <button key={item.section} onClick={() => handleNav(item.section)}
            className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg transition ${
              active === item.section ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"
            }`}>
            <span className="flex-shrink-0">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div className="pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-gray-500">Customer</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition">
          <LogOut size={12}/> ออกจากระบบ
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}/>
          <div className="absolute left-0 top-0 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={20}/>
          </button>
          <h1 className="text-lg font-bold text-red-500">AutoPerf</h1>
          <span className="text-sm text-gray-400 ml-auto">{NAV.find(n => n.section === active)?.label}</span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <h2 className="text-xl sm:text-2xl font-semibold mb-5">
            {NAV.find(n => n.section === active)?.label}
          </h2>
          {active === "dashboard"  && <OverviewSection   token={token!}/>}
          {active === "vehicles"   && <VehiclesSection   token={token!}/>}
          {active === "workorders" && <WorkOrdersSection token={token!}/>}
          {active === "parts"      && <PartsSection      token={token!}/>}
        </main>
      </div>
    </div>
  );
}