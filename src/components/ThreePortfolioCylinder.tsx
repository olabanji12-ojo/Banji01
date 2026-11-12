import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreePortfolioCylinder() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 200;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // 4. Create High-Res Canvas Texture
    // Text reads horizontally from Left to Right!
    // Multiple rows vertically around the circumference: [Solid, Outline, Solid, Outline]
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 2048;
    textCanvas.height = 1024;
    const ctx = textCanvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      const text = 'PORTFOLIO';
      ctx.font = '900 180px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const rowHeight = textCanvas.height / 4;
      const centerX = textCanvas.width / 2;

      for (let row = 0; row < 4; row++) {
        const centerY = rowHeight * row + rowHeight / 2;

        if (row % 2 === 0) {
          // Solid Black Row
          ctx.fillStyle = '#09090b';
          ctx.fillText(text, centerX, centerY);
        } else {
          // Hollow Outline Row
          ctx.strokeStyle = '#09090b';
          ctx.lineWidth = 4.5;
          ctx.strokeText(text, centerX, centerY);
        }
      }
    }

    const texture = new THREE.CanvasTexture(textCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    // 5. Plane with Sine Wave Vertex Shader OR True Curved Ribbon
    // A segmented plane that curves in 3D around a horizontal cylinder is much cleaner and eliminates UV inversion issues!
    const planeWidth = 7.2;
    const planeHeight = 2.4;
    const segmentsX = 120;
    const segmentsY = 60;

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsX, segmentsY);

    // Bend the plane into a 3D cylindrical wave!
    // For every vertex:
    // Y runs from -planeHeight/2 to +planeHeight/2
    // X runs from -planeWidth/2 (P) to +planeWidth/2 (O)
    // We bend the plane around the cylinder curve AND apply the twist phase!
    const pos = geometry.attributes.position;
    const bendRadius = 0.95;
    const twistStrength = 0.48;

    for (let i = 0; i < pos.count; i++) {
      const origX = pos.getX(i);
      const origY = pos.getY(i);

      // Phase twist along horizontal X
      const twistPhase = origX * twistStrength;

      // Arc angle around the cylinder curve
      const arcAngle = (origY / planeHeight) * Math.PI * 1.4 + twistPhase;

      // Curve around cylinder: Y and Z become circular arc
      const curvedY = Math.sin(arcAngle) * bendRadius;
      const curvedZ = Math.cos(arcAngle) * bendRadius - bendRadius;

      pos.setY(i, curvedY);
      pos.setZ(i, curvedZ);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 6. Smooth Rolling Animation Loop
    let animId: number;
    let roll = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Roll vertically around the curve
      roll += 0.0032;
      texture.offset.y = roll;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        maxWidth: '680px',
        height: '240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
