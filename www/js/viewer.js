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

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(5, 5, 5);
        this.scene.add(dirLight);

        this.currentMoleculeKey = 'H2O';
        this.mode = 'viewer'; 
        this.selectedBondType = 'single';
        this.atomMeshes = [];
        this.bondMeshes = [];
        this.selectedAtom = null;
        this.userConnections = [];
        this.history = [];

        this.initEvents();
        this.loadMolecule(this.currentMoleculeKey);
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    loadMolecule(key) {
        this.currentMoleculeKey = key;
        this.molData = JSON.parse(JSON.stringify(moleculesData[key]));
        this.clearScene();
        this.userConnections = [];
        this.history = [];

        if (this.mode === 'puzzle') {
            this.molData.atoms.forEach(atom => {
                atom.x += (Math.random() - 0.5) * 2.5;
                atom.y += (Math.random() - 0.5) * 2.5;
                atom.z += (Math.random() - 0.5) * 1.5;
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
            const mat = new THREE.MeshStandardMaterial({ color: atom.color, roughness: 0.3 });
            const mesh = new THREE.Mesh(sphereGeo, mat);
            mesh.scale.set(atom.radius, atom.radius, atom.radius);
            mesh.position.set(atom.x, atom.y, atom.z);
            mesh.userData = { id: atom.id, element: atom.element, index: index, valence: atom.valence };
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

        if (type === 'double') {
            const offset = 0.08;
            [-offset, offset].forEach(dx => {
                const cylGeo = new THREE.CylinderGeometry(0.04, 0.04, distance, 8);
                const mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
                const cylinder = new THREE.Mesh(cylGeo, mat);
                cylinder.position.copy(posA).add(posB).multiplyScalar(0.5);
                cylinder.position.x += dx;
                cylinder.lookAt(posB);
                cylinder.rotateX(Math.PI / 2);
                this.scene.add(cylinder);
                this.bondMeshes.push(cylinder);
            });
        } else {
            const cylGeo = new THREE.CylinderGeometry(0.07, 0.07, distance, 8);
            const mat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1 });
            const cylinder = new THREE.Mesh(cylGeo, mat);
            cylinder.position.copy(posA).add(posB).multiplyScalar(0.5);
            cylinder.lookAt(posB);
            cylinder.rotateX(Math.PI / 2);
            this.scene.add(cylinder);
            this.bondMeshes.push(cylinder);
        }
    }

    setMode(mode) {
        this.mode = mode;
        this.loadMolecule(this.currentMoleculeKey);
    }

    toggleBondType() {
        this.selectedBondType = this.selectedBondType === 'single' ? 'double' : 'single';
        return this.selectedBondType;
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
                    const atom = this.molData.atoms.find(a => a.id === atomId);
                    if (typeof window.onAtomSelected === 'function') {
                        window.onAtomSelected(atom);
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
            this.history.push(JSON.parse(JSON.stringify(this.userConnections)));
            this.userConnections.push({ from: this.selectedAtom, to: atomId, type: this.selectedBondType });
            this.createBondMesh(this.selectedAtom, atomId, this.selectedBondType);
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
            mesh.material.emissive.setHex(highlight ? 0x22c55e : 0x000000);
        }
    }

    validatePuzzle() {
        const required = this.molData.connections;
        
        if (this.userConnections.length < required.length) {
            return { success: false, message: `Te faltan enlaces. Has realizado ${this.userConnections.length} de ${required.length}.` };
        }

        // Validación de Valencias
        const valenceMap = {};
        this.molData.atoms.forEach(a => valenceMap[a.id] = { max: a.valence, used: 0, element: a.element });

        for (let uc of this.userConnections) {
            const weight = uc.type === 'double' ? 2 : 1;
            if (valenceMap[uc.from]) valenceMap[uc.from].used += weight;
            if (valenceMap[uc.to]) valenceMap[uc.to].used += weight;
        }

        for (let id in valenceMap) {
            const v = valenceMap[id];
            if (v.used > v.max) {
                return { 
                    success: false, 
                    message: `Exceso de valencia: El átomo de ${v.element} permite máximo ${v.max} enlace(s) y le asignaste ${v.used}.` 
                };
            }
        }

        for (let req of required) {
            const exists = this.userConnections.some(uc => 
                ((uc.from === req.from && uc.to === req.to) || (uc.from === req.to && uc.to === req.from)) && uc.type === req.type
            );
            if (!exists) {
                return { 
                    success: false, 
                    message: `Estructura incorrecta: Revisa las conexiones entre átomos y asegúrate de usar enlaces ${req.type === 'double' ? 'dobles' : 'simples'} según la geometría.` 
                };
            }
        }

        return { success: true, message: '¡Perfecto! Has construido la molécula con valencias y enlaces correctos.' };
    }

    undo() {
        if (this.history.length > 0) {
            this.userConnections = this.history.pop();
            this.bondMeshes.forEach(m => this.scene.remove(m));
            this.bondMeshes = [];
            this.userConnections.forEach(uc => this.createBondMesh(uc.from, uc.to, uc.type));
            if (typeof window.onPuzzleProgress === 'function') {
                window.onPuzzleProgress(this.userConnections.length, this.molData.connections.length);
            }
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
            const a1 = this.molData.atoms.find(a => a.id === missing.from);
            const a2 = this.molData.atoms.find(a => a.id === missing.to);
            return `Pista: Une un átomo de ${a1.element} con uno de ${a2.element} mediante enlace ${missing.type === 'double' ? 'doble' : 'simple'}.`;
        }
        return '¡Ya realizaste la cantidad de conexiones esperada! Presiona Validar.';
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.scene.rotation.y += 0.003;
        this.renderer.render(this.scene, this.camera);
    }
}
