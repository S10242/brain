// main.js

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initBrainMap();
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
  });
}

/**
 * Handle Interactive Brain Map Logic
 */
function initBrainMap() {
  const nodes = document.querySelectorAll('.brain-node');
  const infoCard = document.getElementById('brain-info-card');
  const regionTitle = document.getElementById('region-title');
  const regionDesc = document.getElementById('region-desc');

  if (!infoCard) return; // Guard clause if element doesn't exist

  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      const region = node.getAttribute('data-region');
      const desc = node.getAttribute('data-desc');

      regionTitle.textContent = region;
      regionDesc.textContent = desc;

      infoCard.classList.remove('hidden');

      nodes.forEach(n => n.setAttribute('fill', 'rgba(56, 189, 248, 0.2)')); 
      node.setAttribute('fill', '#38bdf8'); 
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.brain-svg') && !e.target.closest('.info-card')) {
       infoCard.classList.add('hidden');
       nodes.forEach(n => n.setAttribute('fill', 'rgba(56, 189, 248, 0.2)')); 
    }
  });
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
    startBtn.style.display = 'none'; // Hide start button in text area
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

    // Max score is 25 (5 questions * 5 points)
    // Normalized to 100 scale for easier reading
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