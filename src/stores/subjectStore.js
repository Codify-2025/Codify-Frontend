import { create } from 'zustand';
export const useSubjectStore = create((set) => ({
    selectedSubject: null,
    setSelectedSubject: (subject) => set({ selectedSubject: subject }),
}));
