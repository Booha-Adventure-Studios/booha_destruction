(() => {
  'use strict';

  const CFG      = window.BOOHA_DESTRUCTION_CONFIG || {};
  const ASSETS   = CFG.assets   || {};
  const AUDIO    = CFG.audio    || {};
  const GAMEPLAY = CFG.gameplay || {};

  const WIDTH  = GAMEPLAY.width  || 1280;
  const HEIGHT = GAMEPLAY.height || 720;
  const GRAVITY             = 0.48;
  const AIR                 = 0.999;
  const BOUNCE              = 0.72;
  const FLOOR_Y             = HEIGHT - 80;
  const SLING_X             = 180;
  const SLING_Y             = FLOOR_Y - 120;
  const MAX_PULL            = 150;
  const BOOHA_RADIUS        = 34;
  const GROUND_HEIGHT       = 54;
  const MIN_IMPACT          = 3.8;
  const GHOSTS_PER_ROUND    = GAMEPLAY.ghostsPerRound || 3;
  const DAMAGE_DECAY_SETTLE = 0.985;
  const REST_THRESHOLD      = 0.35;
  const HIT_COOLDOWN_MS     = 90;
  const SETTLE_FRAMES_NEEDED = 35;   // frames at rest before confetti fires
  const NEXT_SHOT_DELAY_MS   = 900;  // ms after confetti before next booha
  const ROUND_ADVANCE_MS     = 3200; // ms on win/fail card before auto-advancing
  const TOTAL_ROUNDS         = (window.BOOHA_DESTRUCTION_LEVELS||[]).length;

  // ── Canvas setup ─────────────────────────────────────────
  const canvas = document.getElementById(CFG.canvasId);
  if (!canvas) { console.error('Booha: canvas not found'); return; }
  const ctx = canvas.getContext('2d');
  canvas.width  = WIDTH;
  canvas.height = HEIGHT;

  // ── GAME PHASE enum ──────────────────────────────────────
  // Controls what's drawn and what inputs do
  const PHASE = {
    TITLE:    'title',    // big START card
    PLAYING:  'playing',  // active gameplay
    WIN_CARD: 'win',      // round cleared card
    FAIL_CARD:'fail',     // round failed card
    BETWEEN:  'between',  // brief pause between shots
  };

  // ── FX pools ─────────────────────────────────────────────
  const particles  = [];
  const shockwaves = [];
  const dustPuffs  = [];
  const confetti   = [];
  const shake      = { intensity: 0, decay: 0.86 };

  // ── Web Audio pop SFX (no file needed) ───────────────────
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  function playPop(freq = 520, vol = 0.35, dur = 0.07) {
    try {
      const ac  = getAudioCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ac.currentTime + dur);
      gain.gain.setValueAtTime(vol, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + dur + 0.01);
    } catch(e) {}
  }
  function playCelebPop() {
    // Staggered pops for confetti feel
    [0, 60, 130, 200].forEach((delay, i) => {
      setTimeout(() => playPop(400 + i * 120, 0.28, 0.09), delay);
    });
  }

  // ── Booha roster ─────────────────────────────────────────
  const BOOHA_ROSTER = [
    { id:'booha',     name:'Booha',     img:'./assets/images/booha_helmet.png',
      sfx:'./assets/audio/booha.mp3',        stock:5,
      conf:{ colors:['#ffffff','#ffccff','#ccccff','#ffeecc','#aaddff','#ffaadd'], shapes:['circle','star','sparkle'],      sz:[4,10],  burst:70,  spin:true  }},
    { id:'heavy',     name:'Heavy',     img:'./assets/images/heavy_booha.png',
      sfx:'./assets/audio/boo-heavy.mp3',    stock:3,
      conf:{ colors:['#ff6600','#ff9900','#ffcc00','#ff4400','#ffdd44','#cc3300'], shapes:['chunk','rect','circle'],         sz:[7,16],  burst:85,  spin:false }},
    { id:'rock',      name:'Rock',      img:'./assets/images/rock_booha.png',
      sfx:'./assets/audio/boo-rock.mp3',     stock:2,
      conf:{ colors:['#99aabb','#ccdde8','#667788','#e0eaf0','#445566','#aabbcc'], shapes:['shard','rect','crystal'],        sz:[5,13],  burst:60,  spin:true  }},
    { id:'ice',       name:'Ice',       img:'./assets/images/ice_booha.png',
      sfx:'./assets/audio/boo-ice.mp3',      stock:2,
      conf:{ colors:['#aaf0ff','#ddf8ff','#88ddff','#ffffff','#bbf5ff','#66d8f8'], shapes:['crystal','sparkle','star'],      sz:[4,12],  burst:80,  spin:true  }},
    { id:'fire',      name:'Fire',      img:'./assets/images/fire_booha.png',
      sfx:'./assets/audio/boo-fire.mp3',     stock:2,
      conf:{ colors:['#ff2200','#ff7700','#ffaa00','#ffee00','#ff5500','#ff3300'], shapes:['flame','circle','sparkle'],      sz:[5,14],  burst:100, spin:false }},
    { id:'princess',  name:'Princess',  img:'./assets/images/proncess_booha.png',
      sfx:'./assets/audio/boo-princess.mp3', stock:1,
      conf:{ colors:['#ff88cc','#ffaaee','#cc44aa','#ffddee','#ffffff','#ffbbdd'], shapes:['heart','star','sparkle','circle'],sz:[4,11],  burst:120, spin:true  }},
    { id:'nightmare', name:'Nightmare', img:'./assets/images/nightmare_booha.png',
      sfx:'./assets/audio/boo-nightmare.mp3',stock:1,
      conf:{ colors:['#550088','#8800cc','#bb00ff','#dd44ff','#330044','#ff00ff'], shapes:['shard','star','sparkle'],        sz:[4,13],  burst:85,  spin:true  }},
    { id:'monster',   name:'Monster',   img:'./assets/images/monster_booha.png',
      sfx:'./assets/audio/boo-monster.mp3',  stock:1,
      conf:{ colors:['#00cc44','#44ff88','#ccff00','#00ff66','#33aa00','#88ff00'], shapes:['chunk','circle','sparkle'],      sz:[6,15],  burst:90,  spin:false }},
    { id:'ultimate',  name:'Ultimate',  img:'./assets/images/ultimate_booha.png',
      sfx:'./assets/audio/boo-ultimate.mp3', stock:1,
      conf:{ colors:['#ff0088','#ff8800','#ffff00','#00ffaa','#0088ff','#cc00ff','#ff4488','#44ffcc'], shapes:['star','heart','crystal','sparkle','flame'], sz:[5,15], burst:160, spin:true }}
  ];

  // ── Selector layout ───────────────────────────────────────
  const SEL_X = 14, SEL_Y = 70, SEL_W = 52, SEL_H = 52, SEL_GAP = 6;

  const boohaState = {
    selected: 0,
    stocks:   BOOHA_ROSTER.map(b => b.stock),
    images:   new Array(BOOHA_ROSTER.length).fill(null)
  };

  // ── Main game state ───────────────────────────────────────
  const gs = {
    phase:           PHASE.TITLE,
    round:           0,           // index into LEVELS
    roundNumber:     1,           // 1-based display
    running:         false,
    dragging:        false,
    pullPlayed:      false,
    lastHitAt:       0,
    impactFlash:     0,
    bestShot:        0,
    destructionPct:  0,
    totalBreakables: 0,
    brokenBlocks:    0,
    ghostsLeft:      GHOSTS_PER_ROUND,
    pendingReset:    false,
    shotInProgress:  false,       // prevents double finishShot
    booha:           null,
    blocks:          [],
    debrisTimer:     0,
    cardTimer:       0,           // when >0 counts down to auto-advance
    cardMessage:     '',
    cardSub:         '',
    cardAccent:      '#ffffff',
    scale:           1,
    images:          { bg: null },
    muted:           false,
  };

  const LEVELS = window.BOOHA_DESTRUCTION_LEVELS || [];
  if (!LEVELS.length) console.error('Booha: no levels found');

  // ── Images ───────────────────────────────────────────────
  function makeImage(src) {
    return new Promise(res => {
      if (!src) return res(null);
      const img = new Image();
      img.onload = () => res(img); img.onerror = () => res(null); img.src = src;
    });
  }
  async function preload() {
    gs.images.bg = await makeImage(ASSETS.background);
    const imgs = await Promise.all(BOOHA_ROSTER.map(b => makeImage(b.img)));
    imgs.forEach((img, i) => { boohaState.images[i] = img; });
  }

  // ── Audio helpers ─────────────────────────────────────────
  function playSFX(src, vol = 1, rate = 1) {
    if (gs.muted || !src) return;
    const a = new Audio(src);
    a.volume = Math.max(0, Math.min(1, vol));
    a.playbackRate = rate;
    a.play().catch(() => {});
  }
  function sfxPull()   { if (gs.pullPlayed) return; gs.pullPlayed=true; playSFX(AUDIO.pull, 0.5, 0.98+rnd()*0.06); }
  function sfxLaunch() {
    playSFX(AUDIO.launch, 0.9, 0.98+rnd()*0.06);
    const r = BOOHA_ROSTER[boohaState.selected];
    if (r) setTimeout(() => playSFX(r.sfx, 0.8, 0.96+rnd()*0.08), 60);
  }
  function sfxHit(mat, spd) {
    const now = performance.now();
    if (now - gs.lastHitAt < HIT_COOLDOWN_MS) return;
    gs.lastHitAt = now;
    const src = mat==='stone'?AUDIO.stone : mat==='glass'?AUDIO.glass : mat==='soft'?AUDIO.soft : AUDIO.wood;
    playSFX(src, Math.max(0.22, Math.min(1, spd/14)), 0.92+rnd()*0.18);
    gs.impactFlash = 1;
  }
  function sfxBreak()  { playSFX(AUDIO.break,  0.95, 0.95+rnd()*0.08); }
  function sfxRubble() { playSFX(AUDIO.rubble, 0.55, 0.98+rnd()*0.08); setTimeout(()=>playSFX(AUDIO.rubble,0.3,1.06),130); }
  function sfxGround(spd) { if (spd<12) return; playSFX(AUDIO.ground, Math.min(0.9,spd/22), 0.96+rnd()*0.08); }
  function sfxWin()  { playSFX(AUDIO.win,  1,    1); }
  function sfxFail() { playSFX(AUDIO.fail, 0.85, 1); }

  // ── Helpers ──────────────────────────────────────────────
  function rnd(a=0, b=1) { return a + Math.random()*(b-a); }
  function clamp(n,mn,mx) { return Math.max(mn, Math.min(mx, n)); }
  function dist(ax,ay,bx,by) { return Math.hypot(ax-bx, ay-by); }
  function randItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
  function hexToRgb(hex) {
    const h = hex.replace('#','');
    return h.length===3
      ? [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)]
      : [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  function lighten(hex,a) { const [r,g,b]=hexToRgb(hex); return `rgb(${clamp((r+a*255)|0,0,255)},${clamp((g+a*255)|0,0,255)},${clamp((b+a*255)|0,0,255)})`; }
  function darken(hex,a)  { return lighten(hex,-a); }

  // ── Material palette ──────────────────────────────────────
  const MAT = {
    wood:  { base:'#c8895a', mid:'#96532c', dark:'#5e2e10', edge:'#e8a870', spark:'#f0b870', chip:'#d49050', grain:true  },
    stone: { base:'#8a939f', mid:'#626b76', dark:'#3d4450', edge:'#b0bac5', spark:'#ccd4de', chip:'#9aaab8', grain:false },
    glass: { base:'#b7ecff', mid:'#70caee', dark:'#3898bb', edge:'#e0f8ff', spark:'#e8faff', chip:'#a0d8ef', grain:false },
    soft:  { base:'#f8c0e0', mid:'#e080b8', dark:'#b04080', edge:'#ffddee', spark:'#ffd0ec', chip:'#eeaad0', grain:false }
  };
  function matFill(block) {
    const m = MAT[block.material]||MAT.wood;
    if (!block.maxHp||block.maxHp<=1) return m.base;
    const r = clamp(block.hp/block.maxHp,0,1);
    return r>0.66?m.base : r>0.33?m.mid : m.dark;
  }

  // ── FX spawners ───────────────────────────────────────────
  function spawnHitParticles(x,y,mat,spd,n=8) {
    const m=MAT[mat]||MAT.wood, isG=mat==='glass';
    for (let i=0;i<n;i++) {
      const ang=rnd(0,Math.PI*2), mag=rnd(1.5,Math.min(12,spd*0.7)), chip=!isG&&rnd()<0.4;
      particles.push({ x,y, vx:Math.cos(ang)*mag, vy:Math.sin(ang)*mag-rnd(0,3),
        life:1, r:chip?rnd(2.5,5):rnd(1,2.5), color:rnd()<0.5?m.spark:m.chip,
        type:chip?'chip':'spark', gravity:chip?0.28:0.12, rot:rnd(0,Math.PI*2), rotV:rnd(-0.2,0.2) });
    }
  }
  function spawnGlassShatter(x,y,w,h) {
    for (let i=0,n=10+~~rnd(0,8);i<n;i++) {
      const ang=rnd(0,Math.PI*2),mag=rnd(3,14);
      particles.push({ x:x+rnd(-w*0.4,w*0.4), y:y+rnd(-h*0.4,h*0.4),
        vx:Math.cos(ang)*mag, vy:Math.sin(ang)*mag-rnd(1,5),
        life:1, r:rnd(4,12), color:'#b7ecff', type:'shard', gravity:0.32,
        rot:rnd(0,Math.PI*2), rotV:rnd(-0.35,0.35), alpha:0.85 });
    }
  }
  function spawnDust(x,y) { dustPuffs.push({x,y,r:4,maxR:rnd(28,48),life:1}); }
  function spawnWave(x,y,color,maxR=60) { shockwaves.push({x,y,r:4,maxR,life:1,color}); }
  function addShake(v) { shake.intensity=Math.max(shake.intensity,v); }

  // ── Confetti ─────────────────────────────────────────────
  // Two modes: 'burst' = post-settle booha explosion (upward, small)
  //            'celebrate' = win celebration (rains from top)
  function spawnConfetti(cx,cy,rIdx, mode='burst') {
    const cfg = BOOHA_ROSTER[rIdx]?.conf; if (!cfg) return;
    const count = mode==='burst' ? cfg.burst : Math.floor(cfg.burst*0.6);
    for (let i=0;i<count;i++) {
      const ang  = mode==='burst' ? rnd(-Math.PI, 0) : rnd(0, Math.PI);
      const mag  = mode==='burst' ? rnd(5,20) : rnd(3,14);
      const spd  = mode==='burst' ? 1 : 0.4;
      confetti.push({
        x: cx+rnd(-22,22),
        y: mode==='burst' ? cy+rnd(-8,8) : rnd(0,HEIGHT*0.3),
        vx: Math.cos(ang)*mag*rnd(0.5,1.5),
        vy: Math.sin(ang)*mag*spd - (mode==='burst'?rnd(2,9):0),
        life:1, decay:rnd(0.009,0.02),
        r: rnd(cfg.sz[0],cfg.sz[1]),
        color: randItem(cfg.colors),
        shape: randItem(cfg.shapes),
        gravity: rnd(0.15,0.3),
        rot: rnd(0,Math.PI*2),
        rotV: cfg.spin ? rnd(-0.2,0.2) : 0,
        wobble: rnd(0,Math.PI*2), wobbleSpd: rnd(0.06,0.14), wobbleAmp: rnd(0.5,2.5),
        // sparkle pulse for 'sparkle' shape
        pulse: rnd(0,Math.PI*2), pulseSpd: rnd(0.12,0.22)
      });
    }
  }

  function updateConfetti() {
    for (let i=confetti.length-1;i>=0;i--) {
      const c=confetti[i];
      c.vy+=c.gravity; c.wobble+=c.wobbleSpd; c.pulse+=c.pulseSpd;
      c.x+=c.vx+Math.sin(c.wobble)*c.wobbleAmp; c.y+=c.vy;
      c.vx*=0.986; c.rot+=c.rotV; c.life-=c.decay;
      if (c.y>FLOOR_Y) { c.y=FLOOR_Y; c.vy*=-0.25; c.vx*=0.7; c.life-=0.07; }
      if (c.life<=0) confetti.splice(i,1);
    }
  }

  function drawConfettiParticle(c) {
    ctx.save();
    ctx.globalAlpha = clamp(c.life,0,1);
    ctx.fillStyle   = c.color;
    ctx.strokeStyle = c.color;
    ctx.translate(c.x,c.y); ctx.rotate(c.rot);
    switch(c.shape) {
      case 'circle':   ctx.beginPath(); ctx.ellipse(0,0,c.r,c.r*0.5,0,0,Math.PI*2); ctx.fill(); break;
      case 'rect':     ctx.fillRect(-c.r*0.55,-c.r*0.35,c.r*1.1,c.r*0.7); break;
      case 'star': {
        const o=c.r,ir=c.r*0.42; ctx.beginPath();
        for(let s=0;s<10;s++){const R=s%2?ir:o,a=s*Math.PI/5-Math.PI/2; s?ctx.lineTo(Math.cos(a)*R,Math.sin(a)*R):ctx.moveTo(Math.cos(a)*R,Math.sin(a)*R);}
        ctx.closePath(); ctx.fill(); break; }
      case 'sparkle': {
        // 4-point star / sparkle
        const pf = 0.4+0.3*Math.sin(c.pulse);
        const r2 = c.r*pf;
        ctx.beginPath();
        ctx.moveTo(0,-c.r); ctx.lineTo(r2*0.25,-r2*0.25); ctx.lineTo(c.r,0);
        ctx.lineTo(r2*0.25,r2*0.25); ctx.lineTo(0,c.r);
        ctx.lineTo(-r2*0.25,r2*0.25); ctx.lineTo(-c.r,0); ctx.lineTo(-r2*0.25,-r2*0.25);
        ctx.closePath(); ctx.fill(); break; }
      case 'heart': {
        ctx.beginPath(); ctx.moveTo(0,c.r*0.35);
        ctx.bezierCurveTo(-c.r,-c.r*0.1,-c.r,-c.r*0.9,0,-c.r*0.5);
        ctx.bezierCurveTo(c.r,-c.r*0.9,c.r,-c.r*0.1,0,c.r*0.35);
        ctx.closePath(); ctx.fill(); break; }
      case 'shard': {
        ctx.beginPath(); ctx.moveTo(0,-c.r); ctx.lineTo(c.r*0.55,c.r*0.5); ctx.lineTo(-c.r*0.55,c.r*0.35);
        ctx.closePath(); ctx.fill(); break; }
      case 'crystal': {
        ctx.beginPath(); ctx.moveTo(0,-c.r); ctx.lineTo(c.r*0.4,0); ctx.lineTo(0,c.r); ctx.lineTo(-c.r*0.4,0);
        ctx.closePath(); ctx.fill(); break; }
      case 'chunk': {
        ctx.beginPath(); ctx.moveTo(-c.r*0.5,-c.r*0.6); ctx.lineTo(c.r*0.6,-c.r*0.4);
        ctx.lineTo(c.r*0.4,c.r*0.5); ctx.lineTo(-c.r*0.6,c.r*0.3); ctx.closePath(); ctx.fill(); break; }
      case 'flame': {
        ctx.beginPath(); ctx.moveTo(0,c.r*0.5);
        ctx.quadraticCurveTo(c.r*0.8,0,c.r*0.3,-c.r*0.6);
        ctx.quadraticCurveTo(0,-c.r,-c.r*0.3,-c.r*0.6);
        ctx.quadraticCurveTo(-c.r*0.8,0,0,c.r*0.5); ctx.closePath(); ctx.fill(); break; }
      default: ctx.beginPath(); ctx.arc(0,0,c.r,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
  function drawConfetti() { for (const c of confetti) drawConfettiParticle(c); }

  // ── Crack system ──────────────────────────────────────────
  const crackSets = new Map();
  function getCracks(block,idx) {
    if (!crackSets.has(idx)) {
      const w=block.w,h=block.h;
      const ml=(n,maxL) => Array.from({length:n},()=>{
        const ox=rnd(-w*0.35,w*0.35),oy=rnd(-h*0.35,h*0.35),a=rnd(0,Math.PI*2),l=rnd(maxL*0.4,maxL);
        return {x1:ox,y1:oy,x2:ox+Math.cos(a)*l,y2:oy+Math.sin(a)*l,
          br:rnd()<0.4?{x:ox+Math.cos(a)*l*0.5,y:oy+Math.sin(a)*l*0.5,a:a+rnd(0.4,1.1)*(rnd()<0.5?1:-1),l:l*rnd(0.3,0.55)}:null};
      });
      crackSets.set(idx,{minor:ml(3,Math.min(w,h)*0.35),mid:ml(5,Math.min(w,h)*0.55),heavy:ml(8,Math.min(w,h)*0.75)});
    }
    return crackSets.get(idx);
  }
  function drawCracks(block,idx) {
    if (block.broken||block.maxHp<=1) return;
    const r=clamp(block.hp/block.maxHp,0,1); if (r>=1) return;
    const {minor,mid,heavy}=getCracks(block,idx);
    const lines=r<0.34?[...minor,...mid,...heavy]:r<0.67?[...minor,...mid]:minor;
    const alpha=r<0.34?0.75:r<0.67?0.55:0.35;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='rgba(0,0,0,0.65)'; ctx.lineWidth=1; ctx.lineCap='round';
    rrClip(ctx,block.x-block.w/2,block.y-block.h/2,block.w,block.h,8);
    for (const l of lines) {
      ctx.beginPath(); ctx.moveTo(block.x+l.x1,block.y+l.y1); ctx.lineTo(block.x+l.x2,block.y+l.y2); ctx.stroke();
      if (l.br) { ctx.beginPath(); ctx.moveTo(block.x+l.br.x,block.y+l.br.y); ctx.lineTo(block.x+l.br.x+Math.cos(l.br.a)*l.br.l,block.y+l.br.y+Math.sin(l.br.a)*l.br.l); ctx.stroke(); }
    }
    ctx.restore();
  }

  // ── Round management ──────────────────────────────────────
  function resetRound() {
    gs.dragging=false; gs.pullPlayed=false;
    gs.bestShot=0; gs.destructionPct=0; gs.brokenBlocks=0;
    gs.debrisTimer=0; gs.pendingReset=false; gs.shotInProgress=false;
    particles.length=0; shockwaves.length=0; dustPuffs.length=0; confetti.length=0;
    crackSets.clear(); shake.intensity=0;
    boohaState.stocks = BOOHA_ROSTER.map(b=>b.stock);
    boohaState.selected = 0;
  }

  function loadRound(idx) {
    gs.round = clamp(idx, 0, LEVELS.length-1);
    gs.roundNumber = gs.round+1;
    resetRound();
    const lvl = LEVELS[gs.round];
    gs.ghostsLeft = lvl.ghosts || GHOSTS_PER_ROUND;
    gs.blocks     = lvl.blocks.map((def,i)=>cloneBlock(def,i));
    gs.totalBreakables = gs.blocks.length;
    gs.booha = makeBooha();
    gs.running = false;
  }

  function startRound() {
    gs.running = true;
    gs.phase   = PHASE.PLAYING;
  }

  function showCard(phase, title, sub, accentColor) {
    gs.phase       = phase;
    gs.cardMessage = title;
    gs.cardSub     = sub;
    gs.cardAccent  = accentColor;
    gs.cardTimer   = ROUND_ADVANCE_MS;
    gs.running     = false;
  }

  function advanceRound() {
    const next = (gs.round+1) % LEVELS.length;
    loadRound(next);
    startRound();
  }

  // ── Game objects ─────────────────────────────────────────
  function makeBooha() {
    return { launched:false, x:SLING_X, y:SLING_Y, vx:0, vy:0,
      radius:BOOHA_RADIUS, settledFrames:0, confettiFired:false,
      damageThisShot:0, rosterIdx:boohaState.selected };
  }
  function cloneBlock(def,idx) {
    const y = typeof def.floorOffset==='number' ? FLOOR_Y-def.floorOffset : def.y;
    crackSets.delete(idx);
    return {x:def.x,y,w:def.w,h:def.h,material:def.material||'wood',
      hp:def.hp||1,maxHp:def.hp||1,broken:false,shake:0,vy:0,fallen:false,hitFlash:0};
  }

  // ── Physics ──────────────────────────────────────────────
  function damageBlock(block,amount,hx,hy,spd) {
    if (block.broken) return;
    block.hp-=amount; block.shake=1; block.hitFlash=1;
    const mat=block.material,m=MAT[mat]||MAT.wood;
    spawnHitParticles(hx,hy,mat,spd,~~(6+spd*0.5));
    spawnWave(hx,hy,m.spark,35+spd*2);
    if (spd>10) addShake(Math.min(6,spd*0.4));
    if (block.hp<=0) {
      block.broken=true; gs.brokenBlocks+=1;
      gs.destructionPct=(gs.brokenBlocks/gs.totalBreakables)*100;
      if (gs.booha) { gs.booha.damageThisShot=gs.destructionPct; gs.bestShot=Math.max(gs.bestShot,gs.destructionPct); }
      if (mat==='glass'){spawnGlassShatter(block.x,block.y,block.w,block.h);spawnWave(block.x,block.y,'#b7ecff',70);}
      else{spawnHitParticles(block.x,block.y,mat,spd+4,20);spawnWave(block.x,block.y,m.spark,60);}
      addShake(Math.min(10,spd*0.6+4)); sfxBreak(); gs.debrisTimer=18;
    }
  }

  function blockCollision(block) {
    const b=gs.booha; if (!b||!b.launched||block.broken) return;
    const cx=clamp(b.x,block.x-block.w/2,block.x+block.w/2);
    const cy=clamp(b.y,block.y-block.h/2,block.y+block.h/2);
    const dx=b.x-cx,dy=b.y-cy,dsq=dx*dx+dy*dy;
    if (dsq>b.radius*b.radius) return;
    const spd=Math.hypot(b.vx,b.vy); if (spd<MIN_IMPACT) return;
    sfxHit(block.material,spd);
    const dmg=block.material==='stone'?(spd>11?1:0):block.material==='glass'?1:block.material==='soft'?(spd>5?1:0):(spd>7?1:0);
    if (dmg>0) damageBlock(block,dmg,cx,cy,spd);
    const nx=dx===0&&dy===0?1:dx/Math.sqrt(dsq||1), ny=dx===0&&dy===0?0:dy/Math.sqrt(dsq||1);
    const dot=b.vx*nx+b.vy*ny;
    b.vx=(b.vx-2*dot*nx)*BOUNCE; b.vy=(b.vy-2*dot*ny)*BOUNCE;
    if (Math.abs(dx)>Math.abs(dy)) b.x=cx+nx*(b.radius+1); else b.y=cy+ny*(b.radius+1);
  }

  function updateBlocks() {
    for (const block of gs.blocks) {
      if (block.broken) {
        block.vy+=GRAVITY*0.6; block.y+=block.vy;
        if (!block.fallen&&block.y+block.h/2>=FLOOR_Y) {
          block.y=FLOOR_Y-block.h/2; block.fallen=true;
          const s=Math.abs(block.vy); sfxGround(s);
          if (s>6){spawnDust(block.x,FLOOR_Y);spawnDust(block.x+rnd(-20,20),FLOOR_Y);spawnHitParticles(block.x,FLOOR_Y,block.material,s,6);}
          block.vy*=-0.18;
        }
        block.vy*=0.985;
      }
      block.shake*=0.84; block.hitFlash*=0.88;
    }
    if (gs.debrisTimer>0){if(gs.debrisTimer===18)sfxRubble();gs.debrisTimer-=1;}
  }

  function updateBooha() {
    const b=gs.booha; if (!b||!b.launched) return;
    b.vy+=GRAVITY; b.vx*=AIR; b.vy*=AIR; b.x+=b.vx; b.y+=b.vy;
    if (b.x-b.radius<0){b.x=b.radius;b.vx*=-BOUNCE;}
    if (b.x+b.radius>WIDTH){b.x=WIDTH-b.radius;b.vx*=-BOUNCE;}
    if (b.y+b.radius>=FLOOR_Y) {
      const s=Math.abs(b.vy);
      if (s>8){sfxGround(s);spawnDust(b.x,FLOOR_Y);addShake(Math.min(4,s*0.2));}
      b.y=FLOOR_Y-b.radius; b.vy*=-0.38; b.vx*=0.86;
    }
    for (const block of gs.blocks) blockCollision(block);

    const spd=Math.hypot(b.vx,b.vy), onFloor=Math.abs(b.y-(FLOOR_Y-b.radius))<3;
    if (spd<REST_THRESHOLD&&onFloor) {
      b.vx*=DAMAGE_DECAY_SETTLE; b.vy*=DAMAGE_DECAY_SETTLE;
      b.settledFrames+=1;
      if (!b.confettiFired&&b.settledFrames>=SETTLE_FRAMES_NEEDED) {
        b.confettiFired=true;
        // Pop SFX + confetti burst
        playCelebPop();
        spawnConfetti(b.x, b.y-b.radius*0.5, b.rosterIdx, 'burst');
        // Schedule finishShot ONCE after delay
        setTimeout(() => finishShot(), NEXT_SHOT_DELAY_MS);
      }
    } else {
      b.settledFrames=0;
    }

    // OOB — finish immediately (no confetti, no delay)
    if ((b.y>HEIGHT+200||b.x<-200||b.x>WIDTH+200)&&!gs.shotInProgress) {
      finishShot();
    }
  }

  // ── finishShot — THE critical function (must be bulletproof) ──
  // Called either from setTimeout (confetti) or OOB path.
  // shotInProgress flag ensures it only runs once per shot.
  function finishShot() {
    if (gs.shotInProgress) return;
    gs.shotInProgress = true;

    gs.ghostsLeft = Math.max(0, gs.ghostsLeft-1);

    // Check win/fail BEFORE resetting booha
    gs.destructionPct = (gs.brokenBlocks/Math.max(1,gs.totalBreakables))*100;
    const target = (LEVELS[gs.round]?.targetPercent) || 100;

    if (gs.destructionPct>=target) {
      // WIN
      sfxWin();
      spawnConfetti(WIDTH/2, HEIGHT*0.3, boohaState.selected, 'celebrate');
      playCelebPop();
      showCard(PHASE.WIN_CARD, `ROUND ${gs.roundNumber} CLEAR!`, 'Smashed it! Next round coming…', '#ffdd44');
      setTimeout(advanceRound, ROUND_ADVANCE_MS);
    } else if (gs.ghostsLeft<=0) {
      // FAIL
      sfxFail();
      showCard(PHASE.FAIL_CARD, 'ROUND OVER', `${Math.round(gs.destructionPct)}% destruction. Try again?`, '#ff6666');
      setTimeout(() => {
        loadRound(gs.round);
        startRound();
      }, ROUND_ADVANCE_MS + 600);
    } else {
      // More shots remain — reset booha
      gs.pendingReset = true;
      gs.shotInProgress = false;  // allow next shot
      advanceSelector();
      gs.booha = makeBooha();
    }
  }

  function advanceSelector() {
    // Find next booha type with stock, starting from current
    for (let i=0;i<BOOHA_ROSTER.length;i++) {
      const t=(boohaState.selected+i)%BOOHA_ROSTER.length;
      if (boohaState.stocks[t]>0){boohaState.selected=t;return;}
    }
  }

  // ── Input ────────────────────────────────────────────────
  function worldPoint(evt) {
    const rect=canvas.getBoundingClientRect();
    const cx=evt.touches?evt.touches[0].clientX:evt.clientX;
    const cy=evt.touches?evt.touches[0].clientY:evt.clientY;
    return {x:(cx-rect.left)/gs.scale, y:(cy-rect.top)/gs.scale};
  }

  function selectorHit(px,py) {
    for (let i=0;i<BOOHA_ROSTER.length;i++) {
      const sy=SEL_Y+i*(SEL_H+SEL_GAP);
      if (px>=SEL_X&&px<=SEL_X+SEL_W&&py>=sy&&py<=sy+SEL_H) return i;
    }
    return -1;
  }

  function hitTestStartBtn(px,py) {
    // Big canvas start button: centred, 280×70
    const bx=WIDTH/2-140, by=HEIGHT/2+10, bw=280, bh=70;
    return px>=bx&&px<=bx+bw&&py>=by&&py<=by+bh;
  }
  function hitTestRetryBtn(px,py) {
    const bx=WIDTH/2-130, by=HEIGHT*0.62, bw=260, bh=58;
    return px>=bx&&px<=bx+bw&&py>=by&&py<=by+bh;
  }

  function onDown(evt) {
    const p=worldPoint(evt);

    // TITLE phase: start button
    if (gs.phase===PHASE.TITLE) {
      if (hitTestStartBtn(p.x,p.y)) { loadRound(0); startRound(); }
      evt.preventDefault(); return;
    }

    // WIN / FAIL card: retry/continue button
    if (gs.phase===PHASE.WIN_CARD||gs.phase===PHASE.FAIL_CARD) {
      if (hitTestRetryBtn(p.x,p.y)) {
        if (gs.phase===PHASE.WIN_CARD) advanceRound();
        else { loadRound(gs.round); startRound(); }
      }
      evt.preventDefault(); return;
    }

    // Selector
    const slot=selectorHit(p.x,p.y);
    if (slot!==-1&&boohaState.stocks[slot]>0&&!gs.shotInProgress) {
      boohaState.selected=slot;
      if (gs.booha&&!gs.booha.launched) gs.booha=makeBooha();
      evt.preventDefault(); evt.stopPropagation(); return;
    }

    // Slingshot drag
    if (!gs.booha||gs.booha.launched||gs.shotInProgress) return;
    if (!gs.running) startRound();
    if (dist(p.x,p.y,gs.booha.x,gs.booha.y)>gs.booha.radius+22) return;
    gs.dragging=true; gs.pullPlayed=false; sfxPull();
    evt.preventDefault(); evt.stopPropagation();
  }

  function onMove(evt) {
    if (!gs.dragging||!gs.booha||gs.booha.launched) return;
    const p=worldPoint(evt);
    const dx=p.x-SLING_X,dy=p.y-SLING_Y;
    const ang=Math.atan2(dy,dx),d=Math.min(MAX_PULL,Math.hypot(dx,dy));
    gs.booha.x=SLING_X+Math.cos(ang)*d;
    gs.booha.y=Math.min(SLING_Y+Math.sin(ang)*d,FLOOR_Y-gs.booha.radius-4);
    evt.preventDefault();
  }

  function onUp(evt) {
    if (!gs.dragging) return;
    gs.dragging=false; gs.pullPlayed=false;
    if (!gs.booha||gs.booha.launched||gs.shotInProgress) return;
    const dx=SLING_X-gs.booha.x,dy=SLING_Y-gs.booha.y,mag=Math.hypot(dx,dy);
    if (mag<12){gs.booha.x=SLING_X;gs.booha.y=SLING_Y;return;}
    boohaState.stocks[boohaState.selected]=Math.max(0,boohaState.stocks[boohaState.selected]-1);
    gs.booha.vx=dx*0.19; gs.booha.vy=dy*0.19;
    gs.booha.launched=true; gs.booha.damageThisShot=0;
    sfxLaunch();
  }

  // ── FX update ─────────────────────────────────────────────
  function updateFX() {
    for (let i=particles.length-1;i>=0;i--) {
      const p=particles[i];
      p.vy+=p.gravity; p.x+=p.vx; p.y+=p.vy; p.vx*=0.97;
      if (p.rot!==undefined) p.rot+=p.rotV;
      p.life-=0.025+0.005*rnd();
      if (p.y>FLOOR_Y-p.r&&(p.type==='chip'||p.type==='shard')){p.y=FLOOR_Y-p.r;p.vy*=-0.38;p.vx*=0.78;if(Math.abs(p.vy)>5)spawnDust(p.x,FLOOR_Y);}
      if (p.life<=0) particles.splice(i,1);
    }
    for (let i=shockwaves.length-1;i>=0;i--){const s=shockwaves[i];s.r+=(s.maxR-s.r)*0.18;s.life-=0.06;if(s.life<=0)shockwaves.splice(i,1);}
    for (let i=dustPuffs.length-1;i>=0;i--){const d=dustPuffs[i];d.r+=(d.maxR-d.r)*0.12;d.life-=0.05;if(d.life<=0)dustPuffs.splice(i,1);}
    shake.intensity*=shake.decay;
    updateConfetti();
  }

  // ── Draw helpers ─────────────────────────────────────────
  function rr(cx,x,y,w,h,r,fill,stroke) {
    cx.beginPath(); cx.moveTo(x+r,y);
    cx.arcTo(x+w,y,x+w,y+h,r); cx.arcTo(x+w,y+h,x,y+h,r);
    cx.arcTo(x,y+h,x,y,r);     cx.arcTo(x,y,x+w,y,r);
    cx.closePath(); if(fill)cx.fill(); if(stroke)cx.stroke();
  }
  function rrClip(cx,x,y,w,h,r) {
    cx.beginPath(); cx.moveTo(x+r,y);
    cx.arcTo(x+w,y,x+w,y+h,r); cx.arcTo(x+w,y+h,x,y+h,r);
    cx.arcTo(x,y+h,x,y,r);     cx.arcTo(x,y,x+w,y,r);
    cx.closePath(); cx.clip();
  }

  // ── Draw: Background ─────────────────────────────────────
  function drawBG() {
    if (gs.images.bg) { ctx.drawImage(gs.images.bg,0,0,WIDTH,HEIGHT); }
    else {
      const g=ctx.createLinearGradient(0,0,0,HEIGHT);
      g.addColorStop(0,'#1e1c2a'); g.addColorStop(1,'#0c0a12');
      ctx.fillStyle=g; ctx.fillRect(0,0,WIDTH,HEIGHT);
    }
    ctx.fillStyle='rgba(0,0,0,0.2)';
    ctx.fillRect(0,HEIGHT-GROUND_HEIGHT,WIDTH,GROUND_HEIGHT);
  }

  // ── Draw: Slingshot ───────────────────────────────────────
  function drawSling() {
    const b=gs.booha||makeBooha();
    const baseX=SLING_X,baseY=FLOOR_Y+4,topY=SLING_Y-52,lx=SLING_X-26,rx=SLING_X+26;
    ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round';
    // Shadow
    ctx.beginPath(); ctx.ellipse(baseX,baseY+7,14,5,0,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fill();
    // Wood gradient
    const wg=ctx.createLinearGradient(baseX-18,0,baseX+18,0);
    wg.addColorStop(0,'#3a2210'); wg.addColorStop(0.35,'#5c3318'); wg.addColorStop(0.65,'#6e3e1e'); wg.addColorStop(1,'#3a2210');
    // Arms
    for (const [sx,ex] of [[-6,lx],[6,rx]]) {
      ctx.beginPath(); ctx.moveTo(baseX+sx,baseY); ctx.quadraticCurveTo(baseX+sx*4.5,baseY-80,ex,topY);
      ctx.lineWidth=18; ctx.strokeStyle='#2a1608'; ctx.stroke();
      ctx.lineWidth=13; ctx.strokeStyle=wg;         ctx.stroke();
    }
    // Stem
    ctx.beginPath(); ctx.moveTo(baseX,baseY); ctx.lineTo(baseX,baseY-45);
    ctx.lineWidth=20; ctx.strokeStyle='#2a1608'; ctx.stroke();
    ctx.lineWidth=15; ctx.strokeStyle=wg;       ctx.stroke();
    // Grain
    ctx.globalAlpha=0.18; ctx.strokeStyle='#e8a060'; ctx.lineWidth=2;
    for (const [gsx,gex] of [[-3,lx+2],[3,rx-2]]) {
      ctx.beginPath(); ctx.moveTo(baseX+gsx,baseY-10); ctx.quadraticCurveTo(baseX+gsx*8,baseY-75,gex,topY+10); ctx.stroke();
    }
    ctx.globalAlpha=1;
    // Knobs
    for (const [kx,ky] of [[lx,topY],[rx,topY]]) {
      ctx.beginPath(); ctx.arc(kx,ky,9,0,Math.PI*2); ctx.fillStyle='#2a1608'; ctx.fill();
      ctx.beginPath(); ctx.arc(kx,ky,7,0,Math.PI*2); ctx.fillStyle='#6e3e1e'; ctx.fill();
      ctx.beginPath(); ctx.arc(kx-2,ky-2,3,0,Math.PI*2); ctx.fillStyle='rgba(220,160,80,0.38)'; ctx.fill();
      ctx.beginPath(); ctx.arc(kx,ky,7,0,Math.PI*2); ctx.strokeStyle='#1a0e04'; ctx.lineWidth=1.5; ctx.stroke();
    }
    // Elastic
    if (!b.launched) {
      const bx=gs.dragging?b.x:SLING_X, by=gs.dragging?b.y:SLING_Y;
      const stretch=Math.hypot(bx-SLING_X,by-SLING_Y)/MAX_PULL;
      const bw=Math.max(2.5,6-stretch*3);
      ctx.globalAlpha=0.6; ctx.strokeStyle='#4a2a18'; ctx.lineWidth=bw+2;
      ctx.beginPath(); ctx.moveTo(lx,topY); ctx.lineTo(bx,by); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx,topY); ctx.lineTo(bx,by); ctx.stroke();
      ctx.globalAlpha=1;
      const eg=ctx.createLinearGradient(lx,topY,bx,by);
      eg.addColorStop(0,'#8b5a30'); eg.addColorStop(0.5,'#c07838'); eg.addColorStop(1,'#8b5a30');
      ctx.strokeStyle=eg; ctx.lineWidth=bw;
      ctx.beginPath(); ctx.moveTo(lx,topY); ctx.lineTo(bx,by); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx,topY); ctx.lineTo(bx,by); ctx.stroke();
      if (!gs.dragging) {
        ctx.fillStyle='#5c3018'; ctx.strokeStyle='#3a1e08'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.ellipse(bx,by,12,9,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ── Draw: Booha ───────────────────────────────────────────
  function drawBooha() {
    const b=gs.booha; if (!b) return;
    const img=boohaState.images[b.rosterIdx];
    ctx.save(); ctx.translate(b.x,b.y);
    if (b.launched) ctx.rotate(Math.atan2(b.vy,b.vx)*0.2);
    if (img) { ctx.drawImage(img,-b.radius*1.4,-b.radius*1.4,b.radius*2.8,b.radius*2.8); }
    else {
      ctx.fillStyle='#ffffff'; ctx.beginPath();
      ctx.arc(0,0,b.radius,Math.PI,0,false); ctx.lineTo(b.radius,22);
      ctx.quadraticCurveTo(0,b.radius+12,-b.radius,22); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  // ── Draw: Blocks ─────────────────────────────────────────
  function drawBlocks() {
    for (let i=0;i<gs.blocks.length;i++) {
      const block=gs.blocks[i];
      const sx=(rnd()-0.5)*8*block.shake, sy=(rnd()-0.5)*6*block.shake;
      const bx=block.x-block.w/2, by=block.y-block.h/2, bw=block.w, bh=block.h;
      const m=MAT[block.material]||MAT.wood;
      ctx.save(); ctx.globalAlpha=block.broken?0.28:1; ctx.translate(sx,sy);

      // Gradient fill
      const fg=ctx.createLinearGradient(bx,by,bx,by+bh);
      fg.addColorStop(0,lighten(matFill(block),0.12));
      fg.addColorStop(0.5,matFill(block));
      fg.addColorStop(1,darken(matFill(block),0.14));
      ctx.fillStyle=fg; ctx.strokeStyle=darken(m.edge,0.3); ctx.lineWidth=2;
      rr(ctx,bx,by,bw,bh,8,true,true);

      if (!block.broken) {
        // Top bevel
        ctx.save(); ctx.globalAlpha=0.3; ctx.fillStyle=m.edge; rrClip(ctx,bx,by,bw,bh,8); ctx.fillRect(bx,by,bw,5); ctx.restore();
        // Left edge light
        ctx.save(); ctx.globalAlpha=0.14; ctx.fillStyle=m.edge; rrClip(ctx,bx,by,bw,bh,8); ctx.fillRect(bx,by,4,bh); ctx.restore();
        // Wood grain
        if (m.grain) {
          ctx.save(); ctx.globalAlpha=0.09; ctx.strokeStyle='rgba(255,210,160,0.5)'; ctx.lineWidth=1;
          rrClip(ctx,bx,by,bw,bh,8);
          for (let g=0;g<bh;g+=8){ctx.beginPath();ctx.moveTo(bx,by+g+rnd(-1,1));ctx.lineTo(bx+bw,by+g+rnd(-1,1));ctx.stroke();}
          ctx.restore();
        }
        // Glass shimmer
        if (block.material==='glass') {
          ctx.save(); ctx.globalAlpha=0.22;
          const sg=ctx.createLinearGradient(bx,by,bx+bw*0.7,by+bh*0.7);
          sg.addColorStop(0,'rgba(255,255,255,0.9)'); sg.addColorStop(0.5,'rgba(255,255,255,0)');
          ctx.fillStyle=sg; rrClip(ctx,bx,by,bw,bh,8); ctx.fillRect(bx,by,bw,bh); ctx.restore();
        }
        // Stone noise
        if (block.material==='stone') {
          ctx.save(); ctx.globalAlpha=0.08; rrClip(ctx,bx,by,bw,bh,8);
          for(let d=0;d<~~(bw*bh/200);d++){ctx.beginPath();ctx.arc(bx+rnd(6,bw-6),by+rnd(6,bh-6),rnd(1,2.5),0,Math.PI*2);ctx.fillStyle=rnd()<0.5?'rgba(255,255,255,0.8)':'rgba(0,0,0,0.6)';ctx.fill();}
          ctx.restore();
        }
        // Soft sparkles
        if (block.material==='soft') {
          ctx.save(); ctx.globalAlpha=0.13; rrClip(ctx,bx,by,bw,bh,8);
          for(let d=0;d<6;d++){ctx.beginPath();ctx.arc(bx+rnd(6,bw-6),by+rnd(6,bh-6),rnd(1.5,3),0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.9)';ctx.fill();}
          ctx.restore();
        }
      }

      // HP bar
      if (!block.broken&&block.maxHp>1) {
        const hr=clamp(block.hp/block.maxHp,0,1);
        ctx.fillStyle='rgba(0,0,0,0.35)'; rr(ctx,bx+8,by+bh-12,bw-16,7,3,true,false);
        ctx.fillStyle=hr>0.66?'#44ee77':hr>0.33?'#ffcc33':'#ff4444';
        rr(ctx,bx+8,by+bh-12,(bw-16)*hr,7,3,true,false);
      }
      // Hit flash
      if (block.hitFlash>0){ctx.fillStyle=`rgba(255,255,255,${0.42*block.hitFlash})`;rr(ctx,bx,by,bw,bh,8,true,false);}
      // Depth stroke
      ctx.strokeStyle='rgba(0,0,0,0.25)'; ctx.lineWidth=1.5; rr(ctx,bx+1.5,by+1.5,bw-3,bh-3,7,false,true);
      ctx.restore();
      if (!block.broken) drawCracks(block,i);
    }
  }

  // ── Draw: Trajectory ─────────────────────────────────────
  function drawTraj() {
    if (!gs.dragging||!gs.booha) return;
    const b=gs.booha; let tx=b.x,ty=b.y,tvx=(SLING_X-b.x)*0.19,tvy=(SLING_Y-b.y)*0.19;
    ctx.save();
    for(let i=0;i<22;i++){tvy+=GRAVITY;tvx*=AIR;tvy*=AIR;tx+=tvx;ty+=tvy;
      ctx.globalAlpha=(1-i/22)*0.55; ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(tx,ty,Math.max(1.5,5.5-i*0.2),0,Math.PI*2); ctx.fill();}
    ctx.restore();
  }

  // ── Draw: Ground line ────────────────────────────────────
  function drawGround() {
    ctx.save();
    const g=ctx.createLinearGradient(0,FLOOR_Y-8,0,FLOOR_Y+20);
    g.addColorStop(0,'rgba(255,255,255,0.28)'); g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g; ctx.fillRect(0,FLOOR_Y-8,WIDTH,16);
    ctx.restore();
  }

  // ── Draw: FX ─────────────────────────────────────────────
  function drawFXBehind() {
    for(const d of dustPuffs){ctx.save();ctx.globalAlpha=d.life*0.22;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle='rgba(200,190,180,0.5)';ctx.fill();ctx.restore();}
    for(const s of shockwaves){ctx.save();ctx.globalAlpha=s.life*0.7;ctx.strokeStyle=s.color;ctx.lineWidth=2.5*s.life;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.stroke();ctx.restore();}
  }
  function drawFXFront() {
    for(const p of particles){
      ctx.save(); ctx.globalAlpha=clamp(p.life,0,1)*(p.alpha||1); ctx.fillStyle=p.color;
      ctx.translate(p.x,p.y); if(p.rot!==undefined)ctx.rotate(p.rot);
      if(p.type==='shard'){const s=p.r;ctx.beginPath();ctx.moveTo(0,-s);ctx.lineTo(s*0.7,s*0.6);ctx.lineTo(-s*0.7,s*0.4);ctx.closePath();ctx.fillStyle=p.color;ctx.strokeStyle='rgba(180,240,255,0.6)';ctx.lineWidth=0.8;ctx.fill();ctx.stroke();}
      else if(p.type==='chip'){ctx.fillRect(-p.r*0.6,-p.r*0.4,p.r*1.2,p.r*0.8);}
      else{ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);ctx.fill();}
      ctx.restore();
    }
  }
  function drawFlash() {
    if(gs.impactFlash<=0) return;
    ctx.save(); ctx.fillStyle=`rgba(255,255,255,${0.07*gs.impactFlash})`; ctx.fillRect(0,0,WIDTH,HEIGHT); ctx.restore();
    gs.impactFlash*=0.84;
  }

  // ── Draw: Selector ───────────────────────────────────────
  function drawSelector() {
    ctx.save();
    for(let i=0;i<BOOHA_ROSTER.length;i++){
      const sx=SEL_X,sy=SEL_Y+i*(SEL_H+SEL_GAP);
      const stock=boohaState.stocks[i],isSel=i===boohaState.selected,isAvail=stock>0;
      ctx.save(); ctx.globalAlpha=isSel?0.92:0.62;
      ctx.fillStyle=isSel?'rgba(255,255,255,0.16)':'rgba(10,8,18,0.6)';
      ctx.strokeStyle=isSel?'rgba(255,255,255,0.55)':'rgba(255,255,255,0.07)'; ctx.lineWidth=isSel?2:1;
      rr(ctx,sx,sy,SEL_W,SEL_H,10,true,true); ctx.restore();
      const img=boohaState.images[i];
      ctx.save(); ctx.globalAlpha=isAvail?(isSel?1:0.68):0.2;
      if(img) ctx.drawImage(img,sx+4,sy+4,SEL_W-8,SEL_H-18);
      else{ctx.beginPath();ctx.arc(sx+SEL_W/2,sy+SEL_H/2-6,14,0,Math.PI*2);ctx.fillStyle='#aaa';ctx.fill();}
      ctx.restore();
      // Stock badge
      const bw=stock>=10?22:16;
      ctx.save(); ctx.globalAlpha=isAvail?1:0.38;
      ctx.fillStyle=isAvail?(isSel?'#fff':'rgba(255,255,255,0.55)'):'rgba(255,255,255,0.18)';
      ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=1;
      rr(ctx,sx+SEL_W-bw-2,sy+SEL_H-14,bw,12,6,true,true);
      ctx.fillStyle=isAvail?(isSel?'#111':'#333'):'#888';
      ctx.font='bold 8px system-ui,sans-serif'; ctx.textBaseline='middle';
      ctx.fillText(String(stock),sx+SEL_W-bw*0.5-2,sy+SEL_H-8); ctx.restore();
      if(isSel){
        const pulse=0.5+0.5*Math.sin(performance.now()*0.004);
        ctx.save(); ctx.globalAlpha=0.25*pulse; ctx.strokeStyle='#ffffff'; ctx.lineWidth=3;
        rr(ctx,sx-2,sy-2,SEL_W+4,SEL_H+4,12,false,true); ctx.restore();
      }
    }
    ctx.restore();
  }

  // ── Draw: HUD (in-play) ──────────────────────────────────
  function drawHUD() {
    ctx.save(); ctx.textBaseline='middle';

    // Thin progress bar at top
    const barW=WIDTH*clamp(gs.destructionPct/100,0,1);
    ctx.save(); ctx.globalAlpha=0.55;
    ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.fillRect(0,3,WIDTH,5);
    const pg=ctx.createLinearGradient(0,0,WIDTH,0);
    pg.addColorStop(0,'#ff7cfb'); pg.addColorStop(0.5,'#7cfff8'); pg.addColorStop(1,'#ffdf80');
    ctx.fillStyle=pg; ctx.fillRect(0,3,barW,5); ctx.restore();

    // Level badge (top-left column header)
    ctx.save(); ctx.globalAlpha=0.88;
    ctx.fillStyle='rgba(10,8,16,0.75)'; ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=1;
    rr(ctx,SEL_X,12,SEL_W,50,10,true,true); ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='bold 9px system-ui,sans-serif';
    ctx.fillText('ROUND',SEL_X+SEL_W/2-ctx.measureText('ROUND').width/2,24);
    ctx.fillStyle='#ffffff'; ctx.font='bold 20px system-ui,sans-serif';
    ctx.fillText(String(gs.roundNumber),SEL_X+SEL_W/2-ctx.measureText(String(gs.roundNumber)).width/2,44);

    // Right pills
    const pills=[
      {label:'GHOSTS', value:String(gs.ghostsLeft), accent:'#ff9f7f'},
      {label:'DAMAGE', value:`${Math.round(gs.destructionPct)}%`, accent:'#7cfff8'},
      {label:'TARGET', value:`${LEVELS[gs.round]?.targetPercent||100}%`, accent:'#ffdf80'}
    ];
    const pw=90,ph=44,pg2=10;
    let px=WIDTH-14-pills.length*(pw+pg2)+pg2;
    for(const pill of pills){
      ctx.save(); ctx.globalAlpha=0.85;
      ctx.fillStyle='rgba(10,8,16,0.72)'; ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1;
      rr(ctx,px,12,pw,ph,10,true,true); ctx.restore();
      ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='bold 9px system-ui,sans-serif';
      ctx.fillText(pill.label,px+pw/2-ctx.measureText(pill.label).width/2,12+13);
      ctx.fillStyle=pill.accent; ctx.font='bold 16px system-ui,sans-serif';
      ctx.fillText(pill.value,px+pw/2-ctx.measureText(pill.value).width/2,12+31);
      px+=pw+pg2;
    }
    ctx.restore();
    drawSelector();
  }

  // ── Draw: Title card ─────────────────────────────────────
  function drawTitleCard() {
    // Dim overlay
    ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(0,0,WIDTH,HEIGHT);

    // Title
    ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#ffffff';
    ctx.font='bold 72px system-ui,sans-serif';
    ctx.fillText('BOOHA', WIDTH/2, HEIGHT/2-110);
    ctx.font='bold 38px system-ui,sans-serif';
    ctx.fillStyle='#ffdd44';
    ctx.fillText('DESTRUCTION', WIDTH/2, HEIGHT/2-55);

    ctx.font='16px system-ui,sans-serif';
    ctx.fillStyle='rgba(255,255,255,0.6)';
    ctx.fillText('Pull your Booha back and let fly. Smash everything!', WIDTH/2, HEIGHT/2-15);

    // Big juicy start button
    const bx=WIDTH/2-140, by=HEIGHT/2+10, bw=280, bh=70;
    // Button glow
    ctx.shadowColor='#ffdd44'; ctx.shadowBlur=28;
    const btnG=ctx.createLinearGradient(bx,by,bx,by+bh);
    btnG.addColorStop(0,'#ffe566'); btnG.addColorStop(1,'#ff9900');
    ctx.fillStyle=btnG; rr(ctx,bx,by,bw,bh,18,true,false);
    ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=2;
    rr(ctx,bx,by,bw,bh,18,false,true);
    ctx.fillStyle='#1a0e00'; ctx.font='bold 28px system-ui,sans-serif';
    ctx.fillText('START', WIDTH/2, by+bh/2);

    // Round count hint
    ctx.font='13px system-ui,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.fillText(`${LEVELS.length} rounds · 9 Booha types`, WIDTH/2, HEIGHT/2+105);
    ctx.restore();
  }

  // ── Draw: Round result card ───────────────────────────────
  function drawResultCard() {
    const isWin = gs.phase===PHASE.WIN_CARD;

    // Overlay
    ctx.fillStyle=isWin?'rgba(0,20,0,0.6)':'rgba(30,0,0,0.6)';
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';

    // Big title
    ctx.font='bold 68px system-ui,sans-serif';
    ctx.fillStyle=gs.cardAccent;
    // Glow
    ctx.shadowColor=gs.cardAccent; ctx.shadowBlur=40;
    ctx.fillText(gs.cardMessage, WIDTH/2, HEIGHT/2-90);
    ctx.shadowBlur=0;

    // Sub
    ctx.font='20px system-ui,sans-serif';
    ctx.fillStyle='rgba(255,255,255,0.75)';
    ctx.fillText(gs.cardSub, WIDTH/2, HEIGHT/2-30);

    // Stats row
    const statsY=HEIGHT/2+18;
    ctx.font='14px system-ui,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.fillText(`${Math.round(gs.destructionPct)}% destruction  ·  Best shot: ${Math.round(gs.bestShot)}%`, WIDTH/2, statsY);

    // Action button
    const bx=WIDTH/2-130, by=HEIGHT*0.62, bw=260, bh=58;
    const btnG=ctx.createLinearGradient(bx,by,bx,by+bh);
    const c1=isWin?'#44ff88':'#ff9944', c2=isWin?'#009944':'#cc4400';
    btnG.addColorStop(0,c1); btnG.addColorStop(1,c2);
    ctx.shadowColor=isWin?'#44ff88':'#ff6600'; ctx.shadowBlur=20;
    ctx.fillStyle=btnG; rr(ctx,bx,by,bw,bh,16,true,false);
    ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1.5;
    rr(ctx,bx,by,bw,bh,16,false,true);
    ctx.fillStyle='#ffffff'; ctx.font='bold 22px system-ui,sans-serif';
    ctx.fillText(isWin?'NEXT ROUND →':'TRY AGAIN', WIDTH/2, by+bh/2);

    // Auto-advance hint
    if (gs.cardTimer>0) {
      ctx.font='12px system-ui,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.3)';
      ctx.fillText(`Auto-continuing in ${Math.ceil(gs.cardTimer/1000)}s…`, WIDTH/2, by+bh+22);
    }

    ctx.restore();
  }

  // ── Main render ───────────────────────────────────────────
  function render() {
    const sx=shake.intensity>0.3?(rnd()-0.5)*shake.intensity*2:0;
    const sy=shake.intensity>0.3?(rnd()-0.5)*shake.intensity*1.4:0;

    ctx.save();
    if (sx||sy) ctx.translate(sx,sy);
    ctx.clearRect(-10,-10,WIDTH+20,HEIGHT+20);

    drawBG();
    drawFXBehind();

    if (gs.phase!==PHASE.TITLE) {
      drawTraj();
      drawBlocks();
      drawGround();
      drawSling();
      drawBooha();
    }

    drawFXFront();
    drawConfetti();
    drawFlash();
    ctx.restore();

    // Overlays (no shake)
    if (gs.phase===PHASE.TITLE) { drawTitleCard(); }
    else if (gs.phase===PHASE.WIN_CARD||gs.phase===PHASE.FAIL_CARD) { drawHUD(); drawResultCard(); }
    else { drawHUD(); }
  }

  // ── Main loop ─────────────────────────────────────────────
  let lastNow = 0;
  function tick(now) {
    const dt = Math.min(now - lastNow, 50); // cap at 50ms (tab-hidden protection)
    lastNow = now;

    // Card timer countdown
    if (gs.cardTimer > 0) gs.cardTimer = Math.max(0, gs.cardTimer - dt);

    if (gs.phase===PHASE.PLAYING) {
      updateFX();
      updateBlocks();
      updateBooha();
    } else {
      updateFX(); // keep confetti/particles alive on cards
    }

    render();
    requestAnimationFrame(tick);
  }

  // ── Resize ────────────────────────────────────────────────
  function resize() {
    const frame = document.getElementById(CFG.frameId)||canvas.parentElement;
    if (!frame) return;
    const scale=Math.min(frame.clientWidth/WIDTH, frame.clientHeight/HEIGHT);
    canvas.style.width=`${WIDTH*scale}px`; canvas.style.height=`${HEIGHT*scale}px`;
    gs.scale=scale;
  }

  function updateRotate() {
    const el=document.getElementById((CFG.ui||{}).rotateOverlay);
    if (!el) return;
    const p=window.innerWidth<900&&window.innerHeight>window.innerWidth;
    el.classList.toggle('hidden',!p); el.setAttribute('aria-hidden',p?'false':'true');
  }

  // ── Wire events ───────────────────────────────────────────
  function wireEvents() {
    canvas.addEventListener('mousedown',  onDown);
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    canvas.addEventListener('touchstart', onDown, {passive:false});
    window.addEventListener('touchmove',  onMove, {passive:false});
    window.addEventListener('touchend',   onUp,   {passive:false});
    window.addEventListener('resize', ()=>{resize();updateRotate();});
  }

  // ── Boot ──────────────────────────────────────────────────
  async function boot() {
    await preload();
    resize();
    wireEvents();
    updateRotate();
    // Start on title screen — preload round 0 silently
    loadRound(0);
    gs.phase = PHASE.TITLE;
    requestAnimationFrame(tick);
  }

  boot();
})();
