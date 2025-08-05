import { create } from 'zustand';

interface AssignmentState {
  assignmentId: string | null;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  week: number | null;
  setAssignmentId: (id: string) => void;
  setName: (name: string) => void;
  setDates: (start: Date, end: Date) => void;
  setWeek: (week: number) => void;
  reset: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignmentId: null,
  name: '',
  startDate: null,
  endDate: null,
  week: null,
  setAssignmentId: (id) => set({ assignmentId: id }),
  setName: (name) => set({ name }),
  setDates: (start, end) => set({ startDate: start, endDate: end }),
  setWeek: (week) => set({ week }),
  reset: () =>
    set({
      assignmentId: null,
      name: '',
      startDate: null,
      endDate: null,
      week: null,
    }),
}));
