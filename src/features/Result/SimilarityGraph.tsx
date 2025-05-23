import React, { useEffect, useRef } from 'react';
import { Network, DataSet } from 'vis-network/standalone/esm/vis-network';

interface FileNode {
  id: string;
  label: string;
  submittedAt: string;
}

interface FileEdge {
  from: string;
  to: string;
  similarity: number;
}

interface Props {
  nodes: FileNode[];
  edges: FileEdge[];
  onNodeHover?: (node: FileNode) => void;
  onEdgeHover?: (edge: FileEdge) => void;
  interactionOptions?: {
    dragNodes?: boolean;
    zoomView?: boolean;
    dragView?: boolean;
  };
}

const SimilarityGraph: React.FC<Props> = ({
  nodes,
  edges,
  onNodeHover,
  onEdgeHover,
  interactionOptions,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // vis.js 노드 생성
    const visNodes = new DataSet(
      nodes.map((node) => ({
        id: node.id,
        label: node.label,
        title: `파일명: ${node.label}\n제출 시간: ${node.submittedAt}`,
        fixed: { x: true, y: true },
      }))
    );

    // vis.js 엣지 생성
    const visEdges = new DataSet(
      edges.map((edge) => ({
        id: `${edge.from}-${edge.to}`,
        from: edge.from,
        to: edge.to,
        label: `${edge.similarity}%`,
        width:
          edge.similarity > 90
            ? 10
            : edge.similarity > 75
              ? 7
              : edge.similarity > 60
                ? 4
                : edge.similarity > 40
                  ? 2
                  : 1,
        color: {
          color: edge.similarity > 80 ? 'red' : 'gray',
        },
        font: { align: 'middle' },
      }))
    );

    // 네트워크 생성
    const network = new Network(
      containerRef.current,
      { nodes: visNodes, edges: visEdges },
      {
        physics: {
          enabled: false,
        },
        layout: {
          randomSeed: 42,
        },
        edges: { smooth: true },
        nodes: { shape: 'dot', size: 20, fixed: true, physics: false },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: interactionOptions?.zoomView ?? true,
          dragView: false,
          dragNodes: false,
          selectable: false,
        },
      }
    );

    // 노드 호버
    network.on('hoverNode', (params) => {
      const node = nodes.find((n) => n.id === params.node);
      if (node && onNodeHover) onNodeHover(node);
    });

    network.on('hoverEdge', (params) => {
      const [fromId, toId] = params.edge.split('-');
      const matchedEdge = edges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (e.from === toId && e.to === fromId)
      );

      if (matchedEdge && onEdgeHover) {
        onEdgeHover(matchedEdge);
      }
    });

    return () => {
      network.destroy();
    };
  }, [nodes, edges, onNodeHover, onEdgeHover, interactionOptions]);

  return <div ref={containerRef} style={{ height: '500px', width: '100%' }} />;
};

export default SimilarityGraph;
