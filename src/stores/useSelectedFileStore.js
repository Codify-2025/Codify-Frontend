import { create } from 'zustand';
export const useSelectedFileStore = create((set) => ({
    files: [],
    selectedFileA: null,
    selectedFileB: null,
    setFiles: (files) => set({ files }),
    setSelectedFiles: (fileA, fileB) => {
        set({ selectedFileA: fileA, selectedFileB: fileB });
    },
}));
