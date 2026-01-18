/* =========================
   설정(선택): 응답 저장 URL
   - 구글 Apps Script / 서버 엔드포인트를 만들면 여기에 넣기
   - 지금은 비워두면 저장 없이 설문만 동작
========================= */
const CONFIG = {
  SUBMIT_URL: "", // 예: "https://script.google.com/macros/s/XXXX/exec"
};

/* =========================
   7문항 예시 (원하면 문항/선택지 문구만 바꾸면 됨)
   - 각 선택지는 type(클래식/매콤/이색/프리미엄) 점수를 1점씩 부여
========================= */
const QUESTIONS = [
  {
    title: "버거를 고를 때 가장 먼저 보는 건?",
    options: [
      { label: "기본에 충실", icon: "⭐", type: "classic" },
      { label: "매운맛 유혹", icon: "🔥", type: "spicy" },
      { label: "새로운 조합", icon: "🍃", type: "unique" },
      { label: "재료 퀄리티", icon: "🏅", type: "premium" },
    ],
  },
  {
    title: "한 입에서 가장 중요한 건?",
    options: [
      { label: "밸런스", icon: "⭐", type: "classic" },
      { label: "자극", icon: "🔥", type: "spicy" },
      { label: "개성", icon: "🍃", type: "unique" },
      { label: "풍미", icon: "🏅", type: "premium" },
    ],
  },
  {
    title: "당신의 버거 스타일은?",
    options: [
      { label: "클래식", icon: "⭐", type: "classic" },
      { label: "매콤", icon: "🔥", type: "spicy" },
      { label: "이색", icon: "🍃", type: "unique" },
      { label: "프리미엄", icon: "🏅", type: "premium" },
    ],
  },
  {
    title: "소스 취향은?",
    options: [
      { label: "기본 소스", icon: "⭐", type: "classic" },
      { label: "핫소스", icon: "🔥", type: "spicy" },
      { label: "특제/한정", icon: "🍃", type: "unique" },
      { label: "트러플/치즈", icon: "🏅", type: "premium" },
    ],
  },
  {
    title: "버거 먹는 날의 무드는?",
    options: [
      { label: "편안하게", icon: "⭐", type: "classic" },
      { label: "스트레스 해소", icon: "🔥", type: "spicy" },
      { label: "모험", icon: "🍃", type: "unique" },
      { label: "기념일/보상", icon: "🏅", type: "premium" },
    ],
  },
  {
    title: "사이드 고르는 스타일은?",
    options: [
      { label: "감튀 국룰", icon: "⭐", type: "classic" },
      { label: "양념/시즈닝", icon: "🔥", type: "spicy" },
      { label: "색다른 사이드", icon: "🍃", type: "unique" },
      { label: "프리미엄 음료", icon: "🏅", type: "premium" },
    ],
  },
  {
    title: "마지막 한 줄로 표현하면?",
    options: [
      { label: "정석이 최고", icon: "⭐", type: "classic" },
      { label: "강렬해야 함", icon: "🔥", type: "spicy" },
      { label: "남들과 다르게", icon: "🍃", type: "unique" },
      { label: "고급스럽게", icon: "🏅", type: "premium" },
    ],
  },
];

/* =========================
   결과(문구/추천 메뉴는 여기서 바꾸면 됨)
========================= */
const RESULT_MAP = {
  classic: {
    badge: "⭐",
    title: "클래식형",
    desc: "기본의 완성도를 중시하는 정석파. 한 입 밸런스가 깔끔해야 만족해!",
    menu: "프랭크 클래식 / 치즈 클래식 + 감튀 세트",
  },
  spicy: {
    badge: "🔥",
    title: "매콤추구형",
    desc: "자극이 있어야 ‘먹었다’ 싶은 타입. 매운 킥이 핵심!",
    menu: "스파이시 프랭크 / 핫치킨버거 + 탄산 세트",
  },
  unique: {
    badge: "🍃",
    title: "이색탐험형",
    desc: "새로운 조합과 한정 메뉴에 약해. 남들이 안 고른 걸 고르는 재미!",
    menu: "이색 한정 버거(예: 불고기/갈릭/특제소스) + 사이드 업그레이드",
  },
  premium: {
    badge: "🏅",
    title: "프리미엄지향형",
    desc: "재료 퀄리티와 풍미를 최우선. ‘오늘은 좋은 거’가 어울려.",
    menu: "프리미엄 더블치즈/베이컨 버거 + 프리미엄 음료 세트",
  },
};

/* =========================
   UI 로직
========================= */
let current = 0;
const answers = Array(QUESTIONS.length).fill(null); // {type, label} or null
let selectedType = null;

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
const resultDesc = document.getElementById("resultDesc");
const resultMenu = document.getElementById("resultMenu");
const restartBtn = document.getElementById("restartBtn");
const shareBtn = document.getElementById("shareBtn");

function updateTop() {
  stepText.textContent = `${current + 1}/${QUESTIONS.length}`;
  const pct = Math.round(((current) / QUESTIONS.length) * 100);
  progressFill.style.width = `${pct}%`;
}

function renderQuestion() {
  selectedType = null;
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
      // 선택 표시
      [...optionsEl.querySelectorAll(".option")].forEach((b) => {
        b.classList.remove("selected");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("selected");
      btn.setAttribute("aria-pressed", "true");

      selectedType = opt.type;
      answers[current] = { type: opt.type, label: opt.label, q: q.title, idx };
      nextBtn.disabled = false;
    });

    optionsEl.appendChild(btn);
  });
}

function calcResultType() {
  const scores = { classic: 0, spicy: 0, unique: 0, premium: 0 };
  answers.forEach((a) => {
    if (!a) return;
    scores[a.type] += 1;
  });

  // 최고점 타입 선택 (동점이면 classic > spicy > unique > premium 순으로)
  const order = ["classic", "spicy", "unique", "premium"];
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
    // 저장 실패해도 UX는 계속 진행
    console.warn("submit failed:", e);
  }
}

async function showResult() {
  progressFill.style.width = `100%`;

  const t = calcResultType();
  const r = RESULT_MAP[t];

  resultBadge.textContent = r.badge;
  resultTitle.textContent = r.title;
  resultDesc.textContent = r.desc;
  resultMenu.textContent = r.menu;

  card.classList.add("hidden");
  resultCard.classList.remove("hidden");

  await submitIfNeeded(t);
}

function next() {
  if (current < QUESTIONS.length - 1) {
    current += 1;
    renderQuestion();
  } else {
    showResult();
  }
}

function skip() {
  // 스킵은 답을 null로 유지하고 다음으로
  answers[current] = null;
  next();
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
