import { topologyResponseData } from '@typings/result';

const iso = (s: string) => new Date(s).toISOString();

// 데모 학생(12명) — 클러스터 A(8명: BFS), 클러스터 B(4명: Sieve)
const students = [
  { id: '20230001', label: '김민수', fileName: '20230001_김민수.cpp' },
  { id: '20230002', label: '이서연', fileName: '20230002_이서연.cpp' },
  { id: '20230003', label: '박지훈', fileName: '20230003_박지훈.cpp' },
  { id: '20230004', label: '최은우', fileName: '20230004_최은우.cpp' },
  { id: '20230005', label: '정유나', fileName: '20230005_정유나.cpp' },
  { id: '20230006', label: '한도윤', fileName: '20230006_한도윤.cpp' },
  { id: '20230007', label: '오하린', fileName: '20230007_오하린.cpp' },
  { id: '20230008', label: '류시원', fileName: '20230008_류시원.cpp' },
  { id: '20230009', label: '장우진', fileName: '20230009_장우진.cpp' },
  { id: '20230010', label: '문가영', fileName: '20230010_문가영.cpp' },
  { id: '20230011', label: '윤하준', fileName: '20230011_윤하준.cpp' },
  { id: '20230012', label: '임수정', fileName: '20230012_임수정.cpp' },
];

// 제출 시간(시연용)
const submittedAtBase = '2025-03-18T10:00:00.000Z';
const submittedAt = students.map((_, i) =>
  iso(new Date(Date.parse(submittedAtBase) + i * 7 * 60 * 1000).toISOString())
);

// value(0~1) / width(시각 강조용)
const edge = (from: string, to: string, value: number) => ({
  id: `${from}-${to}`,
  from,
  to,
  value,
  width: Math.max(2, Math.round(value * 10)),
  comparedFiles: `${from}_${to}.cpp`,
  histories: [
    {
      submittedFrom:
        submittedAt[students.findIndex((s) => s.id === from)] ?? submittedAt[0],
      submittedTo:
        submittedAt[students.findIndex((s) => s.id === to)] ?? submittedAt[1],
    },
  ],
});

// A 내부(높은 유사도)
const edgesA = [
  edge('20230001', '20230002', 0.93),
  edge('20230001', '20230003', 0.88),
  edge('20230002', '20230003', 0.9),
  edge('20230003', '20230004', 0.86),
  edge('20230004', '20230005', 0.82),
  edge('20230005', '20230006', 0.78),
  edge('20230006', '20230007', 0.76),
  edge('20230007', '20230008', 0.74),
  edge('20230002', '20230005', 0.8),
  edge('20230001', '20230008', 0.72),
];

// B 내부(중-높음)
const edgesB = [
  edge('20230009', '20230010', 0.79),
  edge('20230010', '20230011', 0.75),
  edge('20230011', '20230012', 0.73),
  edge('20230009', '20230012', 0.7),
];

// A↔B (낮음)
const edgesCross = [
  edge('20230003', '20230010', 0.22),
  edge('20230006', '20230011', 0.18),
  edge('20230008', '20230009', 0.15),
];

export const topologyMock: topologyResponseData = {
  nodes: students.map((s, i) => ({
    id: s.id,
    label: s.label,
    fileName: s.fileName,
    submittedAt: submittedAt[i],
    relatedFiles: [], // 필요 시 채워도 됨
  })),
  edges: [...edgesA, ...edgesB, ...edgesCross],
};
