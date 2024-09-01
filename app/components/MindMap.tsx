import React, { useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as d3 from 'd3';
import ForceGraph3D from 'react-force-graph-3d';
import { ForceGraphMethods } from 'react-force-graph-3d';

const ForceGraph2D = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph2D), { ssr: false });

interface Node {
  id: string;
  title: string;
  description: string;
}

interface Link {
  source: string;
  target: string;
}

interface MindMapProps {
  data: any; // You might want to define a more specific type for your data
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const graphRef = useRef<ForceGraphMethods>();

  const transformData = useCallback((node: any, parentId: string | null = null) => {
    const nodes: Node[] = [];
    const links: Link[] = [];

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

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData} // This prop will update the graph data
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