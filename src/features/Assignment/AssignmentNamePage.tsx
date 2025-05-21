import React, { useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { useAssignmentStore } from '@stores/assignmentStore';

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
      <div className="flex flex-col items-start justify-center px-6 py-16 space-y-8 w-full max-w-xl mx-auto">
        <Text variant="caption" weight="bold" className="text-black text-lg">
          유사도 분석 진행
        </Text>
        <Text variant="body" weight="medium" className="text-gray-400 text-xl">
          1. 과제 생성
        </Text>

        <Text
          variant="heading"
          weight="bold"
          className="text-black text-2xl mt-2"
        >
          과제명을 입력해 주세요
        </Text>

        <div className="flex items-center border-b border-gray-300 w-full max-w-md">
          <input
            type="text"
            placeholder="과제명"
            value={name}
            onChange={(e) => setNameInput(e.target.value)}
            className="flex-grow py-3 px-1 focus:outline-none text-xl placeholder:text-gray-400"
          />
        </div>

        <div className="self-end pt-20">
          <Button
            text="다음"
            variant="primary"
            onClick={handleNext}
            disabled={!name.trim()}
            iconPosition="right"
            icon={<span className="ml-1">→</span>}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentNamePage;
