import { Button } from 'antd';
import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  Node,
  getBezierPath,
  useReactFlow,
} from 'reactflow';

import { WebServerBlockNodeProps } from '../blocks/WebServerBlockNode.tsx';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
}: EdgeProps) {
  const { setEdges, setNodes, getNodes } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    // get node with source Id
    const sourceNode = getNodes().find(
      (node) => node.id === source,
    )! as Node<WebServerBlockNodeProps>;

    // remove connectionMetadata with target Id
    sourceNode.data.connectionMetadata = {
      dbRef:
        sourceNode.data.connectionMetadata.dbRef === target
          ? ''
          : sourceNode.data.connectionMetadata.dbRef,
    };

    // update nodes and remove edge
    setNodes((nodes) =>
      nodes.map((node) => (node.id === source ? sourceNode : node)),
    );
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <Button onClick={onEdgeClick}>x</Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
