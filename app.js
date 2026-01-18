/* =========================
   (선택) 응답 저장 URL
========================= */
const CONFIG = {
  SUBMIT_URL: "", // 예: "https://script.google.com/macros/s/XXXX/exec"
};

/* =========================
  타입 키(6개)
========================= */
const TYPES = ["classic", "spicy", "juicy", "crispy", "nutty", "premium"];

/* =========================
  결과: (이미지 1 톤앤매너 + 이미지 2 메뉴 매핑)
========================= */
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
    quote: "프리미엄을 좋아하는 당신! ‘100% 한우 버거’의 고급진 맛을 느껴보세요!",
    menus: ["100% 한우 버거", "비프 앤 쉬림프 버거"],
  },
};

/* ==========================================================
  질문 7개 (덜 티 나는 간접 문항)
  - 각 옵션은 한 타입만 찍지 않고 여러 타입에 가중치 분산
  - 이후 실제 응답 데이터로 이 가중치를 ‘통계적으로 보정’ 가능
========================================================== */
const QUESTIONS = [
  {
    title: "편의점에서 ‘나도 모르게’ 손이 가는 건?",
    options: [
      { label: "국룰 조합(늘 먹던 맛)", icon: "🍔", type: "classic", w: { classic: 2, nutty: 0.5 } },
      { label: "매운 과자/라면류", icon: "🌶️", type: "spicy", w: { spicy: 2, crispy: 0.5 } },
      { label: "육포/단백질류", icon: "🍖", type: "juicy", w: { juicy: 2, premium: 0.5 } },
      { label: "견과/고소한 스낵", icon: "🌿", type: "nutty", w: { nutty: 2, classic: 0.5 } },
    ],
  },
  {
    title: "치킨을 시키면 네 취향은 보통 이쪽",
    options: [
      { label: "후라이드(바삭이 전부)", icon: "✨", type: "crispy", w: { crispy: 2, classic: 0.5 } },
      { label: "양념/매운맛(한 방)", icon: "🌶️", type: "spicy", w: { spicy: 2 } },
      { label: "구이/훈연(풍미파)", icon: "🍖", type: "juicy", w: { juicy: 1.5, premium: 1 } },
      { label: "간장/마늘(조화·고소)", icon: "🌿", type: "nutty", w: { nutty: 1.5, classic: 1 } },
    ],
  },
  {
    title: "네 ‘소스 습관’에 더 가까운 건?",
    options: [
      { label: "소스는 최소(재료 맛)", icon: "🍖", type: "juicy", w: { juicy: 1.5, premium: 1, classic: 0.5 } },
      { label: "소스 듬뿍(풍부해야 함)", icon: "🌿", type: "nutty", w: { nutty: 1.5, spicy: 0.5, classic: 0.5 } },
      { label: "찍먹파(바삭 지킨다)", icon: "✨", type: "crispy", w: { crispy: 2, classic: 0.5 } },
      { label: "매콤 소스는 무조건 추가", icon: "🌶️", type: "spicy", w: { spicy: 2, crispy: 0.5 } },
    ],
  },
  {
    title: "이걸로 취향이 가려진다고? (낚시 질문) 🤔",
    options: [
      { label: "피넛버터+치즈? 오히려 좋아", icon: "🌿", type: "nutty", w: { nutty: 2, premium: 0.5 } },
      { label: "더블패티면 대화 종료", icon: "🍖", type: "juicy", w: { juicy: 2, premium: 0.5 } },
      { label: "난 정석이 편하다", icon: "🍔", type: "classic", w: { classic: 2 } },
      { label: "매운맛은 ‘끝’까지 간다", icon: "🌶️", type: "spicy", w: { spicy: 2 } },
    ],
  },
  {
    title: "감자튀김은 어떤 타입이 진짜야?",
    options: [
      { label: "얇고 바삭(크런치)", icon: "✨", type: "crispy", w: { crispy: 2, spicy: 0.5 } },
      { label: "두껍고 든든(포만감)", icon: "🍖", type: "juicy", w: { juicy: 1.5, classic: 0.5 } },
      { label: "양념/시즈닝(자극)", icon: "🌶️", type: "spicy", w: { spicy: 1.5, crispy: 0.5, nutty: 0.5 } },
      { label: "트러플/치즈(고급)", icon: "👑", type: "premium", w: { premium: 2, nutty: 0.5 } },
    ],
  },
  {
    title: "‘한 입’에서 더 행복한 순간은?",
    options: [
      { label: "씹자마자 ‘바삭!’", icon: "✨", type: "crispy", w: { crispy: 2 } },
      { label: "입안에 ‘육즙!’", icon: "🍖", type: "juicy", w: { juicy: 2, premium: 0.5 } },
      { label: "은은하게 ‘고소!’", icon: "🌿", type: "nutty", w: { nutty: 2, classic: 0.5 } },
      { label: "혀끝에 ‘화끈!’", icon: "🌶️", type: "spicy", w: { spicy: 2 } },
    ],
  },
  {
    title: "마지막! 너의 ‘선택 기준’은 보통 이거",
    options: [
      { label: "실패 없는 정석", icon: "🍔", type: "classic", w: { classic: 2, nutty: 0.5 } },
      { label: "자극이 있어야 만족", icon: "🌶️", type: "spicy", w: { spicy: 2 } },
      { label: "퀄리티/완성도", icon: "👑", type: "premium", w: { premium: 2, juicy: 0.5 } },
      { label: "듣도보도 못한 조합(끌림)", icon: "🌿", type: "nutty", w: { nutty: 1.5, premium: 0.5, spicy: 0.5 } },
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
  return { top1: sorted[0], top2: sorted[1], sorted };
}

function calcResultType() {
  const scores = calcScores();
  const { top1 } = pickTop2(scores);
  return top1;
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

function typeName(t) {
  return RESULT_MAP[t]?.title ?? t;
}

async function showResult() {
  progressFill.style.width = `100%`;

  const scores = calcScores();
  const { top1, top2 } = pickTop2(scores);

  const r = RESULT_MAP[top1];
  resultBadge.textContent = r.badge;
  resultTitle.textContent = r.title;

  // 보조취향 표시(박빙이면)
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
      alert("링크를 복사했어!");
    }
  } catch (_) {}
});

// 시작
renderQuestion();
