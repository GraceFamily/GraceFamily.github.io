import { useState, useMemo } from 'react';

// ============================================================
// QUESTION POOLS — 15 per lesson, 5 selected at random per run
// ============================================================

const TRANSLATIONS_POOL = [
  {
    id: 't1',
    prompt: "The red troupe slides into the blue position. Every dancer moved the same way. Is this a translation?",
    visual: { figure: [[1,1],[3,1],[2,3]], imageFigure: [[4,2],[6,2],[5,4]], range: 7 },
    options: ['Yes — a true slide', 'No — they were turned'],
    correctIndex: 0,
    explanation: "Every dancer moved 3 right and 1 up. Same distance, same direction — that's a translation."
  },
  {
    id: 't2',
    prompt: "Did the red troupe slide into the blue position, or did they spin?",
    visual: { figure: [[1,1],[4,1],[2,3]], imageFigure: [[-1,1],[-1,4],[-3,2]], range: 6 },
    options: ['Yes — a slide', 'No — this is a rotation'],
    correctIndex: 1,
    explanation: "The shape's orientation changed. A translation only slides — it never turns."
  },
  {
    id: 't3',
    prompt: "Apply the rule (x + 3, y − 2) to point P(−1, 4). Where does P land?",
    visual: { figure: [[-1,4]], showSinglePoints: true, range: 6 },
    options: ['(2, 2)', '(−4, 6)', '(2, 6)', '(−4, 2)'],
    correctIndex: 0,
    explanation: "−1 + 3 = 2 and 4 − 2 = 2, so P′ = (2, 2)."
  },
  {
    id: 't4',
    prompt: "Triangle ABC has A(1, 1), B(3, 1), C(2, 3). Translate it 2 right and 1 down. Where is A′?",
    visual: { figure: [[1,1],[3,1],[2,3]], range: 6 },
    options: ["A′(3, 0)", "A′(−1, 2)", "A′(3, 2)", "A′(−1, 0)"],
    correctIndex: 0,
    explanation: "Add 2 to x, subtract 1 from y: (1+2, 1−1) = (3, 0)."
  },
  {
    id: 't5',
    prompt: "Triangle A(−2, −2), B(0, 2), C(3, 0) is translated 1 left and 2 up. Find the image.",
    visual: { figure: [[-2,-2],[0,2],[3,0]], range: 6 },
    options: [
      "A′(−3, 0), B′(−1, 4), C′(2, 2)",
      "A′(−1, −4), B′(1, 0), C′(4, −2)",
      "A′(−3, −4), B′(−1, 0), C′(2, −2)",
      "A′(−1, 0), B′(1, 4), C′(4, 2)"
    ],
    correctIndex: 0,
    explanation: "Subtract 1 from x and add 2 to y: each point shifts left 1 and up 2."
  },
  {
    id: 't6',
    prompt: "A square fountain with corners A(1, −2), B(3, −2), C(3, −4), D(1, −4) is moved 4 left and 6 up. Find the image.",
    visual: { figure: [[1,-2],[3,-2],[3,-4],[1,-4]], range: 7 },
    options: [
      "A′(−3, 4), B′(−1, 4), C′(−1, 2), D′(−3, 2)",
      "A′(5, 4), B′(7, 4), C′(7, 2), D′(5, 2)",
      "A′(−3, −8), B′(−1, −8), C′(−1, −10), D′(−3, −10)",
      "A′(−3, 4), B′(−1, 4), C′(−1, −2), D′(−3, −2)"
    ],
    correctIndex: 0,
    explanation: "(x − 4, y + 6) gives A′(−3, 4), B′(−1, 4), C′(−1, 2), D′(−3, 2)."
  },
  {
    id: 't7',
    prompt: "Dancer A starts at (0, 0) and her image lands at A′(2, 3). Describe the slide.",
    visual: { figure: [[0,0]], imageFigure: [[2,3]], showSinglePoints: true, range: 5 },
    options: ['2 right, 3 up', '2 left, 3 down', '3 right, 2 up', '2 right, 3 down'],
    correctIndex: 0,
    explanation: "Going from (0,0) to (2,3) means +2 in x and +3 in y."
  },
  {
    id: 't8',
    prompt: "A dancer starts at (3, 1) and lands at A′(−1, −2). Describe the translation.",
    visual: { figure: [[3,1]], imageFigure: [[-1,-2]], showSinglePoints: true, range: 5 },
    options: ['4 left, 3 down', '4 right, 3 up', '4 left, 3 up', '2 left, 3 down'],
    correctIndex: 0,
    explanation: "From x = 3 to x = −1 is 4 left. From y = 1 to y = −2 is 3 down."
  },
  {
    id: 't9',
    prompt: "Apply (x + 1, y + 2) to triangle A(1, 3), B(4, 3), C(3, 0).",
    visual: { figure: [[1,3],[4,3],[3,0]], range: 6 },
    options: [
      "A′(2, 5), B′(5, 5), C′(4, 2)",
      "A′(0, 1), B′(3, 1), C′(2, −2)",
      "A′(2, 1), B′(5, 1), C′(4, −2)",
      "A′(0, 5), B′(3, 5), C′(2, 2)"
    ],
    correctIndex: 0,
    explanation: "Add 1 to each x and 2 to each y."
  },
  {
    id: 't10',
    prompt: "A helicopter flies from A(−3, −3) to B(3, 4). Describe the translation.",
    visual: { figure: [[-3,-3]], imageFigure: [[3,4]], showSinglePoints: true, range: 5 },
    options: ['6 right, 7 up', '6 left, 7 down', '7 right, 6 up', '6 right, 7 down'],
    correctIndex: 0,
    explanation: "x changes from −3 to 3 (6 right). y changes from −3 to 4 (7 up)."
  },
  {
    id: 't11',
    prompt: "A wide receiver is at (1, 3). The pass lands at (6, −2). Describe the receiver's path.",
    visual: { figure: [[1,3]], imageFigure: [[6,-2]], showSinglePoints: true, range: 7 },
    options: ['5 right, 5 down', '5 left, 5 up', '7 right, 5 down', '5 right, 1 down'],
    correctIndex: 0,
    explanation: "From x = 1 to x = 6 is 5 right. From y = 3 to y = −2 is 5 down."
  },
  {
    id: 't12',
    prompt: "Translate the point (5, −2) by 3 left and 4 up. Find the image.",
    visual: { figure: [[5,-2]], showSinglePoints: true, range: 6 },
    options: ['(2, 2)', '(8, 2)', '(2, −6)', '(8, −6)'],
    correctIndex: 0,
    explanation: "5 − 3 = 2 and −2 + 4 = 2."
  },
  {
    id: 't13',
    prompt: "House A at (1, −1) moves to A′(3, −4). Where does House B at (1, −2) land using the SAME translation?",
    visual: { figure: [[1,-1],[1,-2]], imageFigure: [[3,-4]], showSinglePoints: true, range: 6 },
    options: ['B′(3, −5)', 'B′(3, −2)', 'B′(−1, 1)', 'B′(2, −5)'],
    correctIndex: 0,
    explanation: "The translation is +2 in x, −3 in y. Applying to B: (1+2, −2−3) = (3, −5)."
  },
  {
    id: 't14',
    prompt: "A point starts at the origin (0, 0) and ends at (−3, 5). Describe the translation.",
    visual: { figure: [[0,0]], imageFigure: [[-3,5]], showSinglePoints: true, range: 6 },
    options: ['3 left, 5 up', '3 right, 5 down', '5 left, 3 up', '3 left, 5 down'],
    correctIndex: 0,
    explanation: "x went from 0 to −3 (3 left). y went from 0 to 5 (5 up)."
  },
  {
    id: 't15',
    prompt: "Did the red figure slide into the blue position?",
    visual: { figure: [[2,1],[2,3],[4,2]], imageFigure: [[-2,1],[-2,3],[-4,2]], range: 6 },
    options: ['Yes — translation', 'No — this is a reflection'],
    correctIndex: 1,
    explanation: "The figure is a mirror image, not a slide. That's a reflection."
  }
];

const REFLECTIONS_POOL = [
  {
    id: 'r1',
    prompt: "Is the blue figure a reflection of the red one?",
    visual: { figure: [[1,1],[3,1],[2,3]], imageFigure: [[1,-1],[3,-1],[2,-3]], range: 5 },
    options: ['Yes — a true mirror', 'No — they slid'],
    correctIndex: 0,
    explanation: "Each point is the same distance below the x-axis as the original is above. That's a reflection."
  },
  {
    id: 'r2',
    prompt: "Is the blue figure a reflection of the red one?",
    visual: { figure: [[1,1],[3,1],[2,3]], imageFigure: [[3,2],[5,2],[4,4]], range: 6 },
    options: ['Yes — a mirror', 'No — they slid'],
    correctIndex: 1,
    explanation: "Same orientation, just shifted right and up. That's a translation, not a reflection."
  },
  {
    id: 'r3',
    prompt: "Reflect P(3, 5) across the x-axis. Where does P land?",
    visual: { figure: [[3,5]], showSinglePoints: true, lines: [{type:'horizontal',value:0,emph:'x'}], range: 6 },
    options: ['(3, −5)', '(−3, 5)', '(−3, −5)', '(5, 3)'],
    correctIndex: 0,
    explanation: "Reflecting in the x-axis flips the sign of y. (3, 5) → (3, −5)."
  },
  {
    id: 'r4',
    prompt: "Reflect P(−2, 4) across the y-axis. Where does P land?",
    visual: { figure: [[-2,4]], showSinglePoints: true, lines: [{type:'vertical',value:0,emph:'y'}], range: 5 },
    options: ['(2, 4)', '(−2, −4)', '(2, −4)', '(4, −2)'],
    correctIndex: 0,
    explanation: "Reflecting in the y-axis flips the sign of x. (−2, 4) → (2, 4)."
  },
  {
    id: 'r5',
    prompt: "Reflect triangle A(1, 1), B(1, 4), C(3, 4) in the x-axis.",
    visual: { figure: [[1,1],[1,4],[3,4]], lines: [{type:'horizontal',value:0,emph:'x'}], range: 5 },
    options: [
      "A′(1, −1), B′(1, −4), C′(3, −4)",
      "A′(−1, 1), B′(−1, 4), C′(−3, 4)",
      "A′(−1, −1), B′(−1, −4), C′(−3, −4)",
      "A′(1, 1), B′(1, 4), C′(3, 4)"
    ],
    correctIndex: 0,
    explanation: "Flip the y of each point. The x-coordinates stay the same."
  },
  {
    id: 'r6',
    prompt: "Reflect triangle A(1, 1), B(1, 4), C(3, 4) in the y-axis.",
    visual: { figure: [[1,1],[1,4],[3,4]], lines: [{type:'vertical',value:0,emph:'y'}], range: 5 },
    options: [
      "A′(−1, 1), B′(−1, 4), C′(−3, 4)",
      "A′(1, −1), B′(1, −4), C′(3, −4)",
      "A′(−1, −1), B′(−1, −4), C′(−3, −4)",
      "A′(1, 1), B′(1, 4), C′(3, 4)"
    ],
    correctIndex: 0,
    explanation: "Flip the x of each point. The y-coordinates stay the same."
  },
  {
    id: 'r7',
    prompt: "Reflect point P(4, 3) across the line y = 1. Where does P land?",
    visual: { figure: [[4,3]], showSinglePoints: true, lines: [{type:'horizontal',value:1}], range: 5 },
    options: ['(4, −1)', '(4, 5)', '(−4, 3)', '(4, 1)'],
    correctIndex: 0,
    explanation: "P is 2 units above y = 1, so the image is 2 units below: y = 1 − 2 = −1."
  },
  {
    id: 'r8',
    prompt: "Reflect point P(5, 2) across the line x = 2. Where does P land?",
    visual: { figure: [[5,2]], showSinglePoints: true, lines: [{type:'vertical',value:2}], range: 6 },
    options: ['(−1, 2)', '(5, −2)', '(−5, 2)', '(2, 2)'],
    correctIndex: 0,
    explanation: "P is 3 units right of x = 2, so the image is 3 units left: x = 2 − 3 = −1."
  },
  {
    id: 'r9',
    prompt: "Reflect rectangle A(−4, −3), B(−4, −1), C(−1, −1), D(−1, −3) in the x-axis.",
    visual: { figure: [[-4,-3],[-4,-1],[-1,-1],[-1,-3]], lines: [{type:'horizontal',value:0,emph:'x'}], range: 5 },
    options: [
      "A′(−4, 3), B′(−4, 1), C′(−1, 1), D′(−1, 3)",
      "A′(4, −3), B′(4, −1), C′(1, −1), D′(1, −3)",
      "A′(4, 3), B′(4, 1), C′(1, 1), D′(1, 3)",
      "A′(−4, −3), B′(−4, −1), C′(−1, −1), D′(−1, −3)"
    ],
    correctIndex: 0,
    explanation: "Take the opposite of each y-coordinate. x-coordinates do not change."
  },
  {
    id: 'r10',
    prompt: "Reflect triangle J(−3, −5), K(−2, 2), L(1, −4) in the y-axis.",
    visual: { figure: [[-3,-5],[-2,2],[1,-4]], lines: [{type:'vertical',value:0,emph:'y'}], range: 6 },
    options: [
      "J′(3, −5), K′(2, 2), L′(−1, −4)",
      "J′(−3, 5), K′(−2, −2), L′(1, 4)",
      "J′(3, 5), K′(2, −2), L′(−1, 4)",
      "J′(−3, −5), K′(−2, 2), L′(1, −4)"
    ],
    correctIndex: 0,
    explanation: "Take the opposite of each x-coordinate. y-coordinates do not change."
  },
  {
    id: 'r11',
    prompt: "Which rule reflects a point (a, b) in the x-axis?",
    visual: null,
    options: ['(a, −b)', '(−a, b)', '(−a, −b)', '(b, a)'],
    correctIndex: 0,
    explanation: "x-axis reflection flips only the y-coordinate."
  },
  {
    id: 'r12',
    prompt: "Reflect triangle A(4, 5), B(4, 8), C(7, 8) in the line y = 3.",
    visual: { figure: [[4,5],[4,8],[7,8]], lines: [{type:'horizontal',value:3}], range: 9 },
    options: [
      "A′(4, 1), B′(4, −2), C′(7, −2)",
      "A′(4, 8), B′(4, 11), C′(7, 11)",
      "A′(2, 5), B′(2, 8), C′(−1, 8)",
      "A′(−4, 5), B′(−4, 8), C′(−7, 8)"
    ],
    correctIndex: 0,
    explanation: "A is 2 above y=3 → A′ at y=1. B and C are 5 above → image at y=−2."
  },
  {
    id: 'r13',
    prompt: "Reflect triangle A(4, 5), B(4, 8), C(7, 8) in the line x = 3.",
    visual: { figure: [[4,5],[4,8],[7,8]], lines: [{type:'vertical',value:3}], range: 9 },
    options: [
      "A′(2, 5), B′(2, 8), C′(−1, 8)",
      "A′(4, 1), B′(4, −2), C′(7, −2)",
      "A′(−4, 5), B′(−4, 8), C′(−7, 8)",
      "A′(2, −5), B′(2, −8), C′(−1, −8)"
    ],
    correctIndex: 0,
    explanation: "A and B are 1 right of x=3 → image at x=2. C is 4 right of x=3 → image at x=−1."
  },
  {
    id: 'r14',
    prompt: "If you reflect the letter E across the y-axis, will it look exactly the same?",
    visual: null,
    options: ['No — it will face the other way', 'Yes — perfectly the same', 'Yes — but upside down', 'No — it disappears'],
    correctIndex: 0,
    explanation: "The letter E opens to the right. After a y-axis reflection, it opens to the left — a mirror image."
  },
  {
    id: 'r15',
    prompt: "Reflect P(−3, −2) across the line y = −1. Where does P land?",
    visual: { figure: [[-3,-2]], showSinglePoints: true, lines: [{type:'horizontal',value:-1}], range: 5 },
    options: ['(−3, 0)', '(−3, −2)', '(3, −2)', '(−3, −4)'],
    correctIndex: 0,
    explanation: "P is 1 unit below y = −1, so the image is 1 unit above at y = 0."
  }
];

const ROTATIONS_POOL = [
  {
    id: 'rt1',
    prompt: "The red dancer pirouetted to the blue position around the origin. What rotation is it?",
    visual: { figure: [[2,1],[4,1],[3,3]], imageFigure: [[-1,2],[-1,4],[-3,3]], range: 6, showCenter: true },
    options: ['90° counterclockwise', '90° clockwise', '180°', '270° counterclockwise'],
    correctIndex: 0,
    explanation: "Each (x, y) became (−y, x). For example (2, 1) → (−1, 2). That's 90° CCW."
  },
  {
    id: 'rt2',
    prompt: "Is the blue figure a rotation of the red figure about the origin?",
    visual: { figure: [[1,1],[1,4],[3,4]], imageFigure: [[-1,1],[-1,4],[-3,4]], range: 5, showCenter: true },
    options: ['No — this is a reflection', 'Yes — 90° CCW', 'Yes — 180°', 'Yes — 90° CW'],
    correctIndex: 0,
    explanation: "The figure is mirrored across the y-axis, not rotated."
  },
  {
    id: 'rt3',
    prompt: "Rotate point P(3, 4) 90° counterclockwise about the origin. Where does P land?",
    visual: { figure: [[3,4]], showSinglePoints: true, range: 6, showCenter: true },
    options: ['(−4, 3)', '(4, −3)', '(−3, −4)', '(3, 4)'],
    correctIndex: 0,
    explanation: "Rule: (x, y) → (−y, x). So (3, 4) → (−4, 3)."
  },
  {
    id: 'rt4',
    prompt: "Rotate point P(3, 4) 180° about the origin. Where does P land?",
    visual: { figure: [[3,4]], showSinglePoints: true, range: 6, showCenter: true },
    options: ['(−3, −4)', '(−4, 3)', '(4, −3)', '(3, 4)'],
    correctIndex: 0,
    explanation: "Rule: (x, y) → (−x, −y). Both signs flip."
  },
  {
    id: 'rt5',
    prompt: "Rotate point P(3, 4) 270° counterclockwise about the origin. Where does P land?",
    visual: { figure: [[3,4]], showSinglePoints: true, range: 6, showCenter: true },
    options: ['(4, −3)', '(−4, 3)', '(−3, −4)', '(3, 4)'],
    correctIndex: 0,
    explanation: "Rule: (x, y) → (y, −x). So (3, 4) → (4, −3)."
  },
  {
    id: 'rt6',
    prompt: "Rotate point P(3, 4) 360° about the origin. Where does P land?",
    visual: { figure: [[3,4]], showSinglePoints: true, range: 6, showCenter: true },
    options: ['(3, 4)', '(−3, −4)', '(−4, 3)', '(4, −3)'],
    correctIndex: 0,
    explanation: "A full turn brings every point back to its original spot."
  },
  {
    id: 'rt7',
    prompt: "Rotate triangle A(1, 2), B(3, 5), C(4, 1) 180° about the origin.",
    visual: { figure: [[1,2],[3,5],[4,1]], range: 6, showCenter: true },
    options: [
      "A′(−1, −2), B′(−3, −5), C′(−4, −1)",
      "A′(−2, 1), B′(−5, 3), C′(−1, 4)",
      "A′(2, −1), B′(5, −3), C′(1, −4)",
      "A′(1, 2), B′(3, 5), C′(4, 1)"
    ],
    correctIndex: 0,
    explanation: "180° rule: (x, y) → (−x, −y). Flip both signs."
  },
  {
    id: 'rt8',
    prompt: "Trapezoid W(−4, 2), X(−3, 4), Y(−1, 4), Z(−1, 2) is rotated 180° about the origin. Find the image.",
    visual: { figure: [[-4,2],[-3,4],[-1,4],[-1,2]], range: 6, showCenter: true },
    options: [
      "W′(4, −2), X′(3, −4), Y′(1, −4), Z′(1, −2)",
      "W′(2, 4), X′(4, 3), Y′(4, 1), Z′(2, 1)",
      "W′(−4, −2), X′(−3, −4), Y′(−1, −4), Z′(−1, −2)",
      "W′(4, 2), X′(3, 4), Y′(1, 4), Z′(1, 2)"
    ],
    correctIndex: 0,
    explanation: "180° about the origin flips both signs of every coordinate."
  },
  {
    id: 'rt9',
    prompt: "A 90° clockwise rotation about the origin is the same as which counterclockwise rotation?",
    visual: null,
    options: ['270° CCW', '90° CCW', '180°', '360° CCW'],
    correctIndex: 0,
    explanation: "360 − 90 = 270. So clockwise n° = counterclockwise (360 − n)°."
  },
  {
    id: 'rt10',
    prompt: "A 270° clockwise rotation about the origin is the same as which counterclockwise rotation?",
    visual: null,
    options: ['90° CCW', '270° CCW', '180°', '360° CCW'],
    correctIndex: 0,
    explanation: "360 − 270 = 90."
  },
  {
    id: 'rt11',
    prompt: "Rotate triangle A(5, 3), B(4, −1), C(1, −1) 90° clockwise about the origin.",
    visual: { figure: [[5,3],[4,-1],[1,-1]], range: 6, showCenter: true },
    options: [
      "A′(3, −5), B′(−1, −4), C′(−1, −1)",
      "A′(−3, 5), B′(1, 4), C′(1, 1)",
      "A′(−5, −3), B′(−4, 1), C′(−1, 1)",
      "A′(5, 3), B′(4, −1), C′(1, −1)"
    ],
    correctIndex: 0,
    explanation: "90° CW = 270° CCW. Rule: (x, y) → (y, −x)."
  },
  {
    id: 'rt12',
    prompt: "Rotate point P(−2, 5) 90° counterclockwise about the origin. Where does P land?",
    visual: { figure: [[-2,5]], showSinglePoints: true, range: 6, showCenter: true },
    options: ['(−5, −2)', '(5, −2)', '(−5, 2)', '(2, −5)'],
    correctIndex: 0,
    explanation: "Rule (x, y) → (−y, x). (−2, 5) → (−5, −2)."
  },
  {
    id: 'rt13',
    prompt: "Rotate rectangle A(−3, −3), B(1, −3), C(1, −5), D(−3, −5) 90° clockwise about the origin.",
    visual: { figure: [[-3,-3],[1,-3],[1,-5],[-3,-5]], range: 6, showCenter: true },
    options: [
      "A′(−3, 3), B′(−3, −1), C′(−5, −1), D′(−5, 3)",
      "A′(3, −3), B′(−3, −1), C′(−5, 1), D′(5, 3)",
      "A′(3, 3), B′(3, −1), C′(5, −1), D′(5, 3)",
      "A′(−3, −3), B′(1, −3), C′(1, −5), D′(−3, −5)"
    ],
    correctIndex: 0,
    explanation: "90° CW = 270° CCW. Rule (x, y) → (y, −x). For example (−3, −3) → (−3, 3)."
  },
  {
    id: 'rt14',
    prompt: "Carousel: friends at A(−4, −4), B(−3, 0), C(−1, −2), D(−2, −3) rotate 270° clockwise. Where do they end up?",
    visual: { figure: [[-4,-4],[-3,0],[-1,-2],[-2,-3]], range: 6, showCenter: true },
    options: [
      "A′(4, −4), B′(0, −3), C′(2, −1), D′(3, −2)",
      "A′(−4, 4), B′(0, 3), C′(−2, 1), D′(−3, 2)",
      "A′(4, 4), B′(0, −3), C′(2, 1), D′(3, 2)",
      "A′(−4, −4), B′(−3, 0), C′(−1, −2), D′(−2, −3)"
    ],
    correctIndex: 0,
    explanation: "270° CW = 90° CCW. Rule (x, y) → (−y, x). For example (−4, −4) → (4, −4)."
  },
  {
    id: 'rt15',
    prompt: "Rotate triangle L(3, 2), M(1, 1), N(1, 5) 90° counterclockwise about the origin.",
    visual: { figure: [[3,2],[1,1],[1,5]], range: 6, showCenter: true },
    options: [
      "L′(−2, 3), M′(−1, 1), N′(−5, 1)",
      "L′(2, −3), M′(1, −1), N′(5, −1)",
      "L′(−3, −2), M′(−1, −1), N′(−1, −5)",
      "L′(3, 2), M′(1, 1), N′(1, 5)"
    ],
    correctIndex: 0,
    explanation: "Rule (x, y) → (−y, x). For example (3, 2) → (−2, 3)."
  }
];

// ============================================================
// PLAYBOOK CONTENT
// ============================================================

const PLAYBOOKS = {
  1: {
    title: "The Slide",
    subtitle: "Quest 1 — Translations",
    intro: "A translation is a slide. Every dancer takes the same step in the same direction — no turning, no flipping.",
    recipe: {
      formula: "(x, y) → (x + a, y + b)",
      notes: [
        "a is how far you slide horizontally — positive is right, negative is left.",
        "b is how far you slide vertically — positive is up, negative is down.",
        "Apply the same a and b to every vertex of the figure."
      ]
    },
    examples: [
      {
        title: "Slide a triangle",
        body: "Triangle A(1, 1), B(3, 1), C(2, 3) is translated 2 right and 1 down.",
        steps: [
          "Add 2 to each x and subtract 1 from each y.",
          "A(1, 1) → A′(3, 0)",
          "B(3, 1) → B′(5, 0)",
          "C(2, 3) → C′(4, 2)"
        ]
      },
      {
        title: "Working backward",
        body: "If A(0, 0) lands at A′(−3, 5), what's the translation?",
        steps: [
          "x went from 0 to −3 → 3 left",
          "y went from 0 to 5 → 5 up",
          "Translation: 3 left, 5 up — or (x − 3, y + 5)."
        ]
      }
    ],
    pitfall: "Don't translate just one vertex. Every dancer takes the same step."
  },
  2: {
    title: "The Mirror",
    subtitle: "Quest 2 — Reflections",
    intro: "A reflection is a flip across a line. The image is a mirror image — same shape, opposite-facing.",
    recipe: {
      formula: "x-axis: (x, y) → (x, −y)    ·    y-axis: (x, y) → (−x, y)",
      notes: [
        "Reflecting in the x-axis flips the y-coordinate. x stays the same.",
        "Reflecting in the y-axis flips the x-coordinate. y stays the same.",
        "For other lines (like y = 2 or x = −1): each point's image is the same distance from the line, on the opposite side."
      ]
    },
    examples: [
      {
        title: "Reflect across the y-axis",
        body: "Triangle A(1, 1), B(1, 4), C(3, 4) reflected in the y-axis.",
        steps: [
          "Flip the sign of each x. y stays the same.",
          "A(1, 1) → A′(−1, 1)",
          "B(1, 4) → B′(−1, 4)",
          "C(3, 4) → C′(−3, 4)"
        ]
      },
      {
        title: "Reflect across y = 1",
        body: "Reflect P(4, 3) across the line y = 1.",
        steps: [
          "P is 2 units above the line y = 1.",
          "The image must be 2 units below: y = 1 − 2 = −1.",
          "x stays the same, so P′(4, −1)."
        ]
      }
    ],
    pitfall: "Only flip the coordinate that crosses the line. Reflecting in the x-axis? Don't touch the x."
  },
  3: {
    title: "The Pirouette",
    subtitle: "Quest 3 — Rotations",
    intro: "A rotation is a turn around a fixed point — the center of rotation. Here we'll always rotate around the origin.",
    recipe: {
      formula: "90°: (x, y) → (−y, x)    ·    180°: (x, y) → (−x, −y)    ·    270°: (x, y) → (y, −x)    ·    360°: (x, y) → (x, y)",
      notes: [
        "These rules are for counterclockwise (CCW) rotations about the origin.",
        "For clockwise rotations, convert: clockwise n° = counterclockwise (360 − n)°.",
        "So 90° clockwise = 270° counterclockwise. And 270° clockwise = 90° counterclockwise."
      ]
    },
    examples: [
      {
        title: "90° counterclockwise",
        body: "Rotate P(3, 4) 90° counterclockwise about the origin.",
        steps: [
          "Rule: (x, y) → (−y, x).",
          "(3, 4) → (−4, 3)."
        ]
      },
      {
        title: "90° clockwise",
        body: "Rotate P(2, 5) 90° clockwise about the origin.",
        steps: [
          "90° CW = 270° CCW. Use the rule (x, y) → (y, −x).",
          "(2, 5) → (5, −2)."
        ]
      }
    ],
    pitfall: "Always check the direction. Clockwise and counterclockwise look opposite — get it wrong and your answer flips."
  }
};

// ============================================================
// COORDINATE PLANE COMPONENT
// ============================================================

function CoordinatePlane({ visual, size = 280 }) {
  if (!visual) {
    return (
      <div className="flex items-center justify-center rounded-lg" style={{ width: size, height: size, background: 'linear-gradient(135deg, #1a0f1f 0%, #2d1b3d 100%)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <div className="text-center" style={{ color: 'rgba(249, 245, 231, 0.5)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
          <div className="text-lg">No stage diagram</div>
          <div className="text-xs mt-1">Pure rule question</div>
        </div>
      </div>
    );
  }

  const range = visual.range || 6;
  const padding = 22;
  const innerSize = size - 2 * padding;
  const unit = innerSize / (2 * range);
  const cx = size / 2;
  const cy = size / 2;
  const toX = (x) => cx + x * unit;
  const toY = (y) => cy - y * unit;

  const gridLines = [];
  for (let i = -range; i <= range; i++) {
    if (i === 0) continue;
    gridLines.push(
      <line key={`v${i}`} x1={toX(i)} y1={padding} x2={toX(i)} y2={size - padding} stroke="rgba(212, 175, 55, 0.1)" strokeWidth="0.5" />
    );
    gridLines.push(
      <line key={`h${i}`} x1={padding} y1={toY(i)} x2={size - padding} y2={toY(i)} stroke="rgba(212, 175, 55, 0.1)" strokeWidth="0.5" />
    );
  }

  const labelStep = range <= 5 ? 1 : range <= 7 ? 2 : 2;
  const axisLabels = [];
  for (let i = -range; i <= range; i++) {
    if (i === 0 || i % labelStep !== 0) continue;
    axisLabels.push(
      <text key={`xl${i}`} x={toX(i)} y={cy + 13} fontSize="9" fill="rgba(249, 245, 231, 0.55)" textAnchor="middle">{i}</text>
    );
    axisLabels.push(
      <text key={`yl${i}`} x={cx - 6} y={toY(i) + 3} fontSize="9" fill="rgba(249, 245, 231, 0.55)" textAnchor="end">{i}</text>
    );
  }

  const renderLine = (line, idx) => {
    const color = "#10b981";
    if (line.type === 'horizontal') {
      return (
        <g key={`line${idx}`}>
          <line x1={padding} y1={toY(line.value)} x2={size - padding} y2={toY(line.value)} stroke={color} strokeWidth="1.8" strokeDasharray="5 3" opacity="0.85" />
          <text x={size - padding - 4} y={toY(line.value) - 4} fontSize="10" fill={color} textAnchor="end" fontStyle="italic" fontWeight="600">y = {line.value}</text>
        </g>
      );
    }
    if (line.type === 'vertical') {
      return (
        <g key={`line${idx}`}>
          <line x1={toX(line.value)} y1={padding} x2={toX(line.value)} y2={size - padding} stroke={color} strokeWidth="1.8" strokeDasharray="5 3" opacity="0.85" />
          <text x={toX(line.value) + 4} y={padding + 12} fontSize="10" fill={color} fontStyle="italic" fontWeight="600">x = {line.value}</text>
        </g>
      );
    }
    return null;
  };

  const renderFigure = (pts, color, fillColor, isImage) => {
    if (!pts || pts.length === 0) return null;
    const isPoints = visual.showSinglePoints || pts.length === 1;
    if (isPoints) {
      return (
        <g>
          {pts.map((p, i) => (
            <g key={`${isImage ? 'i' : 'o'}p${i}`}>
              <circle cx={toX(p[0])} cy={toY(p[1])} r="5" fill={color} stroke="#fff" strokeWidth="1.2" />
              <text x={toX(p[0]) + 8} y={toY(p[1]) - 6} fontSize="10" fill={color} fontWeight="700">
                ({p[0]}, {p[1]})
              </text>
            </g>
          ))}
        </g>
      );
    }
    return (
      <g>
        <polygon
          points={pts.map(p => `${toX(p[0])},${toY(p[1])}`).join(' ')}
          fill={fillColor}
          stroke={color}
          strokeWidth="2"
        />
        {pts.map((p, i) => (
          <circle key={`${isImage ? 'i' : 'o'}c${i}`} cx={toX(p[0])} cy={toY(p[1])} r="3" fill={color} />
        ))}
      </g>
    );
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg" style={{ background: 'linear-gradient(135deg, #1a0f1f 0%, #2d1b3d 100%)', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
      {gridLines}
      <line x1={padding} y1={cy} x2={size - padding} y2={cy} stroke="rgba(249, 245, 231, 0.45)" strokeWidth="1" />
      <line x1={cx} y1={padding} x2={cx} y2={size - padding} stroke="rgba(249, 245, 231, 0.45)" strokeWidth="1" />
      {axisLabels}
      <text x={size - padding} y={cy - 4} fontSize="11" fill="rgba(249, 245, 231, 0.7)" textAnchor="end" fontStyle="italic">x</text>
      <text x={cx + 5} y={padding + 9} fontSize="11" fill="rgba(249, 245, 231, 0.7)" fontStyle="italic">y</text>

      {visual.lines && visual.lines.map(renderLine)}

      {visual.showCenter && (
        <g>
          <circle cx={cx} cy={cy} r="4" fill="#d4af37" />
          <circle cx={cx} cy={cy} r="7" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.5" />
        </g>
      )}

      {renderFigure(visual.figure, '#ef4444', 'rgba(239, 68, 68, 0.22)', false)}
      {renderFigure(visual.imageFigure, '#3b82f6', 'rgba(59, 130, 246, 0.22)', true)}
    </svg>
  );
}

// ============================================================
// SHARED STYLES & LAYOUT HELPERS
// ============================================================

const fontStack = `'Cormorant Garamond', Georgia, serif`;
const bodyFont = `'Lora', Georgia, serif`;

function StageBackdrop({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #2d1b3d 0%, #1a0f1f 60%, #0f0815 100%)', fontFamily: bodyFont, color: '#f9f5e7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lora:wght@400;500;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        .shimmer { animation: shimmer 2.5s ease-in-out infinite; }
        .gold-glow { box-shadow: 0 0 0 1px rgba(212, 175, 55, 0.3), 0 4px 20px rgba(212, 175, 55, 0.1); }
        .quest-card:hover { transform: translateY(-2px); transition: all 0.25s ease; }
        .quest-card { transition: all 0.25s ease; }
        button:focus { outline: none; }
      `}</style>
      <div className="max-w-5xl mx-auto px-5 py-10">
        {children}
      </div>
    </div>
  );
}

function Header({ small = false }) {
  return (
    <div className="text-center mb-8">
      <div style={{ fontFamily: fontStack, letterSpacing: '0.4em', fontSize: '0.7rem', color: '#d4af37', marginBottom: '0.5rem' }}>
        — A MATHEMATICAL CONSERVATORY —
      </div>
      <h1 style={{ fontFamily: fontStack, fontSize: small ? '2.2rem' : '3.2rem', fontWeight: 600, letterSpacing: '0.02em', lineHeight: 1, color: '#f9f5e7' }}>
        Choreography <span style={{ fontStyle: 'italic', color: '#d4af37' }}>Academy</span>
      </h1>
      {!small && (
        <div style={{ fontFamily: fontStack, fontStyle: 'italic', fontSize: '1.05rem', color: 'rgba(249, 245, 231, 0.7)', marginTop: '0.5rem' }}>
          Master the moves of geometric transformation
        </div>
      )}
    </div>
  );
}

function GoldButton({ children, onClick, disabled, variant = 'primary', size = 'md' }) {
  const sizeStyles = size === 'sm' ? { padding: '0.4rem 1rem', fontSize: '0.85rem' } : { padding: '0.65rem 1.4rem', fontSize: '0.95rem' };
  const baseStyle = {
    fontFamily: fontStack,
    letterSpacing: '0.08em',
    fontWeight: 600,
    borderRadius: '2px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.2s ease',
    ...sizeStyles
  };
  if (variant === 'primary') {
    return (
      <button onClick={onClick} disabled={disabled} style={{ ...baseStyle, background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)', color: '#1a0f1f', border: 'none' }}>
        {children}
      </button>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...baseStyle, background: 'transparent', color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.5)' }}>
      {children}
    </button>
  );
}

// ============================================================
// HOME SCREEN
// ============================================================

function HomeScreen({ completed, onSelectQuest, onSelectFinale }) {
  const allDone = completed[1] && completed[2] && completed[3];
  const quests = [
    { id: 1, name: 'The Slide', sub: 'Translations', desc: 'Move every dancer the same way across the stage.', complete: completed[1] },
    { id: 2, name: 'The Mirror', sub: 'Reflections', desc: 'Every figure has a partner on the other side of the line.', complete: completed[2] },
    { id: 3, name: 'The Pirouette', sub: 'Rotations', desc: 'Turn the whole troupe around a center point.', complete: completed[3] }
  ];
  return (
    <div className="fade-in">
      <Header />
      <div className="grid gap-4 md:grid-cols-3 mt-10">
        {quests.map(q => (
          <div key={q.id} className="quest-card" style={{ background: 'rgba(20, 12, 28, 0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '4px', padding: '1.5rem', position: 'relative' }}>
            <div style={{ fontFamily: fontStack, fontSize: '0.7rem', letterSpacing: '0.3em', color: '#d4af37', marginBottom: '0.5rem' }}>
              QUEST {q.id}{q.complete && <span style={{ float: 'right', fontSize: '0.7rem' }}>★ COMPLETE</span>}
            </div>
            <div style={{ fontFamily: fontStack, fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.2rem' }}>{q.name}</div>
            <div style={{ fontStyle: 'italic', color: 'rgba(249, 245, 231, 0.7)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>{q.sub}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(249, 245, 231, 0.75)', marginBottom: '1.2rem', lineHeight: 1.5 }}>{q.desc}</div>
            <div className="flex gap-2 flex-wrap">
              <GoldButton onClick={() => onSelectQuest(q.id, 'playbook')} variant="secondary" size="sm">Playbook</GoldButton>
              <GoldButton onClick={() => onSelectQuest(q.id, 'audition')} size="sm">Audition</GoldButton>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8" style={{ background: allDone ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))' : 'rgba(20, 12, 28, 0.5)', border: `1px solid ${allDone ? 'rgba(212, 175, 55, 0.5)' : 'rgba(249, 245, 231, 0.1)'}`, borderRadius: '4px', padding: '1.8rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontFamily: fontStack, fontSize: '0.7rem', letterSpacing: '0.4em', color: allDone ? '#d4af37' : 'rgba(249, 245, 231, 0.4)', marginBottom: '0.5rem' }}>
          — FINAL SHOWCASE —
        </div>
        <div style={{ fontFamily: fontStack, fontSize: '1.8rem', fontWeight: 600, color: allDone ? '#f9f5e7' : 'rgba(249, 245, 231, 0.4)' }}>
          The Mixed Review
        </div>
        <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: allDone ? 'rgba(249, 245, 231, 0.7)' : 'rgba(249, 245, 231, 0.35)', marginTop: '0.3rem', marginBottom: '1rem' }}>
          {allDone ? 'All three transformations, mixed and shuffled — 8 questions.' : 'Complete all three quests to unlock.'}
        </div>
        <GoldButton onClick={onSelectFinale} disabled={!allDone}>
          {allDone ? 'Take the Stage' : 'Locked'}
        </GoldButton>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(249, 245, 231, 0.4)', fontSize: '0.8rem', fontStyle: 'italic' }}>
        Each audition draws 5 random questions from a pool of 15. Replay to see different ones.
      </div>
    </div>
  );
}

// ============================================================
// PLAYBOOK SCREEN
// ============================================================

function PlaybookScreen({ questId, onStart, onBack }) {
  const pb = PLAYBOOKS[questId];
  return (
    <div className="fade-in">
      <Header small />
      <div className="mt-6" style={{ background: 'rgba(20, 12, 28, 0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '4px', padding: '2rem' }}>
        <div style={{ fontFamily: fontStack, fontSize: '0.7rem', letterSpacing: '0.3em', color: '#d4af37', marginBottom: '0.4rem' }}>
          {pb.subtitle.toUpperCase()} — COACH'S PLAYBOOK
        </div>
        <h2 style={{ fontFamily: fontStack, fontSize: '2.4rem', fontWeight: 600, marginBottom: '0.5rem' }}>{pb.title}</h2>
        <p style={{ fontStyle: 'italic', color: 'rgba(249, 245, 231, 0.8)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>{pb.intro}</p>

        <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '3px', padding: '1.2rem', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: fontStack, fontSize: '0.75rem', letterSpacing: '0.25em', color: '#d4af37', marginBottom: '0.5rem' }}>THE RECIPE</div>
          <div style={{ fontFamily: 'Lora, monospace', fontSize: '1.05rem', color: '#f9f5e7', marginBottom: '0.8rem', fontWeight: 600 }}>{pb.recipe.formula}</div>
          <ul style={{ fontSize: '0.9rem', color: 'rgba(249, 245, 231, 0.8)', paddingLeft: '1.2rem' }}>
            {pb.recipe.notes.map((n, i) => <li key={i} style={{ marginBottom: '0.3rem' }}>{n}</li>)}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {pb.examples.map((ex, i) => (
            <div key={i} style={{ background: 'rgba(15, 8, 21, 0.8)', border: '1px solid rgba(249, 245, 231, 0.1)', borderRadius: '3px', padding: '1rem' }}>
              <div style={{ fontFamily: fontStack, fontSize: '0.75rem', letterSpacing: '0.2em', color: '#d4af37' }}>EXAMPLE {i + 1}</div>
              <div style={{ fontFamily: fontStack, fontSize: '1.15rem', fontWeight: 600, margin: '0.3rem 0' }}>{ex.title}</div>
              <div style={{ fontSize: '0.88rem', color: 'rgba(249, 245, 231, 0.75)', marginBottom: '0.6rem', fontStyle: 'italic' }}>{ex.body}</div>
              <ol style={{ fontSize: '0.85rem', color: 'rgba(249, 245, 231, 0.85)', paddingLeft: '1.2rem' }}>
                {ex.steps.map((s, j) => <li key={j} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
              </ol>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.4)', borderRadius: '3px', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: fontStack, fontSize: '0.75rem', letterSpacing: '0.2em', color: '#ef4444', marginBottom: '0.3rem' }}>COMMON MISSTEP</div>
          <div style={{ fontSize: '0.9rem' }}>{pb.pitfall}</div>
        </div>

        <div className="flex gap-3 justify-end">
          <GoldButton onClick={onBack} variant="secondary">Back to Academy</GoldButton>
          <GoldButton onClick={onStart}>Begin Audition</GoldButton>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AUDITION (QUIZ) SCREEN
// ============================================================

function AuditionScreen({ quiz, questLabel, onAnswer, onNext, onFinish }) {
  const q = quiz.questions[quiz.currentIndex];
  const answered = quiz.userAnswers.length > quiz.currentIndex;
  const lastAnswer = answered ? quiz.userAnswers[quiz.currentIndex] : null;
  const isLast = quiz.currentIndex === quiz.questions.length - 1;

  return (
    <div className="fade-in">
      <Header small />
      <div className="mt-4 mb-3 flex items-center justify-between">
        <div style={{ fontFamily: fontStack, fontSize: '0.75rem', letterSpacing: '0.3em', color: '#d4af37' }}>
          {questLabel.toUpperCase()} — AUDITION
        </div>
        <div style={{ fontFamily: fontStack, fontSize: '0.9rem', color: 'rgba(249, 245, 231, 0.7)' }}>
          Question {quiz.currentIndex + 1} of {quiz.questions.length}
        </div>
      </div>

      <div style={{ height: '4px', background: 'rgba(249, 245, 231, 0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ height: '100%', width: `${((quiz.currentIndex + (answered ? 1 : 0)) / quiz.questions.length) * 100}%`, background: 'linear-gradient(90deg, #d4af37, #f4d03f)', transition: 'width 0.4s ease' }} />
      </div>

      <div style={{ background: 'rgba(20, 12, 28, 0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '4px', padding: '1.8rem' }}>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.55, marginBottom: '1.2rem' }}>{q.prompt}</p>
            <div className="space-y-2.5">
              {q.options.map((opt, i) => {
                let bg = 'rgba(15, 8, 21, 0.8)';
                let border = 'rgba(249, 245, 231, 0.15)';
                let textColor = '#f9f5e7';
                if (answered) {
                  if (i === q.correctIndex) {
                    bg = 'rgba(16, 185, 129, 0.18)';
                    border = '#10b981';
                  } else if (i === lastAnswer && lastAnswer !== q.correctIndex) {
                    bg = 'rgba(220, 38, 38, 0.18)';
                    border = '#ef4444';
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => !answered && onAnswer(i)}
                    disabled={answered}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      background: bg,
                      border: `1px solid ${border}`,
                      color: textColor,
                      fontFamily: bodyFont,
                      fontSize: '0.95rem',
                      borderRadius: '3px',
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { if (!answered) e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)'; }}
                    onMouseLeave={e => { if (!answered) e.currentTarget.style.borderColor = 'rgba(249, 245, 231, 0.15)'; }}
                  >
                    <span style={{ fontFamily: fontStack, color: '#d4af37', fontWeight: 600, marginRight: '0.6rem' }}>{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="fade-in mt-4" style={{ background: lastAnswer === q.correctIndex ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', border: `1px solid ${lastAnswer === q.correctIndex ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`, padding: '0.9rem', borderRadius: '3px' }}>
                <div style={{ fontFamily: fontStack, fontSize: '0.75rem', letterSpacing: '0.2em', color: lastAnswer === q.correctIndex ? '#10b981' : '#f59e0b', marginBottom: '0.3rem', fontWeight: 700 }}>
                  {lastAnswer === q.correctIndex ? 'BRAVO' : 'NOT QUITE'}
                </div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{q.explanation}</div>
              </div>
            )}
          </div>

          <div className="flex justify-center md:justify-end">
            <CoordinatePlane visual={q.visual} />
          </div>
        </div>

        {answered && (
          <div className="mt-5 flex justify-end">
            {isLast ? (
              <GoldButton onClick={onFinish}>See Results</GoldButton>
            ) : (
              <GoldButton onClick={onNext}>Next Question</GoldButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// RESULTS SCREEN
// ============================================================

function ResultsScreen({ score, total, questLabel, onRetry, onHome }) {
  const stars = score === total ? 3 : score >= total - 1 ? 2 : score >= Math.ceil(total / 2) ? 1 : 0;
  const message = stars === 3 ? "Standing ovation. Flawless." : stars === 2 ? "A polished performance." : stars === 1 ? "A respectable showing — but the stage demands more." : "The stage is patient. Try again.";

  return (
    <div className="fade-in">
      <Header small />
      <div className="mt-8" style={{ background: 'rgba(20, 12, 28, 0.7)', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: '4px', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ fontFamily: fontStack, fontSize: '0.75rem', letterSpacing: '0.4em', color: '#d4af37', marginBottom: '0.8rem' }}>
          {questLabel.toUpperCase()} — CURTAIN CALL
        </div>
        <div style={{ fontSize: '4rem', letterSpacing: '0.3em', color: '#d4af37', marginBottom: '0.5rem' }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ opacity: i < stars ? 1 : 0.15 }}>★</span>
          ))}
        </div>
        <div style={{ fontFamily: fontStack, fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.2rem' }}>
          {score} <span style={{ color: 'rgba(249, 245, 231, 0.4)', fontSize: '1.5rem' }}>/ {total}</span>
        </div>
        <div style={{ fontStyle: 'italic', fontSize: '1rem', color: 'rgba(249, 245, 231, 0.7)', marginBottom: '1.8rem' }}>{message}</div>
        <div className="flex gap-3 justify-center flex-wrap">
          <GoldButton onClick={onRetry} variant="secondary">Retry Quest</GoldButton>
          <GoldButton onClick={onHome}>Back to Academy</GoldButton>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

const QUEST_LABELS = {
  1: 'The Slide',
  2: 'The Mirror',
  3: 'The Pirouette',
  finale: 'Final Showcase'
};

const POOLS = {
  1: TRANSLATIONS_POOL,
  2: REFLECTIONS_POOL,
  3: ROTATIONS_POOL
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ChoreographyAcademy() {
  const [screen, setScreen] = useState('home'); // 'home' | 'playbook' | 'audition' | 'results'
  const [activeQuest, setActiveQuest] = useState(null); // 1, 2, 3, or 'finale'
  const [completed, setCompleted] = useState({ 1: false, 2: false, 3: false });
  const [quiz, setQuiz] = useState(null); // { questions, currentIndex, score, userAnswers }

  const startQuest = (questId, screenType) => {
    setActiveQuest(questId);
    if (screenType === 'audition') {
      const pool = POOLS[questId];
      const selected = shuffle(pool).slice(0, 5);
      setQuiz({ questions: selected, currentIndex: 0, score: 0, userAnswers: [] });
      setScreen('audition');
    } else {
      setScreen('playbook');
    }
  };

  const startFinale = () => {
    setActiveQuest('finale');
    const allQuestions = [...TRANSLATIONS_POOL, ...REFLECTIONS_POOL, ...ROTATIONS_POOL];
    const selected = shuffle(allQuestions).slice(0, 8);
    setQuiz({ questions: selected, currentIndex: 0, score: 0, userAnswers: [] });
    setScreen('audition');
  };

  const handleAnswer = (idx) => {
    const q = quiz.questions[quiz.currentIndex];
    const newAnswers = [...quiz.userAnswers, idx];
    const newScore = quiz.score + (idx === q.correctIndex ? 1 : 0);
    setQuiz({ ...quiz, userAnswers: newAnswers, score: newScore });
  };

  const handleNext = () => {
    setQuiz({ ...quiz, currentIndex: quiz.currentIndex + 1 });
  };

  const handleFinish = () => {
    if (activeQuest !== 'finale' && quiz.score >= 3) {
      setCompleted(c => ({ ...c, [activeQuest]: true }));
    }
    setScreen('results');
  };

  const handleRetry = () => {
    if (activeQuest === 'finale') {
      startFinale();
    } else {
      startQuest(activeQuest, 'audition');
    }
  };

  const handleHome = () => {
    setScreen('home');
    setActiveQuest(null);
    setQuiz(null);
  };

  if (screen === 'home') {
    return (
      <StageBackdrop>
        <HomeScreen completed={completed} onSelectQuest={startQuest} onSelectFinale={startFinale} />
      </StageBackdrop>
    );
  }

  if (screen === 'playbook') {
    return (
      <StageBackdrop>
        <PlaybookScreen
          questId={activeQuest}
          onStart={() => startQuest(activeQuest, 'audition')}
          onBack={handleHome}
        />
      </StageBackdrop>
    );
  }

  if (screen === 'audition' && quiz) {
    return (
      <StageBackdrop>
        <AuditionScreen
          quiz={quiz}
          questLabel={QUEST_LABELS[activeQuest]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onFinish={handleFinish}
        />
      </StageBackdrop>
    );
  }

  if (screen === 'results' && quiz) {
    return (
      <StageBackdrop>
        <ResultsScreen
          score={quiz.score}
          total={quiz.questions.length}
          questLabel={QUEST_LABELS[activeQuest]}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      </StageBackdrop>
    );
  }

  return null;
}
