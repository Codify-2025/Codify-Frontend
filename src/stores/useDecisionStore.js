import { create } from 'zustand';
export const useDecisionStore = create((set) => ({
    decisions: [],
    saveDecision: (decision) => set((state) => ({
        decisions: [...state.decisions, decision],
    })),
}));
