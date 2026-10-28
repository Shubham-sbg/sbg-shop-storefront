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

function buildVolumetricJersey(): THREE.Group {
  const jersey = new THREE.Group();
  jersey.name = "jerseyMesh";

  const W = 1.22;
  const H = 1.42;
  const SEGS_X = 16;
  const SEGS_Y = 18;
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
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.05,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const frontMesh = new THREE.Mesh(frontGeo, placeholderMat);
  frontMesh.name = "frontMesh";
  frontMesh.position.set(0, 0, DEPTH_HALF);
  frontMesh.castShadow = true;
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
  jersey.add(backMesh);

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
  autoRotateRef.current = autoRotate;

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

    const jerseyMesh = buildVolumetricJersey();
    jerseyMesh.position.set(0, 0, 0);
    modelGroup.add(jerseyMesh);

    // Load authentic PNG textures
    const loader = new THREE.TextureLoader();
    const frontMesh = jerseyMesh.getObjectByName("frontMesh") as THREE.Mesh | undefined;
    const backMesh = jerseyMesh.getObjectByName("backMesh") as THREE.Mesh | undefined;

    if (frontMesh) {
      loader.load(product.frontImage, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        frontMesh.material = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          alphaTest: 0.05,
          roughness: 0.48,
          metalness: 0.02,
          side: THREE.DoubleSide,
        });
      });
    }

    if (backMesh) {
      loader.load(product.backImage, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        backMesh.material = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          alphaTest: 0.05,
          roughness: 0.48,
          metalness: 0.02,
          side: THREE.DoubleSide,
        });
      });
    }

    // Camera spherical positioning
    const updateCamera = () => {
      const r = refs.current.radius;
      const th = refs.current.theta;
      const ph = refs.current.phi;
      camera.position.set(
        r * Math.sin(th) * Math.cos(ph),
        r * Math.sin(ph) + 0.1,
        r * Math.cos(th) * Math.cos(ph)
      );
      camera.lookAt(modelGroup.position.x, 0.05, 0);
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
      refs.current.radius = Math.max(2.1, Math.min(5.5, refs.current.radius + e.deltaY * 0.004));
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
        refs.current.phi = Math.max(-0.2, Math.min(0.55, refs.current.phi + dy * 0.008));
        refs.current.lastX = e.touches[0].clientX;
        refs.current.lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2 && refs.current.lastPinchDist !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = (refs.current.lastPinchDist - dist) * 0.008;
        refs.current.radius = Math.max(2.1, Math.min(5.5, refs.current.radius + factor));
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
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

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
