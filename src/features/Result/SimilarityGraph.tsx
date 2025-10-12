import React, { useEffect, useRef } from 'react';
import {
  Network,
  DataSet,
  type Node,
  type Edge,
  type IdType,
} from 'vis-network/standalone/esm/vis-network';
import { FileNode, FileEdge } from 'types/similarity';

interface Props {
  nodes: FileNode[];
  edges: FileEdge[];
  onNodeHover?: (node: FileNode) => void;
  onEdgeHover?: (edge: FileEdge) => void;
  onEdgeClick?: (edge: FileEdge) => void;
  variant?: 'preview' | 'full';
  height?: number;
  interactionOptions?: {
    dragNodes?: boolean;
    zoomView?: boolean;
    dragView?: boolean;
  };
}

const brand = {
  nodeBg: '#2563eb',
  nodeBorder: '#1d4ed8',
  edgeLow: '#94a3b8',
  edgeMid: '#3b82f6',
  edgeHigh: '#f59e0b',
  edgeVery: '#ef4444',
  label: '#334155',
};

const edgeColor = (s: number) =>
  s >= 90
    ? brand.edgeVery
    : s >= 75
      ? brand.edgeHigh
      : s >= 60
        ? brand.edgeMid
        : brand.edgeLow;

const EDGE_BASE_WIDTH = 3;
type VisId = IdType;

const rgba = (hex: string, a: number) => {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

function sizePreset(n: number, preview: boolean) {
  if (preview) return { node: 10, label: 11, edgeLabel: 10 };
  if (n >= 70) return { node: 8, label: 10, edgeLabel: 10 };
  if (n >= 50) return { node: 10, label: 11, edgeLabel: 11 };
  if (n >= 30) return { node: 12, label: 12, edgeLabel: 12 };
  return { node: 14, label: 14, edgeLabel: 12 };
}

function initialPhysics(n: number) {
  const springLength = Math.min(260, 140 + n * 2);
  const grav = Math.max(-200, -50 - n);
  return {
    enabled: true,
    solver: 'forceAtlas2Based' as const,
    stabilization: { iterations: 250, updateInterval: 50 },
    forceAtlas2Based: {
      gravitationalConstant: grav,
      centralGravity: 0.02,
      springLength,
      springConstant: 0.04,
      damping: 0.45,
      avoidOverlap: 1,
    },
  };
}

const SimilarityGraph: React.FC<Props> = ({
  nodes,
  edges,
  onNodeHover,
  onEdgeHover,
  onEdgeClick,
  variant = 'full',
  height,
  interactionOptions,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ===== A. 데이터 정규화
    const uniqNodes: FileNode[] = Array.from(
      nodes
        .reduce<Map<string, FileNode>>((m, n) => {
          const id = String(n.id);
          m.set(id, { ...n, id });
          return m;
        }, new Map())
        .values()
    );

    const normalizedEdges = edges.map((e) => ({
      ...e,
      from: String(e.from),
      to: String(e.to),
    }));

    const dedupEdges: FileEdge[] = (() => {
      const m = new Map<string, FileEdge>();
      for (const e of normalizedEdges) {
        const [x, y] = e.from <= e.to ? [e.from, e.to] : [e.to, e.from];
        const k = `${x}-${y}`;
        const prev = m.get(k);
        if (!prev || e.similarity > prev.similarity)
          m.set(k, { ...e, from: x, to: y });
      }
      return Array.from(m.values());
    })();

    // ===== B. datasets
    const isPreview = variant === 'preview';
    const sizes = sizePreset(uniqNodes.length, isPreview);
    const showEdgeLabel = (sim: number) => `${sim}%`;

    const visNodes = new DataSet<Node>(
      uniqNodes.map((n) => ({ id: n.id as IdType, label: n.label }))
    );

    const visEdges = new DataSet<Edge>(
      dedupEdges.map((e) => ({
        id: `${e.from}-${e.to}`,
        from: e.from,
        to: e.to,
        label: showEdgeLabel(e.similarity),
        width: Math.max(1, Math.round((EDGE_BASE_WIDTH * e.similarity) / 100)),
        color: {
          color: edgeColor(e.similarity),
          hover: edgeColor(e.similarity),
          highlight: edgeColor(e.similarity),
        },
        font: {
          align: 'middle',
          color: brand.label,
          size: sizes.edgeLabel,
          face: 'Inter, ui-sans-serif',
          strokeWidth: 2,
          strokeColor: '#ffffff',
        },
        smooth: false,
      }))
    );

    const edgeSimMap = new Map<string, number>();
    dedupEdges.forEach((e) =>
      edgeSimMap.set(`${e.from}-${e.to}`, e.similarity)
    );

    // ===== C. 네트워크(초기만 physics → 위치 고정)
    const network = new Network(
      container,
      { nodes: visNodes, edges: visEdges },
      {
        autoResize: false,
        physics: initialPhysics(uniqNodes.length),
        layout: { improvedLayout: true, randomSeed: 42 },
        nodes: {
          shape: 'dot',
          size: sizes.node,
          color: {
            background: brand.nodeBg,
            border: brand.nodeBorder,
            highlight: brand.nodeBg,
            hover: brand.nodeBg,
          },
          font: {
            color: '#ffffff',
            size: sizes.label,
            face: 'Inter, ui-sans-serif',
            strokeWidth: 3,
            strokeColor: '#1e293b',
          },
          borderWidth: 2,
        },
        edges: {
          selectionWidth: 2,
          hoverWidth: 0,
          arrows: { to: { enabled: false } },
          smooth: false,
        },
        interaction: {
          hover: true,
          tooltipDelay: 120,
          zoomView: false,
          dragView: false,
          dragNodes: false,
          selectable: true,
          multiselect: false,
          keyboard: { enabled: false },
        },
      }
    );

    // 초기 레이아웃 → 고정
    network.once('stabilized', () => {
      const pos = network.getPositions(uniqNodes.map((n) => n.id as IdType));
      visNodes.update(
        uniqNodes.map((n) => ({
          id: n.id as IdType,
          x: pos[n.id]?.x,
          y: pos[n.id]?.y,
          fixed: { x: true, y: true },
        }))
      );
      network.setOptions({ physics: { enabled: false } });
      network.fit({ animation: false });
      const current = network.getScale();
      network.moveTo({
        scale: current * (isPreview ? 0.92 : 0.96),
        animation: false,
      });
    });

    networkRef.current = network;

    // ===== D. 이벤트
    // 1) Hover: 정보만 전달 (✔ 깜빡임 유발하던 select 제거)
    network.on('hoverNode', (params: { node: VisId }) => {
      const node = uniqNodes.find((n) => n.id === String(params.node));
      if (node) onNodeHover?.(node);
    });

    network.on('hoverEdge', (params: { edge: VisId }) => {
      const [fromId, toId] = String(params.edge).split('-');
      const edge = dedupEdges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (e.from === toId && e.to === fromId)
      );
      if (edge) onEdgeHover?.(edge);
    });

    // 2) Click: 노드 클릭 시에만 하이라이트(포커스), 빈 공간 클릭 시 해제
    const applyFocus = (nid: string) => {
      const connected = new Set<string>([nid]);
      visEdges.forEach((e) => {
        if (e.from === nid || e.to === nid) {
          connected.add(String(e.from));
          connected.add(String(e.to));
        }
      });
      visNodes.forEach((n) => {
        const dim = !connected.has(String(n.id));
        visNodes.update({
          id: n.id!,
          color: {
            background: dim ? rgba(brand.nodeBg, 0.18) : brand.nodeBg,
            border: dim ? rgba(brand.nodeBorder, 0.25) : brand.nodeBorder,
            highlight: dim ? rgba(brand.nodeBg, 0.18) : brand.nodeBg,
            hover: dim ? rgba(brand.nodeBg, 0.18) : brand.nodeBg,
          },
          font: { color: dim ? rgba('#ffffff', 0.7) : '#ffffff' },
        } as Partial<Node>);
      });
      visEdges.forEach((e) => {
        const isConn = e.from === nid || e.to === nid;
        const sim = edgeSimMap.get(String(e.id)) ?? 0;
        const strong = edgeColor(sim);
        visEdges.update({
          id: e.id!,
          color: {
            color: isConn ? strong : rgba('#94a3b8', 0.2),
            hover: isConn ? strong : rgba('#94a3b8', 0.2),
            highlight: isConn ? strong : rgba('#94a3b8', 0.2),
          },
          width: isConn ? (e.width ?? 2) : 1,
        } as Partial<Edge>);
      });
    };

    const clearFocus = () => {
      visNodes.forEach((n) => {
        visNodes.update({
          id: n.id!,
          color: {
            background: brand.nodeBg,
            border: brand.nodeBorder,
            highlight: brand.nodeBg,
            hover: brand.nodeBg,
          },
          font: { color: '#ffffff' },
        } as Partial<Node>);
      });
      visEdges.forEach((e) => {
        const sim = edgeSimMap.get(String(e.id)) ?? 0;
        const c = edgeColor(sim);
        visEdges.update({
          id: e.id!,
          color: { color: c, hover: c, highlight: c },
          width: e.width ?? 2,
        } as Partial<Edge>);
      });
    };

    network.on('click', (params: { nodes: VisId[]; edges: VisId[] }) => {
      if (params.nodes.length > 0) {
        applyFocus(String(params.nodes[0]));
        return;
      }
      if (params.edges.length > 0) {
        const [fromId, toId] = String(params.edges[0]).split('-');
        const edge = dedupEdges.find(
          (e) =>
            (e.from === fromId && e.to === toId) ||
            (e.from === toId && e.to === fromId)
        );
        if (edge) onEdgeClick?.(edge);
        return;
      }
      // 빈 공간 클릭 → 해제
      clearFocus();
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [
    nodes,
    edges,
    onNodeHover,
    onEdgeHover,
    onEdgeClick,
    interactionOptions,
    variant,
  ]);

  const finalHeight = height ?? (variant === 'preview' ? 200 : 560);
  return (
    <div ref={containerRef} style={{ height: finalHeight, width: '100%' }} />
  );
};

export default SimilarityGraph;
