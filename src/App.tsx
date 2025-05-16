import React from 'react';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="font-sans p-6 space-y-4">
      <h1 className="font-heading text-2xl font-bold">폰트 적용 예제</h1>
      <p className="font-sans text-lg">
        이 문장은 Pretendard 폰트를 사용합니다.
      </p>
      <p className="font-heading text-sm">
        이 문장도 Pretendard 폰트를 사용합니다.
      </p>
    </div>
  );
};

export default App;
