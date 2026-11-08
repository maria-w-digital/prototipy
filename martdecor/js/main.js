/* МАРТдекор — прототип: общие шапка и подвал, карточки, каталог, карточка товара, идеи, формы */
(function () {
  var D = window.MD, T = window.typo || function (s) { return s; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var rub = function (n) { return n.toLocaleString("ru-RU").replace(/\s/g, " ") + " ₽"; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); };
  var t = function (s) { return esc(T(s)); };
  var page = document.body.dataset.page;
  var secName = function (id) { var s = D.sections.filter(function (x) { return x.id === id; })[0]; return s ? s.name : ""; };

  /* открыто сейчас: пн–пт 10–19, сб–вс 10–17 (martdecor.online/contact-us) */
  function openNow() {
    var d = new Date(), day = d.getDay(), h = d.getHours() + d.getMinutes() / 60;
    var close = (day === 0 || day === 6) ? 17 : 19;
    if (h >= 10 && h < close) return {on: true, txt: "Салон открыт до " + close + ":00"};
    return {on: false, txt: "Сейчас закрыто · откроемся в 10:00"};
  }

  /* шапка */
  var o = openNow();
  var nav = [["catalog.html", "Каталог", "catalog"], ["index.html#podbor", "Подбор по проекту", "podbor"], ["ideas.html", "Идеи для стен", "ideas"], ["designers.html", "Дизайнерам и мастерам", "designers"], ["index.html#visit", "Как добраться", "visit"]];
  var head = '<div class="top"><div class="wrap"><span><i class="open-dot' + (o.on ? "" : " off") + '"></i>' + o.txt + ' · пр-т Михаила Нагибина, 30Л, Дизайн-центр WEST</span>' +
    '<span><a href="tel:+79094200420">+7 (909) 420-04-20</a> · <a href="https://wa.me/79094200420">WhatsApp</a> · Telegram · MAX</span></div></div>' +
    '<header class="main"><div class="wrap"><a class="logo" href="index.html"><span class="logo-arch"></span><span><small>интерьерный салон</small><b>МАРТдекор</b></span></a>' +
    '<nav class="menu">' + nav.map(function (n) { return '<a href="' + n[0] + '"' + (page === n[2] ? ' class="on"' : "") + ">" + n[1] + "</a>"; }).join("") + "</nav>" +
    '<a class="btn" href="index.html#brief"><i class="ti ti-photo-up"></i><span>Прислать проект</span></a></div></header>';
  document.body.insertAdjacentHTML("afterbegin", head);

  /* подвал */
  var foot = '<footer><div class="wrap"><div class="cols">' +
    '<div><a class="logo inv" href="index.html"><span class="logo-arch"></span><span><small>интерьерный салон</small><b>МАРТдекор</b></span></a><p style="margin-top:16px;max-width:300px">' + t("Материалы для стен в одном салоне. Ростов-на-Дону, с 2018 года.") + '</p></div>' +
    '<div><h5>Каталог</h5>' + D.sections.slice(0, 6).map(function (s) { return '<a href="catalog.html?sec=' + s.id + '">' + t(s.name) + "</a>"; }).join("") + "</div>" +
    '<div><h5>Салону</h5><a href="index.html#podbor">Подбор по проекту</a><a href="designers.html">Дизайнерам и мастерам</a><a href="ideas.html">Идеи для стен</a><a href="index.html#faq">Вопросы</a><a href="index.html#visit">Доставка и оплата</a></div>' +
    '<div><h5>Контакты</h5><a href="tel:+79094200420">+7 (909) 420-04-20</a><a href="mailto:info@martdecor.ru">info@martdecor.ru</a><a href="https://vk.ru/martdecoronline">ВКонтакте</a><a href="https://t.me/martdecorrostov">Telegram</a><p style="margin-top:8px">' + t("пн–пт 10:00–19:00, сб–вс 10:00–17:00") + "</p></div>" +
    '</div><div class="bottom"><span>ИП Арийская Людмила Руслановна · ИНН 231129240301 · ОГРНИП 319619600052602</span><span>' + t("Прототип для обсуждения: фото — заглушки, наличие показано для примера, формы ничего не отправляют. Веб-студия Марии Васильевой, ноябрь 2026") + "</span></div></div></footer>" +
    '<a class="btn float-cta" href="https://wa.me/79094200420"><i class="ti ti-brand-whatsapp"></i>Написать</a>';
  document.body.insertAdjacentHTML("beforeend", foot);

  /* карточка товара в сетке */
  function itemCard(it) {
    return '<a class="item rv" href="item.html?id=' + it.id + '"><div class="ph"><span><i class="ti ti-photo"></i>' + t("Фото: " + it.name) + "</span></div>" +
      '<div class="item-body"><span class="sample">' + t(secName(it.sec)) + "</span><h4>" + t(it.name) + '</h4><p class="muted" style="font-size:14px">' + t(it.short) + "</p>" +
      '<span class="badge' + (it.status === "few" ? " few" : "") + '">' + (it.status === "few" ? "Мало в наличии" : "Есть образец в салоне") + "</span>" +
      '<div class="price">' + rub(it.price) + " <small>/ " + esc(it.unit) + "</small></div></div></a>";
  }
  function byId(id) { return D.items.filter(function (x) { return x.id === id; })[0]; }

  /* разделы */
  $$("[data-cats]").forEach(function (el) {
    el.innerHTML = D.sections.map(function (s) {
      return '<a class="cat rv" href="catalog.html?sec=' + s.id + '"><div class="ph"><span><i class="ti ti-photo"></i>' + t(s.ph) + '</span></div><div class="cat-body"><h3>' + t(s.name) + "</h3><p>" + t(s.fact) + '</p><p class="from">' + t(s.from) + '</p><p class="muted" style="font-size:14px;margin-top:4px">' + s.count.toLocaleString("ru-RU").replace(/\s/g, " ") + " позиций в каталоге</p></div></a>";
    }).join("");
  });
  $$("[data-items]").forEach(function (el) {
    var ids = el.dataset.items.split(",");
    el.innerHTML = ids.map(function (id) { return itemCard(byId(id)); }).join("");
  });

  /* отзывы с переключателем */
  var rv = $("[data-reviews]");
  if (rv) {
    var draw = function (k) {
      rv.innerHTML = D[k].map(function (r) { return '<div class="rev rv in"><q>' + t(r.t) + '</q><div class="who"><b>' + t(r.n) + "</b>" + t(r.d) + "</div></div>"; }).join("");
    };
    $$("[data-rtab]").forEach(function (b) {
      b.onclick = function () { $$("[data-rtab]").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); draw(b.dataset.rtab); };
    });
    draw("reviewsPrivate");
  }

  /* идеи */
  $$("[data-ideas]").forEach(function (el) {
    el.innerHTML = D.ideas.map(function (i) {
      return '<a class="idea rv" href="ideas.html?id=' + i.id + '"><div class="ph"><span><i class="ti ti-photo"></i>' + t(i.ph) + "</span></div><h3>" + t(i.name) + "</h3><p>" + t(i.short) + "</p></a>";
    }).join("");
  });

  /* каталог: поиск, разделы, бренды, наличие, сортировка */
  if (page === "catalog") {
    var q = new URLSearchParams(location.search), st = {sec: q.get("sec") || "", text: "", brands: [], few: false, sort: "new"};
    var secBox = $("#f-sec"), brBox = $("#f-brand");
    secBox.innerHTML = '<label class="chk"><input type="radio" name="sec" value=""' + (st.sec ? "" : " checked") + "> Все разделы</label>" +
      D.sections.map(function (s) { var n = D.items.filter(function (i) { return i.sec === s.id; }).length; return '<label class="chk"><input type="radio" name="sec" value="' + s.id + '"' + (st.sec === s.id ? " checked" : "") + "> " + t(s.name) + "<em>" + n + "</em></label>"; }).join("");
    var brands = [];
    D.items.forEach(function (i) { if (i.brand !== "—" && brands.indexOf(i.brand) < 0) brands.push(i.brand); });
    brBox.innerHTML = brands.sort().map(function (b) { return '<label class="chk"><input type="checkbox" value="' + esc(b) + '"> ' + esc(b) + "</label>"; }).join("");
    var render = function () {
      var list = D.items.filter(function (i) {
        if (st.sec && i.sec !== st.sec) return false;
        if (st.brands.length && st.brands.indexOf(i.brand) < 0) return false;
        if (st.few && i.status !== "in") return false;
        if (st.text) { var hay = (i.name + " " + i.short + " " + i.brand + " " + secName(i.sec)).toLowerCase(); if (hay.indexOf(st.text) < 0) return false; }
        return true;
      });
      if (st.sort === "cheap") list.sort(function (a, b) { return a.price - b.price; });
      if (st.sort === "exp") list.sort(function (a, b) { return b.price - a.price; });
      $("#grid").innerHTML = list.map(itemCard).join("");
      $$("#grid .rv").forEach(function (x) { x.classList.add("in"); });
      $("#found").textContent = T("Показано " + list.length + " из " + D.items.length + " позиций выборки" + (st.sec ? " · раздел «" + secName(st.sec) + "»" : ""));
      $("#empty").style.display = list.length ? "none" : "block";
      $("#cat-title").textContent = st.sec ? secName(st.sec) : "Каталог материалов";
    };
    $$("input[name=sec]").forEach(function (r) { r.onchange = function () { st.sec = r.value; render(); }; });
    $$("#f-brand input").forEach(function (c) { c.onchange = function () { st.brands = $$("#f-brand input:checked").map(function (x) { return x.value; }); render(); }; });
    $("#f-stock").onchange = function (e) { st.few = e.target.checked; render(); };
    $("#f-sort").onchange = function (e) { st.sort = e.target.value; render(); };
    $("#q").oninput = function (e) { st.text = e.target.value.trim().toLowerCase(); render(); };
    render();
  }

  /* карточка товара */
  if (page === "item") {
    var it = byId(new URLSearchParams(location.search).get("id")) || D.items[0];
    document.title = it.name + " — МАРТдекор";
    var calc = "";
    if (it.calc === "oboi") {
      calc = '<div class="calc"><b>Сколько рулонов нужно</b><div class="two"><label class="field">Периметр комнаты, м<input id="c-p" type="number" value="16" min="1"></label><label class="field">Высота стен, м<input id="c-h" type="number" value="2.7" step="0.1" min="1"></label></div><div class="res" id="c-res"></div><p class="note-demo">' + t("Считаем с учётом раппорта " + Math.round(it.roll.rap * 100) + " см, без вычета окон и дверей. Точный расчёт по плану сделает менеджер.") + "</p></div>";
    } else if (it.calc === "len") {
      calc = '<div class="calc"><b>Сколько планок нужно</b><label class="field">Длина по периметру, м<input id="c-l" type="number" value="16" min="1"></label><div class="res" id="c-res"></div><p class="note-demo">' + t("Планка " + it.len + " м, запас 10% на подрезку углов. Угловые элементы менеджер подберёт отдельно.") + "</p></div>";
    } else if (it.calc === "m2") {
      calc = '<div class="calc"><b>Стоимость под вашу стену</b><div class="two"><label class="field">Ширина стены, м<input id="c-w" type="number" value="3.5" step="0.1" min="0.5"></label><label class="field">Высота, м<input id="c-h2" type="number" value="2.7" step="0.1" min="0.5"></label></div><div class="res" id="c-res"></div><p class="note-demo">' + t("Ориентир по цене за м². Фреску печатают по размеру стены — финальную сумму назовёт менеджер.") + "</p></div>";
    }
    $("#product").innerHTML =
      '<div class="gallery"><div class="ph"><span><i class="ti ti-photo"></i>' + t("Главное фото: " + it.name) + '</span></div><div class="thumbs"><div class="ph"><span>Фактура крупно</span></div><div class="ph"><span>В интерьере</span></div><div class="ph"><span>Образец в руке</span></div><div class="ph"><span>Схема размеров</span></div></div></div>' +
      '<div class="p-info"><div class="crumbs"><a href="catalog.html">Каталог</a> / <a href="catalog.html?sec=' + it.sec + '">' + t(secName(it.sec)) + "</a></div>" +
      "<h1>" + t(it.name) + '</h1><p class="lead">' + t(it.short) + "</p>" +
      '<div class="p-price">' + rub(it.price) + " <small>/ " + esc(it.unit) + (it.per ? " · " + t(it.per) : "") + "</small></div>" +
      '<span class="badge' + (it.status === "few" ? " few" : "") + '">' + (it.status === "few" ? "Мало в наличии — уточните у менеджера" : "Образец можно посмотреть в салоне") + " · для примера</span>" +
      calc +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn" href="#req"><i class="ti ti-file-invoice"></i>Запросить наличие и счёт</a><a class="btn ghost" href="https://wa.me/79094200420"><i class="ti ti-brand-whatsapp"></i>Спросить в WhatsApp</a></div>' +
      '<p class="muted" style="font-size:14px">' + t("Оплата после консультации: в салоне наличными, картой или по QR, удалённо — счёт с QR СБП. Доставка по Ростову — Яндекс Go, по России — транспортной компанией.") + "</p>" +
      '<div class="specs">' + it.specs.map(function (s) { return "<div>" + t(s[0]) + "</div><div>" + t(s[1]) + "</div>"; }).join("") + "</div>" +
      '<p class="src-line">Источник данных: ' + esc(it.src) + ", 08.11.2026</p></div>";
    var upd = function () {
      var r = $("#c-res"); if (!r) return;
      if (it.calc === "oboi") {
        var p = +$("#c-p").value, h = +$("#c-h").value;
        var strips = Math.ceil(p / it.roll.w), per = Math.floor(it.roll.l / (h + it.roll.rap)) || 1, rolls = Math.ceil(strips / per);
        r.innerHTML = "Нужно примерно <b>" + rolls + "&nbsp;рул.</b> · " + rub(rolls * it.price);
      } else if (it.calc === "len") {
        var n = Math.ceil(+$("#c-l").value * 1.1 / it.len);
        r.innerHTML = "Нужно примерно <b>" + n + "&nbsp;шт.</b> · " + rub(n * it.price);
      } else if (it.calc === "m2") {
        var m = Math.round(+$("#c-w").value * +$("#c-h2").value * 10) / 10;
        r.innerHTML = "Площадь " + String(m).replace(".", ",") + "&nbsp;м² · ориентир <b>" + rub(Math.round(m * it.price)) + "</b>";
      }
    };
    $$(".calc input").forEach(function (i) { i.oninput = upd; }); upd();
    var rel = D.items.filter(function (x) { return x.sec === it.sec && x.id !== it.id; }).concat(D.items.filter(function (x) { return x.sec !== it.sec; })).slice(0, 4);
    $("#related").innerHTML = rel.map(itemCard).join("");
    var f = $("#req-item"); if (f) f.value = it.name;
  }

  /* страница идеи */
  if (page === "ideas") {
    var id = new URLSearchParams(location.search).get("id");
    var idea = D.ideas.filter(function (x) { return x.id === id; })[0];
    if (idea) {
      $("#idea-list").style.display = "none";
      document.title = idea.name + " — идеи МАРТдекор";
      $("#idea").innerHTML = '<div class="crumbs"><a href="ideas.html">Идеи для стен</a> / ' + t(idea.name) + "</div><h1>" + t(idea.name) + '</h1><div class="ph"><span><i class="ti ti-photo"></i>' + t(idea.ph) + "</span></div>" +
        idea.text.map(function (p) { return "<p>" + t(p) + "</p>"; }).join("") + "<h3 style=\"margin:24px 0 12px\">Что подойдёт</h3><ul>" + idea.list.map(function (l) { return "<li>" + t(l) + "</li>"; }).join("") + "</ul>" +
        '<p class="muted">' + t("Текст — со страницы «Интерьерные решения» на martdecor.online.") + '</p><h3 style="margin:36px 0 18px">Материалы из каталога для этого стиля</h3><div class="grid-items g3">' + idea.items.map(function (x) { return itemCard(byId(x)); }).join("") + "</div>" +
        '<div style="margin-top:36px"><a class="btn" href="index.html#brief"><i class="ti ti-photo-up"></i>Собрать такой интерьер по моей комнате</a></div>';
    }
  }

  /* формы: демо */
  $$("form.lead-form").forEach(function (f) {
    f.onsubmit = function (e) { e.preventDefault(); var ok = $(".ok", f.parentNode); if (ok) ok.classList.add("show"); f.style.display = "none"; };
  });
  $$(".drop").forEach(function (d) {
    var inp = $("input", d);
    d.onclick = function () { inp.click(); };
    inp.onchange = function () { $("span", d).textContent = T(inp.files.length ? "Выбрано файлов: " + inp.files.length : "Перетащите фото или проект"); };
  });

  /* типографика статичного текста из data-атрибутов уже сделана; появление при прокрутке */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, {threshold: .12}) : null;
  $$(".rv").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });
})();
