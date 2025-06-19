export interface FileNode {
  id: string;
  label: string;
  submittedAt: string;
}

export interface FileEdge {
  from: string;
  to: string;
  similarity: number;
  count?: number;
}
