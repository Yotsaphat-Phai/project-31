'use client';

import { avatarColor, initial } from '../_lib/utils';

interface Props {
  name: string;
  index?: number;
  size?: number;
  color?: string;
}

export default function Avatar({ name, index = 0, size = 40, color }: Props) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.42, background: color ?? avatarColor(index) }}
    >
      {initial(name)}
    </span>
  );
}
