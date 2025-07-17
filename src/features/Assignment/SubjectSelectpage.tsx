import React, { useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { useSubjectStore } from '@stores/useSubjectStore';

const dummySubjects = [
  { name: '자료구조', code: 'CS101' },
  { name: '운영체제', code: 'CS102' },
  { name: '알고리즘', code: 'CS103' },
  { name: '캡스톤디자인', code: 'CS401' },
  { name: '인공지능', code: 'CS201' },
  { name: '컴퓨터비전', code: 'CS202' },
  { name: '딥러닝', code: 'CS203' },
  { name: '블록체인', code: 'CS204' },
  { name: '컴파일러', code: 'CS205' },
  { name: '컴퓨터네트워크', code: 'CS206' },
  { name: '웹프로그래밍', code: 'CS207' },
];

const SubjectSelectPage: React.FC = () => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { setSelectedSubject } = useSubjectStore();

  const filteredSubjects = dummySubjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (subject: (typeof dummySubjects)[number]) => {
    if (selectedCode === subject.code) {
      // 이미 선택된 항목을 다시 클릭한 경우 선택 해제
      setSelectedCode(null);
      setNewSubjectName('');
      setSelectedSubject(null);
    } else {
      setSelectedCode(subject.code);
      setNewSubjectName(subject.name);
      setSelectedSubject(subject);
    }
  };

  const handleNext = () => {
    const trimmedName = newSubjectName.trim();
    if (!trimmedName) return;

    if (selectedCode) {
      navigate('/assignment/name');
    } else {
      const newSubject = {
        name: trimmedName,
        code: `SUBJ-${Date.now()}`,
      };
      setSelectedSubject(newSubject);
      navigate('/assignment/name');
    }
  };

  const isValid = !!newSubjectName.trim();

  return (
    <Layout>
      <div className="flex flex-col items-start justify-center px-6 py-16 space-y-12 w-full max-w-4xl mx-auto">
        {/* 안내 영역 */}
        <div className="bg-blue-50 w-full rounded-xl p-6 space-y-2">
          <Text variant="body" weight="bold" color="primary">
            유사도 분석 진행
          </Text>
          <Text variant="body" weight="medium" color="gray">
            0. 과목 선택
          </Text>
        </div>

        {/* 본문 영역 */}
        <div className="w-full space-y-12">
          <Text variant="heading" weight="bold">
            과목을 선택하거나 새로 추가해 주세요
          </Text>

          {/* 기존 과목 목록 */}
          <div className="space-y-4">
            {/* 텍스트 + 검색창 나란히 */}
            <div className="flex items-center justify-between w-full">
              <Text variant="body" weight="medium">
                기존 과목
              </Text>

              {/* 검색창 + 아이콘 */}
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="과목 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border-b border-gray-300 text-sm focus:outline-none"
                />
                <FiSearch
                  className="absolute right-2 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* 과목 리스트 (가로 스크롤) */}
            <div className="w-full max-w-3xl overflow-x-auto pt-1">
              <div className="flex gap-3 min-w-max pr-4 pb-2">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <button
                      key={subject.code}
                      onClick={() => handleSelect(subject)}
                      className={`px-4 py-2 rounded-full border whitespace-nowrap transition ${
                        selectedCode === subject.code
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {subject.name}
                    </button>
                  ))
                ) : (
                  <Text variant="caption" color="gray" className="pl-1">
                    검색 결과 없음
                  </Text>
                )}
              </div>
            </div>
          </div>

          {/* 새 과목 입력 */}
          <div className="space-y-2 w-full max-w-2xl">
            <Text variant="body" weight="medium">
              새 과목 추가
            </Text>
            <input
              type="text"
              placeholder="예: 컴퓨터네트워크"
              value={newSubjectName}
              onChange={(e) => {
                setNewSubjectName(e.target.value);
                setSelectedCode(null); // 기존 선택 해제
              }}
              className="w-full py-3 px-4 border-b border-gray-300 text-xl focus:outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="self-end pt-16">
          <Button
            text="다음"
            variant="primary"
            size="large"
            onClick={handleNext}
            disabled={!isValid}
            iconPosition="right"
            icon={<FiArrowRight size={20} />}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SubjectSelectPage;
