// Exported function for generating circular border paths with overlapping ovals
export const generateSketchyCirclePaths = (
  width: number,
  height: number,
  roughness: number
) => {
  if (width === 0 || height === 0) return [];

  // Calculate center and radii with proper padding
  const padding = 8;
  const centerX = width / 2 + padding;
  const centerY = height / 2 + padding;

  // Create horizontal ovals (much wider than tall)
  const baseRadiusX = (width / 2) * 1.8; // 40% wider for horizontal oval
  const baseRadiusY = (height / 2) * 1.2; // 30% shorter for horizontal oval

  // Generate multiple overlapping horizontal ovals with random angle variations
  // Number of ovals based on roughness (more roughness = more overlapping circles)
  const baseOvals = 1;
  const numOvals = Math.max(
    2,
    Math.min(baseOvals + Math.floor(roughness * 3), 5)
  );
  const paths = [];

  // Base angle for all ovals
  const baseAngle = 15; // Start horizontal
  const maxAngleChange = 5; // Maximum 5 degree variation

  for (let i = 0; i < numOvals; i++) {
    // Random angle within ±20.25 degrees
    const randomAngleOffset = (Math.random() - 0.2) * 1.5 * maxAngleChange; // -20.25 to +20.25 degrees
    const angle = baseAngle + randomAngleOffset;
    const angleRad = (angle * Math.PI) / 180;

    // Vary horizontal spread (radiusX) by ±22.5% (50% increase from 15%)
    const radiusXVariation = (Math.random() - 0.5) * 0.45; // -22.5% to +22.5%
    const rx = baseRadiusX * (1 + radiusXVariation);
    const ry = baseRadiusY;

    // Create ellipse path with rotation
    // We'll draw the ellipse in segments to add slight variations
    const segments = 32; // Increased segments for smoother curves
    const points: { x: number; y: number }[] = [];

    for (let j = 0; j <= segments; j++) {
      const t = (j / segments) * 2 * Math.PI;

      // Calculate point on ellipse
      const x = rx * Math.cos(t);
      const y = ry * Math.sin(t);

      // Apply rotation
      const rotatedX = x * Math.cos(angleRad) - y * Math.sin(angleRad);
      const rotatedY = x * Math.sin(angleRad) + y * Math.cos(angleRad);

      // Add to center - perfectly smooth, no roughness
      points.push({
        x: centerX + rotatedX,
        y: centerY + rotatedY,
      });
    }

    // Create smooth path using cubic bezier curves
    let pathD = `M${points[0].x} ${points[0].y}`;

    for (let j = 0; j < points.length - 1; j++) {
      const p0 = points[j];
      const p1 = points[(j + 1) % points.length];
      const p2 = points[(j + 2) % points.length];

      // Calculate control points for perfectly smooth curves
      const cp1x = p0.x + (p1.x - p0.x) * 0.5;
      const cp1y = p0.y + (p1.y - p0.y) * 0.5;
      const cp2x = p1.x - (p2.x - p1.x) * 0.2;
      const cp2y = p1.y - (p2.y - p1.y) * 0.2;

      pathD += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    paths.push({ d: pathD });
  }

  return paths;
};
