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

const edgeColor = (s: number) =>
  s >= 90 ? '#ef4444' : s >= 75 ? '#f59e0b' : s >= 60 ? '#3b82f6' : '#94a3b8';

const edgeWidth = (s: number) =>
  s >= 90 ? 8 : s >= 75 ? 6 : s >= 60 ? 4 : s >= 40 ? 2 : 1;

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

    const visNodes = new DataSet(
      nodes.map((n) => ({
        id: n.id,
        label: n.label,
        title: undefined, // 기본 툴팁 제거
        fixed: { x: true, y: true },
      }))
    );

    const visEdges = new DataSet(
      edges.map((e) => ({
        id: `${e.from}-${e.to}`,
        from: e.from,
        to: e.to,
        label: `${e.similarity}%`,
        width: edgeWidth(e.similarity),
        color: {
          color: edgeColor(e.similarity),
          hover: edgeColor(e.similarity),
          highlight: edgeColor(e.similarity),
        },
        font: { align: 'middle', color: '#475569', size: 12 },
      }))
    );

    const {
      dragNodes = false,
      zoomView = false,
      dragView = false,
    } = interactionOptions ?? {};

    const network = new Network(
      containerRef.current,
      { nodes: visNodes, edges: visEdges },
      {
        physics: { enabled: false },
        layout: { randomSeed: 42 },
        nodes: {
          shape: 'dot',
          size: 18,
          fixed: true,
          physics: false,
          color: { background: '#0ea5e9', border: '#0284c7' },
        },
        edges: { smooth: true },
        interaction: {
          hover: true,
          tooltipDelay: 120,
          zoomView,
          dragView,
          dragNodes,
          selectable: true,
        },
      }
    );

    networkRef.current = network;

    // Hover select 효과 추가(가독성↑)
    network.on('hoverNode', (params) => {
      network.selectNodes([params.node]);
      const node = nodes.find((n) => n.id === params.node);
      if (node) onNodeHover?.(node);
    });
    network.on('blurNode', () => network.unselectAll());

    network.on('hoverEdge', (params) => {
      network.selectEdges([params.edge]);
      const [fromId, toId] = String(params.edge).split('-');
      const edge = edges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (e.from === toId && e.to === fromId)
      );
      if (edge) onEdgeHover?.(edge);
    });
    network.on('blurEdge', () => network.unselectAll());

    network.on('click', (params) => {
      if (params.edges.length === 0) return;
      const [fromId, toId] = String(params.edges[0]).split('-');
      const edge = edges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (e.from === toId && e.to === fromId)
      );
      if (edge) onEdgeClick?.(edge);
    });

    return () => network.destroy();
  }, [nodes, edges, onNodeHover, onEdgeHover, onEdgeClick, interactionOptions]);

  return <div ref={containerRef} className="h-[520px] w-full" />;
};

export default SimilarityGraph;
