import { create } from 'zustand';

interface PlagiarismDecision {
  fileAId: string;
  fileBId: string;
  isPlagiarism: boolean;
}

interface State {
  decisions: PlagiarismDecision[];
  saveDecision: (d: PlagiarismDecision) => void;
}

export const useDecisionStore = create<State>((set) => ({
  decisions: [],
  saveDecision: (decision) =>
    set((state) => ({
      decisions: [...state.decisions, decision],
    })),
}));
