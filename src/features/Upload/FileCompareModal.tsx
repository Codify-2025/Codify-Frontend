import React, { useEffect, useMemo, useRef } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';

interface FileCompareModalProps {
  existingFile: File;
  newFile: File;
  onSelect: (file: File) => void;
  onCancel: () => void;
}

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes)) return '-';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let n = bytes,
    i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};

const pad = (x: number) => String(x).padStart(2, '0');
const formatDateTime = (ms?: number) => {
  if (!ms) return '-';
  const d = new Date(ms);
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const FileCompareModal: React.FC<FileCompareModalProps> = ({
  existingFile,
  newFile,
  onSelect,
  onCancel,
}) => {
  const headingId = 'file-compare-heading';
  const descId = 'file-compare-desc';
  const modalRef = useRef<HTMLDivElement>(null);

  const diffs = useMemo(() => {
    const list: string[] = [];
    if (existingFile.name !== newFile.name) list.push('파일명이 다릅니다.');
    if (existingFile.size !== newFile.size) list.push('파일 크기가 다릅니다.');
    if ((existingFile.type || '알 수 없음') !== (newFile.type || '알 수 없음'))
      list.push('파일 유형이 다릅니다.');
    return list;
  }, [existingFile, newFile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    setTimeout(() => modalRef.current?.focus(), 0);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descId}
        tabIndex={-1}
        className="relative z-[9999] w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Text
              as="h2"
              id={headingId}
              variant="h2"
              weight="bold"
              className="text-gray-900"
            >
              파일 비교
            </Text>
            <Text id={descId} variant="caption" color="muted" className="mt-1">
              동일한 위치에 업로드하려는 파일이 감지되었습니다. 유지할 파일을
              선택해 주세요.
            </Text>
          </div>
          <button
            aria-label="닫기"
            onClick={onCancel}
            className="rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <span className="block h-4 w-4 leading-none text-gray-500">✕</span>
          </button>
        </div>

        {/* 차이점 요약 */}
        {diffs.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <Text variant="caption" className="text-amber-800">
              차이점: {diffs.join(' · ')}
            </Text>
          </div>
        )}

        {/* 파일 카드 */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 기존 파일 */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              기존 파일
            </span>
            <Text
              as="div"
              variant="body"
              weight="medium"
              className="truncate font-mono text-gray-800"
              title={existingFile.name}
            >
              {existingFile.name}
            </Text>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div>크기: {formatBytes(existingFile.size)}</div>
              <div>유형: {existingFile.type || '알 수 없음'}</div>
              <div>수정: {formatDateTime(existingFile.lastModified)}</div>
            </div>
          </div>

          {/* 새 파일 */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              새 파일
            </span>
            <Text
              as="div"
              variant="body"
              weight="medium"
              className="truncate font-mono text-gray-800"
              title={newFile.name}
            >
              {newFile.name}
            </Text>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div>크기: {formatBytes(newFile.size)}</div>
              <div>유형: {newFile.type || '알 수 없음'}</div>
              <div>수정: {formatDateTime(newFile.lastModified)}</div>
            </div>
          </div>
        </div>

        {/* 액션 */}
        <div className="mt-6 flex flex-col-reverse gap-2 md:flex-row md:justify-end">
          <Button
            text="기존 파일 유지"
            variant="secondary"
            size="md"
            onClick={() => onSelect(existingFile)}
          />
          <Button
            text="새 파일 업로드"
            variant="primary"
            size="md"
            onClick={() => onSelect(newFile)}
          />
          <Button
            text="취소"
            variant="ghost"
            size="md"
            onClick={onCancel}
            ariaLabel="모달 닫기"
          />
        </div>
      </div>
    </div>
  );
};

export default FileCompareModal;
