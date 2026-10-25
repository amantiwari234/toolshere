/**
 * LOVE WEBSITE INTERACTION ENGINE
 * Features:
 * - Dodging "NO" button runaway mechanics with hilarious reactions
 * - Expanding & pulsing "YES" button with mega confetti celebration
 * - Photo upload with localStorage persistence & frame styles
 * - Romantic carousel with user's messages
 * - Interactive Love Letter envelope
 * - Web Audio API sound generator (romantic music & cute SFX)
 * - Love Calculator, Love Coupons, & Reasons Jar
 * - Dynamic Name personalization
 * - Floating hearts canvas & mouse sparkle trail
 */

(function () {
  'use strict';

  // --- DEFAULT STATE & STORAGE ---
  const state = {
    gfName: localStorage.getItem('gf_love_name') || 'My Beautiful Girl',
    bfName: localStorage.getItem('bf_love_name') || 'Your Loving Boyfriend',
    gfPhoto: localStorage.getItem('gf_love_photo') || 'assets/girlfriend1.jpg',
    currentFrame: 'heart',
    messageIndex: 0,
    noDodgeCount: 0,
    musicPlaying: false,
    audioCtx: null
  };

  // --- THE USER'S REQUESTED MESSAGES + BONUS GEMS ---
  const romanticMessages = [
    { text: "I love you more than pizza 🍕❤️", sub: "And you know how much I love pizza!" },
    { text: "You stole my heart. Please return it with interest. 😭💗", sub: "Interest rate: 100 kisses per day!" },
    { text: "You're my favorite notification. 📱💕", sub: "My screen lights up, and so does my face." },
    { text: "If loving you was a job, I'd work overtime without salary. 😂", sub: "Employee of the month, every single month." },
    { text: "You're the CEO of my heart. 👑❤️", sub: "All decisions must be approved by you!" },
    { text: "I love you even when you steal all my oversized hoodies. 🧥💖", sub: "They look 1000x better on you anyway." },
    { text: "My favorite place in the entire multiverse is next to you. 🌌✨", sub: "Anywhere with you feels like home." },
    { text: "Even when you're hangry, you're the cutest bean alive. 🍟🥹", sub: "Just add snacks and watch the magic happen." }
  ];

  // --- FUNNY NO BUTTON REPLIES ---
  const dodgeReplies = [
    "Error 404: 'No' does not exist in our universe! 🌌",
    "Nice try, speedy! Physics won't allow this! 🏃‍♂️💨",
    "Are you sure? Think of all the forehead kisses! 🥺",
    "My heart's firewall blocked that option! 🛡️❤️",
    "Button is allergic to 'No'! Try the shiny pink one! 😂",
    "Nope! You're stuck with me forever and ever! 🔒💕",
    "System Alert: That button is just for decoration! 😜",
    "Resistance is futile, you love me too much! 🥰",
    "Did your finger slip? I'll pretend I didn't see that! 🙈"
  ];

  // --- REASONS WHY I LOVE YOU (LOVE JAR) ---
  const loveReasons = [
    "The way your eyes crinkle when you laugh really hard! ✨",
    "How you listen to my silly stories like they're breaking news. 🥺",
    "You make the mundane grocery store trip feel like an adventure. 🛒",
    "Your warm hugs that melt away any stressful day instantly. 🫂",
    "The cute faces you make when you're concentrating or teasing me. 😜",
    "Because you are my best friend and my greatest comfort. 💖",
    "How you smell like sweet vanilla and home. 🌸",
    "You always know how to make me smile without saying a word. 🥰",
    "Because you let me love you, exactly as you are. ❤️",
    "Your kindness towards animals and gentle soul. 🐾",
    "The way you look at me like I'm the only person in the room. 💫",
    "You believe in me even when I doubt myself. 🌟",
    "Because falling asleep and waking up thinking of you is my favorite routine. 😴💕"
  ];

  // --- DOM ELEMENTS CACHE ---
  const dom = {};

  function initDomElements() {
    dom.gfPhotoImg = document.getElementById('gfPhotoImg');
    dom.photoFileInput = document.getElementById('photoFileInput');
    dom.photoFrame = document.getElementById('photoFrame');
    dom.frameButtons = document.querySelectorAll('.frame-btn');
    
    dom.msgText = document.getElementById('msgText');
    dom.msgSub = document.getElementById('msgSub');
    dom.msgCounter = document.getElementById('msgCounter');
    dom.msgDots = document.getElementById('msgDots');
    dom.prevMsgBtn = document.getElementById('prevMsgBtn');
    dom.nextMsgBtn = document.getElementById('nextMsgBtn');

    dom.buttonsArena = document.getElementById('buttonsArena');
    dom.btnYes = document.getElementById('btnYes');
    dom.btnNo = document.getElementById('btnNo');
    dom.dodgingToast = document.getElementById('dodgingToast');

    dom.celebrationModal = document.getElementById('celebrationModal');
    dom.certGfName = document.getElementById('certGfName');
    dom.certBfName = document.getElementById('certBfName');
    dom.certDate = document.getElementById('certDate');

    dom.loveEnvelope = document.getElementById('loveEnvelope');
    dom.letterSheet = document.getElementById('letterSheet');
    dom.letterGfName = document.getElementById('letterGfName');
    dom.letterBfName = document.getElementById('letterBfName');

    dom.musicToggleBtn = document.getElementById('musicToggleBtn');
    dom.namesModal = document.getElementById('namesModal');
    dom.inputGfName = document.getElementById('inputGfName');
    dom.inputBfName = document.getElementById('inputBfName');
    
    dom.jarQuoteDisplay = document.getElementById('jarQuoteDisplay');
    dom.calcFill = document.getElementById('calcFill');
    dom.calcScore = document.getElementById('calcScore');
    dom.calcVerdict = document.getElementById('calcVerdict');
    dom.calcMeter = document.getElementById('calcMeter');

    dom.namePlaceholders = document.querySelectorAll('.var-gf-name');
    dom.bfPlaceholders = document.querySelectorAll('.var-bf-name');
  }

  // --- SOUND SYNTHESIZER (WEB AUDIO API) ---
  // Guarantees zero broken audio files and runs everywhere instantly!
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.musicInterval = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.15) {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }

    playPop() {
      this.playTone(520, 'sine', 0.1, 0.2);
    }

    playKiss() {
      this.init();
      // Cute kiss smooch chirps
      [600, 850, 1100].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.12, 0.22), idx * 70);
      });
    }

    playDodge() {
      this.init();
      // Funny comedic slide
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    }

    playFanfare() {
      this.init();
      // Joyous love victory chord progression
      const notes = [
        { f: 523.25, d: 0.15, delay: 0 },    // C5
        { f: 659.25, d: 0.15, delay: 150 },  // E5
        { f: 783.99, d: 0.18, delay: 300 },  // G5
        { f: 1046.50, d: 0.45, delay: 450 }  // C6
      ];
      notes.forEach(n => {
        setTimeout(() => this.playTone(n.f, 'triangle', n.d, 0.25), n.delay);
      });
    }

    startRomanticMelody() {
      this.init();
      // Gentle romantic arpeggio notes (F major 7 / C major 7 dreamy scale)
      const scale = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23, 440.00, 523.25];
      let step = 0;
      this.musicInterval = setInterval(() => {
        const freq = scale[step % scale.length];
        this.playTone(freq, 'sine', 0.45, 0.08);
        step++;
      }, 420);
    }

    stopRomanticMelody() {
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
    }
  }

  const sound = new SoundFX();

  // --- FLOATING HEARTS BACKGROUND CANVAS ---
  function initFloatingHeartsCanvas() {
    const canvas = document.getElementById('canvas-hearts');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const hearts = [];
    const heartSymbols = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌸', '🥰'];
    const maxHearts = window.innerWidth < 768 ? 20 : 38;

    for (let i = 0; i < maxHearts; i++) {
      hearts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 18 + 14,
        speedY: Math.random() * 0.9 + 0.4,
        speedX: (Math.random() - 0.5) * 0.6,
        char: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
        opacity: Math.random() * 0.6 + 0.2,
        swaySpeed: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      hearts.forEach(h => {
        h.y -= h.speedY;
        h.angle += h.swaySpeed;
        h.x += Math.sin(h.angle) * 0.8 + h.speedX;

        if (h.y < -30) {
          h.y = height + 30;
          h.x = Math.random() * width;
        }

        ctx.globalAlpha = h.opacity;
        ctx.font = `${h.size}px sans-serif`;
        ctx.fillText(h.char, h.x, h.y);
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- CURSOR SPARKLE TRAIL ---
  function initCursorTrail() {
    let lastTime = 0;
    const symbols = ['✨', '💖', '🌸', '⭐', '💕'];
    
    function createSparkle(x, y) {
      const now = Date.now();
      if (now - lastTime < 60) return; // limit density
      lastTime = now;

      const el = document.createElement('span');
      el.className = 'sparkle-trail';
      el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);

      setTimeout(() => el.remove(), 900);
    }

    window.addEventListener('mousemove', (e) => {
      createSparkle(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        createSparkle(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  // --- DEFAULT CUTE AVATAR (SVG DATA URL) ---
  function getDefaultGfAvatar() {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23ff9a9e"/>
          <stop offset="100%" stop-color="%23fecfef"/>
        </linearGradient>
        <linearGradient id="hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%234a2810"/>
          <stop offset="100%" stop-color="%232b1704"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23bg)"/>
      <circle cx="200" cy="200" r="160" fill="%23fff0f5"/>
      <!-- Hair back -->
      <path d="M120 180 Q80 280 130 360 Q200 370 270 360 Q320 280 280 180 Z" fill="url(%23hair)"/>
      <!-- Neck & shoulders -->
      <path d="M170 270 L170 330 L110 370 L290 370 L230 330 L230 270 Z" fill="%23ffd6ba"/>
      <!-- Cute Dress -->
      <path d="M120 350 Q200 330 280 350 L290 400 L110 400 Z" fill="%23ff3366"/>
      <!-- Face -->
      <ellipse cx="200" cy="210" rx="72" ry="82" fill="%23ffe5d9"/>
      <!-- Cute Blushing Cheeks -->
      <circle cx="155" cy="225" r="14" fill="%23ff758f" opacity="0.6"/>
      <circle cx="245" cy="225" r="14" fill="%23ff758f" opacity="0.6"/>
      <!-- Eyes -->
      <ellipse cx="165" cy="195" rx="9" ry="12" fill="%233d1e06"/>
      <circle cx="162" cy="192" r="4" fill="%23ffffff"/>
      <ellipse cx="235" cy="195" rx="9" ry="12" fill="%233d1e06"/>
      <circle cx="232" cy="192" r="4" fill="%23ffffff"/>
      <!-- Eyelashes & Brows -->
      <path d="M152 182 Q165 174 178 182" stroke="%233d1e06" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M222 182 Q235 174 248 182" stroke="%233d1e06" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Sweet Smile -->
      <path d="M185 230 Q200 244 215 230" stroke="%23ff0a54" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Hair front / Bangs -->
      <path d="M130 180 Q150 120 200 120 Q250 120 270 180 Q250 145 200 145 Q150 145 130 180 Z" fill="url(%23hair)"/>
      <path d="M130 180 Q170 200 190 160 Q210 200 270 180 Q260 250 250 280 Q235 190 200 190 Q165 190 150 280 Q140 250 130 180 Z" fill="url(%23hair)"/>
      <!-- Cute Hairclip Flower -->
      <circle cx="145" cy="145" r="9" fill="%23ff0a54"/>
      <circle cx="145" cy="145" r="4" fill="%23ffea00"/>
      <!-- Floating Hearts in background -->
      <text x="70" y="110" font-size="34">✨</text>
      <text x="290" y="100" font-size="38">💖</text>
      <text x="290" y="270" font-size="28">🌸</text>
      <text x="60" y="270" font-size="30">💕</text>
    </svg>`;
  }

  // --- GIRLFRIEND PHOTO MANAGEMENT ---
  function setupPhotoManagement() {
    // If photo is SVG avatar or not set, default to girlfriend's real photo!
    if (!state.gfPhoto || state.gfPhoto.startsWith('data:image/svg')) {
      state.gfPhoto = 'assets/girlfriend1.jpg';
    }
    if (dom.gfPhotoImg) {
      dom.gfPhotoImg.src = state.gfPhoto;
    }

    // Photo file upload handler
    dom.photoFileInput.addEventListener('change', function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, WEBP, etc.) 📸');
        return;
      }

      // Read as Data URL & compress / store
      const reader = new FileReader();
      reader.onload = function (event) {
        const dataUrl = event.target.result;
        dom.gfPhotoImg.src = dataUrl;
        state.gfPhoto = dataUrl;
        try {
          localStorage.setItem('gf_love_photo', dataUrl);
        } catch (err) {
          console.warn('Image too large for localStorage, showing in current session:', err);
        }
        sound.playFanfare();
        burstConfettiAround(dom.photoFrame);
      };
      reader.readAsDataURL(file);
    });

    // Frame Switcher Buttons
    dom.frameButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        sound.playPop();
        dom.frameButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const frameType = this.getAttribute('data-frame');
        state.currentFrame = frameType;

        // Reset frame classes
        dom.photoFrame.className = 'photo-frame';
        if (frameType === 'heart') {
          dom.photoFrame.classList.add('heart-frame');
          dom.photoFrame.innerHTML = `
            <div class="heart-frame-outer"></div>
            <div class="heart-frame-inner">
              <img id="gfPhotoImg" class="gf-photo-img" src="${state.gfPhoto || 'assets/girlfriend1.jpg'}" alt="My Beautiful Girlfriend">
            </div>
          `;
        } else if (frameType === 'circle') {
          dom.photoFrame.classList.add('circle-frame');
          dom.photoFrame.innerHTML = `
            <div class="circle-inner">
              <img id="gfPhotoImg" class="gf-photo-img" src="${state.gfPhoto || 'assets/girlfriend1.jpg'}" alt="My Beautiful Girlfriend">
            </div>
          `;
        } else if (frameType === 'polaroid') {
          dom.photoFrame.classList.add('polaroid-frame');
          dom.photoFrame.innerHTML = `
            <div class="polaroid-inner">
              <img id="gfPhotoImg" class="gf-photo-img" src="${state.gfPhoto || 'assets/girlfriend1.jpg'}" alt="My Beautiful Girlfriend">
            </div>
          `;
        }
        // Re-bind img reference
        dom.gfPhotoImg = document.getElementById('gfPhotoImg');
      });
    });

    // Quick Photo Switcher Chips
    document.querySelectorAll('.photo-thumb-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        sound.playPop();
        const src = this.getAttribute('data-src');
        if (src) {
          state.gfPhoto = src;
          localStorage.setItem('gf_love_photo', src);
          if (dom.gfPhotoImg) dom.gfPhotoImg.src = src;
          document.querySelectorAll('.photo-thumb-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          burstConfettiAround(dom.photoFrame);
        }
      });
    });

    // Memory Gallery Polaroid Cards (Click to feature in frame)
    document.querySelectorAll('.memory-polaroid-card').forEach(card => {
      card.addEventListener('click', function () {
        const img = this.querySelector('img');
        if (img && img.getAttribute('src')) {
          const src = img.getAttribute('src');
          state.gfPhoto = src;
          localStorage.setItem('gf_love_photo', src);
          if (dom.gfPhotoImg) dom.gfPhotoImg.src = src;
          sound.playKiss();
          burstKissHearts();
          const frameSection = document.getElementById('photoSection');
          if (frameSection) frameSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // Give Her A Kiss Button
    const kissBtn = document.getElementById('kissPhotoBtn');
    if (kissBtn) {
      kissBtn.addEventListener('click', function () {
        sound.playKiss();
        burstKissHearts();
      });
    }

    // Reset default photo button
    const resetPhotoBtn = document.getElementById('resetPhotoBtn');
    if (resetPhotoBtn) {
      resetPhotoBtn.addEventListener('click', function () {
        if (confirm('Reset to her cute default portrait? 🌸')) {
          localStorage.removeItem('gf_love_photo');
          state.gfPhoto = 'assets/girlfriend1.jpg';
          if (dom.gfPhotoImg) dom.gfPhotoImg.src = 'assets/girlfriend1.jpg';
          sound.playPop();
        }
      });
    }
  }

  function burstKissHearts() {
    const symbols = ['💋', '😘', '❤️', '💖', '🥰', '✨'];
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.position = 'fixed';
        el.style.left = `${50 + (Math.random() - 0.5) * 40}%`;
        el.style.top = `${50 + (Math.random() - 0.5) * 40}%`;
        el.style.fontSize = `${Math.random() * 24 + 20}px`;
        el.style.zIndex = '9999';
        el.style.pointerEvents = 'none';
        el.style.animation = 'sparkleFade 1.2s ease-out forwards';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
      }, i * 50);
    }
  }

  // --- ROMANTIC MESSAGES CAROUSEL ---
  function setupMessagesCarousel() {
    // Generate navigation dots
    dom.msgDots.innerHTML = '';
    romanticMessages.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot-pill ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        sound.playPop();
        renderMessage(idx);
      });
      dom.msgDots.appendChild(dot);
    });

    function renderMessage(index) {
      state.messageIndex = (index + romanticMessages.length) % romanticMessages.length;
      const msg = romanticMessages[state.messageIndex];

      const stage = document.querySelector('.message-display-card');
      if (stage) {
        stage.style.opacity = '0';
        stage.style.transform = 'translateY(10px) scale(0.98)';
      }

      setTimeout(() => {
        dom.msgText.innerText = msg.text;
        dom.msgSub.innerText = msg.sub;
        dom.msgCounter.innerText = `${state.messageIndex + 1} of ${romanticMessages.length}`;

        // update dots
        const dots = dom.msgDots.querySelectorAll('.dot-pill');
        dots.forEach((d, i) => {
          d.classList.toggle('active', i === state.messageIndex);
        });

        if (stage) {
          stage.style.opacity = '1';
          stage.style.transform = 'translateY(0) scale(1)';
        }
      }, 200);
    }

    dom.prevMsgBtn.addEventListener('click', () => {
      sound.playPop();
      renderMessage(state.messageIndex - 1);
    });

    dom.nextMsgBtn.addEventListener('click', () => {
      sound.playPop();
      renderMessage(state.messageIndex + 1);
    });

    // Auto rotate every 6 seconds unless user pauses/hovers
    let autoInterval = setInterval(() => {
      renderMessage(state.messageIndex + 1);
    }, 6000);

    const container = document.querySelector('.message-card-stage');
    if (container) {
      container.addEventListener('mouseenter', () => clearInterval(autoInterval));
      container.addEventListener('mouseleave', () => {
        clearInterval(autoInterval);
        autoInterval = setInterval(() => renderMessage(state.messageIndex + 1), 6000);
      });
    }

    renderMessage(0);
  }

  // --- THE FAMOUS DODGING "NO" BUTTON & EXPANDING "YES" BUTTON ---
  function setupDodgingButton() {
    const arena = dom.buttonsArena;
    const btnNo = dom.btnNo;
    const btnYes = dom.btnYes;
    const toast = dom.dodgingToast;

    let yesScale = 1;

    function dodgeNoButton(e) {
      if (e) {
        e.preventDefault();
      }
      sound.playDodge();
      state.noDodgeCount++;

      // Make NO button absolute inside arena
      btnNo.classList.add('teleporting');

      const arenaRect = arena.getBoundingClientRect();
      const btnRect = btnNo.getBoundingClientRect();

      // Calculate safe boundary within arena
      const maxLeft = Math.max(0, arenaRect.width - btnRect.width - 20);
      const maxTop = Math.max(0, arenaRect.height - btnRect.height - 20);

      const randomX = Math.floor(Math.random() * maxLeft);
      const randomY = Math.floor(Math.random() * maxTop);

      btnNo.style.left = `${randomX}px`;
      btnNo.style.top = `${randomY}px`;

      // Show funny response message
      const randomReply = dodgeReplies[(state.noDodgeCount - 1) % dodgeReplies.length];
      toast.innerText = randomReply;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2400);

      // Make YES button progressively larger and more enthusiastic!
      yesScale += 0.08;
      btnYes.style.transform = `scale(${yesScale})`;

      if (state.noDodgeCount === 2) {
        btnYes.innerHTML = `YES! Of course! 🥰 <span style="font-size:0.9em">💖</span>`;
      } else if (state.noDodgeCount === 4) {
        btnYes.innerHTML = `YES! A million times YES! 💖✨`;
        btnYes.classList.add('supersized');
      } else if (state.noDodgeCount >= 6) {
        btnYes.innerHTML = `YES! You are stuck with me! 💍❤️`;
      }
    }

    // Attach dodge triggers: mouse movement, mouse hover, mobile touch
    btnNo.addEventListener('mouseenter', dodgeNoButton);
    btnNo.addEventListener('mouseover', dodgeNoButton);
    btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
    btnNo.addEventListener('click', (e) => {
      dodgeNoButton(e);
    });

    // When YES is clicked: MEGA CELEBRATION!
    btnYes.addEventListener('click', function () {
      sound.playFanfare();
      triggerMegaCelebration();
    });
  }

  // --- MEGA CELEBRATION & CERTIFICATE MODAL ---
  function triggerMegaCelebration() {
    // Launch Confetti Shower
    createConfettiCannon();

    // Populate certificate details
    dom.certGfName.innerText = state.gfName;
    dom.certBfName.innerText = state.bfName;
    const now = new Date();
    dom.certDate.innerText = now.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Open Modal
    setTimeout(() => {
      dom.celebrationModal.classList.add('active');
    }, 600);
  }

  function createConfettiCannon() {
    const colors = ['#ff0a54', '#ff477e', '#ff758f', '#ffccd5', '#fb8500', '#ffbe0b', '#06d6a0', '#ffffff'];
    const totalParticles = 120;

    for (let i = 0; i < totalParticles; i++) {
      const p = document.createElement('div');
      const isHeart = Math.random() > 0.5;
      p.innerText = isHeart ? '💖' : '🎉';
      p.style.position = 'fixed';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = '-20px';
      p.style.fontSize = `${Math.random() * 20 + 14}px`;
      p.style.color = colors[Math.floor(Math.random() * colors.length)];
      p.style.zIndex = '9999';
      p.style.pointerEvents = 'none';

      const duration = Math.random() * 2.5 + 2;
      const xEnd = (Math.random() - 0.5) * 300;
      const rotEnd = Math.random() * 720;

      p.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${xEnd}px, 105vh) rotate(${rotEnd}deg)`, opacity: 0 }
      ], {
        duration: duration * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });

      document.body.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000);
    }
  }

  function burstConfettiAround(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const symbols = ['✨', '💖', '⭐', '🌸', '💕'];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.position = 'fixed';
      el.style.left = `${centerX}px`;
      el.style.top = `${centerY}px`;
      el.style.fontSize = '20px';
      el.style.zIndex = '9999';
      el.style.pointerEvents = 'none';

      const angle = (i / 20) * Math.PI * 2;
      const dist = Math.random() * 90 + 50;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      el.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
      ], {
        duration: 900,
        easing: 'ease-out'
      });

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  }

  // --- INTERACTIVE LOVE LETTER & ENVELOPE ---
  function setupLoveEnvelope() {
    dom.loveEnvelope.addEventListener('click', function () {
      sound.playPop();
      this.classList.toggle('opened');

      if (this.classList.contains('opened')) {
        sound.playKiss();
        dom.letterSheet.classList.add('visible');
        dom.letterSheet.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        dom.letterSheet.classList.remove('visible');
      }
    });
  }

  // --- LOVE COUPONS / VOUCHERS ---
  function setupCoupons() {
    const coupons = document.querySelectorAll('.coupon-ticket');
    coupons.forEach(coupon => {
      coupon.addEventListener('click', function () {
        if (!this.classList.contains('redeemed')) {
          sound.playKiss();
          this.classList.add('redeemed');
          const btn = this.querySelector('.redeem-btn');
          if (btn) btn.innerText = 'Redeemed with Love! ✅';
          burstConfettiAround(this);
        }
      });
    });
  }

  // --- LOVE CALCULATOR & REASONS JAR ---
  function setupLoveFunExtras() {
    // Love Calculator
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        sound.playFanfare();
        dom.calcMeter.style.display = 'block';
        dom.calcFill.style.width = '0%';
        dom.calcScore.innerText = 'Analyzing Love Frequencies... 💓';

        setTimeout(() => {
          dom.calcFill.style.width = '100%';
          dom.calcScore.innerText = '10,000% COMPATIBILITY! ♾️❤️';
          dom.calcVerdict.innerText = 'Diagnosis: A cosmic, unbeatable match. Scientifically proven to be soulmates forever! 🥰';
          burstConfettiAround(calcBtn);
        }, 500);
      });
    }

    // Love Reasons Jar
    const jar = document.getElementById('jarIconWrap');
    if (jar) {
      jar.addEventListener('click', function () {
        sound.playKiss();
        const randomReason = loveReasons[Math.floor(Math.random() * loveReasons.length)];
        dom.jarQuoteDisplay.style.opacity = '0';
        setTimeout(() => {
          dom.jarQuoteDisplay.innerText = `💌 "${randomReason}"`;
          dom.jarQuoteDisplay.style.opacity = '1';
        }, 200);
        burstConfettiAround(jar);
      });
    }
  }

  // --- MUSIC & SOUND CONTROLS (SONG: I THINK THEY CALL THIS LOVE) ---
  function setupAudioControls() {
    let bgAudio = document.getElementById('bgAudioElement');
    if (!bgAudio) {
      bgAudio = new Audio('assets/song.mp3');
      bgAudio.id = 'bgAudioElement';
      bgAudio.loop = true;
      document.body.appendChild(bgAudio);
    }

    const cardPlayBtn = document.getElementById('cardPlayBtn');
    const vinylDisc = document.getElementById('vinylDisc');

    function updateMusicUI(isPlaying) {
      state.musicPlaying = isPlaying;
      if (dom.musicToggleBtn) {
        if (isPlaying) {
          dom.musicToggleBtn.classList.add('playing');
          dom.musicToggleBtn.innerHTML = `
            <div class="sound-wave-bars"><span></span><span></span><span></span><span></span></div>
            <span>Playing: Our Song</span> 💖
          `;
        } else {
          dom.musicToggleBtn.classList.remove('playing');
          dom.musicToggleBtn.innerHTML = `🎵 Play Our Song`;
        }
      }

      if (cardPlayBtn) {
        cardPlayBtn.innerHTML = isPlaying ? `⏸ Pause Song` : `▶ Play Song`;
      }

      if (vinylDisc) {
        if (isPlaying) {
          vinylDisc.classList.add('spinning');
        } else {
          vinylDisc.classList.remove('spinning');
        }
      }
    }

    function playOurSong() {
      bgAudio.play().then(() => {
        updateMusicUI(true);
      }).catch(err => {
        console.log('Autoplay policy deferred playback until user interaction:', err);
      });
    }

    function pauseOurSong() {
      bgAudio.pause();
      updateMusicUI(false);
    }

    function toggleOurSong() {
      if (state.musicPlaying) {
        pauseOurSong();
      } else {
        playOurSong();
      }
    }

    // Top nav music toggle button
    if (dom.musicToggleBtn) {
      dom.musicToggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleOurSong();
      });
    }

    // Song card play button
    if (cardPlayBtn) {
      cardPlayBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleOurSong();
      });
    }

    // Auto-start on FIRST interaction anywhere on page (click, tap, scroll, key)
    function onFirstUserInteraction() {
      if (!state.musicPlaying) {
        playOurSong();
      }
      window.removeEventListener('click', onFirstUserInteraction);
      window.removeEventListener('touchstart', onFirstUserInteraction);
      window.removeEventListener('keydown', onFirstUserInteraction);
    }

    window.addEventListener('click', onFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', onFirstUserInteraction, { once: true });
    window.addEventListener('keydown', onFirstUserInteraction, { once: true });

    // Initial attempt in case browser allows it
    playOurSong();
  }

  // --- MODAL CONTROLS & PERSONALIZATION ---
  function setupModalsAndPersonalization() {
    // Close modal buttons
    document.querySelectorAll('.modal-close-btn, .modal-close-btn-bottom').forEach(btn => {
      btn.addEventListener('click', function () {
        sound.playPop();
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', function (e) {
        if (e.target === this) {
          this.classList.remove('active');
        }
      });
    });

    // Open Edit Names Modal
    const editNamesBtn = document.getElementById('editNamesBtn');
    if (editNamesBtn) {
      editNamesBtn.addEventListener('click', function () {
        sound.playPop();
        dom.inputGfName.value = state.gfName;
        dom.inputBfName.value = state.bfName;
        dom.namesModal.classList.add('active');
      });
    }

    // Save Names Form
    const namesForm = document.getElementById('namesForm');
    if (namesForm) {
      namesForm.addEventListener('submit', function (e) {
        e.preventDefault();
        sound.playPop();
        const gf = dom.inputGfName.value.trim() || 'My Beautiful Girl';
        const bf = dom.inputBfName.value.trim() || 'Your Loving Boyfriend';

        state.gfName = gf;
        state.bfName = bf;

        localStorage.setItem('gf_love_name', gf);
        localStorage.setItem('bf_love_name', bf);

        updateDynamicNames();
        dom.namesModal.classList.remove('active');
        burstConfettiAround(editNamesBtn);
      });
    }

    // Print / Screenshot Certificate
    const printCertBtn = document.getElementById('printCertBtn');
    if (printCertBtn) {
      printCertBtn.addEventListener('click', function () {
        window.print();
      });
    }
  }

  function updateDynamicNames() {
    dom.namePlaceholders.forEach(el => {
      el.innerText = state.gfName;
    });
    dom.bfPlaceholders.forEach(el => {
      el.innerText = state.bfName;
    });

    if (dom.certGfName) dom.certGfName.innerText = state.gfName;
    if (dom.certBfName) dom.certBfName.innerText = state.bfName;
    if (dom.letterGfName) dom.letterGfName.innerText = state.gfName;
    if (dom.letterBfName) dom.letterBfName.innerText = state.bfName;

    const calcGf = document.getElementById('calcGfName');
    const calcBf = document.getElementById('calcBfName');
    if (calcGf) calcGf.value = state.gfName;
    if (calcBf) calcBf.value = state.bfName;
  }

  // --- 1. RELATIONSHIP LIVE TIMER ---
  function setupRelationshipCounter() {
    let startDateStr = localStorage.getItem('love_dating_date') || '2024-01-01';
    const daysEl = document.getElementById('counterDays');
    const hoursEl = document.getElementById('counterHours');
    const minsEl = document.getElementById('counterMins');
    const secsEl = document.getElementById('counterSecs');

    if (!daysEl) return;

    function tickCounter() {
      const start = new Date(startDateStr).getTime();
      const now = Date.now();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      daysEl.innerText = days;
      hoursEl.innerText = String(hours).padStart(2, '0');
      minsEl.innerText = String(mins).padStart(2, '0');
      secsEl.innerText = String(secs).padStart(2, '0');
    }

    tickCounter();
    setInterval(tickCounter, 1000);
  }

  // --- 2. ROMANTIC SECRETS, RING BOX & CANDLELIGHT MODE ---
  function setupSecretsWallAndRing() {
    // Secret Flip Cards
    document.querySelectorAll('.secret-note-card').forEach(card => {
      card.addEventListener('click', function () {
        sound.playPop();
        this.classList.toggle('flipped');
        burstConfettiAround(this);
      });
    });

    // Ring Proposal Box
    const ringBox = document.getElementById('ringBoxVisual');
    const ringModal = document.getElementById('ringModal');
    if (ringBox) {
      ringBox.addEventListener('click', function () {
        sound.playFanfare();
        ringBox.innerHTML = '💍✨';
        createConfettiCannon();
        if (ringModal) {
          setTimeout(() => ringModal.classList.add('active'), 400);
        }
      });
    }

    // Candlelight Theme Toggle
    const candleBtn = document.getElementById('candleModeBtn');
    if (candleBtn) {
      candleBtn.addEventListener('click', function () {
        sound.playPop();
        document.body.classList.toggle('candlelight-active');
        const isActive = document.body.classList.contains('candlelight-active');
        this.innerHTML = isActive ? `✨ Fairy Lights` : `🕯️ Candlelight`;
      });
    }

    // Scrapbook Polaroid Click to swap photo
    document.querySelectorAll('.scrapbook-polaroid').forEach(card => {
      card.addEventListener('click', function () {
        const img = this.querySelector('img');
        if (img && img.getAttribute('src')) {
          const src = img.getAttribute('src');
          state.gfPhoto = src;
          localStorage.setItem('gf_love_photo', src);
          if (dom.gfPhotoImg) dom.gfPhotoImg.src = src;
          sound.playKiss();
          burstKissHearts();
          const frameSec = document.getElementById('photoSection');
          if (frameSec) frameSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initDomElements();
    initFloatingHeartsCanvas();
    initCursorTrail();
    setupPhotoManagement();
    setupMessagesCarousel();
    setupDodgingButton();
    setupLoveEnvelope();
    setupCoupons();
    setupLoveFunExtras();
    setupAudioControls();
    setupModalsAndPersonalization();
    setupRelationshipCounter();
    setupSecretsWallAndRing();
    updateDynamicNames();
  });

})();
