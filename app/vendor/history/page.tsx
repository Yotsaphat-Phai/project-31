"use client";

import Link from "next/link";
import { useState } from "react";

// ===== Icons =====
function StoreIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
    </svg>
  );
}

function ClipboardIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  );
}

function CoinIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-1.1a3 3 0 0 1-2.5-2.9h2a1 1 0 0 0 1 1h1a1 1 0 0 0 0-2h-1a3 3 0 0 1-.5-5.9V5h2v1.1a3 3 0 0 1 2.5 2.9h-2a1 1 0 0 0-1-1h-1a1 1 0 0 0 0 2h1a3 3 0 0 1 .5 5.9V17Z" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
    </svg>
  );
}

function RefundIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Z" clipRule="evenodd" />
    </svg>
  );
}

// ===== Types & Mock data =====
type Transaction = {
  id: string;
  customerName: string;
  amount: number;
  time: string;
  date: string;
  status: "success" | "refunded";
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN001", customerName: "คุณสมชาย ก.", amount: 45, time: "14:32", date: "วันนี้", status: "success" },
  { id: "TXN002", customerName: "คุณมานี ส.", amount: 60, time: "13:15", date: "วันนี้", status: "success" },
  { id: "TXN003", customerName: "คุณพีระพล จ.", amount: 30, time: "11:48", date: "วันนี้", status: "success" },
  { id: "TXN004", customerName: "คุณวิชัย ท.", amount: 75, time: "10:22", date: "วันนี้", status: "refunded" },
  { id: "TXN005", customerName: "คุณสุดา บ.", amount: 90, time: "09:10", date: "วันนี้", status: "success" },
  { id: "TXN006", customerName: "คุณกิตติ ร.", amount: 55, time: "17:45", date: "เมื่อวาน", status: "success" },
  { id: "TXN007", customerName: "คุณพิมพ์ ภ.", amount: 120, time: "15:30", date: "เมื่อวาน", status: "success" },
  { id: "TXN008", customerName: "คุณธนา ว.", amount: 40, time: "12:05", date: "เมื่อวาน", status: "success" },
];

const TABS = ["วันนี้", "สัปดาห์นี้", "ทั้งหมด"] as const;
type TabType = (typeof TABS)[number];

export default function VendorHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("วันนี้");

  const filtered = MOCK_TRANSACTIONS.filter((t) => {
    if (activeTab === "วันนี้") return t.date === "วันนี้";
    return true;
  });

  const totalToken = filtered
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCount = filtered.filter((t) => t.status === "success").length;

  const grouped = filtered.reduce<Record<string, Transaction[]>>((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm h-[844px] bg-[#FDF5EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-800">ประวัติรายการ</h1>
          <span className="bg-[#C8A057] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Vendor
          </span>
        </div>

        {/* Summary Card */}
        <div className="px-4 mb-3">
          <div className="bg-gradient-to-br from-[#C8A057] to-[#B08A42] rounded-2xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90">รวมที่รับ ({activeTab})</p>
                <p className="text-3xl font-bold mt-1">
                  {totalToken} <span className="text-sm font-semibold opacity-80">TOKEN</span>
                </p>
                <p className="text-xs opacity-90 mt-1">{totalCount} รายการ</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <CoinIcon className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 mb-3">
          <div className="bg-white rounded-xl p-1 flex gap-1 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-[#C8A057] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ClipboardIcon className="w-16 h-16 mb-3 opacity-50" />
              <p className="text-sm">ยังไม่มีรายการ</p>
            </div>
          ) : (
            Object.entries(grouped).map(([date, items]) => (
              <div key={date} className="mb-4">
                <p className="text-[11px] font-semibold text-gray-500 mb-2 px-1">{date}</p>
                <div className="space-y-2">
                  {items.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          t.status === "success"
                            ? "bg-[#FDF5EC] text-[#C8A057]"
                            : "bg-red-50 text-red-400"
                        }`}
                      >
                        {t.status === "success" ? (
                          <CheckIcon className="w-5 h-5" />
                        ) : (
                          <RefundIcon className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {t.customerName}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {t.id} · {t.time}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-sm font-bold ${
                            t.status === "success"
                              ? "text-[#C8A057]"
                              : "text-red-400 line-through"
                          }`}
                        >
                          +{t.amount}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {t.status === "success" ? "TOKEN" : "คืนเงิน"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Navigation — ขายสินค้าไป /vendor/scan / ประวัติรายการ active */}
        <nav className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around">
          <Link
            href="/vendor/scan"
            className="group flex flex-col items-center py-1 px-6 text-gray-400 hover:text-[#C8A057] transition-colors"
          >
            <StoreIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-xs mt-0.5 group-hover:font-semibold">ขายสินค้า</span>
          </Link>
          <Link
            href="/vendor/history"
            className="group flex flex-col items-center py-1 px-6 text-[#C8A057] transition-colors"
          >
            <ClipboardIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-xs mt-0.5 font-semibold">ประวัติรายการ</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}   