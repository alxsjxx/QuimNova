import { MoleculeViewer } from './viewer.js';

document.addEventListener('DOMContentLoaded', () => {
    const viewer = new MoleculeViewer('canvas-container');

    const btnView = document.getElementById('btn-mode-view');
    const btnPuzzle = document.getElementById('btn-mode-puzzle');
    const puzzleControls = document.getElementById('puzzle-controls');
    const infoCard = document.getElementById('info-card');
    const toast = document.getElementById('toast-msg');
    const winModal = document.getElementById('win-modal');

    // Cambiar de modo
    btnView.addEventListener('click', () => {
        btnView.classList.add('active');
        btnPuzzle.classList.remove('active');
        puzzleControls.classList.remove('visible');
        infoCard.style.display = 'block';
        viewer.setMode('viewer');
    });

    btnPuzzle.addEventListener('click', () => {
        btnPuzzle.classList.add('active');
        btnView.classList.remove('active');
        puzzleControls.classList.add('visible');
        infoCard.style.display = 'none';
        viewer.setMode('puzzle');
        showToast('Toca 2 átomos para unirlos');
    });

    // Cambio de moléculas
    document.querySelectorAll('.mol-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mol-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const key = e.target.getAttribute('data-mol');
            viewer.loadMolecule(key);
        });
    });

    // Controles de puzzle
    document.getElementById('btn-bond-type').addEventListener('click', (e) => {
        const type = viewer.toggleBondType();
        e.target.textContent = `Tipo: ${type === 'single' ? 'Simple' : 'Doble'}`;
    });

    document.getElementById('btn-undo').addEventListener('click', () => viewer.undo());
    document.getElementById('btn-reset').addEventListener('click', () => viewer.resetPuzzle());
    document.getElementById('btn-hint').addEventListener('click', () => {
        showToast(viewer.getHint());
    });

    document.getElementById('btn-validate').addEventListener('click', () => {
        const res = viewer.validatePuzzle();
        showToast(res.message);
        if (res.success) {
            winModal.style.display = 'flex';
        }
    });

    document.getElementById('btn-next-mol').addEventListener('click', () => {
        winModal.style.display = 'none';
    });

    // Callbacks globales
    window.onMoleculeLoaded = (mol) => {
        document.getElementById('mol-name').textContent = mol.name;
        document.getElementById('mol-formula').textContent = mol.formula;
        document.getElementById('mol-mass').textContent = mol.mass;
        document.getElementById('mol-geo').textContent = mol.geometry;
        document.getElementById('mol-angles').textContent = mol.angles;
        document.getElementById('mol-bonds').textContent = mol.bonds;
        document.getElementById('mol-props').innerHTML = `<strong>Propiedades:</strong> ${mol.properties}`;
        document.getElementById('mol-uses').innerHTML = `<strong>Usos:</strong> ${mol.uses}`;

        window.onPuzzleProgress(0, mol.connections.length);
    };

    window.onAtomSelected = (atom) => {
        showToast(`Átomo de ${atom.element} (Valencia: ${atom.valence})`);
    };

    window.onPuzzleProgress = (current, total) => {
        document.getElementById('progress-text').textContent = `${current} / ${total}`;
    };

    function showToast(msg) {
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3500);
    }
});
