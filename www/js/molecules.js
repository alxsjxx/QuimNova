export const moleculesData = {
    H2O: {
        id: 'H2O',
        name: 'Agua',
        formula: 'H₂O',
        mass: '18.015 g/mol',
        geometry: 'Angular',
        angles: '104.5°',
        bonds: '2 enlaces simples O-H',
        properties: 'Líquido incoloro, inodoro e insípido. Disolvente universal.',
        uses: 'Esencial para la vida y procesos biológicos.',
        atoms: [
            { id: 0, element: 'O', x: 0, y: 0, z: 0, color: 0xef4444, radius: 0.5, valence: 2 },
            { id: 1, element: 'H', x: 0.8, y: 0.6, z: 0, color: 0xf8fafc, radius: 0.3, valence: 1 },
            { id: 2, element: 'H', x: -0.8, y: 0.6, z: 0, color: 0xf8fafc, radius: 0.3, valence: 1 }
        ],
        connections: [
            { from: 0, to: 1, type: 'single' },
            { from: 0, to: 2, type: 'single' }
        ]
    },
    CO2: {
        id: 'CO2',
        name: 'Dióxido de Carbono',
        formula: 'CO₂',
        mass: '44.01 g/mol',
        geometry: 'Lineal',
        angles: '180°',
        bonds: '2 enlaces dobles C=O',
        properties: 'Gas incoloro, denso y no inflamable.',
        uses: 'Bebidas carbonatadas, extintores y fotosíntesis.',
        atoms: [
            { id: 0, element: 'C', x: 0, y: 0, z: 0, color: 0x475569, radius: 0.5, valence: 4 },
            { id: 1, element: 'O', x: 1.2, y: 0, z: 0, color: 0xef4444, radius: 0.5, valence: 2 },
            { id: 2, element: 'O', x: -1.2, y: 0, z: 0, color: 0xef4444, radius: 0.5, valence: 2 }
        ],
        connections: [
            { from: 0, to: 1, type: 'double' },
            { from: 0, to: 2, type: 'double' }
        ]
    },
    CH4: {
        id: 'CH4',
        name: 'Metano',
        formula: 'CH₄',
        mass: '16.04 g/mol',
        geometry: 'Tetraédrica',
        angles: '109.5°',
        bonds: '4 enlaces simples C-H',
        properties: 'Gas incoloro e inflamable, hidrocarburo más simple.',
        uses: 'Combustible fósil principal y síntesis química.',
        atoms: [
            { id: 0, element: 'C', x: 0, y: 0, z: 0, color: 0x475569, radius: 0.5, valence: 4 },
            { id: 1, element: 'H', x: 0.8, y: 0.8, z: 0.8, color: 0xf8fafc, radius: 0.3, valence: 1 },
            { id: 2, element: 'H', x: -0.8, y: -0.8, z: 0.8, color: 0xf8fafc, radius: 0.3, valence: 1 },
            { id: 3, element: 'H', x: -0.8, y: 0.8, z: -0.8, color: 0xf8fafc, radius: 0.3, valence: 1 },
            { id: 4, element: 'H', x: 0.8, y: -0.8, z: -0.8, color: 0xf8fafc, radius: 0.3, valence: 1 }
        ],
        connections: [
            { from: 0, to: 1, type: 'single' },
            { from: 0, to: 2, type: 'single' },
            { from: 0, to: 3, type: 'single' },
            { from: 0, to: 4, type: 'single' }
        ]
    },
    NH3: {
        id: 'NH3',
        name: 'Amoníaco',
        formula: 'NH₃',
        mass: '17.03 g/mol',
        geometry: 'Piramidal trigonal',
        angles: '107°',
        bonds: '3 enlaces simples N-H',
        properties: 'Gas incoloro con olor muy penetrante.',
        uses: 'Fabricación de fertilizantes y productos de limpieza.',
        atoms: [
            { id: 0, element: 'N', x: 0, y: 0, z: 0, color: 0x2563eb, radius: 0.5, valence: 3 },
            { id: 1, element: 'H', x: 0.9, y: -0.5, z: 0, color: 0xf8fafc, radius: 0.3, valence: 1 },
            { id: 2, element: 'H', x: -0.45, y: -0.5, z: 0.8, color: 0xf8fafc, radius: 0.3, valence: 1 },
            { id: 3, element: 'H', x: -0.45, y: -0.5, z: -0.8, color: 0xf8fafc, radius: 0.3, valence: 1 }
        ],
        connections: [
            { from: 0, to: 1, type: 'single' },
            { from: 0, to: 2, type: 'single' },
            { from: 0, to: 3, type: 'single' }
        ]
    },
    C2H4: {
        id: 'C2H4',
        name: 'Etileno',
        formula: 'C₂H₄',
        mass: '28.05 g/mol',
        geometry: 'Plana trigonal',
        angles: '120°',
        bonds: '1 enlace doble C=C, 4 simples C-H',
        properties: 'Gas incoloro con aroma dulce.',
        uses: 'Producción de plásticos (polietileno) y maduración de frutas.',
        atoms: [
            { id: 0, element: 'C', x: -0.6, y: 0, z: 0, color: 0x475569, radius: 0.5, valence: 4 },
            { id: 1, element: 'C', x: 0.6, y: 0, z: 0, color: 0x475569, radius: 0.5, valence: 4 },
            { id: 2, element: 'H', x: -1.2, y: 0.9, z: 0, color: 0xf8fafc, radius: 0.3, valence: 1 },
            { id: 3, element: 'H', x: -1.2, y: -0.9, z: 0, color: 0xf8fafc, radius: 0.3, valence: 1 },
            { id: 4, element: 'H', x: 1.2, y: 0.9, z: 0, color: 0xf8fafc, radius: 0.3, valence: 1 },
            { id: 5, element: 'H', x: 1.2, y: -0.9, z: 0, color: 0xf8fafc, radius: 0.3, valence: 1 }
        ],
        connections: [
            { from: 0, to: 1, type: 'double' },
            { from: 0, to: 2, type: 'single' },
            { from: 0, to: 3, type: 'single' },
            { from: 1, to: 4, type: 'single' },
            { from: 1, to: 5, type: 'single' }
        ]
    },
    C6H6: {
        id: 'C6H6',
        name: 'Benceno',
        formula: 'C₆H₆',
        mass: '78.11 g/mol',
        geometry: 'Hexagonal plana',
        angles: '120°',
        bonds: 'Enlaces resonantes aromáticos',
        properties: 'Líquido incoloro, inflamable y aromático.',
        uses: 'Disolvente industrial y precursor de polímeros.',
        atoms: [
            { id: 0, element: 'C', x: 1.0, y: 0.6, z: 0, color: 0x475569, radius: 0.45, valence: 4 },
            { id: 1, element: 'C', x: 1.0, y: -0.6, z: 0, color: 0x475569, radius: 0.45, valence: 4 },
            { id: 2, element: 'C', x: 0.0, y: -1.2, z: 0, color: 0x475569, radius: 0.45, valence: 4 },
            { id: 3, element: 'C', x: -1.0, y: -0.6, z: 0, color: 0x475569, radius: 0.45, valence: 4 },
            { id: 4, element: 'C', x: -1.0, y: 0.6, z: 0, color: 0x475569, radius: 0.45, valence: 4 },
            { id: 5, element: 'C', x: 0.0, y: 1.2, z: 0, color: 0x475569, radius: 0.45, valence: 4 },
            { id: 6, element: 'H', x: 1.9, y: 1.1, z: 0, color: 0xf8fafc, radius: 0.25, valence: 1 },
            { id: 7, element: 'H', x: 1.9, y: -1.1, z: 0, color: 0xf8fafc, radius: 0.25, valence: 1 },
            { id: 8, element: 'H', x: 0.0, y: -2.3, z: 0, color: 0xf8fafc, radius: 0.25, valence: 1 },
            { id: 9, element: 'H', x: -1.9, y: -1.1, z: 0, color: 0xf8fafc, radius: 0.25, valence: 1 },
            { id: 10, element: 'H', x: -1.9, y: 1.1, z: 0, color: 0xf8fafc, radius: 0.25, valence: 1 },
            { id: 11, element: 'H', x: 0.0, y: 2.3, z: 0, color: 0xf8fafc, radius: 0.25, valence: 1 }
        ],
        connections: [
            { from: 0, to: 1, type: 'double' },
            { from: 1, to: 2, type: 'single' },
            { from: 2, to: 3, type: 'double' },
            { from: 3, to: 4, type: 'single' },
            { from: 4, to: 5, type: 'double' },
            { from: 5, to: 0, type: 'single' },
            { from: 0, to: 6, type: 'single' },
            { from: 1, to: 7, type: 'single' },
            { from: 2, to: 8, type: 'single' },
            { from: 3, to: 9, type: 'single' },
            { from: 4, to: 10, type: 'single' },
            { from: 5, to: 11, type: 'single' }
        ]
    }
};
