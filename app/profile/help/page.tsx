import SubPage from "../_components/SubPage";

const faqs = [
  { q: "ซื้อบัตรแล้วดูบัตรได้ที่ไหน?", a: "ไปที่เมนู “บัตรของฉัน” ที่แถบด้านล่าง แล้วแสดง QR ให้ทีมงานสแกนหน้างาน" },
  { q: "เติม TOKEN อย่างไร?", a: "เปิดหน้า TOKEN แล้วแสดง QR ให้ทีมงานที่จุดเติมเงินสแกน" },
  { q: "TOKEN ที่เหลือคืนเงินได้ไหม?", a: "ติดต่อทีมงานที่จุดบริการภายในงานก่อนงานเลิก" },
  { q: "ลืมรหัสผ่านต้องทำอย่างไร?", a: "ติดต่อทีมงานผ่านช่องทางด้านล่างเพื่อรีเซ็ตรหัสผ่าน" },
];

// TODO: เปลี่ยนเป็นช่องทางติดต่อจริงของทีมงาน
const contacts = [
  { icon: "bi-telephone-fill", label: "โทร", value: "02-000-0000", href: "tel:020000000", color: "#4E9C8F" },
  { icon: "bi-envelope-fill", label: "อีเมล", value: "support@example.com", href: "mailto:support@example.com", color: "#E07A68" },
];

export default function HelpPage() {
  return (
    <SubPage title="ช่วยเหลือ / ติดต่อทีมงาน">
      <section className="space-y-2">
        <h3 className="px-2 text-sm font-semibold text-gray-500">คำถามที่พบบ่อย</h3>
        {faqs.map((f) => (
          <details key={f.q} className="group bg-white rounded-2xl border border-[#EEE6E6] px-4 py-3.5">
            <summary className="flex items-center justify-between cursor-pointer list-none text-[15px] text-[#2F2F45]">
              {f.q}
              <i className="bi bi-chevron-down text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 text-sm text-gray-500">{f.a}</p>
          </details>
        ))}
      </section>

      <section className="space-y-2">
        <h3 className="px-2 text-sm font-semibold text-gray-500">ติดต่อทีมงาน</h3>
        <div className="bg-white rounded-2xl border border-[#EEE6E6] divide-y divide-[#F3ECEC]">
          {contacts.map((c) => (
            <a key={c.label} href={c.href} className="flex items-center gap-3 px-4 py-3.5">
              <i className={`bi ${c.icon} text-xl`} style={{ color: c.color }} />
              <span className="flex-1 text-[15px] text-[#2F2F45]">{c.label}</span>
              <span className="text-sm text-gray-500">{c.value}</span>
            </a>
          ))}
        </div>
      </section>
    </SubPage>
  );
}
