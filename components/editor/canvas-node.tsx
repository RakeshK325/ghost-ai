import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { CanvasNode } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";
import { cn } from "@/lib/utils";

export function CanvasNodeComponent({ data, selected }: NodeProps<CanvasNode>) {
  const shape = data.shape || "rectangle";
  const colorKey = data.color || "neutral";
  const colorPair = NODE_COLORS[colorKey] || NODE_COLORS.neutral;

  // Determine if it is a CSS-based shape vs SVG-based shape
  const isSvgShape = ["diamond", "cylinder", "hexagon"].includes(shape);

  // Core CSS/HTML shape styles
  let shapeClass = "";
  let textContainerClass = "absolute inset-0 flex items-center justify-center text-center p-2";

  if (shape === "rectangle") {
    shapeClass = cn(
      "rounded-xl border",
      selected 
        ? "border-brand ring-2 ring-brand/40 ring-offset-2 ring-offset-bg-base" 
        : "border-border-default hover:border-border-subtle"
    );
  } else if (shape === "circle") {
    shapeClass = cn(
      "rounded-full border aspect-square",
      selected 
        ? "border-brand ring-2 ring-brand/40 ring-offset-2 ring-offset-bg-base" 
        : "border-border-default hover:border-border-subtle"
    );
    textContainerClass = "absolute inset-[12%] flex items-center justify-center text-center";
  } else if (shape === "pill") {
    shapeClass = cn(
      "rounded-full border",
      selected 
        ? "border-brand ring-2 ring-brand/40 ring-offset-2 ring-offset-bg-base" 
        : "border-border-default hover:border-border-subtle"
    );
    textContainerClass = "absolute inset-x-4 inset-y-1 flex items-center justify-center text-center";
  }

  // Common SVG stroke properties using Tailwind custom values or absolute variables
  const svgStroke = selected ? "var(--accent-primary)" : "var(--border-default)";
  const svgStrokeWidth = selected ? "2" : "1.2";

  // Dynamic filter glow for SVG shapes when selected
  const svgStyle: React.CSSProperties = {
    filter: selected ? "drop-shadow(0 0 6px rgba(0, 200, 212, 0.45))" : undefined,
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div
      className={cn(
        "group relative w-full h-full min-w-[50px] min-h-[30px] select-none transition-all duration-200",
        !isSvgShape && shapeClass
      )}
      style={
        !isSvgShape
          ? {
              backgroundColor: colorPair.bg,
              color: colorPair.text,
            }
          : {
              color: colorPair.text,
            }
      }
    >
      {/* SVG Shape Renderers */}
      {shape === "diamond" && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={svgStyle}
        >
          <polygon
            points="50,2 98,50 50,98 2,50"
            fill={colorPair.bg}
            stroke={svgStroke}
            strokeWidth={svgStrokeWidth}
            className="transition-colors duration-200 group-hover:stroke-[var(--border-subtle)]"
          />
        </svg>
      )}

      {shape === "hexagon" && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={svgStyle}
        >
          <polygon
            points="25,2 75,2 98,50 75,98 25,98 2,50"
            fill={colorPair.bg}
            stroke={svgStroke}
            strokeWidth={svgStrokeWidth}
            className="transition-colors duration-200 group-hover:stroke-[var(--border-subtle)]"
          />
        </svg>
      )}

      {shape === "cylinder" && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={svgStyle}
        >
          {/* Main Cylinder Body */}
          <path
            d="M 2,15 L 2,85 A 48,12 0 0,0 98,85 L 98,15 Z"
            fill={colorPair.bg}
            stroke={svgStroke}
            strokeWidth={svgStrokeWidth}
            className="transition-colors duration-200 group-hover:stroke-[var(--border-subtle)]"
          />
          {/* Top Cap */}
          <ellipse
            cx="50"
            cy="15"
            rx="48"
            ry="12"
            fill={colorPair.bg}
            stroke={svgStroke}
            strokeWidth={svgStrokeWidth}
            className="transition-colors duration-200 group-hover:stroke-[var(--border-subtle)]"
          />
          {/* Accent lines inside (typical DB cylinder lines) */}
          <path
            d="M 2,35 A 48,12 0 0,0 98,35 M 2,55 A 48,12 0 0,0 98,55"
            fill="none"
            stroke={svgStroke}
            strokeWidth={svgStrokeWidth}
            className="transition-colors duration-200 opacity-40 group-hover:stroke-[var(--border-subtle)]"
          />
        </svg>
      )}

      {/* Centered label */}
      <div
        className={cn(
          textContainerClass,
          shape === "diamond" && "absolute inset-[22%]",
          shape === "hexagon" && "absolute inset-x-[15%] inset-y-[10%]",
          shape === "cylinder" && "absolute inset-x-2 top-8 bottom-3"
        )}
      >
        <span className="text-xs font-semibold break-words leading-tight">
          {data.label || ""}
        </span>
      </div>

      {/* Connection Handles - Hidden by default, visible on hover */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="opacity-0 group-hover:opacity-100 transition-opacity !bg-white !border-2 !border-brand !w-2.5 !h-2.5 !rounded-full !-top-1.25"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="opacity-0 group-hover:opacity-100 transition-opacity !bg-white !border-2 !border-brand !w-2.5 !h-2.5 !rounded-full !-bottom-1.25"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="opacity-0 group-hover:opacity-100 transition-opacity !bg-white !border-2 !border-brand !w-2.5 !h-2.5 !rounded-full !-left-1.25"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="opacity-0 group-hover:opacity-100 transition-opacity !bg-white !border-2 !border-brand !w-2.5 !h-2.5 !rounded-full !-right-1.25"
      />
    </div>
  );
}
