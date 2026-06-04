const allQuestions = window.quizData.takken;

let questions =
[...allQuestions]
.sort(() => Math.random() - 0.5)
.slice(0,50);

let current=0;
let score=0;
let answered=false;

const count=document.getElementById("count");
const scoreEl=document.getElementById("score");
const questionEl=document.getElementById("question");
const choicesEl=document.getElementById("choices");
const resultEl=document.getElementById("result");
const bar=document.getElementById("bar");

function showQuestion(){

answered=false;

if(current>=questions.length){

finish();

return;

}

const q=questions[current];

count.textContent=
`${current+1} / ${questions.length}`;

scoreEl.textContent=
`スコア:${score}`;

questionEl.textContent=q.q;

resultEl.textContent="";

bar.style.width=
`${current/questions.length*100}%`;

choicesEl.innerHTML="";

const choices=[...q.c]
.sort(()=>Math.random()-0.5);

choices.forEach(choice=>{

const btn=document.createElement("button");

btn.textContent=choice;

btn.onclick=()=>answer(btn,choice);

choicesEl.appendChild(btn);

});

}

function answer(btn,choice){

if(answered) return;

answered=true;

const q=questions[current];

document.querySelectorAll("#choices button")
.forEach(b=>{

b.disabled=true;

if(b.textContent===q.a){

b.classList.add("correct");

}

});

if(choice===q.a){

score++;

resultEl.textContent=
`正解！ ${q.e}`;

btn.classList.add("correct");

}else{

btn.classList.add("wrong");

resultEl.textContent=
`不正解！ 正解:${q.a}
　${q.e}`;

}

scoreEl.textContent=
`スコア:${score}`;

setTimeout(()=>{

current++;

showQuestion();

},1800);

}

function finish(){

bar.style.width="100%";

questionEl.textContent=
"結果発表";

choicesEl.innerHTML=`
<h3>
50問中 ${score}問正解
</h3>

<button onclick="location.reload()">
もう一度挑戦
</button>
`;

resultEl.textContent="";

}

showQuestion();