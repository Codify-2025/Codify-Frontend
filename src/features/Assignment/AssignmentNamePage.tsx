import React, { useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { useAssignmentStore } from '@stores/assignmentStore';
import { FiArrowRight } from 'react-icons/fi';

const AssignmentNamePage: React.FC = () => {
  const [name, setNameInput] = useState('');
  const navigate = useNavigate();
  const { setName } = useAssignmentStore();

  const handleNext = () => {
    if (name.trim()) {
      setName(name.trim());
      navigate('/assignment/week');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-start justify-center px-6 py-16 space-y-8 w-full max-w-4xl mx-auto">
        {/* 상단 페이지 정보 영역 */}
        <div className="bg-blue-50 w-full rounded-xl p-6 space-y-2">
          <Text variant="body" weight="bold" color="primary">
            유사도 분석 진행
          </Text>
          <Text variant="body" weight="medium" color="gray">
            1. 과제 생성
          </Text>
        </div>

        {/* 본문 입력 영역 */}
        <div className="w-full py-10 space-y-10">
          <Text variant="heading" weight="bold">
            과제명을 입력해 주세요
          </Text>

          <div className="flex items-center border-b border-gray-300 w-2/3">
            <input
              type="text"
              placeholder="과제명"
              value={name}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-grow py-3 px-1 focus:outline-none text-xl placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="self-end pt-20">
          <Button
            text="다음"
            variant="primary"
            size="large"
            onClick={handleNext}
            disabled={!name.trim()}
            iconPosition="right"
            icon={<FiArrowRight size={20} />}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentNamePage;
