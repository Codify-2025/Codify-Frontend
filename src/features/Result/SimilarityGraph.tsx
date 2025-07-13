import React, { useEffect, useRef } from 'react';
import { Network, DataSet } from 'vis-network/standalone/esm/vis-network';
import { FileNode, FileEdge } from 'types/similarity';

interface Props {
  nodes: FileNode[];
  edges: FileEdge[];
  onNodeHover?: (node: FileNode) => void;
  onEdgeHover?: (edge: FileEdge) => void;
  onEdgeClick?: (edge: FileEdge) => void;
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
  onEdgeClick,
  interactionOptions,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // vis-network용 노드 데이터셋
    const visNodes = new DataSet(
      nodes.map((node) => ({
        id: node.id,
        label: node.label,
        title: undefined, // 중복 툴팁 방지
        fixed: { x: true, y: true },
      }))
    );

    // vis-network용 엣지 데이터셋
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

    // interaction 기본 옵션 처리
    const {
      dragNodes = false,
      zoomView = false,
      dragView = false,
    } = interactionOptions ?? {};

    // 네트워크 그래프 초기화
    const network = new Network(
      containerRef.current,
      { nodes: visNodes, edges: visEdges },
      {
        physics: { enabled: false },
        layout: { randomSeed: 42 },
        nodes: {
          shape: 'dot',
          size: 20,
          fixed: true,
          physics: false,
        },
        edges: {
          smooth: true,
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView,
          dragView,
          dragNodes,
          selectable: true,
        },
      }
    );

    networkRef.current = network;

    // 노드 hover 이벤트
    network.on('hoverNode', (params) => {
      const node = nodes.find((n) => n.id === params.node);
      if (node) onNodeHover?.(node);
    });

    // 엣지 hover 이벤트
    network.on('hoverEdge', (params) => {
      const [fromId, toId] = params.edge.split('-');
      const edge = edges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (e.from === toId && e.to === fromId)
      );
      if (edge) onEdgeHover?.(edge);
    });

    // 엣지 클릭 이벤트
    network.on('click', (params) => {
      if (params.edges.length === 0) return;

      const [fromId, toId] = params.edges[0].split('-');
      const edge = edges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (e.from === toId && e.to === fromId)
      );

      if (edge) onEdgeClick?.(edge);
    });

    return () => {
      network.destroy();
    };
  }, [nodes, edges, onNodeHover, onEdgeHover, onEdgeClick, interactionOptions]);

  return <div ref={containerRef} className="w-full h-[500px]" />;
};

export default SimilarityGraph;
