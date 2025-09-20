import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useDecisionStore } from '@stores/useDecisionStore';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import { useAssignmentStore } from '@stores/useAssignmentStore';
import { useSelectedFileStore } from '@stores/useSelectedFileStore';
import { usePlagiarismJudge } from '@hooks/usePlagiarismJudge';
import { usePlagiarismSave } from '@hooks/usePlagiarismSave';
import { saveStudentPayload } from '@typings/result';

// 공통 날짜 포맷터
const formatDate = (iso?: string) => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
};

type DecisionLocationState = {
  studentFromId?: string | number;
  studentToId?: string | number;
  fileA?: { id: string; label: string; fileName?: string; submittedAt: string };
  fileB?: { id: string; label: string; fileName?: string; submittedAt: string };
  similarity?: number;
};

const toPercent = (v: number) => {
  const n = Number.isFinite(v)
    ? v > 1
      ? Math.round(v)
      : Math.round(v * 100)
    : 0;
  return Math.max(0, Math.min(100, n));
};

const PlagiarismDecisionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveDecision } = useDecisionStore();

  const { assignmentId, week } = useAssignmentStore();
  const { selectedFileA, selectedFileB } = useSelectedFileStore();

  const saveMutation = usePlagiarismSave();

  const state = location.state as DecisionLocationState | undefined;

  // id 소스 결정
  const studentFromId = state?.studentFromId ?? selectedFileA?.id;
  const studentToId = state?.studentToId ?? selectedFileB?.id;

  const ready = Boolean(assignmentId && week && studentFromId && studentToId);

  const {
    data: judge,
    isLoading,
    isError,
  } = usePlagiarismJudge({
    assignmentId: assignmentId ?? 0,
    week: week ?? 0,
    studentFromId: studentFromId ?? '',
    studentToId: studentToId ?? '',
  });

  if (!ready) {
    return (
      <Layout>
        <div className="px-8 py-12">
          <Text variant="h3" weight="bold" className="mb-3 text-gray-900">
            판단에 필요한 정보가 부족합니다.
          </Text>
          <Button
            text="결과 페이지로 이동"
            variant="primary"
            onClick={() => navigate('/result')}
          />
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="px-8 py-12">
          <Text variant="body" color="muted">
            표절 판단 데이터를 불러오는 중...
          </Text>
        </div>
      </Layout>
    );
  }

  if (isError || !judge) {
    return (
      <Layout>
        <div className="px-8 py-12">
          <Text variant="body" color="muted">
            표절 판단 데이터를 불러오지 못했습니다.
          </Text>
          <Button
            text="뒤로가기"
            variant="secondary"
            onClick={() => navigate(-1)}
          />
        </div>
      </Layout>
    );
  }

  // 파일 표시용 (ISO는 유지, 표시에서 포맷)
  const fileA = state?.fileA ?? {
    id: String(judge.student1.id),
    label: judge.student1.name,
    submittedAt: judge.student1.submittedTime,
  };
  const fileB = state?.fileB ?? {
    id: String(judge.student2.id),
    label: judge.student2.name,
    submittedAt: judge.student2.submittedTime,
  };

  // 유사도
  const similarityPct = toPercent(
    Number.isFinite(state?.similarity as number)
      ? (state!.similarity as number)
      : judge.similarity
  );

  // judge, fileA, fileB 계산 이후에 아래 헬퍼로 payload 구성
  const toStudent = (
    who: 'student1' | 'student2',
    fallback: {
      id: string;
      label: string;
      submittedAt: string;
      fileName?: string;
    }
  ): saveStudentPayload => {
    const j = judge[who];
    const parsedFromLabel = fallback.label.match(/\((.*?)\)\s*$/)?.[1] ?? '';
    return {
      id: j.id ?? fallback.id,
      name: j.name ?? fallback.label,
      fileName: fallback.fileName ?? parsedFromLabel,
      submittedTime: j.submittedTime ?? fallback.submittedAt,
    };
  };

  const handleDecision = (isPlagiarism: boolean) => {
    const s1 = toStudent('student1', fileA);
    const s2 = toStudent('student2', fileB);
    if (!s1.fileName || !s2.fileName) {
      alert(
        '파일명을 확인할 수 없어 저장할 수 없습니다. 비교 페이지에서 다시 시도하거나 파일명이 포함된 라벨로 이동해주세요.'
      );
      return;
    }
    const payload = {
      assignmentId: assignmentId!, // ready 체크 이미 통과했음
      week: week!,
      plagiarize: isPlagiarism,
      student1: s1,
      student2: s2,
    };

    saveMutation.mutate(payload, {
      onSuccess: () => {
        saveDecision({
          fileAId: String(payload.student1.id),
          fileBId: String(payload.student2.id),
          isPlagiarism: isPlagiarism,
        });
        navigate('/result/save');
      },
      onError: () => {
        alert('저장에 실패했어요. 잠시 후 다시 시도해 주세요.');
      },
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* 결과 저장 상태 배지 */}
        {saveMutation.isLoading && (
          <div className="mb-3 text-sm text-blue-600">결과를 저장하는 중…</div>
        )}
        {saveMutation.isError && (
          <div className="mb-3 text-sm text-red-600">
            저장 실패. 다시 시도해주세요.
          </div>
        )}

        {/* 상단 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <Text variant="h2" weight="bold" className="text-gray-900">
            표절 판단
          </Text>
          <Button
            text="코드 비교 다시 보기"
            variant="ghost"
            size="sm"
            icon={<FiArrowLeft />}
            onClick={() => navigate(-1)}
          />
        </div>

        {/* 페어 요약 카드 */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
          {/* A 파일 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <Text variant="caption" color="muted">
              파일 A
            </Text>
            <Text
              variant="body-lg"
              weight="bold"
              className="mt-1 truncate text-gray-900"
            >
              {fileA.label}
            </Text>
            <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
              <Text variant="caption" color="muted">
                제출 시간
              </Text>
              <div className="mt-0.5 text-sm text-blue-700">
                {formatDate(fileA.submittedAt)}
              </div>
            </div>
          </div>

          {/* 가운데 유사도 배지 */}
          <div className="flex items-center justify-center">
            <div className="inline-flex min-w-[120px] flex-col items-center rounded-2xl border border-blue-100 bg-blue-50 px-6 py-4 text-blue-700 shadow-sm">
              <Text variant="caption" color="muted">
                유사도
              </Text>
              <Text variant="h2" weight="bold" className="mt-1">
                {similarityPct}%
              </Text>
            </div>
          </div>

          {/* B 파일 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <Text variant="caption" color="muted">
              파일 B
            </Text>
            <Text
              variant="body-lg"
              weight="bold"
              className="mt-1 truncate text-gray-900"
            >
              {fileB.label}
            </Text>
            <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
              <Text variant="caption" color="muted">
                제출 시간
              </Text>
              <div className="mt-0.5 text-sm text-blue-700">
                {formatDate(fileB.submittedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* 안내/주의 섹션 */}
        <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <div className="mb-1 inline-flex items-center gap-2">
            <FiAlertTriangle />
            <Text variant="body" weight="medium">
              판단 전 확인 사항
            </Text>
          </div>
          <ul className="ml-5 list-disc text-sm leading-6">
            <li>
              유사도는 보조 지표입니다. 코드 구조와 주석, 변수명 변경 등을 함께
              검토하세요.
            </li>
            <li>
              제출 시간을 비교하여 제출 순서나 의심 정황을 함께 확인하세요.
            </li>
          </ul>
        </div>

        {/* 하단 결정 버튼 */}
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <Button
            text="표절 아님"
            variant="secondary"
            size="lg"
            onClick={() => handleDecision(false)}
            disabled={saveMutation.isLoading}
          />
          <Button
            text="표절로 저장"
            variant="secondary"
            size="lg"
            className="border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
            onClick={() => handleDecision(true)}
            disabled={saveMutation.isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PlagiarismDecisionPage;
