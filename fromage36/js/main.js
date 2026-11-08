/* Прототип сайта «Француженка»: шапка, корзина, расчёт доставки, каталог, карточка, статья. */
(function () {
  var D = window.DATA, T = window.typo;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var t = function (s) { return T(esc(s)); };
  var rub = function (n) { return n == null ? "" : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽"; };
  var byId = function (id) { return D.items.filter(function (i) { return i.id === id; })[0] || D.sets.filter(function (i) { return i.id === id; })[0]; };
  var STOCK = { "in": "В наличии", few: "Осталось немного", out: "Созревает", ask: "Под заказ" };
  var MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  var DAYS = ["в воскресенье", "в понедельник", "во вторник", "в среду", "в четверг", "в пятницу", "в субботу"];

  /* ---------- доставка: ближайший день и дедлайн ---------- */
  function nextDelivery(city, now) {
    now = now || new Date();
    if (city.day == null) return null;
    for (var k = 0; k < 15; k++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + k);
      if (d.getDay() !== city.day) continue;
      var back = (city.day - city.dlDay + 7) % 7 || 7;
      var dl = new Date(d.getFullYear(), d.getMonth(), d.getDate() - back, city.dlHour);
      if (now < dl) return { date: d, deadline: dl };
    }
    return null;
  }
  function fmt(d) { return DAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()]; }
  function fmtDl(d) { return d.getDate() + " " + MONTHS[d.getMonth()] + " до " + d.getHours() + ":00"; }

  /* ---------- корзина (localStorage — только удобство, без него всё работает) ---------- */
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem("fr-cart") || "{}"); } catch (e) { cart = {}; }
  var city = "vrn";
  try { city = localStorage.getItem("fr-city") || "vrn"; } catch (e) {}
  function save() { try { localStorage.setItem("fr-cart", JSON.stringify(cart)); localStorage.setItem("fr-city", city); } catch (e) {} }
  function count() { var n = 0; for (var k in cart) n += cart[k]; return n; }
  function sum() { var s = 0; for (var k in cart) { var it = byId(k); if (it && it.price) s += it.price * cart[k]; } return s; }
  function add(id) { cart[id] = (cart[id] || 0) + 1; save(); drawCart(); toast("Добавили в корзину: " + byId(id).name); }
  window.frAdd = add;

  function toast(msg) {
    var el = $(".toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }
  window.frToast = toast;

  /* ---------- шапка, подвал, корзина ---------- */
  function shell() {
    var head = document.createElement("header");
    head.className = "top";
    head.innerHTML = '<div class="wrap">' +
      '<a class="logo" href="index.html"><span class="mark"><i class="ti ti-cheese"></i></span><span><b>Француженка</b><small>СЫРНАЯ МАСТЕРСКАЯ</small></span></a>' +
      '<nav class="nav"><a href="catalog.html">Каталог</a><a href="index.html#sets">Наборы</a><a href="index.html#buy">Доставка и магазины</a><a href="index.html#awards">Награды</a><a href="index.html#story">О нас</a></nav>' +
      '<button class="burger" aria-label="Меню"><i class="ti ti-menu-2"></i></button>' +
      '<button class="cart-btn" aria-label="Корзина"><i class="ti ti-shopping-bag"></i><span class="t">Корзина</span><span class="cnt">0</span></button></div>';
    document.body.prepend(head);
    $(".burger").onclick = function () { document.body.classList.toggle("menu"); };
    $(".cart-btn").onclick = openCart;

    var f = document.createElement("footer");
    f.innerHTML = '<div class="wrap">' +
      '<div><b>Сырная мастерская «Француженка»</b>Сыры с белой плесенью по французским технологиям. Сами принимаем молоко, сами заквашиваем, сами ухаживаем за каждой головкой.<br><br>ООО «Сыр от Луи» · <a href="#">Оферта</a> · <a href="#">Политика конфиденциальности</a></div>' +
      '<div><b>Магазин при сыроварне</b>г. Богучар, ул. Дзержинского, 198<div class="need" style="margin-top:10px">режим работы нового магазина</div></div>' +
      '<div><b>Связаться</b><a href="tel:+79304016187">+7 930 401-61-87</a><br>info@fromage36.ru<br><br><a href="https://vk.ru/fromage36">ВКонтакте</a> · <a href="https://t.me/fromage36">Telegram</a></div>' +
      '<div class="proto">Это прототип. Фото — заглушки, формы ничего не отправляют, наличие показано для примера. Цены и тексты — с сайта сыр36.рф и из постов группы ВКонтакте на 8 ноября 2026.</div></div>';
    document.body.append(f);

    var bg = document.createElement("div"); bg.className = "drawer-bg"; bg.onclick = closeCart;
    var dr = document.createElement("aside"); dr.className = "drawer";
    dr.innerHTML = '<header><h3>Корзина</h3><button class="x" aria-label="Закрыть">×</button></header><div class="in"></div>';
    document.body.append(bg, dr);
    $(".x", dr).onclick = closeCart;
    var tst = document.createElement("div"); tst.className = "toast"; document.body.append(tst);
    drawCart();
  }
  function openCart() { document.body.classList.add("cart-open"); }
  function closeCart() { document.body.classList.remove("cart-open"); }
  window.frOpenCart = openCart;

  function drawCart(done) {
    $(".cart-btn .cnt").textContent = count();
    var box = $(".drawer .in");
    if (done) {
      box.innerHTML = '<div class="ok-box"><i class="ti ti-circle-check"></i><h3>Заказ принят</h3><p>' + t(done) + '</p><p class="src">В прототипе заказ никуда не уходит.</p></div>';
      return;
    }
    if (!count()) { box.innerHTML = '<div class="empty"><i class="ti ti-cheese" style="font-size:48px"></i><p>Пока пусто. Загляните в <a href="catalog.html">каталог</a> или соберите <a href="index.html#sets">набор</a>.</p></div>'; return; }
    var c = D.delivery.filter(function (x) { return x.id === city; })[0];
    var s = sum(), nd = nextDelivery(c);
    var lines = Object.keys(cart).map(function (id) {
      var it = byId(id);
      return '<div class="line"><div><b>' + t(it.name) + '</b><small>' + (it.price ? rub(it.price) : "цена по запросу") + (it.weight ? " · " + esc(it.weight) : "") + '</small></div>' +
        '<div class="qty"><button data-m="' + id + '">−</button>' + cart[id] + '<button data-p="' + id + '">+</button></div><b>' + (it.price ? rub(it.price * cart[id]) : "—") + '</b></div>';
    }).join("");
    var opts = D.delivery.map(function (x) { return '<option value="' + x.id + '"' + (x.id === city ? " selected" : "") + '>' + esc(x.city) + '</option>'; }).join("");
    var info = nd ? 'Привезём <b>' + fmt(nd.date) + '</b>. Заказ принимаем до ' + fmtDl(nd.deadline) + '.' : t(c.dayName + ", " + c.dlText + ".");
    var bar = "";
    if (c.free) {
      var left = c.free - s;
      bar = left > 0 ? '<p style="margin:0;font-size:14px">До бесплатной доставки — ещё <b>' + rub(left) + '</b>. Можно сделать общий заказ с коллегами или соседями.</p><div class="bar"><i style="width:' + Math.min(100, s / c.free * 100) + '%"></i></div>'
        : '<p style="margin:0;font-size:14px;color:var(--ok);font-weight:700">Доставка бесплатная</p><div class="bar"><i style="width:100%"></i></div>';
    }
    box.innerHTML = lines +
      '<div><label>Куда везти</label><select id="city">' + opts + '</select></div>' +
      '<div class="pair">' + info + '<br><small>' + t(c.note) + '</small></div>' + bar +
      '<div class="total"><span>Итого</span><span>' + rub(s) + '</span></div>' +
      '<form id="order" style="display:grid;gap:10px"><div><label>Имя</label><input required placeholder="Как к вам обращаться"></div>' +
      '<div><label>Телефон</label><input required type="tel" placeholder="+7"></div>' +
      '<div><label>Адрес или пожелания</label><textarea rows="2" placeholder="Например: камамбер помоложе, к пятнице"></textarea></div>' +
      '<button class="btn main" style="justify-content:center">Оформить заказ</button><p class="src" style="margin:0">Оплата — после подтверждения заказа, способы оплаты уточним.</p></form>';
    box.querySelectorAll("[data-p]").forEach(function (b) { b.onclick = function () { cart[b.dataset.p]++; save(); drawCart(); }; });
    box.querySelectorAll("[data-m]").forEach(function (b) { b.onclick = function () { if (--cart[b.dataset.m] <= 0) delete cart[b.dataset.m]; save(); drawCart(); }; });
    $("#city", box).onchange = function () { city = this.value; save(); drawCart(); };
    $("#order", box).onsubmit = function (e) {
      e.preventDefault();
      var msg = nd ? "Привезём " + fmt(nd.date) + ". Анастасия перезвонит, чтобы подтвердить состав и стадию созревания." : "Анастасия перезвонит, чтобы согласовать дату доставки.";
      cart = {}; save(); drawCart(msg);
    };
  }

  /* ---------- карточка товара в сетке ---------- */
  function card(it) {
    var btn = it.stock === "out" ? '<button class="add alt" onclick="frToast(\'Напишем, когда сыр созреет\')">Сообщить</button>'
      : it.price ? '<button class="add" onclick="frAdd(\'' + it.id + '\')">В корзину</button>'
        : '<button class="add alt" onclick="frAdd(\'' + it.id + '\')">Под заказ</button>';
    return '<article class="card rv"><a href="item.html?id=' + it.id + '" class="photo" style="position:relative"><span class="label">' + esc(it.weight || "вес уточним") + '</span><span><i class="ti ti-photo"></i>Фото: ' + t(it.name.toLowerCase()) + ' в разрезе</span></a>' +
      '<div class="body"><span class="stock ' + it.stock + '">' + STOCK[it.stock] + '</span><h3><a href="item.html?id=' + it.id + '">' + t(it.name) + '</a></h3><p class="short">' + t(it.short) + '</p>' +
      '<div class="row"><span class="price">' + (it.price ? rub(it.price) : '<small>цена по запросу</small>') + '</span>' + btn + '</div></div></article>';
  }

  /* ---------- главная ---------- */
  function home() {
    // ближайшая доставка
    var sel = $("#near-city"), out = $("#near-out");
    function near() {
      var c = D.delivery.filter(function (x) { return x.id === sel.value; })[0], nd = nextDelivery(c);
      out.innerHTML = nd ? "<h3>Привезём " + fmt(nd.date) + "</h3><p>Успейте заказать до " + fmtDl(nd.deadline) + (c.free ? ". От " + rub(c.free) + " — бесплатно" : "") + "</p>"
        : "<h3>" + t(c.city + ": " + c.dayName) + "</h3><p>" + t(c.dlText + ". " + c.note) + "</p>";
    }
    sel.innerHTML = D.delivery.map(function (x) { return '<option value="' + x.id + '">' + esc(x.city) + '</option>'; }).join("");
    sel.value = city; sel.onchange = function () { city = sel.value; save(); near(); drawCart(); }; near();

    $("#cats").innerHTML = D.sections.map(function (s) {
      var ps = D.items.filter(function (i) { return i.section === s.id && i.price; }).map(function (i) { return i.price; });
      return '<a class="cat rv" href="catalog.html?s=' + s.id + '"><i class="ti ' + s.icon + '"></i><h3>' + t(s.name) + '</h3><p>' + t(s.note) + '</p><span class="from">от ' + rub(Math.min.apply(null, ps)) + '</span></a>';
    }).join("");
    $("#hits").innerHTML = ["pyramid", "barrel", "camembert", "caciotta"].map(function (id) { return card(byId(id)); }).join("");

    // стадии
    var bs = $("#stages"), txt = $("#stage-text"), wheel = $(".wheel");
    bs.innerHTML = D.stages.map(function (s, i) { return '<button data-i="' + i + '"' + (i ? "" : ' class="on"') + '>' + esc(s.name) + '<small>' + esc(s.days) + '</small></button>'; }).join("");
    function stage(i) {
      bs.querySelectorAll("button").forEach(function (b, j) { b.classList.toggle("on", i === j); });
      txt.innerHTML = '<p style="margin:0">' + t(D.stages[i].text) + '</p>';
      wheel.style.setProperty("--melt", [0.15, 0.55, 1][i]); wheel.style.setProperty("--blur", ["0px", "4px", "10px"][i]);
    }
    bs.onclick = function (e) { var b = e.target.closest("button"); if (b) stage(+b.dataset.i); }; stage(0);

    $("#sets-list").innerHTML = D.sets.map(function (s) {
      return '<div class="set rv"><div class="photo"><span><i class="ti ti-gift"></i>Фото: ' + t(s.name.toLowerCase()) + '</span></div><h3>' + t(s.name) + '</h3><p>' + t(s.text) + '</p><div class="row" style="display:flex;justify-content:space-between;align-items:center;margin-top:auto"><span class="price">' + rub(s.price) + '</span><button class="add" onclick="frAdd(\'' + s.id + '\')">В корзину</button></div></div>';
    }).join("") + '<div class="set custom rv"><i class="ti ti-sparkles" style="font-size:36px;color:var(--cheese)"></i><h3>Собрать свой</h3><p>Только белая плесень, всего по одному или большой набор с вином. Расскажите, кому подарок, — пришлём варианты.</p><a class="btn cheese sm" href="#" onclick="frToast(\'В рабочей версии — форма с пожеланиями\');return false">Подобрать набор</a></div>';

    $("#awards-list").innerHTML = D.awards.map(function (a) { return '<div class="award rv"><span class="y">' + a.year + '</span><div><b>' + t(a.name) + '</b><span>' + t(a.what) + '</span></div></div>'; }).join("");
    $("#del-list").innerHTML = D.delivery.map(function (c) { return '<div class="del"><b>' + esc(c.city) + '</b><span class="when">' + t(c.dayName) + '</span><span>' + t(c.dlText) + (c.free ? ", бесплатно от " + rub(c.free) : "") + '</span><span></span></div>'; }).join("");
    $("#shops").innerHTML = D.shops.map(function (s) { return '<h4>' + esc(s.city) + '</h4><ul>' + s.list.map(function (l) { return '<li>' + t(l) + '</li>'; }).join("") + '</ul>'; }).join("");
    $("#reviews").innerHTML = D.reviews.map(function (r) { return '<div class="review rv"><i class="ti ti-quote" style="font-size:28px;color:var(--rind)"></i><p>' + t(r.text) + '</p><small><b>' + esc(r.name) + '</b>, ' + esc(r.date) + ' · ' + esc(r.src) + '</small></div>'; }).join("");
    $("#arts").innerHTML = D.articles.map(function (a) { return '<a class="art rv" href="article.html?id=' + a.id + '"><div class="photo"><span><i class="ti ti-photo"></i>Фото к статье</span></div><div class="t"><h3>' + t(a.title) + '</h3><p>' + t(a.lead) + '</p></div></a>'; }).join("");
    $("#faq").innerHTML = D.faq.map(function (f) { return '<details><summary>' + t(f.q) + '</summary><p>' + t(f.a) + '</p></details>'; }).join("");
  }

  /* ---------- каталог ---------- */
  function catalog() {
    var q = "", sec = new URLSearchParams(location.search).get("s") || "all", onlyIn = false;
    $("#chips").innerHTML = '<button class="chip" data-s="all">Все сыры</button>' + D.sections.map(function (s) { return '<button class="chip" data-s="' + s.id + '">' + esc(s.name) + '</button>'; }).join("");
    function draw() {
      $("#chips").querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c.dataset.s === sec); });
      var list = D.items.filter(function (i) {
        return (sec === "all" || i.section === sec) && (!onlyIn || i.stock === "in" || i.stock === "few") &&
          (i.name + " " + i.short).toLowerCase().indexOf(q) >= 0;
      });
      $("#list").innerHTML = list.length ? list.map(card).join("") : '<p class="empty">Ничего не нашли. Напишите нам — подскажем похожий сыр.</p>';
      reveal();
    }
    $("#chips").onclick = function (e) { var c = e.target.closest(".chip"); if (c) { sec = c.dataset.s; draw(); } };
    $("#q").oninput = function () { q = this.value.trim().toLowerCase(); draw(); };
    $("#only-in").onchange = function () { onlyIn = this.checked; draw(); };
    draw();
  }

  /* ---------- карточка ---------- */
  function item() {
    var it = byId(new URLSearchParams(location.search).get("id")) || D.items[0];
    document.title = it.name + " — Француженка";
    var s = D.sections.filter(function (x) { return x.id === it.section; })[0];
    var btn = it.stock === "out" ? '<button class="btn main" onclick="frToast(\'Напишем, когда сыр созреет\')"><i class="ti ti-bell"></i>Сообщить о поступлении</button>'
      : '<button class="btn main" onclick="frAdd(\'' + it.id + '\')"><i class="ti ti-shopping-bag"></i>' + (it.price ? "В корзину" : "Заказать") + '</button>';
    var ripe = it.ripe ? '<h3 style="margin-top:28px">Какой камамбер выбрать</h3><div class="stages">' + D.stages.map(function (st, i) { return '<button' + (i ? "" : ' class="on"') + '>' + esc(st.name) + '<small>' + esc(st.days) + '</small></button>'; }).join("") + '</div><p class="src">В заказе можно указать стадию — подберём головку с нужной датой изготовления.</p>' : "";
    $("#item").innerHTML = '<div class="photo"><span><i class="ti ti-photo"></i>Фото: ' + t(it.name.toLowerCase()) + ' целиком и в разрезе</span></div><div>' +
      '<div class="crumbs"><a href="catalog.html">Каталог</a> / <a href="catalog.html?s=' + s.id + '">' + esc(s.name) + '</a></div>' +
      '<span class="stock ' + it.stock + '">' + STOCK[it.stock] + ' <small style="font-weight:400">(для примера)</small></span><h1 style="font-size:52px;margin-top:8px">' + t(it.name) + '</h1>' +
      '<p class="lead">' + t(it.short) + '</p><div class="buybox"><span class="price" style="font-size:30px">' + (it.price ? rub(it.price) : "Цена по запросу") + '</span>' + (it.weight ? '<span class="label" style="position:static">' + esc(it.weight) + '</span>' : "") + btn + '</div>' +
      (it.need ? '<div class="need">' + t(it.need) + '</div>' : "") +
      '<p>' + t(it.text) + '</p><dl class="facts">' + it.facts.map(function (f) { return '<div><dt>' + t(f[0]) + '</dt><dd>' + t(f[1]) + '</dd></div>'; }).join("") + '</dl>' +
      '<div class="pair"><b>С чем подавать:</b> ' + t(it.pair) + '</div>' + ripe +
      '<p class="src" style="margin-top:24px">Источник: ' + esc(it.src) + '</p></div>';
    var sb = $("#item .stages");
    if (sb) sb.onclick = function (e) { var b = e.target.closest("button"); if (b) sb.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); };
    $("#more").innerHTML = D.items.filter(function (i) { return i.id !== it.id && i.section === it.section; }).concat(D.items.filter(function (i) { return i.section !== it.section; })).slice(0, 4).map(card).join("");
  }

  /* ---------- статья ---------- */
  function article() {
    var a = D.articles.filter(function (x) { return x.id === new URLSearchParams(location.search).get("id"); })[0] || D.articles[0];
    document.title = a.title + " — Француженка";
    $("#article").innerHTML = '<div class="crumbs"><a href="index.html#tips">Советы сыровара</a></div><h1 style="font-size:52px">' + t(a.title) + '</h1><p class="lead">' + t(a.lead) + '</p>' +
      '<div class="photo"><span><i class="ti ti-photo"></i>Фото к статье</span></div>' + a.body.map(function (p) { return '<p>' + t(p) + '</p>'; }).join("") +
      '<div class="pair" style="margin-top:28px">Хотите попробовать? <a href="catalog.html">Перейти в каталог</a></div><p class="src">Источник: ' + esc(a.src) + '</p>';
  }

  function reveal() {
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }); }, { threshold: .1 }) : null;
    document.querySelectorAll(".rv:not(.vis)").forEach(function (el) { io ? io.observe(el) : el.classList.add("vis"); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    shell();
    var p = document.body.dataset.page;
    if (p === "home") home();
    if (p === "catalog") catalog();
    if (p === "item") item();
    if (p === "article") article();
    reveal();
  });
})();
