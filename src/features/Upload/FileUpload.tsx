import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import FileItem from './FileItem';
import Text from '@components/Text';
import Notification from '@components/Notification';
import FileCompareModal from './FileCompareModal';
import { FiUploadCloud } from 'react-icons/fi';
import { useUploader } from '@hooks/useUploader';
import { useAssignmentStore } from '@stores/useAssignmentStore';

interface FileData {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  studentId?: string;
  studentName?: string;
  submittedAt?: Date;
  isFromZip?: boolean;
}
type Meta = { studentId: number; studentName: string; submittedAt: Date };
type Stage =
  | 'idle'
  | 'presigning'
  | 'uploading'
  | 'registering'
  | 'done'
  | 'error';
type MetaBase = {
  assignmentId: number;
  week: number;
  submissionDate: Date;
  studentId: number;
  studentName: string;
};
type MetaDeriver = (file: File, index: number) => MetaBase;

const SUPPORTED_EXTENSIONS = ['.cpp', '.zip'];
const ENABLE_UPLOAD_DEV = import.meta.env.VITE_ENABLE_UPLOAD_DEV === 'true';

function getNumberFromQS(param: string) {
  const v = new URLSearchParams(window.location.search).get(param);
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

const DEV_ASSIGNMENT_ID =
  getNumberFromQS('assignmentId') ??
  Number(import.meta.env.VITE_DEV_ASSIGNMENT_ID ?? 1);

const DEV_WEEK =
  getNumberFromQS('week') ?? Number(import.meta.env.VITE_DEV_WEEK ?? 1);

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const { items, enqueue, start } = useUploader(3);
  const { assignmentId, week } = useAssignmentStore();

  const [devAssignmentId, setDevAssignmentId] =
    useState<number>(DEV_ASSIGNMENT_ID);
  const [devWeek, setDevWeek] = useState<number>(DEV_WEEK);

  // 유효한 assignment/week 얻기 (실서비스는 store, 미선택시 dev fallback)
  const effectiveAssignmentId =
    assignmentId ?? (ENABLE_UPLOAD_DEV ? devAssignmentId : undefined);
  const effectiveWeek = week ?? (ENABLE_UPLOAD_DEV ? devWeek : undefined);

  const [notification, setNotification] = useState<string | null>(null);
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const startRequestedRef = React.useRef<MetaDeriver | null>(null);
  const fileKey = (f: File) => `${f.name}::${f.size}::${f.lastModified}`;

  // 업로드 상태/진행률 매핑
  const uploaderMap = React.useMemo(() => {
    const m = new Map<string, { stage?: Stage; progress?: number }>();
    for (const it of items) {
      m.set(fileKey(it.file), {
        stage: it.stage as Stage,
        progress: it.progress,
      });
    }
    return m;
  }, [items]);

  const validateAssignmentContext = () => {
    const ok = !(effectiveAssignmentId == null || effectiveWeek == null);
    if (!ok) {
      showTimedNotification(
        '과제/주차 정보가 없습니다. (개발용 기본값 또는 쿼리스트링으로 지정하세요)'
      );
    }
    return ok;
  };

  const getStage = (f: File): Stage | undefined =>
    uploaderMap.get(fileKey(f))?.stage;
  const getProgress = (f: File) => uploaderMap.get(fileKey(f))?.progress ?? 0;

  // 0~1 또는 0~100 모두 대응
  const getProgressPct = (f: File) => {
    const raw = getProgress(f);
    const pct = raw <= 1 ? raw * 100 : raw;
    return Math.max(0, Math.min(100, Math.round(pct)));
  };

  const showTimedNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const isSupported = (file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const ok = SUPPORTED_EXTENSIONS.includes(ext);
    return ok;
  };

  const extractFileMeta = (file: File) => {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const [studentId, studentName] = nameWithoutExt.split('_');
    const meta = {
      studentId: studentId || nameWithoutExt,
      studentName: studentName || nameWithoutExt,
      submittedAt: new Date(file.lastModified),
    };
    return meta;
  };

  const extractFilesFromZip = async (zipFile: File): Promise<FileData[]> => {
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(zipFile);
      const extractedFiles: FileData[] = [];

      const cppEntries = Object.entries(content.files).filter(
        ([, f]) => !f.dir && f.name.toLowerCase().endsWith('.cpp')
      );

      for (const [filename] of cppEntries) {
        const baseName = filename.substring(filename.lastIndexOf('/') + 1);
        const nameWithoutExt = baseName.replace(/\.[^/.]+$/, '');
        const underscoreIndex = nameWithoutExt.indexOf('_');
        const studentId =
          underscoreIndex !== -1
            ? nameWithoutExt.substring(0, underscoreIndex)
            : '';
        const studentName =
          underscoreIndex !== -1
            ? nameWithoutExt.substring(underscoreIndex + 1)
            : '';
        const fallback = nameWithoutExt;
        const fileBlob = await content.files[filename].async('blob');

        extractedFiles.push({
          id: `${zipFile.name}-${filename}-${Date.now()}`,
          file: new File([fileBlob], baseName, { type: 'text/plain' }),
          status: 'uploading',
          studentId: studentId || fallback,
          studentName: studentName || fallback,
          submittedAt: new Date(zipFile.lastModified),
          isFromZip: true,
        });
      }
      return extractedFiles;
    } catch (e) {
      console.error('[FileUpload] ZIP 처리 실패:', e);
      return [];
    }
  };

  const showBatchNotification = (
    invalid: string[],
    duplicate: string[],
    added: string[]
  ) => {
    if (added.length === 0) {
      if (invalid.length && !duplicate.length) {
        showTimedNotification(
          `지원하지 않는 파일 형식입니다: ${invalid.join(', ')}`
        );
      } else if (!invalid.length && duplicate.length) {
        showTimedNotification('모든 파일이 이미 업로드되어 있습니다.');
      } else if (invalid.length && duplicate.length) {
        showTimedNotification(
          `모든 파일이 무시되었습니다. (중복 ${duplicate.length}개, 미지원 ${invalid.length}개)`
        );
      } else {
        showTimedNotification('추가된 파일이 없습니다.');
      }
      return;
    }

    const parts: string[] = [];
    if (added.length) parts.push(`${added.length}개 추가`);
    if (duplicate.length) parts.push(`중복 ${duplicate.length}개 제외`);
    if (invalid.length) parts.push(`미지원 ${invalid.length}개 제외`);
    if (parts.length) showTimedNotification(parts.join(' · '));
  };

  const processSingleFile = (
    file: File,
    batch: FileData[],
    metaMap: Map<File, Meta>,
    results: { invalid: string[]; duplicate: string[]; added: string[] }
  ) => {
    // 미지원 확장자
    if (!isSupported(file)) {
      results.invalid.push(file.name);
      return;
    }

    // .cpp만 들어오도록
    if (!file.name.toLowerCase().endsWith('.cpp')) {
      results.invalid.push(file.name);
      return;
    }

    const { studentId, studentName, submittedAt } = extractFileMeta(file);
    const newFD: FileData = {
      id: `${file.name}-${Date.now()}`,
      file,
      status: 'uploading',
      studentId,
      studentName,
      submittedAt,
    };

    // 중복 검사 (기존 목록 + 이번 배치)
    const isDup =
      files.some(
        (f) =>
          f.file.name === file.name &&
          f.studentId === newFD.studentId &&
          f.studentName === newFD.studentName
      ) ||
      batch.some(
        (f) =>
          f.file.name === file.name &&
          f.studentId === newFD.studentId &&
          f.studentName === newFD.studentName
      );

    if (isDup) {
      results.duplicate.push(file.name);
      setDuplicateFile(file);
      setExistingFile(file);
      return;
    }

    batch.push(newFD);
    metaMap.set(file, {
      studentId: Number(studentId ?? 0) || 0,
      studentName: studentName ?? 'Unknown',
      submittedAt,
    });
    results.added.push(file.name);
  };

  const processZipFile = async (
    zipFile: File,
    batch: FileData[],
    metaMap: Map<File, Meta>,
    results: { invalid: string[]; duplicate: string[]; added: string[] }
  ) => {
    if (!isSupported(zipFile)) {
      results.invalid.push(zipFile.name);
      return;
    }
    if (!zipFile.name.toLowerCase().endsWith('.zip')) {
      results.invalid.push(zipFile.name);
      return;
    }

    const extracted = await extractFilesFromZip(zipFile);

    const nonDuplicate = extracted.filter(
      (e) =>
        !files.some(
          (f) =>
            f.studentId === e.studentId &&
            f.studentName === e.studentName &&
            f.file.name === e.file.name
        ) &&
        !batch.some(
          (f) =>
            f.studentId === e.studentId &&
            f.studentName === e.studentName &&
            f.file.name === e.file.name
        )
    );

    if (nonDuplicate.length === 0) {
      results.duplicate.push(`${zipFile.name} (압축 내 중복)`);
      return;
    }

    batch.push(...nonDuplicate);
    for (const e of nonDuplicate) {
      metaMap.set(e.file, {
        studentId: Number.isNaN(Number(e.studentId)) ? 0 : Number(e.studentId),
        studentName: e.studentName ?? 'Unknown',
        submittedAt: e.submittedAt ?? new Date(),
      });
      results.added.push(e.file.name);
    }
  };

  // 메인 핸들러
  const handleFileProcessing = async (newFiles: File[]) => {
    if (!validateAssignmentContext()) return;

    if (effectiveAssignmentId == null || effectiveWeek == null) {
      console.error(
        'Assignment context validation failed but execution continued'
      );
      return;
    }

    const aId: number = effectiveAssignmentId;
    const wk: number = effectiveWeek;

    const batchFileDatas: FileData[] = [];
    const metaMap = new Map<File, Meta>();
    const results = {
      invalid: [] as string[],
      duplicate: [] as string[],
      added: [] as string[],
    };

    for (const file of newFiles) {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (ext === '.zip') {
        await processZipFile(file, batchFileDatas, metaMap, results);
      } else {
        processSingleFile(file, batchFileDatas, metaMap, results);
      }
    }

    if (batchFileDatas.length === 0) {
      showBatchNotification(results.invalid, results.duplicate, results.added);
      return;
    }

    setFiles((prev) => {
      const next = [...prev, ...batchFileDatas];
      return next;
    });

    const batchFiles = batchFileDatas.map((b) => b.file);

    startRequestedRef.current = (fileObj: File) => {
      const meta = metaMap.get(fileObj) ?? {
        studentId: 0,
        studentName: 'Unknown',
        submittedAt: new Date(),
      };
      const m = {
        assignmentId: aId,
        week: wk,
        submissionDate: meta.submittedAt,
        studentId: meta.studentId,
        studentName: meta.studentName,
      };
      return m;
    };

    console.log(
      '[FileUpload] Enqueueing files:',
      batchFiles.map((f) => f.name)
    );
    enqueue(batchFiles);

    // deriver를 먼저 캡처하여 race condition 방지
    const currentDeriver = startRequestedRef.current;
    requestAnimationFrame(() => {
      if (currentDeriver && startRequestedRef.current === currentDeriver) {
        startRequestedRef.current = null;
        start(currentDeriver);
      }
    });

    if (results.invalid.length || results.duplicate.length) {
      showBatchNotification(results.invalid, results.duplicate, results.added);
    }
  };

  // 개발용 샘플 파일 생성
  const addSampleFiles = () => {
    const f1 = new File(
      [`// sample A\nint main(){return 0;}`],
      '20230001_홍길동.cpp',
      { type: 'text/x-c++src' }
    );
    const f2 = new File(
      [`// sample B\nint sum(){return 42;}`],
      '20230002_김철수.cpp',
      { type: 'text/x-c++src' }
    );
    const f3 = new File(
      [`// sample C\nint mul(){return 6*7;}`],
      '20230003_이영희.cpp',
      { type: 'text/x-c++src' }
    );
    void handleFileProcessing([f1, f2, f3]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    console.log(newFiles.map((f) => f.name));
    void handleFileProcessing(newFiles);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = Array.from(e.dataTransfer.files);
    void handleFileProcessing(newFiles);
  };

  // 중복 파일 모달
  const addFile = (file: File) => {
    const { studentId, studentName, submittedAt } = extractFileMeta(file);
    const newFile: FileData = {
      id: `${file.name}-${Date.now()}`,
      file,
      status: 'uploading',
      studentId,
      studentName,
      submittedAt,
    };
    setFiles((prev) => [...prev, newFile]);
  };

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile === duplicateFile && existingFile) {
      setFiles((prev) => prev.filter((f) => f.file.name !== existingFile.name));
      addFile(duplicateFile);
    }
    setDuplicateFile(null);
    setExistingFile(null);
  };
  const handleModalCancel = () => {
    setDuplicateFile(null);
    setExistingFile(null);
  };

  React.useEffect(() => {
    if (items.length > 0 && startRequestedRef.current) {
      const deriver = startRequestedRef.current;
      startRequestedRef.current = null;
      start(deriver);
    }
  }, [items, start]);

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-8">
      {/* DEV 패널 */}
      {ENABLE_UPLOAD_DEV && (
        <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/60 p-3 text-sm text-blue-700">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold">DEV Upload Panel</span>
            <label className="flex items-center gap-1">
              assignmentId
              <input
                type="number"
                className="w-24 rounded border border-blue-200 bg-white px-2 py-1"
                value={devAssignmentId}
                onChange={(e) =>
                  setDevAssignmentId(Number(e.target.value) || 1)
                }
              />
            </label>
            <label className="flex items-center gap-1">
              week
              <input
                type="number"
                className="w-16 rounded border border-blue-200 bg-white px-2 py-1"
                value={devWeek}
                onChange={(e) => setDevWeek(Number(e.target.value) || 1)}
              />
            </label>
            <button
              type="button"
              onClick={addSampleFiles}
              className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              샘플 파일 3개 추가
            </button>
            <span className="text-xs text-blue-600">
              쿼리스트링 override 예: <code>?assignmentId=10&week=3</code>
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span>queued: {items.length}</span>
            <button
              type="button"
              onClick={() => {
                if (startRequestedRef.current) {
                  const deriver = startRequestedRef.current;
                  startRequestedRef.current = null;
                  start(deriver);
                }
              }}
              className="rounded bg-slate-700 px-2 py-1 text-white"
            >
              강제 start()
            </button>
          </div>
        </div>
      )}

      {duplicateFile && existingFile && (
        <FileCompareModal
          existingFile={existingFile}
          newFile={duplicateFile}
          onSelect={handleFileSelection}
          onCancel={handleModalCancel}
        />
      )}

      {/* 드래그&드롭 영역 */}
      <div className="flex w-full gap-8">
        <div
          className="flex h-[340px] flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 ring-1 ring-gray-200 transition hover:border-blue-300 hover:ring-blue-200"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          aria-label="파일 업로드 드롭존"
        >
          <FiUploadCloud size={44} className="mb-3 text-blue-600" />
          <Text variant="body" color="muted" className="text-center">
            이곳에 파일을 드래그하거나 <br /> 클릭하여 업로드하세요
          </Text>
          <Text variant="caption" color="muted" className="mt-2">
            허용: .cpp, .zip
          </Text>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept=".cpp,.zip"
          />
        </div>

        {/* 파일 리스트 영역 */}
        <div className="flex w-1/2 min-w-[320px] flex-col">
          {notification && (
            <Notification message={notification} type="warning" />
          )}
          <div className="mb-2 flex items-center justify-between">
            <Text variant="caption" weight="medium" color="primary">
              파일 목록 ({files.length})
            </Text>
          </div>

          <div className="h-0.5 w-full bg-gray-100" />

          <div className="mt-3 max-h-[300px] space-y-2 overflow-y-auto rounded-xl bg-gray-50 p-3">
            {files.length === 0 ? (
              <Text variant="body" color="muted">
                업로드된 파일이 없습니다.
              </Text>
            ) : (
              files.map((fd) => {
                const stage = getStage(fd.file);
                const progress = getProgressPct(fd.file);
                return (
                  <div
                    key={fd.id}
                    className="rounded-lg bg-white px-3 py-2 shadow-sm"
                  >
                    <FileItem
                      fileData={fd}
                      externalStage={stage}
                      externalProgress={progress}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
