import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import Toggle from '@components/Toggle';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAssignmentStore } from '@stores/useAssignmentStore';
import { FiArrowRight } from 'react-icons/fi';
import { useSubjectStore } from '@stores/useSubjectStore';
import { useCreateAssignmentWithWeek } from '@hooks/useCreateAssignmentWithWeek';

// ---------- 유틸: 주차 계산 ----------
const getWeekNumber = (date: Date) => {
  const copied = new Date(date.getTime());
  copied.setDate(1);
  const firstDay = copied.getDay();
  return Math.ceil((date.getDate() + firstDay) / 7);
};

const getAssignmentWeek = (start: Date): number => {
  const month = start.getMonth() + 1;
  const week = getWeekNumber(start);
  const mapping: { [key: number]: number } = {
    3: 1,
    4: 5,
    5: 9,
    6: 13,
    9: 1,
    10: 5,
    11: 9,
    12: 13,
  };
  const base = mapping[month];
  return base ? base + (week - 1) : 1;
};

const fmt = (d: Date) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const AssignmentWeekPage: React.FC = () => {
  const {
    name: assignmentName,
    setDates,
    setWeek,
    setAssignmentId,
  } = useAssignmentStore();
  const { selectedSubject } = useSubjectStore();
  const navigate = useNavigate();
  const { mutate: createAssignment, isLoading } = useCreateAssignmentWithWeek();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [manualWeek, setManualWeek] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>('');

  // 과제 누락 접근 가드
  useEffect(() => {
    // 과목 객체와 과제명 존재만 확인
    if (!selectedSubject) {
      alert('과목을 먼저 선택해주세요.');
      navigate('/subject/select'); // 실제 과목 선택 경로로 수정
      return;
    }
    if (!assignmentName || !assignmentName.trim()) {
      alert('과제명을 먼저 입력해주세요.');
      navigate('/assignment/name');
    }
  }, [assignmentName, selectedSubject, navigate]);

  // 시작일 변경 시 기본적으로 7일 뒤로 마감일 보정
  useEffect(() => {
    if (startDate) {
      if (!endDate || endDate < startDate) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + 7);
        setEndDate(d);
      }
    }
  }, [startDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculatedWeek = useMemo(
    () => (startDate ? getAssignmentWeek(startDate) : 1),
    [startDate]
  );

  const handleNext = useCallback(() => {
    if (!startDate || !endDate || !selectedSubject || !assignmentName) return;

    const weekNumber = manualWeek ? Number(selectedWeek) : calculatedWeek;
    if (manualWeek && (!selectedWeek || isNaN(weekNumber) || weekNumber < 1)) {
      alert('주차를 1 이상의 숫자로 입력해주세요.');
      return;
    }

    const subjectIdNum = selectedSubject.subjectId;
    if (!Number.isInteger(subjectIdNum) || subjectIdNum <= 0) {
      alert('과목 ID가 올바르지 않습니다.');
      return;
    }

    createAssignment(
      {
        subjectId: subjectIdNum,
        assignmentName,
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        week: weekNumber,
      },
      {
        onSuccess: (res) => {
          // 서버가 반환한 assignmentId 저장
          setAssignmentId(res.assignmentId);
          // 로컬 상태 업데이트
          setDates(startDate, endDate);
          setWeek(weekNumber);
          // 업로드 페이지로
          navigate('/upload');
        },
        onError: () => {
          alert('과제/주차 생성에 실패했습니다.');
        },
      }
    );
  }, [
    startDate,
    endDate,
    assignmentName,
    manualWeek,
    selectedWeek,
    calculatedWeek,
    selectedSubject?.subjectId,
    createAssignment,
    setAssignmentId,
    setDates,
    setWeek,
    navigate,
  ]);

  const nextDisabled = !startDate || !endDate || isLoading;

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-5xl flex-col space-y-12 px-6 py-14">
        {/* 진행 배너 */}
        <div className="w-full rounded-2xl bg-blue-50/70 p-6 ring-1 ring-blue-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-blue-700 ring-1 ring-blue-200">
              유사도 분석 진행
            </span>
            {selectedSubject?.subjectName && (
              <span className="inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-sm text-blue-700 ring-1 ring-blue-200">
                과목: {selectedSubject.subjectName}
              </span>
            )}
            {assignmentName && (
              <span className="inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-sm text-blue-700 ring-1 ring-blue-200">
                과제: {assignmentName}
              </span>
            )}
          </div>
          <Text variant="body" className="mt-3 text-gray-700">
            <span className="font-semibold text-blue-700">2단계.</span> 주차
            선택
          </Text>
        </div>

        {/* 타이틀 */}
        <div className="space-y-2">
          <Text as="h1" variant="h2" weight="bold" className="text-gray-900">
            과제 시작일과 마감일을 선택해 주세요
          </Text>
          <Text variant="body" color="muted">
            기본값으로 시작일 기준 <strong>+7일</strong>이 마감일로 설정됩니다.
            필요 시 직접 조정하세요.
          </Text>
        </div>

        {/* 날짜 선택 */}
        <div className="w-full space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex flex-1 flex-col">
              <label className="mb-1 text-gray-700">시작일</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholderText="시작일 선택"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <label className="mb-1 text-gray-700">마감일</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                dateFormat="yyyy-MM-dd"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholderText="마감일 선택"
              />
            </div>
          </div>
        </div>

        {/* 자동/수동 주차 표시 + 토글 */}
        <div className="mt-2 flex w-full flex-col items-start gap-3 sm:w-2/3 sm:flex-row sm:items-center sm:justify-between">
          <Text variant="body" color="primary" className="font-medium">
            {manualWeek
              ? `${selectedWeek || '?'}주차 (수동 설정)`
              : `${calculatedWeek}주차 (자동 설정)`}
          </Text>
          <Toggle
            label="수동 조정"
            checked={manualWeek}
            onChange={() => setManualWeek((prev) => !prev)}
          />
        </div>

        {/* 수동 주차 입력 */}
        {manualWeek && (
          <div className="w-full sm:w-2/3">
            <input
              type="number"
              inputMode="numeric"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              placeholder="주차 입력 (1 이상)"
              min={1}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Text variant="caption" color="muted" className="mt-1">
              학기 운영 방식과 다르면 직접 입력할 수 있어요.
            </Text>
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-end pt-10">
          <Button
            text="다음"
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={nextDisabled}
            iconPosition="right"
            icon={<FiArrowRight size={20} />}
            aria-label="다음 단계로 이동"
          />
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentWeekPage;
