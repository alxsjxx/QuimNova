import { MOLECULAS } from './molecules.js';

const $ = (s) => document.querySelector(s);

function aviso(texto) {
  const a = $('#aviso');
  a.textContent = texto;
  a.hidden = false;
}

async function iniciar() {
  let viewer;
  try {
    const { createViewer } = await import('./viewer.js');
    viewer = createViewer($('#lienzo'));
  } catch (err) {
    console.error(err);
    aviso('No se pudo iniciar el visor 3D. Falta www/vendor (ejecuta el flujo de compilación) o tu dispositivo no soporta WebGL.');
    return;
  }

  const chips = $('#chips');
  const botones = new Map();

  function mostrar(m) {
    $('#formula').textContent = m.formula;
    $('#nombre').textContent = m.nombre;
    $('#geo').textContent = m.geometria;
    $('#desc').textContent = m.descripcion;
    botones.forEach((b, id) => b.setAttribute('aria-pressed', String(id === m.id)));
    viewer.setMolecule(m);
  }

  for (const m of MOLECULAS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = m.formula;
    b.setAttribute('aria-label', m.nombre);
    b.addEventListener('click', () => mostrar(m));
    chips.append(b);
    botones.set(m.id, b);
  }

  const alternar = (btn, fn) => btn.addEventListener('click', () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    fn(on);
  });
  alternar($('#b-giro'), (on) => viewer.setRotate(on));
  alternar($('#b-vib'), (on) => viewer.setVibrate(on));
  alternar($('#b-esp'), (on) => viewer.setStyle(on ? 'espacio' : 'bolas'));
  $('#b-reset').addEventListener('click', () => viewer.resetView());

  mostrar(MOLECULAS[0]);
}

iniciar();

// Offline en navegador/PWA. Dentro de la APK los archivos ya van empaquetados.
const nativo = window.Capacitor?.isNativePlatform?.();
if (!nativo && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
