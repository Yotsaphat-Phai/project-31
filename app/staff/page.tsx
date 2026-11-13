import { redirect } from "next/navigation";

// เข้า /staff แล้วไปหน้าสแกนทันที
export default function StaffIndex() {
  redirect("/staff/scan");
}
