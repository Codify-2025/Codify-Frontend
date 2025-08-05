import React, { useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { useSubjectStore } from '@stores/useSubjectStore';
import { useQueryClient } from 'react-query';
import { useSubjects } from '@hooks/useSubjects';
import { useAddSubject } from '@hooks/useAddSubject';
import { useAccessToken } from '@hooks/useAccessToken';

const SubjectSelectPage: React.FC = () => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { setSelectedSubject } = useSubjectStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const token = useAccessToken();
  const { data: subjectData, isLoading } = useSubjects(token);
  const { mutate: addSubject, isLoading: isAdding } = useAddSubject(token);

  const subjects = subjectData?.result ?? [];

  const filteredSubjects = subjects.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (name: string) => {
    if (selectedName === name) {
      // 이미 선택된 항목을 다시 클릭한 경우 선택 해제
      setSelectedName(null);
      setNewSubjectName('');
      setSelectedSubject(null);
    } else {
      setSelectedName(name);
      setNewSubjectName(name);
      setSelectedSubject({ name, code: name });
    }
  };

  const handleNext = () => {
    const trimmedName = newSubjectName.trim();
    if (!trimmedName) return;

    if (selectedName) {
      navigate('/assignment/name');
    } else {
      addSubject(
        { subjectName: trimmedName },
        {
          onSuccess: (data) => {
            if (data.isSuccess && data.result) {
              const { subjectId } = data.result;

              setSelectedSubject({
                name: trimmedName,
                code: subjectId.toString(),
              });

              queryClient.invalidateQueries(['subjects']);
              navigate('/assignment/name');
            } else {
              alert('과목 추가 응답이 올바르지 않습니다.');
            }
          },
          onError: () => {
            alert('과목 추가에 실패했습니다.');
          },
        }
      );
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
                {isLoading ? (
                  <Text variant="caption" color="gray">
                    불러오는 중...
                  </Text>
                ) : filteredSubjects.length > 0 ? (
                  filteredSubjects.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleSelect(name)}
                      className={`px-4 py-2 rounded-full border whitespace-nowrap transition ${
                        selectedName === name
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {name}
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
                setSelectedName(null); // 기존 선택 해제
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
            disabled={!isValid || isAdding}
            iconPosition="right"
            icon={<FiArrowRight size={20} />}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SubjectSelectPage;
