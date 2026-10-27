import * as THREE from 'three';

/**
 * Creates a high-fidelity procedural monocrystalline solar cell texture
 * Complete with anti-reflective deep navy/indigo silicon, silver busbars,
 * and wafer division lines.
 */
export function createSolarPanelTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Base anti-reflective monocrystalline silicon (deep navy-black)
  const grad = ctx.createLinearGradient(0, 0, 512, 1024);
  grad.addColorStop(0, '#0c1427');
  grad.addColorStop(0.5, '#091020');
  grad.addColorStop(1, '#0c162b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // 2. Subtle silicon wafer grain/crystallite noise
  ctx.fillStyle = 'rgba(20, 45, 90, 0.08)';
  for (let i = 0; i < 2400; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 1024;
    const rw = 2 + Math.random() * 4;
    const rh = 2 + Math.random() * 4;
    ctx.fillRect(rx, ry, rw, rh);
  }

  // 3. Solar cell grid: 6 columns x 10 rows of cut half-cells
  const cols = 6;
  const rows = 10;
  const cellW = 512 / cols;
  const cellH = 1024 / rows;

  ctx.strokeStyle = '#050a14'; // Cell gap lines
  ctx.lineWidth = 3;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH;

      // Cell border
      ctx.strokeRect(x + 1.5, y + 1.5, cellW - 3, cellH - 3);

      // Micro finger contacts across each cell (fine horizontal conductive lines)
      ctx.strokeStyle = 'rgba(150, 190, 240, 0.12)';
      ctx.lineWidth = 1;
      const fingerStep = 8;
      for (let fy = y + 6; fy < y + cellH - 6; fy += fingerStep) {
        ctx.beginPath();
        ctx.moveTo(x + 3, fy);
        ctx.lineTo(x + cellW - 3, fy);
        ctx.stroke();
      }
    }
  }

  // 4. Silver busbars (3 vertical thick silver conducting ribbons per cell column)
  ctx.strokeStyle = 'rgba(215, 230, 255, 0.78)';
  ctx.lineWidth = 2.5;

  for (let c = 0; c < cols; c++) {
    const colX = c * cellW;
    const bb1 = colX + cellW * 0.25;
    const bb2 = colX + cellW * 0.5;
    const bb3 = colX + cellW * 0.75;

    [bb1, bb2, bb3].forEach((bx) => {
      ctx.beginPath();
      ctx.moveTo(bx, 6);
      ctx.lineTo(bx, 1018);
      ctx.stroke();
    });
  }

  // 5. Aluminum frame border around panel edge
  ctx.strokeStyle = '#2d3748'; // Anodized black or dark aluminum frame
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 1014);

  // Inner chamfer highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(11, 11, 490, 1002);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates procedural architectural shingle texture for gabled/hip roof slopes
 */
export function createRoofShingleTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base asphalt slate color (deep slate charcoal)
  ctx.fillStyle = '#222831';
  ctx.fillRect(0, 0, 512, 512);

  // Shingle courses
  const courseHeight = 24;
  const rows = Math.ceil(512 / courseHeight);

  for (let r = 0; r < rows; r++) {
    const y = r * courseHeight;
    const offset = (r % 2) * 48;

    // Course shadow line at bottom edge
    ctx.fillStyle = 'rgba(10, 12, 16, 0.85)';
    ctx.fillRect(0, y + courseHeight - 2, 512, 2);

    // Course top highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, y, 512, 1.5);

    // Individual shingle tabs
    const tabWidth = 72;
    for (let x = -offset; x < 512 + tabWidth; x += tabWidth) {
      // Random tab shade variation
      const shade = 30 + Math.floor(Math.random() * 14);
      ctx.fillStyle = `rgb(${shade}, ${shade + 3}, ${shade + 7})`;
      ctx.fillRect(x + 1, y, tabWidth - 2, courseHeight - 2);

      // Tab vertical separation slit
      ctx.fillStyle = 'rgba(5, 6, 8, 0.9)';
      ctx.fillRect(x + tabWidth - 2, y, 2, courseHeight - 2);
    }
  }

  // Surface mineral grit noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 3000; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/**
 * Creates procedural exterior lap siding texture for the house facade
 */
export function createHouseSidingTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm off-white / architectural greige
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 256, 512);

  const plankHeight = 20;
  for (let y = 0; y < 512; y += plankHeight) {
    // Drop shadow under lap
    ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
    ctx.fillRect(0, y + plankHeight - 3, 256, 3);

    // Upper highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0, y, 256, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/**
 * Creates soft contact shadow texture for grounding the home on the lawn
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.65)');
  grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.35)');
  grad.addColorStop(0.8, 'rgba(15, 23, 42, 0.1)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
