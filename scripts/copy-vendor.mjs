// Copia Three.js (minificado) desde node_modules a www/vendor para que la app
// funcione sin CDN y sin conexión. Lo ejecuta GitHub Actions; no hace falta a mano.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origen = join(raiz, 'node_modules', 'three', 'build');
const destino = join(raiz, 'www', 'vendor');
const principal = 'three.module.min.js';

if (!existsSync(join(origen, principal))) {
  console.error(`No existe ${principal} en node_modules/three/build. ¿Corriste "npm install"?`);
  process.exit(1);
}

mkdirSync(destino, { recursive: true });
// three.core.min.js solo existe en versiones recientes; se copia si está.
for (const f of [principal, 'three.core.min.js']) {
  if (existsSync(join(origen, f))) {
    copyFileSync(join(origen, f), join(destino, f));
    console.log('copiado:', f);
  }
}
