import React, { useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import Toggle from '@components/Toggle';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAssignmentStore } from '@stores/assignmentStore';

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
  const { name: assignmentName, setDates, setWeek } = useAssignmentStore();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [manualWeek, setManualWeek] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const navigate = useNavigate();

  const calculatedWeek = startDate ? getAssignmentWeek(startDate) : 1;

  const handleNext = () => {
    const weekNumber = manualWeek ? Number(selectedWeek) : calculatedWeek;

    if (!startDate || !endDate) return;

    if (manualWeek && (!selectedWeek || isNaN(weekNumber) || weekNumber < 1)) {
      alert('주차를 1 이상의 숫자로 입력해주세요.');
      return;
    }

    setDates(startDate, endDate);
    setWeek(weekNumber);
    navigate('/upload');
  };

  return (
    <Layout>
      <div className="flex flex-col items-start justify-start px-6 py-16 space-y-8 w-full max-w-xl mx-auto">
        {/* 상단 안내 */}
        <Text variant="caption" weight="bold" className="text-black text-lg">
          <span className="text-blue-500">{assignmentName}</span> 과제 유사도
          분석 진행
        </Text>
        <Text variant="body" weight="medium" className="text-gray-400 text-xl">
          2. 주차 선택
        </Text>

        <Text
          variant="heading"
          weight="bold"
          className="text-black text-2xl mt-2"
        >
          과제 시작일과 마감일을 선택해 주세요
        </Text>

        <div className="flex gap-6 w-full max-w-md">
          <div className="flex flex-col flex-1">
            <label className="text-gray-600 mb-1">시작일</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="border px-3 py-2 rounded-md w-full"
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
              className="border px-3 py-2 rounded-md w-full"
              placeholderText="마감일 선택"
            />
          </div>
        </div>

        <div className="flex items-center justify-between w-full max-w-md mt-4">
          <Text
            variant="body"
            weight="medium"
            className="text-blue-500 text-lg"
          >
            {manualWeek
              ? `${selectedWeek}주차 (수동 설정)`
              : `${calculatedWeek}주차 (자동 설정)`}
          </Text>
          <Toggle
            label="수동 조정"
            checked={manualWeek}
            onChange={() => setManualWeek((prev) => !prev)}
          />
        </div>

        {manualWeek && (
          <div className="w-full max-w-md">
            <input
              type="number"
              inputMode="numeric"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              placeholder="주차 입력 (1 이상)"
              className="border px-3 py-2 rounded-md w-full mt-2"
            />
          </div>
        )}

        <div className="self-end pt-20">
          <Button
            text="다음"
            variant="primary"
            onClick={handleNext}
            disabled={!startDate || !endDate}
            iconPosition="right"
            icon={<span className="ml-1">→</span>}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentWeekPage;
