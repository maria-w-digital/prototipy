// Меню на мобильном
document.getElementById('burger').addEventListener('click', () => {
  document.getElementById('nav').classList.toggle('is-open');
});

// Появление при прокрутке
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Часовые пояса: Благовещенск UTC+9
function fmt(date, tz) {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: tz });
}
function tick() {
  const now = new Date();
  document.getElementById('tzKatya').textContent = fmt(now, 'Asia/Yakutsk');
  document.getElementById('tzYou').textContent = fmt(now);
}
tick();
setInterval(tick, 30000);

// Мини-квизы в уроках
document.querySelectorAll('.mini-quiz').forEach((q) => {
  const res = q.querySelector('.mini-quiz__res');
  q.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    q.querySelectorAll('button').forEach((x) => x.classList.remove('ok', 'bad'));
    const right = b.dataset.v === q.dataset.answer;
    b.classList.add(right ? 'ok' : 'bad');
    res.textContent = right ? 'Верно!' : 'Почти. Попробуйте ещё раз';
  }));
});

// Вкладки «Тематические уроки»
document.querySelectorAll('.worlds__tabs button').forEach((b) => b.addEventListener('click', () => {
  const w = b.dataset.world;
  document.querySelectorAll('.worlds__tabs button').forEach((x) => x.classList.toggle('is-active', x === b));
  document.querySelectorAll('.world').forEach((x) => x.classList.toggle('is-active', x.dataset.world === w));
}));

// Квиз «Подберём занятия»
const FORMATS = {
  'Индивидуально': { price: '1 700 ₽ / 60 минут', why: 'Программа под цель и темп, всё внимание — только одному ученику.' },
  'В паре': { price: '1 200 ₽ с человека / 60 минут', why: 'Вдвоём спокойнее и веселее: занимаетесь с тем, кто близок по интересам.' },
  'Мини-группа': { price: '900 ₽ с человека / 60 минут', why: 'Мини-группа 4–5 ребят одного возраста и уровня: фразы звучат по несколько раз, запоминается больше. Группы собираю под заявки.' },
  'Группа для взрослых': { price: '900 ₽ / встреча 60 минут', why: 'Мини-группа 4–5 взрослых, можно с нуля: говорим с первой встречи, грамматику берём на темах из жизни. Группу собираю под заявки.' },
};
function pickFormat() {
  if (answers.who === 'adult') return 'Группа для взрослых';
  return answers.fmt || 'Мини-группа';
}
const box = document.getElementById('quizBox');
const steps = box.querySelectorAll('.quiz__step');
const bar = document.getElementById('qBar');
const back = document.getElementById('qBack');
const answers = {};
let cur = 1;
const history = [];

function show(n, push = true) {
  if (push && n !== cur) history.push(cur);
  cur = n;
  steps.forEach((s) => s.classList.toggle('is-active', +s.dataset.step === n));
  bar.style.width = Math.min((n - 1) / 3, 1) * 100 + '%';
  back.hidden = n === 1 || n === 5;
  if (n === 4) {
    const f = pickFormat();
    let why = FORMATS[f].why;
    if (answers.goal) why += ' Цель: ' + answers.goal + '.';
    why += ' На бесплатном знакомстве (15–20 минут) узнаю уровень и подберу время.';
    document.getElementById('rFormat').textContent = f;
    document.getElementById('rPrice').textContent = FORMATS[f].price;
    document.getElementById('rWhy').textContent = why;
    document.querySelector('#form [name=fav]').closest('label').hidden = answers.who === 'adult';
  }
}

// Подписи второго вопроса для взрослых
const ADULT_GOALS = ['начать с нуля', 'подтянуть английский', 'говорить свободнее в поездках'];
const KID_GOALS = ['подтянуть оценки', 'подготовиться к ОГЭ', 'полюбить английский и начать говорить'];
const KID_LABELS = ['Подтянуть оценки', 'Подготовиться к ОГЭ', 'Полюбить английский и начать говорить'];
const ADULT_LABELS = ['Начать с нуля', 'Подтянуть английский', 'Говорить свободнее в поездках'];
function setGoals(adult) {
  box.querySelectorAll('[data-step="2"] .opts button').forEach((b, i) => {
    b.dataset.v = (adult ? ADULT_GOALS : KID_GOALS)[i];
    b.lastChild.textContent = (adult ? ADULT_LABELS : KID_LABELS)[i];
  });
}

box.querySelectorAll('.opts button').forEach((b) => b.addEventListener('click', () => {
  answers[b.dataset.k] = b.dataset.v;
  if (b.dataset.k === 'who') {
    setGoals(b.dataset.v === 'adult');
    if (b.dataset.v === 'oge') { answers.goal = 'подготовиться к ОГЭ'; show(3); return; }
  }
  // Взрослых Катя берёт только в мини-группу: вопрос о формате пропускаем
  if (b.dataset.k === 'goal' && answers.who === 'adult') { show(4); return; }
  show(cur + 1);
}));
back.addEventListener('click', () => show(history.pop() || 1, false));

// Кнопки «Записаться» в карточках цен — сразу к результату с выбранным форматом
document.querySelectorAll('[data-format]').forEach((a) => a.addEventListener('click', () => {
  answers.fmt = a.dataset.format;
  if (a.dataset.format === 'Группа для взрослых') { answers.who = 'adult'; }
  else if (answers.who === 'adult') { answers.who = 'kid'; }
  answers.goal = answers.goal || 'подберём на знакомстве';
  show(4);
}));

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  show(5);
});
