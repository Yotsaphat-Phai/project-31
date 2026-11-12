'use client';

import BottomSheet from '../_components/BottomSheet';
import Avatar from '../_components/Avatar';
import type { Attendee } from '../_lib/types';

interface Props {
  attendee: Attendee | null;
  avatarIndex?: number;
  onClose: () => void;
  onCheckIn: (id: string) => void;
}

/** แผงรายละเอียดผู้เข้าร่วม + ปุ่ม "เช็กอินให้" */
export default function AttendeeDetailSheet({ attendee, avatarIndex = 0, onClose, onCheckIn }: Props) {
  return (
    <BottomSheet open={!!attendee} onClose={onClose}>
      {attendee && (
        <>
          <div className="row" style={{ cursor: 'default', marginBottom: 8 }}>
            <Avatar name={attendee.name} index={avatarIndex} size={44} />
            <div className="grow">
              <div className="title" style={{ fontSize: 17 }}>{attendee.name}</div>
              <div className="sub">รุ่น {attendee.batch}</div>
            </div>
          </div>

          <div className="kv"><span>จำนวนบัตร</span><span>{attendee.tickets} ใบ</span></div>
          <div className="kv"><span>TOKEN คงเหลือ</span><span>{attendee.token}</span></div>
          <div className="kv">
            <span>สถานะ</span>
            <span>{attendee.checkedIn ? 'เช็กอินแล้ว' : 'ยังไม่เช็กอิน'}</span>
          </div>
          <div className="kv"><span>เบอร์โทร</span><span>{attendee.phone}</span></div>

          <button
            className="btn btn-teal"
            style={{ marginTop: 20 }}
            disabled={attendee.checkedIn}
            onClick={() => {
              onCheckIn(attendee.id);
              onClose();
            }}
          >
            {attendee.checkedIn ? 'เช็กอินแล้ว' : 'เช็กอินให้'}
          </button>
          <p className="note">การปรับ TOKEN ทำได้โดย Head Admin เท่านั้น</p>
        </>
      )}
    </BottomSheet>
  );
}
