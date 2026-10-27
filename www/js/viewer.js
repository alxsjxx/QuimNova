// Visor 3D ligero: geometrías y materiales compartidos, render solo cuando hace falta.
import * as THREE from '../vendor/three.module.min.js';

// bs = radio en bolas y barras; vdw = radio de van der Waals (espacio lleno), en Å.
const ELEM = {
  H: { color: 0xf2f2f2, bs: 0.30, vdw: 1.10 },
  C: { color: 0x6b7280, bs: 0.42, vdw: 1.70 },
  N: { color: 0x3a5bff, bs: 0.40, vdw: 1.55 },
  O: { color: 0xe8261c, bs: 0.40, vdw: 1.52 },
};
const Y = new THREE.Vector3(0, 1, 0);
const X = new THREE.Vector3(1, 0, 0);
const RADIO_ENLACE = { 1: 0.1, 2: 0.07, 3: 0.055 };
const SEPARACION = 0.2;

export function createViewer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x0e1621, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const sol = new THREE.DirectionalLight(0xffffff, 2.2);
  sol.position.set(3, 4, 5);
  scene.add(sol);

  const mol = new THREE.Group();
  scene.add(mol);

  const geoEsfera = new THREE.SphereGeometry(1, 20, 14);
  const geoCilindro = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
  const mats = {};
  for (const [el, d] of Object.entries(ELEM)) mats[el] = new THREE.MeshLambertMaterial({ color: d.color });
  const matEnlace = new THREE.MeshLambertMaterial({ color: 0xb8c0cc });

  const st = {
    estilo: 'bolas', giro: true, vibra: false, zoom: 1,
    base: [], pos: [], dirs: [], elementos: [], atomos: [], enlaces: [], R: 2, dist: 6,
  };
  let raf = 0, ultimo = 0, tiempo = 0;

  // Vectores de trabajo reutilizados (evitan basura en cada fotograma)
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), unit = new THREE.Vector3(), perp = new THREE.Vector3();
  const qA = new THREE.Quaternion(), qB = new THREE.Quaternion();

  function radio(el) { return st.estilo === 'bolas' ? ELEM[el].bs : ELEM[el].vdw; }

  function colocar(pos) {
    st.atomos.forEach((m, i) => { m.position.copy(pos[i]); m.scale.setScalar(radio(st.elementos[i])); });
    for (const b of st.enlaces) {
      v1.copy(pos[b.i]); v2.copy(pos[b.j]);
      unit.subVectors(v2, v1);
      const largo = unit.length();
      if (largo < 1e-6) continue;
      unit.divideScalar(largo);
      perp.crossVectors(unit, Math.abs(unit.z) < 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)).normalize();
      qA.setFromUnitVectors(Y, unit);
      const n = b.meshes.length;
      b.meshes.forEach((m, k) => {
        const desplaz = (k - (n - 1) / 2) * SEPARACION;
        m.position.copy(v1).add(v2).multiplyScalar(0.5).addScaledVector(perp, desplaz);
        m.quaternion.copy(qA);
        const r = RADIO_ENLACE[n] ?? 0.06;
        m.scale.set(r, largo, r);
        m.visible = st.estilo === 'bolas';
      });
    }
  }

  function ajustar() {
    let R = 0;
    st.base.forEach((p, i) => { R = Math.max(R, p.length() + radio(st.elementos[i])); });
    st.R = R;
    const medio = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    st.dist = (R * 1.15) / (medio * Math.min(1, camera.aspect));
    camera.position.set(0, 0, st.dist * st.zoom);
    camera.lookAt(0, 0, 0);
  }

  function tick(ahora) {
    raf = 0;
    const dt = Math.min((ahora - ultimo) / 1000, 0.1);
    ultimo = ahora;
    tiempo += dt;
    if (st.giro) mol.quaternion.premultiply(qB.setFromAxisAngle(Y, dt * 0.6));
    if (st.vibra) {
      const amp = 0.1 * Math.sin(tiempo * 2 * Math.PI * 1.2);
      st.base.forEach((p, i) => st.pos[i].copy(p).addScaledVector(st.dirs[i], amp));
      colocar(st.pos);
    }
    renderer.render(scene, camera);
    if (st.giro || st.vibra) programar(false);
  }

  function programar(reiniciarReloj) {
    if (raf || document.hidden) return;
    if (reiniciarReloj) ultimo = performance.now();
    raf = requestAnimationFrame(tick);
  }
  const pedirRender = () => programar(true);

  function setMolecule(m) {
    for (const o of [...mol.children]) mol.remove(o);
    const c = new THREE.Vector3();
    m.atomos.forEach(([, x, y, z]) => c.add(v1.set(x, y, z)));
    c.divideScalar(m.atomos.length);

    st.elementos = m.atomos.map((a) => a[0]);
    st.base = m.atomos.map(([, x, y, z]) => new THREE.Vector3(x, y, z).sub(c));
    st.pos = st.base.map((p) => p.clone());
    st.dirs = st.base.map((p) => (p.lengthSq() > 1e-8 ? p.clone().normalize() : new THREE.Vector3()));
    st.atomos = st.elementos.map((el) => { const x = new THREE.Mesh(geoEsfera, mats[el]); mol.add(x); return x; });
    st.enlaces = m.enlaces.map(([i, j, orden]) => {
      const meshes = [];
      for (let k = 0; k < orden; k++) { const x = new THREE.Mesh(geoCilindro, matEnlace); mol.add(x); meshes.push(x); }
      return { i, j, meshes };
    });

    mol.quaternion.setFromAxisAngle(X, 0.35);
    ajustar();
    colocar(st.base);
    pedirRender();
  }

  function setStyle(estilo) { st.estilo = estilo; ajustar(); colocar(st.vibra ? st.pos : st.base); pedirRender(); }
  function setRotate(b) { st.giro = b; pedirRender(); }
  function setVibrate(b) { st.vibra = b; if (!b) colocar(st.base); pedirRender(); }
  function resetView() { st.zoom = 1; mol.quaternion.setFromAxisAngle(X, 0.35); ajustar(); pedirRender(); }

  // --- Gestos: un dedo gira, dos dedos hacen zoom (la rueda sirve para probar en PC) ---
  const punteros = new Map();
  let pinza0 = 0, zoom0 = 1;
  const distPinza = () => { const [a, b] = [...punteros.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  const fijarZoom = (z) => { st.zoom = THREE.MathUtils.clamp(z, 0.4, 2.5); camera.position.z = st.dist * st.zoom; };

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (punteros.size === 2) { pinza0 = distPinza(); zoom0 = st.zoom; }
  });
  canvas.addEventListener('pointermove', (e) => {
    const p = punteros.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (punteros.size === 1) {
      mol.quaternion.premultiply(qA.setFromAxisAngle(Y, dx * 0.01)).premultiply(qB.setFromAxisAngle(X, dy * 0.01));
    } else if (punteros.size === 2 && pinza0 > 0) {
      fijarZoom((zoom0 * pinza0) / distPinza());
    }
    pedirRender();
  });
  const soltar = (e) => punteros.delete(e.pointerId);
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); fijarZoom(st.zoom * (1 + Math.sign(e.deltaY) * 0.08)); pedirRender(); }, { passive: false });

  // --- Tamaño, visibilidad y pérdida de contexto WebGL ---
  new ResizeObserver(() => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (st.base.length) ajustar();
    pedirRender();
  }).observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else pedirRender();
  });
  canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
  canvas.addEventListener('webglcontextrestored', pedirRender);

  return { setMolecule, setStyle, setRotate, setVibrate, resetView };
}
