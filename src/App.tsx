import React from 'react';
import Button from './components/Button';
import { FiCheck, FiX } from 'react-icons/fi';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="p-6 space-y-4">
      <Button
        text="분석 시작"
        variant="secondary"
        loadingText="분석 중..."
        isLoading={false}
      />

      <Button
        text="결과 보러가기"
        variant="primary"
        icon={<FiCheck />}
        iconPosition="left"
      />

      <Button
        text="표절로 저장"
        variant="danger"
        icon={<FiX />}
        iconPosition="right"
        onClick={() => alert('표절로 저장됨')}
      />

      <Button
        text="검사 계속하기"
        variant="primary"
        loadingText="검사 중..."
        isLoading={true}
      />
    </div>
  );
};

export default App;
