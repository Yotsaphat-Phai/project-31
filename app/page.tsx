"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register, homeFor } from "./_lib/auth";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [error, setError] = useState("");

  const switchTab = (tab: "login" | "register") => {
    setActiveTab(tab);
    setError("");
  };

  // Login → เช็คกับบัญชีใน localStorage แล้วพาไปหน้าตาม role ของบัญชี
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = login(loginEmail, loginPassword);
      router.push(homeFor(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  // Register → บันทึกบัญชีใหม่ (role user) ลง localStorage แล้วไป /event
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (regPassword !== regConfirm) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const user = register({ name: regName, email: regEmail, password: regPassword });
      router.push(homeFor(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "สมัครสมาชิกไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF5EC] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#FDF5EC] rounded-3xl p-6 sm:p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E85D5D] rounded-full mb-4 shadow-lg">
            <i className="bi bi-ticket-perforated-fill text-white text-4xl"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Registration & Ticket
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            ระบบลงทะเบียนและจองบัตรงานเลี้ยงรุ่น
          </p>
        </div>

        {/* Tab Switch */}
        <div className="bg-white rounded-full p-1 flex mb-6 shadow-sm">
          <button
            onClick={() => switchTab("login")}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition ${
              activeTab === "login"
                ? "bg-[#E85D5D] text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => switchTab("register")}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition ${
              activeTab === "register"
                ? "bg-[#E85D5D] text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            สมัครสมาชิก
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <i className="bi bi-exclamation-circle-fill mr-1"></i>
            {error}
          </div>
        )}

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                อีเมล / เบอร์โทร
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent outline-none transition text-gray-800"
                placeholder="name@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent outline-none transition text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-[#E85D5D] hover:underline">
                ลืมรหัสผ่าน?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E85D5D] text-white font-semibold py-3.5 rounded-xl hover:bg-[#d54f4f] active:scale-95 transition shadow-lg"
            >
              เข้าสู่ระบบ
            </button>

            <div className="bg-[#E8F5E9] border border-green-100 rounded-xl p-3 text-center mt-4">
              <p className="text-xs text-green-800 leading-relaxed">
                <i className="bi bi-info-circle-fill text-green-600 mr-1"></i>
                ระบบจะพาไปหน้าตามสิทธิ์ของบัญชีโดยอัตโนมัติ
                <br />
                ยังไม่มีบัญชี? กด &quot;สมัครสมาชิก&quot; · หากพบปัญหาติดต่อ Admin
              </p>
            </div>
          </form>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent outline-none transition text-gray-800"
                placeholder="เช่น สมชาย ใจดี"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                อีเมล
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent outline-none transition text-gray-800"
                placeholder="name@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent outline-none transition text-gray-800"
                placeholder="อย่างน้อย 6 ตัว"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                ยืนยันรหัสผ่าน
              </label>
              <input
                type="password"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent outline-none transition text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E85D5D] text-white font-semibold py-3.5 rounded-xl hover:bg-[#d54f4f] active:scale-95 transition shadow-lg"
            >
              สมัครสมาชิก
            </button>
          </form>
        )}
      </div>
    </div>
  );
}