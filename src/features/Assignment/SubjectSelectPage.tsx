import React, { useMemo, useState, useCallback } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { useSubjectStore } from '@stores/useSubjectStore';
import { useQueryClient } from 'react-query';
import { useSubjects } from '@hooks/useSubjects';
import { useAddSubject } from '@hooks/useAddSubject';
import classNames from 'classnames';

const SubjectSelectPage: React.FC = () => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { setSelectedSubject } = useSubjectStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: subjects = [], isLoading } = useSubjects();
  const { mutate: addSubject, isLoading: isAdding } = useAddSubject();

  const filteredSubjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => s.subjectName.toLowerCase().includes(q));
  }, [subjects, searchTerm]);

  const handleSelect = useCallback(
    (item: { subjectId: number; subjectName: string }) => {
      if (selectedId === item.subjectId) {
        setSelectedId(null);
        setNewSubjectName('');
        setSelectedSubject(null);
      } else {
        setSelectedId(item.subjectId);
        setNewSubjectName(item.subjectName); // 입력란에도 채워주기(선택 가시성)
        setSelectedSubject({
          id: String(item.subjectId),
          name: item.subjectName,
        });
      }
    },
    [selectedId, setSelectedSubject]
  );

  const handleNext = useCallback(() => {
    // 기존 과목 선택 → 바로 이동
    if (selectedId !== null) {
      navigate('/assignment/name');
      return;
    }
    const trimmedName = newSubjectName.trim();
    if (!trimmedName) return;

    // 새 과목 추가 → 성공 시 이동
    addSubject(
      { subjectName: trimmedName },
      {
        onSuccess: ({ subjectId, subjectName }) => {
          // 서버가 subjectName을 주면 그 값을, 아니면 사용자가 입력한 값을 사용
          const finalName = subjectName ?? trimmedName;
          setSelectedSubject({
            id: String(subjectId),
            name: finalName,
          });
          // 선택 상태도 동기화(선택 가시성 ↑)
          setSelectedId(subjectId);
          setNewSubjectName(finalName);
          // 목록 갱신
          queryClient.invalidateQueries(['subjects']);
          // 다음 단계로
          navigate('/assignment/name');
        },
        onError: () => alert('과목 추가에 실패했습니다.'),
      }
    );
  }, [
    addSubject,
    navigate,
    newSubjectName,
    queryClient,
    selectedId,
    setSelectedSubject,
  ]);

  const onEnterNewSubject: React.KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === 'Enter' && newSubjectName.trim() && !isAdding) handleNext();
  };

  const canProceed = selectedId !== null || newSubjectName.trim().length > 0;
  const showEmptyState = !isLoading && filteredSubjects.length === 0;

  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl px-6 py-14 space-y-12">
        {/* 진행 배너 */}
        <div className="w-full rounded-2xl bg-blue-50/70 p-6 ring-1 ring-blue-100">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-blue-700 ring-1 ring-blue-200">
            유사도 분석 진행
          </div>
          <Text variant="body" weight="medium" className="mt-3 text-gray-700">
            <span className="font-semibold text-blue-700">0단계.</span> 과목
            선택
          </Text>
        </div>

        {/* 타이틀 */}
        <div className="space-y-2">
          <Text as="h1" variant="h2" weight="bold">
            과목을 선택하거나 새로 추가해 주세요
          </Text>
          <Text variant="body" color="muted">
            기존 목록에서 선택하거나, 없다면 새 과목을 입력해 다음 단계로
            진행합니다.
          </Text>
        </div>

        {/* 기존 과목 + 검색 */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Text variant="body" weight="medium" className="text-gray-800">
              기존 과목
            </Text>

            {/* 검색창 */}
            <label className="relative w-full max-w-xs" aria-label="과목 검색">
              <input
                type="text"
                placeholder="과목 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-10 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <FiSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </label>
          </div>

          {/* 과목 그리드 */}
          <div className="min-h-[56px]">
            {isLoading ? (
              // 로딩 스켈레톤
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-full bg-gray-100"
                  />
                ))}
              </div>
            ) : showEmptyState ? (
              <div className="rounded-xl border border-gray-200 p-6 text-center">
                <Text variant="body" color="muted">
                  검색 결과가 없어요. 아래에서 새 과목을 추가해 주세요.
                </Text>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filteredSubjects.map((item) => {
                  const selected = selectedId === item.subjectId;
                  return (
                    <button
                      key={item.subjectId}
                      onClick={() => handleSelect(item)}
                      className={classNames(
                        'h-10 rounded-full border px-4 text-sm transition',
                        selected
                          ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                      )}
                      aria-pressed={selected}
                    >
                      {item.subjectName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 새 과목 입력 */}
        <section className="space-y-3">
          <Text variant="body" weight="medium" className="text-gray-800">
            새 과목 추가
          </Text>

          <div className="w-full max-w-xl space-y-2">
            <input
              type="text"
              placeholder="예: 컴퓨터네트워크"
              value={newSubjectName}
              onChange={(e) => {
                setNewSubjectName(e.target.value);
                setSelectedId(null);
              }}
              onKeyDown={onEnterNewSubject}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              aria-label="새 과목 입력"
            />
            <Text variant="caption" color="muted">
              Enter 키를 눌러 다음 단계로 이동할 수 있어요.
            </Text>
          </div>
        </section>

        {/* 다음 버튼 */}
        <div className="flex justify-end pt-6">
          <Button
            text="다음"
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!canProceed || isAdding}
            iconPosition="right"
            icon={<FiArrowRight size={20} />}
            ariaLabel="다음 단계로 이동"
          />
        </div>
      </div>
    </Layout>
  );
};

export default SubjectSelectPage;
