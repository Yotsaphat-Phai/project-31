'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { attendees as seedAttendees, initialEvent, initialSlips, initialStores } from './mockData';
import { SUPPORT_SEED } from './supportSeed';
import { WITHDRAWAL_SEED } from './withdrawalSeed';
import { SHARED_WITHDRAW_KEY, readShared, writeShared } from './sharedStorage';
import type { Attendee, EventConfig, Slip, Store, SupportTicket, WithdrawRequest } from './types';

const STORAGE_KEY = 'next-admin:v1';

interface Data {
  stores: Store[];
  slips: Slip[];
  attendees: Attendee[];
  event: EventConfig;
  tickets: SupportTicket[];
}

interface Ctx extends Data {
  withdrawals: WithdrawRequest[];
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
 *
 * คำขอถอน (withdrawals) ใช้ key กลาง `eventhub:withdrawals`
 * เพื่อให้หน้า vendor เขียนเข้ามาแล้ว admin เห็นทันที
 */
export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [slips, setSlips] = useState<Slip[]>(initialSlips);
  const [attendees, setAttendees] = useState<Attendee[]>(seedAttendees);
  const [event, setEvent] = useState<EventConfig>(initialEvent);
  const [tickets, setTickets] = useState<SupportTicket[]>(SUPPORT_SEED);
  const [withdrawals, setWithdrawalsState] = useState<WithdrawRequest[]>(WITHDRAWAL_SEED);
  const [hydrated, setHydrated] = useState(false);

  /** รวมคำขอใหม่จาก vendor กับที่แอดมินแก้ไขแล้ว (ยึดสถานะฝั่งแอดมินถ้ามี) */
  const mergeWithdrawals = (incoming: WithdrawRequest[], current: WithdrawRequest[]) => {
    const byId = new Map(current.map((w) => [w.id, w] as const));
    for (const w of incoming) {
      const existing = byId.get(w.id);
      // ถ้าแอดมินเคยอนุมัติ/ปฏิเสธไปแล้ว เก็บสถานะแอดมินไว้ ไม่ให้ถูก vendor ทับ
      byId.set(w.id, existing && existing.status !== 'pending' ? existing : { ...w, ...existing });
    }
    return Array.from(byId.values()).sort((a, b) => b.id.localeCompare(a.id));
  };

  const setWithdrawals: Dispatch<SetStateAction<WithdrawRequest[]>> = (updater) => {
    setWithdrawalsState((prev) => {
      const next = typeof updater === 'function' ? (updater as (p: WithdrawRequest[]) => WithdrawRequest[])(prev) : updater;
      writeShared(SHARED_WITHDRAW_KEY, next);
      return next;
    });
  };

  // โหลดค่าที่เคยบันทึกไว้
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
      }
    } catch {
      /* ignore */
    }

    // โหลดคำขอถอนจาก key กลาง (ถ้า vendor เขียนไว้)
    const fromShared = readShared<WithdrawRequest[] | null>(SHARED_WITHDRAW_KEY, null);
    if (fromShared && Array.isArray(fromShared)) {
      setWithdrawalsState((prev) => mergeWithdrawals(fromShared, prev));
    } else {
      // ยังไม่มีค่าใน key กลาง → seed ให้ด้วย เพื่อให้ vendor เห็น schema
      writeShared(SHARED_WITHDRAW_KEY, WITHDRAWAL_SEED);
    }

    setHydrated(true);
  }, []);

  // ฟัง storage event — vendor เขียนในอีกแท็บ/อีกหน้า → admin รับทันที
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== SHARED_WITHDRAW_KEY || !e.newValue) return;
      try {
        const incoming = JSON.parse(e.newValue) as WithdrawRequest[];
        setWithdrawalsState((prev) => mergeWithdrawals(incoming, prev));
      } catch {
        /* ignore */
      }
    };
    const onFocus = () => {
      const incoming = readShared<WithdrawRequest[] | null>(SHARED_WITHDRAW_KEY, null);
      if (incoming && Array.isArray(incoming)) {
        setWithdrawalsState((prev) => mergeWithdrawals(incoming, prev));
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, []);

  // บันทึกข้อมูลอื่น (ไม่รวม withdrawals ที่เขียนแยกไปแล้ว)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stores, slips, attendees, event, tickets }));
    } catch {
      /* ignore */
    }
  }, [hydrated, stores, slips, attendees, event, tickets]);

  const reset = useCallback(() => {
    setStores(initialStores);
    setSlips(initialSlips);
    setAttendees(seedAttendees);
    setEvent(initialEvent);
    setTickets(SUPPORT_SEED);
    setWithdrawalsState(WITHDRAWAL_SEED);
    writeShared(SHARED_WITHDRAW_KEY, WITHDRAWAL_SEED);
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
