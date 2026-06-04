const quizList = {
  rights: "権利関係",
  gyouhou: "宅建業法",
  horei: "法令上の制限",
  tax: "税・その他",
  exemption: "5問免除",
  practice: "総合演習",
  mistake: "ひっかけ問題",
  rightsAdvanced: "権利関係 上級",
  gyouhouAdvanced: "宅建業法 上級",
  pastExam: "過去問風"
};

const params = new URLSearchParams(location.search);
const type = params.get("type") || "rights";

const menu = document.getElementById("menu");

if (menu) {
  menu.innerHTML = "";

  Object.keys(quizList).forEach(key => {
    const a = document.createElement("a");
    a.href = `?type=${key}`;
    a.textContent = quizList[key];

    if (key === type) {
      a.classList.add("active");
    }

    menu.appendChild(a);
  });
}

const allQuestions = window.quizData[type] || [];

let questions = [...allQuestions]
  .sort(() => Math.random() - 0.5)
  .slice(0, 50);

let current = 0;
let score = 0;
let answered = false;

const count = document.getElementById("count");
const scoreEl = document.getElementById("score");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const bar = document.getElementById("bar");

function showQuestion() {
  answered = false;

  if (questions.length === 0) {
    questionEl.textContent = "問題データが読み込めません";
    choicesEl.innerHTML = "";
    resultEl.textContent = `type=${type} のデータがありません`;
    return;
  }

  if (current >= questions.length) {
    finish();
    return;
  }

  const q = questions[current];

  count.textContent = `${current + 1} / ${questions.length}`;
  scoreEl.textContent = `スコア:${score}`;

  questionEl.textContent = q.question;
  resultEl.textContent = "";

  bar.style.width = `${(current / questions.length) * 100}%`;

  choicesEl.innerHTML = "";

  const choices = [...q.choices].sort(() => Math.random() - 0.5);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => answer(btn, choice);
    choicesEl.appendChild(btn);
  });
}

function answer(btn, choice) {
  if (answered) return;

  answered = true;

  const q = questions[current];

  document.querySelectorAll("#choices button").forEach(b => {
    b.disabled = true;

    if (b.textContent === q.answer) {
      b.classList.add("correct");
    }
  });

  if (choice === q.answer) {
    score++;
    resultEl.textContent = "正解！";
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    resultEl.textContent = `不正解！ 正解:${q.answer}`;
  }

  scoreEl.textContent = `スコア:${score}`;

  setTimeout(() => {
    current++;
    showQuestion();
  }, 1800);
}

function finish() {
  bar.style.width = "100%";

  questionEl.textContent = "結果発表";

  choicesEl.innerHTML = `
    <h3>${questions.length}問中 ${score}問正解</h3>
    <button onclick="location.reload()">もう一度挑戦</button>
  `;

  resultEl.textContent = "";
}

showQuestion();
