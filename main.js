// main.js

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initBrainMap();
});

/**
 * Handle Dark/Light Mode Toggle
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved user preference, if any, on load
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme == 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.textContent = '☀️';
  } else if (currentTheme == 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleBtn.textContent = '🌙';
  } else if (prefersDarkScheme.matches) {
     // If no preference, respect OS preference
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

  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      // Get data from attributes
      const region = node.getAttribute('data-region');
      const desc = node.getAttribute('data-desc');

      // Update card content
      regionTitle.textContent = region;
      regionDesc.textContent = desc;

      // Show card
      infoCard.classList.remove('hidden');

      // visual feedback
      nodes.forEach(n => n.setAttribute('fill', 'rgba(56, 189, 248, 0.5)')); // Dim others
      node.setAttribute('fill', '#38bdf8'); // Highlight selected
    });
  });

  // Hide card when clicking outside (optional refinement)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.brain-svg') && !e.target.closest('.info-card')) {
       infoCard.classList.add('hidden');
       nodes.forEach(n => n.setAttribute('fill', 'rgba(56, 189, 248, 0.5)')); // Reset
    }
  });
}
