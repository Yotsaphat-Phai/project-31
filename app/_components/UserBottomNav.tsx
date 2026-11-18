import Link from "next/link";

export type UserNavKey = "home" | "ticket" | "token" | "profile";

const items = [
  { key: "home", href: "/events", label: "หน้าแรก", icon: "bi-house-door-fill", color: "#E07A68" },
  { key: "ticket", href: "/event/ticket", label: "บัตรของฉัน", icon: "bi-ticket-perforated-fill", color: "#EBB654" },
  { key: "token", href: "/token", label: "TOKEN", icon: "bi-coin", color: "#D9A53B" },
  { key: "profile", href: "/profile", label: "โปรไฟล์", icon: "bi-person-fill", color: "#A86BA6" },
] as const;

/* แถบเมนูล่างของ role user — ใช้ร่วมกันทุกหน้า */
export default function UserBottomNav({ active }: { active: UserNavKey }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#EEE6E6]">
      <div className="max-w-md mx-auto flex justify-around py-3">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <Link
              key={it.key}
              href={it.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-1 w-20"
            >
              <i className={`bi ${it.icon} text-3xl leading-none`} style={{ color: it.color }} />
              <span
                className={`text-sm ${isActive ? "font-semibold" : "text-gray-500"}`}
                style={isActive ? { color: it.color } : undefined}
              >
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
