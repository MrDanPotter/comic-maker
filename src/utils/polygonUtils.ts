import { Point, BoundingBox } from '../types/comic';

export function getBoundingBox(points: Point[]): BoundingBox {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    top: minY,
    left: minX,
    width: maxX - minX,
    height: maxY - minY
  };
}

export function pointsToSvgPath(points: Point[]): string {
  return points.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point[0]},${point[1]}`
  ).join(' ') + ' Z';
}

export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  const [x, y] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    
    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
} 