const CONFIG = { SUBMIT_URL: "" };

const TYPES = ["classic", "spicy", "juicy", "crispy", "nutty", "premium"];

const RESULT_MAP = {
  classic: {
    badge: "🍔",
    title: "클래식",
    tagline: "기본에 충실한 맛 선호. 전통적인 수제버거",
    quote: "당신은 역시 기본에 충실한 ‘클래식 버거 스타일’! 호불호 없는 ‘프랭크 버거’가 딱이에요.",
    menus: ["프랭크 버거", "K 불고기 버거"],
  },
  spicy: {
    badge: "🌶️",
    title: "매콤",
    tagline: "자극적인 맛 선호. 혀끝에 전해지는 화끈한 경험",
    quote: "화끈한 매력의 당신! 매콤한 ‘K 핫불고기 버거’로 스트레스를 날려보세요!",
    menus: ["K 핫불고기 버거", "청양마요 쉬림프 버거"],
  },
  juicy: {
    badge: "🍖",
    title: "육즙",
    tagline: "묵직한 깊은 맛 선호. 입안에 퍼지는 패티 본연의 풍미",
    quote: "육즙에 진심인 당신! ‘더블 비프 치즈 버거’의 풍성한 육즙을 한입에 느껴보세요.",
    menus: ["치즈 도넛 비프 버거", "더블 비프 치즈 버거"],
  },
  crispy: {
    badge: "✨",
    title: "바삭",
    tagline: "경쾌한 식감을 선호. 씹는 맛에서 느껴지는 즐거움",
    quote: "식감에 진심인 당신! ‘크리스피 카츠 버거’의 반전 매력에 빠져보세요!",
    menus: ["크리스피 카츠 버거", "크리스피 치킨 버거"],
  },
  nutty: {
    badge: "🌿",
    title: "고소",
    tagline: "맛의 조화를 선호. 은은하게 오래 남는 풍미",
    quote: "은은한 고소함에 끌리는 당신! ‘피넛 버터 더블 치즈 버거’의 조화로운 풍미를 즐겨보세요.",
    menus: ["피넛 버터 더블 치즈버거", "JG 버거"],
  },
  premium: {
    badge: "👑",
    title: "프리미엄",
    tagline: "완성도 있는 버거를 선호. 고급재료로는 특별한 경험",
    quote: "프리미엄 취향이면 이거지. ‘100% 한우 버거’로 제대로 한 번 가자!",
    menus: ["100% 한우 버거", "비프 앤 쉬림프 버거"],
  },
};

/* ==========================================================
  질문 7개 (자연스러운 말투)
  - 보기 4개(2x2) 유지
  - 가중치 분산 방식 유지
========================================================== */
const QUESTIONS = [
  {
    title: "처음 한 입 먹고 ‘아 이거다’ 싶을 때는 언제인가요요?",
    options: [
      { label: "맛이 딱 균형 잡혔을 때", icon: "🍔", type: "classic", w: { classic: 2, nutty: 0.5 } },
      { label: "혀끝에 전해지는 매운느낌이 딱 올 때", icon: "🌶️", type: "spicy", w: { spicy: 2, crispy: 0.5 } },
      { label: "입안 가듯 육즙이 확 퍼질 때", icon: "🍖", type: "juicy", w: { juicy: 2, premium: 0.5 } },
      { label: "씹자 마자 바삭하는 소리가 들릴 때", icon: "✨", type: "crispy", w: { crispy: 2, classic: 0.5 } },
    ],
  },
  {
    title: "요즘 자꾸 끌리는 맛은 어느 쪽인가요?",
    options: [
      { label: "깔끔하고 무난한 맛", icon: "🍔", type: "classic", w: { classic: 2 } },
      { label: "자극적이고 쎈 맛", icon: "🌶️", type: "spicy", w: { spicy: 2 } },
      { label: "진하고 묵직한 풍미", icon: "🍖", type: "juicy", w: { juicy: 1.5, premium: 1 } },
      { label: "고소하고 조화로운 맛", icon: "🌿", type: "nutty", w: { nutty: 2, classic: 0.5 } },
    ],
  },
  {
    title: "소스는 보통 어떻게 먹는 편인가요?",
    options: [
      { label: "기본이 최고", icon: "🍔", type: "classic", w: { classic: 2, premium: 0.5 } },
      { label: "매콤한 건 있으면 무조건 추가", icon: "🌶️", type: "spicy", w: { spicy: 2, crispy: 0.5 } },
      { label: "무조건 고소하고 조화로운 맛이", icon: "🌿", type: "nutty", w: { nutty: 2, classic: 0.5 } },
      { label: "재료 맛 느끼려고 최소로 넣기", icon: "🍖", type: "juicy", w: { juicy: 1.5, premium: 1, classic: 0.5 } },
    ],
  },
  {
    title: "튀김류 먹을 때 너는 어떤 스타일인가요?",
    options: [
      { label: "바삭함 죽으면 게임 끝", icon: "✨", type: "crispy", w: { crispy: 2 } },
      { label: "소스에 적셔도 맛만 있으면 OK", icon: "🌿", type: "nutty", w: { nutty: 1.5, classic: 0.5 } },
      { label: "매운 소스면 최고", icon: "🌶️", type: "spicy", w: { spicy: 1.5, crispy: 0.5 } },
      { label: "두께/풍미가 중요", icon: "🍖", type: "juicy", w: { juicy: 1.5, premium: 1 } },
    ],
  },
  {
    title: "한 입 만족도가 팍 올라가는 순간은 어떨 때인가요?",
    options: [
      { label: "씹자마자 울리는 ‘바삭!’ 소리가 들릴때", icon: "✨", type: "crispy", w: { crispy: 2 } },
      { label: "입안 가득 나오는 ‘육즙!’이 느껴질때", icon: "🍖", type: "juicy", w: { juicy: 2, premium: 0.5 } },
      { label: "먹고 나서 올라오는 고소한 여운이 느껴질때때", icon: "🌿", type: "nutty", w: { nutty: 2 } },
      { label: "짜릿한 매운맛이 딱 꽂힐 때", icon: "🌶️", type: "spicy", w: { spicy: 2 } },
    ],
  },
  {
    title: "돈 조금 더 내도 ‘이건 인정’인 포인트는?",
    options: [
      { label: "퀄리티/완성도", icon: "👑", type: "premium", w: { premium: 2, juicy: 0.5 } },
      { label: "패티 존재감(고기 맛)", icon: "🍖", type: "juicy", w: { juicy: 2, premium: 0.5 } },
      { label: "식감(크런치/튀김)", icon: "✨", type: "crispy", w: { crispy: 2 } },
      { label: "먹던거면 충분", icon: "🍔", type: "classic", w: { classic: 2 } },
    ],
  },
  {
    title: "마지막! 제일 잘 맞는 말은 무엇인가요요?",
    options: [
      { label: "안정적인 정석이 최고", icon: "🍔", type: "classic", w: { classic: 2, nutty: 0.5 } },
      { label: "자극 없으면 심심해", icon: "🌶️", type: "spicy", w: { spicy: 2 } },
      { label: "진한 풍미면 그냥 OK", icon: "🍖", type: "juicy", w: { juicy: 1.5, premium: 1 } },
      { label: "고소하고 조화로운 맛이 좋아", icon: "🌿", type: "nutty", w: { nutty: 2 } },
    ],
  },
];

/* =========================
   UI / 로직
========================= */
let current = 0;
const answers = Array(QUESTIONS.length).fill(null);
let selectedAnswer = null;

const stepText = document.getElementById("stepText");
const progressFill = document.getElementById("progressFill");
const questionTitle = document.getElementById("questionTitle");
const optionsEl = document.getElementById("options");
const skipBtn = document.getElementById("skipBtn");
const nextBtn = document.getElementById("nextBtn");

const card = document.getElementById("card");
const resultCard = document.getElementById("resultCard");
const resultBadge = document.getElementById("resultBadge");
const resultTitle = document.getElementById("resultTitle");
const resultTagline = document.getElementById("resultTagline");
const resultQuote = document.getElementById("resultQuote");
const resultMenus = document.getElementById("resultMenus");

const restartBtn = document.getElementById("restartBtn");
const shareBtn = document.getElementById("shareBtn");

function updateTop() {
  stepText.textContent = `${current + 1}/${QUESTIONS.length}`;
  const pct = Math.round((current / QUESTIONS.length) * 100);
  progressFill.style.width = `${pct}%`;
}

function renderQuestion() {
  selectedAnswer = null;
  nextBtn.disabled = true;

  const q = QUESTIONS[current];
  updateTop();
  questionTitle.textContent = q.title;

  optionsEl.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.setAttribute("aria-pressed", "false");

    const icon = document.createElement("div");
    icon.className = `icon ${opt.type}`;
    icon.textContent = opt.icon;

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = opt.label;

    btn.appendChild(icon);
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      [...optionsEl.querySelectorAll(".option")].forEach((b) => {
        b.classList.remove("selected");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("selected");
      btn.setAttribute("aria-pressed", "true");

      selectedAnswer = {
        q: q.title,
        optionIdx: idx,
        type: opt.type,
        label: opt.label,
        w: opt.w,
      };
      nextBtn.disabled = false;
    });

    optionsEl.appendChild(btn);
  });
}

function calcScores() {
  const scores = {};
  TYPES.forEach((t) => (scores[t] = 0));

  answers.forEach((a) => {
    if (!a || !a.w) return;
    TYPES.forEach((t) => {
      const val = a.w[t];
      if (typeof val === "number") scores[t] += val;
    });
  });

  return scores;
}

function pickTop2(scores) {
  const sorted = [...TYPES].sort((a, b) => scores[b] - scores[a]);
  return { top1: sorted[0], top2: sorted[1] };
}

function typeName(t) {
  return RESULT_MAP[t]?.title ?? t;
}

async function submitIfNeeded(resultType, scores) {
  if (!CONFIG.SUBMIT_URL) return;

  const payload = {
    createdAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    resultType,
    scores,
    answers,
  };

  try {
    await fetch(CONFIG.SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("submit failed:", e);
  }
}

async function showResult() {
  progressFill.style.width = `100%`;

  const scores = calcScores();
  const { top1, top2 } = pickTop2(scores);

  const r = RESULT_MAP[top1];
  resultBadge.textContent = r.badge;
  resultTitle.textContent = r.title;

  const gap = (scores[top1] ?? 0) - (scores[top2] ?? 0);
  const secondary = gap <= 1 ? ` · 보조취향: ${typeName(top2)}` : "";
  resultTagline.textContent = `${r.tagline}${secondary}`;

  resultQuote.textContent = r.quote;

  resultMenus.innerHTML = "";
  r.menus.forEach((m) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = m;
    resultMenus.appendChild(chip);
  });

  card.classList.add("hidden");
  resultCard.classList.remove("hidden");

  await submitIfNeeded(top1, scores);
}

function next() {
  answers[current] = selectedAnswer;

  if (current < QUESTIONS.length - 1) {
    current += 1;
    renderQuestion();
  } else {
    showResult();
  }
}

function skip() {
  answers[current] = null;

  if (current < QUESTIONS.length - 1) {
    current += 1;
    renderQuestion();
  } else {
    showResult();
  }
}

skipBtn.addEventListener("click", skip);
nextBtn.addEventListener("click", next);

restartBtn.addEventListener("click", () => {
  for (let i = 0; i < answers.length; i++) answers[i] = null;
  current = 0;
  resultCard.classList.add("hidden");
  card.classList.remove("hidden");
  renderQuestion();
});

shareBtn.addEventListener("click", async () => {
  const url = location.href;
  const text = "버거 취향 테스트 해볼래?";
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, text, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("링크 복사했어!");
    }
  } catch (_) {}
});

renderQuestion();




