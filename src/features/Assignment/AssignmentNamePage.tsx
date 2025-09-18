import React, { useState, useCallback } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { useAssignmentStore } from '@stores/useAssignmentStore';
import { FiArrowRight } from 'react-icons/fi';
import { useSubjectStore } from '@stores/useSubjectStore';

const MAX_LEN = 60;

const AssignmentNamePage: React.FC = () => {
  const [inputName, setInputName] = useState('');
  const navigate = useNavigate();

  const { setName } = useAssignmentStore();
  const { selectedSubject } = useSubjectStore();

  const handleNext = useCallback(() => {
    const trimmedName = inputName.trim();
    if (!trimmedName || !selectedSubject) return;

    setName(trimmedName);
    // 과제ID는 다음 단계에서 API 응답으로 설정
    navigate('/assignment/week');
  }, [inputName, navigate, selectedSubject, setName]);

  const onEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && inputName.trim()) handleNext();
  };

  const valid = !!inputName.trim();
  const len = inputName.length;

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14">
        {/* 상단 진행 배너 */}
        <div className="w-full rounded-2xl bg-blue-50/70 p-6 ring-1 ring-blue-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-blue-700 ring-1 ring-blue-200">
              유사도 분석 진행
            </span>
            {selectedSubject?.name && (
              <span className="inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-sm text-blue-700 ring-1 ring-blue-200">
                과목: {selectedSubject.name}
              </span>
            )}
          </div>
          <Text variant="body" className="mt-3 text-gray-700">
            <span className="font-semibold text-blue-700">1단계.</span> 과제
            생성
          </Text>
        </div>

        {/* 타이틀 & 보조설명 */}
        <div className="space-y-2">
          <Text
            as="h1"
            variant="heading"
            weight="bold"
            className="text-2xl md:text-3xl text-gray-900"
          >
            과제명을 입력해 주세요
          </Text>
          <Text variant="body" color="muted">
            최대 {MAX_LEN}자까지 입력할 수 있습니다. Enter 키로 바로 다음 단계로
            이동할 수 있어요.
          </Text>
        </div>

        {/* 입력 영역 */}
        <div className="w-full max-w-xl space-y-2">
          <label htmlFor="assignmentName" className="sr-only">
            과제명
          </label>
          <input
            id="assignmentName"
            type="text"
            placeholder="예: HW2 - 정렬 알고리즘 구현"
            value={inputName}
            onChange={(e) => {
              const v = e.target.value.slice(0, MAX_LEN);
              setInputName(v);
            }}
            onKeyDown={onEnter}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            aria-describedby="assignmentNameHelp"
            autoFocus
          />
          <div className="flex items-center justify-between text-sm">
            <Text id="assignmentNameHelp" variant="caption" color="muted">
              과제명은 이후 결과 저장·검색에 사용됩니다.
            </Text>
            <Text variant="caption" color="muted">
              {len}/{MAX_LEN}
            </Text>
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="flex justify-end pt-6">
          <Button
            text="다음"
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!valid || !selectedSubject}
            iconPosition="right"
            icon={<FiArrowRight size={20} />}
            ariaLabel="다음 단계로 이동"
          />
        </div>

        {/* 과목 없이 접근했을 때 안내 (가드) */}
        {!selectedSubject && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            과목이 선택되지 않았습니다. 이전 단계에서 과목을 먼저 선택해 주세요.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignmentNamePage;
