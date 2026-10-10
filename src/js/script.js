/* ==========================================================================
   LINGOPULSE - CORE APPLICATION ENGINE
   ========================================================================== */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type, duration) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  }

  playClick() { this.playTone(400, 'sine', 0.08); }
  playCorrect() {
    this.playTone(523.25, 'triangle', 0.12);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.15), 100);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25), 200);
  }
  playIncorrect() {
    this.playTone(220, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.25), 120);
  }
  playLevelUp() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'triangle', 0.2), i * 120);
    });
  }
}

class SpeechEngine {
  speak(text, lang = 'en-US') {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }
}

// Global App State
const AppState = {
  user: {
    xp: 1240,
    streak: 3,
    gems: 450,
    hearts: 5,
    maxHearts: 5,
    level: 1,
    currentCourse: 'en',
    currentUnit: 1,
    completedNodes: ['u1_n1', 'u1_n2'],
    nodeStars: { 'u1_n1': 3, 'u1_n2': 2 }
  },

  quests: [
    { id: 'q1', title: 'Aprende 2 Lecciones', target: 2, current: 1, reward: 50, claimed: false, icon: '📖' },
    { id: 'q2', title: 'Consigue 50 XP', target: 50, current: 30, reward: 30, claimed: false, icon: '⚡' },
    { id: 'q3', title: 'Mantén la Racha', target: 1, current: 1, reward: 20, claimed: true, icon: '🔥' }
  ],

  leaderboard: [
    { rank: 1, name: 'Sofia V.', xp: 2890, avatar: '🦊', isUser: false },
    { rank: 2, name: 'Carlos M.', xp: 2100, avatar: '🐼', isUser: false },
    { rank: 3, name: 'Tú (Estudiante)', xp: 1240, avatar: '🦉', isUser: true },
    { rank: 4, name: 'Elena R.', xp: 1150, avatar: '🐱', isUser: false },
    { rank: 5, name: 'Lucas G.', xp: 980, avatar: '🐯', isUser: false }
  ],

  courses: {
    en: {
      name: 'Inglés',
      flag: '🇬🇧',
      speechLang: 'en-US',
      units: {
        1: {
          title: 'Fundamentos Esenciales',
          desc: 'Saludos, vocabulario básico y expresiones cotidianas.',
          nodes: [
            { id: 'u1_n1', title: 'Saludos', icon: '👋', type: 'choice' },
            { id: 'u1_n2', title: 'Comida', icon: '🍎', type: 'match' },
            { id: 'u1_n3', title: 'Frases', icon: '💬', type: 'sentence' },
            { id: 'u1_n4', title: 'Escucha', icon: '🎧', type: 'audio' }
          ]
        },
        2: {
          title: 'Rutina Diaria & Viajes',
          desc: 'Aprende a moverte por la ciudad y pedir en restaurantes.',
          nodes: [
            { id: 'u2_n1', title: 'Transporte', icon: '🚗', type: 'choice' },
            { id: 'u2_n2', title: 'Hotel', icon: '🏨', type: 'sentence' },
            { id: 'u2_n3', title: 'Direcciones', icon: '🗺️', type: 'match' }
          ]
        },
        3: {
          title: 'Dominio Avanzado',
          desc: 'Conversaciones profundas y vocabulario profesional.',
          nodes: [
            { id: 'u3_n1', title: 'Negocios', icon: '💼', type: 'sentence' },
            { id: 'u3_n2', title: 'Cultura', icon: '🎨', type: 'choice' }
          ]
        }
      }
    },
    es: {
      name: 'Español',
      flag: '🇪🇸',
      speechLang: 'es-ES',
      units: {
        1: {
          title: 'Básicos del Español',
          desc: 'Aprende lo fundamental para comunicarte.',
          nodes: [
            { id: 'u1_n1', title: 'Inicio', icon: '🌟', type: 'choice' },
            { id: 'u1_n2', title: 'Objetos', icon: '📦', type: 'match' }
          ]
        }
      }
    }
  },

  lessons: {
    'u1_n1': [
      {
        type: 'choice',
        question: '¿Cómo se dice "Hola"?',
        options: [
          { text: 'Hello', icon: '👋', correct: true },
          { text: 'Goodbye', icon: '👋', correct: false },
          { text: 'Thank you', icon: '🙏', correct: false },
          { text: 'Please', icon: '✨', correct: false }
        ]
      },
      {
        type: 'sentence',
        question: 'Traduce esta frase:',
        prompt: 'Hola, ¿cómo estás?',
        words: ['Hello,', 'how', 'are', 'you?', 'Goodbye', 'where', 'is'],
        correctAnswer: ['Hello,', 'how', 'are', 'you?']
      }
    ],
    'u1_n2': [
      {
        type: 'match',
        question: 'Conecta los pares de palabras:',
        pairs: [
          { left: 'Apple', right: 'Manzana' },
          { left: 'Water', right: 'Agua' },
          { left: 'Bread', right: 'Pan' },
          { left: 'Milk', right: 'Leche' }
        ]
      }
    ],
    'u1_n3': [
      {
        type: 'sentence',
        question: 'Construye la oración correcta:',
        prompt: 'Un café, por favor',
        words: ['A', 'coffee,', 'please', 'water', 'tea'],
        correctAnswer: ['A', 'coffee,', 'please']
      }
    ],
    'u1_n4': [
      {
        type: 'audio',
        question: 'Escucha y selecciona lo que oyes:',
        textToSpeak: 'Good morning, my friend!',
        options: [
          { text: 'Good morning, my friend!', correct: true },
          { text: 'Good night, my friend!', correct: false },
          { text: 'See you tomorrow!', correct: false }
        ]
      }
    ]
  }
};

// Application Modules
const audio = new AudioSynthesizer();
const speech = new SpeechEngine();

class AppUI {
  static init() {
    this.loadStorage();
    this.bindEvents();
    this.renderAll();
  }

  static loadStorage() {
    const saved = localStorage.getItem('lingopulse_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(AppState.user, parsed.user);
      } catch (e) {
        console.error(e);
      }
    }
  }

  static saveStorage() {
    localStorage.setItem('lingopulse_state', JSON.stringify({ user: AppState.user }));
  }

  static bindEvents() {
    // Navigation Panel Switcher
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        audio.playClick();
        const target = btn.dataset.target;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(target).classList.remove('hidden');
      });
    });

    // Course Selector Toggle
    const courseBtn = document.getElementById('courseSelectorBtn');
    const courseDropdown = document.getElementById('courseDropdown');
    courseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playClick();
      courseDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      courseDropdown.classList.add('hidden');
    });

    document.querySelectorAll('.course-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.dataset.lang;
        if (AppState.courses[lang]) {
          AppState.user.currentCourse = lang;
          AppState.user.currentUnit = 1;
          this.renderAll();
          this.saveStorage();
        }
      });
    });

    // Unit Tab Selector
    document.querySelectorAll('.unit-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        audio.playClick();
        document.querySelectorAll('.unit-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        AppState.user.currentUnit = parseInt(tab.dataset.unit);
        this.renderPathTree();
      });
    });

    // Shop Purchasing
    document.getElementById('buyHeartsBtn').addEventListener('click', () => this.buyShopItem('hearts', 100));
    document.getElementById('buyFreezeBtn').addEventListener('click', () => this.buyShopItem('freeze', 200));
    document.getElementById('buyBoostBtn').addEventListener('click', () => this.buyShopItem('boost', 150));

    // Lesson Modal Controls
    document.getElementById('closeLessonBtn').addEventListener('click', () => {
      audio.playClick();
      LessonEngine.closeModal();
    });
  }

  static renderAll() {
    this.renderTopNav();
    this.renderPathTree();
    this.renderQuests();
    this.renderLeaderboard();
    this.renderProfile();
  }

  static renderTopNav() {
    const c = AppState.courses[AppState.user.currentCourse] || AppState.courses.en;
    document.getElementById('currentFlag').textContent = c.flag;
    document.getElementById('currentCourseName').textContent = c.name;

    document.getElementById('streakCount').textContent = AppState.user.streak;
    document.getElementById('gemCount').textContent = AppState.user.gems;
    document.getElementById('heartCount').textContent = AppState.user.hearts;
    document.getElementById('userLevelNum').textContent = AppState.user.level;

    // Sidebar Level Progress
    const xpForNext = AppState.user.level * 100;
    const currentXpInLevel = AppState.user.xp % 100;
    const fillPercent = Math.min(100, Math.floor((currentXpInLevel / 100) * 100));
    
    document.getElementById('sidebarLevelText').textContent = `Nivel ${AppState.user.level}`;
    document.getElementById('levelProgressFill').style.width = `${fillPercent}%`;
    document.getElementById('xpNextText').textContent = `${currentXpInLevel} / 100 XP`;
  }

  static renderPathTree() {
    const course = AppState.courses[AppState.user.currentCourse] || AppState.courses.en;
    const unit = course.units[AppState.user.currentUnit] || course.units[1];

    document.getElementById('unitNumber').textContent = `UNIDAD ${AppState.user.currentUnit}`;
    document.getElementById('unitTitle').textContent = unit.title;
    document.getElementById('unitDesc').textContent = unit.desc;

    const treeContainer = document.getElementById('pathTree');
    treeContainer.innerHTML = '';

    unit.nodes.forEach((node, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'node-wrapper';

      const isCompleted = AppState.user.completedNodes.includes(node.id);
      const isCurrent = !isCompleted && (index === 0 || AppState.user.completedNodes.includes(unit.nodes[index - 1]?.id));

      const btn = document.createElement('button');
      btn.className = `node-btn ${isCompleted ? 'completed' : isCurrent ? 'active' : 'locked'}`;

      if (isCompleted) {
        btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
      } else if (isCurrent) {
        btn.innerHTML = node.icon;
      } else {
        btn.innerHTML = `<i class="fa-solid fa-lock"></i>`;
      }

      if (isCompleted) {
        const stars = document.createElement('div');
        stars.className = 'node-stars';
        const starCount = AppState.user.nodeStars[node.id] || 3;
        stars.innerHTML = '★'.repeat(starCount) + '☆'.repeat(3 - starCount);
        wrapper.appendChild(stars);
      }

      const label = document.createElement('span');
      label.className = 'node-label';
      label.textContent = node.title;

      btn.addEventListener('click', () => {
        if (!btn.classList.contains('locked')) {
          audio.playClick();
          LessonEngine.startLesson(node.id);
        } else {
          audio.playIncorrect();
        }
      });

      wrapper.appendChild(btn);
      wrapper.appendChild(label);
      treeContainer.appendChild(wrapper);
    });
  }

  static renderQuests() {
    const list = document.getElementById('questsList');
    list.innerHTML = '';

    AppState.quests.forEach(q => {
      const card = document.createElement('div');
      card.className = 'quest-card';
      const pct = Math.min(100, Math.floor((q.current / q.target) * 100));

      card.innerHTML = `
        <div class="quest-icon">${q.icon}</div>
        <div class="quest-details">
          <h3>${q.title}</h3>
          <p>${q.current} / ${q.target} completado</p>
          <div class="quest-progress-bar">
            <div class="quest-progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>
        <button class="btn-3d ${q.claimed ? 'btn-secondary' : 'btn-primary'}" ${q.claimed || q.current < q.target ? 'disabled' : ''}>
          ${q.claimed ? 'Cobrado' : `💎 +${q.reward}`}
        </button>
      `;

      const btn = card.querySelector('button');
      if (!q.claimed && q.current >= q.target) {
        btn.addEventListener('click', () => {
          q.claimed = true;
          AppState.user.gems += q.reward;
          audio.playLevelUp();
          this.renderAll();
          this.saveStorage();
        });
      }

      list.appendChild(card);
    });
  }

  static renderLeaderboard() {
    const list = document.getElementById('leaderboardList');
    list.innerHTML = '';

    AppState.leaderboard.forEach(row => {
      const div = document.createElement('div');
      div.className = `leader-row ${row.isUser ? 'user-row' : ''}`;
      const topClass = row.rank === 1 ? 'top-1' : row.rank === 2 ? 'top-2' : row.rank === 3 ? 'top-3' : '';

      div.innerHTML = `
        <span class="rank-num ${topClass}">#${row.rank}</span>
        <div class="leader-avatar">${row.avatar}</div>
        <span class="leader-name">${row.name}</span>
        <span class="leader-xp">⚡ ${row.xp} XP</span>
      `;
      list.appendChild(div);
    });
  }

  static renderProfile() {
    document.getElementById('totalXpCount').textContent = AppState.user.xp;
    document.getElementById('profileStreak').textContent = AppState.user.streak;
    document.getElementById('profileLevelDisplay').textContent = `Nivel ${AppState.user.level}`;

    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = `
      <div class="achievement-card ${AppState.user.xp >= 100 ? 'unlocked' : ''}">
        <span class="achievement-badge">🔥</span>
        <div class="achievement-info">
          <h4>En Racha</h4>
          <p>Supera las 100 XP totales</p>
        </div>
      </div>
      <div class="achievement-card ${AppState.user.completedNodes.length >= 2 ? 'unlocked' : ''}">
        <span class="achievement-badge">🎯</span>
        <div class="achievement-info">
          <h4>Mente Brillante</h4>
          <p>Completa 2 lecciones perfectas</p>
        </div>
      </div>
    `;
  }

  static buyShopItem(item, cost) {
    if (AppState.user.gems >= cost) {
      audio.playLevelUp();
      AppState.user.gems -= cost;
      if (item === 'hearts') AppState.user.hearts = AppState.user.maxHearts;
      this.renderAll();
      this.saveStorage();
      alert('¡Compra realizada con éxito!');
    } else {
      audio.playIncorrect();
      alert('No tienes suficientes gemas.');
    }
  }
}

// Interactive Lesson Controller
class LessonEngine {
  static currentQuestions = [];
  static currentIndex = 0;
  static selectedAnswer = null;
  static currentNodeId = null;

  static startLesson(nodeId) {
    this.currentNodeId = nodeId;
    this.currentQuestions = AppState.lessons[nodeId] || AppState.lessons['u1_n1'];
    this.currentIndex = 0;
    this.selectedAnswer = null;

    document.getElementById('lessonModal').classList.remove('hidden');
    this.renderQuestion();
  }

  static closeModal() {
    document.getElementById('lessonModal').classList.add('hidden');
  }

  static renderQuestion() {
    const q = this.currentQuestions[this.currentIndex];
    const body = document.getElementById('lessonBody');
    const footerBtn = document.getElementById('actionBtn');
    const banner = document.getElementById('feedbackBanner');

    banner.classList.add('hidden');
    footerBtn.disabled = true;
    footerBtn.textContent = 'COMPROBAR';
    this.selectedAnswer = null;

    // Progress
    const pct = Math.floor((this.currentIndex / this.currentQuestions.length) * 100);
    document.getElementById('lessonProgressBar').style.width = `${pct}%`;
    document.getElementById('lessonHeartCount').textContent = AppState.user.hearts;

    if (q.type === 'choice') {
      body.innerHTML = `
        <h2 class="question-title">${q.question}</h2>
        <div class="options-grid">
          ${q.options.map((opt, i) => `
            <div class="option-card" data-index="${i}">
              <span class="option-icon">${opt.icon}</span>
              <span class="option-text">${opt.text}</span>
            </div>
          `).join('')}
        </div>
      `;

      body.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
          audio.playClick();
          body.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.selectedAnswer = parseInt(card.dataset.index);
          footerBtn.disabled = false;
        });
      });
    } else if (q.type === 'sentence') {
      body.innerHTML = `
        <h2 class="question-title">${q.question}</h2>
        <div class="prompt-box">
          <button class="speaker-btn" id="listenPromptBtn"><i class="fa-solid fa-volume-high"></i></button>
          <span>"${q.prompt}"</span>
        </div>
        <div class="sentence-target" id="sentenceTarget"></div>
        <div class="word-bank" id="wordBank">
          ${q.words.map((w, i) => `<button class="word-pill" data-word="${w}" data-id="${i}">${w}</button>`).join('')}
        </div>
      `;

      document.getElementById('listenPromptBtn').addEventListener('click', () => {
        speech.speak(q.prompt, 'es-ES');
      });

      const selectedWords = [];
      const target = document.getElementById('sentenceTarget');

      body.querySelectorAll('.word-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          audio.playClick();
          pill.classList.add('used');
          
          const newPill = document.createElement('button');
          newPill.className = 'word-pill';
          newPill.textContent = pill.dataset.word;
          
          newPill.addEventListener('click', () => {
            audio.playClick();
            newPill.remove();
            pill.classList.remove('used');
            const idx = selectedWords.indexOf(pill.dataset.word);
            if (idx > -1) selectedWords.splice(idx, 1);
            footerBtn.disabled = selectedWords.length === 0;
            this.selectedAnswer = selectedWords;
          });

          target.appendChild(newPill);
          selectedWords.push(pill.dataset.word);
          footerBtn.disabled = false;
          this.selectedAnswer = selectedWords;
        });
      });
    } else if (q.type === 'match') {
      body.innerHTML = `
        <h2 class="question-title">${q.question}</h2>
        <div class="matching-grid">
          <div class="match-col" id="colLeft">
            ${q.pairs.map((p, i) => `<div class="match-card" data-side="left" data-val="${p.left}">${p.left}</div>`).join('')}
          </div>
          <div class="match-col" id="colRight">
            ${q.pairs.map((p, i) => `<div class="match-card" data-side="right" data-val="${p.right}">${p.right}</div>`).join('')}
          </div>
        </div>
      `;

      let selectedLeft = null;
      let matchedCount = 0;

      body.querySelectorAll('.match-card').forEach(card => {
        card.addEventListener('click', () => {
          audio.playClick();
          if (card.dataset.side === 'left') {
            body.querySelectorAll('[data-side="left"]').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedLeft = card;
          } else if (card.dataset.side === 'right' && selectedLeft) {
            const pairMatch = q.pairs.find(p => p.left === selectedLeft.dataset.val && p.right === card.dataset.val);
            if (pairMatch) {
              audio.playCorrect();
              selectedLeft.classList.add('matched');
              card.classList.add('matched');
              selectedLeft = null;
              matchedCount++;
              if (matchedCount === q.pairs.length) {
                this.selectedAnswer = true;
                footerBtn.disabled = false;
              }
            } else {
              audio.playIncorrect();
              selectedLeft.classList.remove('selected');
              selectedLeft = null;
            }
          }
        });
      });
    } else if (q.type === 'audio') {
      body.innerHTML = `
        <h2 class="question-title">${q.question}</h2>
        <div class="prompt-box" style="justify-content: center;">
          <button class="speaker-btn" id="playAudioExercise"><i class="fa-solid fa-volume-high"></i> Play</button>
        </div>
        <div class="options-grid">
          ${q.options.map((opt, i) => `
            <div class="option-card" data-index="${i}">
              <span class="option-text">${opt.text}</span>
            </div>
          `).join('')}
        </div>
      `;

      const course = AppState.courses[AppState.user.currentCourse] || AppState.courses.en;
      document.getElementById('playAudioExercise').addEventListener('click', () => {
        speech.speak(q.textToSpeak, course.speechLang);
      });

      body.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
          audio.playClick();
          body.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.selectedAnswer = parseInt(card.dataset.index);
          footerBtn.disabled = false;
        });
      });
    }

    footerBtn.onclick = () => this.checkAnswer();
  }

  static checkAnswer() {
    const q = this.currentQuestions[this.currentIndex];
    const banner = document.getElementById('feedbackBanner');
    const footerBtn = document.getElementById('actionBtn');
    let isCorrect = false;

    if (q.type === 'choice' || q.type === 'audio') {
      isCorrect = q.options[this.selectedAnswer]?.correct === true;
    } else if (q.type === 'sentence') {
      isCorrect = JSON.stringify(this.selectedAnswer) === JSON.stringify(q.correctAnswer);
    } else if (q.type === 'match') {
      isCorrect = this.selectedAnswer === true;
    }

    banner.classList.remove('hidden', 'correct', 'incorrect');

    if (isCorrect) {
      audio.playCorrect();
      banner.classList.add('correct');
      document.getElementById('feedbackIcon').textContent = '✓';
      document.getElementById('feedbackTitle').textContent = '¡Excelente!';
      document.getElementById('feedbackMessage').textContent = 'Respuesta totalmente correcta.';
    } else {
      audio.playIncorrect();
      banner.classList.add('incorrect');
      document.getElementById('feedbackIcon').textContent = '✕';
      document.getElementById('feedbackTitle').textContent = 'Incorrecto';
      document.getElementById('feedbackMessage').textContent = 'Sigue practicando, ¡tú puedes!';
      AppState.user.hearts = Math.max(0, AppState.user.hearts - 1);
      document.getElementById('lessonHeartCount').textContent = AppState.user.hearts;
    }

    footerBtn.textContent = 'CONTINUAR';
    footerBtn.onclick = () => {
      this.currentIndex++;
      if (this.currentIndex < this.currentQuestions.length && AppState.user.hearts > 0) {
        this.renderQuestion();
      } else {
        this.finishLesson();
      }
    };
  }

  static finishLesson() {
    this.closeModal();
    if (AppState.user.hearts > 0) {
      audio.playLevelUp();
      if (!AppState.user.completedNodes.includes(this.currentNodeId)) {
        AppState.user.completedNodes.push(this.currentNodeId);
      }
      AppState.user.nodeStars[this.currentNodeId] = 3;
      AppState.user.xp += 50;

      // Check level up
      const newLevel = Math.floor(AppState.user.xp / 100) + 1;
      if (newLevel > AppState.user.level) {
        AppState.user.level = newLevel;
        alert(`🎉 ¡FELICIDADES! ¡Has subido al Nivel ${newLevel}!`);
      }

      this.triggerConfetti();
      AppUI.renderAll();
      AppUI.saveStorage();
    } else {
      alert('Te has quedado sin vidas. Puedes recargarlas en la tienda.');
      AppUI.renderAll();
    }
  }

  static triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      color: ['#58cc02', '#1cb0f6', '#ff9600', '#ce82ff'][Math.floor(Math.random() * 4)],
      size: Math.random() * 10 + 5,
      speedY: Math.random() * 4 + 3
    }));

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speedY;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      if (particles.some(p => p.y < canvas.height)) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
  }
}

// Boot System on Page Load
window.addEventListener('DOMContentLoaded', () => {
  AppUI.init();
});
</script>