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

/* =========================
  질문: 정확히 7개
  - 보기(선택지)는 4개씩(2x2 UI 유지)
  - 중간에 “이걸로 가려진다고?” 낚시 질문 1개 포함
  - 가중치(score)로 6타입 분류
========================= */
const QUESTIONS = [
  {
    title: "버거 첫 입에서 제일 중요한 건?",
    options: [
      { label: "정석 밸런스", icon: "🍔", type: "classic", score: { classic: 2, nutty: 1 } },
      { label: "혀끝 화끈", icon: "🌶️", type: "spicy", score: { spicy: 2 } },
      { label: "육즙이 주인공", icon: "🍖", type: "juicy", score: { juicy: 2, premium: 1 } },
      { label: "바삭 소리", icon: "✨", type: "crispy", score: { crispy: 2 } },
    ],
  },
  {
    title: "소스 취향은 딱 이거야",
    options: [
      { label: "기본 소스(국룰)", icon: "🍔", type: "classic", score: { classic: 2 } },
      { label: "청양/핫소스 추가", icon: "🌶️", type: "spicy", score: { spicy: 2, crispy: 1 } },
      { label: "고소한 조합이 좋음", icon: "🌿", type: "nutty", score: { nutty: 2, classic: 1 } },
      { label: "고급 풍미(재료빨)", icon: "👑", type: "premium", score: { premium: 2, juicy: 1 } },
    ],
  },
  {
    title: "식감 vs 풍미, 뭐가 더 중요해?",
    options: [
      { label: "겉바속촉이 최고", icon: "✨", type: "crispy", score: { crispy: 2 } },
      { label: "촉촉함/육즙", icon: "🍖", type: "juicy", score: { juicy: 2 } },
      { label: "은은한 고소 여운", icon: "🌿", type: "nutty", score: { nutty: 2 } },
      { label: "완성도/퀄리티", icon: "👑", type: "premium", score: { premium: 2 } },
    ],
  },
  {
    title: "이걸로 취향이 가려진다고? (낚시 질문) 🤔",
    options: [
      { label: "피넛버터+치즈? 오히려 좋아", icon: "🌿", type: "nutty", score: { nutty: 2, premium: 1 } },
      { label: "매운맛은 끝까지 간다", icon: "🌶️", type: "spicy", score: { spicy: 2 } },
      { label: "더블패티면 설명 끝", icon: "🍖", type: "juicy", score: { juicy: 2, premium: 1 } },
      { label: "난 정석이 편해", icon: "🍔", type: "classic", score: { classic: 2 } },
    ],
  },
  {
    title: "버거 고를 때 너의 습관은?",
    options: [
      { label: "늘 먹던 거(안전픽)", icon: "🍔", type: "classic", score: { classic: 2 } },
      { label: "신메뉴/한정에 약함", icon: "👑", type: "premium", score: { premium: 2, nutty: 1 } },
      { label: "매운 메뉴 있으면 그걸로", icon: "🌶️", type: "spicy", score: { spicy: 2 } },
      { label: "튀김류/카츠류 보면 못 참음", icon: "✨", type: "crispy", score: { crispy: 2 } },
    ],
  },
  {
    title: "먹고 난 뒤, 남았으면 하는 느낌은?",
    options: [
      { label: "깔끔하게 정리되는 맛", icon: "🍔", type: "classic", score: { classic: 2 } },
      { label: "매운 킥이 오래 남는 맛", icon: "🌶️", type: "spicy", score: { spicy: 2 } },
      { label: "고소한 여운이 잔잔하게", icon: "🌿", type: "nutty", score: { nutty: 2 } },
      { label: "고급진 풍미가 ‘와’ 하는 맛", icon: "👑", type: "premium", score: { premium: 2 } },
    ],
  },
  {
    title: "마지막! 딱 하나만 고르면?",
    options: [
      { label: "정석의 안정감", icon: "🍔", type: "classic", score: { classic: 2 } },
      { label: "자극 없으면 아쉬움", icon: "🌶️", type: "spicy", score: { spicy: 2 } },
      { label: "패티가 주인공이어야 함", icon: "🍖", type: "juicy", score: { juicy: 2 } },
      { label: "씹는 재미가 곧 행복", icon: "✨", type: "crispy", score: { crispy: 2 } },
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
        score: opt.score,
      };
      nextBtn.disabled = false;
    });

    optionsEl.appendChild(btn);
  });
}

function calcResultType() {
  const scores = {};
  TYPES.forEach((t) => (scores[t] = 0));

  answers.forEach((a) => {
    if (!a) return;
    const sc = a.score || {};
    TYPES.forEach((t) => {
      if (typeof sc[t] === "number") scores[t] += sc[t];
    });
  });

  // 동점 우선순위(원하는대로 바꿔도 됨)
  const order = ["classic", "spicy", "juicy", "crispy", "nutty", "premium"];
  let best = order[0];
  order.forEach((t) => {
    if (scores[t] > scores[best]) best = t;
  });

  return best;
}

async function submitIfNeeded(resultType) {
  if (!CONFIG.SUBMIT_URL) return;

  const payload = {
    createdAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    resultType,
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

  const t = calcResultType();
  const r = RESULT_MAP[t];

  resultBadge.textContent = r.badge;
  resultTitle.textContent = r.title;
  resultTagline.textContent = r.tagline;
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

  await submitIfNeeded(t);
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
