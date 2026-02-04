// test.js

document.addEventListener('DOMContentLoaded', () => {
    // A simple router to initialize the correct test based on the page
    if (window.location.pathname.includes('test-color.html')) {
        initColorTest();
    } else if (window.location.pathname.includes('test-personality.html')) {
        initPersonalityTest();
    } else if (window.location.pathname.includes('stress-test.html')) {
        initStressTest();
    }
});

/**
 * Handle Psychology Stress Test Logic
 */
function initStressTest() {
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
    
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
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

/**
 * Handles the Color Psychology Test
 */
function initColorTest() {
    const colorOptions = document.getElementById('color-options');
    const resultBox = document.getElementById('color-result-box');
    if (!colorOptions) return;

    const interpretations = {
        red: {
            title: "Passion & Energy",
            desc: "You are drawn to red, the color of passion, energy, and action. You are likely a determined, ambitious, and competitive individual. You have a deep-seated need for physical fulfillment and a zest for life."
        },
        orange: {
            title: "Creativity & Joy",
            desc: "Choosing orange suggests a vibrant, optimistic, and social personality. You are a natural motivator, full of creative ideas and a desire for human connection. You bring warmth and joy to those around you."
        },
        yellow: {
            title: "Intellect & Optimism",
            desc: "You are attracted to yellow, the color of the mind and intellect. You are a clear and analytical thinker, often with a cheerful and optimistic outlook. You seek logic, order, and new ideas."
        },
        green: {
            title: "Balance & Growth",
            desc: "Green represents balance, harmony, and growth. You are a practical, down-to-earth person who values stability and security. You are often seen as a nurturing and reliable pillar in your community."
        },
        blue: {
            title: "Peace & Trust",
            desc: "Blue, the color of trust, peace, and loyalty, calls to you. You are a trustworthy, dependable, and sincere individual. You seek inner peace and tranquility, and you value deep, meaningful relationships."
        },
        purple: {
            title: "Imagination & Spirituality",
            desc: "Drawn to purple, you are an imaginative, sensitive, and compassionate soul. You have a deep connection to your thoughts and are often interested in spiritual or philosophical matters. You are a unique and creative individual."
        },
        black: {
            title: "Power & Sophistication",
            desc: "Black is the color of power, control, and sophistication. You are a strong-willed, independent, and determined person. You value your privacy and may have a mysterious or formal aura."
        },
        white: {
            title: "Simplicity & Purity",
            desc: "Choosing white suggests a desire for simplicity, purity, and new beginnings. You are neat and orderly in your ways, and you approach life with clarity and optimism. You are clearing a path for a fresh start."
        }
    };

    colorOptions.addEventListener('click', (e) => {
        if (e.target.matches('.color-btn')) {
            const selectedColor = e.target.getAttribute('data-color');
            const result = interpretations[selectedColor];

            resultBox.querySelector('#result-title').textContent = result.title;
            resultBox.querySelector('#result-desc').textContent = result.desc;
            
            colorOptions.classList.add('hidden');
            resultBox.classList.remove('hidden');
        }
    });
}


/**
 * Handles the Mini Personality Test (Big Five)
 */
function initPersonalityTest() {
    const questionBox = document.getElementById('test-question-box');
    const resultBox = document.getElementById('personality-result-box');
    const optionButtons = questionBox.querySelectorAll('.option-btn');
    if (!questionBox) return;

    const questions = [
        { text: "I see myself as someone who is outgoing and sociable.", trait: "E" },
        { text: "I tend to be critical of others; I find faults easily.", trait: "A", reverse: true }, // Agreeing is low-Agreeableness
        { text: "I am a reliable worker; I get things done efficiently.", trait: "C" },
        { text: "I often feel anxious, sad, or emotionally unstable.", trait: "N" },
        { text: "I am curious about many different things and love new experiences.", trait: "O" }
    ];

    const traits = {
        O: { score: 0, name: "Openness to Experience", desc: "You are imaginative, curious, and open to new ideas. You enjoy variety and intellectual stimulation." },
        C: { score: 0, name: "Conscientiousness", desc: "You are organized, responsible, and dependable. You have a strong sense of duty and are goal-oriented." },
        E: { score: 0, name: "Extraversion", desc: "You are outgoing, energetic, and sociable. You draw energy from being around other people." },
        A: { score: 0, name: "Agreeableness", desc: "You are compassionate, cooperative, and considerate. You tend to be trusting and helpful." },
        N: { score: 0, name: "Neuroticism", desc: "You are prone to experiencing negative emotions like anxiety, anger, and sadness. You may be more emotionally reactive." }
    };
    
    // Simple scoring: each question corresponds to one trait. The answer just adds a point.
    // A real test would be more nuanced.
    const scoring = {
        "Strongly Agree": 5,
        "Agree": 4,
        "Neutral": 3,
        "Disagree": 2,
        "Strongly Disagree": 1
    }

    let currentQuestionIndex = 0;

    function renderQuestion() {
        const question = questions[currentQuestionIndex];
        questionBox.querySelector('#question-text').textContent = question.text;
        questionBox.querySelector('#question-number').textContent = `Q${currentQuestionIndex + 1}`;
        questionBox.querySelector('#question-progress').textContent = `${currentQuestionIndex + 1}/${questions.length}`;
        const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
        questionBox.querySelector('.fill').style.width = `${progressPercent}%`;

        // Assign scores to buttons
        optionButtons.forEach(btn => {
            const answer = btn.textContent;
            let score = scoring[answer];
            if(question.reverse) {
                score = 6 - score;
            }
            btn.setAttribute('data-trait', question.trait);
            btn.setAttribute('data-score', score);
        });
    }

    optionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const trait = e.target.getAttribute('data-trait');
            const score = parseInt(e.target.getAttribute('data-score'));
            traits[trait].score += score;
            
            currentQuestionIndex++;

            if (currentQuestionIndex < questions.length) {
                renderQuestion();
            } else {
                showResult();
            }
        });
    });

    function showResult() {
        // Determine the dominant trait
        let dominantTrait = 'O';
        let maxScore = 0;
        for (const trait in traits) {
            if (traits[trait].score > maxScore) {
                maxScore = traits[trait].score;
                dominantTrait = trait;
            }
        }

        const result = traits[dominantTrait];
        resultBox.querySelector('#result-title').textContent = `Your dominant trait is: ${result.name}`;
        resultBox.querySelector('#result-desc').textContent = result.desc;
        
        questionBox.classList.add('hidden');
        resultBox.classList.remove('hidden');
    }

    renderQuestion();
}