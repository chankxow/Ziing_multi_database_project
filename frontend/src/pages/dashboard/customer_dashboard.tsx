// pages/dashboard/CustomerDashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard, Car, Wrench, Package, LogOut,
  RefreshCw, AlertCircle
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
    setLoading(true); setError("");
    apiFetch(url, token).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(d); setLoading(false); }).catch(e => { setError(e.message); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, token, tick, ...deps]);
  return { data, loading, error, refetch: () => setTick(n => n + 1) };
}
const STATUS_STYLE: Record<string, string> = {
  "Pending": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "In Progress": "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  "Completed": "bg-green-500/15 text-green-400 border border-green-500/30",
  "Cancelled": "bg-red-500/15 text-red-400 border border-red-500/30",
};
function Sk({ className = "" }: { className?: string }) { return <div className={`animate-pulse bg-gray-800 rounded-xl ${className}`} />; }
function Toast({ msg }: { msg: string }) { return msg ? <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 px-4 py-3 rounded-xl text-sm shadow-xl">{msg}</div> : null; }

function OverviewSection({ token }: { token: string }) {
  const { data, loading, error } = useGet<any>("/dashboard/customer", token);
  const summary = data?.summary; const customer = data?.customer;
  const vehicles: Vehicle[] = data?.vehicles ?? [];
  const workOrders: WorkOrder[] = data?.work_orders ?? [];
  const active = workOrders.filter(w => w.Status === "In Progress");
  if (error) return <p className="text-red-400 text-sm">no customer profile linked — go to register/customer first</p>;
  return (
    <div className="space-y-6">
      {customer && <p className="text-gray-400 text-sm">สวัสดี, <span className="text-white font-medium">{customer.FirstName} {customer.LastName}</span></p>}
      <section className="grid grid-cols-3 gap-5">
        {loading ? Array.from({length:3}).map((_,i) => <Sk key={i} className="h-28"/>) : (
          [{label:"รถของฉัน",value:summary?.total_vehicles??0,color:""},{label:"งานที่กำลังทำ",value:summary?.active_builds??0,color:"text-yellow-400"},{label:"ยอดรวมที่ชำระ",value:`฿${(summary?.total_spent??0).toLocaleString()}`,color:"text-green-400"}]
          .map((c,i) => <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</h3></div>)
        )}
      </section>
      {active.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-semibold mb-4">งานที่กำลังดำเนินการ</h3>
          {active.map(w => (
            <div key={w.WorkOrderID} className="bg-gray-800 p-4 rounded-xl mb-3 last:mb-0">
              <div className="flex justify-between items-start">
                <div><p className="font-medium">{w.Year} {w.Make} {w.Model} <span className="text-gray-400 text-sm">({w.LicensePlate})</span></p><p className="text-sm text-gray-300 mt-0.5">{w.Description}</p><p className="text-xs text-gray-500 mt-1">ช่าง: {w.StaffFirst} {w.StaffLast}</p></div>
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLE[w.Status]}`}>{w.Status}</span>
              </div>
              <div className="mt-3 w-full bg-gray-700 h-1.5 rounded-full"><div className="bg-red-500 h-1.5 rounded-full" style={{width:"60%"}}/></div>
            </div>
          ))}
        </div>
      )}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-semibold mb-4">รถของฉัน</h3>
          {loading ? <Sk className="h-20"/> : vehicles.length === 0 ? <p className="text-gray-500 text-sm">ยังไม่มีรถ</p>
            : vehicles.map(v => <div key={v.VehicleID} className="bg-gray-800 px-4 py-3 rounded-xl mb-2 last:mb-0"><p className="font-medium">{v.Year} {v.Make} {v.Model}</p><p className="text-xs text-gray-400">{v.Color} • {v.LicensePlate}</p></div>)}
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-semibold mb-4">ประวัติงาน</h3>
          {loading ? <Sk className="h-20"/> : workOrders.filter(w => w.Status==="Completed").length === 0 ? <p className="text-gray-500 text-sm">ยังไม่มีประวัติ</p>
            : workOrders.filter(w => w.Status==="Completed").map(w => (
              <div key={w.WorkOrderID} className="bg-gray-800 px-4 py-3 rounded-xl mb-2 last:mb-0 flex justify-between">
                <div><p className="text-sm font-medium">{w.Year} {w.Make} {w.Model}</p><p className="text-xs text-gray-400 truncate max-w-[160px]">{w.Description}</p><p className="text-xs text-gray-500">{w.CompletedDate?.slice(0,10)}</p></div>
                <p className="text-sm font-semibold text-green-400">฿{w.TotalCost.toLocaleString()}</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

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
    showToast("เพิ่มรถสำเร็จ"); setShowAdd(false); setForm({make:"",model:"",year:"",color:"",license_plate:""}); setFormErr(""); refetch();
  };
  const handleDelete = async (id: number) => {
    if (!confirm("ลบรถคันนี้?")) return;
    const res = await apiFetch(`/customer/vehicles/${id}`, token, {method:"DELETE"});
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    showToast("ลบรถสำเร็จ"); refetch();
  };

  return (
    <div className="space-y-5">
      <Toast msg={toast}/>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{safeV.length} คัน</p>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition">{showAdd?"ยกเลิก":"+ เพิ่มรถ"}</button>
      </div>
      {showAdd && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">เพิ่มรถใหม่</h3>
          {formErr && <p className="text-red-400 text-sm">{formErr}</p>}
          <div className="grid grid-cols-2 gap-3">
            {[{k:"make",l:"ยี่ห้อ *",p:"Toyota"},{k:"model",l:"รุ่น *",p:"Supra"},{k:"year",l:"ปี *",p:"2020"},{k:"color",l:"สี",p:"Black"}].map(f => (
              <div key={f.k}><label className="text-xs text-gray-400 mb-1 block">{f.l}</label><input value={(form as any)[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.p} className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500"/></div>
            ))}
            <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">ป้ายทะเบียน *</label><input value={form.license_plate} onChange={e=>set("license_plate",e.target.value)} placeholder="ABC-1234" className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500"/></div>
          </div>
          <button onClick={handleAdd} disabled={saving} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">{saving?"กำลังบันทึก...":"บันทึก"}</button>
        </div>
      )}
      {loading ? <div className="space-y-3">{Array.from({length:2}).map((_,i)=><Sk key={i} className="h-20"/>)}</div>
        : error ? <p className="text-red-400 text-sm">error</p>
        : safeV.length === 0 ? <p className="text-gray-500 text-sm">ยังไม่มีรถ</p>
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeV.map(v => (
              <div key={v.VehicleID} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex justify-between items-start">
                <div><p className="font-semibold text-lg">{v.Year} {v.Make} {v.Model}</p><p className="text-sm text-gray-400 mt-0.5">{v.Color} • {v.LicensePlate}</p></div>
                <button onClick={()=>handleDelete(v.VehicleID)} className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition">ลบ</button>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

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
    const res = await apiFetch("/customer/workorders", token, { method:"POST", body:JSON.stringify({vehicle_id:parseInt(form.vehicle_id), description:form.description}) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { setFormErr(json.error); return; }
    showToast("ส่งคำขอสำเร็จ"); setShowCreate(false); setForm({vehicle_id:"",description:""}); setFormErr(""); refetch();
  };

  return (
    <div className="space-y-5">
      <Toast msg={toast}/>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{workOrders.length} รายการ</p>
        <button onClick={()=>setShowCreate(!showCreate)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition">{showCreate?"ยกเลิก":"+ ขอซ่อม / แต่ง"}</button>
      </div>
      {showCreate && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">ส่งคำขอซ่อม / แต่งรถ</h3>
          {formErr && <p className="text-red-400 text-sm">{formErr}</p>}
          {vehicles.length === 0 ? <p className="text-yellow-400 text-sm">กรุณาเพิ่มรถก่อนในหน้า รถของฉัน</p>
            : <div className="space-y-3">
                <div><label className="text-xs text-gray-400 mb-1 block">เลือกรถ *</label>
                  <select value={form.vehicle_id} onChange={e=>setForm(f=>({...f,vehicle_id:e.target.value}))} className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500">
                    <option value="">-- เลือกรถ --</option>
                    {vehicles.map(v => <option key={v.VehicleID} value={v.VehicleID}>{v.Year} {v.Make} {v.Model} ({v.LicensePlate})</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-gray-400 mb-1 block">รายละเอียดที่ต้องการ *</label>
                  <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="เช่น ติดตั้ง Turbo, เปลี่ยนช่วงล่าง..." className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"/>
                </div>
                <button onClick={handleCreate} disabled={saving} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">{saving?"กำลังส่ง...":"ส่งคำขอ"}</button>
              </div>
          }
        </div>
      )}
      {loading ? <div className="space-y-3">{Array.from({length:2}).map((_,i)=><Sk key={i} className="h-20"/>)}</div>
        : workOrders.length === 0 ? <p className="text-gray-500 text-sm">ยังไม่มีรายการ</p>
        : workOrders.map(w => (
          <div key={w.WorkOrderID} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4 last:mb-0">
            <div className="flex justify-between items-start">
              <div><p className="font-semibold">{w.Year} {w.Make} {w.Model} <span className="text-gray-400 text-sm font-normal">({w.LicensePlate})</span></p><p className="text-sm text-gray-300 mt-1">{w.Description}</p><p className="text-xs text-gray-500 mt-1">ช่าง: {w.StaffFirst} {w.StaffLast} • {w.CreatedDate?.slice(0,10)}</p></div>
              <div className="text-right ml-4 flex-shrink-0"><span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLE[w.Status]}`}>{w.Status}</span>{w.TotalCost > 0 && <p className="text-sm font-semibold mt-1">฿{w.TotalCost.toLocaleString()}</p>}</div>
            </div>
            {w.Status === "In Progress" && <div className="mt-3 w-full bg-gray-700 h-1.5 rounded-full"><div className="bg-red-500 h-1.5 rounded-full" style={{width:"60%"}}/></div>}
          </div>
        ))
      }
    </div>
  );
}

function PartsSection({ token }: { token: string }) {
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const qp = new URLSearchParams();
  if (catFilter !== "all") qp.set("category", catFilter);
  if (search) qp.set("search", search);
  const { data: parts, loading, error, refetch } = useGet<Part[]>(`/customer/parts?${qp}`, token, [catFilter, search]);
  const { data: categories } = useGet<string[]>("/parts/categories", token);
  const safeParts: Part[] = Array.isArray(parts) ? parts : [];
  const safeCats: string[] = Array.isArray(categories) ? categories : [];

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500">อะไหล่ในสต็อก — อ่านข้อมูลได้อย่างเดียว</p>
      <div className="flex flex-wrap gap-3 items-center">
        <input placeholder="ค้นหาอะไหล่..." value={search} onChange={e=>setSearch(e.target.value)} className="bg-gray-800 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 w-52"/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} className="bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none">
          <option value="all">ทุก Category</option>
          {safeCats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={refetch} className="ml-auto bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl text-sm transition flex items-center gap-1"><RefreshCw size={13}/></button>
      </div>
      {error && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
      {loading ? <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Array.from({length:6}).map((_,i)=><Sk key={i} className="h-28"/>)}</div>
        : safeParts.length === 0 ? <p className="text-gray-500 text-sm">ไม่พบอะไหล่</p>
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeParts.map(p => (
              <div key={p.part_id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded-lg">{p.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.stock===0?"bg-red-500/20 text-red-400":p.stock<5?"bg-orange-500/20 text-orange-400":"bg-green-500/20 text-green-400"}`}>{p.stock===0?"หมด":`มี ${p.stock} ชิ้น`}</span>
                </div>
                <p className="font-semibold">{p.name}</p>
                {p.brand && <p className="text-xs text-gray-400 mt-0.5">{p.brand}</p>}
                {(p.compatible_models ?? []).length > 0 && <p className="text-xs text-gray-500 mt-2 truncate flex items-center gap-1"><Car size={11}/> {p.compatible_models!.join(", ")}</p>}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

const NAV: { label: string; section: Section; icon: string }[] = [
  { label:"Dashboard",     section:"dashboard",  icon:"" },
  { label:"รถของฉัน",     section:"vehicles",   icon:"" },
  { label:"งานซ่อม/แต่ง", section:"workorders", icon:"" },
  { label:"อะไหล่",        section:"parts",      icon:"" },
];


const CUST_NAV_ICONS: Record<string, React.ReactNode> = {
  dashboard:  <LayoutDashboard size={16} />,
  vehicles:   <Car size={16} />,
  workorders: <Wrench size={16} />,
  parts:      <Package size={16} />,
};

export default function CustomerDashboard() {
  const { user, logout, token } = useAuth();
  const [active, setActive] = useState<Section>("dashboard");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <aside className="w-60 bg-gray-900 border-r border-gray-800 p-6 flex flex-col flex-shrink-0">
        <div className="mb-8"><h1 className="text-2xl font-bold text-red-500">AutoPerf</h1><p className="text-xs text-gray-400">Customer Portal</p></div>
        <nav className="space-y-1 text-sm flex-1">
          {NAV.map(item => (
            <button key={item.section} onClick={()=>setActive(item.section)} className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg transition ${active===item.section?"bg-red-600 text-white":"text-gray-300 hover:bg-gray-800"}`}>
              <span className="flex-shrink-0">{CUST_NAV_ICONS[item.section]}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">{user?.username?.[0]?.toUpperCase()}</div>
            <div className="overflow-hidden"><p className="text-sm font-medium truncate">{user?.username}</p><p className="text-xs text-gray-500">Customer</p></div>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition"><LogOut size={12}/> ออกจากระบบ</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-semibold mb-6">{NAV.find(n=>n.section===active)?.label}</h2>
        {active==="dashboard"  && <OverviewSection   token={token!}/>}
        {active==="vehicles"   && <VehiclesSection   token={token!}/>}
        {active==="workorders" && <WorkOrdersSection token={token!}/>}
        {active==="parts"      && <PartsSection      token={token!}/>}
      </main>
    </div>
  );
}