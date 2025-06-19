import React, { useState } from 'react';
import Button from '@components/Button';
import { FiEdit2 } from 'react-icons/fi';
import BirthdateEditModal from './BirthdateEditModal';
import { useSubjectStore } from '@stores/subjectStore';

interface Subject {
  name: string;
  code: string;
}

const UserInfoHeader: React.FC = () => {
  const [isSubjectOpen, setSubjectOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [birthdate, setBirthdate] = useState('2000-01-01');
  const [tempBirthdate, setTempBirthdate] = useState(birthdate);

  const { setSelectedSubject } = useSubjectStore();

  const user = {
    name: '사용자명',
    id: '아이디',
    testCount: 3,
    subjects: [
      { name: '프로그래밍 입문', code: '001' },
      { name: '공학 수학', code: '002' },
    ] as Subject[],
  };

  const openModal = () => {
    setTempBirthdate(birthdate); // 기존 생년월일 초기값
    setModalOpen(true);
  };

  const handleSaveBirthdate = () => {
    setBirthdate(tempBirthdate);
    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10 pb-4 relative">
      {/* 비밀번호 변경 버튼 - 우측 상단 */}
      <div className="absolute top-10 right-8">
        <Button text="비밀번호 변경하기" variant="secondary" size="medium" />
      </div>

      {/* 사용자명 + 아이디 */}
      <div className="flex items-end gap-2 mb-4">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <span className="text-lg text-gray-600 font-normal">({user.id})</span>
      </div>

      {/* 생년월일 + 아이콘 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700">
          {birthdate}
        </div>
        <button onClick={openModal} className="text-gray-500 hover:text-black">
          <FiEdit2 size={16} />
        </button>
      </div>

      {/* 유사도 검사 횟수 */}
      <p className="text-sm text-gray-700 mb-4">
        진행한 유사도 검사 횟수:{' '}
        <span className="text-blue-600 font-semibold">{user.testCount}회</span>
      </p>

      {/* 과목 아코디언 */}
      <div className="mb-6">
        <button
          onClick={() => setSubjectOpen(!isSubjectOpen)}
          className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          관리 중인 과목 {isSubjectOpen ? '▲' : '▼'}
        </button>

        {isSubjectOpen && (
          <div className="mt-2 border border-gray-300 rounded-md overflow-hidden w-fit text-sm text-gray-800">
            {user.subjects.map((subj, idx) => (
              <div
                key={subj.code}
                onClick={() => setSelectedSubject(subj)}
                className={`px-4 py-2 ${idx !== user.subjects.length - 1 ? 'border-b border-gray-300' : ''}`}
              >
                {subj.name} ({subj.code})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 구분선 */}
      <hr className="border-t border-gray-300" />

      {/* 년월일 수정 모달 */}
      {isModalOpen && (
        <BirthdateEditModal
          value={tempBirthdate}
          onChange={setTempBirthdate}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveBirthdate}
        />
      )}
    </div>
  );
};

export default UserInfoHeader;
