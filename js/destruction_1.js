
(() => {
  'use strict';

  const CFG = window.BOOHA_DESTRUCTION_CONFIG || {};
  const UI_IDS = CFG.ui || {};
  const BTN_IDS = CFG.buttons || {};
  const ASSETS = CFG.assets || {};
  const AUDIO = CFG.audio || {};
  const GAMEPLAY = CFG.gameplay || {};

  const WIDTH = GAMEPLAY.width || 1280;
  const HEIGHT = GAMEPLAY.height || 720;
  const GRAVITY = 0.48;
  const AIR = 0.999;
  const BOUNCE = 0.72;
  const FLOOR_Y = HEIGHT - 100;
  const SLING_X = 212;
  const SLING_Y = FLOOR_Y - 80;
  const MAX_PULL = 130;
  const BOOHA_RADIUS = 34;
  const GROUND_HEIGHT = 54;
  const MIN_IMPACT = 3.8;
  const WIN_TARGET = GAMEPLAY.targetPercent || 100;
  const GHOSTS_PER_ROUND = GAMEPLAY.ghostsPerRound || 3;
  const DAMAGE_DECAY_SETTLE = 0.985;
  const REST_THRESHOLD = 0.35;
  const HIT_COOLDOWN_MS = 90;

  const $ = (id) => document.getElementById(id);

  const els = {
    canvas: $(CFG.canvasId),
    frame: $(CFG.frameId),
    levelLabel: $(UI_IDS.levelLabel),
    ghostsLabel: $(UI_IDS.ghostsLabel),
    damageLabel: $(UI_IDS.damageLabel),
    targetLabel: $(UI_IDS.targetLabel),
    blocksLabel: $(UI_IDS.blocksLabel),
    progressText: $(UI_IDS.progressText),
    progressFill: $(UI_IDS.progressFill),
    stateLabel: $(UI_IDS.stateLabel),
    materialLabel: $(UI_IDS.materialLabel),
    shotLabel: $(UI_IDS.shotLabel),
    centerMessage: $(UI_IDS.centerMessage),
    centerMessageTitle: $(UI_IDS.centerMessageTitle),
    centerMessageSub: $(UI_IDS.centerMessageSub),
    rotateOverlay: $(UI_IDS.rotateOverlay),
    startBtn: $(BTN_IDS.start),
    retryBtn: $(BTN_IDS.retry),
    nextBtn: $(BTN_IDS.next),
    muteBtn: $(BTN_IDS.mute)
  };

  if (!els.canvas) {
    console.error('Booha Destruction: canvas not found.');
    return;
  }

  const ctx = els.canvas.getContext('2d');
  els.canvas.width = WIDTH;
  els.canvas.height = HEIGHT;

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
  if (!LEVELS.length) {
    console.error('Booha Destruction: no levels found in window.BOOHA_DESTRUCTION_LEVELS');
  }

  // ── Images ──────────────────────────────────────────────
  function makeImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function preload() {
    const [bg, booha] = await Promise.all([
      makeImage(ASSETS.background),
      makeImage(ASSETS.booha)
    ]);
    state.images.bg = bg;
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

  function playPull() {
    if (state.pullPlayed) return;
    state.pullPlayed = true;
    playSFX(AUDIO.pull, 0.5, 0.98 + Math.random() * 0.06);
  }

  function playLaunch() {
    playSFX(AUDIO.launch, 0.95, 0.98 + Math.random() * 0.06);
    setTimeout(() => playSFX(AUDIO.booha, 0.82, 0.96 + Math.random() * 0.08), 60);
  }

  function playHit(material, speed) {
    const now = performance.now();
    if (now - state.lastHitAt < HIT_COOLDOWN_MS) return;
    state.lastHitAt = now;
    let src = AUDIO.wood;
    if (material === 'stone') src = AUDIO.stone;
    if (material === 'glass') src = AUDIO.glass;
    if (material === 'soft')  src = AUDIO.soft;
    const volume = Math.max(0.22, Math.min(1, speed / 14));
    const rate = 0.92 + Math.random() * 0.18;
    playSFX(src, volume, rate);
    state.currentMaterial = capitalize(material);
    state.impactFlash = 1;
  }

  function playBreak()  { playSFX(AUDIO.break,  0.95, 0.95 + Math.random() * 0.08); }
  function playRubble() {
    playSFX(AUDIO.rubble, 0.58, 0.98 + Math.random() * 0.08);
    setTimeout(() => playSFX(AUDIO.rubble, 0.35, 1.06), 120);
  }
  function playGround(speed) {
    if (speed < 12) return;
    playSFX(AUDIO.ground, Math.min(0.9, speed / 22), 0.96 + Math.random() * 0.08);
  }
  function playWin()  { playSFX(AUDIO.win,  1,    1); }
  function playFail() { playSFX(AUDIO.fail, 0.88, 1); }

  // ── Helpers ──────────────────────────────────────────────
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'; }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }

  // ── UI ───────────────────────────────────────────────────
  function setMessage(title, sub, ms = 0) {
    if (!els.centerMessage || !els.centerMessageTitle || !els.centerMessageSub) return;
    els.centerMessageTitle.textContent = title;
    els.centerMessageSub.textContent = sub;
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
    if (els.levelLabel)   els.levelLabel.textContent   = String(level.id || 1);
    if (els.ghostsLabel)  els.ghostsLabel.textContent  = String(state.ghostsLeft);
    if (els.damageLabel)  els.damageLabel.textContent  = `${Math.round(state.destructionPercent)}%`;
    if (els.targetLabel)  els.targetLabel.textContent  = `${target}%`;
    if (els.blocksLabel)  els.blocksLabel.textContent  = String(state.blocks.filter(b => !b.broken).length);
    if (els.progressText) els.progressText.textContent = `${Math.round(state.destructionPercent)}%`;
    if (els.progressFill) els.progressFill.style.width = `${clamp(state.destructionPercent, 0, 100)}%`;
    if (els.stateLabel)   els.stateLabel.textContent   = state.currentState;
    if (els.materialLabel) els.materialLabel.textContent = state.currentMaterial;
    if (els.shotLabel)    els.shotLabel.textContent    = state.bestShot > 0 ? `${Math.round(state.bestShot)}%` : '—';
    setButtonsForState();
  }

  // ── Game objects ─────────────────────────────────────────
  function makeBooha() {
    return {
      active: false,
      launched: false,
      x: SLING_X,
      y: SLING_Y,
      vx: 0,
      vy: 0,
      radius: BOOHA_RADIUS,
      settledFrames: 0,
      damageThisShot: 0
    };
  }

  function cloneBlock(def) {
    const y = typeof def.floorOffset === 'number' ? FLOOR_Y - def.floorOffset : def.y;
    return {
      x: def.x, y,
      w: def.w, h: def.h,
      material: def.material || 'wood',
      hp: def.hp || 1,
      maxHp: def.hp || 1,
      broken: false,
      shake: 0, vy: 0,
      fallen: false,
      hitFlash: 0,
      points: 100
    };
  }

  // ── Level management ─────────────────────────────────────
  function resetRoundState() {
    state.pointerDown = false;
    state.dragging = false;
    state.pullPlayed = false;
    state.levelWon = false;
    state.levelLost = false;
    state.bestShot = 0;
    state.currentMaterial = '—';
    state.currentState = 'Waiting';
    state.destructionPercent = 0;
    state.brokenBreakables = 0;
    state.debrisTimer = 0;
    state.pendingResetBooha = false;
  }

  function loadLevel(index) {
    state.levelIndex = clamp(index, 0, LEVELS.length - 1);
    const level = LEVELS[state.levelIndex];
    resetRoundState();
    state.running = false;
    state.ghostsLeft = level.ghosts || GHOSTS_PER_ROUND;
    state.booha = makeBooha();
    state.blocks = level.blocks.map(cloneBlock);
    state.totalBreakables = state.blocks.length;
    state.destructionPercent = 0;
    setMessage(`LEVEL ${level.id}`, 'Pull to launch.', 1400);
    updateUI();
  }

  function startGame() {
    state.running = true;
    state.currentState = 'Aiming';
    hideMessage();
    updateUI();
  }

  function retryLevel() { loadLevel(state.levelIndex); startGame(); }
  function nextLevel() {
    const next = (state.levelIndex + 1) % LEVELS.length;
    loadLevel(next);
    startGame();
  }

  // ── Input ────────────────────────────────────────────────
  function worldPoint(evt) {
    const rect = els.canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: (clientX - rect.left) / state.scale,
      y: (clientY - rect.top)  / state.scale
    };
  }

  function pointerDown(evt) {
    if (!state.booha || state.booha.launched || state.levelWon || state.levelLost) return;
    if (!state.running) startGame();
    const p = worldPoint(evt);
    state.pointer = p;
    const hitDist   = dist(p.x, p.y, state.booha.x, state.booha.y);
    const hitRadius = state.booha.radius + 20;

    console.log('[SLING]', {
      pointer: p,
      booha: { x: state.booha.x, y: state.booha.y },
      hitDist, hitRadius,
      hit: hitDist <= hitRadius,
      scale: state.scale
    });

    if (hitDist <= hitRadius) {
      state.pointerDown = true;
      state.dragging = true;
      state.currentState = 'Pulling';
      playPull();
      updateUI();
      evt.preventDefault?.();
    }
  }

 function pointerMove(evt) {
  if (!state.dragging || !state.booha || state.booha.launched) return; // ← add launched check
  const p = worldPoint(evt);
  state.pointer = p;

  const dx = p.x - SLING_X;
  const dy = p.y - SLING_Y;
  const ang = Math.atan2(dy, dx);
  const d = Math.min(MAX_PULL, Math.hypot(dx, dy));

  const newX = SLING_X + Math.cos(ang) * d;
  const newY = SLING_Y + Math.sin(ang) * d;

  // Don't let Booha go below the floor while in slingshot
  state.booha.x = newX;
  state.booha.y = Math.min(newY, FLOOR_Y - state.booha.radius - 4);

  evt.preventDefault?.();
}
  
 function pointerUp(evt) {
  if (!state.dragging || !state.booha) return;
  state.dragging = false;      // ← stop pointerMove from moving him
  state.pointerDown = false;
  state.pullPlayed = false;

  const dx = SLING_X - state.booha.x;
  const dy = SLING_Y - state.booha.y;
  const mag = Math.hypot(dx, dy);

  console.log('[RELEASE]', { mag, bx: state.booha.x, by: state.booha.y });

  if (mag < 12) {
    state.booha.x = SLING_X;
    state.booha.y = SLING_Y;
    state.currentState = 'Aiming';
    updateUI();
    return;
  }

  const power = mag / MAX_PULL;
  state.booha.vx = dx * 0.19;
  state.booha.vy = dy * 0.19;
  state.booha.active = true;
  state.booha.launched = true;
  state.booha.damageThisShot = 0;
  state.currentState = `Flying ${Math.round(power * 100)}%`;
  playLaunch();
  updateUI();
}

  // ── Physics ──────────────────────────────────────────────
  function damageBlock(block, amount) {
    if (block.broken) return;
    block.hp -= amount;
    block.shake = 1;
    block.hitFlash = 1;
    if (block.hp <= 0) {
      block.broken = true;
      state.brokenBreakables += 1;
      state.destructionPercent = (state.brokenBreakables / state.totalBreakables) * 100;
      if (state.booha) {
        state.booha.damageThisShot = state.destructionPercent;
        state.bestShot = Math.max(state.bestShot, state.booha.damageThisShot);
      }
      playBreak();
      state.debrisTimer = 18;
    }
  }

  function boohaBlockCollision(block) {
    const b = state.booha;
    if (!b || !b.launched || block.broken) return;
    const closestX = clamp(b.x, block.x - block.w / 2, block.x + block.w / 2);
    const closestY = clamp(b.y, block.y - block.h / 2, block.y + block.h / 2);
    const dx = b.x - closestX;
    const dy = b.y - closestY;
    const distSq = dx * dx + dy * dy;
    if (distSq > b.radius * b.radius) return;
    const speed = Math.hypot(b.vx, b.vy);
    if (speed < MIN_IMPACT) return;
    playHit(block.material, speed);
    const damage = block.material === 'stone' ? (speed > 11 ? 1 : 0)
      : block.material === 'glass'  ? 1
      : block.material === 'soft'   ? (speed > 5 ? 1 : 0)
      : (speed > 7 ? 1 : 0);
    if (damage > 0) damageBlock(block, damage);
    const nx = dx === 0 && dy === 0 ? 1 : dx / Math.sqrt(distSq || 1);
    const ny = dx === 0 && dy === 0 ? 0 : dy / Math.sqrt(distSq || 1);
    const dot = b.vx * nx + b.vy * ny;
    b.vx = (b.vx - 2 * dot * nx) * BOUNCE;
    b.vy = (b.vy - 2 * dot * ny) * BOUNCE;
    if (Math.abs(dx) > Math.abs(dy)) {
      b.x = closestX + nx * (b.radius + 1);
    } else {
      b.y = closestY + ny * (b.radius + 1);
    }
  }

  function updateBlocks() {
    for (const block of state.blocks) {
      if (block.broken) {
        block.vy += GRAVITY * 0.6;
        block.y += block.vy;
        if (!block.fallen && block.y + block.h / 2 >= FLOOR_Y) {
          block.y = FLOOR_Y - block.h / 2;
          block.fallen = true;
          playGround(Math.abs(block.vy));
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
    b.vy += GRAVITY;
    b.vx *= AIR;
    b.vy *= AIR;
    b.x += b.vx;
    b.y += b.vy;
    if (b.x - b.radius < 0)      { b.x = b.radius;          b.vx *= -BOUNCE; }
    if (b.x + b.radius > WIDTH)  { b.x = WIDTH - b.radius;  b.vx *= -BOUNCE; }
    if (b.y + b.radius >= FLOOR_Y) {
      if (Math.abs(b.vy) > 8) playGround(Math.abs(b.vy));
      b.y = FLOOR_Y - b.radius;
      b.vy *= -0.38;
      b.vx *= 0.86;
    }
    for (const block of state.blocks) boohaBlockCollision(block);
    const speed = Math.hypot(b.vx, b.vy);
    if (speed < REST_THRESHOLD && Math.abs(b.y - (FLOOR_Y - b.radius)) < 2) {
      b.vx *= DAMAGE_DECAY_SETTLE;
      b.vy *= DAMAGE_DECAY_SETTLE;
      b.settledFrames += 1;
    } else {
      b.settledFrames = 0;
    }
    if (b.settledFrames > 18 || b.y > HEIGHT + 200 || b.x < -200 || b.x > WIDTH + 200) {
      finishShot();
    }
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
    const level = LEVELS[state.levelIndex] || LEVELS[0];
    const target = level.targetPercent || WIN_TARGET;
    state.destructionPercent = (state.brokenBreakables / Math.max(1, state.totalBreakables)) * 100;
    if (!state.levelWon && state.destructionPercent >= target) {
      state.levelWon = true;
      state.running = false;
      state.currentState = 'Cleared';
      setMessage('100% DESTRUCTION', 'Perfect ruin.', 2200);
      playWin();
    } else if (!state.levelLost && state.ghostsLeft <= 0 && state.pendingResetBooha) {
      state.levelLost = true;
      state.running = false;
      state.currentState = 'Failed';
      setMessage('ROUND OVER', 'Try again.', 2200);
      playFail();
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
    const b = state.booha || makeBooha();
    const anchorTopY = SLING_Y - 46;
    const leftX  = SLING_X - 22;
    const rightX = SLING_X + 22;

    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2a1c16';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(SLING_X - 18, FLOOR_Y + 8);
    ctx.lineTo(leftX,  anchorTopY);
    ctx.lineTo(SLING_X, FLOOR_Y + 8);
    ctx.lineTo(rightX, anchorTopY);
    ctx.stroke();

    ctx.strokeStyle = '#5c3a2c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(leftX, anchorTopY);
    ctx.lineTo(state.dragging || b.launched ? b.x : SLING_X, state.dragging || b.launched ? b.y : SLING_Y);
    ctx.lineTo(rightX, anchorTopY);
    ctx.stroke();
  }

  function drawBooha() {
    const b = state.booha;
    if (!b) return;

    // DEBUG: hit zone ring — remove once slingshot is confirmed working
    ctx.save();
    ctx.strokeStyle = 'rgba(255,0,0,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius + 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

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

  function materialFill(material) {
    if (material === 'stone') return '#78808f';
    if (material === 'glass') return '#b7ecff';
    if (material === 'soft')  return '#f6b0da';
    return '#b97c4d';
  }

  function drawBlocks() {
    for (const block of state.blocks) {
      const shakeX = (Math.random() - 0.5) * 8 * block.shake;
      const shakeY = (Math.random() - 0.5) * 6 * block.shake;
      ctx.save();
      ctx.globalAlpha = block.broken ? 0.35 : 1;
      ctx.translate(shakeX, shakeY);
      ctx.fillStyle = materialFill(block.material);
      ctx.strokeStyle = 'rgba(20,20,24,0.35)';
      ctx.lineWidth = 3;
      roundRect(ctx, block.x - block.w / 2, block.y - block.h / 2, block.w, block.h, 8, true, true);
      if (block.hitFlash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${0.28 * block.hitFlash})`;
        roundRect(ctx, block.x - block.w / 2, block.y - block.h / 2, block.w, block.h, 8, true, false);
      }
      if (!block.broken && block.maxHp > 1) {
        const hpRatio = clamp(block.hp / block.maxHp, 0, 1);
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        roundRect(ctx, block.x - block.w / 2 + 8, block.y - block.h / 2 + 8, block.w - 16, 8, 4, true, false);
        ctx.fillStyle = 'rgba(255,255,255,0.72)';
        roundRect(ctx, block.x - block.w / 2 + 8, block.y - block.h / 2 + 8, (block.w - 16) * hpRatio, 8, 4, true, false);
      }
      ctx.restore();
    }
  }

  function drawTrajectoryHint() {
    if (!state.dragging || !state.booha) return;
    const b = state.booha;
    let tx = b.x, ty = b.y;
    let tvx = (SLING_X - b.x) * 0.19;
    let tvy = (SLING_Y - b.y) * 0.19;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (let i = 0; i < 18; i++) {
      tvy += GRAVITY; tvx *= AIR; tvy *= AIR;
      tx += tvx; ty += tvy;
      ctx.beginPath();
      ctx.arc(tx, ty, Math.max(2, 6 - i * 0.22), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawImpactFlash() {
    if (state.impactFlash <= 0) return;
    ctx.save();
    ctx.fillStyle = `rgba(255,255,255,${0.08 * state.impactFlash})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
    state.impactFlash *= 0.86;
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

  function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground();
    drawTrajectoryHint();
    drawBlocks();
    drawGroundLine();
    drawSling();
    drawBooha();
    drawImpactFlash();
  }

  // ── Loop ─────────────────────────────────────────────────
  function tick(now) {
    if (state.messageTimer && now >= state.messageTimer) hideMessage();
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
    els.canvas.addEventListener('mousedown', pointerDown);
    window.addEventListener('mousemove',  pointerMove);
    window.addEventListener('mouseup',    pointerUp);
    els.canvas.addEventListener('touchstart', pointerDown, { passive: false });
    window.addEventListener('touchmove',  pointerMove, { passive: false });
    window.addEventListener('touchend',   pointerUp,   { passive: false });

    els.startBtn?.addEventListener('click', () => {
      if (!state.running && !state.levelWon && !state.levelLost) startGame();
    });
    els.retryBtn?.addEventListener('click', retryLevel);
    els.nextBtn?.addEventListener('click',  nextLevel);
    els.muteBtn?.addEventListener('click',  () => { state.muted = !state.muted; updateUI(); });

    window.addEventListener('resize', () => { resizeCanvas(); updateRotateOverlay(); });
  }

  // ── Boot ─────────────────────────────────────────────────
  async function boot() {
    await preload();
    resizeCanvas();   // must be before wireEvents so scale is correct on first click
    wireEvents();
    loadLevel(GAMEPLAY.levelId ? GAMEPLAY.levelId - 1 : 0);
    updateRotateOverlay();
    render();
    state.raf = requestAnimationFrame(tick);
  }

  boot();
})();
