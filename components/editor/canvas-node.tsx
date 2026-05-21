import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { CanvasNode } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";
import { cn } from "@/lib/utils";

export function CanvasNodeComponent({ data, selected }: NodeProps<CanvasNode>) {
  const colorKey = data.color || "neutral";
  const colorPair = NODE_COLORS[colorKey] || NODE_COLORS.neutral;

  return (
    <div
      className={cn(
        "group relative w-full h-full min-w-[80px] min-h-[40px] rounded-xl border transition-all duration-200 select-none flex items-center justify-center px-4 py-2 text-center",
        selected 
          ? "border-brand ring-2 ring-brand/40 ring-offset-2 ring-offset-bg-base" 
          : "border-border-default hover:border-border-subtle"
      )}
      style={{
        backgroundColor: colorPair.bg,
        color: colorPair.text,
      }}
    >
      {/* Centered label */}
      <span className="text-xs font-semibold break-all leading-tight">
        {data.label || ""}
      </span>

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
