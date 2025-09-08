export function formatPercent01(value: number, digits = 1) {
  // value: 0~1 → "89.5%"
  const pct = Math.max(0, Math.min(1, Number(value))) * 100;
  return `${pct.toFixed(digits)}%`;
}

export function formatDateTimeKST(isoLike: string) {
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
