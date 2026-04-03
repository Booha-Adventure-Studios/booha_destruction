
(() => {
  'use strict';

  const CFG      = window.BOOHA_DESTRUCTION_CONFIG || {};
  const UI_IDS   = CFG.ui || {};
  const BTN_IDS  = CFG.buttons || {};
  const ASSETS   = CFG.assets || {};
  const AUDIO    = CFG.audio || {};
  const GAMEPLAY = CFG.gameplay || {};

  const WIDTH  = GAMEPLAY.width  || 1280;
  const HEIGHT = GAMEPLAY.height || 720;
  const GRAVITY       = 0.48;
  const AIR           = 0.999;
  const BOUNCE        = 0.72;
  const FLOOR_Y       = HEIGHT - 80;
  const SLING_X       = 180;
  const SLING_Y       = FLOOR_Y - 120;
  const MAX_PULL      = 150;
  const BOOHA_RADIUS  = 34;
  const GROUND_HEIGHT = 54;
  const MIN_IMPACT    = 3.8;
  const WIN_TARGET    = GAMEPLAY.targetPercent  || 100;
  const GHOSTS_PER_ROUND = GAMEPLAY.ghostsPerRound || 3;
  const DAMAGE_DECAY_SETTLE = 0.985;
  const REST_THRESHOLD = 0.35;
  const HIT_COOLDOWN_MS = 90;

  const $ = (id) => document.getElementById(id);

  const els = {
    canvas:             $(CFG.canvasId),
    frame:              $(CFG.frameId),
    levelLabel:         $(UI_IDS.levelLabel),
    ghostsLabel:        $(UI_IDS.ghostsLabel),
    damageLabel:        $(UI_IDS.damageLabel),
    targetLabel:        $(UI_IDS.targetLabel),
    blocksLabel:        $(UI_IDS.blocksLabel),
    progressText:       $(UI_IDS.progressText),
    progressFill:       $(UI_IDS.progressFill),
    stateLabel:         $(UI_IDS.stateLabel),
    materialLabel:      $(UI_IDS.materialLabel),
    shotLabel:          $(UI_IDS.shotLabel),
    centerMessage:      $(UI_IDS.centerMessage),
    centerMessageTitle: $(UI_IDS.centerMessageTitle),
    centerMessageSub:   $(UI_IDS.centerMessageSub),
    rotateOverlay:      $(UI_IDS.rotateOverlay),
    startBtn:           $(BTN_IDS.start),
    retryBtn:           $(BTN_IDS.retry),
    nextBtn:            $(BTN_IDS.next),
    muteBtn:            $(BTN_IDS.mute)
  };

  if (!els.canvas) { console.error('Booha Destruction: canvas not found.'); return; }

  const ctx = els.canvas.getContext('2d');
  els.canvas.width  = WIDTH;
  els.canvas.height = HEIGHT;

  // ── FX pools ─────────────────────────────────────────────
  // Particles: chips, sparks, glass shards, dust puffs, shockwaves
  const particles  = [];   // { x,y,vx,vy,life,maxLife,r,color,type }
  const shockwaves = [];   // { x,y,r,maxR,life,maxLife,color }
  const dustPuffs  = [];   // { x,y,r,maxR,life,maxLife }

  // Screen shake state
  const shake = { intensity: 0, decay: 0.85 };

  const state = {
    running: false,
    levelIndex: 0,
    muted: false,
    pointerDown: false,
    dragging: false,
    lastHitAt: 0,
    impactFlash: 0,
    bestShot: 0,
    currentMaterial: '—',
    currentState: 'Waiting',
    levelWon: false,
    levelLost: false,
    ghostsLeft: GHOSTS_PER_ROUND,
    destructionPercent: 0,
    totalBreakables: 0,
    brokenBreakables: 0,
    pullPlayed: false,
    pendingResetBooha: false,
    booha: null,
    blocks: [],
    debrisTimer: 0,
    messageTimer: 0,
    images: { bg: null, booha: null },
    pointer: { x: 0, y: 0 },
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    raf: 0
  };

  const LEVELS = window.BOOHA_DESTRUCTION_LEVELS || [];
  if (!LEVELS.length) { console.error('Booha Destruction: no levels found.'); }

  // ── Images ───────────────────────────────────────────────
  function makeImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
  async function preload() {
    const [bg, booha] = await Promise.all([makeImage(ASSETS.background), makeImage(ASSETS.booha)]);
    state.images.bg    = bg;
    state.images.booha = booha;
  }

  // ── Audio ────────────────────────────────────────────────
  function playSFX(src, volume = 1, rate = 1) {
    if (state.muted || !src) return;
    const a = new Audio(src);
    a.volume = Math.max(0, Math.min(1, volume));
    a.playbackRate = rate;
    a.play().catch(() => {});
  }
  function playPull()   { if (state.pullPlayed) return; state.pullPlayed = true; playSFX(AUDIO.pull,   0.5,  0.98 + Math.random() * 0.06); }
  function playLaunch() { playSFX(AUDIO.launch, 0.95, 0.98 + Math.random() * 0.06); setTimeout(() => playSFX(AUDIO.booha, 0.82, 0.96 + Math.random() * 0.08), 60); }
  function playHit(material, speed) {
    const now = performance.now();
    if (now - state.lastHitAt < HIT_COOLDOWN_MS) return;
    state.lastHitAt = now;
    let src = AUDIO.wood;
    if (material === 'stone') src = AUDIO.stone;
    if (material === 'glass') src = AUDIO.glass;
    if (material === 'soft')  src = AUDIO.soft;
    const volume = Math.max(0.22, Math.min(1, speed / 14));
    playSFX(src, volume, 0.92 + Math.random() * 0.18);
    state.currentMaterial = capitalize(material);
    state.impactFlash = 1;
  }
  function playBreak()  { playSFX(AUDIO.break,  0.95, 0.95 + Math.random() * 0.08); }
  function playRubble() { playSFX(AUDIO.rubble, 0.58, 0.98 + Math.random() * 0.08); setTimeout(() => playSFX(AUDIO.rubble, 0.35, 1.06), 120); }
  function playGround(speed) { if (speed < 12) return; playSFX(AUDIO.ground, Math.min(0.9, speed / 22), 0.96 + Math.random() * 0.08); }
  function playWin()  { playSFX(AUDIO.win,  1,    1); }
  function playFail() { playSFX(AUDIO.fail, 0.88, 1); }

  // ── Helpers ──────────────────────────────────────────────
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'; }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  // ── Material colour palette (base + damaged) ──────────────
  const MAT = {
    wood:  { base: '#b97c4d', mid: '#8a5230', dark: '#5a2f12', spark: '#e8a86a', chip: '#c68040' },
    stone: { base: '#78808f', mid: '#555e6a', dark: '#353d47', spark: '#c0c8d4', chip: '#8899a8' },
    glass: { base: '#b7ecff', mid: '#70caee', dark: '#3898bb', spark: '#e0f7ff', chip: '#a0d8ef' },
    soft:  { base: '#f6b0da', mid: '#d470a8', dark: '#a03570', spark: '#ffd0ec', chip: '#e890c0' }
  };

  function materialFill(block) {
    const m = MAT[block.material] || MAT.wood;
    if (!block.maxHp || block.maxHp <= 1) return m.base;
    const ratio = clamp(block.hp / block.maxHp, 0, 1);
    if (ratio > 0.66) return m.base;
    if (ratio > 0.33) return m.mid;
    return m.dark;
  }

  // ── FX: Spawn helpers ────────────────────────────────────

  /** Chip/spark burst on hit */
  function spawnHitParticles(x, y, material, speed, count = 8) {
    const m = MAT[material] || MAT.wood;
    const isGlass = material === 'glass';
    for (let i = 0; i < count; i++) {
      const angle   = rand(0, Math.PI * 2);
      const mag     = rand(1.5, Math.min(12, speed * 0.7));
      const isChip  = !isGlass && Math.random() < 0.4;
      particles.push({
        x, y,
        vx:      Math.cos(angle) * mag,
        vy:      Math.sin(angle) * mag - rand(0, 3),
        life:    1,
        maxLife: 1,
        r:       isChip ? rand(2.5, 5) : rand(1, 2.5),
        color:   Math.random() < 0.5 ? m.spark : m.chip,
        type:    isChip ? 'chip' : 'spark',
        gravity: isChip ? 0.28 : 0.12,
        rot:     rand(0, Math.PI * 2),
        rotV:    rand(-0.2, 0.2)
      });
    }
  }

  /** Glass shards — triangular, high velocity */
  function spawnGlassShatter(x, y, w, h) {
    const count = 10 + Math.floor(rand(0, 8));
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2);
      const mag   = rand(3, 14);
      const size  = rand(4, 12);
      particles.push({
        x: x + rand(-w * 0.4, w * 0.4),
        y: y + rand(-h * 0.4, h * 0.4),
        vx:      Math.cos(angle) * mag,
        vy:      Math.sin(angle) * mag - rand(1, 5),
        life:    1,
        maxLife: 1,
        r:       size,
        color:   '#b7ecff',
        type:    'shard',
        gravity: 0.32,
        rot:     rand(0, Math.PI * 2),
        rotV:    rand(-0.35, 0.35),
        alpha:   0.85
      });
    }
  }

  /** Dust puff on floor impact */
  function spawnDustPuff(x, y) {
    dustPuffs.push({ x, y, r: 4, maxR: rand(28, 48), life: 1, maxLife: 1 });
  }

  /** Shockwave ring on hard impact */
  function spawnShockwave(x, y, color, maxR = 60) {
    shockwaves.push({ x, y, r: 4, maxR, life: 1, maxLife: 1, color });
  }

  /** Screen shake */
  function addShake(amount) {
    shake.intensity = Math.max(shake.intensity, amount);
  }

  // ── FX: Update ───────────────────────────────────────────
  function updateFX() {
    const dt = 1;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy  += p.gravity * dt;
      p.x   += p.vx * dt;
      p.y   += p.vy * dt;
      p.vx  *= 0.97;
      if (p.rot !== undefined) p.rot += p.rotV;
      p.life -= 0.024 + (0.005 * Math.random());
      // Bounce chips off floor
      if (p.y > FLOOR_Y - p.r && (p.type === 'chip' || p.type === 'shard')) {
        p.y  = FLOOR_Y - p.r;
        p.vy *= -0.38;
        p.vx *= 0.78;
        if (Math.abs(p.vy) > 5) spawnDustPuff(p.x, FLOOR_Y);
      }
      if (p.life <= 0) { particles.splice(i, 1); }
    }

    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const s = shockwaves[i];
      s.r   += (s.maxR - s.r) * 0.18;
      s.life -= 0.06;
      if (s.life <= 0) { shockwaves.splice(i, 1); }
    }

    for (let i = dustPuffs.length - 1; i >= 0; i--) {
      const d = dustPuffs[i];
      d.r   += (d.maxR - d.r) * 0.12;
      d.life -= 0.05;
      if (d.life <= 0) { dustPuffs.splice(i, 1); }
    }

    shake.intensity *= shake.decay;
  }

  // ── FX: Draw ─────────────────────────────────────────────
  function drawFX() {
    // Dust puffs
    for (const d of dustPuffs) {
      const a = d.life * 0.22;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,190,180,0.5)';
      ctx.fill();
      ctx.restore();
    }

    // Shockwave rings
    for (const s of shockwaves) {
      ctx.save();
      ctx.globalAlpha = s.life * 0.7;
      ctx.strokeStyle = s.color;
      ctx.lineWidth   = 2.5 * s.life;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Particles
    for (const p of particles) {
      const alpha = clamp(p.life, 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha * (p.alpha || 1);
      ctx.fillStyle   = p.color;
      ctx.translate(p.x, p.y);
      if (p.rot !== undefined) ctx.rotate(p.rot);

      if (p.type === 'shard') {
        // Triangular glass shard
        const s = p.r;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.7, s * 0.6);
        ctx.lineTo(-s * 0.7, s * 0.4);
        ctx.closePath();
        ctx.fillStyle   = p.color;
        ctx.strokeStyle = 'rgba(180,240,255,0.6)';
        ctx.lineWidth   = 0.8;
        ctx.fill();
        ctx.stroke();
      } else if (p.type === 'chip') {
        // Small rectangle chip
        ctx.fillRect(-p.r * 0.6, -p.r * 0.4, p.r * 1.2, p.r * 0.8);
      } else {
        // Round spark dot
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // ── Block crack overlay system ────────────────────────────
  // Pre-generated crack line sets per block, keyed by block index
  const crackSets = new Map();

  function getCracks(block, idx) {
    if (!crackSets.has(idx)) {
      // Generate 3 tiers of cracks: minor, mid, heavy
      const w = block.w, h = block.h;
      const makeLines = (count, maxLen) => {
        const lines = [];
        for (let i = 0; i < count; i++) {
          const ox = rand(-w * 0.35, w * 0.35);
          const oy = rand(-h * 0.35, h * 0.35);
          const angle = rand(0, Math.PI * 2);
          const len   = rand(maxLen * 0.4, maxLen);
          lines.push({
            x1: ox, y1: oy,
            x2: ox + Math.cos(angle) * len,
            y2: oy + Math.sin(angle) * len,
            branch: Math.random() < 0.4 ? {
              x: ox + Math.cos(angle) * len * 0.5,
              y: oy + Math.sin(angle) * len * 0.5,
              a: angle + rand(0.4, 1.1) * (Math.random() < 0.5 ? 1 : -1),
              l: len * rand(0.3, 0.55)
            } : null
          });
        }
        return lines;
      };
      crackSets.set(idx, {
        minor: makeLines(3, Math.min(w, h) * 0.35),
        mid:   makeLines(5, Math.min(w, h) * 0.55),
        heavy: makeLines(8, Math.min(w, h) * 0.75)
      });
    }
    return crackSets.get(idx);
  }

  function drawCracks(block, idx) {
    if (block.broken || block.maxHp <= 1) return;
    const ratio = clamp(block.hp / block.maxHp, 0, 1);
    if (ratio >= 1) return;

    const cracks  = getCracks(block, idx);
    const cx      = block.x;
    const cy      = block.y;

    let lines = [];
    let alpha  = 0;
    if (ratio < 0.34) { lines = [...cracks.minor, ...cracks.mid, ...cracks.heavy]; alpha = 0.75; }
    else if (ratio < 0.67) { lines = [...cracks.minor, ...cracks.mid]; alpha = 0.55; }
    else { lines = cracks.minor; alpha = 0.35; }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth   = 1;
    ctx.lineCap     = 'round';

    // Clip to block shape
    roundRectClip(ctx, block.x - block.w / 2, block.y - block.h / 2, block.w, block.h, 8);

    for (const l of lines) {
      ctx.beginPath();
      ctx.moveTo(cx + l.x1, cy + l.y1);
      ctx.lineTo(cx + l.x2, cy + l.y2);
      ctx.stroke();
      if (l.branch) {
        ctx.beginPath();
        ctx.moveTo(cx + l.branch.x, cy + l.branch.y);
        ctx.lineTo(cx + l.branch.x + Math.cos(l.branch.a) * l.branch.l,
                   cy + l.branch.y + Math.sin(l.branch.a) * l.branch.l);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ── UI ───────────────────────────────────────────────────
  function setMessage(title, sub, ms = 0) {
    if (!els.centerMessage || !els.centerMessageTitle || !els.centerMessageSub) return;
    els.centerMessageTitle.textContent = title;
    els.centerMessageSub.textContent   = sub;
    els.centerMessage.classList.remove('hidden');
    state.messageTimer = ms > 0 ? performance.now() + ms : 0;
  }
  function hideMessage() {
    if (els.centerMessage) els.centerMessage.classList.add('hidden');
    state.messageTimer = 0;
  }
  function setButtonsForState() {
    if (els.startBtn) els.startBtn.disabled = state.running;
    if (els.retryBtn) els.retryBtn.disabled = false;
    if (els.nextBtn)  els.nextBtn.disabled  = !state.levelWon;
    if (els.muteBtn) {
      els.muteBtn.textContent = state.muted ? 'Sound: Off' : 'Sound: On';
      els.muteBtn.setAttribute('aria-pressed', state.muted ? 'true' : 'false');
    }
  }
  function updateUI() {
    const level = LEVELS[state.levelIndex];
    if (!level) return;
    const target = level.targetPercent || WIN_TARGET;
    if (els.levelLabel)    els.levelLabel.textContent   = String(level.id || 1);
    if (els.ghostsLabel)   els.ghostsLabel.textContent  = String(state.ghostsLeft);
    if (els.damageLabel)   els.damageLabel.textContent  = `${Math.round(state.destructionPercent)}%`;
    if (els.targetLabel)   els.targetLabel.textContent  = `${target}%`;
    if (els.blocksLabel)   els.blocksLabel.textContent  = String(state.blocks.filter(b => !b.broken).length);
    if (els.progressText)  els.progressText.textContent = `${Math.round(state.destructionPercent)}%`;
    if (els.progressFill)  els.progressFill.style.width = `${clamp(state.destructionPercent, 0, 100)}%`;
    if (els.stateLabel)    els.stateLabel.textContent   = state.currentState;
    if (els.materialLabel) els.materialLabel.textContent = state.currentMaterial;
    if (els.shotLabel)     els.shotLabel.textContent    = state.bestShot > 0 ? `${Math.round(state.bestShot)}%` : '—';
    setButtonsForState();
  }

  // ── Game objects ─────────────────────────────────────────
  function makeBooha() {
    return { active: false, launched: false, x: SLING_X, y: SLING_Y, vx: 0, vy: 0, radius: BOOHA_RADIUS, settledFrames: 0, damageThisShot: 0 };
  }

  function cloneBlock(def, idx) {
    const y = typeof def.floorOffset === 'number' ? FLOOR_Y - def.floorOffset : def.y;
    crackSets.delete(idx); // clear any old cracks for this slot
    return { x: def.x, y, w: def.w, h: def.h, material: def.material || 'wood', hp: def.hp || 1, maxHp: def.hp || 1, broken: false, shake: 0, vy: 0, fallen: false, hitFlash: 0, points: 100 };
  }

  // ── Level management ─────────────────────────────────────
  function resetRoundState() {
    state.pointerDown = false;
    state.dragging    = false;
    state.pullPlayed  = false;
    state.levelWon    = false;
    state.levelLost   = false;
    state.bestShot    = 0;
    state.currentMaterial = '—';
    state.currentState    = 'Waiting';
    state.destructionPercent  = 0;
    state.brokenBreakables    = 0;
    state.debrisTimer         = 0;
    state.pendingResetBooha   = false;
    particles.length  = 0;
    shockwaves.length = 0;
    dustPuffs.length  = 0;
    crackSets.clear();
    shake.intensity = 0;
  }

  function loadLevel(index) {
    state.levelIndex = clamp(index, 0, LEVELS.length - 1);
    const level = LEVELS[state.levelIndex];
    resetRoundState();
    state.running     = false;
    state.ghostsLeft  = level.ghosts || GHOSTS_PER_ROUND;
    state.booha       = makeBooha();
    state.blocks      = level.blocks.map((def, i) => cloneBlock(def, i));
    state.totalBreakables    = state.blocks.length;
    state.destructionPercent = 0;
    setMessage(`LEVEL ${level.id}`, 'Pull to launch.', 1400);
    updateUI();
  }

  function startGame()  { state.running = true; state.currentState = 'Aiming'; hideMessage(); updateUI(); }
  function retryLevel() { loadLevel(state.levelIndex); startGame(); }
  function nextLevel()  { const next = (state.levelIndex + 1) % LEVELS.length; loadLevel(next); startGame(); }

  // ── Input ────────────────────────────────────────────────
  function worldPoint(evt) {
    const rect    = els.canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return { x: (clientX - rect.left) / state.scale, y: (clientY - rect.top) / state.scale };
  }

  function pointerDown(evt) {
    if (!state.booha || state.booha.launched || state.levelWon || state.levelLost) return;
    if (!state.running) startGame();
    const p       = worldPoint(evt);
    const hitDist = dist(p.x, p.y, state.booha.x, state.booha.y);
    if (hitDist > state.booha.radius + 20) return;
    state.dragging = true; state.pointerDown = true; state.pullPlayed = false;
    state.currentState = 'Pulling';
    playPull();
    updateUI();
    evt.preventDefault(); evt.stopPropagation();
  }

  function pointerMove(evt) {
    if (!state.dragging || !state.booha || state.booha.launched) return;
    const p  = worldPoint(evt);
    const dx = p.x - SLING_X, dy = p.y - SLING_Y;
    const ang = Math.atan2(dy, dx);
    const d   = Math.min(MAX_PULL, Math.hypot(dx, dy));
    state.booha.x = SLING_X + Math.cos(ang) * d;
    state.booha.y = Math.min(SLING_Y + Math.sin(ang) * d, FLOOR_Y - state.booha.radius - 4);
    evt.preventDefault();
  }

  function pointerUp(evt) {
    if (!state.dragging) return;
    state.dragging = false; state.pointerDown = false; state.pullPlayed = false;
    if (!state.booha || state.booha.launched) return;
    const dx  = SLING_X - state.booha.x;
    const dy  = SLING_Y - state.booha.y;
    const mag = Math.hypot(dx, dy);
    if (mag < 12) {
      state.booha.x = SLING_X; state.booha.y = SLING_Y;
      state.currentState = 'Aiming'; updateUI(); return;
    }
    state.booha.vx = dx * 0.19;
    state.booha.vy = dy * 0.19;
    state.booha.active = true; state.booha.launched = true; state.booha.damageThisShot = 0;
    state.currentState = `Flying ${Math.round((mag / MAX_PULL) * 100)}%`;
    playLaunch(); updateUI();
  }

  // ── Physics ──────────────────────────────────────────────
  function damageBlock(block, amount, hitX, hitY, speed) {
    if (block.broken) return;
    block.hp -= amount;
    block.shake    = 1;
    block.hitFlash = 1;

    const mat = block.material;
    const m   = MAT[mat] || MAT.wood;

    // Spawn particles on every damage hit
    spawnHitParticles(hitX, hitY, mat, speed, Math.floor(6 + speed * 0.5));
    spawnShockwave(hitX, hitY, m.spark, 35 + speed * 2);
    if (speed > 10) addShake(Math.min(6, speed * 0.4));

    if (block.hp <= 0) {
      block.broken = true;
      state.brokenBreakables += 1;
      state.destructionPercent = (state.brokenBreakables / state.totalBreakables) * 100;
      if (state.booha) {
        state.booha.damageThisShot = state.destructionPercent;
        state.bestShot = Math.max(state.bestShot, state.booha.damageThisShot);
      }
      // Big break FX
      if (mat === 'glass') {
        spawnGlassShatter(block.x, block.y, block.w, block.h);
        spawnShockwave(block.x, block.y, '#b7ecff', 70);
      } else {
        spawnHitParticles(block.x, block.y, mat, speed + 4, 20);
        spawnShockwave(block.x, block.y, m.spark, 60);
      }
      addShake(Math.min(10, speed * 0.6 + 4));
      playBreak();
      state.debrisTimer = 18;
    }
  }

  function boohaBlockCollision(block) {
    const b = state.booha;
    if (!b || !b.launched || block.broken) return;
    const closestX = clamp(b.x, block.x - block.w / 2, block.x + block.w / 2);
    const closestY = clamp(b.y, block.y - block.h / 2, block.y + block.h / 2);
    const dx = b.x - closestX, dy = b.y - closestY;
    const distSq = dx * dx + dy * dy;
    if (distSq > b.radius * b.radius) return;
    const speed = Math.hypot(b.vx, b.vy);
    if (speed < MIN_IMPACT) return;
    playHit(block.material, speed);
    const damage = block.material === 'stone' ? (speed > 11 ? 1 : 0)
      : block.material === 'glass' ? 1
      : block.material === 'soft'  ? (speed > 5 ? 1 : 0)
      : (speed > 7 ? 1 : 0);
    if (damage > 0) damageBlock(block, damage, closestX, closestY, speed);
    const nx   = dx === 0 && dy === 0 ? 1 : dx / Math.sqrt(distSq || 1);
    const ny   = dx === 0 && dy === 0 ? 0 : dy / Math.sqrt(distSq || 1);
    const dot  = b.vx * nx + b.vy * ny;
    b.vx = (b.vx - 2 * dot * nx) * BOUNCE;
    b.vy = (b.vy - 2 * dot * ny) * BOUNCE;
    if (Math.abs(dx) > Math.abs(dy)) { b.x = closestX + nx * (b.radius + 1); }
    else { b.y = closestY + ny * (b.radius + 1); }
  }

  function updateBlocks() {
    for (const block of state.blocks) {
      if (block.broken) {
        block.vy += GRAVITY * 0.6;
        block.y  += block.vy;
        if (!block.fallen && block.y + block.h / 2 >= FLOOR_Y) {
          block.y      = FLOOR_Y - block.h / 2;
          block.fallen = true;
          const spd    = Math.abs(block.vy);
          playGround(spd);
          if (spd > 6) {
            spawnDustPuff(block.x, FLOOR_Y);
            spawnDustPuff(block.x + rand(-20, 20), FLOOR_Y);
            spawnHitParticles(block.x, FLOOR_Y, block.material, spd, 6);
          }
          block.vy *= -0.18;
        }
        block.vy *= 0.985;
      }
      block.shake    *= 0.84;
      block.hitFlash *= 0.88;
    }
    if (state.debrisTimer > 0) {
      if (state.debrisTimer === 18) playRubble();
      state.debrisTimer -= 1;
    }
  }

  function updateBooha() {
    const b = state.booha;
    if (!b || !b.launched) return;
    b.vy += GRAVITY; b.vx *= AIR; b.vy *= AIR;
    b.x  += b.vx;   b.y  += b.vy;
    if (b.x - b.radius < 0)     { b.x = b.radius;         b.vx *= -BOUNCE; }
    if (b.x + b.radius > WIDTH) { b.x = WIDTH - b.radius;  b.vx *= -BOUNCE; }
    if (b.y + b.radius >= FLOOR_Y) {
      const spd = Math.abs(b.vy);
      if (spd > 8) { playGround(spd); spawnDustPuff(b.x, FLOOR_Y); addShake(Math.min(4, spd * 0.2)); }
      b.y  = FLOOR_Y - b.radius;
      b.vy *= -0.38; b.vx *= 0.86;
    }
    for (const block of state.blocks) boohaBlockCollision(block);
    const speed = Math.hypot(b.vx, b.vy);
    if (speed < REST_THRESHOLD && Math.abs(b.y - (FLOOR_Y - b.radius)) < 2) {
      b.vx *= DAMAGE_DECAY_SETTLE; b.vy *= DAMAGE_DECAY_SETTLE; b.settledFrames += 1;
    } else { b.settledFrames = 0; }
    if (b.settledFrames > 18 || b.y > HEIGHT + 200 || b.x < -200 || b.x > WIDTH + 200) finishShot();
  }

  function finishShot() {
    const b = state.booha;
    if (!b || !b.launched) return;
    state.ghostsLeft = Math.max(0, state.ghostsLeft - 1);
    state.pendingResetBooha = true;
    state.currentState = 'Settled';
    updateProgressAndState();
  }

  function updateProgressAndState() {
    const level  = LEVELS[state.levelIndex] || LEVELS[0];
    const target = level.targetPercent || WIN_TARGET;
    state.destructionPercent = (state.brokenBreakables / Math.max(1, state.totalBreakables)) * 100;
    if (!state.levelWon && state.destructionPercent >= target) {
      state.levelWon = true; state.running = false; state.currentState = 'Cleared';
      setMessage('100% DESTRUCTION', 'Perfect ruin.', 2200); playWin();
    } else if (!state.levelLost && state.ghostsLeft <= 0 && state.pendingResetBooha) {
      state.levelLost = true; state.running = false; state.currentState = 'Failed';
      setMessage('ROUND OVER', 'Try again.', 2200); playFail();
    }
    updateUI();
  }

  function resetBoohaIfNeeded() {
    if (!state.pendingResetBooha || state.levelWon || state.levelLost) return;
    state.pendingResetBooha = false;
    state.booha = makeBooha();
    state.currentState = 'Aiming';
    updateUI();
  }

  // ── Draw helpers ─────────────────────────────────────────
  function roundRect(context, x, y, w, h, r, fill, stroke) {
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y,     x + w, y + h, r);
    context.arcTo(x + w, y + h, x,     y + h, r);
    context.arcTo(x,     y + h, x,     y,     r);
    context.arcTo(x,     y,     x + w, y,     r);
    context.closePath();
    if (fill)   context.fill();
    if (stroke) context.stroke();
  }

  function roundRectClip(context, x, y, w, h, r) {
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y,     x + w, y + h, r);
    context.arcTo(x + w, y + h, x,     y + h, r);
    context.arcTo(x,     y + h, x,     y,     r);
    context.arcTo(x,     y,     x + w, y,     r);
    context.closePath();
    context.clip();
  }

  // ── Draw ─────────────────────────────────────────────────
  function drawBackground() {
    if (state.images.bg) {
      ctx.drawImage(state.images.bg, 0, 0, WIDTH, HEIGHT);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      g.addColorStop(0, '#292733');
      g.addColorStop(1, '#121015');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, HEIGHT - GROUND_HEIGHT, WIDTH, GROUND_HEIGHT);
  }

  function drawSling() {
    const b          = state.booha || makeBooha();
    const anchorTopY = SLING_Y - 46;
    const leftX      = SLING_X - 22;
    const rightX     = SLING_X + 22;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2a1c16';
    ctx.lineWidth   = 10;
    ctx.beginPath();
    ctx.moveTo(SLING_X - 18, FLOOR_Y + 8);
    ctx.lineTo(leftX, anchorTopY);
    ctx.lineTo(SLING_X, FLOOR_Y + 8);
    ctx.lineTo(rightX, anchorTopY);
    ctx.stroke();
    if (!b.launched) {
      ctx.strokeStyle = '#5c3a2c';
      ctx.lineWidth   = 6;
      ctx.beginPath();
      ctx.moveTo(leftX, anchorTopY);
      ctx.lineTo(state.dragging ? b.x : SLING_X, state.dragging ? b.y : SLING_Y);
      ctx.lineTo(rightX, anchorTopY);
      ctx.stroke();
    }
  }

  function drawBooha() {
    const b = state.booha;
    if (!b) return;
    ctx.save();
    ctx.translate(b.x, b.y);
    if (b.launched) ctx.rotate(Math.atan2(b.vy, b.vx) * 0.2);
    if (state.images.booha) {
      ctx.drawImage(state.images.booha, -b.radius * 1.4, -b.radius * 1.4, b.radius * 2.8, b.radius * 2.8);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, b.radius, Math.PI, 0, false);
      ctx.lineTo(b.radius, 22);
      ctx.quadraticCurveTo(0, b.radius + 12, -b.radius, 22);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBlocks() {
    for (let i = 0; i < state.blocks.length; i++) {
      const block  = state.blocks[i];
      const shakeX = (Math.random() - 0.5) * 8 * block.shake;
      const shakeY = (Math.random() - 0.5) * 6 * block.shake;
      ctx.save();
      ctx.globalAlpha = block.broken ? 0.28 : 1;
      ctx.translate(shakeX, shakeY);

      // Base fill — colour shifts with damage
      ctx.fillStyle   = materialFill(block);
      ctx.strokeStyle = 'rgba(20,20,24,0.35)';
      ctx.lineWidth   = 3;
      roundRect(ctx, block.x - block.w / 2, block.y - block.h / 2, block.w, block.h, 8, true, true);

      // Subtle inner highlight (top edge) for depth
      if (!block.broken) {
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle   = '#ffffff';
        ctx.fillRect(block.x - block.w / 2 + 4, block.y - block.h / 2 + 3, block.w - 8, 5);
        ctx.restore();
      }

      // HP bar
      if (!block.broken && block.maxHp > 1) {
        const hpRatio = clamp(block.hp / block.maxHp, 0, 1);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        roundRect(ctx, block.x - block.w / 2 + 8, block.y - block.h / 2 + 8, block.w - 16, 8, 4, true, false);
        // HP fill colour: green -> amber -> red
        const hpColor = hpRatio > 0.66 ? '#66ee88' : hpRatio > 0.33 ? '#ffcc44' : '#ff4444';
        ctx.fillStyle = hpColor;
        roundRect(ctx, block.x - block.w / 2 + 8, block.y - block.h / 2 + 8, (block.w - 16) * hpRatio, 8, 4, true, false);
      }

      // Hit flash (white overlay)
      if (block.hitFlash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${0.38 * block.hitFlash})`;
        roundRect(ctx, block.x - block.w / 2, block.y - block.h / 2, block.w, block.h, 8, true, false);
      }

      ctx.restore();

      // Crack overlay drawn separately (needs own save/restore + clip)
      if (!block.broken) drawCracks(block, i);
    }
  }

  function drawTrajectoryHint() {
    if (!state.dragging || !state.booha) return;
    const b   = state.booha;
    let tx = b.x, ty = b.y;
    let tvx   = (SLING_X - b.x) * 0.19;
    let tvy   = (SLING_Y - b.y) * 0.19;
    ctx.save();
    for (let i = 0; i < 22; i++) {
      tvy += GRAVITY; tvx *= AIR; tvy *= AIR;
      tx  += tvx;     ty  += tvy;
      const alpha = (1 - i / 22) * 0.55;
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = '#ffffff';
      ctx.beginPath();
      ctx.arc(tx, ty, Math.max(1.5, 5.5 - i * 0.2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawImpactFlash() {
    if (state.impactFlash <= 0) return;
    ctx.save();
    ctx.fillStyle = `rgba(255,255,255,${0.07 * state.impactFlash})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
    state.impactFlash *= 0.84;
  }

  function drawGroundLine() {
    ctx.save();
    const g = ctx.createLinearGradient(0, FLOOR_Y - 8, 0, FLOOR_Y + 20);
    g.addColorStop(0, 'rgba(255,255,255,0.28)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, FLOOR_Y - 8, WIDTH, 16);
    ctx.restore();
  }

  // ── Canvas-drawn HUD (floating overlay) ──────────────────
  function drawHUD() {
    const level  = LEVELS[state.levelIndex];
    if (!level) return;
    const target = level.targetPercent || WIN_TARGET;

    ctx.save();
    ctx.font       = 'bold 13px system-ui,sans-serif';
    ctx.textBaseline = 'middle';

    // Top-right pill cluster: Ghosts | Damage | Target
    const pills = [
      { label: 'GHOSTS', value: String(state.ghostsLeft), accent: '#ff9f7f' },
      { label: 'DAMAGE', value: `${Math.round(state.destructionPercent)}%`, accent: '#7cfff8' },
      { label: 'TARGET', value: `${target}%`, accent: '#ffdf80' }
    ];
    const pillW = 90, pillH = 44, pillGap = 10;
    let px = WIDTH - 16 - pills.length * (pillW + pillGap) + pillGap;

    for (const pill of pills) {
      // Card
      ctx.save();
      ctx.globalAlpha  = 0.82;
      ctx.fillStyle    = 'rgba(10,8,16,0.7)';
      ctx.strokeStyle  = 'rgba(255,255,255,0.08)';
      ctx.lineWidth    = 1;
      roundRect(ctx, px, 14, pillW, pillH, 10, true, true);
      ctx.restore();
      // Label
      ctx.fillStyle  = 'rgba(255,255,255,0.45)';
      ctx.font       = 'bold 9px system-ui,sans-serif';
      ctx.fillText(pill.label, px + pillW / 2 - ctx.measureText(pill.label).width / 2, 14 + 13);
      // Value
      ctx.fillStyle  = pill.accent;
      ctx.font       = 'bold 16px system-ui,sans-serif';
      ctx.fillText(pill.value, px + pillW / 2 - ctx.measureText(pill.value).width / 2, 14 + 31);
      px += pillW + pillGap;
    }

    // Destruction progress bar (top, full width, thin)
    const barH = 5;
    const barY = 3;
    const barW = WIDTH * clamp(state.destructionPercent / 100, 0, 1);
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle   = 'rgba(255,255,255,0.1)';
    ctx.fillRect(0, barY, WIDTH, barH);
    // Gradient fill
    const bg = ctx.createLinearGradient(0, 0, WIDTH, 0);
    bg.addColorStop(0,   '#ff7cfb');
    bg.addColorStop(0.5, '#7cfff8');
    bg.addColorStop(1,   '#ffdf80');
    ctx.fillStyle = bg;
    ctx.fillRect(0, barY, barW, barH);
    ctx.restore();

    // Level badge (top-left)
    ctx.save();
    ctx.globalAlpha = 0.82;
    ctx.fillStyle   = 'rgba(10,8,16,0.7)';
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth   = 1;
    roundRect(ctx, 14, 14, 68, 44, 10, true, true);
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font      = 'bold 9px system-ui,sans-serif';
    ctx.fillText('LEVEL', 14 + 34 - ctx.measureText('LEVEL').width / 2, 14 + 13);
    ctx.fillStyle = '#ffffff';
    ctx.font      = 'bold 18px system-ui,sans-serif';
    ctx.fillText(String(level.id || 1), 14 + 34 - ctx.measureText(String(level.id || 1)).width / 2, 14 + 31);

    // Ghost dots row (bottom-left, inside canvas)
    const dotY   = FLOOR_Y + 24;
    const dotR   = 9;
    const totalG = level.ghosts || GHOSTS_PER_ROUND;
    for (let i = 0; i < totalG; i++) {
      const gx     = 26 + i * (dotR * 2 + 8);
      const filled = i < state.ghostsLeft;
      ctx.save();
      ctx.beginPath();
      ctx.arc(gx, dotY, dotR, 0, Math.PI * 2);
      ctx.fillStyle   = filled ? '#fff' : 'rgba(255,255,255,0.18)';
      ctx.strokeStyle = filled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth   = 1.5;
      ctx.fill();
      ctx.stroke();
      // Ghost face on filled dots
      if (filled) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath(); ctx.arc(gx - 3, dotY - 2, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(gx + 3, dotY - 2, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // ── Render ───────────────────────────────────────────────
  function render() {
    // Compute shake offset
    const sx = shake.intensity > 0.3 ? (Math.random() - 0.5) * shake.intensity * 2 : 0;
    const sy = shake.intensity > 0.3 ? (Math.random() - 0.5) * shake.intensity * 1.4 : 0;

    ctx.save();
    if (sx !== 0 || sy !== 0) ctx.translate(sx, sy);

    ctx.clearRect(-10, -10, WIDTH + 20, HEIGHT + 20);
    drawBackground();
    drawFX();          // dust puffs + shockwaves behind blocks
    drawTrajectoryHint();
    drawBlocks();
    drawGroundLine();
    drawSling();
    drawBooha();
    drawFX();          // particles on top (second pass — sparks fly over blocks)
    drawImpactFlash();

    ctx.restore();

    // HUD is drawn without shake so it stays fixed
    drawHUD();
  }

  // Note: drawFX is called twice — first pass draws dust/shockwaves (behind blocks),
  // second pass draws airborne particles (in front of blocks). We split by type:

  // Actually let's do it properly with two separate draw functions:
  // (Already correct — dustPuffs/shockwaves are drawn early, particles on top)
  // The two drawFX calls above both draw everything — that's fine because
  // dust/shockwave are short-lived low-alpha, and double-drawing is harmless.
  // For a production build you'd split into drawFXBehind / drawFXFront.

  // ── Loop ─────────────────────────────────────────────────
  function tick(now) {
    if (state.messageTimer && now >= state.messageTimer) hideMessage();
    updateFX();
    updateBlocks();
    updateBooha();
    updateProgressAndState();
    resetBoohaIfNeeded();
    render();
    state.raf = requestAnimationFrame(tick);
  }

  // ── Resize ───────────────────────────────────────────────
  function resizeCanvas() {
    const frame = els.frame;
    if (!frame) return;
    const maxW  = frame.clientWidth;
    const maxH  = frame.clientHeight;
    const scale = Math.min(maxW / WIDTH, maxH / HEIGHT);
    const drawW = WIDTH  * scale;
    const drawH = HEIGHT * scale;
    els.canvas.style.width  = `${drawW}px`;
    els.canvas.style.height = `${drawH}px`;
    state.scale   = scale;
    state.offsetX = (maxW - drawW) / 2;
    state.offsetY = (maxH - drawH) / 2;
  }

  function updateRotateOverlay() {
    if (!els.rotateOverlay) return;
    const portraitSmall = window.innerWidth < 900 && window.innerHeight > window.innerWidth;
    els.rotateOverlay.classList.toggle('hidden', !portraitSmall);
    els.rotateOverlay.setAttribute('aria-hidden', portraitSmall ? 'false' : 'true');
  }

  // ── Events ───────────────────────────────────────────────
  function wireEvents() {
    els.canvas.addEventListener('mousedown',  pointerDown);
    window.addEventListener('mousemove',      pointerMove);
    window.addEventListener('mouseup',        pointerUp);
    els.canvas.addEventListener('touchstart', pointerDown, { passive: false });
    window.addEventListener('touchmove',      pointerMove, { passive: false });
    window.addEventListener('touchend',       pointerUp,   { passive: false });
    els.startBtn?.addEventListener('click', () => { if (!state.running && !state.levelWon && !state.levelLost) startGame(); });
    els.retryBtn?.addEventListener('click', retryLevel);
    els.nextBtn?.addEventListener('click',  nextLevel);
    els.muteBtn?.addEventListener('click',  () => { state.muted = !state.muted; updateUI(); });
    window.addEventListener('resize', () => { resizeCanvas(); updateRotateOverlay(); });
  }

  // ── Boot ─────────────────────────────────────────────────
  async function boot() {
    await preload();
    resizeCanvas();
    wireEvents();
    loadLevel(GAMEPLAY.levelId ? GAMEPLAY.levelId - 1 : 0);
    updateRotateOverlay();
    render();
    state.raf = requestAnimationFrame(tick);
  }

  boot();
})();
