# QuimNova 🧪✨

Aplicación educativa de química interactiva con representación 3D de moléculas, información detallada, inspección de átomos y un modo Puzzle interactivo para reconstrucción de moléculas con validación de valencias y geometría.

## Funcionalidades
1. **Visualizador 3D**: Selección de moléculas (H₂O, CO₂, CH₄, NH₃, C₂H₄, C₆H₆), rotación, inspección táctil de átomos e información química detallada (fórmula, geometría, masa, enlaces, usos, etc.).
2. **Modo Puzzle**: Desensamble de moléculas y reconstrucción mediante interacción táctil.
3. **Validación Química**: Verificación de valencias, tipos de enlaces (simples/dobles) y sugerencias de corrección.
4. **Herramientas de Puzzle**: Controles de Deshacer, Reiniciar, Pistas inteligentes, Contador de progreso y Animación al completar.
5. **Optimizado para Móviles Modestos**: Renderizado Three.js eficiente y soporte offline mediante Service Worker.

## Compilado mediante GitHub Actions
Subir `quimnova.zip` a la raíz del repositorio o hacer push de la carpeta `www`. Ejecutar el workflow `QuimNova` eligiendo el target `apk`.
