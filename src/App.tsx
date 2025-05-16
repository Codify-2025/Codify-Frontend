import React from 'react';
import './index.css';
import Layout from './components/Layout';
import Button from './components/Button';
import Text from './components/Text';
import { FiCheck } from 'react-icons/fi';

const App: React.FC = () => {
  return (
    <Layout
      title="Welcome to Codify"
      description="Upload files to analyze for similarity."
    >
      <div className="space-y-4">
        <Text variant="body" weight="medium" color="primary">
          Please upload your source code files to begin the analysis.
        </Text>

        <div className="flex space-x-4">
          <Button text="분석 시작" variant="primary" />
          <Button text="결과 보러가기" variant="secondary" icon={<FiCheck />} />
          <Button text="표절로 저장" variant="danger" />
        </div>
      </div>
    </Layout>
  );
};

export default App;
