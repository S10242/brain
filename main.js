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
    const brain = createBrain();
    scene.add(brain);
    loaderElement.style.display = 'none';

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



