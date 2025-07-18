import { ReferenceImage } from '../services/imageGeneratorService';

export type Point = [number, number];

export type AspectRatio = 'square' | 'portrait' | 'landscape';

export type ReferenceImageType = 'style' | 'character' | 'scene' | 'other';

export interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Image {
  id: string;
  url: string;
  name: string;
  isUsed: boolean;
  usedInPanels: string[]; // Array of panel IDs where this image is used
  source: 'user' | 'ai'; // Whether the image was uploaded by user or generated by AI
  isDownloaded?: boolean; // Whether the AI-generated image has been downloaded (only relevant for AI images)
  prompt?: string; // The user's prompt used to generate the image (only for AI images)
  referenceImages?: ReferenceImage[]; // Reference images used to generate this image (only for AI images)
}

export interface Panel {
  id: string;
  pageId: string; // Reference to the parent page
  shape: 'polygon';
  points: Point[];
  dropZone?: BoundingBox;
  imageUrl?: string;
}

export interface ComicPage {
  id: string;
  pageNumber: number; // The order of this page in the comic (1-based)
  panels: Panel[];
} 