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

// Вкладки «Уроки-миры»
document.querySelectorAll('.worlds__tabs button').forEach((b) => b.addEventListener('click', () => {
  const w = b.dataset.world;
  document.querySelectorAll('.worlds__tabs button').forEach((x) => x.classList.toggle('is-active', x === b));
  document.querySelectorAll('.world').forEach((x) => x.classList.toggle('is-active', x.dataset.world === w));
}));

// Квиз «Подберём занятия»
const FORMATS = {
  'Индивидуально': { price: 'Цена — уточняется', why: 'Программа под цель и темп, всё внимание преподавателя — только вам.' },
  'В паре': { price: '1 200 ₽ / 60 минут', why: 'Вдвоём спокойнее и веселее: занимаетесь с тем, кто близок по интересам.' },
  'Мини-группа': { price: '900 ₽ / 60 минут', why: 'Каждая фраза звучит 3–5 раз — запоминается больше, а урок выходит выгоднее.' },
  'Разговорная группа': { price: '900 ₽ / 60 минут', why: 'Неформальные встречи 3–5 человек: болтаем на разные темы и подтягиваем английский в компании единомышленников.' },
};
function pickFormat() {
  const f = answers.fmt || 'Мини-группа';
  if (answers.who === 'adult' && f === 'Мини-группа') return 'Разговорная группа';
  return f;
}
const box = document.getElementById('quizBox');
const steps = box.querySelectorAll('.quiz__step');
const bar = document.getElementById('qBar');
const back = document.getElementById('qBack');
const answers = {};
let cur = 1;

function show(n) {
  cur = n;
  steps.forEach((s) => s.classList.toggle('is-active', +s.dataset.step === n));
  bar.style.width = Math.min((n - 1) / 3, 1) * 100 + '%';
  back.hidden = n === 1 || n === 5;
  if (n === 4) {
    const f = pickFormat();
    let why = FORMATS[f].why;
    if (answers.who !== 'adult' && f !== 'Разговорная группа') why += ' Уроки соберу вокруг любимого фильма или мультика.';
    if (answers.goal) why += ' Цель: ' + answers.goal + '.';
    document.getElementById('rFormat').textContent = f;
    document.getElementById('rPrice').textContent = FORMATS[f].price;
    document.getElementById('rWhy').textContent = why;
    document.querySelector('#form [name=fav]').closest('label').hidden = answers.who === 'adult';
  }
}

// Подписи второго вопроса для взрослых
const ADULT_GOALS = ['подтянуть английский', 'путешествовать и общаться', 'поговорить в компании единомышленников'];
const KID_GOALS = ['подтянуть оценки', 'сдать ЕГЭ', 'полюбить английский и начать говорить'];
const KID_LABELS = ['Подтянуть оценки', 'Сдать ЕГЭ', 'Полюбить английский и начать говорить'];
const ADULT_LABELS = ['Подтянуть английский', 'Говорить свободнее в поездках', 'Разговоры в компании единомышленников'];
function setGoals(adult) {
  box.querySelectorAll('[data-step="2"] .opts button').forEach((b, i) => {
    b.dataset.v = (adult ? ADULT_GOALS : KID_GOALS)[i];
    b.lastChild.textContent = (adult ? ADULT_LABELS : KID_LABELS)[i];
  });
  const fmt = box.querySelectorAll('[data-step="3"] .opts button');
  fmt[1].lastChild.textContent = adult ? 'Вдвоём — с другом, партнёром или коллегой' : 'Вдвоём — с другом, братом или сестрой';
  fmt[2].lastChild.textContent = adult ? 'Разговорная группа 3–5 человек' : 'В компании 3–5 человек, выгоднее';
}

box.querySelectorAll('.opts button').forEach((b) => b.addEventListener('click', () => {
  answers[b.dataset.k] = b.dataset.v;
  if (b.dataset.k === 'who') {
    setGoals(b.dataset.v === 'adult');
    if (b.dataset.v === 'exam') { answers.goal = 'сдать ЕГЭ'; show(3); return; }
  }
  show(cur + 1);
}));
back.addEventListener('click', () => show(Math.max(1, cur - 1)));

// Кнопки «Записаться» на талонах — сразу к результату с выбранным форматом
document.querySelectorAll('[data-format]').forEach((a) => a.addEventListener('click', () => {
  answers.fmt = a.dataset.format;
  if (a.dataset.format === 'Разговорная группа') { answers.who = 'adult'; answers.fmt = 'Мини-группа'; }
  answers.goal = answers.goal || 'подберём на знакомстве';
  show(4);
}));

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  show(5);
});
