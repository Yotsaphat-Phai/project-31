"use client";

import { Suspense } from "react";
import ScanView from "../_components/ScanView";

export default function StaffScanPage() {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-[390px] flex-col overflow-hidden bg-[#1f2a2e]">
      <Suspense fallback={null}>
        <ScanView mode="checkin" />
      </Suspense>
    </main>
  );
}
