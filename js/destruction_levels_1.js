
// ============================================================
// Booha Destruction — Levels Pack (50 Levels, Full Redesign)
//
// DESIGN PHILOSOPHY:
//   Rounds  1-10  — One mechanic per round. Learn the basics.
//   Rounds 11-20  — Two mechanics. First "wrong Booha" punishments.
//   Rounds 21-30  — Specific Booha advantages become mandatory.
//   Rounds 31-40  — Multi-step solutions. Chain collapses required.
//   Rounds 41-50  — Illusions, synergy, chaos. Planning essential.
//
// SHOT BUDGET REALITY (19 shots total):
//   Normal×5, Heavy×3, Rock×2, Ice×2, Fire×2,
//   Princess×1, Rainbow×1, Nightmare×1, Monster×1, Ultimate×1
//
// HP FORCING LOGIC:
//   Stone hp:2 = 2 Normal hits OR 1 Heavy hit
//   A wall of 6 stone blocks = 12 Normal shots (most of your supply)
//   This forces Heavy without hard-locking it
//   Glass hp:1 but often load-bearing — one hit cascades everything
//   Soft hp:1 but absorbs bounces, punishes straight shots
// ============================================================

window.BOOHA_DESTRUCTION_LEVELS = [

/* ============================================================
  ZONE 1 — LEARN THE RULES (Rounds 1–10)
  One mechanic per round. Forgiving. Tutorial in disguise.
============================================================ */

/* ------------------------------------------------------------
  1 — First Shot
  Single wood stack. Hit it. That's the lesson.
  Collapse logic: floor → nothing. Simple vertical drop.
------------------------------------------------------------ */
{
  id: 1, name: "First Shot",
  targetPercent: 100,
  blocks: [
    { x: 960, y: 620, w: 90, h: 40, material: "wood", hp: 1 },
    { x: 960, y: 572, w: 90, h: 40, material: "wood", hp: 1 },
    { x: 960, y: 524, w: 90, h: 40, material: "wood", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  2 — Glass Aware
  Wood base holds a glass column. Hit the glass → wood falls.
  Teaches: glass is load-bearing, not just decoration.
------------------------------------------------------------ */
{
  id: 2, name: "Glass Aware",
  targetPercent: 100,
  blocks: [
    { x: 920, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 1020, y: 620, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 920, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 1020, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 970, y: 512, w: 180, h: 24, material: "wood", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  3 — Glass Core
  Stone bookends protect a glass center.
  Hit the glass precisely — stone on either side won't fall
  from a sloppy shot. Teaches precision.
------------------------------------------------------------ */
{
  id: 3, name: "Glass Core",
  targetPercent: 100,
  blocks: [
    { x: 890, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1050, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 970, y: 620, w: 120, h: 40, material: "glass", hp: 1 },
    { x: 970, y: 572, w: 80, h: 40, material: "wood", hp: 1 },
    { x: 970, y: 524, w: 80, h: 40, material: "wood", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  4 — Meet Heavy
  Four stone blocks in a row. Normal Booha takes 8 shots (most
  of your supply). Heavy takes 4. The structure teaches the cost.
  Teaches: Heavy exists for a reason.
------------------------------------------------------------ */
{
  id: 4, name: "Meet Heavy",
  targetPercent: 100,
  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 572, w: 280, h: 24, material: "stone", hp: 2 },
    { x: 960, y: 536, w: 120, h: 48, material: "wood",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  5 — Spread Shot
  Wide soft blocks arranged in a fan. Normal hits one at a time.
  Princess spreads minis across all of them.
  Teaches: Princess for wide soft targets.
------------------------------------------------------------ */
{
  id: 5, name: "Spread Shot",
  targetPercent: 100,
  blocks: [
    { x: 840, y: 620, w: 100, h: 36, material: "soft", hp: 1 },
    { x: 960, y: 620, w: 100, h: 36, material: "soft", hp: 1 },
    { x: 1080, y: 620, w: 100, h: 36, material: "soft", hp: 1 },
    { x: 840, y: 576, w: 100, h: 36, material: "soft", hp: 1 },
    { x: 1080, y: 576, w: 100, h: 36, material: "soft", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  6 — Tall Glass Tower
  Tall glass column with a wood cap. Top-down angle required.
  Low shots hit the base (fine) but the cap stays floating.
  Teaches: angle matters, not just power.
------------------------------------------------------------ */
{
  id: 6, name: "Tall Glass Tower",
  targetPercent: 100,
  blocks: [
    { x: 960, y: 620, w: 60, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 572, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 960, y: 472, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 960, y: 424, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 870, y: 620, w: 60, h: 40, material: "wood",  hp: 1 },
    { x: 1050, y: 620, w: 60, h: 40, material: "wood", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  7 — First Choice
  Two distinct targets. Left: glass chain (quick). Right: stone
  block (expensive). Clearing left collapses nothing on right.
  Player must choose: precision or brute force.
  Teaches: not every block matters equally.
------------------------------------------------------------ */
{
  id: 7, name: "First Choice",
  targetPercent: 100,
  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 860, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 860, y: 500, w: 100, h: 40, material: "wood", hp: 1 },

    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 524, w: 80, h: 40, material: "stone", hp: 2 },
  ]
},

/* ------------------------------------------------------------
  8 — Offset Tower
  Stack leaning right — the top block hangs over open air.
  Straight shots miss the overhang. Angled shot required.
  Teaches: the sling angle is a tool, not just power.
------------------------------------------------------------ */
{
  id: 8, name: "Offset Tower",
  targetPercent: 100,
  blocks: [
    { x: 920, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1000, y: 524, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1040, y: 476, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1040, y: 428, w: 80, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  9 — Bounce Introduction
  Stone floor block with small blocks balanced on either side.
  Direct hits move the floor block, side blocks fall inward.
  Ricochet off floor hits the underside of the bridge.
  Teaches: the floor is a tool.
------------------------------------------------------------ */
{
  id: 9, name: "Bounce Intro",
  targetPercent: 100,
  blocks: [
    { x: 960, y: 620, w: 200, h: 30, material: "stone", hp: 2 },
    { x: 870, y: 582, w: 60, h: 40,  material: "wood",  hp: 1 },
    { x: 1050, y: 582, w: 60, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 570, w: 80, h: 24,  material: "glass", hp: 1 },
    { x: 960, y: 530, w: 120, h: 40, material: "wood",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  10 — False Base
  Bottom block looks important but the MIDDLE block is the real
  support. Destroy middle → everything above collapses.
  Bottom stays. Teaches: read the structure, not the silhouette.
------------------------------------------------------------ */
{
  id: 10, name: "False Base",
  targetPercent: 100,
  blocks: [
    { x: 960, y: 620, w: 160, h: 30, material: "stone", hp: 2 },
    { x: 960, y: 582, w: 80, h: 40,  material: "glass", hp: 1 },
    { x: 960, y: 534, w: 200, h: 24, material: "wood",  hp: 1 },
    { x: 900, y: 494, w: 60, h: 40,  material: "wood",  hp: 1 },
    { x: 1020, y: 494, w: 60, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 446, w: 120, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ============================================================
  ZONE 2 — TWO MECHANICS (Rounds 11–20)
  Structures that punish one Booha type, reward another.
  First "wrong ghost wastes shots" lessons.
============================================================ */

/* ------------------------------------------------------------
  11 — Two Stacks, One Matters
  Left: all soft blocks (easy). Right: stone pillar (expensive).
  Destroying left triggers nothing on right. Must address both.
  Soft supply (Normal) runs out if you don't use Princess left.
  Teaches: resource management.
------------------------------------------------------------ */
{
  id: 11, name: "Two Stacks",
  targetPercent: 100,
  blocks: [
    { x: 860, y: 620, w: 80, h: 36, material: "soft",  hp: 1 },
    { x: 860, y: 576, w: 80, h: 36, material: "soft",  hp: 1 },
    { x: 860, y: 532, w: 80, h: 36, material: "soft",  hp: 1 },
    { x: 860, y: 488, w: 80, h: 36, material: "soft",  hp: 1 },

    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 524, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 476, w: 80, h: 40, material: "stone", hp: 2 },
  ]
},

/* ------------------------------------------------------------
  12 — Chain Reaction
  Weak glass stack on left touches the base of a stone-topped
  tower. Glass breaks → stone tower loses support → topples.
  Normal Booha on left triggers Heavy-worthy result for free.
  Teaches: chain collapse awareness.
------------------------------------------------------------ */
{
  id: 12, name: "Chain Reaction",
  targetPercent: 100,
  blocks: [
    { x: 870, y: 620, w: 70, h: 40,  material: "wood",  hp: 1 },
    { x: 870, y: 556, w: 24, h: 88,  material: "glass", hp: 1 },
    { x: 910, y: 512, w: 200, h: 24, material: "wood",  hp: 1 },

    { x: 1010, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1010, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1010, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1010, y: 476, w: 80, h: 40, material: "wood",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  13 — Rainbow Setup
  Stone wall that would cost 6+ Normal shots.
  One Rainbow converts the whole row to glass, then 3 Normals
  clear it. Wrong approach: brute force fails on shot budget.
  Teaches: Rainbow's conversion value.
------------------------------------------------------------ */
{
  id: 13, name: "Rainbow Setup",
  targetPercent: 100,
  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 572, w: 280, h: 24, material: "stone", hp: 2 },
    { x: 910, y: 536, w: 80, h: 40,  material: "wood",  hp: 1 },
    { x: 1010, y: 536, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 488, w: 140, h: 40, material: "wood",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  14 — Princess Advantage
  Six soft blocks spread wide. One Princess hit spawns 3 minis
  that scatter across all of them. Normal Booha takes 6 shots
  (your entire Normal supply). Princess takes 1.
  Teaches: Princess is not a novelty, it's a tool.
------------------------------------------------------------ */
{
  id: 14, name: "Princess Advantage",
  targetPercent: 100,
  blocks: [
    { x: 820, y: 620, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 920, y: 620, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 1020, y: 620, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 820, y: 576, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 920, y: 576, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 1020, y: 576, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 920, y: 532, w: 280, h: 24, material: "stone", hp: 2 },
    { x: 920, y: 484, w: 120, h: 40, material: "wood",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  15 — Nightmare Intro
  Stone wall in front, wood target hiding behind it.
  Normal Booha can't get behind the wall without wasting shots
  clearing it first. Nightmare teleports past it directly.
  Teaches: Nightmare bypasses obstacles.
------------------------------------------------------------ */
{
  id: 15, name: "Nightmare Intro",
  targetPercent: 100,
  blocks: [
    { x: 900, y: 620, w: 40, h: 200, material: "stone", hp: 2 },
    { x: 900, y: 520, w: 40, h: 24,  material: "stone", hp: 2 },

    { x: 1040, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1040, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1040, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1040, y: 476, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1040, y: 428, w: 120, h: 40, material: "wood", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  16 — Tall Wide Hybrid
  Tall stone column beside a wide soft platform.
  Stone needs Heavy. Soft needs Princess or spread fire.
  Using all Normals on stone wastes shots badly.
  Teaches: identify the right tool per zone.
------------------------------------------------------------ */
{
  id: 16, name: "Tall Wide Hybrid",
  targetPercent: 100,
  blocks: [
    { x: 880, y: 620, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 880, y: 572, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 880, y: 524, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 880, y: 476, w: 70, h: 40, material: "stone", hp: 2 },

    { x: 1030, y: 620, w: 200, h: 36, material: "soft", hp: 1 },
    { x: 1030, y: 576, w: 200, h: 36, material: "soft", hp: 1 },
    { x: 1030, y: 532, w: 200, h: 36, material: "soft", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  17 — Hidden Stone Core
  Wood exterior hides a stone block in the center.
  Breaking the wood shell reveals the stone — Normal shots can't
  finish the job. Need to plan a Heavy follow-up.
  Teaches: structures have layers.
------------------------------------------------------------ */
{
  id: 17, name: "Hidden Stone Core",
  targetPercent: 100,
  blocks: [
    { x: 960, y: 620, w: 180, h: 36, material: "wood",  hp: 1 },
    { x: 870, y: 572, w: 80, h: 36,  material: "wood",  hp: 1 },
    { x: 1050, y: 572, w: 80, h: 36, material: "wood",  hp: 1 },
    { x: 960, y: 572, w: 100, h: 36, material: "stone", hp: 2 },
    { x: 870, y: 524, w: 80, h: 36,  material: "wood",  hp: 1 },
    { x: 1050, y: 524, w: 80, h: 36, material: "wood",  hp: 1 },
    { x: 960, y: 524, w: 100, h: 36, material: "stone", hp: 2 },
    { x: 960, y: 476, w: 180, h: 36, material: "wood",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  18 — Stack Behind Stack
  Front stack: glass (easy, one hit each).
  Back stack behind it: stone (expensive).
  Glass falls forward and doesn't touch stone. Need angle.
  Teaches: you can't always rely on chain collapse.
------------------------------------------------------------ */
{
  id: 18, name: "Stack Behind Stack",
  targetPercent: 100,
  blocks: [
    { x: 880, y: 620, w: 70, h: 40, material: "glass", hp: 1 },
    { x: 880, y: 572, w: 70, h: 40, material: "glass", hp: 1 },
    { x: 880, y: 524, w: 70, h: 40, material: "glass", hp: 1 },

    { x: 1040, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 524, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 476, w: 80, h: 40, material: "stone", hp: 2 },
  ]
},

/* ------------------------------------------------------------
  19 — False Center
  Center block looks like the keystone but it's stone (hp:2).
  The real weak points are the two glass columns holding up the
  heavy slab above. Shoot the glass, the slab crushes center.
  Teaches: the obvious target isn't always the right one.
------------------------------------------------------------ */
{
  id: 19, name: "False Center",
  targetPercent: 100,
  blocks: [
    { x: 870, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1050, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 870, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 1050, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 960, y: 512, w: 260, h: 36, material: "stone", hp: 2 },
    { x: 960, y: 466, w: 80, h: 40,  material: "stone", hp: 2 },
    { x: 960, y: 418, w: 140, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  20 — Vertical Collapse Chain
  Tall thin tower with alternating materials.
  Hit the glass layer in the middle → everything above falls
  onto everything below → crush damage triggers wood breaks.
  Teaches: fall damage is a real mechanic.
------------------------------------------------------------ */
{
  id: 20, name: "Vertical Collapse",
  targetPercent: 100,
  blocks: [
    { x: 960, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 476, w: 80, h: 24, material: "glass", hp: 1 },
    { x: 960, y: 440, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 392, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 344, w: 120, h: 40, material: "stone", hp: 2 },
  ]
},

/* ============================================================
  ZONE 3 — SPECIFIC BOOHA ADVANTAGE (Rounds 21–30)
  Structures designed so the right Booha type solves it cleanly.
  Wrong approach: technically possible but costs 2x the shots.
============================================================ */

/* ------------------------------------------------------------
  21 — Stone Fortress
  Six stone blocks arranged in a thick wall.
  Normal Booha: 12 shots (more than you have for this alone).
  Heavy Booha: 6 shots, perfect.
  Teaches: Heavy is mandatory for stone fortresses.
------------------------------------------------------------ */
{
  id: 21, name: "Stone Fortress",
  targetPercent: 100,
  blocks: [
    { x: 870, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1050, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 870, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1050, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 524, w: 280, h: 24, material: "wood",  hp: 1 },
    { x: 960, y: 476, w: 120, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  22 — Spread Layout
  Eight soft blocks spread across a very wide area.
  Normal Booha: 8 shots (wipes your supply).
  Princess + 1 mini spread: handles 3-4 in one shot.
  Teaches: Princess is required for wide soft coverage.
------------------------------------------------------------ */
{
  id: 22, name: "Spread Layout",
  targetPercent: 100,
  blocks: [
    { x: 800, y: 620, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 900, y: 620, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 1000, y: 620, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 1100, y: 620, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 800, y: 576, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 900, y: 576, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 1000, y: 576, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 1100, y: 576, w: 80, h: 36, material: "soft", hp: 1 },
    { x: 950, y: 532, w: 380, h: 24, material: "stone", hp: 2 },
  ]
},

/* ------------------------------------------------------------
  23 — Multi-Hit Base
  Stone wall in front of a wood structure. The wall is long.
  Rock Booha pierces through the wall AND hits the wood.
  Normal Booha can't touch the wood without clearing the wall.
  Teaches: Rock pierces, use it on layered targets.
------------------------------------------------------------ */
{
  id: 23, name: "Multi-Hit Base",
  targetPercent: 100,
  blocks: [
    { x: 880, y: 620, w: 40, h: 160, material: "stone", hp: 2 },
    { x: 880, y: 460, w: 40, h: 40,  material: "stone", hp: 2 },

    { x: 1000, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1000, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1000, y: 524, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1000, y: 476, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1000, y: 428, w: 120, h: 40, material: "stone", hp: 2 },
  ]
},

/* ------------------------------------------------------------
  24 — Freeze and Shatter
  Stone blocks encased in ice material blocks.
  Ice Booha freezes them, they shatter without needing Heavy.
  Normal approach: 10+ shots on stone. Ice approach: 4 shots.
  Teaches: Ice is a stone-softener.
------------------------------------------------------------ */
{
  id: 24, name: "Freeze and Shatter",
  targetPercent: 100,
  blocks: [
    { x: 880, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 880, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 524, w: 280, h: 24, material: "wood",  hp: 1 },
    { x: 960, y: 476, w: 100, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  25 — Burn Spread Structure
  Tightly packed wood blocks with soft blocks in center.
  Fire Booha hits one, burn spreads to neighbors, chain damage.
  Normal approach: 9 individual hits. Fire: 1 hit + wait.
  Teaches: Fire excels in dense clustered structures.
------------------------------------------------------------ */
{
  id: 25, name: "Burn Spread",
  targetPercent: 100,
  blocks: [
    { x: 880, y: 620, w: 70, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 620, w: 70, h: 40, material: "soft",  hp: 1 },
    { x: 1040, y: 620, w: 70, h: 40, material: "wood",  hp: 1 },
    { x: 880, y: 572, w: 70, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 572, w: 70, h: 40, material: "soft",  hp: 1 },
    { x: 1040, y: 572, w: 70, h: 40, material: "wood",  hp: 1 },
    { x: 880, y: 524, w: 70, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 524, w: 70, h: 40, material: "soft",  hp: 1 },
    { x: 1040, y: 524, w: 70, h: 40, material: "wood",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  26 — Glass Conversion Wall
  Huge stone wall — way too expensive to brute force.
  Rainbow converts the front row to glass, then Normal clears it.
  Behind: wood tower that falls when the wall goes.
  Teaches: Rainbow enables solutions that don't exist otherwise.
------------------------------------------------------------ */
{
  id: 26, name: "Glass Conversion",
  targetPercent: 100,
  blocks: [
    { x: 890, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 890, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 890, y: 524, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 890, y: 476, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 890, y: 428, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 1010, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1010, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1010, y: 524, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1010, y: 476, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1010, y: 428, w: 80, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  27 — Rear Target
  Dense stone wall blocks direct access.
  Wood target group sits far right, behind the wall.
  Nightmare warps past it. Normal must waste 6+ shots on wall.
  Teaches: Nightmare's warp value for rear targets.
------------------------------------------------------------ */
{
  id: 27, name: "Rear Target",
  targetPercent: 100,
  blocks: [
    { x: 870, y: 620, w: 40, h: 240, material: "stone", hp: 2 },

    { x: 1020, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1120, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1020, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1120, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1070, y: 524, w: 180, h: 24, material: "glass", hp: 1 },
    { x: 1070, y: 476, w: 100, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  28 — Bounce Scaling
  Wide floor structure. Monster Booha grows on each floor bounce.
  By the 3rd bounce it's huge — clears multiple blocks per hit.
  Normal Booha: picks off one block at a time.
  Teaches: Monster rewards patience and floor shots.
------------------------------------------------------------ */
{
  id: 28, name: "Bounce Scaling",
  targetPercent: 100,
  blocks: [
    { x: 960, y: 620, w: 360, h: 28, material: "stone", hp: 2 },
    { x: 840, y: 580, w: 70, h: 40,  material: "wood",  hp: 1 },
    { x: 920, y: 580, w: 70, h: 40,  material: "stone", hp: 2 },
    { x: 1000, y: 580, w: 70, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 580, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 880, y: 532, w: 160, h: 24, material: "wood",  hp: 1 },
    { x: 1040, y: 532, w: 160, h: 24, material: "wood", hp: 1 },
    { x: 960, y: 484, w: 200, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  29 — Center Blast Setup
  Wide dispersed structure, all blocks within 280px of center.
  Ultimate Booha settles center → everything explodes at once.
  Any other approach: 12+ individual hits.
  Teaches: Ultimate is a room-clearer, not a sniper.
------------------------------------------------------------ */
{
  id: 29, name: "Center Blast",
  targetPercent: 100,
  blocks: [
    { x: 820, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 920, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1120, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 870, y: 572, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1070, y: 572, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 970, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 870, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1070, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 970, y: 524, w: 80, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  30 — Mixed Puzzle
  Stone section (needs Heavy), soft spread (needs Princess),
  wood back (needs Normal or Rock).
  Wrong ghost on wrong section wastes 3+ shots each time.
  Teaches: budget allocation — plan before you shoot.
------------------------------------------------------------ */
{
  id: 30, name: "Mixed Puzzle",
  targetPercent: 100,
  blocks: [
    { x: 840, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 840, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 840, y: 524, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 620, w: 90, h: 36, material: "soft",  hp: 1 },
    { x: 960, y: 576, w: 90, h: 36, material: "soft",  hp: 1 },
    { x: 960, y: 532, w: 90, h: 36, material: "soft",  hp: 1 },

    { x: 1080, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 572, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1080, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 476, w: 80, h: 40, material: "stone", hp: 2 },
  ]
},

/* ============================================================
  ZONE 4 — MULTI-STEP SOLUTIONS (Rounds 31–40)
  Chain collapse required. Setup shots. No immediate reward.
  Every shot should have a purpose beyond direct damage.
============================================================ */

/* ------------------------------------------------------------
  31 — Delayed Collapse Sequence
  Top-heavy structure. Base is glass, top is stone.
  Hit the glass base → stone top falls → crush breaks the floor.
  Immediate result: nothing visible. Then everything topples.
  Teaches: setup shots are valid even without instant feedback.
------------------------------------------------------------ */
{
  id: 31, name: "Delayed Collapse",
  targetPercent: 100,
  blocks: [
    { x: 900, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1040, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 970, y: 572, w: 220, h: 24, material: "glass", hp: 1 },
    { x: 900, y: 524, w: 80, h: 40,  material: "stone", hp: 2 },
    { x: 1040, y: 524, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 970, y: 476, w: 220, h: 24, material: "stone", hp: 2 },
    { x: 970, y: 428, w: 140, h: 40, material: "stone", hp: 2 },
    { x: 970, y: 380, w: 100, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  32 — Top First Structure
  Only way to clear: destroy top-level glass support first.
  Bottom stone base is unreachable without clearing above.
  Low-trajectory shots all hit the stone and waste on hp:2.
  Teaches: top-down is sometimes the only valid approach.
------------------------------------------------------------ */
{
  id: 32, name: "Top First",
  targetPercent: 100,
  blocks: [
    { x: 900, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 900, y: 556, w: 24, h: 88,  material: "stone", hp: 2 },
    { x: 1040, y: 556, w: 24, h: 88, material: "stone", hp: 2 },
    { x: 970, y: 512, w: 240, h: 24, material: "wood",  hp: 1 },
    { x: 970, y: 460, w: 200, h: 40, material: "stone", hp: 2 },
    { x: 900, y: 412, w: 80, h: 40,  material: "glass", hp: 1 },
    { x: 1040, y: 412, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 970, y: 364, w: 220, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  33 — Base Trap
  Shooting the base does nothing — base is stone hp:2.
  The actual weak point is a glass pillar on the second level.
  Hitting it wrong sends everything sideways, not down.
  Punishes players who always aim at the base.
  Teaches: base is not always the target.
------------------------------------------------------------ */
{
  id: 33, name: "Base Trap",
  targetPercent: 100,
  blocks: [
    { x: 960, y: 620, w: 300, h: 30, material: "stone", hp: 2 },
    { x: 870, y: 572, w: 80, h: 40,  material: "wood",  hp: 1 },
    { x: 1050, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 568, w: 24, h: 48,  material: "glass", hp: 1 },
    { x: 960, y: 512, w: 260, h: 24, material: "stone", hp: 2 },
    { x: 900, y: 464, w: 80, h: 40,  material: "stone", hp: 2 },
    { x: 1020, y: 464, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 416, w: 160, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  34 — Dual Illusion Stacks
  Two identical-looking towers. Only destroying the LEFT one
  causes collapse (shared bridge). Right tower stands alone.
  Wrong choice: clear right, left stays, fail.
  Teaches: structures share dependencies, read carefully.
------------------------------------------------------------ */
{
  id: 34, name: "Dual Illusion",
  targetPercent: 100,
  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 860, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 1060, y: 556, w: 24, h: 88, material: "stone", hp: 2 },
    { x: 960, y: 512, w: 260, h: 24, material: "wood",  hp: 1 },
    { x: 960, y: 464, w: 100, h: 40, material: "stone", hp: 2 },
    { x: 860, y: 512, w: 80, h: 40,  material: "soft",  hp: 1 },
    { x: 1060, y: 512, w: 80, h: 40, material: "wood",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  35 — Timed Chain Reaction
  Three separate structures. Hitting the first knocks a block
  into the second (wood bridge falls → hits soft stack).
  Soft stack collapse sends debris into third.
  Only works if hit in correct order (left to right).
  Teaches: chain reactions have a sequence.
------------------------------------------------------------ */
{
  id: 35, name: "Timed Chain",
  targetPercent: 100,
  blocks: [
    { x: 840, y: 620, w: 70, h: 40, material: "wood",  hp: 1 },
    { x: 840, y: 572, w: 70, h: 40, material: "glass", hp: 1 },
    { x: 840, y: 524, w: 70, h: 40, material: "wood",  hp: 1 },

    { x: 960, y: 620, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 572, w: 190, h: 24, material: "wood", hp: 1 },
    { x: 960, y: 524, w: 70, h: 40, material: "soft",  hp: 1 },

    { x: 1080, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1080, y: 572, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1080, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 476, w: 80, h: 40, material: "stone", hp: 2 },
  ]
},

/* ------------------------------------------------------------
  36 — Glass Bait
  Large glass block front and center — obvious, inviting.
  But it's floating above the real structure. Breaking it does
  nothing useful. The real structure is behind and below it.
  Punishes first-instinct shots.
  Teaches: don't shoot the flashy thing.
------------------------------------------------------------ */
{
  id: 36, name: "Glass Bait",
  targetPercent: 100,
  blocks: [
    { x: 860, y: 540, w: 100, h: 140, material: "glass", hp: 1 },

    { x: 1000, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1080, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1000, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 524, w: 200, h: 24, material: "glass", hp: 1 },
    { x: 1040, y: 476, w: 120, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 428, w: 100, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  37 — Three Ghost Sequence
  Stone fort (Heavy), soft spread behind (Princess), rear wood
  target (Nightmare). Each zone requires a specific Booha.
  Using wrong Booha on any zone = 3+ shots wasted per mistake.
  Teaches: sequence matters as much as Booha choice.
------------------------------------------------------------ */
{
  id: 37, name: "Three Ghost Sequence",
  targetPercent: 100,
  blocks: [
    { x: 840, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 840, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 840, y: 524, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 620, w: 90, h: 36, material: "soft",  hp: 1 },
    { x: 960, y: 576, w: 90, h: 36, material: "soft",  hp: 1 },
    { x: 960, y: 532, w: 90, h: 36, material: "soft",  hp: 1 },
    { x: 960, y: 488, w: 90, h: 36, material: "soft",  hp: 1 },

    { x: 1080, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 476, w: 80, h: 40, material: "glass", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  38 — Collapse Direction Matters
  Two structures share a thin bridge. Collapse direction
  determines which one the debris hits.
  Left collapse: hits right structure (bonus damage).
  Right collapse: falls away from left (wasted).
  Teaches: momentum and fall direction is a tool.
------------------------------------------------------------ */
{
  id: 38, name: "Collapse Direction",
  targetPercent: 100,
  blocks: [
    { x: 870, y: 620, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 870, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 870, y: 524, w: 80, h: 40, material: "glass", hp: 1 },

    { x: 960, y: 572, w: 180, h: 24, material: "wood", hp: 1 },

    { x: 1050, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1050, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1050, y: 524, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1050, y: 476, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1050, y: 428, w: 120, h: 40, material: "soft", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  39 — Setup Shot Required
  Hidden glass support under a wide stone slab.
  Direct shots on stone slab: nothing happens (hp:2, no fall).
  Must first break the glass underneath → slab crashes down
  onto the wood pile below → chain breaks the wood.
  Teaches: sometimes your first shot must create a condition.
------------------------------------------------------------ */
{
  id: 39, name: "Setup Shot",
  targetPercent: 100,
  blocks: [
    { x: 880, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1040, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 880, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1040, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },

    { x: 960, y: 548, w: 24, h: 56,  material: "glass", hp: 1 },

    { x: 960, y: 508, w: 280, h: 30, material: "stone", hp: 2 },
    { x: 880, y: 460, w: 80, h: 40,  material: "stone", hp: 2 },
    { x: 1040, y: 460, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 412, w: 180, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  40 — Multi-Stack Interaction
  Left stack and right stack are independent.
  Center bridge block connects them.
  Destroying center: both stacks lose support.
  Destroying either stack without center: only that stack falls.
  Teaches: shared infrastructure is the key target.
------------------------------------------------------------ */
{
  id: 40, name: "Multi-Stack Interaction",
  targetPercent: 100,
  blocks: [
    { x: 860, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 860, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 860, y: 524, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 860, y: 476, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 548, w: 200, h: 24, material: "glass", hp: 1 },

    { x: 1060, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1060, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1060, y: 476, w: 80, h: 40, material: "glass", hp: 1 },
  ]
},

/* ============================================================
  ZONE 5 — ILLUSION AND CHAOS (Rounds 41–50)
  Multi-stack systems. Misleading silhouettes. 4+ Booha synergy.
  Hard — requires planning and some luck.
============================================================ */

/* ------------------------------------------------------------
  41 — Three Stack System
  Three stacks. Middle one looks important but is stone (hp:2).
  Left and right are glass-supported and will collapse into
  the middle if you hit the right pillars first.
  Ignore the middle — it gets crushed for free.
  Teaches: let the structure do work for you.
------------------------------------------------------------ */
{
  id: 41, name: "Three Stack System",
  targetPercent: 100,
  blocks: [
    { x: 840, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 840, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 840, y: 500, w: 100, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 572, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 524, w: 80, h: 40, material: "stone", hp: 2 },

    { x: 1080, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 1080, y: 500, w: 100, h: 40, material: "stone", hp: 2 },

    { x: 960, y: 476, w: 300, h: 24, material: "wood",  hp: 1 },
    { x: 960, y: 428, w: 140, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  42 — Asymmetrical Towers
  Left tower: tall and thin (glass-heavy, angle required).
  Right tower: short and wide (stone-heavy, Heavy required).
  Neither supports the other. Both must be cleared.
  Teaches: asymmetry demands different angles per target.
------------------------------------------------------------ */
{
  id: 42, name: "Asymmetrical Towers",
  targetPercent: 100,
  blocks: [
    { x: 860, y: 620, w: 60, h: 40, material: "stone", hp: 2 },
    { x: 860, y: 568, w: 24, h: 104, material: "glass", hp: 1 },
    { x: 860, y: 452, w: 24, h: 104, material: "glass", hp: 1 },
    { x: 860, y: 396, w: 80, h: 40,  material: "wood",  hp: 1 },
    { x: 860, y: 348, w: 80, h: 40,  material: "soft",  hp: 1 },

    { x: 1040, y: 620, w: 160, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 572, w: 160, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 524, w: 160, h: 40, material: "stone", hp: 2 },
    { x: 1040, y: 476, w: 100, h: 40, material: "glass", hp: 1 },
  ]
},

/* ------------------------------------------------------------
  43 — Floating and Grounded Combo
  Grounded structure on right (stone base, easy to hit).
  Floating block cluster above center — only reachable by
  high-arc shot or if the right-side supports are removed first.
  Teaches: not all blocks are reachable at launch — plan order.
------------------------------------------------------------ */
{
  id: 43, name: "Float and Ground",
  targetPercent: 100,
  blocks: [
    { x: 870, y: 620, w: 80, h: 40,  material: "stone", hp: 2 },
    { x: 1050, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 870, y: 556, w: 24, h: 88,  material: "stone", hp: 2 },
    { x: 1050, y: 556, w: 24, h: 88, material: "stone", hp: 2 },
    { x: 960, y: 512, w: 260, h: 24, material: "wood",  hp: 1 },

    { x: 960, y: 460, w: 200, h: 30, material: "glass", hp: 1 },
    { x: 900, y: 422, w: 80, h: 40,  material: "stone", hp: 2 },
    { x: 1020, y: 422, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 374, w: 180, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  44 — Bounce Dependent
  Monster Booha needed. Structure is wide and spread.
  Floor bounces are the only way to hit blocks tucked underneath
  a wide stone overhang. Direct shots hit the overhang (hp:2).
  Monster grows per bounce — by bounce 3 it clears everything.
  Teaches: sometimes the indirect path is the only path.
------------------------------------------------------------ */
{
  id: 44, name: "Bounce Dependent",
  targetPercent: 100,
  blocks: [
    { x: 960, y: 620, w: 380, h: 28, material: "stone", hp: 2 },
    { x: 830, y: 584, w: 60, h: 40,  material: "wood",  hp: 1 },
    { x: 900, y: 584, w: 60, h: 40,  material: "stone", hp: 2 },
    { x: 970, y: 584, w: 60, h: 40,  material: "wood",  hp: 1 },
    { x: 1040, y: 584, w: 60, h: 40, material: "glass", hp: 1 },
    { x: 1110, y: 584, w: 60, h: 40, material: "stone", hp: 2 },
    { x: 965, y: 536, w: 360, h: 24, material: "stone", hp: 2 },
    { x: 965, y: 484, w: 200, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  45 — Precision Only
  Tiny glass blocks are the only weak points. They're buried
  between stone columns with 8px gaps. Wide shots miss.
  Rock Booha's pierce hits them through the gap.
  Any other approach: must crack the stone (expensive).
  Teaches: precision gaps exist. Rock finds them.
------------------------------------------------------------ */
{
  id: 45, name: "Precision Only",
  targetPercent: 100,
  blocks: [
    { x: 870, y: 620, w: 70, h: 200, material: "stone", hp: 2 },
    { x: 1050, y: 620, w: 70, h: 200, material: "stone", hp: 2 },

    { x: 960, y: 620, w: 100, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 564, w: 100, h: 40, material: "glass", hp: 1 },
    { x: 960, y: 508, w: 100, h: 40, material: "wood",  hp: 1 },
    { x: 960, y: 452, w: 100, h: 40, material: "glass", hp: 1 },
    { x: 960, y: 396, w: 100, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  46 — Hidden Trigger Block
  One wood block, buried inside a stone structure.
  Destroying ONLY that block causes the entire top slab to
  collapse inward. It's invisible until you remove the outer
  glass layer. Two-phase operation required.
  Teaches: sometimes the goal is to expose the target first.
------------------------------------------------------------ */
{
  id: 46, name: "Hidden Trigger",
  targetPercent: 100,
  blocks: [
    { x: 900, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1020, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 900, y: 560, w: 24, h: 80, material: "glass",  hp: 1 },
    { x: 1020, y: 560, w: 24, h: 80, material: "glass", hp: 1 },
    { x: 960, y: 560, w: 60, h: 80,  material: "wood",  hp: 1 },
    { x: 960, y: 516, w: 260, h: 30, material: "stone", hp: 2 },
    { x: 900, y: 468, w: 80, h: 40,  material: "stone", hp: 2 },
    { x: 1020, y: 468, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 420, w: 200, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  47 — Delayed Collapse Trap
  Center structure looks clearable directly.
  But hitting the center first causes the two outer pillars
  to lean inward and lock — creating a pinch that holds the
  top slab suspended and unbreakable by normal shots.
  Must clear outer before center, or use Ultimate.
  Teaches: order of operations has physical consequences.
------------------------------------------------------------ */
{
  id: 47, name: "Delayed Trap",
  targetPercent: 100,
  blocks: [
    { x: 850, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 1070, y: 620, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 850, y: 556, w: 24, h: 88, material: "glass",  hp: 1 },
    { x: 1070, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 960, y: 512, w: 320, h: 24, material: "stone", hp: 2 },
    { x: 960, y: 468, w: 100, h: 40, material: "glass", hp: 1 },
    { x: 900, y: 420, w: 80, h: 40,  material: "stone", hp: 2 },
    { x: 1020, y: 420, w: 80, h: 40, material: "stone", hp: 2 },
    { x: 960, y: 372, w: 200, h: 40, material: "soft",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  48 — Full Synergy Level
  Four distinct zones each needing a different Booha.
  Zone A (left): stone wall → Heavy
  Zone B (center-left): soft spread → Princess
  Zone C (center-right): stone rear → Nightmare
  Zone D (top): all-stone cap → Rainbow then Normal
  Using wrong Booha per zone burns 3-4 shots per mistake.
  Teaches: 4-ghost coordination.
------------------------------------------------------------ */
{
  id: 48, name: "Full Synergy",
  targetPercent: 100,
  blocks: [
    { x: 820, y: 620, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 820, y: 572, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 820, y: 524, w: 70, h: 40, material: "stone", hp: 2 },

    { x: 920, y: 620, w: 80, h: 36, material: "soft",  hp: 1 },
    { x: 920, y: 576, w: 80, h: 36, material: "soft",  hp: 1 },
    { x: 920, y: 532, w: 80, h: 36, material: "soft",  hp: 1 },
    { x: 920, y: 488, w: 80, h: 36, material: "soft",  hp: 1 },

    { x: 1030, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1030, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1030, y: 524, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1030, y: 476, w: 80, h: 40, material: "wood",  hp: 1 },

    { x: 960, y: 436, w: 320, h: 24, material: "stone", hp: 2 },
    { x: 960, y: 388, w: 260, h: 40, material: "stone", hp: 2 },
  ]
},

/* ------------------------------------------------------------
  49 — Large Chain Reaction (Domino Design)
  Seven structures in a line, each one's collapse knocks
  into the next. Only the first needs to be hit.
  But the first is stone — needs Heavy. Chain requires patience.
  Teaches: one good Heavy shot can clear the whole board.
------------------------------------------------------------ */
{
  id: 49, name: "Domino Chain",
  targetPercent: 100,
  blocks: [
    { x: 820, y: 620, w: 60, h: 40, material: "stone", hp: 2 },
    { x: 820, y: 548, w: 24, h: 120, material: "stone", hp: 2 },
    { x: 820, y: 500, w: 80, h: 40,  material: "wood",  hp: 1 },

    { x: 900, y: 620, w: 60, h: 40, material: "wood",  hp: 1 },
    { x: 900, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 900, y: 500, w: 80, h: 40, material: "soft",  hp: 1 },

    { x: 980, y: 620, w: 60, h: 40, material: "wood",  hp: 1 },
    { x: 980, y: 548, w: 24, h: 120, material: "wood", hp: 1 },
    { x: 980, y: 500, w: 80, h: 40, material: "glass", hp: 1 },

    { x: 1060, y: 620, w: 60, h: 40, material: "stone", hp: 2 },
    { x: 1060, y: 556, w: 24, h: 88, material: "glass", hp: 1 },
    { x: 1060, y: 500, w: 80, h: 40, material: "soft",  hp: 1 },

    { x: 1140, y: 620, w: 60, h: 40, material: "wood",  hp: 1 },
    { x: 1140, y: 572, w: 60, h: 40, material: "stone", hp: 2 },
    { x: 1140, y: 524, w: 80, h: 40, material: "wood",  hp: 1 },
  ]
},

/* ------------------------------------------------------------
  50 — FINAL: Multi-Stack Illusion Chaos
  Everything from all 49 rounds combined.
  - Stone fortress left (Heavy)
  - Soft cluster center (Princess)
  - Glass-bait decoy front (ignore it)
  - Rear wood target (Nightmare)
  - Top slab (Rainbow → Normal)
  - Domino bridge connecting all of them
  Hard — first attempt is analysis. Second attempt is execution.
------------------------------------------------------------ */
{
  id: 50, name: "BOOHA ENDGAME",
  targetPercent: 100,
  blocks: [
    { x: 820, y: 620, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 820, y: 572, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 820, y: 524, w: 70, h: 40, material: "stone", hp: 2 },
    { x: 820, y: 476, w: 70, h: 40, material: "stone", hp: 2 },

    { x: 920, y: 620, w: 80, h: 36, material: "soft",  hp: 1 },
    { x: 920, y: 576, w: 80, h: 36, material: "soft",  hp: 1 },
    { x: 920, y: 532, w: 80, h: 36, material: "soft",  hp: 1 },

    { x: 960, y: 488, w: 80, h: 80, material: "glass", hp: 1 },

    { x: 1040, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1120, y: 620, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1040, y: 572, w: 80, h: 40, material: "glass", hp: 1 },
    { x: 1120, y: 572, w: 80, h: 40, material: "wood",  hp: 1 },
    { x: 1080, y: 524, w: 200, h: 24, material: "wood", hp: 1 },

    { x: 870, y: 436, w: 420, h: 24, material: "stone", hp: 2 },
    { x: 870, y: 388, w: 340, h: 40, material: "stone", hp: 2 },
    { x: 870, y: 340, w: 200, h: 40, material: "soft",  hp: 1 },
  ]
},

]; // end BOOHA_DESTRUCTION_LEVELS
