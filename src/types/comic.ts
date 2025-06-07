export type Point = [number, number];

export interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Panel {
  id: string;
  shape: 'polygon';
  points: Point[];
  dropZone?: BoundingBox;
  imageUrl?: string;
}

export interface ComicPage {
  id: string;
  panels: Panel[];
} 