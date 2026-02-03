// brain.js
import * as THREE from 'three';

export function createBrain() {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const brain = new THREE.Mesh(geometry, material);
    return brain;
}
