"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ParticipantsPage() {
  const router = useRouter();
  const quantity = 2;

  const [participants, setParticipants] = useState([
    { name: "สมชาย ใจดี", class: "20XX", phone: "08x-xxx-xxxx" },
    { name: "", class: "", phone: "" },
  ]);

  const updateParticipant = (idx: number, field: string, value: string) => {
    const newList = [...participants];
    newList[idx] = { ...newList[idx], [field]: value };
    setParticipants(newList);
  };

  const handleNext = () => {
    // ไปหน้าชำระเงิน
    router.push("/event/payment");
  };

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Link href="/event" className="text-gray-700 text-xl">‹</Link>
            <h1 className="text-base font-bold text-gray-800">ข้อมูลผู้เข้าร่วม</h1>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-5 px-2">
            {/* Step 1 - Active */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#E85D5D] flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <span className="text-[10px] mt-1 text-[#E85D5D] font-semibold">
                ข้อมูล
              </span>
            </div>

            {/* Line */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-1 mb-4"></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                2
              </div>
              <span className="text-[10px] mt-1 text-gray-400">ชำระเงิน</span>
            </div>

            {/* Line */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-1 mb-4"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                3
              </div>
              <span className="text-[10px] mt-1 text-gray-400">รับ QR</span>
            </div>
          </div>

          {/* Participant Cards */}
          <div className="space-y-3">
            {participants.map((p, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm font-bold text-gray-800 mb-3">
                  ผู้เข้าร่วมคนที่ {idx + 1} / {quantity}
                </p>

                {/* ชื่อ-นามสกุล */}
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updateParticipant(idx, "name", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-[#FDF5EC] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent outline-none text-gray-800"
                    placeholder="เช่น สมชาย ใจดี"
                    required
                  />
                </div>

                {/* รุ่น + เบอร์โทร */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      รุ่น
                    </label>
                    <input
                      type="text"
                      value={p.class}
                      onChange={(e) => updateParticipant(idx, "class", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-[#FDF5EC] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E85D5D] outline-none text-gray-800"
                      placeholder="20XX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      เบอร์โทร
                    </label>
                    <input
                      type="tel"
                      value={p.phone}
                      onChange={(e) => updateParticipant(idx, "phone", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-[#FDF5EC] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E85D5D] outline-none text-gray-800"
                      placeholder="08x-xxx-xxxx"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleNext}
            className="w-full bg-[#E85D5D] text-white text-sm font-semibold py-3.5 rounded-xl shadow-lg active:scale-95 transition mt-4"
          >
            ไปชำระเงิน
          </button>

        </div>
      </div>
    </div>
  );
}