
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
},
/* ============================================================
ADD LEVELS 11–20 BELOW LEVEL 10
Paste these directly after the existing Level 10 object,
and before the final closing ];
============================================================ */

/* ------------------------------------------------------------
11 — Double Bridge (teach: break one side, collapse both)
------------------------------------------------------------ */
{
  id: 11,
  ghosts: 3,
  targetPercent: 100,
  name: "Double Bridge",

  blocks: [
    { x: 860, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 620, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 860, y: 560, w: 24, h: 80, material: "wood", hp: 1 },
    { x: 1060, y: 560, w: 24, h: 80, material: "wood", hp: 1 },

    { x: 960, y: 520, w: 300, h: 24, material: "glass", hp: 1 },

    { x: 960, y: 470, w: 100, h: 40, material: "wood", hp: 1 }
  ]
}

/* ------------------------------------------------------------
12 — Glass Crown (teach: weak top, strong bottom)
------------------------------------------------------------ */
,
{
  id: 12,
  ghosts: 3,
  targetPercent: 100,
  name: "Glass Crown",

  blocks: [
    { x: 910, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1010, y: 620, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 910, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1010, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 960, y: 520, w: 220, h: 24, material: "wood", hp: 1 },

    { x: 960, y: 470, w: 120, h: 40, material: "glass", hp: 1 }
  ]
}

/* ------------------------------------------------------------
13 — Offset Gate (teach: asymmetric collapse)
------------------------------------------------------------ */
,
{
  id: 13,
  ghosts: 3,
  targetPercent: 100,
  name: "Offset Gate",

  blocks: [
    { x: 890, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 990, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1090, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 940, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1040, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 990, y: 520, w: 240, h: 24, material: "stone", hp: 2 },

    { x: 950, y: 470, w: 80, h: 40, material: "soft", hp: 1 },
    { x: 1050, y: 470, w: 80, h: 40, material: "wood", hp: 1 }
  ]
}

/* ------------------------------------------------------------
14 — Triple Stack (teach: repeated vertical collapse)
------------------------------------------------------------ */
,
{
  id: 14,
  ghosts: 3,
  targetPercent: 100,
  name: "Triple Stack",

  blocks: [
    { x: 900, y: 620, w: 70, h: 40, material: "wood", hp: 1 },
    { x: 980, y: 620, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 620, w: 70, h: 40, material: "wood", hp: 1 },

    { x: 900, y: 570, w: 70, h: 40, material: "glass", hp: 1 },
    { x: 980, y: 570, w: 70, h: 40, material: "wood", hp: 1 },
    { x: 1060, y: 570, w: 70, h: 40, material: "glass", hp: 1 },

    { x: 980, y: 515, w: 280, h: 24, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
15 — Protected Core (teach: must break outer support)
------------------------------------------------------------ */
,
{
  id: 15,
  ghosts: 3,
  targetPercent: 100,
  name: "Protected Core",

  blocks: [
    { x: 880, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 620, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 880, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1040, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 960, y: 560, w: 80, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 500, w: 220, h: 24, material: "wood", hp: 1 },

    { x: 960, y: 450, w: 100, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
16 — Stone Shelf (teach: top-heavy punishment)
------------------------------------------------------------ */
,
{
  id: 16,
  ghosts: 3,
  targetPercent: 100,
  name: "Stone Shelf",

  blocks: [
    { x: 920, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1000, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 920, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1000, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 520, w: 220, h: 24, material: "stone", hp: 2 },

    { x: 910, y: 470, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1010, y: 470, w: 80, h: 40, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
17 — Leaning Trouble (teach: one good hit can sweep all)
------------------------------------------------------------ */
,
{
  id: 17,
  ghosts: 3,
  targetPercent: 100,
  name: "Leaning Trouble",

  blocks: [
    { x: 900, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1000, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 940, y: 560, w: 180, h: 24, material: "wood", hp: 1 },
    { x: 1020, y: 510, w: 180, h: 24, material: "glass", hp: 1 },
    { x: 980, y: 460, w: 180, h: 24, material: "stone", hp: 2 },

    { x: 1060, y: 410, w: 80, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
18 — Twin Towers (teach: split attention)
------------------------------------------------------------ */
,
{
  id: 18,
  ghosts: 3,
  targetPercent: 100,
  name: "Twin Towers",

  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 860, y: 570, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1060, y: 570, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 860, y: 520, w: 100, h: 24, material: "wood", hp: 1 },
    { x: 1060, y: 520, w: 100, h: 24, material: "wood", hp: 1 },

    { x: 960, y: 620, w: 90, h: 40, material: "wood", hp: 1 },
    { x: 960, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 960, y: 500, w: 120, h: 24, material: "glass", hp: 1 }
  ]
}

/* ------------------------------------------------------------
19 — False Center (teach: middle hit is not always right)
------------------------------------------------------------ */
,
{
  id: 19,
  ghosts: 3,
  targetPercent: 100,
  name: "False Center",

  blocks: [
    { x: 900, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 620, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 580, w: 120, h: 24, material: "stone", hp: 2 },

    { x: 900, y: 540, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1020, y: 540, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 490, w: 260, h: 24, material: "wood", hp: 1 },

    { x: 960, y: 440, w: 100, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
20 — Brutal Balance (checkpoint round)
------------------------------------------------------------ */
,
{
  id: 20,
  ghosts: 3,
  targetPercent: 100,
  name: "Brutal Balance",

  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 910, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1010, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 520, w: 260, h: 24, material: "stone", hp: 2 },

    { x: 900, y: 470, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1020, y: 470, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 960, y: 420, w: 140, h: 24, material: "soft", hp: 1 }
  ]
}
/* ============================================================
ADD LEVELS 21–30 BELOW LEVEL 20
Paste these directly after the existing Level 20 object,
and before the final closing ];
============================================================ */

/* ------------------------------------------------------------
21 — Wide Pressure
------------------------------------------------------------ */
,
{
  id: 21,
  ghosts: 3,
  targetPercent: 100,
  name: "Wide Pressure",

  blocks: [
    { x: 840, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 940, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 890, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 990, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 940, y: 520, w: 300, h: 24, material: "stone", hp: 2 },

    { x: 940, y: 470, w: 90, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
22 — Split Shelf
------------------------------------------------------------ */
,
{
  id: 22,
  ghosts: 3,
  targetPercent: 100,
  name: "Split Shelf",

  blocks: [
    { x: 870, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1050, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 870, y: 560, w: 24, h: 80, material: "wood", hp: 1 },
    { x: 1050, y: 560, w: 24, h: 80, material: "wood", hp: 1 },

    { x: 920, y: 520, w: 120, h: 24, material: "glass", hp: 1 },
    { x: 1000, y: 520, w: 120, h: 24, material: "glass", hp: 1 },

    { x: 960, y: 470, w: 100, h: 40, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
23 — Hard Center
------------------------------------------------------------ */
,
{
  id: 23,
  ghosts: 3,
  targetPercent: 100,
  name: "Hard Center",

  blocks: [
    { x: 900, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 980, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 980, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 940, y: 520, w: 180, h: 24, material: "glass", hp: 1 },
    { x: 1020, y: 520, w: 180, h: 24, material: "glass", hp: 1 },

    { x: 980, y: 470, w: 110, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
24 — Double Lean
------------------------------------------------------------ */
,
{
  id: 24,
  ghosts: 3,
  targetPercent: 100,
  name: "Double Lean",

  blocks: [
    { x: 900, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 620, w: 90, h: 40, material: "wood", hp: 1 },

    { x: 940, y: 570, w: 180, h: 24, material: "wood", hp: 1 },
    { x: 1000, y: 520, w: 180, h: 24, material: "glass", hp: 1 },
    { x: 960, y: 470, w: 180, h: 24, material: "stone", hp: 2 },

    { x: 1040, y: 420, w: 90, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
25 — Triple Gate
------------------------------------------------------------ */
,
{
  id: 25,
  ghosts: 3,
  targetPercent: 100,
  name: "Triple Gate",

  blocks: [
    { x: 860, y: 620, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 620, w: 70, h: 40, material: "wood", hp: 1 },
    { x: 1060, y: 620, w: 70, h: 40, material: "stone", hp: 2 },

    { x: 860, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 960, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1060, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 520, w: 320, h: 24, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
26 — Buried Weakness
------------------------------------------------------------ */
,
{
  id: 26,
  ghosts: 3,
  targetPercent: 100,
  name: "Buried Weakness",

  blocks: [
    { x: 890, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1030, y: 620, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 890, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1030, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 960, y: 560, w: 80, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 500, w: 240, h: 24, material: "stone", hp: 2 },

    { x: 960, y: 450, w: 100, h: 40, material: "wood", hp: 1 }
  ]
}

/* ------------------------------------------------------------
27 — False Bridge
------------------------------------------------------------ */
,
{
  id: 27,
  ghosts: 3,
  targetPercent: 100,
  name: "False Bridge",

  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1060, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 860, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1060, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 960, y: 520, w: 320, h: 24, material: "wood", hp: 1 },

    { x: 960, y: 470, w: 140, h: 24, material: "glass", hp: 1 },

    { x: 960, y: 430, w: 100, h: 40, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
28 — Stone Crown
------------------------------------------------------------ */
,
{
  id: 28,
  ghosts: 3,
  targetPercent: 100,
  name: "Stone Crown",

  blocks: [
    { x: 910, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1010, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 910, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1010, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 520, w: 220, h: 24, material: "stone", hp: 2 },

    { x: 910, y: 470, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1010, y: 470, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 420, w: 100, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
29 — Wide Punishment
------------------------------------------------------------ */
,
{
  id: 29,
  ghosts: 3,
  targetPercent: 100,
  name: "Wide Punishment",

  blocks: [
    { x: 820, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 940, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 880, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1000, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 940, y: 520, w: 320, h: 24, material: "stone", hp: 2 },

    { x: 940, y: 470, w: 100, h: 40, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
30 — Mean Tower
------------------------------------------------------------ */
,
{
  id: 30,
  ghosts: 3,
  targetPercent: 100,
  name: "Mean Tower",

  blocks: [
    { x: 960, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 570, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 960, y: 510, w: 180, h: 24, material: "glass", hp: 1 },
    { x: 960, y: 460, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 410, w: 180, h: 24, material: "wood", hp: 1 },
    { x: 960, y: 360, w: 90, h: 40, material: "soft", hp: 1 },

    { x: 880, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1040, y: 620, w: 80, h: 40, material: "wood", hp: 1 }
  ]
}
/* ============================================================
ADD LEVELS 31–40 BELOW LEVEL 30
Paste these directly after the existing Level 30 object,
and before the final closing ];
============================================================ */

/* ------------------------------------------------------------
31 — Stone Ladder
------------------------------------------------------------ */
,
{
  id: 31,
  ghosts: 3,
  targetPercent: 100,
  name: "Stone Ladder",

  blocks: [
    { x: 880, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 980, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1080, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 930, y: 560, w: 180, h: 24, material: "stone", hp: 2 },
    { x: 1030, y: 510, w: 180, h: 24, material: "glass", hp: 1 },
    { x: 930, y: 460, w: 180, h: 24, material: "stone", hp: 2 },

    { x: 980, y: 410, w: 100, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
32 — Buried Crown
------------------------------------------------------------ */
,
{
  id: 32,
  ghosts: 3,
  targetPercent: 100,
  name: "Buried Crown",

  blocks: [
    { x: 900, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 620, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 900, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1020, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 960, y: 560, w: 90, h: 80, material: "wood", hp: 1 },

    { x: 960, y: 500, w: 240, h: 24, material: "stone", hp: 2 },

    { x: 960, y: 450, w: 120, h: 40, material: "glass", hp: 1 },

    { x: 960, y: 400, w: 140, h: 24, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
33 — Triple Shelf
------------------------------------------------------------ */
,
{
  id: 33,
  ghosts: 3,
  targetPercent: 100,
  name: "Triple Shelf",

  blocks: [
    { x: 850, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 960, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1070, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 900, y: 560, w: 120, h: 24, material: "glass", hp: 1 },
    { x: 1020, y: 560, w: 120, h: 24, material: "glass", hp: 1 },

    { x: 960, y: 510, w: 300, h: 24, material: "stone", hp: 2 },

    { x: 910, y: 460, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1010, y: 460, w: 80, h: 40, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
34 — Cruel Bridge
------------------------------------------------------------ */
,
{
  id: 34,
  ghosts: 3,
  targetPercent: 100,
  name: "Cruel Bridge",

  blocks: [
    { x: 840, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1080, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 840, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1080, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 520, w: 360, h: 24, material: "stone", hp: 2 },

    { x: 960, y: 470, w: 120, h: 40, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
35 — Stone Spine
------------------------------------------------------------ */
,
{
  id: 35,
  ghosts: 3,
  targetPercent: 100,
  name: "Stone Spine",

  blocks: [
    { x: 960, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 570, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 960, y: 500, w: 220, h: 24, material: "stone", hp: 2 },
    { x: 960, y: 450, w: 90, h: 40, material: "glass", hp: 1 },
    { x: 960, y: 400, w: 180, h: 24, material: "stone", hp: 2 },
    { x: 960, y: 350, w: 90, h: 40, material: "soft", hp: 1 },

    { x: 880, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1040, y: 620, w: 80, h: 40, material: "wood", hp: 1 }
  ]
}

/* ------------------------------------------------------------
36 — Bad Choice
------------------------------------------------------------ */
,
{
  id: 36,
  ghosts: 3,
  targetPercent: 100,
  name: "Bad Choice",

  blocks: [
    { x: 900, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 620, w: 80, h: 40, material: "wood", hp: 1 },

    { x: 940, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1040, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 990, y: 520, w: 240, h: 24, material: "stone", hp: 2 },

    { x: 940, y: 470, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1040, y: 470, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 990, y: 420, w: 110, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
37 — Twin Punishment
------------------------------------------------------------ */
,
{
  id: 37,
  ghosts: 3,
  targetPercent: 100,
  name: "Twin Punishment",

  blocks: [
    { x: 850, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1070, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 850, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1070, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 850, y: 500, w: 100, h: 24, material: "glass", hp: 1 },
    { x: 1070, y: 500, w: 100, h: 24, material: "glass", hp: 1 },

    { x: 960, y: 620, w: 90, h: 40, material: "wood", hp: 1 },
    { x: 960, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 960, y: 500, w: 140, h: 24, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
38 — Stone Trap
------------------------------------------------------------ */
,
{
  id: 38,
  ghosts: 3,
  targetPercent: 100,
  name: "Stone Trap",

  blocks: [
    { x: 890, y: 620, w: 90, h: 40, material: "wood", hp: 1 },
    { x: 1030, y: 620, w: 90, h: 40, material: "wood", hp: 1 },

    { x: 890, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1030, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 520, w: 260, h: 24, material: "stone", hp: 2 },

    { x: 960, y: 470, w: 100, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 420, w: 140, h: 24, material: "glass", hp: 1 }
  ]
}

/* ------------------------------------------------------------
39 — Long Fall
------------------------------------------------------------ */
,
{
  id: 39,
  ghosts: 3,
  targetPercent: 100,
  name: "Long Fall",

  blocks: [
    { x: 900, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1000, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 950, y: 570, w: 220, h: 24, material: "wood", hp: 1 },
    { x: 1020, y: 520, w: 220, h: 24, material: "glass", hp: 1 },
    { x: 950, y: 470, w: 220, h: 24, material: "stone", hp: 2 },
    { x: 1020, y: 420, w: 220, h: 24, material: "wood", hp: 1 },

    { x: 990, y: 370, w: 90, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
40 — Boss Wall
------------------------------------------------------------ */
,
{
  id: 40,
  ghosts: 3,
  targetPercent: 100,
  name: "Boss Wall",

  blocks: [
    { x: 840, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 940, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 890, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 990, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 940, y: 520, w: 300, h: 24, material: "stone", hp: 2 },

    { x: 940, y: 470, w: 90, h: 40, material: "glass", hp: 1 },
    { x: 1040, y: 470, w: 90, h: 40, material: "glass", hp: 1 },

    { x: 990, y: 420, w: 180, h: 24, material: "soft", hp: 1 }
  ]
}
/* ============================================================
ADD LEVELS 41–50 BELOW LEVEL 40
Paste these directly after the existing Level 40 object,
and before the final closing ];
============================================================ */

/* ------------------------------------------------------------
41 — Stone Canopy
------------------------------------------------------------ */
,
{
  id: 41,
  ghosts: 3,
  targetPercent: 100,
  name: "Stone Canopy",

  blocks: [
    { x: 900, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 620, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 900, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1020, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 520, w: 260, h: 24, material: "stone", hp: 2 },
    { x: 900, y: 470, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 470, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 420, w: 120, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
42 — Hammer Gate
------------------------------------------------------------ */
,
{
  id: 42,
  ghosts: 3,
  targetPercent: 100,
  name: "Hammer Gate",

  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 860, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1060, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 960, y: 520, w: 320, h: 24, material: "stone", hp: 2 },

    { x: 960, y: 470, w: 100, h: 40, material: "glass", hp: 1 },
    { x: 960, y: 420, w: 180, h: 24, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
43 — Twin Spines
------------------------------------------------------------ */
,
{
  id: 43,
  ghosts: 3,
  targetPercent: 100,
  name: "Twin Spines",

  blocks: [
    { x: 880, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 880, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1040, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 880, y: 500, w: 110, h: 24, material: "glass", hp: 1 },
    { x: 1040, y: 500, w: 110, h: 24, material: "glass", hp: 1 },

    { x: 960, y: 620, w: 90, h: 40, material: "wood", hp: 1 },
    { x: 960, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 960, y: 500, w: 160, h: 24, material: "stone", hp: 2 },
    { x: 960, y: 450, w: 100, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
44 — Punish Left
------------------------------------------------------------ */
,
{
  id: 44,
  ghosts: 3,
  targetPercent: 100,
  name: "Punish Left",

  blocks: [
    { x: 880, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1010, y: 620, w: 90, h: 40, material: "wood", hp: 1 },

    { x: 920, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1040, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 980, y: 520, w: 260, h: 24, material: "stone", hp: 2 },

    { x: 930, y: 470, w: 90, h: 40, material: "glass", hp: 1 },
    { x: 1030, y: 470, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 980, y: 420, w: 120, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
45 — Stone Cathedral
------------------------------------------------------------ */
,
{
  id: 45,
  ghosts: 3,
  targetPercent: 100,
  name: "Stone Cathedral",

  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 910, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1010, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 520, w: 300, h: 24, material: "stone", hp: 2 },

    { x: 910, y: 470, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 1010, y: 470, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 420, w: 180, h: 24, material: "glass", hp: 1 },
    { x: 960, y: 370, w: 110, h: 40, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
46 — Wide Cruelty
------------------------------------------------------------ */
,
{
  id: 46,
  ghosts: 3,
  targetPercent: 100,
  name: "Wide Cruelty",

  blocks: [
    { x: 820, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 940, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 880, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1000, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 940, y: 520, w: 340, h: 24, material: "stone", hp: 2 },

    { x: 940, y: 470, w: 120, h: 40, material: "glass", hp: 1 },
    { x: 940, y: 420, w: 180, h: 24, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
47 — False Mercy
------------------------------------------------------------ */
,
{
  id: 47,
  ghosts: 3,
  targetPercent: 100,
  name: "False Mercy",

  blocks: [
    { x: 900, y: 620, w: 90, h: 40, material: "wood", hp: 1 },
    { x: 1020, y: 620, w: 90, h: 40, material: "stone", hp: 2 },

    { x: 900, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1020, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 960, y: 520, w: 260, h: 24, material: "stone", hp: 2 },

    { x: 910, y: 470, w: 90, h: 40, material: "glass", hp: 1 },
    { x: 1010, y: 470, w: 90, h: 40, material: "glass", hp: 1 },

    { x: 960, y: 420, w: 120, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 370, w: 140, h: 24, material: "soft", hp: 1 }
  ]
}

/* ------------------------------------------------------------
48 — Last Bad Bridge
------------------------------------------------------------ */
,
{
  id: 48,
  ghosts: 3,
  targetPercent: 100,
  name: "Last Bad Bridge",

  blocks: [
    { x: 850, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1070, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 850, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 1070, y: 560, w: 24, h: 80, material: "glass", hp: 1 },

    { x: 960, y: 520, w: 340, h: 24, material: "stone", hp: 2 },

    { x: 960, y: 470, w: 140, h: 24, material: "glass", hp: 1 },
    { x: 960, y: 430, w: 110, h: 40, material: "stone", hp: 2 }
  ]
}

/* ------------------------------------------------------------
49 — Final Spine
------------------------------------------------------------ */
,
{
  id: 49,
  ghosts: 3,
  targetPercent: 100,
  name: "Final Spine",

  blocks: [
    { x: 960, y: 620, w: 90, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 570, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 960, y: 500, w: 240, h: 24, material: "stone", hp: 2 },
    { x: 960, y: 450, w: 100, h: 40, material: "glass", hp: 1 },
    { x: 960, y: 400, w: 200, h: 24, material: "stone", hp: 2 },
    { x: 960, y: 350, w: 100, h: 40, material: "glass", hp: 1 },
    { x: 960, y: 300, w: 160, h: 24, material: "soft", hp: 1 },

    { x: 880, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1040, y: 620, w: 80, h: 40, material: "wood", hp: 1 }
  ]
}

/* ------------------------------------------------------------
50 — BOOHA WALL
Final round
------------------------------------------------------------ */
,
{
  id: 50,
  ghosts: 3,
  targetPercent: 100,
  name: "BOOHA WALL",

  blocks: [
    { x: 820, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 920, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1120, y: 620, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 870, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 970, y: 560, w: 24, h: 80, material: "stone", hp: 2 },
    { x: 1070, y: 560, w: 24, h: 80, material: "stone", hp: 2 },

    { x: 970, y: 520, w: 360, h: 24, material: "stone", hp: 2 },

    { x: 920, y: 470, w: 90, h: 40, material: "glass", hp: 1 },
    { x: 1020, y: 470, w: 90, h: 40, material: "glass", hp: 1 },

    { x: 970, y: 420, w: 220, h: 24, material: "stone", hp: 2 },

    { x: 970, y: 370, w: 120, h: 40, material: "soft", hp: 1 }
  ]
}

];


  

  
