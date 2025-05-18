import React from 'react';
import Layout from '@components/Layout';
import FileUpload from './FileUpload';
import Text from '@components/Text';
import Button from '@components/Button';

const UploadPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center p-8 space-y-4">
        {/* 메인 타이틀 */}
        <Text variant="heading" weight="bold" className="text-gray-700">
          검사를 진행할 파일을 업로드 해주세요
        </Text>

        {/* 서브 타이틀 */}
        <Text variant="body" weight="regular" className="text-gray-500">
          개별 파일 또는 압축 파일(.zip)을 업로드할 수 있습니다.
        </Text>

        {/* 파일 형식 안내 */}
        <div className="bg-blue-50 text-blue-600 text-sm p-3 rounded-lg shadow-sm w-full max-w-lg">
          ※ 업로드 가능한 파일 형식:{' '}
          <span className="font-bold">.cpp, .zip</span>
        </div>

        {/* 파일 업로드 컴포넌트 */}
        <FileUpload />

        {/* 분석 시작 버튼 */}
        <Button text="분석 시작" variant="primary" className="mt-4" />
      </div>
    </Layout>
  );
};

export default UploadPage;
