
// ============================================================
// Booha Destruction — Levels Pack 1 (10 Levels)
// ============================================================

window.BOOHA_DESTRUCTION_LEVELS = [

/* ------------------------------------------------------------
1 — Warmup (teach: basic collapse)
------------------------------------------------------------ */
{
  id: 1,
  ghosts: 3,
  targetPercent: 100,
  name: "Warmup",

  blocks: [
    { x: 900, y: 620, w: 90, h: 40, material: "wood", hp: 1 },
    { x: 990, y: 620, w: 90, h: 40, material: "wood", hp: 1 },
    { x: 945, y: 580, w: 180, h: 24, material: "wood", hp: 1 }
  ]
},

/* ------------------------------------------------------------
2 — Glass Topple (teach: weak support)
------------------------------------------------------------ */
{
  id: 2,
  ghosts: 3,
  targetPercent: 100,
  name: "Glass Topple",

  blocks: [
    { x: 900, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1000, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 900, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1000, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 950, y: 520, w: 180, h: 24, material: "wood", hp: 1 }
  ]
},

/* ------------------------------------------------------------
3 — Stone Core (teach: strong center)
------------------------------------------------------------ */
{
  id: 3,
  ghosts: 3,
  targetPercent: 100,
  name: "Stone Core",

  blocks: [
    { x: 940, y: 620, w: 100, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 620, w: 100, h: 40, material: "stone", hp: 2 },

    { x: 990, y: 570, w: 200, h: 24, material: "stone", hp: 2 },

    { x: 990, y: 520, w: 90, h: 40, material: "wood", hp: 1 }
  ]
},

/* ------------------------------------------------------------
4 — Split Tower (teach: target one side)
------------------------------------------------------------ */
{
  id: 4,
  ghosts: 3,
  targetPercent: 100,
  name: "Split Tower",

  blocks: [
    { x: 880, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1080, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 880, y: 570, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1080, y: 570, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 880, y: 520, w: 100, h: 24, material: "stone", hp: 2 },
    { x: 1080, y: 520, w: 100, h: 24, material: "stone", hp: 2 }
  ]
},

/* ------------------------------------------------------------
5 — Bridge Break (teach: middle collapse)
------------------------------------------------------------ */
{
  id: 5,
  ghosts: 3,
  targetPercent: 100,
  name: "Bridge Break",

  blocks: [
    { x: 880, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1080, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 880, y: 560, w: 24, h: 80, material: "wood", hp: 1 },
    { x: 1080, y: 560, w: 24, h: 80, material: "wood", hp: 1 },

    { x: 980, y: 520, w: 260, h: 24, material: "glass", hp: 1 }
  ]
},

/* ------------------------------------------------------------
6 — Glass Trap (teach: precision)
------------------------------------------------------------ */
{
  id: 6,
  ghosts: 3,
  targetPercent: 100,
  name: "Glass Trap",

  blocks: [
    { x: 980, y: 620, w: 100, h: 40, material: "stone", hp: 2 },

    { x: 940, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1020, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 980, y: 500, w: 180, h: 24, material: "stone", hp: 2 },

    { x: 980, y: 450, w: 80, h: 40, material: "soft", hp: 1 }
  ]
},

/* ------------------------------------------------------------
7 — Wide Base (teach: low shots)
------------------------------------------------------------ */
{
  id: 7,
  ghosts: 3,
  targetPercent: 100,
  name: "Wide Base",

  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 960, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1060, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 960, y: 560, w: 260, h: 24, material: "stone", hp: 2 },

    { x: 960, y: 500, w: 90, h: 40, material: "glass", hp: 1 }
  ]
},

/* ------------------------------------------------------------
8 — Tower Stack (teach: chain collapse)
------------------------------------------------------------ */
{
  id: 8,
  ghosts: 3,
  targetPercent: 100,
  name: "Stack Fall",

  blocks: [
    { x: 980, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 980, y: 570, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 980, y: 520, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 980, y: 470, w: 140, h: 24, material: "stone", hp: 2 },

    { x: 980, y: 420, w: 80, h: 40, material: "glass", hp: 1 }
  ]
},

/* ------------------------------------------------------------
9 — Offset Chaos (teach: uneven collapse)
------------------------------------------------------------ */
{
  id: 9,
  ghosts: 3,
  targetPercent: 100,
  name: "Offset Chaos",

  blocks: [
    { x: 920, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 960, y: 560, w: 180, h: 24, material: "glass", hp: 1 },

    { x: 940, y: 510, w: 80, h: 40, material: "soft", hp: 1 },
    { x: 1040, y: 510, w: 80, h: 40, material: "stone", hp: 2 }
  ]
},

/* ------------------------------------------------------------
10 — Final Tower (test everything)
------------------------------------------------------------ */
{
  id: 10,
  ghosts: 3,
  targetPercent: 100,
  name: "Final Tower",

  blocks: [
    { x: 900, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1000, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 900, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1000, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 950, y: 520, w: 200, h: 24, material: "stone", hp: 2 },

    { x: 950, y: 470, w: 90, h: 40, material: "wood", hp: 1 },

    { x: 950, y: 420, w: 140, h: 24, material: "soft", hp: 1 }
  ]
}

];
