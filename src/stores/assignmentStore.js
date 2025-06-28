import { create } from 'zustand';
export const useAssignmentStore = create((set) => ({
    name: '',
    startDate: null,
    endDate: null,
    week: null,
    setName: (name) => set({ name }),
    setDates: (start, end) => set({ startDate: start, endDate: end }),
    setWeek: (week) => set({ week }),
    reset: () => set({
        name: '',
        startDate: null,
        endDate: null,
        week: null,
    }),
}));
