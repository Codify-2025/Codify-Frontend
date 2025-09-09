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

const brand = {
  nodeBg: '#2563eb', // tailwind blue-600
  nodeBorder: '#1d4ed8', // blue-700
  edgeLow: '#94a3b8', // slate-400
  edgeMid: '#3b82f6', // blue-500
  edgeHigh: '#f59e0b', // amber-500
  edgeVery: '#ef4444', // red-500
  label: '#334155', // slate-700
};

const edgeColor = (s: number) =>
  s >= 90
    ? brand.edgeVery
    : s >= 75
      ? brand.edgeHigh
      : s >= 60
        ? brand.edgeMid
        : brand.edgeLow;

const edgeWidth = (s: number) =>
  s >= 90 ? 10 : s >= 75 ? 7 : s >= 60 ? 5 : s >= 40 ? 3 : 2;

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

    // 동일 페어 중복 제거
    const dedupEdges = (() => {
      const m = new Map<string, FileEdge>();
      for (const e of edges) {
        const [x, y] = e.from <= e.to ? [e.from, e.to] : [e.to, e.from];
        const k = `${x}-${y}`;
        const prev = m.get(k);
        if (!prev || e.similarity > prev.similarity)
          m.set(k, { ...e, from: x, to: y });
      }
      return Array.from(m.values());
    })();

    const visNodes = new DataSet(
      nodes.map((n) => ({
        id: n.id,
        label: n.label,
        title: undefined,
      }))
    );

    const visEdges = new DataSet(
      dedupEdges.map((e) => ({
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
        font: {
          align: 'middle',
          color: brand.label,
          size: 14,
          face: 'Inter, ui-sans-serif',
          strokeWidth: 2,
          strokeColor: '#ffffff',
        },
        smooth: { enabled: true, type: 'dynamic', roundness: 0.5 },
      }))
    );

    // const {
    //   dragNodes = false,
    //   zoomView = false,
    //   dragView = false,
    // } = interactionOptions ?? {};

    const network = new Network(
      containerRef.current,
      { nodes: visNodes, edges: visEdges },
      {
        physics: {
          enabled: true, // 1) 처음엔 켜서 레이아웃 잡고
          solver: 'forceAtlas2Based',
          stabilization: { iterations: 300 },
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.02,
            springLength: 200,
            springConstant: 0.04,
            damping: 0.4,
            avoidOverlap: 1,
          },
        },
        layout: { improvedLayout: true, randomSeed: 42 }, // 재랜더링 일관성
        nodes: {
          shape: 'dot',
          size: 20,
          color: {
            background: brand.nodeBg,
            border: brand.nodeBorder,
            highlight: brand.nodeBg,
            hover: brand.nodeBg,
          },
          font: {
            color: '#ffffff',
            size: 16,
            face: 'Inter, ui-sans-serif',
            strokeWidth: 3,
            strokeColor: '#1e293b',
          },
          borderWidth: 2,
          // physics: false, // 개별 노드는 물리 영향 받지 않게(흔들림 감소)
        },
        edges: {
          selectionWidth: 2,
          hoverWidth: 0,
          arrows: { to: { enabled: false } },
          smooth: { enabled: true, type: 'dynamic', roundness: 0.5 },
        },
        interaction: {
          hover: true,
          tooltipDelay: 120,
          zoomView: interactionOptions?.zoomView ?? false,
          dragView: interactionOptions?.dragView ?? false,
          dragNodes: interactionOptions?.dragNodes ?? false,
          selectable: true,
        },
      }
    );

    // 안정화가 끝나면 물리 끄기 → 더 이상 안 흔들림
    network.once('stabilized', () => {
      network.setOptions({ physics: { enabled: false } });
    });

    networkRef.current = network;

    // 이벤트 연결
    network.on('hoverNode', (params) => {
      network.selectNodes([params.node]);
      const node = nodes.find((n) => n.id === params.node);
      if (node) onNodeHover?.(node);
    });
    network.on('blurNode', () => network.unselectAll());

    network.on('hoverEdge', (params) => {
      network.selectEdges([params.edge]);
      const [fromId, toId] = String(params.edge).split('-');
      const edge = dedupEdges.find(
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
      const edge = dedupEdges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (e.from === toId && e.to === fromId)
      );
      if (edge) onEdgeClick?.(edge);
    });

    return () => network.destroy();
  }, [nodes, edges, onNodeHover, onEdgeHover, onEdgeClick, interactionOptions]);

  return <div ref={containerRef} className="h-[560px] w-full" />;
};

export default SimilarityGraph;
