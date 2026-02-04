// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createBrain } from './brain.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  init3DBrain(); // Replace initBrainMap with the 3D version
});

/**
 * Handle Dark/Light Mode Toggle
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme == 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.textContent = '☀️';
  } else if (currentTheme == 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleBtn.textContent = '🌙';
  } else if (prefersDarkScheme.matches) {
     document.documentElement.setAttribute('data-theme', 'dark');
     toggleBtn.textContent = '☀️';
  }

  toggleBtn.addEventListener('click', function() {
    let theme = 'light';
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      theme = 'dark';
      toggleBtn.textContent = '☀️';
    } else {
      toggleBtn.textContent = '🌙';
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Dispatch a custom event to notify the 3D brain of the theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  });
}

/**
 * Handle Interactive 3D Brain Map Logic
 */
function init3DBrain() {
    const container = document.getElementById('brain-canvas-container');
    const loaderElement = document.getElementById('loader');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 20;

    // Create and add the brain model
    createBrain(function (brain) {
        scene.add(brain);
        loaderElement.style.display = 'none';

        const brainRegions = {
            'B_parietal_L': { title: 'Left Parietal Lobe', desc: 'The parietal lobe is vital for sensory perception and integration, including the management of taste, hearing, sight, touch, and smell.' },
            'B_parietal_R': { title: 'Right Parietal Lobe', desc: 'The parietal lobe is vital for sensory perception and integration, including the management of taste, hearing, sight, touch, and smell.' },
            'B_frontal_L': { title: 'Left Frontal Lobe', desc: 'The frontal lobe is the home of our cognitive functions, such as emotional expression, problem-solving, memory, language, and judgment.' },
            'B_frontal_R': { title: 'Right Frontal Lobe', desc: 'The frontal lobe is the home of our cognitive functions, such as emotional expression, problem-solving, memory, language, and judgment.' },
            'B_occipital_L': { title: 'Left Occipital Lobe', desc: 'The occipital lobe is the visual processing center of the brain.' },
            'B_occipital_R': { title: 'Right Occipital Lobe', desc: 'The occipital lobe is the visual processing center of the brain.' },
            'B_temporal_L': { title: 'Left Temporal Lobe', desc: 'The temporal lobe is associated with processing auditory information and with the encoding of memory.' },
            'B_temporal_R': { title: 'Right Temporal Lobe', desc: 'The temporal lobe is associated with processing auditory information and with the encoding of memory.' },
            'B_cerebellum_L': { title: 'Left Cerebellum', desc: 'The cerebellum coordinates voluntary movements such as posture, balance, coordination, and speech.' },
            'B_cerebellum_R': { title: 'Right Cerebellum', desc: 'The cerebellum coordinates voluntary movements such as posture, balance, coordination, and speech.' },
        };

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hovered = null;

        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(brain.children, true);

            if (hovered) {
                hovered.object.material.emissive.setHex(hovered.originalHex);
                hovered = null;
            }

            if (intersects.length > 0) {
                const object = intersects[0].object;
                if (object.material) {
                    hovered = {
                        object: object,
                        originalHex: object.material.emissive.getHex()
                    };
                    object.material.emissive.setHex(0xff0000);
                }
            }
        }

        function onClick(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(brain.children, true);

            const infoCard = document.getElementById('brain-info-card');
            const titleEl = document.getElementById('region-title');
            const descEl = document.getElementById('region-desc');

            if (intersects.length > 0) {
                const region = brainRegions[intersects[0].object.name];
                if (region) {
                    titleEl.textContent = region.title;
                    descEl.textContent = region.desc;
                    infoCard.classList.remove('hidden');
                } else {
                    infoCard.classList.add('hidden');
                }
            } else {
                infoCard.classList.add('hidden');
            }
        }

        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('click', onClick, false);
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}



