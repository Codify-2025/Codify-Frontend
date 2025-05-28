import { create } from 'zustand';

export interface FileData {
  id: string;
  label: string;
  submittedAt: string;
  content: string[];
  similarMap: Record<number, string[]>; // 각 줄 번호 → 유사한 다른 파일들
}

interface SelectedFileStore {
  files: FileData[]; // 전체 파일 목록
  selectedFileA: FileData | null;
  selectedFileB: FileData | null;
  setFiles: (files: FileData[]) => void;
  setSelectedFiles: (fileA: FileData, fileB: FileData) => void;
}

export const useSelectedFileStore = create<SelectedFileStore>((set) => ({
  files: [],
  selectedFileA: null,
  selectedFileB: null,

  setFiles: (files) => set({ files }),

  setSelectedFiles: (fileA, fileB) => {
    set({ selectedFileA: fileA, selectedFileB: fileB });
  },
}));
