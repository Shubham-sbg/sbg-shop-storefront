"use client";

/**
 * JerseyViewer3D.tsx
 * Full-screen modal 360° jersey viewer — SBG SHOP
 *
 * Real 3D garment inspection:
 *  - Volumetric 3D garment mesh: curved front and back shells with 3D physical depth,
 *    subtle fabric draping, and authentic front/back high-resolution SBG PNG textures
 *    (clean alpha cutouts without opaque bounding boxes)
 *  - Contoured showroom hanger inside the neckline and shoulders
 *  - 360° horizontal and vertical orbit via mouse drag / touch swipe
 *  - Smooth Front View and Back View alignment transitions
 *  - Gentle Auto-Rotate toggle
 *  - Zoom in/out via wheel, pinch, or on-screen controls
 *  - Product specifications, size selector (S–XXXL + Free Size), and Add to Bag
 */

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import styles from "./JerseyViewer3D.module.css";

export interface JerseyProduct {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  price: number;
  tag: string;
  frontImage: string;
  backImage: string;
  features: string[];
}

interface Props {
  product: JerseyProduct;
  onClose: () => void;
  onAddToCart: (size: string) => void;
}

const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"] as const;

// ─── Garment & Hanger Geometry Builders ──────────────────────────────────────

// Helper to generate authentic procedural flank textures matching SBG team colors
function createFlankTexture(isWhite: boolean): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background base
  ctx.fillStyle = isWhite ? "#2a125a" : "#13151a";
  ctx.fillRect(0, 0, 128, 512);

  // Royal purple athletic flank block
  ctx.fillStyle = "#3d1a78";
  ctx.fillRect(16, 0, 96, 512);

  // SBG Gold racing accent pinstripe down the center
  ctx.fillStyle = "#d4a017";
  ctx.fillRect(58, 0, 12, 512);

  // Outer shadow gradients
  const gradL = ctx.createLinearGradient(0, 0, 24, 0);
  gradL.addColorStop(0, "rgba(0,0,0,0.65)");
  gradL.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradL;
  ctx.fillRect(0, 0, 24, 512);

  const gradR = ctx.createLinearGradient(128, 0, 104, 0);
  gradR.addColorStop(0, "rgba(0,0,0,0.65)");
  gradR.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradR;
  ctx.fillRect(104, 0, 24, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function buildVolumetricJersey(isWhite = true): THREE.Group {
  const jersey = new THREE.Group();
  jersey.name = "jerseyMesh";

  const W = 1.22;
  const H = 1.42;
  const SEGS_X = 24;
  const SEGS_Y = 24;
  const DEPTH_HALF = 0.042; // ~8.4cm physical garment depth

  // 1. Front curved shell (drapes slightly forward)
  const frontGeo = new THREE.PlaneGeometry(W, H, SEGS_X, SEGS_Y);
  const fPos = frontGeo.attributes.position;
  for (let i = 0; i < fPos.count; i++) {
    const x = fPos.getX(i);
    const y = fPos.getY(i);
    const nx = x / (W / 2);
    const ny = y / (H / 2);
    const drape = Math.cos(nx * Math.PI * 0.45) * Math.max(0, 1 - Math.abs(ny - 0.15) * 0.7);
    fPos.setZ(i, drape * 0.035);
  }
  frontGeo.computeVertexNormals();

  const placeholderMat = new THREE.MeshStandardMaterial({
    color: isWhite ? 0xf2f5f9 : 0x16181e,
    roughness: 0.52,
    metalness: 0.02,
    side: THREE.FrontSide, // FrontSide only: avoids double-sided conflict & reversed logo
    transparent: true,
    alphaTest: 0.06,
    depthWrite: true,
  });

  const frontMesh = new THREE.Mesh(frontGeo, placeholderMat);
  frontMesh.name = "frontMesh";
  frontMesh.position.set(0, 0, DEPTH_HALF);
  frontMesh.castShadow = true;
  frontMesh.receiveShadow = true;
  jersey.add(frontMesh);

  // 2. Back curved shell (faces -Z direction)
  const backGeo = new THREE.PlaneGeometry(W, H, SEGS_X, SEGS_Y);
  const bPos = backGeo.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    const x = bPos.getX(i);
    const y = bPos.getY(i);
    const nx = x / (W / 2);
    const ny = y / (H / 2);
    const drape = Math.cos(nx * Math.PI * 0.45) * Math.max(0, 1 - Math.abs(ny - 0.15) * 0.7);
    bPos.setZ(i, drape * 0.035);
  }
  backGeo.computeVertexNormals();

  const backMesh = new THREE.Mesh(backGeo, placeholderMat.clone());
  backMesh.name = "backMesh";
  backMesh.rotation.y = Math.PI; // flip to face backwards
  backMesh.position.set(0, 0, -DEPTH_HALF);
  backMesh.castShadow = true;
  backMesh.receiveShadow = true;
  jersey.add(backMesh);

  // 3. Left and Right 3D Athletic Flank Panels (bridge the side gap)
  const flankTex = createFlankTexture(isWhite);
  const flankMat = new THREE.MeshStandardMaterial({
    color: flankTex ? 0xffffff : 0x3d1a78,
    map: flankTex || undefined,
    roughness: 0.55,
    metalness: 0.08,
    side: THREE.DoubleSide,
  });

  [-1, 1].forEach((side) => {
    // Torso side flank
    const flankGeo = new THREE.PlaneGeometry(DEPTH_HALF * 2, 0.78, 6, 16);
    flankGeo.rotateY((side * Math.PI) / 2);
    const pos = flankGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const ny = y / 0.39;
      // Athletic ergonomic waist taper
      const waistIn = Math.cos(ny * Math.PI * 0.5) * 0.02;
      pos.setX(i, pos.getX(i) - side * waistIn);
    }
    flankGeo.computeVertexNormals();

    const flankMesh = new THREE.Mesh(flankGeo, flankMat);
    flankMesh.name = side < 0 ? "leftFlank" : "rightFlank";
    flankMesh.position.set(side * 0.385, -0.22, 0);
    flankMesh.castShadow = true;
    flankMesh.receiveShadow = true;
    jersey.add(flankMesh);

    // Sleeve Cuff Caps (side athletic rings)
    const sleeveGeo = new THREE.CylinderGeometry(0.046, 0.052, 0.22, 12, 4, true);
    sleeveGeo.rotateZ(side * Math.PI * 0.38);
    const sleeveMat = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xedeef2 : 0x1a1c22,
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
    sleeveMesh.position.set(side * 0.46, 0.22, 0);
    sleeveMesh.castShadow = true;
    jersey.add(sleeveMesh);

    // Top Shoulder Seam Bridges
    const shoulderGeo = new THREE.PlaneGeometry(0.24, DEPTH_HALF * 2, 6, 2);
    shoulderGeo.rotateX(Math.PI / 2);
    shoulderGeo.rotateZ(side * -Math.PI * 0.12);
    const shoulderMat = new THREE.MeshStandardMaterial({
      color: 0x3a1975, // Royal Purple shoulder panel matching SBG artwork
      roughness: 0.5,
      metalness: 0.06,
      side: THREE.DoubleSide,
    });
    const shoulderMesh = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulderMesh.position.set(side * 0.26, 0.52, 0);
    jersey.add(shoulderMesh);
  });

  // 4. 3D Ribbed V-Neck Collar
  const collarGeo = new THREE.TorusGeometry(0.14, 0.018, 8, 24);
  collarGeo.rotateX(Math.PI * 0.25);
  const collarMat = new THREE.MeshStandardMaterial({
    color: 0x22242c,
    roughness: 0.45,
    metalness: 0.1,
  });
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.position.set(0, 0.48, 0);
  collarMesh.castShadow = true;
  jersey.add(collarMesh);

  // 5. Dark Interior Cavity Liner (ensures realistic depth through neck/arm openings)
  const innerGeo = new THREE.CylinderGeometry(0.32, 0.30, 0.95, 16, 4, true);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x121418,
    side: THREE.BackSide,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  innerMesh.position.set(0, -0.08, 0);
  jersey.add(innerMesh);

  return jersey;
}

function buildViewerHanger(woodColor = 0x22242c): THREE.Group {
  const group = new THREE.Group();
  group.name = "hanger";

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xd0d8e2,
    metalness: 0.9,
    roughness: 0.16,
  });

  const shoulderMat = new THREE.MeshStandardMaterial({
    color: woodColor,
    metalness: 0.15,
    roughness: 0.45,
  });

  // Polished hook
  const hookGeo = new THREE.TorusGeometry(0.040, 0.007, 10, 24, Math.PI * 1.25);
  const hook = new THREE.Mesh(hookGeo, metalMat);
  hook.position.set(0, 0.18, 0);
  hook.rotation.z = -Math.PI * 0.1;
  group.add(hook);

  // Stem
  const stemGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.11, 8);
  const stem = new THREE.Mesh(stemGeo, metalMat);
  stem.position.set(0, 0.08, 0);
  group.add(stem);

  // Center block
  const blockGeo = new THREE.BoxGeometry(0.05, 0.04, 0.035);
  const block = new THREE.Mesh(blockGeo, shoulderMat);
  block.position.set(0, 0.02, 0);
  group.add(block);

  // Left contoured arm (slopes down to the left)
  const armLGeo = new THREE.CylinderGeometry(0.014, 0.010, 0.52, 10);
  const armL = new THREE.Mesh(armLGeo, shoulderMat);
  armL.rotation.z = Math.PI * 0.42;
  armL.position.set(-0.24, -0.06, 0);
  group.add(armL);

  // Right contoured arm (slopes down to the right)
  const armRGeo = new THREE.CylinderGeometry(0.010, 0.014, 0.52, 10);
  const armR = new THREE.Mesh(armRGeo, shoulderMat);
  armR.rotation.z = -Math.PI * 0.42;
  armR.position.set(0.24, -0.06, 0);
  group.add(armR);

  // Crossbar
  const barGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.48, 8);
  const bar = new THREE.Mesh(barGeo, metalMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, -0.13, 0);
  group.add(bar);

  return group;
}

// ─── Main Viewer Component ───────────────────────────────────────────────────

export default function JerseyViewer3D({ product, onClose, onAddToCart }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [autoRotate, setAutoRotate] = useState(false);
  const [viewFace, setViewFace] = useState<"front" | "back" | null>("front");

  const refs = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    modelGroup: THREE.Group | null;
    theta: number;
    phi: number;
    radius: number;
    targetTheta: number | null;
    isDragging: boolean;
    lastX: number;
    lastY: number;
    lastPinchDist: number | null;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    modelGroup: null,
    theta: 0,
    phi: 0.05,
    radius: 3.1,
    targetTheta: null,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    lastPinchDist: null,
  });

  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // ── Setup 3D Scene ──────────────────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.appendChild(renderer.domElement);
    refs.current.renderer = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd2d8e2); // Studio light-grey background
    refs.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      32,
      mount.clientWidth / mount.clientHeight,
      0.1,
      40
    );
    refs.current.camera = camera;

    // Studio Lighting
    scene.add(new THREE.AmbientLight(0xf2f6fc, 1.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce6f4, 1.0);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Floor shadow catcher
    const floorGeo = new THREE.PlaneGeometry(8, 8);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.05;
    floor.receiveShadow = true;
    scene.add(floor);

    // Model Group (hanger + jersey)
    const modelGroup = new THREE.Group();
    modelGroup.position.set(-0.35, 0, 0); // slight left offset to balance right info panel
    scene.add(modelGroup);
    refs.current.modelGroup = modelGroup;

    const isWhite = product.id.includes("wht");
    const hanger = buildViewerHanger(isWhite ? 0x8a7060 : 0x22242c);
    hanger.position.set(0, 0.54, 0);
    modelGroup.add(hanger);

    const jerseyMesh = buildVolumetricJersey(isWhite);
    jerseyMesh.position.set(0, 0, 0);
    modelGroup.add(jerseyMesh);

    // Load authentic PNG textures
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const frontMesh = jerseyMesh.getObjectByName("frontMesh") as THREE.Mesh | undefined;
    const backMesh = jerseyMesh.getObjectByName("backMesh") as THREE.Mesh | undefined;

    const loadViewerTexture = (url: string, targetMesh: THREE.Mesh | undefined) => {
      if (!targetMesh) return;
      loader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = false;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.needsUpdate = true;
          targetMesh.material = new THREE.MeshStandardMaterial({
            map: tex,
            transparent: true,
            alphaTest: 0.06,
            roughness: 0.48,
            metalness: 0.02,
            side: THREE.FrontSide, // FrontSide ensures no reversed mirror image on the inside!
            depthWrite: true,
          });
          targetMesh.material.needsUpdate = true;
        },
        undefined,
        (err) => {
          console.warn("JerseyViewer3D TextureLoader fallback for:", url, err);
          if (typeof window !== "undefined") {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const fallbackTex = new THREE.Texture(img);
              fallbackTex.colorSpace = THREE.SRGBColorSpace;
              fallbackTex.generateMipmaps = false;
              fallbackTex.minFilter = THREE.LinearFilter;
              fallbackTex.magFilter = THREE.LinearFilter;
              fallbackTex.needsUpdate = true;
              targetMesh.material = new THREE.MeshStandardMaterial({
                map: fallbackTex,
                transparent: true,
                alphaTest: 0.06,
                roughness: 0.48,
                metalness: 0.02,
                side: THREE.FrontSide, // FrontSide ensures no reversed mirror image on the inside!
                depthWrite: true,
              });
              targetMesh.material.needsUpdate = true;
            };
            img.src = url;
          }
        }
      );
    };

    loadViewerTexture(product.frontImage, frontMesh);
    loadViewerTexture(product.backImage, backMesh);

    // Concentric orbit target (centered on garment)
    const targetX = modelGroup.position.x;
    const targetY = 0.05;
    const targetZ = 0;

    // Camera spherical positioning
    const updateCamera = () => {
      const r = refs.current.radius;
      const th = refs.current.theta;
      const ph = refs.current.phi;
      camera.position.set(
        targetX + r * Math.sin(th) * Math.cos(ph),
        targetY + r * Math.sin(ph),
        targetZ + r * Math.cos(th) * Math.cos(ph)
      );
      camera.lookAt(targetX, targetY, targetZ);
    };
    updateCamera();

    // ── Mouse & Touch Orbit Controls ──────────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      refs.current.isDragging = true;
      refs.current.lastX = e.clientX;
      refs.current.lastY = e.clientY;
      refs.current.targetTheta = null;
      setViewFace(null);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!refs.current.isDragging) return;
      const dx = e.clientX - refs.current.lastX;
      const dy = e.clientY - refs.current.lastY;
      refs.current.theta -= dx * 0.009;
      refs.current.phi = Math.max(-0.2, Math.min(0.55, refs.current.phi + dy * 0.007));
      refs.current.lastX = e.clientX;
      refs.current.lastY = e.clientY;
    };

    const onMouseUp = () => {
      refs.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      refs.current.radius = Math.max(1.8, Math.min(4.8, refs.current.radius + e.deltaY * 0.003));
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        refs.current.isDragging = true;
        refs.current.lastX = e.touches[0].clientX;
        refs.current.lastY = e.touches[0].clientY;
        refs.current.targetTheta = null;
        setViewFace(null);
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        refs.current.lastPinchDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1 && refs.current.isDragging) {
        const dx = e.touches[0].clientX - refs.current.lastX;
        const dy = e.touches[0].clientY - refs.current.lastY;
        refs.current.theta -= dx * 0.01;
        refs.current.phi = Math.max(-0.25, Math.min(0.55, refs.current.phi + dy * 0.008));
        refs.current.lastX = e.touches[0].clientX;
        refs.current.lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2 && refs.current.lastPinchDist !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = (refs.current.lastPinchDist - dist) * 0.006;
        refs.current.radius = Math.max(1.8, Math.min(4.8, refs.current.radius + factor));
        refs.current.lastPinchDist = dist;
      }
    };

    const onTouchEnd = () => {
      refs.current.isDragging = false;
      refs.current.lastPinchDist = null;
    };

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    mount.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener("resize", onResize);

    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(mount);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (autoRotateRef.current && !refs.current.isDragging && refs.current.targetTheta === null) {
        refs.current.theta += 0.006;
      }

      if (refs.current.targetTheta !== null) {
        const diff = refs.current.targetTheta - refs.current.theta;
        if (Math.abs(diff) > 0.002) {
          refs.current.theta += diff * 0.12;
        } else {
          refs.current.theta = refs.current.targetTheta;
          refs.current.targetTheta = null;
        }
      }

      updateCamera();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      mount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("wheel", onWheel);
      mount.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      resizeObserver.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [product, onClose]);

  const snapToFront = useCallback(() => {
    setViewFace("front");
    setAutoRotate(false);
    const cur = refs.current.theta;
    const target = Math.round(cur / (Math.PI * 2)) * (Math.PI * 2);
    refs.current.targetTheta = target;
    refs.current.phi = 0.05;
  }, []);

  const snapToBack = useCallback(() => {
    setViewFace("back");
    setAutoRotate(false);
    const cur = refs.current.theta;
    const k = Math.round((cur - Math.PI) / (Math.PI * 2));
    refs.current.targetTheta = Math.PI + k * (Math.PI * 2);
    refs.current.phi = 0.05;
  }, []);

  const resetView = useCallback(() => {
    setViewFace("front");
    setAutoRotate(false);
    refs.current.targetTheta = 0;
    refs.current.phi = 0.05;
    refs.current.radius = 3.1;
  }, []);

  const zoomIn = () => {
    refs.current.radius = Math.max(2.1, refs.current.radius - 0.4);
  };

  const zoomOut = () => {
    refs.current.radius = Math.min(5.5, refs.current.radius + 0.4);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={`360 viewer for ${product.name}`}>
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className={styles.canvasMount} />

      {/* Controls Overlay */}
      <div className={styles.controls}>
        {/* Top Header */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <span className={styles.sku}>{product.sku}</span>
            <span className={styles.productName}>{product.name}</span>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close 360 viewer"
          >
            ✕
          </button>
        </div>

        {/* View Controls (Bottom Left) */}
        <div className={styles.viewControls}>
          <div className={styles.viewBtnGroup}>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewFace === "front" ? styles.viewBtnActive : ""}`}
              onClick={snapToFront}
              aria-label="Snap to front view"
            >
              FRONT
            </button>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewFace === "back" ? styles.viewBtnActive : ""}`}
              onClick={snapToBack}
              aria-label="Snap to back view"
            >
              BACK
            </button>
          </div>

          <button
            type="button"
            className={`${styles.iconBtn} ${autoRotate ? styles.iconBtnActive : ""}`}
            onClick={() => setAutoRotate((a) => !a)}
            title="Toggle auto rotation"
            aria-label="Toggle auto rotation"
          >
            ↻
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={zoomIn}
            title="Zoom in"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={zoomOut}
            title="Zoom out"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={resetView}
            title="Reset camera view"
            aria-label="Reset camera view"
          >
            ⟲
          </button>

          <span className={styles.dragHint} aria-hidden="true">
            Drag to rotate 360° • Scroll to zoom
          </span>
        </div>

        {/* Product Specification & Purchase Sidebar (Right) */}
        <aside className={styles.infoPanel}>
          <div className={styles.infoPanelInner}>
            <span className={styles.infoTag}>{product.tag}</span>
            <h1 className={styles.infoName}>{product.name}</h1>
            <p className={styles.infoSubtitle}>{product.subtitle}</p>

            <div className={styles.infoFeatures}>
              {product.features.map((feat, i) => (
                <div key={i} className={styles.featureRow}>
                  <span className={styles.featureCheck}>✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className={styles.infoSizes}>
              <span className={styles.sizeLabel}>SELECT SIZE</span>
              <div className={styles.sizeGrid}>
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.infoAction}>
              <div className={styles.priceBlock}>
                <span className={styles.price}>₹{product.price}</span>
                <span className={styles.priceTax}>INCL. ALL TAXES</span>
              </div>

              <button
                type="button"
                className={styles.addBtn}
                onClick={() => onAddToCart(selectedSize)}
              >
                ADD TO BAG
              </button>
            </div>

            <p className={styles.limitationNote}>
              * Authentic SBG esports apparel. 3D viewer renders genuine garment geometry with official front &amp; back artwork.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
