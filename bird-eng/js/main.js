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

// Квиз «Подберём формат»
const FORMATS = {
  'Индивидуально': { price: 'Цена — уточняется', why: 'Программа под вашу цель и темп, всё внимание преподавателя — вам.' },
  'В паре': { price: '1 200 ₽ / 60 минут', why: 'Спокойнее, чем в группе: занимаетесь с тем, кто близок по интересам.' },
  'Мини-группа': { price: '900 ₽ / 60 минут', why: 'Каждая фраза звучит 3–5 раз — запоминается больше, а урок выходит выгоднее.' },
};
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
    const f = answers.fmt || 'Мини-группа';
    document.getElementById('rFormat').textContent = f;
    document.getElementById('rPrice').textContent = FORMATS[f].price;
    document.getElementById('rWhy').textContent = FORMATS[f].why + ' Цель: ' + (answers.goal || '').toLowerCase() + '.';
  }
}

box.querySelectorAll('.opts button').forEach((b) => b.addEventListener('click', () => {
  answers[b.dataset.k] = b.dataset.v;
  show(cur + 1);
}));
back.addEventListener('click', () => show(Math.max(1, cur - 1)));

// Кнопки «Записаться» на талонах — сразу к результату с выбранным форматом
document.querySelectorAll('[data-format]').forEach((a) => a.addEventListener('click', () => {
  answers.fmt = a.dataset.format;
  answers.goal = answers.goal || 'подберём на знакомстве';
  show(4);
}));

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  show(5);
});
