'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck, AlertTriangle } from 'lucide-react';

// ข้อมูลเข้าสู่ระบบของแอดมิน (เฉพาะเดโม่)
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = '123456';
const ADMIN_OTP = '123456';

/** หน้าเข้าสู่ระบบ Admin — อีเมล + รหัสผ่าน + OTP 6 หลัก */
export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, v: string) => {
    const only = v.replace(/\D/g, '').slice(-1);
    setOtp((cur) => {
      const next = [...cur];
      next[i] = only;
      return next;
    });
    setError(null);
    if (only && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) inputs.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = Array(6).fill('').map((_, i) => text[i] ?? '');
    setOtp(next);
    inputs.current[Math.min(text.length, 5)]?.focus();
  };

  const canSubmit = !!email && !!password && otp.every((d) => d !== '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const otpCode = otp.join('');
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError('อีเมลผู้ดูแลไม่ถูกต้อง');
      return;
    }
    if (password !== ADMIN_PASSWORD) {
      setError('รหัสผ่านไม่ถูกต้อง');
      return;
    }
    if (otpCode !== ADMIN_OTP) {
      setError('รหัส OTP ไม่ถูกต้อง');
      return;
    }

    setError(null);
    router.push('/admin');
  };

  return (
    <main className="login-main">
      {/* แถบบนสุด: ปุ่มย้อนกลับ + ป้าย Admin */}
      <div className="login-top">
        <button className="icon-btn" aria-label="ย้อนกลับ" onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
        <span className="role-badge">Admin</span>
      </div>

      <p className="login-crumb">Login · Admin</p>

      <form className="login-card" onSubmit={submit}>
        <div className="login-shield">
          <ShieldCheck size={38} color="#fff" strokeWidth={2.2} />
        </div>
        <h1 className="login-title">เข้าสู่ระบบ Admin</h1>
        <p className="login-sub">สำหรับผู้ดูแลระบบ (Admin)</p>

        <label className="field">
          อีเมลผู้ดูแล
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="name@test.com"
            autoComplete="username"
          />
        </label>

        <label className="field">
          รหัสผ่าน
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <div className="field" style={{ marginBottom: 6 }}>
          รหัส OTP (6 หลัก)
          <div className="otp-row">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                className="otp-box"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={onPaste}
                aria-label={`OTP หลักที่ ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <button type="button" className="login-resend" onClick={() => setOtp(Array(6).fill(''))}>
          ส่งรหัสอีกครั้ง
        </button>

        {error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              marginBottom: 12,
              borderRadius: 12,
              background: '#FBE6DF',
              color: '#C0392B',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <button
          type="submit"
          className="login-submit"
          disabled={!canSubmit}
          style={!canSubmit ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
        >
          เข้าสู่ระบบอย่างปลอดภัย
        </button>
      </form>

      <div className="login-note">
        <AlertTriangle size={14} color="#D99A1F" />
        <div>
          <strong>โซนที่มีการเข้าถึงจำกัด</strong>
          <div className="sub" style={{ marginTop: 2 }}>ทุกการเข้าสู่ระบบถูกบันทึกและตรวจสอบ (Audit Log)</div>
        </div>
      </div>

      <p className="note" style={{ marginTop: 10 }}>
        ไม่ใช่แอดมิน? <Link href="/admin" style={{ color: '#5E8BC9', textDecoration: 'none', fontWeight: 600 }}>กลับหน้าแรก</Link>
      </p>
    </main>
  );
}
