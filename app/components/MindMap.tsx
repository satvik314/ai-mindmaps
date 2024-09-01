import React, { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import * as d3 from "d3";
import { ForceGraphMethods, GraphData } from "react-force-graph-2d";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

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

  const transformData = useCallback(
    (node: any, parentId: string | null = null) => {
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
    },
    []
  );

  const graphData = transformData(data.root, null);

  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.title;
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
      ctx.fillStyle = node.color || "#666"; // Use node color if available, otherwise default to gray
      ctx.fill();

      // Draw node label
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, node.x, node.y + 10); // Position label below the node
    },
    []
  );

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ForceGraph2D
        ref={graphRef as React.MutableRefObject<ForceGraphMethods>}
        graphData={graphData}
        nodeLabel={(node: any) => `${node.title}\n\n${node.description}`}
        nodeAutoColorBy="id"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.001}
        nodeCanvasObject={nodeCanvasObject}
        nodeCanvasObjectMode={() => "replace"}
      />
    </div>
  );
};

export default MindMap;
