// pages/PartsInventory.tsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:5000";

// ─── Types ──────────────────────────────────────────────
interface Part {
  part_id: string;
  name: string;
  category: string;
  brand?: string;
  price: number;
  stock: number;
  compatible_models?: string[];
}

// ─── Helpers ────────────────────────────────────────────
function apiFetch(url: string, token: string, opts: RequestInit = {}) {
  return fetch(`${API}${url}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts.headers ?? {}),
    },
  });
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-xl ${className}`} />;
}

const LOW_STOCK = 5;

const stockBadge = (stock: number) => {
  if (stock === 0) return "bg-red-500/20 text-red-400 border border-red-500/30";
  if (stock < LOW_STOCK) return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
  return "bg-green-500/20 text-green-400 border border-green-500/30";
};

// ─── Modal: Add / Edit Part ──────────────────────────────
const EMPTY_FORM = { part_id: "", name: "", category: "", brand: "", price: "", stock: "", compatible_models: "" };

function PartModal({
  part,
  categories,
  onClose,
  onSave,
}: {
  part: Part | null;
  categories: string[];
  onClose: () => void;
  onSave: (data: any, isEdit: boolean) => Promise<void>;
}) {
  const isEdit = !!part;
  const [form, setForm] = useState(
    part
      ? { ...part, price: String(part.price), stock: String(part.stock),
          compatible_models: (part.compatible_models ?? []).join(", ") }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.part_id || !form.name || !form.category || !form.price || !form.stock) {
      setErr("กรุณากรอกข้อมูลที่จำเป็นให้ครบ"); return;
    }
    setSaving(true);
    await onSave({
      part_id: form.part_id,
      name: form.name,
      category: form.category,
      brand: form.brand,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      compatible_models: form.compatible_models
        ? form.compatible_models.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
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
            <input disabled={isEdit} value={form.part_id} onChange={(e) => set("part_id", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">ชื่อ Part *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Category *</label>
            <input list="cat-list" value={form.category} onChange={(e) => set("category", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
            <datalist id="cat-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Brand</label>
            <input value={form.brand} onChange={(e) => set("brand", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">ราคา (฿) *</label>
            <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Stock *</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Compatible Models (คั่นด้วยจุลภาค)</label>
            <input value={form.compatible_models} onChange={(e) => set("compatible_models", e.target.value)}
              placeholder="เช่น Toyota Supra, GTR R35"
              className="w-full bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">
            ยกเลิก
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stock Adjust Modal ──────────────────────────────────
function StockModal({ part, onClose, onAdjust }: { part: Part; onClose: () => void; onAdjust: (part_id: string, delta: number) => Promise<void> }) {
  const [delta, setDelta] = useState(0);
  const [saving, setSaving] = useState(false);
  const newStock = part.stock + delta;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold">📦 ปรับ Stock</h2>
        <p className="text-sm text-gray-400">{part.name}</p>
        <div className="flex items-center gap-4 justify-center py-2">
          <button onClick={() => setDelta((d) => d - 1)}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl text-xl font-bold transition">−</button>
          <div className="text-center">
            <p className="text-3xl font-bold">{newStock < 0 ? 0 : newStock}</p>
            <p className="text-xs text-gray-500 mt-1">
              {delta > 0 ? `+${delta} เพิ่ม` : delta < 0 ? `${delta} ลด` : "ไม่เปลี่ยน"} (ปัจจุบัน: {part.stock})
            </p>
          </div>
          <button onClick={() => setDelta((d) => d + 1)}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl text-xl font-bold transition">+</button>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
          <button
            disabled={delta === 0 || saving}
            onClick={async () => { setSaving(true); await onAdjust(part.part_id, delta); setSaving(false); }}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition disabled:opacity-50">
            {saving ? "..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────
export default function PartsInventory() {
  const { token, user } = useAuth();
  const canEdit = user?.role === 1 || user?.role === 3; // Admin or Receptionist

  const [parts, setParts]           = useState<Part[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // Filters
  const [search,  setSearch]  = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [lowOnly, setLowOnly] = useState(false);

  // Modals
  const [editPart,  setEditPart]  = useState<Part | null | "new">(null);
  const [stockPart, setStockPart] = useState<Part | null>(null);
  const [delConfirm, setDelConfirm] = useState<Part | null>(null);

  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ─── Fetch parts ─────────────────────────────────────
  const fetchParts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (catFilter !== "all") params.set("category", catFilter);
      if (search) params.set("search", search);
      if (lowOnly) params.set("low_stock", "true");

      const res = await apiFetch(`/parts?${params}`, token!);
      setParts(await res.json());
    } catch { setError("โหลดข้อมูลไม่สำเร็จ"); }
    finally { setLoading(false); }
  }, [token, catFilter, search, lowOnly]);

  const fetchCategories = useCallback(async () => {
    const res = await apiFetch("/parts/categories", token!);
    setCategories(await res.json());
  }, [token]);

  useEffect(() => { fetchParts(); }, [fetchParts]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ─── Save part (add or edit) ──────────────────────────
  const handleSavePart = async (data: any, isEdit: boolean) => {
    const res = isEdit
      ? await apiFetch(`/parts/${data.part_id}`, token!, { method: "PUT", body: JSON.stringify(data) })
      : await apiFetch("/parts", token!, { method: "POST", body: JSON.stringify(data) });

    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    showToast(isEdit ? "✅ แก้ไขสำเร็จ" : "✅ เพิ่ม Part สำเร็จ");
    setEditPart(null);
    fetchParts();
    fetchCategories();
  };

  // ─── Adjust stock ─────────────────────────────────────
  const handleAdjustStock = async (part_id: string, delta: number) => {
    const res = await apiFetch(`/parts/${part_id}/stock`, token!, {
      method: "PATCH", body: JSON.stringify({ delta }),
    });
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    showToast("✅ อัปเดต Stock สำเร็จ");
    setStockPart(null);
    fetchParts();
  };

  // ─── Delete part ──────────────────────────────────────
  const handleDelete = async (part: Part) => {
    const res = await apiFetch(`/parts/${part.part_id}`, token!, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    showToast("🗑 ลบ Part สำเร็จ");
    setDelConfirm(null);
    fetchParts();
  };

  // ─── Stats ────────────────────────────────────────────
  const totalParts    = parts.length;
  const lowStockCount = parts.filter((p) => p.stock < LOW_STOCK).length;
  const outOfStock    = parts.filter((p) => p.stock === 0).length;
  const totalValue    = parts.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 px-4 py-3 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Modals */}
      {editPart !== null && (
        <PartModal
          part={editPart === "new" ? null : editPart}
          categories={categories}
          onClose={() => setEditPart(null)}
          onSave={handleSavePart}
        />
      )}
      {stockPart && (
        <StockModal part={stockPart} onClose={() => setStockPart(null)} onAdjust={handleAdjustStock} />
      )}
      {delConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="font-semibold">ยืนยันการลบ</h2>
            <p className="text-sm text-gray-400">ลบ <span className="text-white font-medium">{delConfirm.name}</span> ออกจากระบบ?</p>
            <div className="flex gap-3">
              <button onClick={() => setDelConfirm(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm transition">ยกเลิก</button>
              <button onClick={() => handleDelete(delConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm transition">ลบ</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Parts Inventory</h1>
            <p className="text-sm text-gray-400 mt-0.5">📦 MongoDB — {totalParts} รายการ</p>
          </div>
          {canEdit && (
            <button onClick={() => setEditPart("new")}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-sm font-medium transition">
              + เพิ่ม Part
            </button>
          )}
        </div>

        {/* Summary */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "รายการทั้งหมด",  value: totalParts,                     color: "text-white" },
            { label: "Low Stock",      value: lowStockCount,                   color: "text-orange-400" },
            { label: "หมด Stock",      value: outOfStock,                      color: "text-red-400" },
            { label: "มูลค่ารวม",      value: `฿${totalValue.toLocaleString()}`, color: "text-green-400" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </section>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            placeholder="🔍 ค้นหาชื่อ part..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 w-56"
          />
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded-xl text-sm focus:outline-none">
            <option value="all">ทุก Category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)}
              className="accent-red-500" />
            Low Stock เท่านั้น
          </label>
          <button onClick={fetchParts}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition ml-auto">
            🔄 Refresh
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Parts Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                  <th className="text-left px-5 py-3">Part ID</th>
                  <th className="text-left px-5 py-3">ชื่อ</th>
                  <th className="text-left px-5 py-3">Category</th>
                  <th className="text-left px-5 py-3">Brand</th>
                  <th className="text-right px-5 py-3">ราคา</th>
                  <th className="text-center px-5 py-3">Stock</th>
                  <th className="text-left px-5 py-3">Compatible</th>
                  <th className="text-center px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      {Array.from({ length: 8 }).map((__, j) => (
                        <td key={j} className="px-5 py-3">
                          <Skeleton className="h-5" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : parts.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-10 text-gray-500">ไม่พบข้อมูล</td></tr>
                ) : (
                  parts.map((part) => (
                    <tr key={part.part_id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
                      <td className="px-5 py-3 font-mono text-xs text-gray-400">{part.part_id}</td>
                      <td className="px-5 py-3 font-medium">{part.name}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded-lg">{part.category}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{part.brand ?? "—"}</td>
                      <td className="px-5 py-3 text-right font-medium">฿{part.price.toLocaleString()}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${stockBadge(part.stock)}`}>
                          {part.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 max-w-[160px] truncate">
                        {(part.compatible_models ?? []).join(", ") || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center gap-2">
                          {/* Stock adjust — all roles */}
                          <button onClick={() => setStockPart(part)}
                            title="ปรับ Stock"
                            className="text-xs px-2 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition">
                            📦
                          </button>
                          {canEdit && (
                            <>
                              <button onClick={() => setEditPart(part)}
                                title="แก้ไข"
                                className="text-xs px-2 py-1 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 rounded-lg transition">
                                ✏️
                              </button>
                              <button onClick={() => setDelConfirm(part)}
                                title="ลบ"
                                className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition">
                                🗑
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}