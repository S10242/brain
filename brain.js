// brain.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createBrain(onLoad) {
    const loader = new GLTFLoader();
    loader.load(
        'https://raw.githubusercontent.com/VyomGarg47/Sample-GLTF-Models/main/Brain/Brain.gltf',
        function (gltf) {
            const brain = gltf.scene;
            // Optional: Adjust model's scale, position, rotation
            brain.scale.set(5, 5, 5);
            brain.position.y = -2;
            onLoad(brain);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}