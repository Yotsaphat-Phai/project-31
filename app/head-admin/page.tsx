"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Role = "Admin" | "Staff" | "Vendor";
type Filter = "ทั้งหมด" | Role | "ระงับ" | "ถังขยะ";

type Account = {
  id: number;
  name: string;
  role: Role;
  active: boolean;
  color: string;
  deleted?: boolean;
};

const STORAGE_KEY = "head-admin-accounts";

const initialAccounts: Account[] = [
  { id: 1, name: "ณัฐพงศ์ พรมมาตร", role: "Admin", active: true, color: "bg-blue-500" },
  { id: 2, name: "ลลิตภัทร กันทา", role: "Staff", active: true, color: "bg-teal-600" },
  { id: 3, name: "สมชาย ใจดี", role: "Staff", active: false, color: "bg-gray-400" },
  { id: 4, name: "มานี รักงาน", role: "Staff", active: true, color: "bg-teal-600" },
  { id: 5, name: "ปรีชา สุขใจ", role: "Admin", active: true, color: "bg-blue-500" },
  { id: 6, name: "ร้านน้ำเย็น", role: "Vendor", active: true, color: "bg-[#C8A057]" },
  { id: 7, name: "ร้านขนมหวาน", role: "Vendor", active: true, color: "bg-pink-400" },
  { id: 8, name: "ร้านอาหารทะเล", role: "Vendor", active: true, color: "bg-orange-400" },
  { id: 9, name: "ร้านก๋วยเตี๋ยว", role: "Vendor", active: false, color: "bg-yellow-500" },
];

export default function HeadAdminPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ทั้งหมด");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Role>("Staff");
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAccounts(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    } catch {}
  }, [accounts, loaded]);

  const toggle = (id: number) =>
    setAccounts(accounts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));

  // ลบ = ย้ายไปถังขยะ (กู้คืนได้)
  const removeAccount = (id: number, name: string) => {
    const target = accounts.find((a) => a.id === id);
    const adminCount = accounts.filter((a) => a.role === "Admin" && !a.deleted).length;

    if (target?.role === "Admin" && adminCount <= 1) {
      alert("ลบไม่ได้ ต้องเหลือ Admin อย่างน้อย 1 คน");
      return;
    }

    if (confirm(`ย้ายบัญชี "${name}" ไปถังขยะ?\nสามารถกู้คืนได้ภายหลัง`)) {
      setAccounts(accounts.map((a) => (a.id === id ? { ...a, deleted: true } : a)));
    }
  };

  const restoreAccount = (id: number) =>
    setAccounts(accounts.map((a) => (a.id === id ? { ...a, deleted: false } : a)));

  const purgeAccount = (id: number, name: string) => {
    if (confirm(`ลบบัญชี "${name}" ถาวร?\nการลบย้อนกลับไม่ได้`)) {
      setAccounts(accounts.filter((a) => a.id !== id));
    }
  };

  const addAccount = () => {
    if (!newName.trim()) {
      alert("กรุณาใส่ชื่อบัญชี");
      return;
    }
    const colors: Record<Role, string> = {
      Admin: "bg-blue-500",
      Staff: "bg-teal-600",
      Vendor: "bg-orange-400",
    };
    setAccounts([
      ...accounts,
      {
        id: Date.now(),
        name: newName.trim(),
        role: newRole,
        active: true,
        color: colors[newRole],
      },
    ]);
    setNewName("");
    setNewRole("Staff");
    setShowAdd(false);
  };

  const tabs: Filter[] = ["ทั้งหมด", "Admin", "Staff", "Vendor", "ระงับ", "ถังขยะ"];

  const live = accounts.filter((a) => !a.deleted);

  const counts: Record<Filter, number> = {
    ทั้งหมด: live.length,
    Admin: live.filter((a) => a.role === "Admin").length,
    Staff: live.filter((a) => a.role === "Staff").length,
    Vendor: live.filter((a) => a.role === "Vendor").length,
    ระงับ: live.filter((a) => !a.active).length,
    ถังขยะ: accounts.filter((a) => a.deleted).length,
  };

  const filtered = accounts.filter((a) => {
    if (filter === "ถังขยะ") return !!a.deleted && a.name.includes(search);
    if (a.deleted) return false;
    const matchFilter =
      filter === "ทั้งหมด" ||
      (filter === "ระงับ" ? !a.active : a.role === filter);
    return matchFilter && a.name.includes(search);
  });

  if (!loaded) return null;

  const inTrash = filter === "ถังขยะ";

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-800">จัดการบัญชี</h1>
            <span className="bg-[#B86BA6] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Head Admin
            </span>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อบัญชี"
            className="w-full bg-white rounded-xl p-3 text-sm outline-none border border-orange-100 mb-3"
          />

          <div className="flex flex-wrap gap-1.5 mb-3">
            {tabs.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-semibold border ${
                  filter === f
                    ? "bg-[#B86BA6] text-white border-[#B86BA6]"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {f} ({counts[f]})
              </button>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm">
                {inTrash ? "ถังขยะว่างเปล่า" : "ไม่พบบัญชี"}
              </div>
            ) : (
              filtered.map((a) => (
                <div
                  key={a.id}
                  className={`bg-white rounded-xl p-3 flex items-center gap-3 border border-orange-100 ${
                    a.active && !inTrash ? "" : "opacity-60"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${a.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{a.name}</p>
                    <p className="text-[11px] text-gray-500">
                      {a.role}
                      {!a.active && !inTrash && " · ระงับการใช้งาน"}
                    </p>
                  </div>

                  {inTrash ? (
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => restoreAccount(a.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white"
                      >
                        กู้คืน
                      </button>
                      <button
                        onClick={() => purgeAccount(a.id, a.name)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-300 text-red-500"
                      >
                        ลบถาวร
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => toggle(a.id)}
                        className={`relative w-11 h-6 rounded-full transition flex-shrink-0 ${
                          a.active ? "bg-teal-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            a.active ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => removeAccount(a.id, a.name)}
                        className="text-red-400 hover:text-red-500 px-1 flex-shrink-0"
                        aria-label="ย้ายไปถังขยะ"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <button
          onClick={() => setShowAdd(true)}
          className="w-full max-w-md mx-auto block bg-[#B86BA6] text-white text-sm font-semibold py-3.5 rounded-xl active:scale-95 transition"
        >
          + เพิ่มบัญชี Admin / Staff / Vendor
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4">เพิ่มบัญชีใหม่</h2>

            <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อบัญชี</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="เช่น สมหญิง ใจงาม"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none mb-3"
            />

            <label className="block text-xs font-semibold text-gray-700 mb-1">ประเภท</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["Admin", "Staff", "Vendor"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setNewRole(r)}
                  className={`py-2 rounded-xl text-xs font-semibold border-2 ${
                    newRole === r
                      ? "bg-[#F5EAFE] text-[#9E4B8E] border-[#9E4B8E]"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="py-3 rounded-xl text-sm font-semibold border-2 border-[#B86BA6] text-[#B86BA6]"
              >
                ยกเลิก
              </button>
              <button
                onClick={addAccount}
                className="py-3 rounded-xl text-sm font-semibold bg-[#B86BA6] text-white"
              >
                เพิ่มบัญชี
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around">
        <Link href="/head-admin/report" className="flex flex-col items-center text-gray-400 py-1">
          <i className="bi bi-bar-chart-fill text-2xl leading-none" />
          <span className="text-[10px] mt-0.5">รายงาน</span>
        </Link>
        <Link href="/head-admin" className="flex flex-col items-center text-[#9E4B8E] py-1">
          <i className="bi bi-people-fill text-2xl leading-none" />
          <span className="text-[10px] mt-0.5 font-semibold">บัญชี</span>
        </Link>
        <Link href="/head-admin/audit" className="flex flex-col items-center text-gray-400 py-1">
          <i className="bi bi-journal-text text-2xl leading-none" />
          <span className="text-[10px] mt-0.5">Audit Log</span>
        </Link>
      </nav>
    </div>
  );
}