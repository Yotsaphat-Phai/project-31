import Link from "next/link";
import SubPage, { EmptyState } from "../_components/SubPage";

// TODO: ดึงประวัติจริงจาก backend (ตอนนี้ยังไม่มีรายการ)
const history: { id: string; type: "topup" | "spend"; amount: number; where: string; at: string }[] = [];

export default function TokenHistoryPage() {
  return (
    <SubPage title="ประวัติการเติม / ใช้ TOKEN">
      {history.length === 0 ? (
        <EmptyState icon="bi-coin" text="ยังไม่มีรายการ TOKEN" />
      ) : (
        <div className="bg-white rounded-2xl border border-[#EEE6E6] divide-y divide-[#F3ECEC]">
          {history.map((h) => (
            <div key={h.id} className="flex items-center gap-3 px-4 py-3.5">
              <i className={`bi ${h.type === "topup" ? "bi-plus-circle-fill text-[#4E9C8F]" : "bi-dash-circle-fill text-[#E07A68]"} text-2xl`} />
              <div className="flex-1">
                <p className="text-[15px] text-[#2F2F45]">{h.where}</p>
                <p className="text-xs text-gray-400">{h.at}</p>
              </div>
              <span className="font-semibold">{h.type === "topup" ? "+" : "-"}{h.amount}</span>
            </div>
          ))}
        </div>
      )}
      <Link href="/token" className="block text-center text-[#D9A53B] font-semibold">
        <i className="bi bi-qr-code me-1.5" />ไปหน้า TOKEN ของฉัน
      </Link>
    </SubPage>
  );
}
