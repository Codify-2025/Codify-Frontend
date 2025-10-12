import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedAnalysisRecord } from './SavedAnalysisType';
import Text from '@components/Text';
import { formatDateTimeKST, formatPercent01 } from '@utils/format';
import { useSubjectStore } from '@stores/useSubjectStore';

interface Props {
  record: SavedAnalysisRecord;
}

const SavedAnalysisItem: React.FC<Props> = ({ record }) => {
  const navigate = useNavigate();
  const { selectedSubject } = useSubjectStore();
  const subjectId = selectedSubject
    ? String(selectedSubject.subjectId)
    : undefined;

  const goGroup = () => {
    if (!subjectId) return alert('과목을 먼저 선택해 주세요.');
    // group: 상세 페이지는 week 기반으로 이동
    navigate(`/subjects/${subjectId}/record/${String(record.week)}`);
  };

  const goPair = () => {
    if (!subjectId) return alert('과목을 먼저 선택해 주세요.');

    // any 제거, 타입에 있는 week 사용
    const week = record.week; // number

    if (Number.isFinite(week)) {
      navigate(`/subjects/${subjectId}/record/${String(week)}`);
    } else {
      alert(
        '해당 비교 기록의 주차 정보(week)가 없어 상세 페이지로 이동할 수 없습니다.'
      );
    }
  };

  // --- GROUP (주차 전체 결과 요약 카드) ---
  if (record.type === 'group') {
    const nodes = record.preview?.nodes ?? [];
    const edges = record.preview?.edges ?? [];

    // 1) stats 우선 사용, 2) 없으면 edges로 계산
    const pairs = record.preview?.stats?.pairs ?? edges.length;

    const maxSim =
      record.preview?.stats?.maxSim ??
      (edges.length ? Math.max(...edges.map((e) => e.similarity)) : 0);

    const avgSim =
      record.preview?.stats?.avgSim ??
      (edges.length
        ? Math.round(edges.reduce((s, e) => s + e.similarity, 0) / edges.length)
        : 0);

    const labelOf = (id: string) =>
      nodes.find((n) => String(n.id) === String(id))?.label ?? String(id);

    const top3 = [...edges]
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map((e) => ({
        key: `${e.from}-${e.to}`,
        a: labelOf(e.from),
        b: labelOf(e.to),
        sim: e.similarity,
      }));

    return (
      <div className="flex flex-col items-center">
        <button
          type="button"
          className="h-60 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow"
          onClick={goGroup}
        >
          {/* 미리보기 요약 카드 */}
          <div className="flex h-full w-full flex-col justify-between">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-center">
                <Text variant="caption" color="muted">
                  페어 수
                </Text>
                <p className="mt-1 text-lg font-bold text-blue-700">{pairs}</p>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-center">
                <Text variant="caption" color="muted">
                  최대
                </Text>
                <p className="mt-1 text-lg font-bold text-blue-700">
                  {maxSim}%
                </p>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-center">
                <Text variant="caption" color="muted">
                  평균
                </Text>
                <p className="mt-1 text-lg font-bold text-blue-700">
                  {avgSim}%
                </p>
              </div>
            </div>

            <div className="mt-3">
              <Text variant="caption" color="muted">
                상위 유사 쌍
              </Text>
              {top3.length === 0 ? (
                <p className="mt-1 text-sm text-gray-500">
                  표시할 쌍이 없습니다.
                </p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm">
                  {top3.map((t) => (
                    <li
                      key={t.key}
                      className="flex items-center justify-between rounded-md border border-gray-100 px-2 py-1"
                    >
                      <span className="truncate">
                        {t.a} <span className="text-gray-400">·</span> {t.b}
                      </span>
                      <span className="shrink-0 font-semibold text-blue-700">
                        {t.sim}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </button>

        <p className="mt-2 w-full text-center font-semibold text-gray-600">
          &lt;{record.assignmentName}&gt; {record.week}주차 전체 결과
        </p>
      </div>
    );
  }

  // --- PAIR (개별 비교 카드) ---
  const similarityText = formatPercent01(record.similarity ?? 0);
  const aTime = formatDateTimeKST(record.fileA.submittedAt);
  const bTime = formatDateTimeKST(record.fileB?.submittedAt || '');
  const bLabel = record.fileB?.label ?? '(미제출)';

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        className="h-60 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow"
        onClick={goPair}
      >
        <div className="text-center">
          <Text variant="body" weight="bold" className="text-xl text-red-600">
            유사도 {similarityText}
          </Text>
        </div>

        <div className="mt-3 flex flex-col gap-2 text-gray-700">
          <div>
            <span className="font-medium">{record.fileA.label}</span>{' '}
            <span className="text-blue-600">{aTime}</span>
          </div>
          <div>
            <span className="font-medium">{bLabel}</span>{' '}
            <span className="text-blue-600">{bTime}</span>
          </div>
        </div>
      </button>

      <p className="mt-2 w-full text-center font-semibold text-gray-600">
        &lt;{record.assignmentName}&gt; {record.fileA.label}-{bLabel} 코드 비교
        결과
      </p>
    </div>
  );
};

export default SavedAnalysisItem;
