import React, { useId, useState } from 'react';
import Layout from '@components/Layout';
import FileUpload from './FileUpload';
import Text from '@components/Text';
import Button from '@components/Button';
import Tooltip from '@components/Tooltip';
import { FiInfo } from 'react-icons/fi';
import { useAssignmentStore } from '@stores/useAssignmentStore';
import { useNavigate } from 'react-router-dom';
import { useSubjectStore } from '@stores/useSubjectStore';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { name, week } = useAssignmentStore();
  const { selectedSubject } = useSubjectStore();
  const [openGuide, setOpenGuide] = useState(false);
  const guideId = useId();
  const guideHeadingId = useId();

  const handleStartAnalysis = () => navigate('/analysis/loading');

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-screen-lg flex-col space-y-8 px-6 py-10">
        {/* 상단 진행 배너 */}
        <div className="w-full rounded-2xl bg-blue-50/70 p-6 ring-1 ring-blue-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-blue-700 ring-1 ring-blue-200">
              유사도 분석 진행
            </span>

            {selectedSubject?.name && (
              <span className="inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-sm text-blue-700 ring-1 ring-blue-200">
                과목: {selectedSubject.name}
              </span>
            )}

            {name && week != null && (
              <span className="inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-sm text-blue-700 ring-1 ring-blue-200">
                과제: {name} - {week}주차
              </span>
            )}
          </div>

          <Text variant="body" className="mt-3 text-gray-700">
            <span className="font-semibold text-blue-700">3단계.</span> 파일
            업로드
          </Text>
        </div>

        {/* 제목 / 요약 라인 */}
        <div className="space-y-1">
          <Text as="h1" variant="h2" weight="bold" className="text-gray-900">
            검사를 진행할 파일을 업로드해 주세요
          </Text>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Text variant="caption" color="muted">
              개별 파일 또는 압축(.zip) 업로드 가능
            </Text>

            <Tooltip content=".cpp, .zip 확장자만 허용됩니다.">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-blue-200"
                aria-label="지원 파일 형식 정보: .cpp, .zip"
              >
                <FiInfo aria-hidden="true" /> 지원 형식:{' '}
                <strong>.cpp, .zip</strong>
              </button>
            </Tooltip>

            <button
              type="button"
              onClick={() => setOpenGuide((v) => !v)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50"
              aria-expanded={openGuide}
              aria-controls={guideId}
            >
              {openGuide ? '가이드 숨기기' : '가이드 보기'}
            </button>
          </div>
        </div>

        {/* 업로드 가이드 (접기/펼치기) */}
        {openGuide && (
          <div
            id={guideId}
            role="region"
            aria-labelledby={guideHeadingId}
            className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700
               dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-200"
          >
            <div id={guideHeadingId} className="font-medium">
              업로드 규칙
            </div>
            <ul className="space-y-1">
              <li>
                📌 파일명은 <strong>학번_이름.cpp</strong> 형식으로 제출해
                주세요.
              </li>
              <li>
                📦 zip 업로드 시 내부 파일명도 동일한 형식을 따라야 합니다.
              </li>
              <li>
                ❗ 형식을 따르지 않으면 파일명 전체가 학번/이름으로 저장됩니다.
              </li>
              <li>
                🕒 제출일자는 각 파일의 <strong>최종 수정일자</strong> 기준이며,
                zip은 <strong>압축 파일의 수정일</strong>을 사용합니다.
              </li>
            </ul>
          </div>
        )}

        {/* 업로드 UI */}
        <FileUpload />

        {/* 분석 시작 버튼 */}
        <div className="flex justify-end">
          <Button
            text="분석 시작"
            variant="primary"
            size="lg"
            className="mt-2"
            onClick={handleStartAnalysis}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;
