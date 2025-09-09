export function formatPercent01(value: number, digits = 1) {
  // value: 0~1 → "89.5%"
  const pct = Math.max(0, Math.min(1, Number(value))) * 100;
  return `${pct.toFixed(digits)}%`;
}

export function formatDateTimeKST(isoLike: string) {
  if (!isoLike) return '-';
  let s = String(isoLike).trim();
  // "YYYY-MM-DD HH:mm" 형식이면 KST로 간주하여 타임존 명시
  if (
    /^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}/.test(s) &&
    !/[Z+\\-]\\d{2}:?\\d{2}$/.test(s)
  ) {
    s = s.replace(' ', 'T') + '+09:00';
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}
