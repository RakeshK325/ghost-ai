"use client";

import React from "react";
import { 
  Square, 
  Diamond, 
  Circle, 
  Pill, 
  Cylinder, 
  Hexagon 
} from "lucide-react";
import { NodeShape } from "@/types/canvas";

interface ShapeItem {
  type: NodeShape;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  width: number;
  height: number;
}

const SHAPES: ShapeItem[] = [
  { type: "rectangle", label: "Rectangle", icon: Square, width: 150, height: 70 },
  { type: "diamond", label: "Diamond", icon: Diamond, width: 110, height: 110 },
  { type: "circle", label: "Circle", icon: Circle, width: 80, height: 80 },
  { type: "pill", label: "Pill", icon: Pill, width: 140, height: 60 },
  { type: "cylinder", label: "Cylinder", icon: Cylinder, width: 90, height: 110 },
  { type: "hexagon", label: "Hexagon", icon: Hexagon, width: 120, height: 95 },
];

export function ShapeToolbar() {
  const onDragStart = (event: React.DragEvent, shape: NodeShape, width: number, height: number) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ shape, size: { width, height } })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-bg-surface/90 border border-border-default shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-border-subtle group">
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-r border-border-default/80 pr-3 mr-1 select-none">
        Shapes
      </span>
      <div className="flex items-center gap-1.5">
        {SHAPES.map((shape) => {
          const Icon = shape.icon;
          return (
            <div
              key={shape.type}
              draggable
              onDragStart={(e) => onDragStart(e, shape.type, shape.width, shape.height)}
              className="flex items-center justify-center h-9 w-9 rounded-lg text-text-secondary hover:text-brand hover:bg-bg-subtle/80 cursor-grab active:cursor-grabbing transition-all duration-200"
              title={`Drag ${shape.label} onto canvas`}
            >
              <Icon className="h-5 w-5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
