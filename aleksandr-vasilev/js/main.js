// Данные прототипа. Ноябрь 2026 — из поста ВК #880 (31.10.2026); декабрь — для примера.
var CITIES = [
  { id: "boguchar", name: "Богучар", role: "Основное место практики", by: "alex",
    dates: [ ["2026-11-03", "2026-11-15", ""], ["2026-12-01", "2026-12-14", "для примера"] ],
    address: "❓ адрес уточнить", pay: "Оплата на приёме" },
  { id: "voronezh", name: "Воронеж", role: "Выездной приём", by: "maria",
    dates: [ ["2026-11-17", "2026-11-22", ""], ["2026-12-16", "2026-12-21", "для примера"] ],
    address: "❓ адрес уточнить", pay: "Оплата на приёме" },
  { id: "moscow", name: "Москва", role: "Выездной приём", by: "maria",
    dates: [ ["2026-11-28", "2026-11-29", ""] ],
    address: "❓ адрес уточнить", pay: "Предоплата 50% при записи" },
  { id: "belgorod", name: "Белгород", role: "Приём по набору группы", by: "maria",
    dates: [], wait: "Даты появятся, когда наберётся лист ожидания",
    address: "❓ адрес уточнить", pay: "Оплата на приёме" }
];
var WHO = {
  alex:  "В Богучар записывает Александр: Telegram @osteo_vasilev или MAX +7 951 874‑98‑16.",
  maria: "Сюда записывает Мария, ассистент: Telegram @osteo_admin или MAX +7 910 344‑25‑87."
};
var M = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
var TODAY = new Date(); TODAY.setHours(0,0,0,0);

function d(s){ var p = s.split("-"); return new Date(+p[0], +p[1]-1, +p[2]); }
function range(a, b){
  var x = d(a), y = d(b);
  return x.getMonth() === y.getMonth()
    ? x.getDate() + "–" + y.getDate() + " " + M[y.getMonth()]
    : x.getDate() + " " + M[x.getMonth()] + " – " + y.getDate() + " " + M[y.getMonth()];
}
function status(a, b){
  var x = d(a), y = d(b);
  if (y < TODAY) return null;
  if (x <= TODAY) return ["now", "идёт приём"];
  var days = Math.round((x - TODAY) / 864e5);
  return days <= 14 ? ["soon", "через " + days + " дн."] : ["", "запись открыта"];
}

// ближайшие приёмы на первом экране
(function(){
  var rows = [];
  CITIES.forEach(function(c){
    var first = c.dates.filter(function(r){ return status(r[0], r[1]); })[0];
    if (first) rows.push([d(first[0]), c, first]);
    else if (c.wait) rows.push([new Date(9e15), c, null]);
  });
  rows.sort(function(a, b){ return a[0] - b[0]; });
  document.getElementById("next-list").innerHTML = rows.map(function(r){
    var st = r[2] ? status(r[2][0], r[2][1]) : ["", "лист ожидания"];
    return '<div class="next-row"><span><b>' + r[1].name + '</b><br>' +
      (r[2] ? range(r[2][0], r[2][1]) : "даты позже") + '</span><span class="tag ' + st[0] + '">' + st[1] + '</span></div>';
  }).join("");
})();

// вкладки городов
var tabs = document.getElementById("city-tabs"),
    card = document.getElementById("city-card"),
    sel = document.getElementById("f-city"),
    route = document.getElementById("book-route");

sel.innerHTML = CITIES.map(function(c){ return '<option value="' + c.id + '">' + c.name + '</option>'; }).join("");
tabs.innerHTML = CITIES.map(function(c){ return '<button type="button" data-id="' + c.id + '">' + c.name + '</button>'; }).join("");

function showCity(id){
  var c = CITIES.filter(function(x){ return x.id === id; })[0];
  [].forEach.call(tabs.children, function(b){ b.classList.toggle("on", b.dataset.id === id); });
  var live = c.dates.filter(function(r){ return status(r[0], r[1]); });
  var list = live.length
    ? live.map(function(r){
        var st = status(r[0], r[1]);
        return '<li><b>' + range(r[0], r[1]) + '</b><span class="tag ' + st[0] + '">' +
          (r[2] ? r[2] : st[1]) + '</span></li>';
      }).join("")
    : '<li><b>' + (c.wait || "Даты скоро") + '</b><span class="tag soon">лист ожидания</span></li>';
  card.innerHTML = '<h3>' + c.name + '</h3><p class="role">' + c.role + '</p><ul class="dates">' + list + '</ul>' +
    '<div class="kv"><div><b>Адрес:</b> ' + c.address + '</div><div><b>Оплата:</b> ' + c.pay + '</div>' +
    '<div><b>Запись:</b> ' + (c.by === "alex" ? "через Александра" : "через Марию") + '</div></div>';
  sel.value = id;
  route.textContent = WHO[c.by];
  document.getElementById("f-wait").checked = !live.length;
}
tabs.addEventListener("click", function(e){ if (e.target.dataset.id) showCity(e.target.dataset.id); });
sel.addEventListener("change", function(){ showCity(sel.value); });
showCity("voronezh");

// заявка (демо)
document.getElementById("book").addEventListener("submit", function(e){
  e.preventDefault();
  var name = document.getElementById("f-name"), contact = document.getElementById("f-contact");
  [name, contact].forEach(function(i){ i.style.outline = i.value.trim() ? "" : "3px solid #F1DDCF"; });
  if (!name.value.trim() || !contact.value.trim()) return;
  var c = CITIES.filter(function(x){ return x.id === sel.value; })[0];
  var wait = document.getElementById("f-wait").checked;
  document.getElementById("thanks-text").textContent = name.value.trim() + ", заявка " +
    (wait ? "в лист ожидания (" + c.name + ") " : "на приём в городе " + c.name + " ") +
    "получена. " + (c.by === "alex" ? "Александр" : "Мария") + " напишет вам в течение дня.";
  this.classList.add("done");
});

// варианты оффера (для обсуждения)
var OFFERS = [
  { e: "Телесный практик · с 2009 года",
    t: 'Мягкая работа с телом <em>для всей семьи</em>: от малышей до бабушек',
    l: "Я Александр Васильев. Сам провожу каждый сеанс: без конвейера, без ассистентов на кушетке. Принимаю в Богучаре, а также выезжаю в Воронеж, Москву и Белгород по расписанию." },
  { e: "Александр Васильев · телесный практик",
    t: 'Тело помнит всё. <em>Помогаю ему отпустить</em> лишнее напряжение',
    l: "Бережные индивидуальные сеансы для взрослых и детей с 1 месяца. 17 лет практики руками. Богучар, Воронеж, Москва, Белгород." },
  { e: "17 лет практики · 4 города",
    t: 'Один специалист, <em>к которому приходят годами</em> и приводят родных',
    l: "Я Александр Васильев, телесный практик. Начинал с массажа, освоил остеопатические техники и сложил свой подход. Работаю лично, мягко и без шаблонов." }
];
document.querySelector(".variants").addEventListener("click", function(e){
  var v = e.target.dataset.v; if (v === undefined) return;
  [].forEach.call(this.querySelectorAll("button"), function(b){ b.classList.toggle("on", b.dataset.v === v); });
  document.getElementById("hero-eyebrow").textContent = OFFERS[v].e;
  document.getElementById("hero-title").innerHTML = OFFERS[v].t;
  document.getElementById("hero-lead").textContent = OFFERS[v].l;
});

// пометки прототипа
document.getElementById("toggle-notes").addEventListener("click", function(){
  var on = document.body.classList.toggle("clean");
  this.textContent = on ? "Показать пометки" : "Скрыть пометки";
});

// появление при прокрутке
var io = new IntersectionObserver(function(es){
  es.forEach(function(x){ if (x.isIntersecting){ x.target.classList.add("in"); io.unobserve(x.target); } });
}, { threshold: .12 });
[].forEach.call(document.querySelectorAll(".rv"), function(el){ io.observe(el); });
