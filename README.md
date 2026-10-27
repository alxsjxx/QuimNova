# QuimNova

Visor educativo de moléculas 3D. HTML + CSS + JS + Three.js, empaquetado como APK con Capacitor.
Todo funciona sin conexión: no hay CDN ni descargas en tiempo de ejecución.

## Estructura

- `www/` — la app (lo único que editas día a día).
- `capacitor.config.json` — nombre e ID de la app.
- `scripts/copy-vendor.mjs` — copia Three.js a `www/vendor/` (lo hace el flujo, no tú).
- `ci.yml` — flujo de GitHub Actions (va en `.github/workflows/ci.yml`).
- El proyecto Android **no se guarda en el repo**: se genera en cada compilación.

## Flujo diario desde el celular

1. Edita archivos en GitHub (editor web) y haz *Commit*.
2. Se publica la vista previa en `https://TU-USUARIO.github.io/quimnova/` (≈1 min). Ábrela en Chrome.
3. Cuando quieras APK: **Actions → QuimNova → Run workflow → target = apk**.
4. A los ≈6–10 min aparece en **Releases** un archivo `QuimNova.apk`: tócalo para descargarlo e instalarlo.

## Añadir una molécula

En `www/js/molecules.js`, copia un bloque de `MOLECULAS` y cambia átomos `[elemento, x, y, z]` (Å) y
enlaces `[i, j, orden]`. Elementos soportados: H, C, N, O (para más, añade una línea en `ELEM` de `viewer.js`).

## Notas

- La APK es de **depuración** (se instala sin problema, no sirve para Play Store). Para publicar hay que firmar una *release*.
- Si cambias archivos de `www/`, sube el número de `CACHE` en `www/sw.js` para que el navegador refresque la caché.
