import React from 'react';
import Layout from '@components/Layout';
import FileUpload from './FileUpload';
import Text from '@components/Text';
import Button from '@components/Button';
import { useAssignmentStore } from '@stores/assignmentStore';
import { useNavigate } from 'react-router-dom';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { name, week } = useAssignmentStore();

  const handleStartAnalysis = () => {
    navigate('/analysis/loading');
  };

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-screen-lg mx-auto px-6 space-y-6">
        {/* 상단 정보 영역 */}
        <div className="bg-blue-50 w-full rounded-xl p-6 space-y-2">
          <Text variant="body" weight="bold" color="primary">
            <span className="text-black">
              {name} ({week}주차)
            </span>{' '}
            과제 유사도 분석 진행
          </Text>
          <Text variant="body" weight="medium" color="gray">
            3. 파일 업로드
          </Text>
        </div>

        {/* 제목 영역 */}
        <div className="space-y-2">
          <Text variant="subtitle" weight="bold">
            검사를 진행할 파일을 업로드해 주세요
          </Text>
          <Text variant="caption" weight="medium" color="gray">
            개별 파일 또는 압축 파일(.zip)을 업로드할 수 있습니다.
          </Text>
          <div className="bg-blue-50 text-blue-600 text-caption p-3 rounded-lg shadow-sm w-full">
            ※ 업로드 가능한 파일 형식:{' '}
            <span className="font-bold">.cpp, .zip</span>
          </div>
        </div>

        {/* 파일 업로드 컴포넌트 */}
        <FileUpload />

        {/* 분석 시작 버튼 */}
        <div className="flex justify-end">
          <Button
            text="분석 시작"
            variant="primary"
            size="large"
            className="mt-6"
            onClick={handleStartAnalysis}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;
