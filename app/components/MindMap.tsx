import React, { useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph2D), { ssr: false });

interface MindMapProps {
  data: any;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const graphRef = useRef();

  const transformData = useCallback((node: any, parentId: string | null = null) => {
    const nodes = [];
    const links = [];

    const traverse = (node: any, parentId: string | null = null) => {
      const id = node.title;
      nodes.push({ id, ...node });

      if (parentId) {
        links.push({ source: parentId, target: id });
      }

      if (node.children) {
        node.children.forEach((child: any) => traverse(child, id));
      }
    };

    traverse(node, parentId);

    return { nodes, links };
  }, []);

  const graphData = transformData(data.root, null);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.graphData(graphData);
    }
  }, [data, graphData]);

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.title;
    const fontSize = 12/globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = node.color;
    ctx.fillText(label, node.x, node.y);
  }, []);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel={(node) => `${node.title}\n\n${node.description}`}
        nodeAutoColorBy="id"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.001}
        nodeCanvasObject={nodeCanvasObject}
        nodeCanvasObjectMode={() => 'replace'}
      />
    </div>
  );
};

export default MindMap;