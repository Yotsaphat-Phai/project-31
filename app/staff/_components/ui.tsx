export function StaffBadge() {
  return (
    <span className="rounded-full bg-[#2f8f7f] px-3 py-1 text-xs font-semibold text-white">
      Staff
    </span>
  );
}

export function Avatar() {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2f8f7f]">
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
      </svg>
    </div>
  );
}

type UserInfoProps = {
  name: string;
  meta: string;
};

export function UserInfo({ name, meta }: UserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar />
      <div>
        <p className="font-semibold text-[#1f2a2e]">{name}</p>
        <p className="text-xs text-neutral-500">{meta}</p>
      </div>
    </div>
  );
}

