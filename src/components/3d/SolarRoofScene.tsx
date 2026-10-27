import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SolarLayoutConfig } from '../../types/solar';
import { calculateSunPosition } from '../../utils/solarCalculations';
import { buildProceduralHome, HouseModelComponents } from './ProceduralHomeModel';

interface SolarRoofSceneProps {
  config: SolarLayoutConfig;
  cameraPreset?: 'perspective' | 'topDown' | 'front' | 'sunset';
  onHoverPanel?: (panelName: string | null) => void;
}

export function SolarRoofScene({
  config,
  cameraPreset = 'perspective',
  onHoverPanel,
}: SolarRoofSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const houseModelRef = useRef<HouseModelComponents | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Target camera position for smooth transitions
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(14, 11, 16));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 4.0, 0));

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Atmospheric Fog matching sky
    const skyColor = new THREE.Color('#0f172a');
    scene.background = skyColor;
    scene.fog = new THREE.FogExp2('#0f172a', 0.012);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 120);
    camera.position.set(14, 11, 16);
    cameraRef.current = camera;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't allow camera under ground
    controls.minDistance = 6;
    controls.maxDistance = 45;
    controls.target.set(0, 4.0, 0);
    controlsRef.current = controls;

    // 5. Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Lighting Rig
    // Hemisphere fill (cool blue sky vs warm ground reflection)
    const hemiLight = new THREE.HemisphereLight('#bfdbfe', '#1e293b', 0.85);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Key Directional Light ("The Sun")
    const sunLight = new THREE.DirectionalLight('#fffbf0', 2.4);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 70;
    const shadowD = 15;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Visual Sun Orb representation in the sky
    const sunOrbGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const sunOrbMat = new THREE.MeshBasicMaterial({ color: '#fbbf24' });
    const sunMesh = new THREE.Mesh(sunOrbGeo, sunOrbMat);
    scene.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // Solar path trajectory arc ring (faint orbital guide)
    const sunPathPoints: THREE.Vector3[] = [];
    for (let t = 6; t <= 18; t += 0.25) {
      const pos = calculateSunPosition(t, config.season).position;
      sunPathPoints.push(new THREE.Vector3(pos.x, pos.y, pos.z));
    }
    const sunPathGeo = new THREE.BufferGeometry().setFromPoints(sunPathPoints);
    const sunPathMat = new THREE.LineBasicMaterial({
      color: '#f59e0b',
      transparent: true,
      opacity: 0.35,
    });
    const sunPathLine = new THREE.Line(sunPathGeo, sunPathMat);
    scene.add(sunPathLine);

    // 7. Procedural House & Solar Array Model
    const house = buildProceduralHome(
      renderer,
      config.roofType,
      config.panelCount,
      config.tiltAngle
    );
    scene.add(house.rootGroup);
    houseModelRef.current = house;

    // 8. Raycasting for Panel Hover Inspection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(house.panelsGroup.children);
      if (intersects.length > 0) {
        onHoverPanel?.(intersects[0].object.name || 'Solar Panel');
      } else {
        onHoverPanel?.(null);
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 10. Software-WebGL Paced Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          animId = window.setTimeout(cb, 80);
        }
      };
      animId = window.setTimeout(poll, 5);
    }

    const renderLoop = () => {
      const delta = clock.getDelta();

      // Smooth camera transition toward target preset
      if (cameraRef.current && targetCamPosRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 1 - Math.exp(-4 * delta));
        controls.target.lerp(targetLookAtRef.current, 1 - Math.exp(-4 * delta));
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(renderLoop);
      } else {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();
    setIsLoaded(true);

    // Cleanup
    return () => {
      if (isSoftwareGl) {
        clearTimeout(animId);
      } else {
        cancelAnimationFrame(animId);
      }
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      house.dispose();
      sunPathGeo.dispose();
      sunPathMat.dispose();
      sunOrbGeo.dispose();
      sunOrbMat.dispose();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Dynamic Sun Position & Lighting when config changes
  useEffect(() => {
    if (!sunLightRef.current || !sunMeshRef.current || !sceneRef.current) return;

    const sunInfo = calculateSunPosition(config.timeOfDay, config.season);
    sunLightRef.current.position.set(
      sunInfo.position.x,
      sunInfo.position.y,
      sunInfo.position.z
    );
    sunLightRef.current.color.set(sunInfo.lightColor);
    sunLightRef.current.intensity = sunInfo.lightIntensity;

    sunMeshRef.current.position.set(
      sunInfo.position.x * 0.95,
      sunInfo.position.y * 0.95,
      sunInfo.position.z * 0.95
    );
    (sunMeshRef.current.material as THREE.MeshBasicMaterial).color.set(sunInfo.lightColor);

    // Dynamic Sky backdrop color based on elevation
    if (sceneRef.current) {
      if (sunInfo.elevationDeg < 10) {
        // Sunset / dusk
        sceneRef.current.background = new THREE.Color('#1e1b4b'); // deep indigo-dusk
        if (sceneRef.current.fog) (sceneRef.current.fog as THREE.FogExp2).color.set('#1e1b4b');
      } else if (sunInfo.elevationDeg < 25) {
        // Golden hour
        sceneRef.current.background = new THREE.Color('#1e293b');
        if (sceneRef.current.fog) (sceneRef.current.fog as THREE.FogExp2).color.set('#1e293b');
      } else {
        // Daytime sky
        sceneRef.current.background = new THREE.Color('#0f172a');
        if (sceneRef.current.fog) (sceneRef.current.fog as THREE.FogExp2).color.set('#0f172a');
      }
    }
  }, [config.timeOfDay, config.season]);

  // Update House Orientation (Azimuth)
  useEffect(() => {
    if (houseModelRef.current) {
      const azRad = ((config.azimuth - 180) * Math.PI) / 180;
      houseModelRef.current.rootGroup.rotation.y = azRad;
    }
  }, [config.azimuth]);

  // Update Roof Geometry when roofType or tiltAngle changes
  useEffect(() => {
    if (houseModelRef.current) {
      houseModelRef.current.updateRoof(config.roofType, config.tiltAngle);
      houseModelRef.current.updatePanels(config.panelCount, config.tiltAngle, config.roofType);
    }
  }, [config.roofType, config.tiltAngle]);

  // Update Solar Panel count when panelCount changes
  useEffect(() => {
    if (houseModelRef.current) {
      houseModelRef.current.updatePanels(config.panelCount, config.tiltAngle, config.roofType);
    }
  }, [config.panelCount]);

  // Camera Presets
  useEffect(() => {
    switch (cameraPreset) {
      case 'topDown':
        targetCamPosRef.current.set(0, 22, 0.1);
        targetLookAtRef.current.set(0, 4.5, 0);
        break;
      case 'front':
        targetCamPosRef.current.set(0, 6, 21);
        targetLookAtRef.current.set(0, 4.0, 0);
        break;
      case 'sunset':
        targetCamPosRef.current.set(-18, 7, 12);
        targetLookAtRef.current.set(0, 4.0, 0);
        break;
      case 'perspective':
      default:
        targetCamPosRef.current.set(14, 11, 16);
        targetLookAtRef.current.set(0, 4.0, 0);
        break;
    }
  }, [cameraPreset]);

  return (
    <div className="relative w-full h-full min-h-[500px] select-none bg-slate-950 overflow-hidden">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
          Initializing 3D Solar Model...
        </div>
      )}
    </div>
  );
}
