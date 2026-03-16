// ========================================================
//  DelusionCheck.ai — Hyderabadi Roast Engine v1.0
//  "Arrey mowa, chill maar. Reality sun le."
// ========================================================

const HYDERABADI_OPENERS = [
  "Arrey mowa,",
  "Bhai bhai bhai,",
  "Aye yaar,",
  "Oye bande,",
  "Kya scene hai yaar,",
  "Sun bhai,",
  "Arre dikha tujhe,",
  "Yaar, seedha bolunga toh —",
  "Bhai, tujhse pyaar hai isliye bol raha hoon —",
  "Ek dum seedha baat:",
];

const HYDERABADI_CLOSERS = [
  "Chill maar bhai, plan bana pehle.",
  "Thoda realistic ho ja yaar.",
  "Seedha baith, sapne dekhna chhod, kaam kar.",
  "Bas ek step uthao, reality mein aa jao.",
  "Pehle LinkedIn update kar, phir soch.",
  "Ek kaam kar — so ja, fresh mind se soch kal.",
  "Arrey, kuch toh kar bhai, sirf sochna band kar.",
  "Tera scene clear hai — ab action le.",
  "Mere bhai, Google kar, course le, shuru ho ja.",
  "Hyderabad mein log aise sapne nahi dekhte — woh karte hain.",
];

// ---- Keyword maps for context-aware roasts ----
const DREAM_KEYWORDS = {
  billionaire: [
    "tu billionaire banega chai bech ke? Bhai, Ambani bhi itna confident nahi tha apni shuruat mein.",
    "billionaire dream hai? Pehle ek lakh kama ke dikha, phir baat karte hain.",
    "tera billionaire plan sun ke mera crypto portfolio bhi hans raha hai.",
  ],
  influencer: [
    "influencer banega? 12 followers mein se 9 toh tere relatives hain.",
    "social media influencer? Tera content dekh ke log khud hi unfollow kar rahe hain.",
    "influencer life ka sapna hai toh pehle ek viral reel bana — bina filte ke.",
  ],
  startup: [
    "startup founder banega? Idea toh hai, execution ka plan hai kya?",
    "startup dream — acha hai yaar, lekin investor deck se pehle product bana.",
    "tera startup idea sun ke VCs khud hi ghair mulk mein bhag jayenge.",
  ],
  famous: [
    "famous banega? Bhai, pehle apne ghar mein famous ho ja.",
    "celebrity sapna dekh raha hai? Tere 5 min of fame ke liye bhi 5 saal ki mehnat chahiye.",
    "fame ka sapna beautiful hai, lekin fame ke peeche talent bhi lagta hai yaar.",
  ],
  rich: [
    "ameer hona hai? Toh pehle apna Netflix subscription cancel kar.",
    "rich life dream hai, lekin savings account ka balance zero hai — classic.",
    "rich banega? EMI toh pehle bhar, phir dream kar.",
  ],
  ceo: [
    "CEO banega? Arrey, pehle ek team lead ban ke dikhao.",
    "CEO dream — solid. Lekin company kahaan hai, team kahaan hai?",
    "CEO title ka sapna hai toh LinkedIn bio update kar, kaam toh baad mein hoga.",
  ],
  actor: [
    "actor banega? Teri expressions dekh ke mirrors bhi sharminda ho jaate hain.",
    "film star sapna hai — Hyderabad mein toh daily soap wale bhi audition dete hain.",
    "acting career? Bhai, drama toh WhatsApp groups mein bahut karta hai — wahi se shuru kar.",
  ],
  singer: [
    "singer banega? Bathroom mein gaana alag hota hai, stage pe alag.",
    "music career? Bhai, Spotify par ek song toh daal, phir baat karte hain.",
    "singer ka sapna hai — toh SoundCloud account khol, free mein hai.",
  ],
  writer: [
    "writer banega? Pehle ek blog post complete kar bina abandon kiye.",
    "author dream hai — bhai, ek chapter pura kar pehle.",
    "bestseller likhega? Last book tune kab padhi thi, woh yaad hai?",
  ],
  developer: [
    "developer banega? Pehle Hello World se zyada likh.",
    "tech billionaire dream hai? Stack Overflow account pe reputation toh zero hai.",
    "developer dream — acha hai, Python tutorial chhod ke ek project bana pehle.",
  ],
};

const REALITY_KEYWORDS = {
  instagram: [
    "8 ghante Instagram scroll kar ke billionaire nahi banega bhai.",
    "Instagram reels dekh ke success nahi aati — create kar, consume mat kar.",
    "teri reality mein Instagram hai, sapne mein Lamborghini — connection kahan hai?",
  ],
  netflix: [
    "Netflix binge kar ke kuch nahi milega — jab tak woh show produce nahi karta.",
    "Netflix hours real skills mein invest kar yaar.",
    "teri reality: Netflix. Tera sapna: Billionaire. Bhai yeh math nahi baithta.",
  ],
  sleeping: [
    "so ke success nahi milti — ya toh uth, ya sapna chhod.",
    "neend to sab lete hain bhai, kuch productive bhi kar.",
    "teri neend sun ke toh sapne bhi so jaate hain.",
  ],
  gaming: [
    "gaming se toh GTA ke baad koi billionaire nahi bana yaar.",
    "game mein toh pro hai, real life mein kab khelega?",
    "gaming skills toh hai, lekin real skills ka kya?",
  ],
  youtube: [
    "YouTube dekhne wala YouTube star nahi banta bhai.",
    "YouTube rabbit hole se nikal, apna channel khol.",
    "8 ghante YouTube — teri algorithm tujhe celebrity nahi banayegi.",
  ],
  procrastinating: [
    "kal karta hoon — yeh tera daily plan hai na?",
    "procrastination champion award tujhe hi milega bhai.",
    "kal se shuru karna matlab kabhi nahi karna — classic delusion.",
  ],
  broke: [
    "broke hoke billionaire banega? Respect hai yaar, real journey hai.",
    "zero se hero — inspirational hai, lekin step ek toh uthao.",
    "paise nahi hain toh koi baat nahi, skills build kar, woh free hai.",
  ],
  partying: [
    "party scene se billionaire nikla — naam batao ek toh.",
    "Hyderabad nightlife enjoyable hai, lekin goals bhi enjoy karte hain attention.",
    "party karna acha hai yaar, lekin skills party nahi karti — woh practice karti hain.",
  ],
  scrolling: [
    "scrolling se skills nahi aati bhai.",
    "doomscrolling aur billionaire dream — ek saath nahi chalega.",
    "phone neeche rakh yaar, teri dream tujhe dhundh nahi rahi.",
  ],
};

// Fallback generic roasts
const GENERIC_ROASTS = [
  "teri situation dekh ke mera calculator bhi confused ho gaya. Dream aur reality ka gap mount Everest se bada hai.",
  "itna bada dream aur itni chhoti action — bhai, yeh ratio bilkul galat hai.",
  "sapna dekhna acha hai, lekin sapne mein hi rehna — yeh problem hai.",
  "teri dream aur reality ka distance dekh ke GPS bhi rona shuru ho gaya.",
  "bhai, tera plan sun ke toh Telangana Tourism wale bhi confused hain.",
  "teri situation mein ek cheez missing hai — action. Baaki sab hai.",
  "dream size: skyscraper. Action size: gutter. Fix the ratio bhai.",
  "yeh toh main character syndrome ki peak stage hai. Episode 1 mein success nahi milti.",
];

// Score modifiers based on keywords
const SCORE_MODIFIERS = {
  dream: {
    billionaire: 25, rich: 20, famous: 18, influencer: 15,
    celebrity: 20, actor: 18, singer: 15, startup: 10,
    ceo: 12, developer: 5, writer: 8,
  },
  reality: {
    instagram: 20, netflix: 18, youtube: 15, gaming: 15,
    sleeping: 20, partying: 18, scrolling: 22, procrastinating: 25,
    broke: -5, studying: -15, working: -20, coding: -15,
    gym: -10, reading: -12, building: -18,
  },
};

function computeScore(dream, reality) {
  let score = 40; // baseline — everyone's a little delusional

  const dreamLower = dream.toLowerCase();
  const realityLower = reality.toLowerCase();

  // Boost score based on dream ambition
  for (const [keyword, modifier] of Object.entries(SCORE_MODIFIERS.dream)) {
    if (dreamLower.includes(keyword)) score += modifier;
  }

  // Boost/reduce based on reality actions
  for (const [keyword, modifier] of Object.entries(SCORE_MODIFIERS.reality)) {
    if (realityLower.includes(keyword)) score += modifier;
  }

  // Length mismatch heuristic — very short reality with big dreams
  if (dream.length > 50 && reality.length < 20) score += 10;

  // Clamp between 15 and 99
  return Math.min(99, Math.max(15, score));
}

function getScoreLabel(score) {
  if (score >= 90) return { label: "CERTIFIED DELULU", color: "#ff2d78", emoji: "🤡" };
  if (score >= 75) return { label: "HIGH-KEY DELULU", color: "#ff6b35", emoji: "💸" };
  if (score >= 55) return { label: "MID-KEY DELULU", color: "#fff01f", emoji: "📉" };
  if (score >= 35) return { label: "SLIGHTLY DELUSIONAL", color: "#39ff14", emoji: "🤔" };
  return { label: "ALMOST GROUNDED", color: "#00f5ff", emoji: "✨" };
}

function pickRoastLine(dream, reality) {
  const dreamLower = dream.toLowerCase();
  const realityLower = reality.toLowerCase();

  // Try dream-specific roast first
  for (const [keyword, lines] of Object.entries(DREAM_KEYWORDS)) {
    if (dreamLower.includes(keyword)) {
      return lines[Math.floor(Math.random() * lines.length)];
    }
  }

  // Try reality-specific roast
  for (const [keyword, lines] of Object.entries(REALITY_KEYWORDS)) {
    if (realityLower.includes(keyword)) {
      return lines[Math.floor(Math.random() * lines.length)];
    }
  }

  // Generic fallback
  return GENERIC_ROASTS[Math.floor(Math.random() * GENERIC_ROASTS.length)];
}

function generateRoast(dream, reality) {
  const opener = HYDERABADI_OPENERS[Math.floor(Math.random() * HYDERABADI_OPENERS.length)];
  const closer = HYDERABADI_CLOSERS[Math.floor(Math.random() * HYDERABADI_CLOSERS.length)];
  const middle = pickRoastLine(dream, reality);

  return `${opener} ${middle} ${closer}`;
}

function getAdvice(score) {
  if (score >= 90) return [
    "Start with ONE small daily habit today",
    "Set a realistic 30-day mini-goal",
    "Tell someone your plan — accountability works",
  ];
  if (score >= 75) return [
    "Cut one time-wasting activity this week",
    "Spend 30 min/day on your actual goal",
    "Track your progress daily",
  ];
  if (score >= 55) return [
    "You're close — just need more consistency",
    "Identify the one thing blocking you",
    "Build a weekly review habit",
  ];
  return [
    "You're surprisingly grounded — keep going!",
    "Double down on what's already working",
    "Help someone else get this grounded",
  ];
}

export function analyzeDelusion(dream, reality) {
  const score = computeScore(dream, reality);
  const scoreData = getScoreLabel(score);
  const roast = generateRoast(dream, reality);
  const advice = getAdvice(score);

  return {
    score,
    label: scoreData.label,
    color: scoreData.color,
    emoji: scoreData.emoji,
    roast,
    advice,
  };
}
