// src/stores/useSavedRecordStore.ts
import { create } from 'zustand';
import { SavedRecord } from '@constants/dummySavedRecords';

interface SavedRecordState {
  records: SavedRecord[]; // 전체 저장된 기록
  selectedRecord: SavedRecord | null; // 선택된 하나의 기록
  setRecords: (records: SavedRecord[]) => void;
  selectRecordById: (id: string) => void;
  clearSelectedRecord: () => void;
}

export const useSavedRecordStore = create<SavedRecordState>((set, get) => ({
  records: [], // 초깃값: 비어 있음
  selectedRecord: null,
  setRecords: (records) => set({ records }),
  selectRecordById: (id) => {
    const target = get().records.find((r) => r.id === id) || null;
    set({ selectedRecord: target });
  },
  clearSelectedRecord: () => set({ selectedRecord: null }),
}));
