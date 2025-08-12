import { create } from 'zustand';

type NumLike = number | string | null | undefined;

const toNumberOrNull = (v: NumLike): number | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const n = Number(String(v));
  return Number.isFinite(n) ? n : null;
};

const toDateOrNull = (v: Date | string | null | undefined): Date | null => {
  if (!v) return null;
  if (v instanceof Date) {
    return isNaN(v.getTime()) ? null : v;
  }
  const date = new Date(v);
  return isNaN(date.getTime()) ? null : date;
};

interface AssignmentState {
  assignmentId: number | null;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  week: number | null;

  setAssignmentId: (id: number | string | null) => void;
  setName: (name: string) => void;
  setDates: (start: Date | string | null, end: Date | string | null) => void;
  setWeek: (week: number | string | null) => void;

  reset: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignmentId: null,
  name: '',
  startDate: null,
  endDate: null,
  week: null,

  setAssignmentId: (id) => set({ assignmentId: toNumberOrNull(id) }),
  setName: (name) => set({ name }),
  setDates: (start, end) =>
    set({
      startDate: toDateOrNull(start),
      endDate: toDateOrNull(end),
    }),
  setWeek: (week) => set({ week: toNumberOrNull(week) }),

  reset: () =>
    set({
      assignmentId: null,
      name: '',
      startDate: null,
      endDate: null,
      week: null,
    }),
}));
