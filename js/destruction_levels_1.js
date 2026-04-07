
// ============================================================
// Booha Destruction — Levels Pack (v4 — Traits & Resist)
//
// BLOCK PROPERTY REFERENCE:
//   traits: ['fireproof']      — Fire Booha hits deflect
//   traits: ['iceproof']       — Ice Booha can't freeze it
//   traits: ['heavyproof']     — Heavy Booha deals only base damage
//   traits: ['rockproof']      — Rock Booha can't pierce it
//   traits: ['rainbowproof']   — Rainbow can't convert it
//   traits: ['ultimateproof']  — Ultimate blast ignores it
//   traits: ['burnimmune']     — Fire spread can't ignite it
//   traits: ['freezeimmune']   — Ice aura can't freeze it
//   traits: ['convertimmune']  — Rainbow can't glass-ify it
//
//   resist: { fire: 0.5 }      — Fire deals half damage (not zero)
//   resist: { heavy: 0.4 }     — Heavy deals 40% damage
//
// VISUAL: Immune/resistant blocks get a pulsing coloured border
//   ultimateproof = magenta   fireproof = red-orange
//   iceproof      = cyan      heavyproof = amber
//   rockproof     = grey      rainbowproof = lime
//
// DESIGN PHILOSOPHY (v4):
//   Rounds 1–10:   No traits. Learn physics and Booha powers.
//   Rounds 11–20:  Introduce single traits. Player notices glow
//                  and learns "that one bounced off".
//   Rounds 21–30:  Mixed trait structures. The "right" Booha
//                  is mechanically required, not just optimal.
//   Rounds 31–40:  Multi-step + traits. Chain collapse AND
//                  immune blocks force careful sequencing.
//   Rounds 41–50:  Full chaos. Immune cores, resist walls,
//                  convertimmune anchors. Plan or fail.
//
// SHOT BUDGET (19 total):
//   Normal×5, Heavy×3, Rock×2, Ice×2, Fire×2,
//   Princess×1, Rainbow×1, Nightmare×1, Monster×1, Ultimate×1
// ============================================================

window.BOOHA_DESTRUCTION_LEVELS = [

/* ============================================================
  ZONE 1 — LEARN THE RULES (Rounds 1–10)
  No traits. Learn physics, Booha powers, basic collapse.
============================================================ */

/* 1 — First Shot (JUICED) */
{
  id: 1, name: "First Shot+",
  targetPercent: 100,
  blocks: [

    // ── MAIN CORE (original idea preserved) ──
    { x:960, y:620, w:90, h:40, material:'wood', hp:1 },
    { x:960, y:572, w:90, h:40, material:'wood', hp:1 },
    { x:960, y:524, w:90, h:40, material:'wood', hp:1 },

    // ── TOP CAP (anti-fire wipe) ──
    { x:960, y:480, w:120, h:24, material:'stone', hp:2,
      traits:['burnimmune'] },

    // ── BACK SPINE (anti-ultimate cheese) ──
    { x:1040, y:620, w:40, h:200, material:'stone', hp:2,
      traits:['ultimateproof'] },

    // ── FRONT BOUNCE JUNK ──
    { x:820, y:620, w:80, h:36, material:'soft', hp:1 },
    { x:820, y:576, w:80, h:36, material:'soft', hp:1 },
    { x:860, y:540, w:24, h:80, material:'glass', hp:1 },

    // ── RIGHT MINI TOWER (extra bounce + distraction) ──
    { x:1100, y:620, w:70, h:40, material:'wood', hp:1 },
    { x:1100, y:572, w:24, h:88, material:'glass', hp:1 },
    { x:1100, y:520, w:90, h:40, material:'soft', hp:1 },

    // ── LEFT MINI TOWER (asymmetry for ricochet) ──
    { x:740, y:620, w:70, h:40, material:'wood', hp:1 },
    { x:740, y:572, w:24, h:88, material:'glass', hp:1 },
    { x:740, y:520, w:90, h:40, material:'soft', hp:1 },

    // ── FLOATING CHAOS LAYER ──
    { x:900, y:440, w:80, h:30, material:'wood', hp:1 },
    { x:1020, y:420, w:80, h:30, material:'glass', hp:1 },
    { x:840, y:400, w:80, h:30, material:'wood', hp:1 },

  ]
},

/* 2 — Glass Aware (JUICED) */
{
  id: 2, name: "Glass Aware+",
  targetPercent: 100,
  blocks: [
    // main structure
    { x:920, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1020, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:920, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:1020, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:970, y:512, w:180, h:24, material:'wood', hp:1 },

    // anti-fire cap
    { x:970, y:474, w:210, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // anti-ultimate rear blocker
    { x:1088, y:590, w:34, h:170, material:'stone', hp:2, traits:['ultimateproof'] },

    // left bounce pile
    { x:780, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:780, y:578, w:72, h:36, material:'soft', hp:1 },
    { x:816, y:540, w:24, h:78, material:'glass', hp:1 },

    // right mini tower
    { x:1150, y:620, w:70, h:36, material:'wood', hp:1 },
    { x:1150, y:578, w:70, h:36, material:'soft', hp:1 },
    { x:1150, y:538, w:24, h:78, material:'glass', hp:1 },

    // floating junk
    { x:880, y:436, w:70, h:28, material:'wood', hp:1 },
    { x:1040, y:418, w:70, h:28, material:'glass', hp:1 },
    { x:965, y:394, w:110, h:24, material:'wood', hp:1 },
  ]
},

/* 3 — Glass Core (JUICED) */
{
  id: 3, name: "Glass Core+",
  targetPercent: 100,
  blocks: [
    // main structure
    { x:890, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:970, y:620, w:120, h:40, material:'glass', hp:1 },
    { x:970, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:970, y:524, w:80, h:40, material:'wood', hp:1 },

    // anti-fire top
    { x:970, y:480, w:140, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker
    { x:1062, y:586, w:34, h:180, material:'stone', hp:2, traits:['ultimateproof'] },

    // side junk
    { x:760, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:760, y:578, w:76, h:36, material:'wood', hp:1 },
    { x:1180, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:1180, y:578, w:76, h:36, material:'wood', hp:1 },

    // side glass stabs
    { x:840, y:560, w:24, h:88, material:'glass', hp:1 },
    { x:1100, y:548, w:24, h:88, material:'glass', hp:1 },

    // floating chaos
    { x:910, y:432, w:70, h:30, material:'wood', hp:1 },
    { x:1030, y:408, w:70, h:30, material:'glass', hp:1 },
    { x:970, y:382, w:120, h:24, material:'soft', hp:1 },
  ]
},

/* 4 — Meet Heavy (JUICED) */
{
  id: 4, name: "Meet Heavy+",
  targetPercent: 100,
  blocks: [
    // core
    { x:860, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1060, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:572, w:280, h:24, material:'stone', hp:2 },
    { x:960, y:536, w:120, h:48, material:'wood', hp:1 },

    // anti-fire top
    { x:960, y:488, w:160, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // anti-ultimate rear wall
    { x:1120, y:592, w:36, h:170, material:'stone', hp:2, traits:['ultimateproof'] },

    // left bounce pocket
    { x:730, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:730, y:578, w:72, h:36, material:'soft', hp:1 },
    { x:770, y:540, w:24, h:78, material:'glass', hp:1 },

    // right side tower
    { x:1210, y:620, w:76, h:36, material:'wood', hp:1 },
    { x:1210, y:580, w:76, h:36, material:'soft', hp:1 },
    { x:1210, y:540, w:24, h:78, material:'glass', hp:1 },

    // floating blocks
    { x:860, y:444, w:80, h:28, material:'wood', hp:1 },
    { x:1060, y:426, w:80, h:28, material:'wood', hp:1 },
    { x:960, y:392, w:130, h:24, material:'stone', hp:2 },
  ]
},

/* 5 — Spread Shot (JUICED) */
{
  id: 5, name: "Spread Shot+",
  targetPercent: 100,
  blocks: [
    // main spread targets
    { x:840, y:620, w:100, h:36, material:'soft', hp:1 },
    { x:960, y:620, w:100, h:36, material:'soft', hp:1 },
    { x:1080, y:620, w:100, h:36, material:'soft', hp:1 },
    { x:840, y:576, w:100, h:36, material:'soft', hp:1 },
    { x:1080, y:576, w:100, h:36, material:'soft', hp:1 },

    // center layer
    { x:960, y:570, w:120, h:24, material:'wood', hp:1 },

    // top anti-fire plate
    { x:960, y:524, w:160, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear spine
    { x:1120, y:590, w:34, h:170, material:'stone', hp:2, traits:['ultimateproof'] },

    // extra spread junk
    { x:730, y:620, w:78, h:36, material:'soft', hp:1 },
    { x:1190, y:620, w:78, h:36, material:'soft', hp:1 },
    { x:760, y:574, w:24, h:78, material:'glass', hp:1 },
    { x:1220, y:574, w:24, h:78, material:'glass', hp:1 },

    // mid-air splash surfaces
    { x:880, y:454, w:70, h:28, material:'wood', hp:1 },
    { x:1040, y:454, w:70, h:28, material:'wood', hp:1 },
    { x:960, y:420, w:140, h:24, material:'soft', hp:1 },
  ]
},

/* 6 — Tall Glass Tower (JUICED) */
{
  id: 6, name: "Tall Glass Tower+",
  targetPercent: 100,
  blocks: [
    // core
    { x:960, y:620, w:60, h:40, material:'stone', hp:2 },
    { x:960, y:572, w:24, h:88, material:'glass', hp:1 },
    { x:960, y:472, w:24, h:88, material:'glass', hp:1 },
    { x:960, y:424, w:80, h:40, material:'wood', hp:1 },
    { x:870, y:620, w:60, h:40, material:'wood', hp:1 },
    { x:1050, y:620, w:60, h:40, material:'wood', hp:1 },

    // top fire cap
    { x:960, y:382, w:120, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker
    { x:1038, y:560, w:32, h:210, material:'stone', hp:2, traits:['ultimateproof'] },

    // support clutter
    { x:790, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:1130, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:790, y:580, w:72, h:36, material:'wood', hp:1 },
    { x:1130, y:580, w:72, h:36, material:'wood', hp:1 },

    // side ricochet panels
    { x:840, y:520, w:24, h:82, material:'glass', hp:1 },
    { x:1080, y:520, w:24, h:82, material:'glass', hp:1 },

    // floating stuff
    { x:890, y:340, w:70, h:28, material:'wood', hp:1 },
    { x:1030, y:322, w:70, h:28, material:'glass', hp:1 },
  ]
},

/* 7 — First Choice (JUICED) */
{
  id: 7, name: "First Choice+",
  targetPercent: 100,
  blocks: [
    // left path
    { x:860, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:860, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:860, y:500, w:100, h:40, material:'wood', hp:1 },

    // right path
    { x:1060, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1060, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:1060, y:524, w:80, h:40, material:'stone', hp:2 },

    // anti-fire protection
    { x:860, y:456, w:130, h:24, material:'stone', hp:2, traits:['burnimmune'] },
    { x:1060, y:478, w:120, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // anti-ultimate rear blocker behind right tower
    { x:1122, y:586, w:34, h:178, material:'stone', hp:2, traits:['ultimateproof'] },

    // center mess
    { x:960, y:620, w:90, h:36, material:'soft', hp:1 },
    { x:960, y:578, w:90, h:36, material:'wood', hp:1 },
    { x:960, y:540, w:24, h:78, material:'glass', hp:1 },

    // far left junk
    { x:720, y:620, w:74, h:36, material:'soft', hp:1 },
    { x:720, y:580, w:74, h:36, material:'wood', hp:1 },

    // floating choice clutter
    { x:930, y:404, w:70, h:28, material:'glass', hp:1 },
    { x:1090, y:390, w:70, h:28, material:'wood', hp:1 },
  ]
},

/* 8 — Offset Tower (JUICED) */
{
  id: 8, name: "Offset Tower+",
  targetPercent: 100,
  blocks: [
    // original offset idea
    { x:920, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:1000, y:524, w:80, h:40, material:'glass', hp:1 },
    { x:1040, y:476, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:428, w:80, h:40, material:'soft', hp:1 },

    // top cap
    { x:1040, y:382, w:130, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear ultimate stopper
    { x:1108, y:540, w:34, h:200, material:'stone', hp:2, traits:['ultimateproof'] },

    // extra offset junk to make ricochets fun
    { x:790, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:840, y:578, w:76, h:36, material:'wood', hp:1 },
    { x:890, y:538, w:24, h:78, material:'glass', hp:1 },

    { x:1180, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:1220, y:576, w:72, h:36, material:'wood', hp:1 },

    // overhead clutter
    { x:930, y:350, w:70, h:28, material:'wood', hp:1 },
    { x:1080, y:330, w:70, h:28, material:'glass', hp:1 },
  ]
},

/* 9 — Bounce Intro (JUICED) */
{
  id: 9, name: "Bounce Intro+",
  targetPercent: 100,
  blocks: [
    // main
    { x:960, y:620, w:200, h:30, material:'stone', hp:2 },
    { x:870, y:582, w:60, h:40, material:'wood', hp:1 },
    { x:1050, y:582, w:60, h:40, material:'wood', hp:1 },
    { x:960, y:570, w:80, h:24, material:'glass', hp:1 },
    { x:960, y:530, w:120, h:40, material:'wood', hp:1 },

    // anti-fire cap
    { x:960, y:486, w:150, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // anti-ultimate wall
    { x:1088, y:586, w:34, h:174, material:'stone', hp:2, traits:['ultimateproof'] },

    // left bounce stack
    { x:760, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:760, y:580, w:76, h:36, material:'wood', hp:1 },
    { x:800, y:540, w:24, h:78, material:'glass', hp:1 },

    // right bounce stack
    { x:1170, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:1170, y:580, w:76, h:36, material:'wood', hp:1 },
    { x:1170, y:540, w:24, h:78, material:'glass', hp:1 },

    // floating bounce bait
    { x:900, y:434, w:70, h:28, material:'wood', hp:1 },
    { x:1020, y:412, w:70, h:28, material:'glass', hp:1 },
    { x:960, y:386, w:120, h:24, material:'soft', hp:1 },
  ]
},

/* 10 — False Base (JUICED) */
{
  id: 10, name: "False Base+",
  targetPercent: 100,
  blocks: [
    // original core
    { x:960, y:620, w:160, h:30, material:'stone', hp:2 },
    { x:960, y:582, w:80, h:40, material:'glass', hp:1 },
    { x:960, y:534, w:200, h:24, material:'wood', hp:1 },
    { x:900, y:494, w:60, h:40, material:'wood', hp:1 },
    { x:1020, y:494, w:60, h:40, material:'wood', hp:1 },
    { x:960, y:446, w:120, h:40, material:'soft', hp:1 },

    // top blocker
    { x:960, y:398, w:160, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear ultimate blocker
    { x:1078, y:586, w:34, h:182, material:'stone', hp:2, traits:['ultimateproof'] },

    // side junk piles
    { x:780, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:780, y:580, w:72, h:36, material:'wood', hp:1 },
    { x:820, y:540, w:24, h:78, material:'glass', hp:1 },

    { x:1160, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:1160, y:580, w:72, h:36, material:'wood', hp:1 },
    { x:1160, y:540, w:24, h:78, material:'glass', hp:1 },

    // fake upper clutter
    { x:870, y:352, w:70, h:28, material:'wood', hp:1 },
    { x:1050, y:334, w:70, h:28, material:'glass', hp:1 },
    { x:960, y:312, w:130, h:24, material:'wood', hp:1 },
  ]
},
/* ============================================================
  ZONE 2 — FIRST TRAITS (Rounds 11–20)
  One or two immune blocks introduced per round.
  Player notices the glow and the deflect effect.
  Structures still clearable — traits redirect, not block.
============================================================ */

/* 11 — Fireproof Anchor
   The stone base block is fireproof — Fire Booha can't burn it.
   Wood upper blocks burn fine. Base must be taken by Normal/Heavy.
   Teaches: Fire is selective. Glowing red border = fireproof. */
/* 11 — Fireproof Anchor (JUICED) */
{
  id: 11, name: "Fireproof Anchor+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:960, y:620, w:180, h:36, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:880, y:576, w:80, h:36, material:'wood', hp:1 },
    { x:1040, y:576, w:80, h:36, material:'wood', hp:1 },
    { x:880, y:532, w:80, h:36, material:'wood', hp:1 },
    { x:1040, y:532, w:80, h:36, material:'wood', hp:1 },
    { x:960, y:532, w:80, h:36, material:'soft', hp:1 },
    { x:960, y:488, w:180, h:36, material:'wood', hp:1 },

    // anti-fire top control
    { x:960, y:444, w:220, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // anti-ultimate rear blocker
    { x:1088, y:588, w:34, h:184, material:'stone', hp:2, traits:['ultimateproof'] },

    // left bounce junk
    { x:760, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:760, y:580, w:76, h:36, material:'wood', hp:1 },
    { x:800, y:542, w:24, h:78, material:'glass', hp:1 },

    // right bounce junk
    { x:1180, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:1180, y:580, w:76, h:36, material:'wood', hp:1 },
    { x:1180, y:542, w:24, h:78, material:'glass', hp:1 },

    // floating clutter
    { x:900, y:396, w:70, h:28, material:'wood', hp:1 },
    { x:1040, y:378, w:70, h:28, material:'glass', hp:1 },
    { x:960, y:350, w:140, h:24, material:'soft', hp:1 },
  ]
},

/* 12 — Iceproof Column (JUICED) */
{
  id: 12, name: "Iceproof Column+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:890, y:620, w:70, h:200, material:'stone', hp:2,
      traits:['iceproof'] },
    { x:1050, y:620, w:70, h:200, material:'stone', hp:2,
      traits:['iceproof'] },
    { x:970, y:512, w:220, h:24, material:'glass', hp:1 },
    { x:900, y:476, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:476, w:80, h:40, material:'wood', hp:1 },
    { x:970, y:428, w:180, h:40, material:'soft', hp:1 },

    // top plate
    { x:970, y:382, w:220, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker behind right side
    { x:1090, y:556, w:34, h:210, material:'stone', hp:2, traits:['ultimateproof'] },

    // lower junk
    { x:760, y:620, w:74, h:36, material:'soft', hp:1 },
    { x:1180, y:620, w:74, h:36, material:'soft', hp:1 },
    { x:760, y:582, w:74, h:36, material:'wood', hp:1 },
    { x:1180, y:582, w:74, h:36, material:'wood', hp:1 },

    // glass ricochet bait
    { x:820, y:520, w:24, h:78, material:'glass', hp:1 },
    { x:1140, y:520, w:24, h:78, material:'glass', hp:1 },

    // floating chaos
    { x:900, y:334, w:70, h:28, material:'wood', hp:1 },
    { x:1040, y:320, w:70, h:28, material:'glass', hp:1 },
  ]
},

/* 13 — Rainbow Wall (JUICED) */
{
  id: 13, name: "Rainbow Wall+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:880, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:1040, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:572, w:260, h:24, material:'stone', hp:2 },
    { x:910, y:536, w:80, h:40, material:'wood', hp:1 },
    { x:1010, y:536, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:488, w:140, h:40, material:'wood', hp:1 },

    // top fire control
    { x:960, y:442, w:180, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker
    { x:1070, y:586, w:34, h:184, material:'stone', hp:2, traits:['ultimateproof'] },

    // extra side piles
    { x:770, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:770, y:580, w:76, h:36, material:'wood', hp:1 },
    { x:1190, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:1190, y:580, w:76, h:36, material:'wood', hp:1 },

    // side glass teeth
    { x:840, y:540, w:24, h:80, material:'glass', hp:1 },
    { x:1100, y:540, w:24, h:80, material:'glass', hp:1 },

    // floating clutter
    { x:900, y:394, w:70, h:28, material:'wood', hp:1 },
    { x:1035, y:374, w:70, h:28, material:'glass', hp:1 },
  ]
},

/* 14 — Heavyproof Soft Wall (JUICED) */
{
  id: 14, name: "Heavyproof Soft Wall+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:840, y:620, w:90, h:36, material:'soft', hp:1, traits:['heavyproof'] },
    { x:940, y:620, w:90, h:36, material:'soft', hp:1, traits:['heavyproof'] },
    { x:1040, y:620, w:90, h:36, material:'soft', hp:1, traits:['heavyproof'] },
    { x:840, y:576, w:90, h:36, material:'soft', hp:1, traits:['heavyproof'] },
    { x:940, y:576, w:90, h:36, material:'soft', hp:1, traits:['heavyproof'] },
    { x:1040, y:576, w:90, h:36, material:'soft', hp:1, traits:['heavyproof'] },
    { x:940, y:532, w:290, h:24, material:'stone', hp:2 },
    { x:940, y:484, w:120, h:40, material:'wood', hp:1 },

    // top cap
    { x:940, y:438, w:170, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker
    { x:1108, y:586, w:34, h:178, material:'stone', hp:2, traits:['ultimateproof'] },

    // extra wall junk
    { x:730, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:730, y:580, w:76, h:36, material:'wood', hp:1 },
    { x:1160, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:1160, y:580, w:76, h:36, material:'wood', hp:1 },

    // side glass
    { x:790, y:542, w:24, h:78, material:'glass', hp:1 },
    { x:1210, y:542, w:24, h:78, material:'glass', hp:1 },

    // floating mess
    { x:860, y:390, w:70, h:28, material:'wood', hp:1 },
    { x:1020, y:370, w:70, h:28, material:'glass', hp:1 },
    { x:940, y:344, w:150, h:24, material:'soft', hp:1 },
  ]
},

/* 15 — Chain Reaction (JUICED) */
{
  id: 15, name: "Chain Reaction+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:870, y:620, w:70, h:40, material:'wood', hp:1 },
    { x:870, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:910, y:512, w:200, h:24, material:'wood', hp:1 },
    { x:1010, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1010, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:1010, y:524, w:80, h:40, material:'wood', hp:1 },
    { x:1010, y:476, w:80, h:40, material:'wood', hp:1 },

    // top control
    { x:1010, y:432, w:130, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker
    { x:1070, y:560, w:34, h:206, material:'stone', hp:2, traits:['ultimateproof'] },

    // chain-side junk
    { x:760, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:760, y:580, w:72, h:36, material:'wood', hp:1 },
    { x:1160, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:1160, y:580, w:72, h:36, material:'wood', hp:1 },

    // more bounce faces
    { x:820, y:534, w:24, h:78, material:'glass', hp:1 },
    { x:940, y:454, w:80, h:28, material:'wood', hp:1 },
    { x:1110, y:434, w:70, h:28, material:'glass', hp:1 },

    // upper clutter
    { x:980, y:388, w:130, h:24, material:'soft', hp:1 },
  ]
},

/* 16 — Nightmare Intro (JUICED) */
{
  id: 16, name: "Nightmare Intro+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:900, y:620, w:40, h:200, material:'stone', hp:2 },
    { x:900, y:520, w:40, h:24, material:'stone', hp:2 },
    { x:1040, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:524, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:476, w:80, h:40, material:'glass', hp:1 },
    { x:1040, y:428, w:120, h:40, material:'wood', hp:1 },

    // top cap
    { x:1040, y:382, w:160, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker
    { x:1100, y:560, w:34, h:210, material:'stone', hp:2, traits:['ultimateproof'] },

    // left clutter
    { x:760, y:620, w:76, h:36, material:'soft', hp:1 },
    { x:760, y:578, w:76, h:36, material:'wood', hp:1 },
    { x:800, y:538, w:24, h:78, material:'glass', hp:1 },

    // central bounce junk
    { x:960, y:620, w:90, h:36, material:'soft', hp:1 },
    { x:980, y:580, w:90, h:36, material:'wood', hp:1 },

    // upper bait
    { x:920, y:346, w:70, h:28, material:'glass', hp:1 },
    { x:1060, y:326, w:70, h:28, material:'wood', hp:1 },
  ]
},

/* 17 — Burn Spread (JUICED) */
{
  id: 17, name: "Burn Spread+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:880, y:620, w:70, h:40, material:'wood', hp:1 },
    { x:960, y:620, w:70, h:40, material:'soft', hp:1 },
    { x:1040, y:620, w:70, h:40, material:'wood', hp:1 },
    { x:880, y:572, w:70, h:40, material:'wood', hp:1 },
    { x:960, y:572, w:70, h:40, material:'soft', hp:1 },
    { x:1040, y:572, w:70, h:40, material:'wood', hp:1 },
    { x:880, y:524, w:70, h:40, material:'wood', hp:1 },
    { x:960, y:524, w:70, h:40, material:'soft', hp:1 },
    { x:1040, y:524, w:70, h:40, material:'wood', hp:1 },

    // anti-fire overcap so spread is fun but not total
    { x:960, y:478, w:220, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker
    { x:1090, y:584, w:34, h:186, material:'stone', hp:2, traits:['ultimateproof'] },

    // extra burn fodder on sides
    { x:760, y:620, w:72, h:36, material:'wood', hp:1 },
    { x:760, y:580, w:72, h:36, material:'soft', hp:1 },
    { x:1180, y:620, w:72, h:36, material:'wood', hp:1 },
    { x:1180, y:580, w:72, h:36, material:'soft', hp:1 },

    // glass interruptions
    { x:820, y:540, w:24, h:78, material:'glass', hp:1 },
    { x:1140, y:540, w:24, h:78, material:'glass', hp:1 },

    // floating chaos
    { x:900, y:430, w:70, h:28, material:'wood', hp:1 },
    { x:1040, y:410, w:70, h:28, material:'wood', hp:1 },
  ]
},

/* 18 — Fireproof Wall (JUICED) */
{
  id: 18, name: "Fireproof Wall+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:880, y:620, w:40, h:200, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:1020, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1020, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:1020, y:524, w:80, h:40, material:'glass', hp:1 },
    { x:1020, y:476, w:80, h:40, material:'wood', hp:1 },
    { x:1020, y:428, w:120, h:40, material:'soft', hp:1 },

    // top cap
    { x:1020, y:382, w:160, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker behind target stack
    { x:1084, y:556, w:34, h:212, material:'stone', hp:2, traits:['ultimateproof'] },

    // left-side junk around the wall
    { x:740, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:740, y:580, w:72, h:36, material:'wood', hp:1 },
    { x:780, y:540, w:24, h:78, material:'glass', hp:1 },

    // right-side extra surfaces
    { x:1180, y:620, w:74, h:36, material:'soft', hp:1 },
    { x:1180, y:580, w:74, h:36, material:'wood', hp:1 },

    // floating bait
    { x:950, y:340, w:70, h:28, material:'glass', hp:1 },
    { x:1080, y:320, w:70, h:28, material:'wood', hp:1 },
  ]
},

/* 19 — False Center (JUICED) */
{
  id: 19, name: "False Center+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:870, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:870, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:1050, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:960, y:512, w:260, h:36, material:'stone', hp:2 },
    { x:960, y:466, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:418, w:140, h:40, material:'soft', hp:1 },

    // anti-fire top
    { x:960, y:372, w:180, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker
    { x:1090, y:556, w:34, h:214, material:'stone', hp:2, traits:['ultimateproof'] },

    // side junk towers
    { x:740, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:740, y:580, w:72, h:36, material:'wood', hp:1 },
    { x:1200, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:1200, y:580, w:72, h:36, material:'wood', hp:1 },

    // ricochet teeth
    { x:810, y:530, w:24, h:80, material:'glass', hp:1 },
    { x:1140, y:530, w:24, h:80, material:'glass', hp:1 },

    // fake upper clutter
    { x:900, y:324, w:70, h:28, material:'wood', hp:1 },
    { x:1035, y:306, w:70, h:28, material:'glass', hp:1 },
  ]
},

/* 20 — Vertical Collapse (JUICED) */
{
  id: 20, name: "Vertical Collapse+",
  targetPercent: 100,
  blocks: [
    // core lesson
    { x:960, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:524, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:476, w:80, h:24, material:'glass', hp:1 },
    { x:960, y:440, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:392, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:344, w:120, h:40, material:'stone', hp:2 },

    // top cap
    { x:960, y:296, w:150, h:24, material:'stone', hp:2, traits:['burnimmune'] },

    // rear blocker running the tower
    { x:1026, y:560, w:30, h:320, material:'stone', hp:2, traits:['ultimateproof'] },

    // side clutter
    { x:780, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:780, y:580, w:72, h:36, material:'wood', hp:1 },
    { x:1140, y:620, w:72, h:36, material:'soft', hp:1 },
    { x:1140, y:580, w:72, h:36, material:'wood', hp:1 },

    // side glass columns
    { x:840, y:520, w:24, h:86, material:'glass', hp:1 },
    { x:1080, y:520, w:24, h:86, material:'glass', hp:1 },

    // overhead chaos
    { x:900, y:250, w:70, h:28, material:'wood', hp:1 },
    { x:1035, y:232, w:70, h:28, material:'glass', hp:1 },
  ]
},
/* ============================================================
  ZONE 3 — TRAITS AS PUZZLE (Rounds 21–30)
  Right Booha is mechanically required, not just efficient.
  Wrong approach still possible but costs 4+ extra shots.
============================================================ */

/* 21 — Stone Fortress + Fireproof Core
   Outer stone: normal stone, hittable.
   Inner two blocks: fireproof + burnimmune.
   Fire Booha is useless here — must use Heavy.
   Teaches: identify the immune core, save Fire for other rounds. */
{
  id: 21, name: "Fireproof Core",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:960, y:572, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:870, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:524, w:280, h:24, material:'wood', hp:1 },
    { x:960, y:476, w:120, h:40, material:'soft', hp:1 },
  ]
},

/* 22 — Iceproof Anchor Tower
   Bottom two stones are iceproof — Ice can't freeze the base.
   But the TOP stone is normal — freeze it → everything collapses.
   Teaches: find the one block that isn't immune. Top-down angle. */
{
  id: 22, name: "Iceproof Base",
  targetPercent: 100,
  blocks: [
    { x:960, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune'] },
    { x:960, y:572, w:80, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune'] },
    { x:960, y:524, w:80, h:40, material:'stone', hp:2 },
    { x:870, y:580, w:60, h:80, material:'wood', hp:1 },
    { x:1050, y:580, w:60, h:80, material:'wood', hp:1 },
    { x:870, y:476, w:260, h:24, material:'wood', hp:1 },
    { x:960, y:428, w:100, h:40, material:'soft', hp:1 },
  ]
},

/* 23 — Convertimmune Tower
   Rainbow Booha can't convert the stone blocks (convertimmune).
   But it CAN convert the wood cap → one Normal shot clears it.
   Teaches: Rainbow has limits. Aim at the wood, skip the stone. */
{
  id: 23, name: "Convertimmune Tower",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:1050, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:960, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:960, y:572, w:280, h:24, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:910, y:536, w:80, h:40, material:'wood', hp:1 },
    { x:1010, y:536, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:488, w:140, h:40, material:'wood', hp:1 },
  ]
},

/* 24 — Mixed Proof Tower
   Left support: fireproof stone — must use Heavy or Normal.
   Right support: iceproof stone — must use Heavy or Normal.
   Glass bridge: normal — any Booha works.
   Teaches: read each block's immunity separately. */
{
  id: 24, name: "Mixed Proof Tower",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:80, h:120, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:1050, y:620, w:80, h:120, material:'stone', hp:2,
      traits:['iceproof','freezeimmune'] },
    { x:960, y:572, w:220, h:24, material:'glass', hp:1 },
    { x:900, y:536, w:80, h:40, material:'wood', hp:1 },
    { x:1020, y:536, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:488, w:180, h:40, material:'soft', hp:1 },
  ]
},

/* 25 — Ultimateproof Anchor
   Bottom center: ultimateproof stone — Ultimate's blast skips it.
   Everything ABOVE it: normal wood/glass — Ultimate wrecks them.
   To clear the bottom, need Heavy after Ultimate fires.
   Teaches: Ultimate isn't a full-board clear. Plan the follow-up. */
{
  id: 25, name: "Ultimateproof Anchor",
  targetPercent: 90,  // 90% — ultimateproof block counts as 10%
  blocks: [
    { x:840, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['ultimateproof'] },
    { x:1080, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:572, w:300, h:24, material:'wood', hp:1 },
    { x:880, y:536, w:80, h:40, material:'glass', hp:1 },
    { x:960, y:536, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:536, w:80, h:40, material:'glass', hp:1 },
    { x:960, y:488, w:200, h:40, material:'soft', hp:1 },
    { x:960, y:440, w:140, h:40, material:'wood', hp:1 },
  ]
},

/* 26 — Resist Wall (not immune, just tough)
   Fire resist:0.25 on all stone — Fire deals quarter damage.
   Not impossible, just wasteful. Heavy is 4x more efficient here.
   Teaches: resist ≠ immune. Glows dimly. Still hurts, just less. */
{
  id: 26, name: "Resist Wall",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:80, h:40, material:'stone', hp:2,
      resist:{fire:0.25} },
    { x:960, y:620, w:80, h:40, material:'stone', hp:2,
      resist:{fire:0.25} },
    { x:1050, y:620, w:80, h:40, material:'stone', hp:2,
      resist:{fire:0.25} },
    { x:870, y:572, w:80, h:40, material:'stone', hp:2,
      resist:{fire:0.25} },
    { x:960, y:572, w:80, h:40, material:'stone', hp:2,
      resist:{fire:0.25} },
    { x:1050, y:572, w:80, h:40, material:'stone', hp:2,
      resist:{fire:0.25} },
    { x:960, y:524, w:280, h:24, material:'wood', hp:1 },
    { x:960, y:476, w:100, h:40, material:'soft', hp:1 },
  ]
},

/* 27 — Puzzle Tower
   Outer stone: fireproof (red glow) — Fire bounces off.
   Inner wood stack: normal — Fire burns it happily.
   Must pick the right entry point. Direct Fire to center gap.
   Teaches: fireproof is directional — aim around the glowing blocks. */
{
  id: 27, name: "Puzzle Tower",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:70, h:200, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:1050, y:620, w:70, h:200, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:960, y:620, w:100, h:40, material:'wood', hp:1 },
    { x:960, y:572, w:100, h:40, material:'wood', hp:1 },
    { x:960, y:524, w:100, h:40, material:'wood', hp:1 },
    { x:960, y:476, w:100, h:40, material:'wood', hp:1 },
    { x:960, y:428, w:120, h:40, material:'soft', hp:1 },
  ]
},

/* 28 — Bounce Scaling (no traits) */
{
  id: 28, name: "Bounce Scaling",
  targetPercent: 100,
  blocks: [
    { x:960, y:620, w:360, h:28, material:'stone', hp:2 },
    { x:840, y:580, w:70, h:40, material:'wood', hp:1 },
    { x:920, y:580, w:70, h:40, material:'stone', hp:2 },
    { x:1000, y:580, w:70, h:40, material:'wood', hp:1 },
    { x:1080, y:580, w:70, h:40, material:'stone', hp:2 },
    { x:880, y:532, w:160, h:24, material:'wood', hp:1 },
    { x:1040, y:532, w:160, h:24, material:'wood', hp:1 },
    { x:960, y:484, w:200, h:40, material:'soft', hp:1 },
  ]
},

/* 29 — Center Blast Setup (no traits) */
{
  id: 29, name: "Center Blast",
  targetPercent: 100,
  blocks: [
    { x:820, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:920, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1020, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1120, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:870, y:572, w:80, h:40, material:'glass', hp:1 },
    { x:1070, y:572, w:80, h:40, material:'glass', hp:1 },
    { x:970, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:870, y:524, w:80, h:40, material:'wood', hp:1 },
    { x:1070, y:524, w:80, h:40, material:'wood', hp:1 },
    { x:970, y:524, w:80, h:40, material:'soft', hp:1 },
  ]
},

/* 30 — Three-Zone Mixed Traits
   Left: fireproof+burnimmune stone (red glow) → needs Heavy/Normal
   Center: soft blocks, no traits → Princess clears them
   Right: iceproof stone (cyan glow) → needs Heavy/Rock/Normal
   Teaches: read each zone, pick the right Booha per target. */
{
  id: 30, name: "Three-Zone Traits",
  targetPercent: 100,
  blocks: [
    { x:840, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:840, y:572, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:840, y:524, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:960, y:620, w:90, h:36, material:'soft', hp:1 },
    { x:960, y:576, w:90, h:36, material:'soft', hp:1 },
    { x:960, y:532, w:90, h:36, material:'soft', hp:1 },
    { x:1080, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune'] },
    { x:1080, y:572, w:80, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune'] },
    { x:1080, y:524, w:80, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune'] },
  ]
},

/* ============================================================
  ZONE 4 — MULTI-STEP + TRAITS (Rounds 31–40)
  Collapse sequencing AND immune blocks. Both required.
============================================================ */

/* 31 — Delayed Collapse (no traits) */
{
  id: 31, name: "Delayed Collapse",
  targetPercent: 100,
  blocks: [
    { x:900, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:970, y:572, w:220, h:24, material:'glass', hp:1 },
    { x:900, y:524, w:80, h:40, material:'stone', hp:2 },
    { x:1040, y:524, w:80, h:40, material:'stone', hp:2 },
    { x:970, y:476, w:220, h:24, material:'stone', hp:2 },
    { x:970, y:428, w:140, h:40, material:'stone', hp:2 },
    { x:970, y:380, w:100, h:40, material:'soft', hp:1 },
  ]
},

/* 32 — Immune Bridge
   The stone bridge connecting left and right towers is ultimateproof.
   Ultimate blast clears the towers but the bridge stays.
   Then need Heavy to break the bridge and drop remaining blocks.
   Teaches: Ultimate + Heavy combo. Sequence matters. */
{
  id: 32, name: "Immune Bridge",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:870, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:1050, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:548, w:220, h:24, material:'stone', hp:2,
      traits:['ultimateproof'] },
    { x:870, y:500, w:80, h:40, material:'glass', hp:1 },
    { x:1050, y:500, w:80, h:40, material:'glass', hp:1 },
    { x:960, y:452, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:404, w:140, h:40, material:'soft', hp:1 },
  ]
},

/* 33 — Fireproof Outer, Burnimmune Core
   Outer ring: normal wood — burns fine.
   Inner core: burnimmune stone — immune to spread.
   Fire works on outer, must direct-hit the core with Normal/Heavy.
   Teaches: burnimmune stops fire spread, not direct hits. */
{
  id: 33, name: "Fireproof Shell",
  targetPercent: 100,
  blocks: [
    { x:960, y:620, w:300, h:28, material:'wood', hp:1 },
    { x:870, y:580, w:80, h:40, material:'wood', hp:1 },
    { x:1050, y:580, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:580, w:80, h:40, material:'stone', hp:2,
      traits:['burnimmune'] },
    { x:960, y:532, w:240, h:24, material:'wood', hp:1 },
    { x:870, y:484, w:80, h:40, material:'wood', hp:1 },
    { x:1050, y:484, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:484, w:80, h:40, material:'stone', hp:2,
      traits:['burnimmune'] },
    { x:960, y:436, w:180, h:40, material:'soft', hp:1 },
  ]
},

/* 34 — Dual Illusion (no traits — collapse timing) */
{
  id: 34, name: "Dual Illusion",
  targetPercent: 100,
  blocks: [
    { x:860, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1060, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:860, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:1060, y:556, w:24, h:88, material:'stone', hp:2 },
    { x:960, y:512, w:260, h:24, material:'wood', hp:1 },
    { x:960, y:464, w:100, h:40, material:'stone', hp:2 },
    { x:860, y:512, w:80, h:40, material:'soft', hp:1 },
    { x:1060, y:512, w:80, h:40, material:'wood', hp:1 },
  ]
},

/* 35 — Fireproof + Collapse Sequence
   Left tower: fireproof stone base, glass upper.
   Break the glass → stone base falls (intact, iceproof too).
   Fallen base crushes the wood pile on the right.
   Teaches: use collapse to move immune blocks where you want them. */
{
  id: 35, name: "Immunity Collapse",
  targetPercent: 100,
  blocks: [
    { x:860, y:620, w:70, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:860, y:564, w:24, h:88, material:'glass', hp:1 },
    { x:860, y:500, w:80, h:56, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:1000, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1000, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:1000, y:524, w:80, h:40, material:'wood', hp:1 },
    { x:1000, y:476, w:80, h:40, material:'soft', hp:1 },
    { x:1080, y:620, w:80, h:40, material:'glass', hp:1 },
    { x:1080, y:572, w:80, h:40, material:'wood', hp:1 },
  ]
},

/* 36 — Top First + Convertimmune Base
   Rainbow converts top wood → easy to break.
   But the stone base is convertimmune — can't rainbow it.
   Must heavy/normal the base separately.
   Teaches: two-tool solution. Rainbow top, Heavy base. */
{
  id: 36, name: "Top First",
  targetPercent: 100,
  blocks: [
    { x:900, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:1040, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:900, y:556, w:24, h:88, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:1040, y:556, w:24, h:88, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:970, y:512, w:240, h:24, material:'wood', hp:1 },
    { x:970, y:460, w:200, h:40, material:'stone', hp:2 },
    { x:900, y:412, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:412, w:80, h:40, material:'wood', hp:1 },
    { x:970, y:364, w:220, h:40, material:'soft', hp:1 },
  ]
},

/* 37 — Heavy-Only Core
   All outer blocks: heavyproof soft (orange glow).
   Center stone: normal — Heavy hits it fine.
   Normal Booha on outer: deflects or half-damage.
   Teaches: some walls are built to repel specific Boohas. */
{
  id: 37, name: "Heavy-Only Core",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:80, h:40, material:'soft', hp:1,
      traits:['heavyproof'] },
    { x:1050, y:620, w:80, h:40, material:'soft', hp:1,
      traits:['heavyproof'] },
    { x:870, y:576, w:80, h:40, material:'soft', hp:1,
      traits:['heavyproof'] },
    { x:1050, y:576, w:80, h:40, material:'soft', hp:1,
      traits:['heavyproof'] },
    { x:960, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:576, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:532, w:280, h:24, material:'wood', hp:1 },
    { x:960, y:484, w:140, h:40, material:'soft', hp:1 },
  ]
},

/* 38 — Collapse Direction (no traits) */
{
  id: 38, name: "Collapse Direction",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:80, h:40, material:'glass', hp:1 },
    { x:870, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:870, y:524, w:80, h:40, material:'glass', hp:1 },
    { x:960, y:572, w:180, h:24, material:'wood', hp:1 },
    { x:1050, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:524, w:80, h:40, material:'glass', hp:1 },
    { x:1050, y:476, w:80, h:40, material:'wood', hp:1 },
    { x:1050, y:428, w:120, h:40, material:'soft', hp:1 },
  ]
},

/* 39 — Setup Shot (no traits) */
{
  id: 39, name: "Setup Shot",
  targetPercent: 100,
  blocks: [
    { x:880, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:880, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:548, w:24, h:56, material:'glass', hp:1 },
    { x:960, y:508, w:280, h:30, material:'stone', hp:2 },
    { x:880, y:460, w:80, h:40, material:'stone', hp:2 },
    { x:1040, y:460, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:412, w:180, h:40, material:'soft', hp:1 },
  ]
},

/* 40 — Immune Bridge Domino
   Left anchor: ultimateproof stone (magenta glow).
   Bridge: normal wood — collapses when anchor is gone.
   Right tower: normal — falls when bridge goes.
   But Ultimate skips the left anchor. Must Normal/Heavy it first.
   Teaches: sequence — clear immune block, THEN use Ultimate on the rest. */
{
  id: 40, name: "Immune Domino",
  targetPercent: 100,
  blocks: [
    { x:840, y:620, w:80, h:120, material:'stone', hp:2,
      traits:['ultimateproof'] },
    { x:920, y:548, w:180, h:24, material:'wood', hp:1 },
    { x:1000, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1000, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:1000, y:524, w:80, h:40, material:'glass', hp:1 },
    { x:1000, y:476, w:80, h:40, material:'wood', hp:1 },
    { x:1080, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1080, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:1080, y:524, w:80, h:40, material:'soft', hp:1 },
  ]
},

/* ============================================================
  ZONE 5 — FULL CHAOS (Rounds 41–50)
  Every tool needed. Multiple immune blocks per structure.
  Planning required. Second attempts are execution.
============================================================ */

/* 41 — Three Stack System (no traits — pure collapse) */
{
  id: 41, name: "Three Stack System",
  targetPercent: 100,
  blocks: [
    { x:840, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:840, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:840, y:500, w:100, h:40, material:'stone', hp:2 },
    { x:960, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:524, w:80, h:40, material:'stone', hp:2 },
    { x:1080, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1080, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:1080, y:500, w:100, h:40, material:'stone', hp:2 },
    { x:960, y:476, w:300, h:24, material:'wood', hp:1 },
    { x:960, y:428, w:140, h:40, material:'soft', hp:1 },
  ]
},

/* 42 — Asymmetrical Immune Towers
   Left: normal stone tower — ice it.
   Right: iceproof+convertimmune stone — needs Heavy only.
   Looks the same visually — glows tell you which is which. */
{
  id: 42, name: "Asymmetric Immunity",
  targetPercent: 100,
  blocks: [
    { x:860, y:620, w:70, h:40, material:'stone', hp:2 },
    { x:860, y:572, w:70, h:40, material:'stone', hp:2 },
    { x:860, y:524, w:70, h:40, material:'stone', hp:2 },
    { x:860, y:476, w:70, h:40, material:'stone', hp:2 },
    { x:860, y:428, w:80, h:40, material:'soft', hp:1 },
    { x:1040, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','rainbowproof','convertimmune'] },
    { x:1040, y:572, w:80, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','rainbowproof','convertimmune'] },
    { x:1040, y:524, w:80, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','rainbowproof','convertimmune'] },
    { x:1040, y:476, w:80, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','rainbowproof','convertimmune'] },
    { x:1040, y:428, w:80, h:40, material:'glass', hp:1 },
  ]
},

/* 43 — Float and Ground (no traits) */
{
  id: 43, name: "Float and Ground",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:870, y:556, w:24, h:88, material:'stone', hp:2 },
    { x:1050, y:556, w:24, h:88, material:'stone', hp:2 },
    { x:960, y:512, w:260, h:24, material:'wood', hp:1 },
    { x:960, y:460, w:200, h:30, material:'glass', hp:1 },
    { x:900, y:422, w:80, h:40, material:'stone', hp:2 },
    { x:1020, y:422, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:374, w:180, h:40, material:'soft', hp:1 },
  ]
},

/* 44 — Immune Fort Inner Ring
   Outer stone: normal — Ultra/Ice/Heavy all work.
   Inner four blocks: fireproof+iceproof (red+cyan mixed glow visible on each).
   Inner blocks need Normal, Heavy, or Rock only.
   Teaches: inner fortress has different rules than outer. */
{
  id: 44, name: "Immune Fort",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:870, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:1050, y:572, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune','iceproof','freezeimmune'] },
    { x:960, y:572, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune','iceproof','freezeimmune'] },
    { x:960, y:524, w:280, h:24, material:'wood', hp:1 },
    { x:960, y:476, w:140, h:40, material:'soft', hp:1 },
    { x:960, y:428, w:100, h:40, material:'glass', hp:1 },
  ]
},

/* 45 — Precision Only (no traits) */
{
  id: 45, name: "Precision Only",
  targetPercent: 100,
  blocks: [
    { x:870, y:620, w:70, h:200, material:'stone', hp:2 },
    { x:1050, y:620, w:70, h:200, material:'stone', hp:2 },
    { x:960, y:620, w:100, h:40, material:'wood', hp:1 },
    { x:960, y:564, w:100, h:40, material:'glass', hp:1 },
    { x:960, y:508, w:100, h:40, material:'wood', hp:1 },
    { x:960, y:452, w:100, h:40, material:'glass', hp:1 },
    { x:960, y:396, w:100, h:40, material:'soft', hp:1 },
  ]
},

/* 46 — Fireproof Cage + Hidden Trigger
   Stone cage: fireproof (red glow) — Fire bounces off.
   Inside: wood trigger block — burns fine if you reach it.
   Must hit the glass panel to expose the wood, THEN fire or normal it.
   Teaches: two-step: expose the target, then use the right Booha. */
{
  id: 46, name: "Fireproof Cage",
  targetPercent: 100,
  blocks: [
    { x:900, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:1020, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:900, y:560, w:24, h:80, material:'glass', hp:1 },
    { x:1020, y:560, w:24, h:80, material:'glass', hp:1 },
    { x:960, y:560, w:60, h:80, material:'wood', hp:1 },
    { x:960, y:516, w:260, h:30, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:900, y:468, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:1020, y:468, w:80, h:40, material:'stone', hp:2,
      traits:['fireproof','burnimmune'] },
    { x:960, y:420, w:200, h:40, material:'soft', hp:1 },
  ]
},

/* 47 — Delayed Trap (no traits) */
{
  id: 47, name: "Delayed Trap",
  targetPercent: 100,
  blocks: [
    { x:850, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:1070, y:620, w:80, h:40, material:'stone', hp:2 },
    { x:850, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:1070, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:960, y:512, w:320, h:24, material:'stone', hp:2 },
    { x:960, y:468, w:100, h:40, material:'glass', hp:1 },
    { x:900, y:420, w:80, h:40, material:'stone', hp:2 },
    { x:1020, y:420, w:80, h:40, material:'stone', hp:2 },
    { x:960, y:372, w:200, h:40, material:'soft', hp:1 },
  ]
},

/* 48 — Full Synergy with Traits
   Zone A (left): iceproof+fireproof stone → Heavy only
   Zone B (center-left): soft, no traits → Princess
   Zone C (center-right): normal wood → Nightmare or Normal
   Zone D (top slab): convertimmune stone → can't Rainbow it, need Heavy
   Teaches: 4-Booha coordination with immunity knowledge. */
{
  id: 48, name: "Full Synergy",
  targetPercent: 100,
  blocks: [
    { x:820, y:620, w:70, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','fireproof','burnimmune'] },
    { x:820, y:572, w:70, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','fireproof','burnimmune'] },
    { x:820, y:524, w:70, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','fireproof','burnimmune'] },
    { x:920, y:620, w:80, h:36, material:'soft', hp:1 },
    { x:920, y:576, w:80, h:36, material:'soft', hp:1 },
    { x:920, y:532, w:80, h:36, material:'soft', hp:1 },
    { x:920, y:488, w:80, h:36, material:'soft', hp:1 },
    { x:1030, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1030, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:1030, y:524, w:80, h:40, material:'glass', hp:1 },
    { x:1030, y:476, w:80, h:40, material:'wood', hp:1 },
    { x:960, y:436, w:320, h:24, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:960, y:388, w:260, h:40, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
  ]
},

/* 49 — Domino Chain (no traits) */
{
  id: 49, name: "Domino Chain",
  targetPercent: 100,
  blocks: [
    { x:820, y:620, w:60, h:40, material:'stone', hp:2 },
    { x:820, y:548, w:24, h:120, material:'stone', hp:2 },
    { x:820, y:500, w:80, h:40, material:'wood', hp:1 },
    { x:900, y:620, w:60, h:40, material:'wood', hp:1 },
    { x:900, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:900, y:500, w:80, h:40, material:'soft', hp:1 },
    { x:980, y:620, w:60, h:40, material:'wood', hp:1 },
    { x:980, y:548, w:24, h:120, material:'wood', hp:1 },
    { x:980, y:500, w:80, h:40, material:'glass', hp:1 },
    { x:1060, y:620, w:60, h:40, material:'stone', hp:2 },
    { x:1060, y:556, w:24, h:88, material:'glass', hp:1 },
    { x:1060, y:500, w:80, h:40, material:'soft', hp:1 },
    { x:1140, y:620, w:60, h:40, material:'wood', hp:1 },
    { x:1140, y:572, w:60, h:40, material:'stone', hp:2 },
    { x:1140, y:524, w:80, h:40, material:'wood', hp:1 },
  ]
},

/* 50 — BOOHA ENDGAME
   Everything combined:
   - Stone fortress left: iceproof+fireproof → Heavy only
   - Soft cluster center: no traits → Princess
   - Glass decoy: normal (ignore or quick-hit)
   - Wood rear: normal → Nightmare behind the wall
   - Ultimateproof base block: Ultimate skips it → plan the follow-up
   - Convertimmune top slab: can't rainbow → must brute Heavy
   Hard. First run is reconnaissance. Second run is execution. */
{
  id: 50, name: "BOOHA ENDGAME",
  targetPercent: 95,
  blocks: [
    { x:820, y:620, w:70, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','fireproof','burnimmune'] },
    { x:820, y:572, w:70, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','fireproof','burnimmune'] },
    { x:820, y:524, w:70, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','fireproof','burnimmune'] },
    { x:820, y:476, w:70, h:40, material:'stone', hp:2,
      traits:['iceproof','freezeimmune','fireproof','burnimmune'] },
    { x:920, y:620, w:80, h:36, material:'soft', hp:1 },
    { x:920, y:576, w:80, h:36, material:'soft', hp:1 },
    { x:920, y:532, w:80, h:36, material:'soft', hp:1 },
    { x:960, y:488, w:80, h:80, material:'glass', hp:1 },
    { x:1040, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1120, y:620, w:80, h:40, material:'wood', hp:1 },
    { x:1040, y:572, w:80, h:40, material:'glass', hp:1 },
    { x:1120, y:572, w:80, h:40, material:'wood', hp:1 },
    { x:1080, y:524, w:200, h:24, material:'wood', hp:1 },
    // Ultimateproof base — magenta glow, Ultimate blast skips it
    { x:960, y:620, w:80, h:40, material:'stone', hp:2,
      traits:['ultimateproof'] },
    // Convertimmune top slab — lime glow, Rainbow can't glass-ify it
    { x:870, y:436, w:420, h:24, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:870, y:388, w:340, h:40, material:'stone', hp:2,
      traits:['rainbowproof','convertimmune'] },
    { x:870, y:340, w:200, h:40, material:'soft', hp:1 },
  ]
},

]; // end BOOHA_DESTRUCTION_LEVELS
