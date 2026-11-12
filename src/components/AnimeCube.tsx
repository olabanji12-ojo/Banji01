import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AnimeCubeProps {
  size?: number;
  className?: string;
  autoRotate?: boolean;
}

export default function AnimeCube({
  size = 2.4,
  className = '',
  autoRotate = true,
}: AnimeCubeProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 320;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // 4. Texture Loader for the Anime Character
    const textureLoader = new THREE.TextureLoader();
    const animeTexture = textureLoader.load('/assets/Main-character.webp');
    animeTexture.colorSpace = THREE.SRGBColorSpace;
    animeTexture.generateMipmaps = true;
    animeTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // Material with texture for the faces
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: animeTexture,
      roughness: 0.2,
      metalness: 0.1,
    });

    // Dark slate material for top and bottom cap with stylish subtle contrast
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0x111114,
      roughness: 0.3,
      metalness: 0.7,
    });

    // [right, left, top, bottom, front, back]
    const materials = [
      faceMaterial, // right
      faceMaterial, // left
      capMaterial,  // top
      capMaterial,  // bottom
      faceMaterial, // front
      faceMaterial, // back
    ];

    // 5. Cube Geometry with Chamfer/Frame effect
    const geometry = new THREE.BoxGeometry(size, size, size);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Outer wireframe floating frame (editorial / high-tech accent)
    const wireframeGeo = new THREE.BoxGeometry(size * 1.14, size * 1.14, size * 1.14);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireframeBox = new THREE.Mesh(wireframeGeo, wireframeMat);
    scene.add(wireframeBox);

    // Inner subtle glow accent ring
    const ringGeo = new THREE.TorusGeometry(size * 0.9, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x222226,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // 6. Studio Lighting (Crisp high-fashion monochrome lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    // 7. Interactive Parallax Physics
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovered = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => {
      isHovered = false;
      mouseX = 0;
      mouseY = 0;
    };

    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseenter', handleMouseEnter);
    mount.addEventListener('mouseleave', handleMouseLeave);

    // 8. Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. Render Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth interpolation for mouse tilt
      targetX += (mouseX - targetX) * 0.08;
      targetY += (mouseY - targetY) * 0.08;

      if (autoRotate && !isHovered) {
        cube.rotation.y = elapsed * 0.5;
        cube.rotation.x = Math.sin(elapsed * 0.4) * 0.15;
      } else {
        cube.rotation.y += (targetX * 1.8 - cube.rotation.y) * 0.08;
        cube.rotation.x += (-targetY * 1.4 - cube.rotation.x) * 0.08;
      }

      // Wireframe follows with subtle delayed lag (fluid mechanical feel)
      wireframeBox.rotation.y = cube.rotation.y * 1.05;
      wireframeBox.rotation.x = cube.rotation.x * 1.05;
      ring.rotation.z = elapsed * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseenter', handleMouseEnter);
      mount.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      wireframeGeo.dispose();
      ringGeo.dispose();
      animeTexture.dispose();
      faceMaterial.dispose();
      capMaterial.dispose();
      wireframeMat.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [size, autoRotate]);

  return (
    <div
      ref={mountRef}
      className={`anime-cube-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '280px',
        position: 'relative',
        cursor: 'grab',
      }}
    />
  );
}

