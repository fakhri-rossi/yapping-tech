'use client';

import { useState, useRef, useEffect } from 'react';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Link from 'next/link';
import { fadeInAudio } from '@lib/audio-utils';

/* ============================================================
   Interactive 3D Book — Three.js + GSAP Real 3D Story Template
   Fully optimized for mobile/tablet readability & balanced lighting
   ============================================================ */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    THREE: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsap: any;
  }
}

export default function Interactive3DBook({
  recipientName = 'Nadia',
  greetingText = '',
  photos = [],
  musicUrl = '/music/overjoyed.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const defaultPhotos = [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop',
  ];

  const storyPhotos = photos.length > 0 ? photos : defaultPhotos;
  const greetingParagraphs = greetingText ? greetingText.split('\n').filter((p) => p.trim()) : [];

  // Load Three.js & GSAP scripts
  useEffect(() => {
    let isMounted = true;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject();
        document.head.appendChild(s);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'),
    ])
      .then(() => {
        if (isMounted) setScriptsLoaded(true);
      })
      .catch((err) => console.error('Failed to load Three.js / GSAP scripts:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Three.js Scene Setup once started & scriptsLoaded
  useEffect(() => {
    if (!started || !scriptsLoaded || !containerRef.current || !window.THREE || !window.gsap) return;

    const THREE = window.THREE;
    const gsap = window.gsap;
    const container = containerRef.current;

    let animFrameId: number;
    let isFlipping = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pages: any[] = [];
    const bookGroup = new THREE.Group();

    // 1. Book Content Setup
    const bookContent = [
      {
        type: 'cover',
        title: 'Perjalanan Kita',
        subtitle: `Buku Memori Spesial ${recipientName}`,
        bgColor: '#0f172a',
        textColor: '#ffffff',
      },
      {
        type: 'page',
        text: greetingParagraphs[0] || 'Awal mula semuanya. Sederhana tapi tak terlupakan.',
        image: storyPhotos[0] || defaultPhotos[0],
        bgColor: '#f8fafc',
      },
      {
        type: 'page',
        text: greetingParagraphs[1] || 'Kencan pertama kita. Waktu serasa berhenti.',
        image: storyPhotos[1] || defaultPhotos[1],
        bgColor: '#f8fafc',
      },
      {
        type: 'page',
        text: greetingParagraphs[2] || 'Liburan impulsif yang paling berantakan tapi paling seru.',
        image: storyPhotos[2] || defaultPhotos[2],
        bgColor: '#f8fafc',
      },
      {
        type: 'page',
        text: greetingParagraphs[3] || 'Ketawa tanpa henti. Kamu selalu tau cara bikin aku bahagia.',
        image: storyPhotos[3] || defaultPhotos[3],
        bgColor: '#f8fafc',
      },
      {
        type: 'page',
        text: greetingParagraphs[4] || 'Momen kecil yang selalu punya arti besar buatku.',
        image: storyPhotos[4] || defaultPhotos[4],
        bgColor: '#f8fafc',
      },
      {
        type: 'page',
        text: greetingParagraphs[5] || `Happy Birthday ${recipientName}! Semoga kita selalu bersama.`,
        image: storyPhotos[5] || defaultPhotos[5],
        bgColor: '#f8fafc',
      },
      {
        type: 'end',
        title: 'Tamat 🤍',
        subtitle: `Dibuat khusus untuk ${recipientName}`,
        bgColor: '#0f172a',
        textColor: '#ffffff',
      },
    ];

    // 2. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#cbd5e1'); // Slightly darker room background for better book contrast
    scene.fog = new THREE.Fog('#cbd5e1', 12, 35);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);

    // Optimized camera distance for mobile & tablet screens (distanced for full visibility)
    if (width < 480) {
      camera.position.set(0, 12.5, 12.5);
    } else if (width < 640) {
      camera.position.set(0, 11.5, 11.5);
    } else if (width < 768) {
      camera.position.set(0, 8.2, 8.2);
    } else {
      camera.position.set(0, 6.5, 6.5);
    }
    camera.lookAt(0, 0, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (renderer.outputColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Softer exposure tone mapping to eliminate glaring/overexposed whites
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;
    }

    container.appendChild(renderer.domElement);

    // 4. Lighting (Soft, non-glaring lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3e0, 1.1); // Warm, soft sunlight
    sunLight.position.set(8, 9, -8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.4);
    spotLight.position.set(0, 10, 3);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    spotLight.distance = 30;
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 5. Environment (Wood Desk, Coffee Cup, Pencil)
    function createWoodTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#c4a482';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = '#b39270';
      for (let i = 0; i < 300; i++) {
        const w = Math.random() * 200 + 50;
        const h = Math.random() * 3 + 1;
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillRect(x, y, w, h);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 5);
      if (texture.colorSpace) texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    // Desk
    const deskGeo = new THREE.PlaneGeometry(50, 50);
    const deskMat = new THREE.MeshStandardMaterial({ map: createWoodTexture(), roughness: 0.8 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.rotation.x = -Math.PI / 2;
    desk.receiveShadow = true;
    scene.add(desk);

    // Mug
    const cupGroup = new THREE.Group();
    cupGroup.position.set(4.2, 0, -1.8);
    const mugGeo = new THREE.CylinderGeometry(0.48, 0.42, 0.95, 32);
    const mugMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.y = 0.48;
    mug.castShadow = true;
    cupGroup.add(mug);
    scene.add(cupGroup);

    // Pencil
    const pencilGroup = new THREE.Group();
    pencilGroup.position.set(-4.5, 0.04, 1.8);
    pencilGroup.rotation.y = -Math.PI / 6;
    const bodyGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = -Math.PI / 2;
    body.castShadow = true;
    pencilGroup.add(body);
    scene.add(pencilGroup);

    // 6. High-Resolution Texture Generator for Pages (Crisp text & vibrant photos)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function createTextureFromContent(data: any) {
      const canvas = document.createElement('canvas');
      canvas.width = 1536; // HD 1.5K Canvas for razor-sharp text
      canvas.height = 1536;
      const ctx = canvas.getContext('2d')!;
      const texture = new THREE.CanvasTexture(canvas);
      if (texture.colorSpace) texture.colorSpace = THREE.SRGBColorSpace;

      function drawContent(imgObj: HTMLImageElement | null = null) {
        // Soft Off-white page background to prevent harsh glare
        ctx.fillStyle = data.bgColor || '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (data.type === 'cover' || data.type === 'end') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = data.textColor || '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 120px "Playfair Display", "Georgia", serif';
          ctx.fillText(data.title || '', 768, 680);
          ctx.font = '55px "Montserrat", "Arial", sans-serif';
          ctx.fillText(data.subtitle || '', 768, 830);

          ctx.strokeStyle = data.textColor || '#ffffff';
          ctx.lineWidth = 12;
          ctx.strokeRect(90, 90, 1356, 1356);
          ctx.lineWidth = 4;
          ctx.strokeRect(120, 120, 1296, 1296);
        } else if (data.type === 'page') {
          // Draw Photo Area with high contrast border
          if (imgObj) {
            const frameW = 1200;
            const frameH = 900;
            const frameX = 168;
            const frameY = 140;

            const scale = Math.max(frameW / imgObj.width, frameH / imgObj.height);
            const x = frameX + frameW / 2 - (imgObj.width / 2) * scale;
            const y = frameY + frameH / 2 - (imgObj.height / 2) * scale;

            ctx.save();
            ctx.beginPath();
            ctx.rect(frameX, frameY, frameW, frameH);
            ctx.clip();
            ctx.drawImage(imgObj, x, y, imgObj.width * scale, imgObj.height * scale);
            ctx.restore();

            // Photo Border & Shadow Accent
            ctx.strokeStyle = '#020617';
            ctx.lineWidth = 10;
            ctx.strokeRect(frameX, frameY, frameW, frameH);
          } else {
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(168, 140, 1200, 900);
            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 45px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Memuat Foto...', 768, 590);
          }

          // Ultra-Crisp Dark Text for Maximum Legibility on Mobile/Tablet
          ctx.fillStyle = '#020617';
          ctx.font = 'bold 54px "Montserrat", "Arial", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          const words = (data.text || '').split(' ');
          let line = '';
          let textY = 1100;
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 1200 && n > 0) {
              ctx.fillText(line, 768, textY);
              line = words[n] + ' ';
              textY += 70;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, 768, textY);
        }
        texture.needsUpdate = true;
      }

      drawContent();

      if (data.type === 'page' && data.image) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => drawContent(img);
        img.onerror = () => drawContent();
        img.src = data.image;
      }

      return texture;
    }

    // 7. Create 3D Book Geometry
    const leafCount = Math.ceil(bookContent.length / 2);
    const pageWidth = 3.2;
    const pageHeight = 4.5;
    const pageThickness = 0.02;

    for (let i = 0; i < leafCount; i++) {
      const leafGroup = new THREE.Group();
      leafGroup.position.x = 0;

      const frontData = bookContent[i * 2] || { type: 'cover', title: '', bgColor: '#fff' };
      const backData = bookContent[i * 2 + 1] || { type: 'cover', title: '', bgColor: '#fff' };

      const frontTex = createTextureFromContent(frontData);
      const backTex = createTextureFromContent(backData);
      backTex.center.set(0.5, 0.5);
      backTex.rotation = Math.PI;

      const edgeColor = new THREE.Color('#cbd5e1');
      const materials = [
        new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.75, metalness: 0.0 }), // Matte roughness prevents glare
        new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.75, metalness: 0.0 }),
        new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.9 }),
      ];

      const geometry = new THREE.BoxGeometry(pageWidth, pageThickness, pageHeight);
      geometry.translate(pageWidth / 2, 0, 0);

      const pageMesh = new THREE.Mesh(geometry, materials);
      pageMesh.castShadow = true;
      pageMesh.receiveShadow = true;
      pageMesh.userData = { index: i, isFlipped: false };

      leafGroup.add(pageMesh);
      bookGroup.add(leafGroup);
      pages.push(leafGroup);

      leafGroup.position.y = (leafCount - i) * pageThickness;
    }

    scene.add(bookGroup);
    bookGroup.position.set(-1.5, 0.05, 0);

    // 8. Interaction Logic
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function flipPage(leafGroup: any, forward: boolean) {
      if (isFlipping) return;
      isFlipping = true;
      const mesh = leafGroup.children[0];
      const targetAngle = forward ? Math.PI : 0;
      mesh.userData.isFlipped = forward;

      const startY = forward
        ? (leafCount - mesh.userData.index) * pageThickness
        : mesh.userData.index * pageThickness;
      const targetY = forward
        ? mesh.userData.index * pageThickness
        : (leafCount - mesh.userData.index) * pageThickness;

      gsap.to(leafGroup.rotation, {
        z: targetAngle,
        duration: 1.2,
        ease: 'power2.inOut',
      });

      const obj = { p: 0 };
      gsap.to(obj, {
        p: 1,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          leafGroup.position.y =
            startY + (targetY - startY) * obj.p + Math.sin(obj.p * Math.PI) * 0.4;
        },
        onComplete: () => {
          leafGroup.position.y = targetY;
          isFlipping = false;
          updateBookPosition();
        },
      });
    }

    function updateBookPosition() {
      const isMobile = (container.clientWidth || window.innerWidth) < 640;
      const anyFlipped = pages.some((p) => p.children[0].userData.isFlipped);
      const allFlipped = pages.every((p) => p.children[0].userData.isFlipped);
      let targetX = 0;
      if (!anyFlipped) targetX = isMobile ? -0.5 : -1.5;
      else if (allFlipped) targetX = isMobile ? 0.5 : 1.5;
      else targetX = 0;

      gsap.to(bookGroup.position, { x: targetX, duration: 0.8, ease: 'power2.out' });
    }

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(bookGroup.children, true);
      if (intersects.length > 0 && !isFlipping) {
        const clickedMesh = intersects[0].object;
        const pageData = clickedMesh.userData;
        if (!pageData.isFlipped) {
          const topUnflipped = pages.find((p) => !p.children[0].userData.isFlipped);
          if (topUnflipped) flipPage(topUnflipped, true);
        } else {
          const flippedPages = pages.filter((p) => p.children[0].userData.isFlipped);
          const topFlipped = flippedPages[flippedPages.length - 1];
          if (topFlipped) flipPage(topFlipped, false);
        }
      }
    };

    const handleResize = () => {
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);

      if (newW < 480) {
        gsap.to(camera.position, { y: 12.5, z: 12.5, duration: 0.5 });
      } else if (newW < 640) {
        gsap.to(camera.position, { y: 11.5, z: 11.5, duration: 0.5 });
      } else if (newW < 768) {
        gsap.to(camera.position, { y: 8.2, z: 8.2, duration: 0.5 });
      } else {
        gsap.to(camera.position, { y: 6.5, z: 6.5, duration: 0.5 });
      }
    };

    renderer.domElement.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    function animate() {
      animFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      renderer.domElement.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, scriptsLoaded, recipientName, greetingText, photos]);

  const handleStart = () => {
    setStarted(true);
    fadeInAudio(audioRef.current, 0.6, 2500);
  };

  return (
    <div className="relative w-full h-full min-h-screen min-h-[100dvh] bg-slate-900 text-slate-100 flex flex-col items-center justify-center overflow-hidden">
      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} />

      {/* Navigation Buttons (Kembali & Refresh) - Icon Only for Demo */}
      {showBackButton !== false && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <Link
            href="/plivin/gift"
            title="Kembali ke Beranda"
            className="p-2.5 rounded-xl bg-black/80 text-white border border-white/20 hover:border-white hover:bg-black transition-all shadow-lg backdrop-blur-md flex items-center justify-center cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
            }}
            title="Muat Ulang"
            className="p-2.5 rounded-xl bg-black/80 text-white border border-white/20 hover:border-white hover:bg-black transition-all shadow-lg backdrop-blur-md flex items-center justify-center cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
            </svg>
          </button>
        </div>
      )}

      {/* Intro Screen */}
      {!started && (
        <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center text-center p-6 space-y-6">
          <span className="text-6xl animate-bounce">📖</span>
          <h2 className="text-3xl font-extrabold text-white">Buku Memori 3D</h2>
          <p className="text-slate-400 text-xs max-w-sm">
            Sebuah lembaran cerita 3D interaktif spesial untuk <strong>{recipientName}</strong>.
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-white text-black font-extrabold text-base rounded-2xl border-4 border-black hover:bg-slate-200 transition shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-0.5 hover:translate-y-0.5"
          >
            📖 Buka Lembaran Cerita
          </button>
        </div>
      )}

      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full min-h-screen min-h-[100dvh] absolute inset-0 z-10" />

      {started && (
        <div className="absolute bottom-6 z-20 bg-black/70 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-xs font-bold text-slate-200 shadow-xl pointer-events-none">
          👆 Klik/Ketuk Lembaran Buku Untuk Membalik Halaman
        </div>
      )}
    </div>
  );
}
