const params = new URLSearchParams(location.search);
const type = params.get("type") || "rights";

const quizInfo = {
  rights: {
    title: "権利関係",
    desc: "民法・借地借家法・区分所有法"
  },
  gyouhou: {
    title: "宅建業法",
    desc: "免許・重要事項説明・37条書面"
  },
  horei: {
    title: "法令上の制限",
    desc: "都市計画法・建築基準法・農地法"
  },
  tax: {
    title: "税・その他",
    desc: "固定資産税・印紙税・登録免許税"
  },
  exemption: {
    title: "5問免除",
    desc: "統計・住宅金融支援機構・景品表示法"
  },
  practice: {
    title: "総合演習",
    desc: "全科目ミックス演習"
  },
  mistake: {
    title: "ひっかけ問題",
    desc: "数字・例外・誤文対策"
  },
  rightsAdvanced: {
    title: "権利関係 上級",
    desc: "民法・借地借家法の難問"
  },
  gyouhouAdvanced: {
    title: "宅建業法 上級",
    desc: "8種制限・保証金・監督処分"
  },
  pastExam: {
    title: "過去問風",
    desc: "本試験形式の4択演習"
  }
};

const info = quizInfo[type] || quizInfo.rights;

document.title = info.title;
document.getElementById("pageTitle").textContent = info.title;
document.getElementById("pageDesc").textContent = info.desc;

const quizList = document.getElementById("quizList");

quizList.innerHTML = Object.keys(quizInfo).map(key => {
  return `
    <a href="?type=${key}" class="${key === type ? "active" : ""}">
      ${quizInfo[key].title}
    </a>
  `;
}).join("");

function normalizeQuestion(q) {
  return {
    question: q.question || q.q,
    choices: q.choices || q.c,
    answer: q.answer || q.a
  };
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const rawQuestions = window.quizData[type] || window.quizData.rights || [];

let questions = shuffle(rawQuestions.map(normalizeQuestion)).slice(0, 50);

let current = 0;
let score = 0;
let answered = false;

const counter = document.getElementById("counter");
const scoreEl = document.getElementById("score");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const progressBar = document.getElementById("progressBar");

function showQuestion() {
  if (questions.length === 0) {
    counter.textContent = "0 / 0";
    questionEl.textContent = "問題データが読み込めません";
    choicesEl.innerHTML = "";
    resultEl.textContent = `window.quizData.${type} がありません`;
    return;
  }

  if (current >= questions.length) {
    finishQuiz();
    return;
  }

  answered = false;

  const q = questions[current];

  counter.textContent = `${current + 1} / ${questions.length}`;
  scoreEl.textContent = `スコア: ${score}`;
  questionEl.textContent = q.question;
  resultEl.textContent = "";

  progressBar.style.width = `${(current / questions.length) * 100}%`;

  choicesEl.innerHTML = "";

  shuffle(q.choices).forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice;
    button.onclick = () => checkAnswer(button, choice);
    choicesEl.appendChild(button);
  });
}

function checkAnswer(button, choice) {
  if (answered) return;

  answered = true;

  const q = questions[current];

  document.querySelectorAll("#choices button").forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === q.answer) {
      btn.classList.add("correct");
    }
  });

  if (choice === q.answer) {
    score++;
    button.classList.add("correct");
    resultEl.textContent = "正解！";
  } else {
    button.classList.add("wrong");
    resultEl.textContent = `不正解！ 正解は「${q.answer}」`;
  }

  scoreEl.textContent = `スコア: ${score}`;

  setTimeout(() => {
    current++;
    showQuestion();
  }, 1300);
}

function finishQuiz() {
  counter.textContent = "終了";
  progressBar.style.width = "100%";
  questionEl.textContent = "結果発表";

  choicesEl.innerHTML = `
    <div class="finish">
      <p>${questions.length}問中 ${score}問正解！</p>
      <button onclick="location.reload()">もう一度挑戦</button>
      <a class="home-btn" href="./">ジャンル選択へ戻る</a>
    </div>
  `;

  resultEl.textContent = "";
}

showQuestion();
