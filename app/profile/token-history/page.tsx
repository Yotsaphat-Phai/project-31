"use client";

import Link from "next/link";
import SubPage, { EmptyState, useMounted } from "../_components/SubPage";
import { getMyTokenHistory } from "../../_lib/tokens";

// ประวัติจริง: ทุกครั้งที่ staff สแกน QR หน้า TOKEN แล้วเติม/หัก จะบันทึกไว้ที่นี่
export default function TokenHistoryPage() {
  const mounted = useMounted();
  const history = mounted ? getMyTokenHistory() : [];

  return (
    <SubPage title="ประวัติการเติม / ใช้ TOKEN">
      {!mounted ? null : history.length === 0 ? (
        <EmptyState icon="bi-coin" text="ยังไม่มีรายการ TOKEN" />
      ) : (
        <div className="bg-white rounded-2xl border border-[#EEE6E6] divide-y divide-[#F3ECEC]">
          {history.map((h, i) => {
            const topup = h.delta > 0;
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <i className={`bi ${topup ? "bi-plus-circle-fill text-[#4E9C8F]" : "bi-dash-circle-fill text-[#E07A68]"} text-2xl`} />
                <div className="flex-1">
                  <p className="text-[15px] text-[#2F2F45]">{h.note}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(h.at).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <span className={`font-semibold ${topup ? "text-[#4E9C8F]" : "text-[#E07A68]"}`}>
                  {topup ? "+" : "−"}{Math.abs(h.delta).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <Link href="/token" className="block text-center text-[#D9A53B] font-semibold">
        <i className="bi bi-qr-code me-1.5" />ไปหน้า TOKEN ของฉัน
      </Link>
    </SubPage>
  );
}
