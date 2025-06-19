export interface FileNode {
  id: string;
  label: string;
  submittedAt: string;
}

export interface FileEdge {
  from: string;
  to: string;
  similarity: number; // 해당 과제에서의 유사도 (1회 기준)
}

export interface AssignmentSimilarity {
  assignmentId: string;
  nodes: FileNode[];
  edges: FileEdge[];
}

export interface AccumulatedEdge {
  from: string;
  to: string;
  similarity: number; // 평균 유사도
  count: number; // 유사도 관측 횟수
}

/**
 * 여러 과제의 유사도 분석 결과를 누적하여 하나의 네트워크 데이터로 반환
 */
export function accumulateSimilarityData(assignments: AssignmentSimilarity[]) {
  const studentMap = new Map<string, FileNode>();
  const edgeMap = new Map<string, { total: number; count: number }>();

  assignments.forEach(({ nodes, edges }) => {
    nodes.forEach((node) => {
      studentMap.set(node.id, node); // 마지막 값으로 덮어쓰기 (가장 최근 제출시간 유지)
    });

    edges.forEach((edge) => {
      const key = [edge.from, edge.to].sort().join('-'); // 방향 무시
      const existing = edgeMap.get(key);

      if (existing) {
        edgeMap.set(key, {
          total: existing.total + edge.similarity,
          count: existing.count + 1,
        });
      } else {
        edgeMap.set(key, {
          total: edge.similarity,
          count: 1,
        });
      }
    });
  });

  const accumulatedNodes: FileNode[] = Array.from(studentMap.values());

  const accumulatedEdges: AccumulatedEdge[] = Array.from(edgeMap.entries()).map(
    ([key, { total, count }]) => {
      const [from, to] = key.split('-');
      return {
        from,
        to,
        similarity: Math.round(total / count),
        count,
      };
    }
  );

  return {
    nodes: accumulatedNodes,
    edges: accumulatedEdges,
  };
}
