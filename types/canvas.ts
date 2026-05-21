import { Node, Edge } from "@xyflow/react";

export type NodeShape = 'rectangle' | 'diamond' | 'circle' | 'pill' | 'cylinder' | 'hexagon';

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color?: string;
  shape?: NodeShape;
}

export type CanvasNode = Node<CanvasNodeData>;
export type CanvasEdge = Edge;

export const NODE_SHAPES: NodeShape[] = [
  'rectangle',
  'diamond',
  'circle',
  'pill',
  'cylinder',
  'hexagon'
];

export interface NodeColorPair {
  bg: string;
  text: string;
}

export const NODE_COLORS: Record<string, NodeColorPair> = {
  neutral: { bg: '#1F1F1F', text: '#EDEDED' },
  blue: { bg: '#10233D', text: '#52A8FF' },
  purple: { bg: '#2E1938', text: '#BF7AF0' },
  orange: { bg: '#331B00', text: '#FF990A' },
  red: { bg: '#3C1618', text: '#FF6166' },
  pink: { bg: '#3A1726', text: '#F75F8F' },
  green: { bg: '#0F2E18', text: '#62C073' },
  teal: { bg: '#062822', text: '#0AC7B4' },
};
