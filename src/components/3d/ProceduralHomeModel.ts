import * as THREE from 'three';
import { RoofType } from '../../types/solar';
import {
  createSolarPanelTexture,
  createRoofShingleTexture,
  createHouseSidingTexture,
  createContactShadowTexture,
} from './ProceduralTextures';

export interface HouseModelComponents {
  rootGroup: THREE.Group;
  roofGroup: THREE.Group;
  panelsGroup: THREE.Group;
  houseBody: THREE.Mesh;
  updatePanels: (panelCount: number, tiltDeg: number, roofType: RoofType) => void;
  updateRoof: (roofType: RoofType, tiltDeg: number) => void;
  dispose: () => void;
}

export function buildProceduralHome(
  renderer: THREE.WebGLRenderer,
  initialRoofType: RoofType = 'gabled',
  initialPanelCount: number = 24,
  initialTilt: number = 28
): HouseModelComponents {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'ResidentialHouseWithSolar';

  // 1. Textures & Materials
  const solarTexture = createSolarPanelTexture(renderer);
  const shingleTexture = createRoofShingleTexture(renderer);
  const sidingTexture = createHouseSidingTexture(renderer);
  const shadowTexture = createContactShadowTexture();

  // Materials
  const sidingMaterial = new THREE.MeshStandardMaterial({
    map: sidingTexture,
    roughness: 0.75,
    metalness: 0.05,
  });

  const foundationMaterial = new THREE.MeshStandardMaterial({
    color: '#64748b', // Concrete gray
    roughness: 0.9,
    metalness: 0.1,
  });

  const trimMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff', // Clean white architectural trim
    roughness: 0.4,
    metalness: 0.1,
  });

  const shingleMaterial = new THREE.MeshStandardMaterial({
    map: shingleTexture,
    roughness: 0.85,
    metalness: 0.1,
  });

  const gutterMaterial = new THREE.MeshStandardMaterial({
    color: '#cbd5e1', // Aluminum gutter
    roughness: 0.35,
    metalness: 0.6,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#1e293b',
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.3,
    transparent: true,
    opacity: 0.75,
  });

  const chimneyBrickMaterial = new THREE.MeshStandardMaterial({
    color: '#991b1b', // Brick red
    roughness: 0.85,
    metalness: 0.05,
  });

  const solarPanelMaterial = new THREE.MeshStandardMaterial({
    map: solarTexture,
    roughness: 0.25,
    metalness: 0.65,
  });

  const rackingRailMaterial = new THREE.MeshStandardMaterial({
    color: '#334155', // Slate/black anodized racking rail
    roughness: 0.4,
    metalness: 0.7,
  });

  // 2. Ground & Lawn Landscaping (Flush with y=0)
  const lawnGeo = new THREE.CylinderGeometry(16, 16.5, 0.25, 48);
  const lawnMat = new THREE.MeshStandardMaterial({
    color: '#3f6212', // Lush lawn green
    roughness: 0.85,
    metalness: 0.02,
  });
  const lawn = new THREE.Mesh(lawnGeo, lawnMat);
  lawn.position.y = -0.125;
  lawn.receiveShadow = true;
  rootGroup.add(lawn);

  // Soft contact shadow directly under house
  const shadowGeo = new THREE.PlaneGeometry(15, 13);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.65,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.01;
  rootGroup.add(contactShadow);

  // Front Walkway (Paved stone path)
  const walkwayGeo = new THREE.BoxGeometry(1.8, 0.04, 5.5);
  const walkwayMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    roughness: 0.9,
    metalness: 0.05,
  });
  const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
  walkway.position.set(0, 0.02, 5.2);
  walkway.receiveShadow = true;
  rootGroup.add(walkway);

  // Driveway on East side (+X)
  const drivewayGeo = new THREE.BoxGeometry(4.2, 0.04, 7.5);
  const drivewayMat = new THREE.MeshStandardMaterial({
    color: '#475569',
    roughness: 0.85,
    metalness: 0.05,
  });
  const driveway = new THREE.Mesh(drivewayGeo, drivewayMat);
  driveway.position.set(6.2, 0.02, 3.8);
  driveway.receiveShadow = true;
  rootGroup.add(driveway);

  // 3. Concrete Foundation (Base)
  // House dimensions: Width (X) = 8.5m, Depth (Z) = 6.8m, Height to eave = 4.8m
  const houseW = 8.5;
  const houseD = 6.8;
  const foundationH = 0.4;
  const houseH = 4.8;

  const foundationGeo = new THREE.BoxGeometry(houseW + 0.2, foundationH, houseD + 0.2);
  const foundation = new THREE.Mesh(foundationGeo, foundationMaterial);
  foundation.position.set(0, foundationH / 2, 0);
  foundation.castShadow = true;
  foundation.receiveShadow = true;
  rootGroup.add(foundation);

  // 4. Main House Body (Exterior siding walls)
  const bodyGeo = new THREE.BoxGeometry(houseW, houseH, houseD);
  const houseBody = new THREE.Mesh(bodyGeo, sidingMaterial);
  houseBody.position.set(0, foundationH + houseH / 2, 0);
  houseBody.castShadow = true;
  houseBody.receiveShadow = true;
  rootGroup.add(houseBody);

  // Trim corners & floor beltline
  const beltlineGeo = new THREE.BoxGeometry(houseW + 0.1, 0.16, houseD + 0.1);
  const beltline = new THREE.Mesh(beltlineGeo, trimMaterial);
  beltline.position.set(0, foundationH + houseH * 0.52, 0);
  rootGroup.add(beltline);

  // 5. Front Porch & Doorway (Facing +Z = South)
  const porchGroup = new THREE.Group();
  const porchFloorGeo = new THREE.BoxGeometry(2.4, 0.3, 1.4);
  const porchFloor = new THREE.Mesh(porchFloorGeo, foundationMaterial);
  porchFloor.position.set(0, 0.15, houseD / 2 + 0.7);
  porchFloor.castShadow = true;
  porchFloor.receiveShadow = true;
  porchGroup.add(porchFloor);

  // Porch roof awning
  const porchRoofGeo = new THREE.BoxGeometry(2.6, 0.18, 1.6);
  const porchRoof = new THREE.Mesh(porchRoofGeo, shingleMaterial);
  porchRoof.position.set(0, 3.2, houseD / 2 + 0.8);
  porchRoof.rotation.x = 0.15;
  porchRoof.castShadow = true;
  porchGroup.add(porchRoof);

  // Porch posts
  const postGeo = new THREE.BoxGeometry(0.12, 3.0, 0.12);
  [-1.05, 1.05].forEach((xPos) => {
    const post = new THREE.Mesh(postGeo, trimMaterial);
    post.position.set(xPos, 1.65, houseD / 2 + 1.35);
    post.castShadow = true;
    porchGroup.add(post);
  });

  // Front Door
  const doorGeo = new THREE.BoxGeometry(1.0, 2.2, 0.08);
  const doorMat = new THREE.MeshStandardMaterial({
    color: '#0f172a', // Premium deep navy front door
    roughness: 0.3,
    metalness: 0.2,
  });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, foundationH + 1.1, houseD / 2 + 0.05);
  porchGroup.add(door);

  // Door handle
  const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.12, 12);
  const handleMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', metalness: 0.9, roughness: 0.2 });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(0.38, foundationH + 1.1, houseD / 2 + 0.12);
  porchGroup.add(handle);
  rootGroup.add(porchGroup);

  // 6. Windows (with frames, sills, and reflective glass)
  const windowGroup = new THREE.Group();
  function addWindow(x: number, y: number, z: number, rotY: number = 0) {
    const singleWin = new THREE.Group();
    // Glass
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.4), glassMaterial);
    glass.position.set(0, 0, 0.02);
    singleWin.add(glass);
    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.24, 1.54, 0.08), trimMaterial);
    singleWin.add(frame);
    // Sill
    const sill = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.08, 0.16), trimMaterial);
    sill.position.set(0, -0.76, 0.05);
    singleWin.add(sill);

    singleWin.position.set(x, y, z);
    singleWin.rotation.y = rotY;
    windowGroup.add(singleWin);
  }

  // Front windows (+Z)
  addWindow(-2.6, foundationH + 1.3, houseD / 2 + 0.02); // 1st floor left
  addWindow(2.6, foundationH + 1.3, houseD / 2 + 0.02); // 1st floor right
  addWindow(-2.6, foundationH + 3.6, houseD / 2 + 0.02); // 2nd floor left
  addWindow(0, foundationH + 3.6, houseD / 2 + 0.02); // 2nd floor center
  addWindow(2.6, foundationH + 3.6, houseD / 2 + 0.02); // 2nd floor right

  // Side windows (East and West)
  addWindow(houseW / 2 + 0.02, foundationH + 3.0, 0, Math.PI / 2);
  addWindow(-houseW / 2 - 0.02, foundationH + 3.0, 0, -Math.PI / 2);
  rootGroup.add(windowGroup);

  // 7. Utility Solar Inverter on West wall (-X)
  const utilityGroup = new THREE.Group();
  const inverterGeo = new THREE.BoxGeometry(0.35, 0.65, 0.45);
  const inverterMat = new THREE.MeshStandardMaterial({
    color: '#e2e8f0', // Clean energy solar inverter (SolarEdge/Enphase style)
    roughness: 0.35,
    metalness: 0.4,
  });
  const inverter = new THREE.Mesh(inverterGeo, inverterMat);
  inverter.position.set(-houseW / 2 - 0.2, foundationH + 1.8, -1.2);
  inverter.castShadow = true;
  utilityGroup.add(inverter);

  // Inverter status LED display (static, non-pulsing)
  const screenGeo = new THREE.PlaneGeometry(0.15, 0.08);
  const screenMat = new THREE.MeshBasicMaterial({ color: '#0284c7' });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.rotation.y = -Math.PI / 2;
  screen.position.set(-houseW / 2 - 0.38, foundationH + 1.9, -1.2);
  utilityGroup.add(screen);

  // Conduit pipe running to roof
  const conduitGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.2, 12);
  const conduitMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.8, roughness: 0.3 });
  const conduit = new THREE.Mesh(conduitGeo, conduitMat);
  conduit.position.set(-houseW / 2 - 0.06, foundationH + 3.4, -1.2);
  utilityGroup.add(conduit);
  rootGroup.add(utilityGroup);

  // 8. Landscaping: Procedural Trees and Foundation Hedges
  const foliageGroup = new THREE.Group();
  function createTree(x: number, z: number, scale: number = 1.0) {
    const tree = new THREE.Group();
    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.18 * scale, 0.28 * scale, 1.8 * scale, 10);
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.9, metalness: 0.05 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = (1.8 * scale) / 2;
    trunk.castShadow = true;
    tree.add(trunk);

    // Foliage layers (tapered cones/spheres)
    const foliageMat = new THREE.MeshStandardMaterial({
      color: '#166534',
      roughness: 0.8,
      metalness: 0.05,
    });
    const layer1 = new THREE.Mesh(new THREE.ConeGeometry(1.6 * scale, 1.8 * scale, 8), foliageMat);
    layer1.position.y = 1.6 * scale;
    layer1.castShadow = true;
    tree.add(layer1);

    const layer2 = new THREE.Mesh(new THREE.ConeGeometry(1.3 * scale, 1.6 * scale, 8), foliageMat);
    layer2.position.y = 2.4 * scale;
    layer2.castShadow = true;
    tree.add(layer2);

    const layer3 = new THREE.Mesh(new THREE.ConeGeometry(0.9 * scale, 1.3 * scale, 8), foliageMat);
    layer3.position.y = 3.2 * scale;
    layer3.castShadow = true;
    tree.add(layer3);

    tree.position.set(x, 0, z);
    return tree;
  }

  // Trees positioned far enough to not completely occlude roof sun
  foliageGroup.add(createTree(-6.4, 4.0, 1.1));
  foliageGroup.add(createTree(-6.8, -3.2, 0.95));

  // Low foundation boxwood hedges
  const hedgeGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const hedgeMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.85 });
  [-3.6, -3.0, -2.4, 2.4, 3.0, 3.6].forEach((hx) => {
    const hedge = new THREE.Mesh(hedgeGeo, hedgeMat);
    hedge.position.set(hx, 0.3, houseD / 2 + 0.4);
    hedge.castShadow = true;
    foliageGroup.add(hedge);
  });
  rootGroup.add(foliageGroup);

  // 9. Roof & Solar Panels Dynamic Groups
  const roofGroup = new THREE.Group();
  roofGroup.name = 'RoofStructure';
  rootGroup.add(roofGroup);

  const panelsGroup = new THREE.Group();
  panelsGroup.name = 'SolarPanelsArray';
  rootGroup.add(panelsGroup);

  const eaveY = foundationH + houseH; // top of walls = 5.2m

  // Brick Chimney
  const chimney = new THREE.Group();
  const chimneyStack = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 0.8), chimneyBrickMaterial);
  chimneyStack.position.set(2.8, eaveY + 1.2, -1.2);
  chimneyStack.castShadow = true;
  chimney.add(chimneyStack);

  const fluePot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.4, 12), foundationMaterial);
  fluePot.position.set(2.8, eaveY + 2.7, -1.2);
  chimney.add(fluePot);
  roofGroup.add(chimney);

  /**
   * Builds the roof geometry dynamically depending on gabled or hip and tilt angle
   */
  function updateRoof(roofType: RoofType, tiltDeg: number) {
    // Clear previous roof meshes except chimney
    while (roofGroup.children.length > 1) {
      const child = roofGroup.children[roofGroup.children.length - 1];
      if (child !== chimney) {
        roofGroup.remove(child);
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      } else {
        break;
      }
    }

    const rad = (tiltDeg * Math.PI) / 180;
    const halfDepth = houseD / 2;
    const overhang = 0.45;
    const roofRidgeH = Math.tan(rad) * (halfDepth + overhang);
    const ridgeY = eaveY + roofRidgeH;

    // Slope length along roof pitch
    const slopeLen = (halfDepth + overhang) / Math.cos(rad);
    const roofWidth = houseW + overhang * 2;

    if (roofType === 'gabled') {
      // Gabled Roof: Front slope (facing South / +Z), Rear slope (facing North / -Z)
      // Front Slope
      const frontSlopeGeo = new THREE.BoxGeometry(roofWidth, 0.16, slopeLen);
      const frontSlope = new THREE.Mesh(frontSlopeGeo, shingleMaterial);
      frontSlope.position.set(0, eaveY + roofRidgeH / 2, (halfDepth + overhang) / 2);
      frontSlope.rotation.x = rad;
      frontSlope.castShadow = true;
      frontSlope.receiveShadow = true;
      roofGroup.add(frontSlope);

      // Rear Slope
      const rearSlopeGeo = new THREE.BoxGeometry(roofWidth, 0.16, slopeLen);
      const rearSlope = new THREE.Mesh(rearSlopeGeo, shingleMaterial);
      rearSlope.position.set(0, eaveY + roofRidgeH / 2, -(halfDepth + overhang) / 2);
      rearSlope.rotation.x = -rad;
      rearSlope.castShadow = true;
      rearSlope.receiveShadow = true;
      roofGroup.add(rearSlope);

      // Ridge Cap
      const ridgeGeo = new THREE.BoxGeometry(roofWidth + 0.05, 0.1, 0.35);
      const ridge = new THREE.Mesh(ridgeGeo, shingleMaterial);
      ridge.position.set(0, ridgeY + 0.05, 0);
      roofGroup.add(ridge);

      // Gable End Triangular Walls (East and West)
      const gableShape = new THREE.Shape();
      gableShape.moveTo(-halfDepth, 0);
      gableShape.lineTo(0, roofRidgeH);
      gableShape.lineTo(halfDepth, 0);
      gableShape.closePath();

      const gableGeo = new THREE.ShapeGeometry(gableShape);

      // East Gable (+X)
      const eastGable = new THREE.Mesh(gableGeo, sidingMaterial);
      eastGable.position.set(houseW / 2, eaveY, 0);
      eastGable.rotation.y = Math.PI / 2;
      eastGable.castShadow = true;
      roofGroup.add(eastGable);

      // West Gable (-X)
      const westGable = new THREE.Mesh(gableGeo, sidingMaterial);
      westGable.position.set(-houseW / 2, eaveY, 0);
      westGable.rotation.y = -Math.PI / 2;
      westGable.castShadow = true;
      roofGroup.add(westGable);

      // Gutters along front and rear eaves
      const gutterGeo = new THREE.BoxGeometry(roofWidth, 0.15, 0.12);
      const frontGutter = new THREE.Mesh(gutterGeo, gutterMaterial);
      frontGutter.position.set(0, eaveY - 0.05, halfDepth + overhang);
      roofGroup.add(frontGutter);

      const rearGutter = new THREE.Mesh(gutterGeo, gutterMaterial);
      rearGutter.position.set(0, eaveY - 0.05, -(halfDepth + overhang));
      roofGroup.add(rearGutter);
    } else {
      // Hip Roof: 4 sloping planes meeting at a shortened central ridge
      const hipRidgeLen = Math.max(1.8, houseW - houseD * 0.85);

      // Front Hip Slope (South facing)
      const frontHipGeo = new THREE.BoxGeometry(roofWidth * 0.95, 0.16, slopeLen);
      const frontHip = new THREE.Mesh(frontHipGeo, shingleMaterial);
      frontHip.position.set(0, eaveY + roofRidgeH / 2, (halfDepth + overhang) / 2);
      frontHip.rotation.x = rad;
      frontHip.castShadow = true;
      frontHip.receiveShadow = true;
      roofGroup.add(frontHip);

      // Rear Hip Slope (North facing)
      const rearHipGeo = new THREE.BoxGeometry(roofWidth * 0.95, 0.16, slopeLen);
      const rearHip = new THREE.Mesh(rearHipGeo, shingleMaterial);
      rearHip.position.set(0, eaveY + roofRidgeH / 2, -(halfDepth + overhang) / 2);
      rearHip.rotation.x = -rad;
      rearHip.castShadow = true;
      rearHip.receiveShadow = true;
      roofGroup.add(rearHip);

      // Side Hip Slopes (East and West)
      const sideSlopeLen = (houseW / 2 + overhang) / Math.cos(rad);
      const eastHipGeo = new THREE.BoxGeometry(houseD + overhang * 2, 0.16, sideSlopeLen * 0.65);
      const eastHip = new THREE.Mesh(eastHipGeo, shingleMaterial);
      eastHip.position.set((houseW + overhang) / 2 - 0.2, eaveY + roofRidgeH / 2, 0);
      eastHip.rotation.z = -rad;
      eastHip.rotation.y = Math.PI / 2;
      eastHip.castShadow = true;
      roofGroup.add(eastHip);

      const westHip = new THREE.Mesh(eastHipGeo, shingleMaterial);
      westHip.position.set(-(houseW + overhang) / 2 + 0.2, eaveY + roofRidgeH / 2, 0);
      westHip.rotation.z = rad;
      westHip.rotation.y = Math.PI / 2;
      westHip.castShadow = true;
      roofGroup.add(westHip);

      // Ridge Cap
      const ridgeGeo = new THREE.BoxGeometry(hipRidgeLen, 0.12, 0.35);
      const ridge = new THREE.Mesh(ridgeGeo, shingleMaterial);
      ridge.position.set(0, ridgeY + 0.05, 0);
      roofGroup.add(ridge);

      // Perimeter gutters all around
      const frontGutter = new THREE.Mesh(new THREE.BoxGeometry(roofWidth, 0.15, 0.12), gutterMaterial);
      frontGutter.position.set(0, eaveY - 0.05, halfDepth + overhang);
      roofGroup.add(frontGutter);

      const rearGutter = new THREE.Mesh(new THREE.BoxGeometry(roofWidth, 0.15, 0.12), gutterMaterial);
      rearGutter.position.set(0, eaveY - 0.05, -(halfDepth + overhang));
      roofGroup.add(rearGutter);
    }
  }

  /**
   * Places the solar panels neatly on the South-facing roof facet
   * with mounting rails underneath
   */
  function updatePanels(panelCount: number, tiltDeg: number, roofType: RoofType) {
    // Clear existing panel meshes
    while (panelsGroup.children.length > 0) {
      const child = panelsGroup.children[0];
      panelsGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    }

    const rad = (tiltDeg * Math.PI) / 180;
    const halfDepth = houseD / 2;
    const overhang = 0.45;
    const roofRidgeH = Math.tan(rad) * (halfDepth + overhang);

    // Standard residential panel physical size: 1.72m high x 1.02m wide x 0.04m thick
    const pW = 0.96;
    const pH = 1.62;
    const pThick = 0.04;
    const gap = 0.06;

    // Determine grid columns and rows based on panel count
    let cols = 6;
    let rows = Math.ceil(panelCount / cols);
    if (roofType === 'hip' && cols > 5) {
      cols = 5;
      rows = Math.ceil(panelCount / cols);
    }

    const panelGeo = new THREE.BoxGeometry(pW, pThick, pH);
    const railGeo = new THREE.BoxGeometry(cols * (pW + gap) + 0.4, 0.04, 0.06);

    // Rails along the roof facet
    const railsPerArray = Math.min(rows + 1, 4);
    for (let r = 0; r < railsPerArray; r++) {
      const rail = new THREE.Mesh(railGeo, rackingRailMaterial);
      const frac = (r + 0.5) / railsPerArray;
      // Position along slope
      const distFromEave = 0.8 + frac * (halfDepth * 0.9);
      const y = eaveY + distFromEave * Math.tan(rad) + 0.06;
      const z = (halfDepth + overhang) - distFromEave;
      rail.position.set(0, y, z);
      rail.rotation.x = rad;
      panelsGroup.add(rail);
    }

    // Place individual solar panels
    let placed = 0;
    const totalRowWidth = (cols - 1) * (pW + gap);

    for (let r = 0; r < rows; r++) {
      // In hip roofs, taper top rows to avoid roof hips
      const rowCols = roofType === 'hip' && r === rows - 1 && rows > 2 ? Math.min(cols, 3) : cols;
      const curRowWidth = (rowCols - 1) * (pW + gap);

      for (let c = 0; c < rowCols; c++) {
        if (placed >= panelCount) break;

        const panel = new THREE.Mesh(panelGeo, solarPanelMaterial);
        panel.name = `SolarPanel_${placed + 1}`;
        panel.castShadow = true;
        panel.receiveShadow = true;

        const posX = -curRowWidth / 2 + c * (pW + gap);
        // Position along the slope
        const distFromEave = 0.75 + r * (pH + gap) * 0.95;
        const posY = eaveY + distFromEave * Math.tan(rad) + 0.12;
        const posZ = (halfDepth + overhang) - distFromEave;

        panel.position.set(posX, posY, posZ);
        panel.rotation.x = rad;

        // Add to panel group
        panelsGroup.add(panel);
        placed++;
      }
    }
  }

  // Initial build
  updateRoof(initialRoofType, initialTilt);
  updatePanels(initialPanelCount, initialTilt, initialRoofType);

  return {
    rootGroup,
    roofGroup,
    panelsGroup,
    houseBody,
    updatePanels,
    updateRoof,
    dispose: () => {
      solarTexture.dispose();
      shingleTexture.dispose();
      sidingTexture.dispose();
      shadowTexture.dispose();
      sidingMaterial.dispose();
      foundationMaterial.dispose();
      trimMaterial.dispose();
      shingleMaterial.dispose();
      gutterMaterial.dispose();
      glassMaterial.dispose();
      chimneyBrickMaterial.dispose();
      solarPanelMaterial.dispose();
      rackingRailMaterial.dispose();
    },
  };
}
