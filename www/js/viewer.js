import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { moleculesData } from './molecules.js';

export class MoleculeViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        // Luces optimizadas para móviles
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 5, 5);
        this.scene.add(dirLight);

        this.currentMoleculeKey = 'H2O';
        this.mode = 'viewer'; // 'viewer' o 'puzzle'
        this.atomMeshes = [];
        this.bondMeshes = [];
        this.selectedAtom = null;
        this.userConnections = [];
        this.history = [];

        this.initEvents();
        this.loadMolecule(this.currentMoleculeKey);
        this.animate();
    }

    loadMolecule(key) {
        this.currentMoleculeKey = key;
        this.molData = JSON.parse(JSON.stringify(moleculesData[key]));
        this.clearScene();
        this.userConnections = [];
        this.history = [];

        if (this.mode === 'puzzle') {
            // Desordenar átomos ligeramente para el puzzle
            this.molData.atoms.forEach(atom => {
                atom.x += (Math.random() - 0.5) * 2;
                atom.y += (Math.random() - 0.5) * 2;
                atom.z += (Math.random() - 0.5) * 2;
            });
        }

        this.buildScene();
        if (typeof window.onMoleculeLoaded === 'function') {
            window.onMoleculeLoaded(this.molData);
        }
    }

    clearScene() {
        this.atomMeshes.forEach(m => this.scene.remove(m));
        this.bondMeshes.forEach(m => this.scene.remove(m));
        this.atomMeshes = [];
        this.bondMeshes = [];
        this.selectedAtom = null;
    }

    buildScene() {
        const sphereGeo = new THREE.SphereGeometry(1, 16, 16);

        this.molData.atoms.forEach((atom, index) => {
            const mat = new THREE.MeshStandardMaterial({ color: atom.color, roughness.val: 0.3 });
            const mesh = new THREE.Mesh(sphereGeo, mat);
            mesh.scale.set(atom.radius, atom.radius, atom.radius);
            mesh.position.set(atom.x, atom.y, atom.z);
            mesh.userData = { id: atom.id, element: atom.element, index: index };
            this.scene.add(mesh);
            this.atomMeshes.push(mesh);
        });

        if (this.mode === 'viewer') {
            this.molData.connections.forEach(conn => {
                this.createBondMesh(conn.from, conn.to, conn.type);
            });
        }
    }

    createBondMesh(fromId, toId, type) {
        const atomA = this.molData.atoms.find(a => a.id === fromId);
        const atomB = this.molData.atoms.find(a => a.id === toId);
        if (!atomA || !atomB) return;

        const posA = new THREE.Vector3(atomA.x, atomA.y, atomA.z);
        const posB = new THREE.Vector3(atomB.x, atomB.y, atomB.z);
        const distance = posA.distanceTo(posB);

        const cylGeo = new THREE.CylinderGeometry(type === 'double' ? 0.08 : 0.12, type === 'double' ? 0.08 : 0.12, distance, 8);
        const mat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const cylinder = new THREE.Mesh(cylGeo, mat);

        cylinder.position.copy(posA).add(posB).multiplyScalar(0.5);
        cylinder.lookAt(posB);
        cylinder.rotateX(Math.PI / 2);

        this.scene.add(cylinder);
        this.bondMeshes.push(cylinder);
    }

    setMode(mode) {
        this.mode = mode;
        this.loadMolecule(this.currentMoleculeKey);
    }

    initEvents() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        this.container.addEventListener('click', (event) => {
            const rect = this.container.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.atomMeshes);

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object;
                const atomId = clickedMesh.userData.id;

                if (this.mode === 'viewer') {
                    if (typeof window.onAtomSelected === 'function') {
                        window.onAtomSelected(this.molData.atoms.find(a => a.id === atomId));
                    }
                } else if (this.mode === 'puzzle') {
                    this.handlePuzzleClick(atomId);
                }
            }
        });
    }

    handlePuzzleClick(atomId) {
        if (this.selectedAtom === null) {
            this.selectedAtom = atomId;
            this.highlightAtom(atomId, true);
        } else if (this.selectedAtom === atomId) {
            this.highlightAtom(atomId, false);
            this.selectedAtom = null;
        } else {
            // Conectar átomos
            this.history.push([...this.userConnections]);
            this.userConnections.push({ from: this.selectedAtom, to: atomId, type: 'single' });
            this.createBondMesh(this.selectedAtom, atomId, 'single');
            this.highlightAtom(this.selectedAtom, false);
            this.selectedAtom = null;
            
            if (typeof window.onPuzzleProgress === 'function') {
                window.onPuzzleProgress(this.userConnections.length, this.molData.connections.length);
            }
        }
    }

    highlightAtom(atomId, highlight) {
        const mesh = this.atomMeshes.find(m => m.userData.id === atomId);
        if (mesh) {
            mesh.material.emissive.setHex(highlight ? 0x00ff00 : 0x000000);
        }
    }

    validatePuzzle() {
        const required = this.molData.connections;
        if (this.userConnections.length < required.length) {
            return { success: false, message: 'Faltan conexiones por realizar en la molécula.' };
        }

        // Validación básica de enlaces correctos
        for (let req of required) {
            const exists = this.userConnections.some(uc => 
                (uc.from === req.from && uc.to === req.to) || (uc.from === req.to && uc.to === req.from)
            );
            if (!exists) {
                return { 
                    success: false, 
                    message: `Error de geometría o enlace: El átomo ${req.from} y el átomo ${req.to} requieren un enlace correcto según la valencia.` 
                };
            }
        }

        return { success: true, message: '¡Excelente! Puzzle completado correctamente con la geometría y valencias adecuadas.' };
    }

    undo() {
        if (this.history.length > 0) {
            this.userConnections = this.history.pop();
            // Recargar escena para limpiar enlaces sobrantes
            this.clearScene();
            this.buildScene();
            // Redibujar conexiones actuales
            this.userConnections.forEach(uc => this.createBondMesh(uc.from, uc.to, uc.type));
        }
    }

    resetPuzzle() {
        this.loadMolecule(this.currentMoleculeKey);
    }

    getHint() {
        const missing = this.molData.connections.find(rc => 
            !this.userConnections.some(uc => (uc.from === rc.from && uc.to === rc.to) || (uc.from === rc.to && uc.to === rc.from))
        );
        if (missing) {
            return `Pista: Intenta conectar el átomo con ID ${missing.from} con el átomo con ID ${missing.to}.`;
        }
        return '¡Todas las conexiones principales están listas!';
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.scene.rotation.y += 0.005;
        this.renderer.render(this.scene, this.camera);
    }
}
