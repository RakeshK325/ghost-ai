"use client";

import React, { useRef } from "react";
import { 
  ReactFlow, 
  Background, 
  MiniMap, 
  ConnectionMode, 
  BackgroundVariant,
  useReactFlow
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { CanvasNodeComponent } from "./canvas-node";
import { ShapeToolbar } from "./shape-toolbar";
import { NodeShape, CanvasNode, CanvasEdge } from "@/types/canvas";

const nodeTypes = {
  canvasNode: CanvasNodeComponent,
};

export function CollaborativeFlow() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    onDelete 
  } = useLiveblocksFlow<CanvasNode, CanvasEdge>({
    suspense: true,
    nodes: {
      initial: [],
    },
    edges: {
      initial: [],
    },
  });

  const { screenToFlowPosition } = useReactFlow();
  const nodeCounterRef = useRef(0);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const rawData = event.dataTransfer.getData("application/reactflow");
    if (!rawData) return;

    try {
      const { shape, size } = JSON.parse(rawData) as {
        shape: NodeShape;
        size: { width: number; height: number };
      };

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const adjustedPosition = {
        x: position.x - size.width / 2,
        y: position.y - size.height / 2,
      };

      const counter = nodeCounterRef.current++;
      const id = `${shape}-${Date.now()}-${counter}`;

      onNodesChange([
        {
          type: "add",
          item: {
            id,
            type: "canvasNode",
            position: adjustedPosition,
            data: {
              label: "",
              color: "neutral",
              shape,
            },
            width: size.width,
            height: size.height,
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to add node on drop:", err);
    }
  };

  return (
    <div 
      className="w-full h-full relative bg-bg-base"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        proOptions={{ hideAttribution: true }}
        fitView
        className="text-text-primary"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={1.5} 
          className="bg-bg-base opacity-75"
          color="#2a2a30"
        />
        <Cursors />
        <MiniMap 
          position="bottom-right"
          zoomable 
          pannable 
          className="!bg-bg-surface/85 !border-border-default !rounded-xl !overflow-hidden [&_.react-flow__minimap-mask]:!fill-bg-base/40 [&_.react-flow__minimap-node]:!fill-bg-subtle/60 [&_.react-flow__minimap-node]:!stroke-border-subtle"
          bgColor="#080809"
          nodeColor="#1a1a20"
          maskColor="rgba(8, 8, 9, 0.4)"
        />
      </ReactFlow>

      {/* Floating Pill Shape Toolbar */}
      <ShapeToolbar />
    </div>
  );
}
