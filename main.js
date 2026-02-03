// main.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  init3DBrain(); // Replace initBrainMap with the 3D version
  initPsychoTest();
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

    // Raycasting for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let INTERSECTED;

    // --- IMPORTANT ---
    // User needs to download a GLB/GLTF model and place it in the project root.
    // I am using a placeholder path.
    const modelPath = 'https://productioncrate.com/cdn-cgi/mirage/51249b89b8098103c85f6e5b44585c490a6e387c1341c2c31c071d0b36d0716b/1280/3d/HumanAnatomy_Brain_prores.glb'; 
    const loader = new GLTFLoader();

    // Data mapping from assumed mesh names to descriptions
    const brainData = {
        'Frontal_Lobe': { name: 'Frontal Lobe', desc: "The 'CEO' of the brain. Responsible for executive functions like decision-making, planning, problem-solving, and emotional regulation." },
        'Parietal_Lobe': { name: 'Parietal Lobe', desc: 'Processes sensory information (touch, temperature, pain) and is key for spatial awareness and navigation.' },
        'Occipital_Lobe': { name: 'Occipital Lobe', desc: 'The visual processing center. It interprets what your eyes see, including color, form, and motion.' },
        'Temporal_Lobe': { name: 'Temporal Lobe', desc: 'Vital for processing auditory information (hearing) and encoding memory. It also houses the hippocampus.' },
        'Cerebellum': { name: 'Cerebellum', desc: 'Responsible for balance, coordination, and fine motor control. It helps you walk upright and play instruments.' }
    };
    
    const brainRegions = [];

    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        loaderElement.style.display = 'none';

        model.traverse((child) => {
            if (child.isMesh) {
                // A simplified approach: assuming mesh names correspond to our data keys
                const regionKey = Object.keys(brainData).find(key => child.name.includes(key));
                if(regionKey) {
                    child.userData = brainData[regionKey];
                    brainRegions.push(child);
                    // Store original material properties
                    child.material.originalEmissive = child.material.emissive.getHex();
                }
            }
        });
        
    }, undefined, (error) => {
        console.error('An error happened while loading the model:', error);
        loaderElement.textContent = 'Failed to load 3D model. Please ensure the model file is accessible.';
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    // Handle mouse move for highlighting
    container.addEventListener('mousemove', onMouseMove);
    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    // Handle click for showing info card
    container.addEventListener('click', onClick);
    function onClick(event) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(brainRegions);

        if (intersects.length > 0) {
            const infoCard = document.getElementById('brain-info-card');
            const regionTitle = document.getElementById('region-title');
            const regionDesc = document.getElementById('region-desc');

            regionTitle.textContent = intersects[0].object.userData.name;
            regionDesc.textContent = intersects[0].object.userData.desc;
            infoCard.classList.remove('hidden');
        }
    }


    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        // Raycasting logic
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(brainRegions);
        const infoCard = document.getElementById('brain-info-card');

        if (intersects.length > 0) {
            if (INTERSECTED != intersects[0].object) {
                if (INTERSECTED) {
                    INTERSECTED.material.emissive.setHex(INTERSECTED.material.originalEmissive);
                }
                INTERSECTED = intersects[0].object;
                INTERSECTED.material.emissive.setHex(0x00ff00); // Highlight color
                container.style.cursor = 'pointer';
            }
        } else {
            if (INTERSECTED) {
                INTERSECTED.material.emissive.setHex(INTERSECTED.material.originalEmissive);
            }
            INTERSECTED = null;
            container.style.cursor = 'auto';
            if(!event.target.closest('.info-card')){
                 infoCard.classList.add('hidden');
            }
        }

        renderer.render(scene, camera);
    }

    animate();
}


/**
 * Handle Psychology Stress Test Logic
 */
function initPsychoTest() {
  const startBtn = document.getElementById('start-test-btn');
  const introBox = document.getElementById('test-intro');
  const questionBox = document.getElementById('test-question-box');
  const resultBox = document.getElementById('test-result-box');
  
  if (!startBtn) return;

  const questions = [
    "I often feel anxious or worried without a clear reason.",
    "I find it difficult to relax even when I have free time.",
    "I get easily irritated by small things.",
    "I have trouble sleeping due to racing thoughts.",
    "I feel overwhelmed by my daily responsibilities."
  ];

  let currentQuestionIndex = 0;
  let totalScore = 0;

  // Start Test
  startBtn.addEventListener('click', () => {
    introBox.classList.add('hidden');
    startBtn.style.display = 'none'; 
    questionBox.classList.remove('hidden');
    renderQuestion();
  });

  function renderQuestion() {
    const qText = document.getElementById('question-text');
    const qNum = document.getElementById('question-number');
    const qProg = document.getElementById('question-progress');
    const progressBar = document.querySelector('.fill');

    qText.textContent = questions[currentQuestionIndex];
    qNum.textContent = `Q${currentQuestionIndex + 1}`;
    qProg.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
    
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }

  // Handle Answer Click
  const options = document.querySelectorAll('.option-btn');
  options.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const score = parseInt(e.target.getAttribute('data-score'));
      totalScore += score;
      
      currentQuestionIndex++;
      
      if (currentQuestionIndex < questions.length) {
        renderQuestion();
      } else {
        showResult();
      }
    });
  });

  function showResult() {
    questionBox.classList.add('hidden');
    resultBox.classList.remove('hidden');
    document.querySelector('.fill').style.width = '100%';

    const finalScore = (totalScore / (questions.length * 5)) * 100;
    
    const scoreDisplay = document.getElementById('result-score');
    const resultTitle = document.getElementById('result-title');
    const resultDesc = document.getElementById('result-desc');

    scoreDisplay.textContent = Math.round(finalScore);

    if (finalScore <= 20) {
      resultTitle.textContent = "Very Low Stress";
      resultDesc.textContent = "You are in a great mental state! Keep up your healthy lifestyle.";
    } else if (finalScore <= 40) {
      resultTitle.textContent = "Low Stress";
      resultDesc.textContent = "You have things under control. Minor stress is normal.";
    } else if (finalScore <= 60) {
      resultTitle.textContent = "Moderate Stress";
      resultDesc.textContent = "You are feeling some pressure. Try short breaks or breathing exercises.";
    } else if (finalScore <= 80) {
      resultTitle.textContent = "High Stress";
      resultDesc.textContent = "Your stress levels are significant. Consider prioritizing rest today.";
    } else {
      resultTitle.textContent = "Very High Stress";
      resultDesc.textContent = "You seem exhausted. Please seek professional help or take a long break immediately.";
    }
  }
}
