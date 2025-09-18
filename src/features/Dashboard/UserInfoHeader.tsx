import React, { useState } from 'react';
// import Button from '@components/Button';
import Text from '@components/Text';
import { useSubjectStore } from '@stores/useSubjectStore';
import { useMainDashboard } from '@hooks/useMainDashboard';
import { ErrorState, LoadingSkeleton } from '@components/LoadingState';

const UserInfoHeader: React.FC = () => {
  const [isSubjectOpen, setSubjectOpen] = useState(false);
  const { selectedSubject, setSelectedSubject } = useSubjectStore();
  const { data, isLoading, isError } = useMainDashboard();

  const handleToggle = () => setSubjectOpen((prev) => !prev);

  // 선택 비교 함수
  const isSelected = (id: number, name: string) => {
    const s = selectedSubject;
    if (!s) return false;
    return s.subjectId ? s.subjectId === id : s.subjectName === name;
  };

  // 로딩/에러
  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState />;

  const { user, testCount, subjects } = data;

  return (
    <header className="relative mt-8">
      {/* 상단 우측: 비밀번호 변경 */}
      {/* <div className="absolute right-5 top-5">
        <Button text="비밀번호 변경하기" variant="secondary" size="sm" />
      </div> */}

      {/* 사용자 카드 */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 ring-1 ring-blue-100">
        <div className="flex flex-col gap-1 pr-40">
          <Text as="h1" variant="h2" weight="bold" className="text-gray-900">
            {user.name}{' '}
            <span className="ml-2 align-middle text-base font-normal text-gray-600">
              ({user.userId})
            </span>
          </Text>

          <Text variant="body" className="text-gray-700">
            진행한 유사도 검사:{' '}
            <span className="font-semibold text-blue-700">{testCount}회</span>
          </Text>

          {/* 과목 선택 토글 */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleToggle}
              aria-expanded={isSubjectOpen}
              aria-controls="subject-panel"
              className="rounded-full border border-gray-200 bg-white px-4 py-1 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
            >
              관리 중인 과목 {isSubjectOpen ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {/* 과목 선택 패널 */}
        {isSubjectOpen && (
          <div
            id="subject-panel"
            role="region"
            aria-label="관리 중인 과목 목록"
            className="mt-4 w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {subjects.map((subj) => {
                const selected = isSelected(subj.subjectId, subj.subjectName);
                return (
                  <button
                    key={subj.subjectId}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(
                        selected
                          ? null
                          : {
                              subjectId: subj.subjectId,
                              subjectName: subj.subjectName,
                            }
                      );
                      // 과목 선택 후 패널 닫기
                      setSubjectOpen(false);
                    }}
                    aria-pressed={selected}
                    className={[
                      'flex items-center justify-between px-4 py-3 text-left transition',
                      'border-b border-gray-100 last:border-b-0 sm:last:border-b',
                      selected
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-800',
                    ].join(' ')}
                  >
                    <span className="truncate">{subj.subjectName}</span>
                    <span className="text-xs text-gray-400">
                      {subj.subjectId}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 구분선 */}
      <div className="mt-6 h-px w-full bg-gray-200" />
    </header>
  );
};

export default UserInfoHeader;
