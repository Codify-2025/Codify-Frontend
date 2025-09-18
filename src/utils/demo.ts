export type DemoKey = 'graph' | 'topology' | 'compare' | 'judge' | 'save';

const key = (k: DemoKey) => `demo:${k}`;

/** 데모 사용 여부 조회 */
export const isDemo = (k: DemoKey): boolean =>
  typeof window !== 'undefined' && window.localStorage.getItem(key(k)) === '1';

/** 데모 사용 on/off */
export const setDemo = (k: DemoKey, on: boolean) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key(k), on ? '1' : '0');
};

/** URL 쿼리로 한번에 켜기 */

export const initDemoFromQueryOnce = () => {
  if (typeof window === 'undefined') return;
  const doneKey = '__demo_init_done__';

  const sp = new URLSearchParams(window.location.search);
  const raw = sp.get('demo');

  // URL에 demo=...이 있으면 무조건 우선 적용 (graph 포함)
  if (raw) {
    const parts = raw.split(',').map((s) => s.trim()) as DemoKey[];
    (['graph', 'topology', 'compare', 'judge', 'save'] as DemoKey[]).forEach(
      (k) => setDemo(k, parts.includes(k))
    );
    // URL로 직접 들어온 경우니까 doneKey 체크/설정은 생략해도 OK
    return;
  }

  // 기존 동작 유지 (최초 1회만 기본값 세팅이 필요하다면)
  if (window.sessionStorage.getItem(doneKey) === '1') return;
  window.sessionStorage.setItem(doneKey, '1');
};
