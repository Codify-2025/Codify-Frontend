import { create } from 'zustand';

interface SubjectRef {
  id?: string;
  name: string;
  // code: string;
}

interface SubjectStore {
  selectedSubject: SubjectRef | null;
  setSelectedSubject: (subject: SubjectRef | null) => void;
}

export const useSubjectStore = create<SubjectStore>((set) => ({
  selectedSubject: null,
  setSelectedSubject: (subject) => set({ selectedSubject: subject }),
}));
