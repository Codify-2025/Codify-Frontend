// src/stores/useSavedRecordStore.ts
import { create } from 'zustand';
export const useSavedRecordStore = create((set, get) => ({
    records: [], // 초깃값: 비어 있음
    selectedRecord: null,
    setRecords: (records) => set({ records }),
    selectRecordById: (id) => {
        const target = get().records.find((r) => r.id === id) || null;
        set({ selectedRecord: target });
    },
    clearSelectedRecord: () => set({ selectedRecord: null }),
}));
