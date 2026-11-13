"use client";

import Link from "next/link";
import QRCode from "react-qr-code";

// ===== Icons (SVG) =====
function StoreIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
      />
    </svg>
  );
}

function ClipboardIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
      />
    </svg>
  );
}

export default function VendorPage() {
  // placeholder — เปลี่ยนเป็นข้อมูลจริงทีหลัง เช่น vendor id, payment url
  const qrValue = "vendor:shop-cold-drink:001";

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Container */}
      <div className="w-full max-w-sm h-[844px] bg-[#FDF5EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">

          {/* Vendor badge อย่างเดียว (ลบชื่อร้านออก) */}
          <div className="flex items-center justify-end mb-4">
            <span className="bg-[#C8A057] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Vendor
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <div className="aspect-square bg-white rounded-lg flex items-center justify-center p-3">
              <QRCode
                value={qrValue}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
                level="H"
              />
            </div>
          </div>

          {/* ลบปุ่มสแกน QR ออก เหลือแค่ยอดรวม */}
          <div className="mb-6">
            <p className="text-xs text-gray-500">รวมที่รับ (ล่าสุดในวันนี้)</p>
            <p className="text-2xl font-bold text-[#C8A057]">95 TOKEN</p>
          </div>

        </div>

        {/* Bottom Navigation — SVG icons + hover effect */}
        <nav className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around">
          <Link
            href="/vendor"
            className="group flex flex-col items-center py-1 px-6 text-[#C8A057] transition-colors"
          >
            <StoreIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-xs mt-0.5 font-semibold">ขายสินค้า</span>
          </Link>
          <Link
            href="#"
            className="group flex flex-col items-center py-1 px-6 text-gray-400 hover:text-[#C8A057] transition-colors"
          >
            <ClipboardIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-xs mt-0.5 group-hover:font-semibold">ประวัติรายการ</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}