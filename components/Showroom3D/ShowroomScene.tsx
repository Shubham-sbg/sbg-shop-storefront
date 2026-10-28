"use client";

/**
 * ShowroomScene.tsx
 * Three.js virtual clothing showroom — SBG SHOP
 *
 * Architecture:
 *  - Mounted via useEffect into a <canvas> container (Vanilla Three.js)
 *  - Minimalist light-grey studio cyclorama (seamless floor + back wall)
 *  - Freestanding horizontal metal clothing rail with architectural T-stands
 *  - Individual hangers attached directly to the rail, supporting each jersey
 *  - Volumetric 3D garment mesh: curved front and back shells with 3D depth,
 *    subtle fabric draping, and authentic front/back SBG transparent PNG textures
 *    (clean alpha cutouts without opaque bounding boxes)
 *  - Smooth horizontal dragging with inertia, touch swipe, and auto-centering
 *  - Click / tap garment to open the 360° product viewer
 */

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

export interface ShowroomProduct {
  id: string;
  name: string;
  tag: string;
  price: number;
  frontImage: string;
  backImage: string;
}

interface Props {
  products: ShowroomProduct[];
  selectedIndex: number;
  onSelectProduct: (index: number) => void;
}

// ─── Geometry & Mesh Builders ────────────────────────────────────────────────

/**
 * Creates a volumetric hanging jersey:
 *  - Front curved draped shell with authentic front PNG texture
 *  - Back curved draped shell with authentic back PNG texture
 *  - Separation gives genuine 3D physical depth (~8cm)
 *  - alphaTest ensures transparent areas outside the garment are completely clear
 */
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
    const nx = x / (W / 2); // -1 to 1
    const ny = y / (H / 2); // -1 to 1
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

/**
 * Builds a realistic contoured showroom hanger:
 *  - Hook loops cleanly over the horizontal rail
 *  - Vertical stem passes down into the jersey neckline
 *  - Angled shoulder arms hold the garment naturally
 */
function buildHangerMesh(woodColor = 0x22242c): THREE.Group {
  const group = new THREE.Group();
  group.name = "hanger";

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xc8d0d8,
    metalness: 0.88,
    roughness: 0.18,
  });

  const shoulderMat = new THREE.MeshStandardMaterial({
    color: woodColor,
    metalness: 0.15,
    roughness: 0.45,
  });

  // Hook: curve that sits ON the rail (rail radius is 0.026)
  // Apex is at y = 0.22, drops to stem at y = 0.12
  const hookGeo = new THREE.TorusGeometry(0.038, 0.007, 10, 24, Math.PI * 1.25);
  const hook = new THREE.Mesh(hookGeo, metalMat);
  hook.position.set(0, 0.18, 0);
  hook.rotation.z = -Math.PI * 0.1;
  group.add(hook);

  // Vertical stem
  const stemGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.11, 8);
  const stem = new THREE.Mesh(stemGeo, metalMat);
  stem.position.set(0, 0.08, 0);
  group.add(stem);

  // Neck collar block
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

  // Horizontal bar
  const barGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.48, 8);
  const bar = new THREE.Mesh(barGeo, metalMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, -0.13, 0);
  group.add(bar);

  return group;
}

/**
 * Builds the studio horizontal clothing rail with two stable floor stands
 */
function buildRailStructure(totalWidth: number): THREE.Group {
  const group = new THREE.Group();
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xb5bfc8,
    metalness: 0.92,
    roughness: 0.18,
  });

  // Top horizontal bar
  const barGeo = new THREE.CylinderGeometry(0.026, 0.026, totalWidth, 20);
  const bar = new THREE.Mesh(barGeo, chromeMat);
  bar.rotation.z = Math.PI / 2;
  group.add(bar);

  // Rail end caps
  [-1, 1].forEach((side) => {
    const capGeo = new THREE.SphereGeometry(0.032, 16, 16);
    const cap = new THREE.Mesh(capGeo, chromeMat);
    cap.position.set((side * totalWidth) / 2, 0, 0);
    group.add(cap);
  });

  // Two vertical floor posts
  const postOffset = totalWidth * 0.42;
  [-postOffset, postOffset].forEach((x) => {
    const postHeight = 3.05;
    const postGeo = new THREE.CylinderGeometry(0.022, 0.022, postHeight, 14);
    const post = new THREE.Mesh(postGeo, chromeMat);
    post.position.set(x, -postHeight / 2, 0);
    group.add(post);

    // T-foot base on the floor
    const footGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.75, 12);
    const foot = new THREE.Mesh(footGeo, chromeMat);
    foot.rotation.x = Math.PI / 2;
    foot.position.set(x, -postHeight, 0);
    group.add(foot);

    // Rubber foot tips
    [-0.375, 0.375].forEach((fz) => {
      const tipGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.04, 10);
      const tipMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.8 });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(x, -postHeight, fz);
      group.add(tip);
    });
  });

  return group;
}

// ─── Main Showroom Three.js Component ────────────────────────────────────────

export default function ShowroomScene({ products, selectedIndex, onSelectProduct }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    garmentUnits: { group: THREE.Group; index: number }[];
    railGroup: THREE.Group;
    rafId: number;
    isDragging: boolean;
    dragStartX: number;
    dragVelocity: number;
    railOffsetX: number;
    targetOffsetX: number;
    clickStartX: number;
  } | null>(null);

  const SPACING = 2.1; // horizontal distance between garments
  const RAIL_Y = 1.35; // rail bar height
  const CAMERA_Z = 4.4;

  const onSelectRef = useRef(onSelectProduct);
  onSelectRef.current = onSelectProduct;

  // Apply textures to front & back meshes of a jersey
  const applyTextures = useCallback(
    (jerseyMesh: THREE.Group, product: ShowroomProduct, loader: THREE.TextureLoader) => {
      const frontMesh = jerseyMesh.getObjectByName("frontMesh") as THREE.Mesh | undefined;
      const backMesh = jerseyMesh.getObjectByName("backMesh") as THREE.Mesh | undefined;
      if (!frontMesh || !backMesh) return;

      // Load front high-resolution transparent PNG
      loader.load(product.frontImage, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        frontMesh.material = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          alphaTest: 0.05,
          roughness: 0.5,
          metalness: 0.02,
          side: THREE.DoubleSide,
        });
      });

      // Load back high-resolution transparent PNG
      loader.load(product.backImage, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        backMesh.material = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          alphaTest: 0.05,
          roughness: 0.5,
          metalness: 0.02,
          side: THREE.DoubleSide,
        });
      });
    },
    []
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Three.js Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    // ── Scene & Background ─────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd6dce4); // Minimalist quiet studio grey
    scene.fog = new THREE.Fog(0xd6dce4, 6, 16);

    // ── Camera ─────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      36,
      mount.clientWidth / mount.clientHeight,
      0.1,
      40
    );
    camera.position.set(0, 0.45, CAMERA_Z);
    camera.lookAt(0, 0.25, 0);

    // ── Lighting ───────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xf0f4fa, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 14;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce4f0, 0.9);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // ── Studio Floor Cyclorama ─────────────────────────────────────────
    const floorGeo = new THREE.PlaneGeometry(30, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xd2d8e0,
      roughness: 0.8,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.70;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back wall
    const wallGeo = new THREE.PlaneGeometry(30, 14);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xd8dee6,
      roughness: 0.9,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 3.5, -6);
    wall.receiveShadow = true;
    scene.add(wall);

    // ── Rail Group (slides horizontally) ───────────────────────────────
    const railGroup = new THREE.Group();
    scene.add(railGroup);

    const railWidth = Math.max(products.length * SPACING + 2.5, 9);
    const rail = buildRailStructure(railWidth);
    rail.position.y = RAIL_Y;
    railGroup.add(rail);

    // ── Garments & Hangers ─────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    const garmentUnits: { group: THREE.Group; index: number }[] = [];

    products.forEach((product, idx) => {
      const garmentUnit = new THREE.Group();
      garmentUnit.userData = { productIndex: idx };

      const xPos = (idx - (products.length - 1) / 2) * SPACING;

      // Hanger: hook rests precisely over the rail bar
      const isWhite = product.id.includes("wht");
      const hanger = buildHangerMesh(isWhite ? 0x8a7060 : 0x22242c);
      hanger.position.set(0, RAIL_Y - 0.22, 0);
      garmentUnit.add(hanger);

      // Jersey: hangs directly from hanger shoulder bar
      const jerseyMesh = buildVolumetricJersey();
      jerseyMesh.position.set(0, RAIL_Y - 0.86, 0);
      applyTextures(jerseyMesh, product, loader);
      garmentUnit.add(jerseyMesh);

      // Position entire garment unit on rail
      garmentUnit.position.set(xPos, 0, 0);
      railGroup.add(garmentUnit);
      garmentUnits.push({ group: garmentUnit, index: idx });

      // Contact shadow ellipse on studio floor
      const shadowGeo = new THREE.CircleGeometry(0.55, 24);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(xPos, -1.69, 0);
      railGroup.add(shadow);
    });

    // ── Interaction State ──────────────────────────────────────────────
    let isDragging = false;
    let dragStartX = 0;
    let clickStartX = 0;
    let clickStartY = 0;
    let dragVelocity = 0;
    let railOffsetX = -(selectedIndex - (products.length - 1) / 2) * SPACING;
    let targetOffsetX = railOffsetX;
    let lastDragX = 0;

    const maxOffset = ((products.length - 1) / 2) * SPACING + 0.3;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // ── Pointer / Drag Events ──────────────────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      lastDragX = e.clientX;
      dragVelocity = 0;
      mount.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!isDragging) return;

      const deltaX = (e.clientX - lastDragX) * 0.0055;
      targetOffsetX = clamp(targetOffsetX + deltaX, -maxOffset, maxOffset);
      dragVelocity = deltaX;
      lastDragX = e.clientX;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        mount.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      const dist = Math.hypot(e.clientX - clickStartX, e.clientY - clickStartY);
      if (dist < 8) {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(railGroup.children, true);
        for (const hit of intersects) {
          let cur: THREE.Object3D | null = hit.object;
          while (cur && cur !== railGroup) {
            if (cur.userData && typeof cur.userData.productIndex === "number") {
              onSelectRef.current(cur.userData.productIndex);
              return;
            }
            cur = cur.parent;
          }
        }
      }
    };

    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // ── Window Resize ──────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Render Loop ────────────────────────────────────────────────────
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // Inertia decay
      if (!isDragging && Math.abs(dragVelocity) > 0.0002) {
        targetOffsetX = clamp(targetOffsetX + dragVelocity, -maxOffset, maxOffset);
        dragVelocity *= 0.92;
      } else if (!isDragging) {
        dragVelocity = 0;
      }

      // Smooth interpolation
      railOffsetX += (targetOffsetX - railOffsetX) * 0.12;
      railGroup.position.x = railOffsetX;

      // Subtle hover lift on selected garment
      garmentUnits.forEach(({ group: unit, index }) => {
        const isSelected = index === selectedIndex;
        const targetY = isSelected ? 0.08 : 0;
        unit.position.y += (targetY - unit.position.y) * 0.15;
      });

      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      garmentUnits,
      railGroup,
      rafId,
      isDragging,
      dragStartX,
      dragVelocity,
      railOffsetX,
      targetOffsetX,
      clickStartX,
    };

    return () => {
      cancelAnimationFrame(rafId);
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [products, applyTextures, selectedIndex, SPACING]);

  useEffect(() => {
    if (!sceneRef.current) return;
    const centerOffset = -(selectedIndex - (products.length - 1) / 2) * SPACING;
    sceneRef.current.targetOffsetX = centerOffset;
  }, [selectedIndex, products.length, SPACING]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />;
}
