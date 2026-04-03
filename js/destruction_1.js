
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
  const GRAVITY            = 0.48;
  const AIR                = 0.999;
  const BOUNCE             = 0.72;
  const FLOOR_Y            = HEIGHT - 80;
  const SLING_X            = 180;
  const SLING_Y            = FLOOR_Y - 120;
  const MAX_PULL           = 150;
  const BOOHA_RADIUS       = 34;
  const GROUND_HEIGHT      = 54;
  const MIN_IMPACT         = 3.8;
  const WIN_TARGET         = GAMEPLAY.targetPercent  || 100;
  const GHOSTS_PER_ROUND   = GAMEPLAY.ghostsPerRound || 3;
  const DAMAGE_DECAY_SETTLE = 0.985;
  const REST_THRESHOLD     = 0.35;
  const HIT_COOLDOWN_MS    = 90;
  const CONFETTI_SETTLE_FRAMES = 40;

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
  const particles  = [];
  const shockwaves = [];
  const dustPuffs  = [];
  const confetti   = [];
  const shake = { intensity: 0, decay: 0.85 };

  // ── Booha roster ─────────────────────────────────────────
  const BOOHA_ROSTER = [
    { id:'booha',     name:'Booha',     img:'./assets/images/booha_helmet.png',    sfx:'./assets/audio/booha.mp3',         stock:5,
      confetti:{ colors:['#ffffff','#dddddd','#aaaaaa','#ffeeee','#eeddff'], shapes:['circle','star'],           size:[5,11],  burst:60,  spin:true  }},
    { id:'heavy',     name:'Heavy',     img:'./assets/images/heavy_booha.png',     sfx:'./assets/audio/boo-heavy.mp3',     stock:3,
      confetti:{ colors:['#ff6600','#cc4400','#ff9933','#ffcc00','#8b3a00'], shapes:['chunk','rect'],            size:[8,18],  burst:80,  spin:false }},
    { id:'rock',      name:'Rock',      img:'./assets/images/rock_booha.png',      sfx:'./assets/audio/boo-rock.mp3',      stock:2,
      confetti:{ colors:['#888899','#aabbcc','#445566','#ccddee','#99aaaa'], shapes:['shard','rect'],            size:[6,14],  burst:55,  spin:true  }},
    { id:'ice',       name:'Ice',       img:'./assets/images/ice_booha.png',       sfx:'./assets/audio/boo-ice.mp3',       stock:2,
      confetti:{ colors:['#aaeeff','#ddf5ff','#88ddff','#ffffff','#ccf5ff'], shapes:['crystal','star'],          size:[5,13],  burst:70,  spin:true  }},
    { id:'fire',      name:'Fire',      img:'./assets/images/fire_booha.png',      sfx:'./assets/audio/boo-fire.mp3',      stock:2,
      confetti:{ colors:['#ff3300','#ff7700','#ffaa00','#ffee00','#ff5500'], shapes:['flame','circle'],          size:[6,14],  burst:90,  spin:false }},
    { id:'princess',  name:'Princess',  img:'./assets/images/proncess_booha.png',  sfx:'./assets/audio/boo-princess.mp3',  stock:1,
      confetti:{ colors:['#ff88cc','#ffaadd','#cc44aa','#ffddee','#ffffff'], shapes:['heart','star','circle'],   size:[5,11],  burst:100, spin:true  }},
    { id:'nightmare', name:'Nightmare', img:'./assets/images/nightmare_booha.png', sfx:'./assets/audio/boo-nightmare.mp3', stock:1,
      confetti:{ colors:['#220033','#440066','#8800aa','#bb00ff','#440044'], shapes:['shard','star'],            size:[5,14],  burst:75,  spin:true  }},
    { id:'monster',   name:'Monster',   img:'./assets/images/monster_booha.png',   sfx:'./assets/audio/boo-monster.mp3',   stock:1,
      confetti:{ colors:['#00cc44','#008833','#44ff88','#ccff00','#006622'], shapes:['chunk','circle'],          size:[7,16],  burst:85,  spin:false }},
    { id:'ultimate',  name:'Ultimate',  img:'./assets/images/ultimate_booha.png',  sfx:'./assets/audio/boo-ultimate.mp3',  stock:1,
      confetti:{ colors:['#ff0080','#ff8800','#ffff00','#00ff88','#0088ff','#cc00ff'], shapes:['star','heart','crystal'], size:[6,16], burst:140, spin:true }}
  ];

  const SEL_X = 14, SEL_Y = 70, SEL_SLOT_W = 52, SEL_SLOT_H = 52, SEL_GAP = 6;

  const boohaState = {
    selected: 0,
    stocks: BOOHA_ROSTER.map(b => b.stock),
    images: new Array(BOOHA_ROSTER.length).fill(null)
  };

  const state = {
    running:false, levelIndex:0, muted:false, pointerDown:false, dragging:false,
    lastHitAt:0, impactFlash:0, bestShot:0, currentMaterial:'—', currentState:'Waiting',
    levelWon:false, levelLost:false, ghostsLeft:GHOSTS_PER_ROUND,
    destructionPercent:0, totalBreakables:0, brokenBreakables:0,
    pullPlayed:false, pendingResetBooha:false, booha:null, blocks:[],
    debrisTimer:0, messageTimer:0, images:{ bg:null },
    pointer:{x:0,y:0}, scale:1, offsetX:0, offsetY:0, raf:0
  };

  const LEVELS = window.BOOHA_DESTRUCTION_LEVELS || [];
  if (!LEVELS.length) console.error('Booha Destruction: no levels found.');

  // ── Images ───────────────────────────────────────────────
  function makeImage(src) {
    return new Promise(resolve => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img); img.onerror = () => resolve(null); img.src = src;
    });
  }
  async function preload() {
    state.images.bg = await makeImage(ASSETS.background);
    const imgs = await Promise.all(BOOHA_ROSTER.map(b => makeImage(b.img)));
    imgs.forEach((img, i) => { boohaState.images[i] = img; });
  }

  // ── Audio ────────────────────────────────────────────────
  function playSFX(src, volume=1, rate=1) {
    if (state.muted || !src) return;
    const a = new Audio(src); a.volume = Math.max(0,Math.min(1,volume)); a.playbackRate = rate; a.play().catch(()=>{});
  }
  function playPull()   { if (state.pullPlayed) return; state.pullPlayed=true; playSFX(AUDIO.pull,0.5,0.98+Math.random()*0.06); }
  function playLaunch() {
    playSFX(AUDIO.launch,0.95,0.98+Math.random()*0.06);
    const r=BOOHA_ROSTER[boohaState.selected];
    if (r) setTimeout(()=>playSFX(r.sfx,0.82,0.96+Math.random()*0.08),60);
  }
  function playHit(material,speed) {
    const now=performance.now(); if (now-state.lastHitAt<HIT_COOLDOWN_MS) return;
    state.lastHitAt=now;
    let src=AUDIO.wood;
    if (material==='stone') src=AUDIO.stone;
    if (material==='glass') src=AUDIO.glass;
    if (material==='soft')  src=AUDIO.soft;
    playSFX(src,Math.max(0.22,Math.min(1,speed/14)),0.92+Math.random()*0.18);
    state.currentMaterial=capitalize(material); state.impactFlash=1;
  }
  function playBreak()  { playSFX(AUDIO.break,0.95,0.95+Math.random()*0.08); }
  function playRubble() { playSFX(AUDIO.rubble,0.58,0.98+Math.random()*0.08); setTimeout(()=>playSFX(AUDIO.rubble,0.35,1.06),120); }
  function playGround(spd) { if (spd<12) return; playSFX(AUDIO.ground,Math.min(0.9,spd/22),0.96+Math.random()*0.08); }
  function playWin()  { playSFX(AUDIO.win,1,1); }
  function playFail() { playSFX(AUDIO.fail,0.88,1); }

  // ── Helpers ──────────────────────────────────────────────
  function capitalize(s) { return s?s.charAt(0).toUpperCase()+s.slice(1):'—'; }
  function clamp(n,mn,mx) { return Math.max(mn,Math.min(mx,n)); }
  function dist(ax,ay,bx,by) { return Math.hypot(ax-bx,ay-by); }
  function rand(a,b) { return a+Math.random()*(b-a); }
  function randItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
  function hexToRgb(hex) {
    const h=hex.replace('#','');
    if (h.length===3) return [parseInt(h[0]+h[0],16),parseInt(h[1]+h[1],16),parseInt(h[2]+h[2],16)];
    return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
  }
  function lighten(hex,amt) {
    const [r,g,b]=hexToRgb(hex);
    return `rgb(${clamp((r+amt*255)|0,0,255)},${clamp((g+amt*255)|0,0,255)},${clamp((b+amt*255)|0,0,255)})`;
  }
  function darken(hex,amt) { return lighten(hex,-amt); }

  // ── Material palette ──────────────────────────────────────
  const MAT = {
    wood:  { base:'#c8895a', mid:'#96532c', dark:'#5e2e10', edge:'#e8a870', spark:'#f0b870', chip:'#d49050', grain:true  },
    stone: { base:'#8a939f', mid:'#626b76', dark:'#3d4450', edge:'#b0bac5', spark:'#ccd4de', chip:'#9aaab8', grain:false },
    glass: { base:'#b7ecff', mid:'#70caee', dark:'#3898bb', edge:'#e0f8ff', spark:'#e8faff', chip:'#a0d8ef', grain:false },
    soft:  { base:'#f8c0e0', mid:'#e080b8', dark:'#b04080', edge:'#ffddee', spark:'#ffd0ec', chip:'#eeaad0', grain:false }
  };

  function materialFill(block) {
    const m=MAT[block.material]||MAT.wood;
    if (!block.maxHp||block.maxHp<=1) return m.base;
    const r=clamp(block.hp/block.maxHp,0,1);
    return r>0.66?m.base:r>0.33?m.mid:m.dark;
  }

  // ── FX spawners ───────────────────────────────────────────
  function spawnHitParticles(x,y,material,speed,count=8) {
    const m=MAT[material]||MAT.wood, isGlass=material==='glass';
    for (let i=0;i<count;i++) {
      const angle=rand(0,Math.PI*2), mag=rand(1.5,Math.min(12,speed*0.7)), isChip=!isGlass&&Math.random()<0.4;
      particles.push({ x,y, vx:Math.cos(angle)*mag, vy:Math.sin(angle)*mag-rand(0,3),
        life:1, r:isChip?rand(2.5,5):rand(1,2.5), color:Math.random()<0.5?m.spark:m.chip,
        type:isChip?'chip':'spark', gravity:isChip?0.28:0.12, rot:rand(0,Math.PI*2), rotV:rand(-0.2,0.2) });
    }
  }
  function spawnGlassShatter(x,y,w,h) {
    const count=10+Math.floor(rand(0,8));
    for (let i=0;i<count;i++) {
      const angle=rand(0,Math.PI*2),mag=rand(3,14);
      particles.push({ x:x+rand(-w*0.4,w*0.4), y:y+rand(-h*0.4,h*0.4),
        vx:Math.cos(angle)*mag, vy:Math.sin(angle)*mag-rand(1,5),
        life:1, r:rand(4,12), color:'#b7ecff', type:'shard', gravity:0.32,
        rot:rand(0,Math.PI*2), rotV:rand(-0.35,0.35), alpha:0.85 });
    }
  }
  function spawnDustPuff(x,y) { dustPuffs.push({x,y,r:4,maxR:rand(28,48),life:1}); }
  function spawnShockwave(x,y,color,maxR=60) { shockwaves.push({x,y,r:4,maxR,life:1,color}); }
  function addShake(amount) { shake.intensity=Math.max(shake.intensity,amount); }

  // ── Confetti ─────────────────────────────────────────────
  function spawnConfetti(cx,cy,rosterIdx) {
    const roster=BOOHA_ROSTER[rosterIdx]; if (!roster) return;
    const cfg=roster.confetti, count=cfg.burst;
    for (let i=0;i<count;i++) {
      const angle=rand(-Math.PI,0), mag=rand(4,22);
      confetti.push({
        x:cx+rand(-20,20), y:cy+rand(-10,10),
        vx:Math.cos(angle)*mag*rand(0.6,1.4), vy:Math.sin(angle)*mag-rand(2,8),
        life:1, decay:rand(0.008,0.018), r:rand(cfg.size[0],cfg.size[1]),
        color:randItem(cfg.colors), shape:randItem(cfg.shapes),
        gravity:rand(0.18,0.32), rot:rand(0,Math.PI*2),
        rotV:cfg.spin?rand(-0.18,0.18):0,
        wobble:rand(0,Math.PI*2), wobbleSpeed:rand(0.06,0.14), wobbleAmp:rand(0.5,2.5)
      });
    }
  }
  function updateConfetti() {
    for (let i=confetti.length-1;i>=0;i--) {
      const c=confetti[i];
      c.vy+=c.gravity; c.wobble+=c.wobbleSpeed;
      c.x+=c.vx+Math.sin(c.wobble)*c.wobbleAmp; c.y+=c.vy;
      c.vx*=0.985; c.rot+=c.rotV; c.life-=c.decay;
      if (c.y>FLOOR_Y-c.r*0.5) { c.y=FLOOR_Y-c.r*0.5; c.vy*=-0.28; c.vx*=0.72; c.life-=0.08; }
      if (c.life<=0) confetti.splice(i,1);
    }
  }
  function drawConfettiParticle(c) {
    ctx.save(); ctx.globalAlpha=clamp(c.life,0,1); ctx.fillStyle=c.color;
    ctx.translate(c.x,c.y); ctx.rotate(c.rot);
    switch (c.shape) {
      case 'circle':  ctx.beginPath(); ctx.ellipse(0,0,c.r,c.r*0.55,0,0,Math.PI*2); ctx.fill(); break;
      case 'rect':    ctx.fillRect(-c.r*0.55,-c.r*0.35,c.r*1.1,c.r*0.7); break;
      case 'star': {
        const sp=5,or=c.r,ir=c.r*0.42; ctx.beginPath();
        for (let s=0;s<sp*2;s++){const r2=s%2===0?or:ir,ang=(s*Math.PI)/sp-Math.PI/2;s===0?ctx.moveTo(Math.cos(ang)*r2,Math.sin(ang)*r2):ctx.lineTo(Math.cos(ang)*r2,Math.sin(ang)*r2);}
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
        ctx.quadraticCurveTo(c.r*0.8,0,c.r*0.3,-c.r*0.6); ctx.quadraticCurveTo(0,-c.r,-c.r*0.3,-c.r*0.6);
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
      const ml=(count,maxLen)=>{
        const lines=[];
        for (let i=0;i<count;i++) {
          const ox=rand(-w*0.35,w*0.35),oy=rand(-h*0.35,h*0.35),angle=rand(0,Math.PI*2),len=rand(maxLen*0.4,maxLen);
          lines.push({x1:ox,y1:oy,x2:ox+Math.cos(angle)*len,y2:oy+Math.sin(angle)*len,
            branch:Math.random()<0.4?{x:ox+Math.cos(angle)*len*0.5,y:oy+Math.sin(angle)*len*0.5,a:angle+rand(0.4,1.1)*(Math.random()<0.5?1:-1),l:len*rand(0.3,0.55)}:null});
        }
        return lines;
      };
      crackSets.set(idx,{minor:ml(3,Math.min(w,h)*0.35),mid:ml(5,Math.min(w,h)*0.55),heavy:ml(8,Math.min(w,h)*0.75)});
    }
    return crackSets.get(idx);
  }
  function drawCracks(block,idx) {
    if (block.broken||block.maxHp<=1) return;
    const ratio=clamp(block.hp/block.maxHp,0,1); if (ratio>=1) return;
    const cracks=getCracks(block,idx),cx=block.x,cy=block.y;
    let lines,alpha;
    if (ratio<0.34){lines=[...cracks.minor,...cracks.mid,...cracks.heavy];alpha=0.75;}
    else if(ratio<0.67){lines=[...cracks.minor,...cracks.mid];alpha=0.55;}
    else{lines=cracks.minor;alpha=0.35;}
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='rgba(0,0,0,0.65)'; ctx.lineWidth=1; ctx.lineCap='round';
    roundRectClip(ctx,block.x-block.w/2,block.y-block.h/2,block.w,block.h,8);
    for (const l of lines) {
      ctx.beginPath(); ctx.moveTo(cx+l.x1,cy+l.y1); ctx.lineTo(cx+l.x2,cy+l.y2); ctx.stroke();
      if (l.branch){ctx.beginPath();ctx.moveTo(cx+l.branch.x,cy+l.branch.y);ctx.lineTo(cx+l.branch.x+Math.cos(l.branch.a)*l.branch.l,cy+l.branch.y+Math.sin(l.branch.a)*l.branch.l);ctx.stroke();}
    }
    ctx.restore();
  }

  // ── UI helpers ────────────────────────────────────────────
  function setMessage(title,sub,ms=0) {
    if (!els.centerMessage) return;
    els.centerMessageTitle.textContent=title; els.centerMessageSub.textContent=sub;
    els.centerMessage.classList.remove('hidden');
    state.messageTimer=ms>0?performance.now()+ms:0;
  }
  function hideMessage() { if(els.centerMessage)els.centerMessage.classList.add('hidden'); state.messageTimer=0; }
  function setButtonsForState() {
    if(els.startBtn)els.startBtn.disabled=state.running;
    if(els.retryBtn)els.retryBtn.disabled=false;
    if(els.nextBtn)els.nextBtn.disabled=!state.levelWon;
    if(els.muteBtn){els.muteBtn.textContent=state.muted?'Sound: Off':'Sound: On';els.muteBtn.setAttribute('aria-pressed',state.muted?'true':'false');}
  }
  function updateUI() {
    const level=LEVELS[state.levelIndex]; if(!level) return;
    const target=level.targetPercent||WIN_TARGET;
    if(els.levelLabel)    els.levelLabel.textContent   =String(level.id||1);
    if(els.ghostsLabel)   els.ghostsLabel.textContent  =String(state.ghostsLeft);
    if(els.damageLabel)   els.damageLabel.textContent  =`${Math.round(state.destructionPercent)}%`;
    if(els.targetLabel)   els.targetLabel.textContent  =`${target}%`;
    if(els.blocksLabel)   els.blocksLabel.textContent  =String(state.blocks.filter(b=>!b.broken).length);
    if(els.progressText)  els.progressText.textContent =`${Math.round(state.destructionPercent)}%`;
    if(els.progressFill)  els.progressFill.style.width =`${clamp(state.destructionPercent,0,100)}%`;
    if(els.stateLabel)    els.stateLabel.textContent   =state.currentState;
    if(els.materialLabel) els.materialLabel.textContent=state.currentMaterial;
    if(els.shotLabel)     els.shotLabel.textContent    =state.bestShot>0?`${Math.round(state.bestShot)}%`:'—';
    setButtonsForState();
  }

  // ── Game objects ─────────────────────────────────────────
  function makeBooha() {
    return { active:false, launched:false, x:SLING_X, y:SLING_Y, vx:0, vy:0,
      radius:BOOHA_RADIUS, settledFrames:0, confettiFired:false, damageThisShot:0,
      rosterIdx:boohaState.selected };
  }
  function cloneBlock(def,idx) {
    const y=typeof def.floorOffset==='number'?FLOOR_Y-def.floorOffset:def.y;
    crackSets.delete(idx);
    return {x:def.x,y,w:def.w,h:def.h,material:def.material||'wood',hp:def.hp||1,maxHp:def.hp||1,broken:false,shake:0,vy:0,fallen:false,hitFlash:0,points:100};
  }

  // ── Level management ─────────────────────────────────────
  function resetRoundState() {
    state.pointerDown=false;state.dragging=false;state.pullPlayed=false;
    state.levelWon=false;state.levelLost=false;state.bestShot=0;
    state.currentMaterial='—';state.currentState='Waiting';
    state.destructionPercent=0;state.brokenBreakables=0;state.debrisTimer=0;state.pendingResetBooha=false;
    particles.length=0;shockwaves.length=0;dustPuffs.length=0;confetti.length=0;
    crackSets.clear();shake.intensity=0;
    boohaState.stocks=BOOHA_ROSTER.map(b=>b.stock);
  }
  function loadLevel(index) {
    state.levelIndex=clamp(index,0,LEVELS.length-1);
    const level=LEVELS[state.levelIndex];
    resetRoundState();
    state.running=false; state.ghostsLeft=level.ghosts||GHOSTS_PER_ROUND;
    state.booha=makeBooha(); state.blocks=level.blocks.map((def,i)=>cloneBlock(def,i));
    state.totalBreakables=state.blocks.length; state.destructionPercent=0;
    setMessage(`LEVEL ${level.id}`,'Pull to launch.',1400); updateUI();
  }
  function startGame()  { state.running=true;state.currentState='Aiming';hideMessage();updateUI(); }
  function retryLevel() { loadLevel(state.levelIndex);startGame(); }
  function nextLevel()  { loadLevel((state.levelIndex+1)%LEVELS.length);startGame(); }

  // ── Input ─────────────────────────────────────────────────
  function worldPoint(evt) {
    const rect=els.canvas.getBoundingClientRect();
    const clientX=evt.touches?evt.touches[0].clientX:evt.clientX;
    const clientY=evt.touches?evt.touches[0].clientY:evt.clientY;
    return {x:(clientX-rect.left)/state.scale,y:(clientY-rect.top)/state.scale};
  }
  function selectorHitTest(px,py) {
    for (let i=0;i<BOOHA_ROSTER.length;i++) {
      const sy=SEL_Y+i*(SEL_SLOT_H+SEL_GAP);
      if (px>=SEL_X&&px<=SEL_X+SEL_SLOT_W&&py>=sy&&py<=sy+SEL_SLOT_H) return i;
    }
    return -1;
  }
  function pointerDown(evt) {
    const p=worldPoint(evt);
    const slotIdx=selectorHitTest(p.x,p.y);
    if (slotIdx!==-1) {
      if (boohaState.stocks[slotIdx]>0) {
        boohaState.selected=slotIdx;
        if (state.booha&&!state.booha.launched) state.booha=makeBooha();
        updateUI();
      }
      evt.preventDefault();evt.stopPropagation();return;
    }
    if (!state.booha||state.booha.launched||state.levelWon||state.levelLost) return;
    if (!state.running) startGame();
    if (dist(p.x,p.y,state.booha.x,state.booha.y)>state.booha.radius+20) return;
    state.dragging=true;state.pointerDown=true;state.pullPlayed=false;
    state.currentState='Pulling';playPull();updateUI();
    evt.preventDefault();evt.stopPropagation();
  }
  function pointerMove(evt) {
    if (!state.dragging||!state.booha||state.booha.launched) return;
    const p=worldPoint(evt);
    const dx=p.x-SLING_X,dy=p.y-SLING_Y;
    const ang=Math.atan2(dy,dx),d=Math.min(MAX_PULL,Math.hypot(dx,dy));
    state.booha.x=SLING_X+Math.cos(ang)*d;
    state.booha.y=Math.min(SLING_Y+Math.sin(ang)*d,FLOOR_Y-state.booha.radius-4);
    evt.preventDefault();
  }
  function pointerUp(evt) {
    if (!state.dragging) return;
    state.dragging=false;state.pointerDown=false;state.pullPlayed=false;
    if (!state.booha||state.booha.launched) return;
    const dx=SLING_X-state.booha.x,dy=SLING_Y-state.booha.y,mag=Math.hypot(dx,dy);
    if (mag<12){state.booha.x=SLING_X;state.booha.y=SLING_Y;state.currentState='Aiming';updateUI();return;}
    boohaState.stocks[boohaState.selected]=Math.max(0,boohaState.stocks[boohaState.selected]-1);
    state.booha.vx=dx*0.19;state.booha.vy=dy*0.19;
    state.booha.active=true;state.booha.launched=true;state.booha.damageThisShot=0;
    state.currentState=`Flying ${Math.round((mag/MAX_PULL)*100)}%`;
    playLaunch();updateUI();
  }

  // ── Physics ──────────────────────────────────────────────
  function damageBlock(block,amount,hitX,hitY,speed) {
    if (block.broken) return;
    block.hp-=amount;block.shake=1;block.hitFlash=1;
    const mat=block.material,m=MAT[mat]||MAT.wood;
    spawnHitParticles(hitX,hitY,mat,speed,Math.floor(6+speed*0.5));
    spawnShockwave(hitX,hitY,m.spark,35+speed*2);
    if (speed>10) addShake(Math.min(6,speed*0.4));
    if (block.hp<=0) {
      block.broken=true; state.brokenBreakables+=1;
      state.destructionPercent=(state.brokenBreakables/state.totalBreakables)*100;
      if (state.booha){state.booha.damageThisShot=state.destructionPercent;state.bestShot=Math.max(state.bestShot,state.booha.damageThisShot);}
      if (mat==='glass'){spawnGlassShatter(block.x,block.y,block.w,block.h);spawnShockwave(block.x,block.y,'#b7ecff',70);}
      else{spawnHitParticles(block.x,block.y,mat,speed+4,20);spawnShockwave(block.x,block.y,m.spark,60);}
      addShake(Math.min(10,speed*0.6+4));playBreak();state.debrisTimer=18;
    }
  }
  function boohaBlockCollision(block) {
    const b=state.booha; if (!b||!b.launched||block.broken) return;
    const closestX=clamp(b.x,block.x-block.w/2,block.x+block.w/2);
    const closestY=clamp(b.y,block.y-block.h/2,block.y+block.h/2);
    const dx=b.x-closestX,dy=b.y-closestY,distSq=dx*dx+dy*dy;
    if (distSq>b.radius*b.radius) return;
    const speed=Math.hypot(b.vx,b.vy); if (speed<MIN_IMPACT) return;
    playHit(block.material,speed);
    const damage=block.material==='stone'?(speed>11?1:0):block.material==='glass'?1:block.material==='soft'?(speed>5?1:0):(speed>7?1:0);
    if (damage>0) damageBlock(block,damage,closestX,closestY,speed);
    const nx=dx===0&&dy===0?1:dx/Math.sqrt(distSq||1),ny=dx===0&&dy===0?0:dy/Math.sqrt(distSq||1);
    const dot=b.vx*nx+b.vy*ny;
    b.vx=(b.vx-2*dot*nx)*BOUNCE; b.vy=(b.vy-2*dot*ny)*BOUNCE;
    if (Math.abs(dx)>Math.abs(dy)) b.x=closestX+nx*(b.radius+1); else b.y=closestY+ny*(b.radius+1);
  }
  function updateBlocks() {
    for (const block of state.blocks) {
      if (block.broken) {
        block.vy+=GRAVITY*0.6;block.y+=block.vy;
        if (!block.fallen&&block.y+block.h/2>=FLOOR_Y) {
          block.y=FLOOR_Y-block.h/2;block.fallen=true;
          const spd=Math.abs(block.vy);playGround(spd);
          if (spd>6){spawnDustPuff(block.x,FLOOR_Y);spawnDustPuff(block.x+rand(-20,20),FLOOR_Y);spawnHitParticles(block.x,FLOOR_Y,block.material,spd,6);}
          block.vy*=-0.18;
        }
        block.vy*=0.985;
      }
      block.shake*=0.84;block.hitFlash*=0.88;
    }
    if (state.debrisTimer>0){if(state.debrisTimer===18)playRubble();state.debrisTimer-=1;}
  }
  function updateBooha() {
    const b=state.booha; if (!b||!b.launched) return;
    b.vy+=GRAVITY;b.vx*=AIR;b.vy*=AIR;b.x+=b.vx;b.y+=b.vy;
    if (b.x-b.radius<0){b.x=b.radius;b.vx*=-BOUNCE;}
    if (b.x+b.radius>WIDTH){b.x=WIDTH-b.radius;b.vx*=-BOUNCE;}
    if (b.y+b.radius>=FLOOR_Y) {
      const spd=Math.abs(b.vy);
      if (spd>8){playGround(spd);spawnDustPuff(b.x,FLOOR_Y);addShake(Math.min(4,spd*0.2));}
      b.y=FLOOR_Y-b.radius;b.vy*=-0.38;b.vx*=0.86;
    }
    for (const block of state.blocks) boohaBlockCollision(block);
    const speed=Math.hypot(b.vx,b.vy),onFloor=Math.abs(b.y-(FLOOR_Y-b.radius))<2;
    if (speed<REST_THRESHOLD&&onFloor) {
      b.vx*=DAMAGE_DECAY_SETTLE;b.vy*=DAMAGE_DECAY_SETTLE;b.settledFrames+=1;
      if (!b.confettiFired&&b.settledFrames>=CONFETTI_SETTLE_FRAMES) {
        b.confettiFired=true;
        spawnConfetti(b.x,b.y-b.radius,b.rosterIdx);
        setTimeout(finishShot,600);
      }
    } else { b.settledFrames=0; }
    if (b.y>HEIGHT+200||b.x<-200||b.x>WIDTH+200) finishShot();
  }
  function finishShot() {
    const b=state.booha; if (!b||!b.launched||state.pendingResetBooha) return;
    state.ghostsLeft=Math.max(0,state.ghostsLeft-1);
    state.pendingResetBooha=true;state.currentState='Settled';
    updateProgressAndState();
  }
  function updateProgressAndState() {
    const level=LEVELS[state.levelIndex]||LEVELS[0],target=level.targetPercent||WIN_TARGET;
    state.destructionPercent=(state.brokenBreakables/Math.max(1,state.totalBreakables))*100;
    if (!state.levelWon&&state.destructionPercent>=target) {
      state.levelWon=true;state.running=false;state.currentState='Cleared';
      setMessage('100% DESTRUCTION','Perfect ruin.',2200);playWin();
    } else if (!state.levelLost&&state.ghostsLeft<=0&&state.pendingResetBooha) {
      state.levelLost=true;state.running=false;state.currentState='Failed';
      setMessage('ROUND OVER','Try again.',2200);playFail();
    }
    updateUI();
  }
  function resetBoohaIfNeeded() {
    if (!state.pendingResetBooha||state.levelWon||state.levelLost) return;
    state.pendingResetBooha=false;
    let found=false;
    for (let i=0;i<BOOHA_ROSTER.length;i++) {
      const tryIdx=(boohaState.selected+i)%BOOHA_ROSTER.length;
      if (boohaState.stocks[tryIdx]>0){boohaState.selected=tryIdx;found=true;break;}
    }
    if (found){state.booha=makeBooha();state.currentState='Aiming';updateUI();}
    else{state.ghostsLeft=0;updateProgressAndState();}
  }

  // ── FX Update ────────────────────────────────────────────
  function updateFX() {
    for (let i=particles.length-1;i>=0;i--) {
      const p=particles[i];
      p.vy+=p.gravity;p.x+=p.vx;p.y+=p.vy;p.vx*=0.97;
      if (p.rot!==undefined) p.rot+=p.rotV;
      p.life-=0.024+0.005*Math.random();
      if (p.y>FLOOR_Y-p.r&&(p.type==='chip'||p.type==='shard')){p.y=FLOOR_Y-p.r;p.vy*=-0.38;p.vx*=0.78;if(Math.abs(p.vy)>5)spawnDustPuff(p.x,FLOOR_Y);}
      if (p.life<=0) particles.splice(i,1);
    }
    for (let i=shockwaves.length-1;i>=0;i--){const s=shockwaves[i];s.r+=(s.maxR-s.r)*0.18;s.life-=0.06;if(s.life<=0)shockwaves.splice(i,1);}
    for (let i=dustPuffs.length-1;i>=0;i--){const d=dustPuffs[i];d.r+=(d.maxR-d.r)*0.12;d.life-=0.05;if(d.life<=0)dustPuffs.splice(i,1);}
    shake.intensity*=shake.decay;
    updateConfetti();
  }

  // ── Draw helpers ─────────────────────────────────────────
  function roundRect(context,x,y,w,h,r,fill,stroke) {
    context.beginPath();context.moveTo(x+r,y);
    context.arcTo(x+w,y,x+w,y+h,r);context.arcTo(x+w,y+h,x,y+h,r);
    context.arcTo(x,y+h,x,y,r);context.arcTo(x,y,x+w,y,r);
    context.closePath();if(fill)context.fill();if(stroke)context.stroke();
  }
  function roundRectClip(context,x,y,w,h,r) {
    context.beginPath();context.moveTo(x+r,y);
    context.arcTo(x+w,y,x+w,y+h,r);context.arcTo(x+w,y+h,x,y+h,r);
    context.arcTo(x,y+h,x,y,r);context.arcTo(x,y,x+w,y,r);
    context.closePath();context.clip();
  }

  // ── Draw: Background ─────────────────────────────────────
  function drawBackground() {
    if (state.images.bg){ctx.drawImage(state.images.bg,0,0,WIDTH,HEIGHT);}
    else{const g=ctx.createLinearGradient(0,0,0,HEIGHT);g.addColorStop(0,'#292733');g.addColorStop(1,'#121015');ctx.fillStyle=g;ctx.fillRect(0,0,WIDTH,HEIGHT);}
    ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(0,HEIGHT-GROUND_HEIGHT,WIDTH,GROUND_HEIGHT);
  }

  // ── Draw: Slingshot ───────────────────────────────────────
  function drawSling() {
    const b=state.booha||makeBooha();
    const forkBaseX=SLING_X,forkBaseY=FLOOR_Y+4,forkTopY=SLING_Y-52;
    const leftX=SLING_X-26,rightX=SLING_X+26;

    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';

    // Ground shadow
    ctx.beginPath();ctx.ellipse(forkBaseX,forkBaseY+6,14,5,0,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.28)';ctx.fill();

    // Wood gradient
    const wg=ctx.createLinearGradient(forkBaseX-18,0,forkBaseX+18,0);
    wg.addColorStop(0,'#3a2210');wg.addColorStop(0.35,'#5c3318');wg.addColorStop(0.65,'#6e3e1e');wg.addColorStop(1,'#3a2210');

    // Left arm
    ctx.beginPath();ctx.moveTo(forkBaseX-6,forkBaseY);ctx.quadraticCurveTo(forkBaseX-28,forkBaseY-80,leftX,forkTopY);
    ctx.lineWidth=18;ctx.strokeStyle='#2a1608';ctx.stroke();
    ctx.lineWidth=13;ctx.strokeStyle=wg;ctx.stroke();
    // Right arm
    ctx.beginPath();ctx.moveTo(forkBaseX+6,forkBaseY);ctx.quadraticCurveTo(forkBaseX+28,forkBaseY-80,rightX,forkTopY);
    ctx.lineWidth=18;ctx.strokeStyle='#2a1608';ctx.stroke();
    ctx.lineWidth=13;ctx.strokeStyle=wg;ctx.stroke();
    // Stem
    ctx.beginPath();ctx.moveTo(forkBaseX,forkBaseY);ctx.lineTo(forkBaseX,forkBaseY-45);
    ctx.lineWidth=20;ctx.strokeStyle='#2a1608';ctx.stroke();
    ctx.lineWidth=15;ctx.strokeStyle=wg;ctx.stroke();

    // Grain highlights
    ctx.globalAlpha=0.18;ctx.strokeStyle='#e8a060';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(forkBaseX-3,forkBaseY-10);ctx.quadraticCurveTo(forkBaseX-24,forkBaseY-75,leftX+2,forkTopY+10);ctx.stroke();
    ctx.beginPath();ctx.moveTo(forkBaseX+3,forkBaseY-10);ctx.quadraticCurveTo(forkBaseX+24,forkBaseY-75,rightX-2,forkTopY+10);ctx.stroke();
    ctx.globalAlpha=1;

    // Knobs
    const drawKnob=(kx,ky)=>{
      ctx.beginPath();ctx.arc(kx,ky,9,0,Math.PI*2);ctx.fillStyle='#2a1608';ctx.fill();
      ctx.beginPath();ctx.arc(kx,ky,7,0,Math.PI*2);ctx.fillStyle='#6e3e1e';ctx.fill();
      ctx.beginPath();ctx.arc(kx-2,ky-2,3,0,Math.PI*2);ctx.fillStyle='rgba(220,160,80,0.4)';ctx.fill();
      ctx.beginPath();ctx.arc(kx,ky,7,0,Math.PI*2);ctx.strokeStyle='#1a0e04';ctx.lineWidth=1.5;ctx.stroke();
    };
    drawKnob(leftX,forkTopY);drawKnob(rightX,forkTopY);

    // Elastic bands
    if (!b.launched) {
      const bx=state.dragging?b.x:SLING_X,by=state.dragging?b.y:SLING_Y;
      const stretch=Math.hypot(bx-SLING_X,by-SLING_Y)/MAX_PULL;
      const bandW=Math.max(2.5,6-stretch*3);
      ctx.globalAlpha=0.6;ctx.strokeStyle='#4a2a18';ctx.lineWidth=bandW+2;
      ctx.beginPath();ctx.moveTo(leftX,forkTopY);ctx.lineTo(bx,by);ctx.stroke();
      ctx.moveTo(rightX,forkTopY);ctx.lineTo(bx,by);ctx.stroke();
      ctx.globalAlpha=1;
      const bg=ctx.createLinearGradient(leftX,forkTopY,bx,by);
      bg.addColorStop(0,'#8b5a30');bg.addColorStop(0.5,'#c07838');bg.addColorStop(1,'#8b5a30');
      ctx.strokeStyle=bg;ctx.lineWidth=bandW;
      ctx.beginPath();ctx.moveTo(leftX,forkTopY);ctx.lineTo(bx,by);ctx.stroke();
      ctx.moveTo(rightX,forkTopY);ctx.lineTo(bx,by);ctx.stroke();
      if (!state.dragging) {
        ctx.fillStyle='#5c3018';ctx.strokeStyle='#3a1e08';ctx.lineWidth=1.5;
        ctx.beginPath();ctx.ellipse(bx,by,12,9,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ── Draw: Booha ───────────────────────────────────────────
  function drawBooha() {
    const b=state.booha; if (!b) return;
    const img=boohaState.images[b.rosterIdx];
    ctx.save();ctx.translate(b.x,b.y);
    if (b.launched) ctx.rotate(Math.atan2(b.vy,b.vx)*0.2);
    if (img) {
      ctx.drawImage(img,-b.radius*1.4,-b.radius*1.4,b.radius*2.8,b.radius*2.8);
    } else {
      ctx.fillStyle='#ffffff';ctx.beginPath();
      ctx.arc(0,0,b.radius,Math.PI,0,false);ctx.lineTo(b.radius,22);
      ctx.quadraticCurveTo(0,b.radius+12,-b.radius,22);ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }

  // ── Draw: Blocks ─────────────────────────────────────────
  function drawBlocks() {
    for (let i=0;i<state.blocks.length;i++) {
      const block=state.blocks[i];
      const shakeX=(Math.random()-0.5)*8*block.shake,shakeY=(Math.random()-0.5)*6*block.shake;
      const bx=block.x-block.w/2,by=block.y-block.h/2,bw=block.w,bh=block.h;
      const m=MAT[block.material]||MAT.wood;
      ctx.save();ctx.globalAlpha=block.broken?0.28:1;ctx.translate(shakeX,shakeY);

      // Gradient fill
      const fg=ctx.createLinearGradient(bx,by,bx,by+bh);
      fg.addColorStop(0,lighten(materialFill(block),0.12));
      fg.addColorStop(0.5,materialFill(block));
      fg.addColorStop(1,darken(materialFill(block),0.14));
      ctx.fillStyle=fg;ctx.strokeStyle=darken(m.edge,0.3);ctx.lineWidth=2;
      roundRect(ctx,bx,by,bw,bh,8,true,true);

      if (!block.broken) {
        // Top bevel highlight
        ctx.save();ctx.globalAlpha=0.32;ctx.fillStyle=m.edge;
        roundRectClip(ctx,bx,by,bw,bh,8);ctx.fillRect(bx,by,bw,5);ctx.restore();
        // Left edge light
        ctx.save();ctx.globalAlpha=0.15;ctx.fillStyle=m.edge;
        roundRectClip(ctx,bx,by,bw,bh,8);ctx.fillRect(bx,by,4,bh);ctx.restore();
        // Wood grain
        if (m.grain) {
          ctx.save();ctx.globalAlpha=0.09;ctx.strokeStyle='rgba(255,210,160,0.5)';ctx.lineWidth=1;
          roundRectClip(ctx,bx,by,bw,bh,8);
          for (let g=0;g<bh;g+=8){ctx.beginPath();ctx.moveTo(bx,by+g+rand(-1,1));ctx.lineTo(bx+bw,by+g+rand(-1,1));ctx.stroke();}
          ctx.restore();
        }
        // Glass shimmer
        if (block.material==='glass') {
          ctx.save();ctx.globalAlpha=0.22;
          const sg=ctx.createLinearGradient(bx,by,bx+bw*0.7,by+bh*0.7);
          sg.addColorStop(0,'rgba(255,255,255,0.9)');sg.addColorStop(0.5,'rgba(255,255,255,0)');
          ctx.fillStyle=sg;roundRectClip(ctx,bx,by,bw,bh,8);ctx.fillRect(bx,by,bw,bh);ctx.restore();
        }
        // Stone noise
        if (block.material==='stone') {
          ctx.save();ctx.globalAlpha=0.08;roundRectClip(ctx,bx,by,bw,bh,8);
          for (let d=0;d<Math.floor(bw*bh/200);d++){ctx.beginPath();ctx.arc(bx+rand(6,bw-6),by+rand(6,bh-6),rand(1,2.5),0,Math.PI*2);ctx.fillStyle=Math.random()<0.5?'rgba(255,255,255,0.8)':'rgba(0,0,0,0.6)';ctx.fill();}
          ctx.restore();
        }
        // Soft sparkle dots
        if (block.material==='soft') {
          ctx.save();ctx.globalAlpha=0.12;roundRectClip(ctx,bx,by,bw,bh,8);
          for (let d=0;d<6;d++){ctx.beginPath();ctx.arc(bx+rand(6,bw-6),by+rand(6,bh-6),rand(1.5,3),0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.9)';ctx.fill();}
          ctx.restore();
        }
      }

      // HP bar (bottom)
      if (!block.broken&&block.maxHp>1) {
        const hpR=clamp(block.hp/block.maxHp,0,1);
        ctx.fillStyle='rgba(0,0,0,0.35)';roundRect(ctx,bx+8,by+bh-12,bw-16,7,3,true,false);
        ctx.fillStyle=hpR>0.66?'#44ee77':hpR>0.33?'#ffcc33':'#ff4444';
        roundRect(ctx,bx+8,by+bh-12,(bw-16)*hpR,7,3,true,false);
        ctx.globalAlpha=(block.broken?0.28:1)*0.4;ctx.fillStyle='#ffffff';
        roundRect(ctx,bx+8,by+bh-12,(bw-16)*hpR,3,2,true,false);
        ctx.globalAlpha=block.broken?0.28:1;
      }
      // Hit flash
      if (block.hitFlash>0){ctx.fillStyle=`rgba(255,255,255,${0.42*block.hitFlash})`;roundRect(ctx,bx,by,bw,bh,8,true,false);}
      // Depth stroke
      ctx.strokeStyle='rgba(0,0,0,0.28)';ctx.lineWidth=1.5;roundRect(ctx,bx+1.5,by+1.5,bw-3,bh-3,7,false,true);

      ctx.restore();
      if (!block.broken) drawCracks(block,i);
    }
  }

  // ── Draw: Trajectory ─────────────────────────────────────
  function drawTrajectoryHint() {
    if (!state.dragging||!state.booha) return;
    const b=state.booha;let tx=b.x,ty=b.y,tvx=(SLING_X-b.x)*0.19,tvy=(SLING_Y-b.y)*0.19;
    ctx.save();
    for (let i=0;i<22;i++){tvy+=GRAVITY;tvx*=AIR;tvy*=AIR;tx+=tvx;ty+=tvy;
      ctx.globalAlpha=(1-i/22)*0.55;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(tx,ty,Math.max(1.5,5.5-i*0.2),0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }

  // ── Draw: Ground line ────────────────────────────────────
  function drawGroundLine() {
    ctx.save();const g=ctx.createLinearGradient(0,FLOOR_Y-8,0,FLOOR_Y+20);
    g.addColorStop(0,'rgba(255,255,255,0.28)');g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g;ctx.fillRect(0,FLOOR_Y-8,WIDTH,16);ctx.restore();
  }

  // ── Draw: Selector ───────────────────────────────────────
  function drawSelector() {
    ctx.save();
    for (let i=0;i<BOOHA_ROSTER.length;i++) {
      const roster=BOOHA_ROSTER[i],sx=SEL_X,sy=SEL_Y+i*(SEL_SLOT_H+SEL_GAP);
      const stock=boohaState.stocks[i],isSel=i===boohaState.selected,isAvail=stock>0;

      // Slot bg
      ctx.save();ctx.globalAlpha=isSel?0.92:0.65;
      ctx.fillStyle=isSel?'rgba(255,255,255,0.16)':'rgba(10,8,18,0.6)';
      ctx.strokeStyle=isSel?'rgba(255,255,255,0.55)':'rgba(255,255,255,0.08)';ctx.lineWidth=isSel?2:1;
      roundRect(ctx,sx,sy,SEL_SLOT_W,SEL_SLOT_H,10,true,true);ctx.restore();

      // Image
      const img=boohaState.images[i];
      ctx.save();ctx.globalAlpha=isAvail?(isSel?1:0.7):0.22;
      if (img) ctx.drawImage(img,sx+4,sy+4,SEL_SLOT_W-8,SEL_SLOT_H-18);
      else{ctx.beginPath();ctx.arc(sx+SEL_SLOT_W/2,sy+SEL_SLOT_H/2-6,16,0,Math.PI*2);ctx.fillStyle='#aaa';ctx.fill();}
      ctx.restore();

      // Stock badge
      const badgeW=stock>=10?22:16;
      ctx.save();ctx.globalAlpha=isAvail?1:0.4;
      ctx.fillStyle=isAvail?(isSel?'#ffffff':'rgba(255,255,255,0.55)'):'rgba(255,255,255,0.2)';
      ctx.strokeStyle='rgba(0,0,0,0.4)';ctx.lineWidth=1;
      roundRect(ctx,sx+SEL_SLOT_W-badgeW-2,sy+SEL_SLOT_H-14,badgeW,12,6,true,true);
      ctx.fillStyle=isAvail?(isSel?'#111':'#333'):'#999';
      ctx.font='bold 8px system-ui,sans-serif';ctx.textBaseline='middle';
      ctx.fillText(String(stock),sx+SEL_SLOT_W-badgeW*0.5-2,sy+SEL_SLOT_H-8);
      ctx.restore();

      // Selected pulse ring
      if (isSel){
        const pulse=0.5+0.5*Math.sin(performance.now()*0.004);
        ctx.save();ctx.globalAlpha=0.25*pulse;ctx.strokeStyle='#ffffff';ctx.lineWidth=3;
        roundRect(ctx,sx-2,sy-2,SEL_SLOT_W+4,SEL_SLOT_H+4,12,false,true);ctx.restore();
      }
    }
    ctx.restore();
  }

  // ── Draw: HUD ────────────────────────────────────────────
  function drawHUD() {
    const level=LEVELS[state.levelIndex]; if (!level) return;
    const target=level.targetPercent||WIN_TARGET;
    ctx.save();ctx.textBaseline='middle';

    // Progress bar
    const barW=WIDTH*clamp(state.destructionPercent/100,0,1);
    ctx.save();ctx.globalAlpha=0.55;ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(0,3,WIDTH,5);
    const bg=ctx.createLinearGradient(0,0,WIDTH,0);
    bg.addColorStop(0,'#ff7cfb');bg.addColorStop(0.5,'#7cfff8');bg.addColorStop(1,'#ffdf80');
    ctx.fillStyle=bg;ctx.fillRect(0,3,barW,5);ctx.restore();

    // Level badge
    ctx.save();ctx.globalAlpha=0.88;ctx.fillStyle='rgba(10,8,16,0.75)';ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
    roundRect(ctx,SEL_X,12,SEL_SLOT_W,50,10,true,true);ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.45)';ctx.font='bold 9px system-ui,sans-serif';
    ctx.fillText('LEVEL',SEL_X+SEL_SLOT_W/2-ctx.measureText('LEVEL').width/2,24);
    ctx.fillStyle='#ffffff';ctx.font='bold 20px system-ui,sans-serif';
    ctx.fillText(String(level.id||1),SEL_X+SEL_SLOT_W/2-ctx.measureText(String(level.id||1)).width/2,44);

    // Right pills
    const pills=[
      {label:'GHOSTS',value:String(state.ghostsLeft),accent:'#ff9f7f'},
      {label:'DAMAGE',value:`${Math.round(state.destructionPercent)}%`,accent:'#7cfff8'},
      {label:'TARGET',value:`${target}%`,accent:'#ffdf80'}
    ];
    const pillW=90,pillH=44,pillGap=10;
    let px=WIDTH-14-pills.length*(pillW+pillGap)+pillGap;
    for (const pill of pills) {
      ctx.save();ctx.globalAlpha=0.85;ctx.fillStyle='rgba(10,8,16,0.72)';ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
      roundRect(ctx,px,12,pillW,pillH,10,true,true);ctx.restore();
      ctx.fillStyle='rgba(255,255,255,0.45)';ctx.font='bold 9px system-ui,sans-serif';
      ctx.fillText(pill.label,px+pillW/2-ctx.measureText(pill.label).width/2,12+13);
      ctx.fillStyle=pill.accent;ctx.font='bold 16px system-ui,sans-serif';
      ctx.fillText(pill.value,px+pillW/2-ctx.measureText(pill.value).width/2,12+31);
      px+=pillW+pillGap;
    }
    ctx.restore();
    drawSelector();
  }

  // ── FX drawing ───────────────────────────────────────────
  function drawFXBehind() {
    for (const d of dustPuffs){ctx.save();ctx.globalAlpha=d.life*0.22;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle='rgba(200,190,180,0.5)';ctx.fill();ctx.restore();}
    for (const s of shockwaves){ctx.save();ctx.globalAlpha=s.life*0.7;ctx.strokeStyle=s.color;ctx.lineWidth=2.5*s.life;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.stroke();ctx.restore();}
  }
  function drawFXFront() {
    for (const p of particles) {
      ctx.save();ctx.globalAlpha=clamp(p.life,0,1)*(p.alpha||1);ctx.fillStyle=p.color;
      ctx.translate(p.x,p.y);if(p.rot!==undefined)ctx.rotate(p.rot);
      if (p.type==='shard'){const s=p.r;ctx.beginPath();ctx.moveTo(0,-s);ctx.lineTo(s*0.7,s*0.6);ctx.lineTo(-s*0.7,s*0.4);ctx.closePath();ctx.fillStyle=p.color;ctx.strokeStyle='rgba(180,240,255,0.6)';ctx.lineWidth=0.8;ctx.fill();ctx.stroke();}
      else if(p.type==='chip'){ctx.fillRect(-p.r*0.6,-p.r*0.4,p.r*1.2,p.r*0.8);}
      else{ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);ctx.fill();}
      ctx.restore();
    }
  }

  // ── Impact flash ─────────────────────────────────────────
  function drawImpactFlash() {
    if (state.impactFlash<=0) return;
    ctx.save();ctx.fillStyle=`rgba(255,255,255,${0.07*state.impactFlash})`;ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.restore();
    state.impactFlash*=0.84;
  }

  // ── Render ───────────────────────────────────────────────
  function render() {
    const sx=shake.intensity>0.3?(Math.random()-0.5)*shake.intensity*2:0;
    const sy=shake.intensity>0.3?(Math.random()-0.5)*shake.intensity*1.4:0;
    ctx.save();if(sx||sy)ctx.translate(sx,sy);
    ctx.clearRect(-10,-10,WIDTH+20,HEIGHT+20);
    drawBackground();drawFXBehind();drawTrajectoryHint();
    drawBlocks();drawGroundLine();drawSling();drawBooha();
    drawFXFront();drawConfetti();drawImpactFlash();
    ctx.restore();
    drawHUD();  // HUD after restore — not shaken
  }

  // ── Loop ─────────────────────────────────────────────────
  function tick(now) {
    if (state.messageTimer&&now>=state.messageTimer) hideMessage();
    updateFX();updateBlocks();updateBooha();
    updateProgressAndState();resetBoohaIfNeeded();
    render();state.raf=requestAnimationFrame(tick);
  }

  // ── Resize ────────────────────────────────────────────────
  function resizeCanvas() {
    const frame=els.frame; if (!frame) return;
    const scale=Math.min(frame.clientWidth/WIDTH,frame.clientHeight/HEIGHT);
    els.canvas.style.width=`${WIDTH*scale}px`;els.canvas.style.height=`${HEIGHT*scale}px`;
    state.scale=scale;state.offsetX=(frame.clientWidth-WIDTH*scale)/2;state.offsetY=(frame.clientHeight-HEIGHT*scale)/2;
  }
  function updateRotateOverlay() {
    if (!els.rotateOverlay) return;
    const p=window.innerWidth<900&&window.innerHeight>window.innerWidth;
    els.rotateOverlay.classList.toggle('hidden',!p);els.rotateOverlay.setAttribute('aria-hidden',p?'false':'true');
  }

  // ── Events ────────────────────────────────────────────────
  function wireEvents() {
    els.canvas.addEventListener('mousedown',pointerDown);
    window.addEventListener('mousemove',pointerMove);window.addEventListener('mouseup',pointerUp);
    els.canvas.addEventListener('touchstart',pointerDown,{passive:false});
    window.addEventListener('touchmove',pointerMove,{passive:false});window.addEventListener('touchend',pointerUp,{passive:false});
    els.startBtn?.addEventListener('click',()=>{if(!state.running&&!state.levelWon&&!state.levelLost)startGame();});
    els.retryBtn?.addEventListener('click',retryLevel);els.nextBtn?.addEventListener('click',nextLevel);
    els.muteBtn?.addEventListener('click',()=>{state.muted=!state.muted;updateUI();});
    window.addEventListener('resize',()=>{resizeCanvas();updateRotateOverlay();});
  }

  // ── Boot ──────────────────────────────────────────────────
  async function boot() {
    await preload();resizeCanvas();wireEvents();
    loadLevel(GAMEPLAY.levelId?GAMEPLAY.levelId-1:0);
    updateRotateOverlay();render();state.raf=requestAnimationFrame(tick);
  }

  boot();
})();
