export type Overlay = {
  id: string;
  type: "square" | "image";
  // Position and size as percentages (0-100) of the container
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string; // For square overlays
  imageUrl?: string; // For image overlays
};
