'use client';

import BottomSheet from '../_components/BottomSheet';
import type { Order } from '../_lib/types';
import { fmt, ORDER_LABEL } from '../_lib/utils';

interface Props {
  order: Order | null;
  onClose: () => void;
}

/** แผงรายละเอียดคำสั่งซื้อ เช่น O-1044 */
export default function OrderDetailSheet({ order, onClose }: Props) {
  return (
    <BottomSheet open={!!order} onClose={onClose}>
      {order && (
        <>
          <h2>{order.id}</h2>
          <div className="kv"><span>ประเภท</span><span>{ORDER_LABEL[order.type] === 'ใช้จ่าย' ? 'ใช้จ่าย TOKEN' : ORDER_LABEL[order.type]}</span></div>
          <div className="kv"><span>ผู้ทำรายการ</span><span>{order.actor}</span></div>
          {order.store && <div className="kv"><span>ร้านค้า</span><span>{order.store}</span></div>}
          <div className="kv">
            <span>มูลค่า</span>
            <span>{order.type === 'spend' ? `${fmt(order.amount)} TOKEN` : `${fmt(order.amount)} บาท`}</span>
          </div>
          <div className="kv"><span>เวลา</span><span>{order.time} น.</span></div>
        </>
      )}
    </BottomSheet>
  );
}
