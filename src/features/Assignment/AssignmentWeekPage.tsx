import React, { useEffect, useState } from 'react';
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
import { useAccessToken } from '@hooks/useAccessToken';
import { useAddWeek } from '@hooks/useAddWeek';

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

const AssignmentWeekPage: React.FC = () => {
  const {
    name: assignmentName,
    assignmentId,
    setDates,
    setWeek,
  } = useAssignmentStore();
  const { selectedSubject } = useSubjectStore();
  const token = useAccessToken();
  const navigate = useNavigate();

  const { mutate: addWeek, isLoading } = useAddWeek(token);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [manualWeek, setManualWeek] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>('');

  const calculatedWeek = startDate ? getAssignmentWeek(startDate) : 1;

  // assignmentId null check
  useEffect(() => {
    if (!assignmentId) {
      alert('과제를 먼저 생성해주세요.');
      navigate('/assignment/name');
    }
  }, [assignmentId, navigate]);

  const handleNext = () => {
    const weekNumber = manualWeek ? Number(selectedWeek) : calculatedWeek;

    if (!startDate || !endDate) return;

    if (manualWeek && (!selectedWeek || isNaN(weekNumber) || weekNumber < 1)) {
      alert('주차를 1 이상의 숫자로 입력해주세요.');
      return;
    }

    addWeek(
      {
        assignmentId: String(assignmentId),
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        weekTitle: weekNumber,
      },
      {
        onSuccess: () => {
          setDates(startDate, endDate);
          setWeek(weekNumber);
          navigate('/upload');
        },
        onError: () => {
          alert('주차 생성에 실패했습니다.');
        },
      }
    );
  };

  return (
    <Layout>
      <div className="flex flex-col items-start justify-start px-6 py-16 space-y-12 w-full max-w-4xl mx-auto">
        {/* 상단 정보 영역 */}
        <div className="bg-blue-50 w-full rounded-xl p-6 space-y-2">
          <Text variant="body" weight="bold" color="primary">
            {selectedSubject?.name && (
              <span className="text-gray">{selectedSubject.name} </span>
            )}
            <span className="text-black">{assignmentName}</span> 과제 유사도
            분석 진행
          </Text>
          <Text variant="body" weight="medium" color="gray">
            2. 주차 선택
          </Text>
        </div>

        {/* 날짜 선택 */}
        <div className="w-full space-y-6">
          <Text variant="heading" weight="bold">
            과제 시작일과 마감일을 선택해 주세요
          </Text>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">시작일</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border px-4 py-3 rounded-md text-base"
                placeholderText="시작일 선택"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-gray-600 mb-1">마감일</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                className="border px-4 py-3 rounded-md text-base"
                placeholderText="마감일 선택"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-1/2 mt-4">
          <Text variant="body" weight="medium" color="primary">
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
          <div className="w-full sm:w-1/2">
            <input
              type="number"
              inputMode="numeric"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              placeholder="주차 입력 (1 이상)"
              className="border px-4 py-3 rounded-md w-full mt-2 text-base"
            />
          </div>
        )}

        <div className="self-end pt-20">
          <Button
            text="다음"
            variant="primary"
            size="large"
            onClick={handleNext}
            disabled={!startDate || !endDate || isLoading}
            iconPosition="right"
            icon={<FiArrowRight size={20} />}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentWeekPage;
