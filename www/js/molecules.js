// Datos de moléculas: átomos [elemento, x, y, z] en ångström; enlaces [i, j, orden].
// Todo local: no hay descargas, así que funciona sin conexión.

function benceno() {
  const atomos = [];
  const enlaces = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    atomos.push(['C', 1.397 * Math.cos(a), 1.397 * Math.sin(a), 0]);
  }
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    atomos.push(['H', 2.481 * Math.cos(a), 2.481 * Math.sin(a), 0]);
  }
  for (let i = 0; i < 6; i++) {
    enlaces.push([i, (i + 1) % 6, i % 2 ? 1 : 2]); // estructura de Kekulé
    enlaces.push([i, 6 + i, 1]);
  }
  return { atomos, enlaces };
}

const t = 0.6276; // 1,087 Å / √3

export const MOLECULAS = [
  {
    id: 'agua', nombre: 'Agua', formula: 'H₂O',
    geometria: 'Angular · H–O–H ≈ 104,5°',
    descripcion: 'Molécula polar. Los dos pares libres del oxígeno cierran el ángulo respecto al tetraédrico (109,5°).',
    atomos: [['O', 0, 0, 0], ['H', 0.757, 0.586, 0], ['H', -0.757, 0.586, 0]],
    enlaces: [[0, 1, 1], [0, 2, 1]],
  },
  {
    id: 'co2', nombre: 'Dióxido de carbono', formula: 'CO₂',
    geometria: 'Lineal · O=C=O = 180°',
    descripcion: 'Aunque cada enlace C=O es polar, los dos dipolos se cancelan y la molécula es apolar.',
    atomos: [['C', 0, 0, 0], ['O', 1.16, 0, 0], ['O', -1.16, 0, 0]],
    enlaces: [[0, 1, 2], [0, 2, 2]],
  },
  {
    id: 'metano', nombre: 'Metano', formula: 'CH₄',
    geometria: 'Tetraédrica · H–C–H = 109,5°',
    descripcion: 'El hidrocarburo más simple. Cuatro enlaces C–H idénticos orientados a los vértices de un tetraedro.',
    atomos: [['C', 0, 0, 0], ['H', t, t, t], ['H', t, -t, -t], ['H', -t, t, -t], ['H', -t, -t, t]],
    enlaces: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
  },
  {
    id: 'amoniaco', nombre: 'Amoníaco', formula: 'NH₃',
    geometria: 'Piramidal trigonal · H–N–H ≈ 107°',
    descripcion: 'El nitrógeno tiene un par libre que empuja los tres hidrógenos hacia abajo, formando una pirámide.',
    atomos: [['N', 0, 0, 0.38], ['H', 0.938, 0, 0], ['H', -0.469, 0.812, 0], ['H', -0.469, -0.812, 0]],
    enlaces: [[0, 1, 1], [0, 2, 1], [0, 3, 1]],
  },
  {
    id: 'etileno', nombre: 'Etileno', formula: 'C₂H₄',
    geometria: 'Plana · H–C–C ≈ 121°',
    descripcion: 'Doble enlace C=C (≈1,34 Å), más corto que el simple del etano. Los seis átomos están en un mismo plano.',
    atomos: [
      ['C', -0.6695, 0, 0], ['C', 0.6695, 0, 0],
      ['H', -1.2342, 0.9288, 0], ['H', -1.2342, -0.9288, 0],
      ['H', 1.2342, 0.9288, 0], ['H', 1.2342, -0.9288, 0],
    ],
    enlaces: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]],
  },
  {
    id: 'benceno', nombre: 'Benceno', formula: 'C₆H₆',
    geometria: 'Anillo plano hexagonal · 120°',
    descripcion: 'Los electrones π están deslocalizados: los seis enlaces C–C miden ≈1,40 Å. Aquí se dibuja una estructura de Kekulé.',
    ...benceno(),
  },
];
