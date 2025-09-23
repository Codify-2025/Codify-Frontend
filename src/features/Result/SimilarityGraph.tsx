import React, { useEffect, useRef } from 'react';
import { Network, DataSet } from 'vis-network/standalone/esm/vis-network';
import { FileNode, FileEdge } from 'types/similarity';

interface Props {
  nodes: FileNode[];
  edges: FileEdge[];
  onNodeHover?: (node: FileNode) => void;
  onEdgeHover?: (edge: FileEdge) => void;
  onEdgeClick?: (edge: FileEdge) => void;
  /** 'preview' = 카드 미리보기 (작고 간결), 'full' = 상세 화면 */
  variant?: 'preview' | 'full';
  /** 그래프 높이(px). 미지정 시 variant에 따라 200 / 560 */
  height?: number;
  interactionOptions?: {
    dragNodes?: boolean;
    zoomView?: boolean;
    dragView?: boolean;
  };
}

const brand = {
  nodeBg: '#2563eb', // blue-600
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

const EDGE_BASE_WIDTH = 4;

type VisId = string | number;

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

    // ====== A. 데이터 정규화 ======
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

    // 같은 페어 중복 제거(가장 높은 유사도로)
    const dedupEdges = (() => {
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

    // ====== B. vis datasets ======
    const visNodes = new DataSet(
      uniqNodes.map((n) => ({ id: n.id, label: n.label, title: undefined }))
    );

    const isPreview = variant === 'preview';
    const showEdgeLabel = (sim: number) =>
      isPreview ? (sim >= 80 ? `${sim}%` : undefined) : `${sim}%`;
    const nodeSize = isPreview ? 12 : 20;
    const nodeFontSize = isPreview ? 12 : 16;
    const edgeFontSize = isPreview ? 11 : 14;

    const visEdges = new DataSet(
      dedupEdges.map((e) => ({
        id: `${e.from}-${e.to}`,
        from: e.from,
        to: e.to,
        label: showEdgeLabel(e.similarity),
        width: Math.max(
          2,
          Math.round((EDGE_BASE_WIDTH * e.similarity) / 100) +
            (isPreview ? 0 : 1)
        ),
        color: {
          color: edgeColor(e.similarity),
          hover: edgeColor(e.similarity),
          highlight: edgeColor(e.similarity),
        },
        font: {
          align: 'middle',
          color: brand.label,
          size: edgeFontSize,
          face: 'Inter, ui-sans-serif',
          strokeWidth: 2,
          strokeColor: '#ffffff',
        },
        smooth: { enabled: true, type: 'dynamic', roundness: 0.5 },
      }))
    );

    // ====== C. 네트워크 생성 ======
    const network = new Network(
      container,
      { nodes: visNodes, edges: visEdges },
      {
        physics: {
          enabled: true,
          solver: 'forceAtlas2Based',
          stabilization: { iterations: isPreview ? 200 : 300 },
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.02,
            springLength: isPreview ? 140 : 200,
            springConstant: 0.04,
            damping: 0.4,
            avoidOverlap: 1,
          },
        },
        layout: { improvedLayout: true, randomSeed: 42 },
        nodes: {
          shape: 'dot',
          size: nodeSize,
          color: {
            background: brand.nodeBg,
            border: brand.nodeBorder,
            highlight: brand.nodeBg,
            hover: brand.nodeBg,
          },
          font: {
            color: '#ffffff',
            size: nodeFontSize,
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
          smooth: { enabled: true, type: 'dynamic', roundness: 0.5 },
        },
        interaction: {
          hover: true,
          tooltipDelay: 120,
          zoomView: interactionOptions?.zoomView ?? variant === 'full',
          dragView: interactionOptions?.dragView ?? variant === 'full',
          dragNodes: interactionOptions?.dragNodes ?? false,
          selectable: true,
        },
      }
    );

    const easing = { duration: 300, easingFunction: 'easeInOutQuad' as const };
    const marginFactor = isPreview ? 0.9 : 0.94; // 0.90 = 10% 여백, 0.94 = 6% 여백

    // ✅ fit 후 약간 줌아웃해서 여백 확보
    const fitWithMargin = (animate: boolean | typeof easing) => {
      network.fit({ animation: animate });
      const currentScale = network.getScale();
      network.moveTo({
        scale: currentScale * marginFactor,
        animation: animate,
      });
    };

    // 안정화 후 물리 끄고 화면에 맞춰 fit
    network.once('stabilized', () => {
      network.setOptions({ physics: { enabled: false } });
      fitWithMargin(easing); // ⬅️ easingFunction 사용, padding 제거
    });

    networkRef.current = network;

    // ====== D. 이벤트 ======
    network.on('hoverNode', (params: { node: VisId }) => {
      network.selectNodes([params.node]);
      const node = uniqNodes.find((n) => n.id === String(params.node));
      if (node) onNodeHover?.(node);
    });

    network.on('hoverEdge', (params: { edge: VisId }) => {
      network.selectEdges([params.edge]);
      const [fromId, toId] = String(params.edge).split('-');
      const edge = dedupEdges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (e.from === toId && e.to === fromId)
      );
      if (edge) onEdgeHover?.(edge);
    });

    network.on('click', (params: { edges: VisId[] }) => {
      if (params.edges.length === 0) return;
      const [fromId, toId] = String(params.edges[0]).split('-');
      const edge = dedupEdges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (e.from === toId && e.to === fromId)
      );
      if (edge) onEdgeClick?.(edge);
    });

    // 컨테이너 리사이즈에 맞춰 리드로/리핏
    const ro = new ResizeObserver(() => {
      if (!networkRef.current) return;
      // 리사이즈 시에도 동일하게 fit -> margin
      fitWithMargin(false); // ⬅️ animation: false, padding 제거
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
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

  // 높이/폭은 style로 제어 (클래스 고정 높이 제거)
  const finalHeight = height ?? (variant === 'preview' ? 200 : 560);

  return (
    <div ref={containerRef} style={{ height: finalHeight, width: '100%' }} />
  );
};

export default SimilarityGraph;
