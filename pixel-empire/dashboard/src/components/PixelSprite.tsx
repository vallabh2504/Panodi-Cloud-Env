import { PALETTE } from '../sprites';

interface PixelSpriteProps {
  pixels: number[][];
  scale?: number;
  glow?: string | null;
}

export default function PixelSprite({ pixels, scale = 4, glow = null }: PixelSpriteProps) {
  const size = scale;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(16, ${size}px)`,
        gridTemplateRows: `repeat(16, ${size}px)`,
        imageRendering: 'pixelated',
        filter: glow ? `drop-shadow(0 0 6px ${glow})` : undefined,
      }}
    >
      {pixels.flat().map((idx, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            backgroundColor: PALETTE[idx] ?? 'transparent',
          }}
        />
      ))}
    </div>
  );
}
