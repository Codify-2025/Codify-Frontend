import { create } from 'zustand';

interface AssignmentState {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  week: number | null;
  setName: (name: string) => void;
  setDates: (start: Date, end: Date) => void;
  setWeek: (week: number) => void;
  reset: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  name: '',
  startDate: null,
  endDate: null,
  week: null,
  setName: (name) => set({ name }),
  setDates: (start, end) => set({ startDate: start, endDate: end }),
  setWeek: (week) => set({ week }),
  reset: () =>
    set({
      name: '',
      startDate: null,
      endDate: null,
      week: null,
    }),
}));
