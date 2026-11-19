'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { attendees as seedAttendees, initialEvent, initialSlips, initialStores } from './mockData';
import { SUPPORT_SEED } from './supportSeed';
import { WITHDRAWAL_SEED } from './withdrawalSeed';
import type { Attendee, EventConfig, Slip, Store, SupportTicket, WithdrawRequest } from './types';

const STORAGE_KEY = 'next-admin:v1';

interface Data {
  stores: Store[];
  slips: Slip[];
  attendees: Attendee[];
  event: EventConfig;
  tickets: SupportTicket[];
  withdrawals: WithdrawRequest[];
}

interface Ctx extends Data {
  setStores: Dispatch<SetStateAction<Store[]>>;
  setSlips: Dispatch<SetStateAction<Slip[]>>;
  setAttendees: Dispatch<SetStateAction<Attendee[]>>;
  setEvent: Dispatch<SetStateAction<EventConfig>>;
  setTickets: Dispatch<SetStateAction<SupportTicket[]>>;
  setWithdrawals: Dispatch<SetStateAction<WithdrawRequest[]>>;
  /** ล้างข้อมูลที่จำไว้ กลับเป็นค่าเริ่มต้น */
  reset: () => void;
}

const AdminStoreContext = createContext<Ctx | null>(null);

/**
 * เก็บข้อมูลแอดมินไว้ที่ layout (ไม่ถูกทำลายตอนเปลี่ยนหน้า)
 * และบันทึกลง localStorage (ไม่หายตอนรีเฟรช)
 */
export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [slips, setSlips] = useState<Slip[]>(initialSlips);
  const [attendees, setAttendees] = useState<Attendee[]>(seedAttendees);
  const [event, setEvent] = useState<EventConfig>(initialEvent);
  const [tickets, setTickets] = useState<SupportTicket[]>(SUPPORT_SEED);
  const [withdrawals, setWithdrawals] = useState<WithdrawRequest[]>(WITHDRAWAL_SEED);
  const [hydrated, setHydrated] = useState(false);

  // โหลดค่าที่เคยบันทึกไว้ (หลัง mount เพื่อไม่ให้ hydration ไม่ตรงกัน)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Partial<Data>;
        if (d.stores) setStores(d.stores);
        if (d.slips) setSlips(d.slips);
        if (d.attendees) setAttendees(d.attendees);
        if (d.event) setEvent(d.event);
        if (d.tickets) setTickets(d.tickets);
        if (d.withdrawals) setWithdrawals(d.withdrawals);
      }
    } catch {
      /* ข้อมูลเสีย/อ่านไม่ได้ → ใช้ค่าเริ่มต้น */
    }
    setHydrated(true);
  }, []);

  // บันทึกทุกครั้งที่ข้อมูลเปลี่ยน (หลังโหลดเสร็จเท่านั้น ไม่งั้นจะทับด้วยค่าเริ่มต้น)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stores, slips, attendees, event, tickets, withdrawals }));
    } catch {
      /* โควตาเต็ม/โหมดส่วนตัว → ข้ามไป */
    }
  }, [hydrated, stores, slips, attendees, event, tickets, withdrawals]);

  const reset = useCallback(() => {
    setStores(initialStores);
    setSlips(initialSlips);
    setAttendees(seedAttendees);
    setEvent(initialEvent);
    setTickets(SUPPORT_SEED);
    setWithdrawals(WITHDRAWAL_SEED);
  }, []);

  return (
    <AdminStoreContext.Provider
      value={{
        stores, slips, attendees, event, tickets, withdrawals,
        setStores, setSlips, setAttendees, setEvent, setTickets, setWithdrawals,
        reset,
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useAdminStore ต้องใช้ภายใน <AdminStoreProvider>');
  return ctx;
}
