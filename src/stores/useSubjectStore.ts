import { create } from 'zustand';

interface Subject {
  name: string;
  code: string;
}

interface SubjectStore {
  selectedSubject: Subject | null;
  setSelectedSubject: (subject: Subject | null) => void;
}

export const useSubjectStore = create<SubjectStore>((set) => ({
  selectedSubject: null,
  setSelectedSubject: (subject) => set({ selectedSubject: subject }),
}));
