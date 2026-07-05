/* =================================================================
   BHABHI JI'S BIRTHDAY — SCRIPT
   Every section is wrapped defensively so nothing here can throw
   and freeze the page.
   ================================================================= */
(function () {
  'use strict';

  /* ============================================================ */
  /* PHOTO LIST — the single source of truth for every gallery.    */
  /* To add/remove a photo later: just edit this array and drop   */
  /* the matching file into assets/photos/. Nothing else to touch. */
  /* ============================================================ */
  const PHOTO_LIST = [
    'photo1.jpg',
    'photo2.jpg',
    'photo3.jpg',
    'photo4.jpg',
    'photo5.jpg',
    'photo6.jpg'
  ];

  const fxLayer = document.getElementById('fx-layer');
  function rand(a, b) { return Math.random() * (b - a) + a; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  const PALETTE = ['#f4c95d', '#ffe9b8', '#ff6fa5', '#ffc4d6', '#e5566b', '#ffffff'];

  /* ------------------------------------------------------------ */
  /* 1. STARFIELD CANVAS + FIREFLIES                                */
  /* ------------------------------------------------------------ */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [], dust = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function initField() {
    const w = innerWidth, h = innerHeight;
    const sc = w < 700 ? 60 : 120;
    stars = Array.from({ length: sc }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.3 + .3, phase: Math.random() * 6.28, speed: Math.random() * .02 + .01 }));
    const dc = w < 700 ? 16 : 30;
    dust = Array.from({ length: dc }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .4, vy: -(Math.random() * .15 + .05), vx: (Math.random() - .5) * .15, a: Math.random() * .5 + .2 }));
  }
  let t = 0;
  function draw() {
    const w = innerWidth, h = innerHeight;
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      const tw = .5 + .5 * Math.sin(t * s.speed * 10 + s.phase);
      ctx.beginPath(); ctx.fillStyle = `rgba(255,240,250,${tw})`;
      ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
    });
    dust.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      ctx.beginPath(); ctx.fillStyle = `rgba(255,228,190,${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
    });
    t++; requestAnimationFrame(draw);
  }
  try { resize(); initField(); requestAnimationFrame(draw); window.addEventListener('resize', () => { resize(); initField(); }); } catch (e) {}

  // fireflies (DOM, cheap, drift slowly across the page)
  try {
    for (let i = 0; i < 10; i++) {
      const f = document.createElement('div');
      f.className = 'firefly';
      f.style.left = rand(0, 100) + 'vw';
      f.style.top = rand(10, 90) + 'vh';
      f.style.setProperty('--fx', rand(-50, 50) + 'px');
      f.style.setProperty('--fy', rand(-40, 40) + 'px');
      f.style.animationDuration = rand(4, 8) + 's';
      fxLayer.appendChild(f);
    }
  } catch (e) {}

  /* ------------------------------------------------------------ */
  /* 2. FX HELPERS                                                  */
  /* ------------------------------------------------------------ */
  function clean(el, life) { fxLayer.appendChild(el); setTimeout(() => el.remove(), life); }

  function confetti(n = 60) {
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div'); el.className = 'confetti';
      const s = rand(6, 12);
      el.style.width = s + 'px'; el.style.height = (s * rand(.4, 1)) + 'px';
      el.style.left = rand(0, 100) + 'vw'; el.style.background = pick(PALETTE);
      const d = rand(2.4, 4.2); el.style.animationDuration = d + 's'; el.style.animationDelay = rand(0, .6) + 's';
      clean(el, (d + 1) * 1000);
    }
  }
  function petals(n = 16) {
    const p = ['🌸', '🌺', '🌹'];
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div'); el.className = 'petal'; el.textContent = pick(p);
      el.style.left = rand(0, 100) + 'vw'; el.style.setProperty('--sway', rand(-60, 60) + 'px');
      const d = rand(4, 7); el.style.animationDuration = d + 's'; el.style.animationDelay = rand(0, 1) + 's';
      clean(el, (d + 1.2) * 1000);
    }
  }
  function hearts(n = 14) {
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div'); el.className = 'heart-p'; el.textContent = pick(['💖', '💗', '💕']);
      el.style.left = rand(0, 100) + 'vw'; el.style.setProperty('--sway', rand(-50, 50) + 'px');
      const d = rand(3.5, 6); el.style.animationDuration = d + 's'; el.style.animationDelay = rand(0, .8) + 's';
      clean(el, (d + 1) * 1000);
    }
  }
  function sparklesAt(x, y, n = 14) {
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div'); el.className = 'spark';
      const a = rand(0, 6.28), dist = rand(10, 60);
      el.style.left = (x + Math.cos(a) * dist) + 'px'; el.style.top = (y + Math.sin(a) * dist) + 'px';
      el.style.animationDelay = rand(0, .2) + 's'; clean(el, 1200);
    }
  }
  function fireworkAt(x, y, n = 26) {
    const c = pick(PALETTE);
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div'); el.className = 'fw';
      const a = (6.28 * i) / n, dist = rand(60, 140);
      el.style.left = x + 'px'; el.style.top = y + 'px';
      el.style.setProperty('--dx', Math.cos(a) * dist + 'px'); el.style.setProperty('--dy', Math.sin(a) * dist + 'px');
      el.style.background = c; el.style.boxShadow = `0 0 8px 2px ${c}`; clean(el, 1300);
    }
  }
  function fireworksShow(bursts = 5) {
    for (let i = 0; i < bursts; i++) setTimeout(() => fireworkAt(rand(innerWidth * .15, innerWidth * .85), rand(innerHeight * .15, innerHeight * .5)), i * 400);
  }
  function balloonsUp(n = 16) {
    const colors = ['#ff6fa5', '#f4c95d', '#ffc4d6', '#e5566b', '#fff9f5'];
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div'); el.className = 'balloon-el';
      el.style.left = rand(0, 95) + 'vw'; el.style.background = pick(colors);
      el.style.setProperty('--drift', rand(-100, 100) + 'px');
      const d = rand(6, 10); el.style.animationDuration = d + 's'; el.style.animationDelay = rand(0, 1.4) + 's';
      clean(el, (d + 1.5) * 1000);
    }
  }
  function celebrate() { confetti(70); petals(16); hearts(12); fireworksShow(5); balloonsUp(12); }

  // gentle continuous ambience so the page always feels alive
  setInterval(() => { if (Math.random() < .6) petals(2); }, 4200);
  setInterval(() => { if (Math.random() < .5) hearts(1); }, 5200);
  setInterval(() => { if (Math.random() < .3) sparklesAt(rand(0, innerWidth), rand(0, innerHeight * .6), 6); }, 3600);

  /* ------------------------------------------------------------ */
  /* 3. MUSIC — autoplay on gift open, play/pause, volume,          */
  /*    and a small live visualizer                                */
  /* ------------------------------------------------------------ */
  const bgMusic = document.getElementById('bgMusic');
  const musicFab = document.getElementById('music-fab');
  const volumeSlider = document.getElementById('volumeSlider');
  const vizCanvas = document.getElementById('visualizer');
  const vizCtx = vizCanvas.getContext('2d');
  let musicPlaying = false;
  let audioCtx, analyser, sourceNode, freqData;

  function setupVisualizer() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      sourceNode = audioCtx.createMediaElementSource(bgMusic);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      freqData = new Uint8Array(analyser.frequencyBinCount);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (e) { /* visualizer is decorative only — safe to skip */ }
  }
  function drawViz() {
    requestAnimationFrame(drawViz);
    if (!analyser || !musicPlaying) return;
    analyser.getByteFrequencyData(freqData);
    vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
    const bars = 9, gap = 2;
    const bw = (vizCanvas.width - gap * (bars - 1)) / bars;
    for (let i = 0; i < bars; i++) {
      const v = freqData[i * 2] / 255;
      const h = Math.max(2, v * vizCanvas.height);
      vizCtx.fillStyle = '#f4c95d';
      vizCtx.fillRect(i * (bw + gap), vizCanvas.height - h, bw, h);
    }
  }
  requestAnimationFrame(drawViz);

  function startMusic() {
    if (musicPlaying) return;
    musicPlaying = true;
    musicFab.classList.add('playing'); musicFab.textContent = '⏸';
    setupVisualizer();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    bgMusic.play().catch(() => { /* she can still tap the floating button to start it manually */ });
  }
  function pauseMusic() {
    musicPlaying = false;
    musicFab.classList.remove('playing'); musicFab.textContent = '🎵';
    bgMusic.pause();
  }
  musicFab.addEventListener('click', () => musicPlaying ? pauseMusic() : startMusic());
  volumeSlider.addEventListener('input', () => { bgMusic.volume = parseFloat(volumeSlider.value); });
  bgMusic.volume = parseFloat(volumeSlider.value);

  /* ------------------------------------------------------------ */
  /* 4. SCENE 1 — GIFT OPENING                                       */
  /* ------------------------------------------------------------ */
  const giftScreen = document.getElementById('gift-screen');
  const giftBtn = document.getElementById('giftBtn');
  const openGiftLabel = document.getElementById('openGiftLabel');
  const heroTitle = document.getElementById('heroTitle');

  function typeHeroTitle() {
    const text = '🎉 Happy Birthday Bhabhi Ji';
    heroTitle.innerHTML = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span'); span.className = 'ch';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (i * 0.06) + 's';
      heroTitle.appendChild(span);
    });
  }
  typeHeroTitle();

  let opened = false;
  function openGift() {
    if (opened) return; opened = true;
    giftBtn.classList.add('opening');
    startMusic(); // direct user gesture — browsers allow audio to start right here

    setTimeout(() => {
      giftBtn.classList.add('opened');
      celebrate();
      const rect = giftBtn.getBoundingClientRect();
      sparklesAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
      document.body.style.transition = 'filter .8s ease';
      document.body.style.filter = 'brightness(1.35)';
    }, 550);

    setTimeout(() => {
      giftScreen.classList.add('hide');
      document.body.style.filter = '';
      document.body.style.overflow = 'auto';
      typeHeroTitle();
      startWishes();
    }, 1350);
    setTimeout(() => { giftScreen.style.display = 'none'; }, 2500);
  }
  giftBtn.addEventListener('click', openGift);
  openGiftLabel.addEventListener('click', openGift);
  document.body.style.overflow = 'hidden'; // locked until the gift is opened

  /* ------------------------------------------------------------ */
  /* 5. SCROLL REVEAL                                                */
  /* ------------------------------------------------------------ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .2 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  io.observe(document.getElementById('finaleSection'));

  /* celebrate again + gentle fade-out when the finale arrives */
  let finaleCelebrated = false;
  const finaleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !finaleCelebrated) {
        finaleCelebrated = true;
        celebrate(); setTimeout(celebrate, 700); setTimeout(celebrate, 1500); setTimeout(celebrate, 2400);
      }
    });
  }, { threshold: .4 });
  finaleObs.observe(document.getElementById('finaleSection'));

  /* ------------------------------------------------------------ */
  /* 6. SCENE 2 — SEVEN WISHES, one at a time, unique animation      */
  /* ------------------------------------------------------------ */
  const wishes = [
    { text: '✨ Wishing you a year full of happiness and laughter.', anim: 'anim-fade' },
    { text: '🌸 May good health and endless energy always be yours.', anim: 'anim-zoom' },
    { text: '💫 May every dream you carry find its way to you.', anim: 'anim-slide' },
    { text: '🎶 May your days be filled with music, joy and peace.', anim: 'anim-rotate' },
    { text: '🌟 May success walk beside you in everything you do.', anim: 'anim-bounce' },
    { text: '💐 May your smile keep lighting up our whole family.', anim: 'anim-flip' },
    { text: '❤️ Happy Birthday, Bhabhi — today and always, with love.', anim: 'anim-glow' }
  ];
  const wishStage = document.getElementById('wishStage');
  const wishProgress = document.getElementById('wishProgress');
  wishes.forEach(() => { const d = document.createElement('span'); wishProgress.appendChild(d); });
  let wishesStarted = false;

  function showWish(index) {
    if (index >= wishes.length) index = 0; // loop gently
    [...wishProgress.children].forEach((d, i) => d.classList.toggle('active', i === index));
    const prev = wishStage.querySelector('.wish-card');
    if (prev) { prev.classList.add('leaving'); setTimeout(() => prev.remove(), 800); }
    const card = document.createElement('p');
    card.className = 'wish-card ' + wishes[index].anim;
    card.textContent = wishes[index].text;
    wishStage.appendChild(card);
    setTimeout(() => showWish(index + 1), 9000); // 9s per wish, per the 8-10s spec
  }
  function startWishes() {
    if (wishesStarted) return;
    wishesStarted = true;
    showWish(0);
  }

  /* ------------------------------------------------------------ */
  /* 7. SCENE 3 — CAKE: light → blow → cut                           */
  /* ------------------------------------------------------------ */
  const cake = document.getElementById('cake');
  const lightBtn = document.getElementById('lightBtn');
  const blowBtn = document.getElementById('blowBtn');
  const cutBtn = document.getElementById('cutBtn');
  const makeWish = document.getElementById('makeWish');

  function playCelebrationChime() {
    // small synthesized cheer/chime for the cake-cutting moment (no extra audio file needed)
    try {
      const ac = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator(); const gain = ac.createGain();
        osc.type = 'triangle'; osc.frequency.value = freq;
        osc.connect(gain); gain.connect(ac.destination);
        const start = ac.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
        osc.start(start); osc.stop(start + 0.55);
      });
    } catch (e) {}
  }

  lightBtn.addEventListener('click', () => {
    cake.querySelectorAll('.candle').forEach((c, i) => setTimeout(() => { c.classList.remove('blown'); c.classList.add('lit'); }, i * 200));
    lightBtn.disabled = true; blowBtn.disabled = false;
  });
  blowBtn.addEventListener('click', () => {
    cake.querySelectorAll('.candle').forEach((c, i) => setTimeout(() => { c.classList.remove('lit'); c.classList.add('blown'); }, i * 180));
    setTimeout(() => { makeWish.classList.add('show'); sparklesAt(innerWidth / 2, innerHeight * .4, 16); }, 650);
    blowBtn.disabled = true; cutBtn.disabled = false;
  });
  cutBtn.addEventListener('click', () => {
    cake.classList.add('cut');
    celebrate();
    playCelebrationChime();
    cutBtn.disabled = true;
  });

  /* ------------------------------------------------------------ */
  /* 8. SCENE 4 — GALLERY (slideshow, polaroid, masonry, floating)  */
  /*    all built from PHOTO_LIST + a shared lightbox                */
  /* ------------------------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('show'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('show'); });
  function openLightbox(src) { lightboxImg.src = src; lightbox.classList.add('show'); }

  // slideshow
  const slideshow = document.getElementById('slideshow');
  const slideDots = document.getElementById('slideDots');
  PHOTO_LIST.forEach((src, i) => {
    const s = document.createElement('div'); s.className = 'slide' + (i === 0 ? ' active' : '');
    const img = document.createElement('img'); img.src = src; img.alt = 'Memory ' + (i + 1);
    s.appendChild(img); slideshow.appendChild(s);
    const d = document.createElement('span'); if (i === 0) d.className = 'active'; slideDots.appendChild(d);
  });
  slideshow.addEventListener('click', () => openLightbox(PHOTO_LIST[slideIdx]));
  let slideIdx = 0;
  setInterval(() => {
    const slides = slideshow.querySelectorAll('.slide');
    slides[slideIdx].classList.remove('active'); slideDots.children[slideIdx].classList.remove('active');
    slideIdx = (slideIdx + 1) % slides.length;
    slides[slideIdx].classList.add('active'); slideDots.children[slideIdx].classList.add('active');
  }, 4500); // slow, so every memory can be enjoyed

  // polaroid row
  const polaroidRow = document.getElementById('polaroidRow');
  const captions = ['✨ Beautiful', '💃 Graceful', '😊 Radiant', '🌸 Elegant', '💖 Loved', '🎂 Celebrated'];
  PHOTO_LIST.forEach((src, i) => {
    const fig = document.createElement('figure'); fig.className = 'polaroid';
    fig.style.setProperty('--r', rand(-6, 6) + 'deg');
    const img = document.createElement('img'); img.src = src; img.alt = 'Memory';
    const cap = document.createElement('figcaption'); cap.textContent = captions[i % captions.length];
    fig.appendChild(img); fig.appendChild(cap);
    fig.addEventListener('click', () => openLightbox(src));
    polaroidRow.appendChild(fig);
  });

  // masonry
  const masonryGrid = document.getElementById('masonryGrid');
  PHOTO_LIST.forEach(src => {
    const item = document.createElement('div'); item.className = 'm-item';
    const img = document.createElement('img'); img.src = src; img.alt = 'Memory';
    item.appendChild(img);
    item.addEventListener('click', () => openLightbox(src));
    masonryGrid.appendChild(item);
  });

  // floating cards
  const floatingWrap = document.getElementById('floatingCards');
  PHOTO_LIST.forEach((src, i) => {
    const card = document.createElement('div'); card.className = 'f-card';
    const leftPct = 6 + i * (88 / Math.max(1, PHOTO_LIST.length - 1));
    card.style.left = leftPct + '%';
    card.style.top = (i % 2 === 0 ? '10px' : '70px');
    card.style.setProperty('--rot', rand(-8, 8) + 'deg');
    card.style.animationDelay = (i * 0.3) + 's';
    const img = document.createElement('img'); img.src = src;

img.onerror = () => {
    console.log("Image not found:", src);
};; img.alt = 'Memory';
    card.appendChild(img);
    card.addEventListener('click', () => openLightbox(src));
    floatingWrap.appendChild(card);
  });

  /* ------------------------------------------------------------ */
  /* 9. SCENE 5 — EMOTIONAL LETTER, line by line typing effect       */
  /* ------------------------------------------------------------ */
  const letterLines = [
    'Dear Bhabhi,',
    'Today is your day, and the whole family is celebrating the light you bring into our home.',
    'From the day you joined our family, everything has felt warmer, calmer, and more complete.',
    'You take care of everyone around you so effortlessly, often without anyone even noticing.',
    'As your Devar, I have always admired your strength, your patience, and your kindness.',
    'May this year bring you endless happiness, good health, and countless reasons to smile.',
    'May every dream you hold quietly in your heart find its way into your life.',
    'Thank you for being the wonderful, caring Bhabhi who holds our family together.',
    '🎉 Happy Birthday Bhabhi Ji ❤️',
    'With Lots of Love',
    'From Your Devar Ji'
  ];
  const letterText = document.getElementById('letterText');
  const letterSection = document.getElementById('letterSection');
  let letterStarted = false;

  function revealLetter() {
    if (letterStarted) return;
    letterStarted = true;
    letterLines.forEach((line, i) => {
      setTimeout(() => {
        const p = document.createElement('p');
        if (i === letterLines.length - 3) p.className = 'shown sign';
        else if (i >= letterLines.length - 2) { p.className = 'shown sign'; }
        else p.className = 'shown';
        p.textContent = line;
        letterText.appendChild(p);
      }, i * 1600);
    });
  }
  const letterObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) revealLetter(); });
  }, { threshold: .3 });
  letterObs.observe(letterSection);

})();
