(function () {
  var T = window.typo || function (s) { return s; };
  var C = window.CLUB;
  var page = document.body.getAttribute("data-page");
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function t(s) { return esc(T(s)); }
  function cat(id) { return window.CATS.filter(function (c) { return c.id === id; })[0]; }
  function item(id) { return window.ITEMS.filter(function (i) { return i.id === id; })[0]; }
  function priceHtml(i) { return (i.priceFrom ? "от&nbsp;" : "") + t(i.price) + " <small>" + t(i.priceNote) + "</small>"; }
  function param(n) { var m = location.search.match(new RegExp("[?&]" + n + "=([^&]+)")); return m ? decodeURIComponent(m[1]) : null; }

  /* шапка и подвал — общие для всех страниц */
  var nav = [["index.html#quiz", "Подобрать занятие"], ["catalog.html", "Направления"], ["index.html#afisha", "Афиша"], ["index.html#reviews", "Отзывы"], ["index.html#contacts", "Контакты"]];
  var header = document.createElement("header");
  header.className = "top";
  header.innerHTML = '<div class="wrap"><a class="logo" href="index.html"><b>Ясам</b><span><i>детский</i> <i>клуб</i></span></a>' +
    '<nav class="nav" id="nav">' + nav.map(function (n) { return '<a href="' + n[0] + '"' + (page === "catalog" && n[0] === "catalog.html" ? ' class="on"' : "") + ">" + n[1] + "</a>"; }).join("") + "</nav>" +
    '<a class="tel" href="' + C.phoneHref + '"><i class="ti ti-phone"></i> <span>' + C.phone.replace(/ /g, "&nbsp;") + "</span></a>" +
    '<button class="burger" aria-label="Меню"><i class="ti ti-menu-2"></i></button></div>';
  document.body.insertBefore(header, document.body.firstChild);
  $(".burger").addEventListener("click", function () { $("#nav").classList.toggle("open"); });

  var footer = document.createElement("footer");
  footer.className = "foot";
  footer.innerHTML = '<div class="wrap"><div><a class="logo" href="index.html"><b>Ясам</b></a><p style="margin-top:12px">' + t("Мы создаём среду, где ребёнка уважают, слышат, вдохновляют и помогают раскрыть его способности через творчество, игру, общение и любовь.") + "</p>" +
    '<div class="socials"><a href="' + C.vk + '" target="_blank" rel="noopener" aria-label="ВКонтакте"><i class="ti ti-brand-vk"></i></a><a href="' + C.tg + '" target="_blank" rel="noopener" aria-label="Telegram"><i class="ti ti-brand-telegram"></i></a></div></div>' +
    '<div class="cols"><b style="color:#fff">Направления</b>' + window.ITEMS.slice(0, 6).map(function (i) { return '<a href="item.html?id=' + i.id + '">' + t(i.title) + "</a>"; }).join("") + "</div>" +
    '<div class="cols"><b style="color:#fff">Контакты</b><a href="' + C.phoneHref + '">' + C.phone.replace(/ /g, "&nbsp;") + "</a><span>" + t(C.address) + "</span><span>" + t("Пн–пт 8:00–20:00, сб 9:00–16:00") + "</span></div>" +
    '<div class="proto">' + t("Прототип сайта. Фото — заглушки, тексты и цены — из группы ВКонтакте, Telegram-канала и карточек клуба на Яндекс Картах и в 2ГИС (ноябрь 2026). Формы ничего не отправляют.") + "</div></div>";
  document.body.appendChild(footer);

  /* открыто сейчас — по режиму из группы ВК */
  function openState() {
    var now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60, r = C.hours[d];
    if (r && h >= r[0] && h < r[1]) return { open: true, text: "Открыто до " + r[1] + ":00" };
    for (var k = 1; k <= 7; k++) {
      var nd = (d + k) % 7, nr = C.hours[nd];
      if (k === 0) continue;
      if (r && h < r[0]) return { open: false, text: "Закрыто, откроемся в " + r[0] + ":00" };
      if (nr) return { open: false, text: "Закрыто, откроемся " + (k === 1 ? "завтра" : ["в воскресенье", "в понедельник", "во вторник", "в среду", "в четверг", "в пятницу", "в субботу"][nd]) + " в " + nr[0] + ":00" };
    }
    return { open: false, text: "" };
  }
  $$("[data-open]").forEach(function (el) { var s = openState(); el.innerHTML = '<span class="open-dot' + (s.open ? "" : " off") + '"></span>' + t(s.text); });

  var hoursBox = $("#hours");
  if (hoursBox) {
    var days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"], today = (new Date().getDay() + 6) % 7;
    hoursBox.innerHTML = days.map(function (n, i) {
      var r = C.hours[(i + 1) % 7], cls = i === today ? ' class="today"' : "";
      return "<span" + cls + ">" + n + "</span><span" + cls + ">" + (r ? r[0] + ":00–" + r[1] + ":00" : "выходной") + "</span>";
    }).join("");
  }

  function cardHtml(i) {
    var c = cat(i.cat);
    return '<a class="card rv" href="item.html?id=' + i.id + '"><div class="ic" style="background:' + c.color + '"><i class="ti ' + i.icon + '"></i></div>' +
      "<h3>" + t(i.title) + "</h3><p>" + t(i.short) + '</p><div class="price">' + (i.priceFrom ? "от&nbsp;" : "") + t(i.price) + '</div><div class="pnote">' + t(i.priceNote) + "</div>" +
      '<div class="meta"><span class="tag">' + t(i.ageText) + '</span><span class="tag">' + t(i.group) + '</span></div><span class="status ' + i.status + '">' + t(i.statusText) + "</span></a>";
  }

  /* главная */
  if (page === "home") {
    $("#dirs").innerHTML = ["prodlenka", "school", "english", "logoped", "psy", "cooking"].map(function (id) { return cardHtml(item(id)); }).join("");

    $("#events").innerHTML = window.EVENTS.map(function (e) {
      return '<div class="event rv"><div class="d"><b>' + t(e.date) + "</b><small>" + t(e.month) + "</small></div><div><h3>" + t(e.title) + "</h3><p>" + t(e.text) + '</p><div class="meta" style="display:flex;gap:8px;flex-wrap:wrap"><span class="tag">' + t(e.day) + '</span><span class="tag">' + t(e.age) + '</span><span class="tag"><b>' + t(e.price) + "</b></span></div>" +
        (e.need ? '<div class="need" style="margin-top:12px"><b>Нужно от вас</b>даты и цены утренников</div>' : "") + "</div></div>";
    }).join("");
    $("#dishes").innerHTML = "<b>Уже готовили:</b>" + window.DISHES.map(function (d) { return "<span>" + t(d) + "</span>"; }).join("");

    $("#team").innerHTML = window.TEAM.map(function (m) {
      return '<div class="card rv"><div class="ph"><span><i class="ti ti-photo"></i> ' + t(m.photo) + "</span></div><h3>" + t(m.name) + '</h3><div class="role">' + t(m.role) + "</div>" +
        (m.need ? '<div class="need">' + t(m.text) + "</div>" : "<p>" + t(m.text) + "</p>") + "</div>";
    }).join("");

    $("#reviews-list").innerHTML = window.REVIEWS.map(function (r) {
      return '<div class="review rv"><span class="tag" style="align-self:start">' + t(r.tag) + "</span><p>" + t(r.text) + "</p><footer><b>" + t(r.name) + "</b><span>" + t(r.date) + " · " + t(r.src) + "</span></footer></div>";
    }).join("");

    $("#articles").innerHTML = window.ARTICLES.map(function (a) {
      return '<a class="card article-card rv" href="article.html?id=' + a.id + '"><div class="ph"><span><i class="ti ti-photo"></i> Фото из поста</span></div><span class="tag" style="align-self:start">' + t(a.tag) + "</span><h3>" + t(a.title) + "</h3><p>" + t(a.lead) + "</p></a>";
    }).join("");

    $("#faq").innerHTML = window.FAQ.map(function (f, n) {
      return "<details" + (n === 0 ? " open" : "") + "><summary>" + t(f.q) + "</summary><p>" + t(f.a) + "</p><small>Источник: " + t(f.src) + "</small></details>";
    }).join("");

    /* квиз */
    var Q = window.QUIZ, sel = { age: null, goal: null };
    $("#q-age").innerHTML = Q.ages.map(function (a) { return '<button class="chip" data-age="' + a.id + '">' + t(a.label) + "</button>"; }).join("");
    $("#q-goal").innerHTML = Q.goals.map(function (g) { return '<button class="chip" data-goal="' + g.id + '"><i class="ti ' + g.icon + '"></i>' + t(g.label) + "</button>"; }).join("");
    function renderQuiz() {
      $$("#q-age .chip").forEach(function (b) { b.classList.toggle("on", b.dataset.age === sel.age); });
      $$("#q-goal .chip").forEach(function (b) { b.classList.toggle("on", b.dataset.goal === sel.goal); });
      var out = $("#q-result");
      if (!sel.age || !sel.goal) { out.innerHTML = '<div class="q-empty">' + t("Выберите возраст и что важно — покажем, с чего начать. А на знакомстве Эльмира подберёт направление точнее.") + "</div>"; return; }
      var ids = (Q.map[sel.goal] || {})[sel.age] || [];
      out.innerHTML = ids.map(function (id) {
        var i = item(id), c = cat(i.cat);
        return '<a class="q-card" href="item.html?id=' + i.id + '"><span class="ic" style="background:' + c.color + '"><i class="ti ' + i.icon + '"></i></span><span><b>' + t(i.title) + "</b><small>" + t(i.short) + '</small></span><span class="pr">' + (i.priceFrom ? "от&nbsp;" : "") + t(i.price) + "</span></a>";
      }).join("") + '<a class="btn main" href="#contacts" style="justify-self:start;margin-top:6px"><i class="ti ti-calendar-heart"></i>Записаться на знакомство</a>';
    }
    $("#quiz").addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      if (b.dataset.age) sel.age = b.dataset.age;
      if (b.dataset.goal) sel.goal = b.dataset.goal;
      renderQuiz();
    });
    renderQuiz();
  }

  /* форма записи — на всех страницах, где есть */
  var sel2 = $("#f-dir");
  if (sel2) {
    sel2.innerHTML = '<option value="">Пока не знаю — помогите выбрать</option>' + window.ITEMS.map(function (i) { return '<option value="' + i.id + '">' + t(i.title) + "</option>"; }).join("");
    var pre = param("id"); if (pre && item(pre)) sel2.value = pre;
  }
  $$("form.lead-form").forEach(function (f) {
    f.addEventListener("submit", function (e) { e.preventDefault(); f.querySelector(".form-ok").style.display = "block"; });
  });

  /* каталог */
  if (page === "catalog") {
    var st = { q: "", age: null, fmt: null };
    $("#f-age").innerHTML = window.AGES.map(function (a) { return '<button class="chip" data-age="' + a + '">' + t(a) + "</button>"; }).join("");
    $("#f-fmt").innerHTML = window.FORMATS.map(function (a) { return '<button class="chip" data-fmt="' + a + '">' + t(a) + "</button>"; }).join("");
    var startCat = param("cat");
    function render() {
      $$("#f-age .chip").forEach(function (b) { b.classList.toggle("on", b.dataset.age === st.age); });
      $$("#f-fmt .chip").forEach(function (b) { b.classList.toggle("on", b.dataset.fmt === st.fmt); });
      var q = st.q.trim().toLowerCase();
      var list = window.ITEMS.filter(function (i) {
        if (st.age && i.ages.indexOf(st.age) < 0) return false;
        if (st.fmt && i.formats.indexOf(st.fmt) < 0) return false;
        if (q && (i.title + " " + i.short + " " + i.includes.join(" ")).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
      $("#found").textContent = "Нашлось направлений: " + list.length;
      var html = window.CATS.map(function (c) {
        var its = list.filter(function (i) { return i.cat === c.id; });
        if (!its.length) return "";
        return '<div class="cat-block" id="cat-' + c.id + '"><h2><i class="ti ' + c.icon + '" style="color:' + c.color + '"></i>' + t(c.name) + '</h2><div class="grid three">' + its.map(cardHtml).join("") + "</div></div>";
      }).join("");
      $("#list").innerHTML = html || '<div class="nothing">' + t("Ничего не нашлось. Сбросьте фильтры или позвоните — подберём вместе.") + "</div>";
      reveal();
    }
    $(".filters").addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      if (b.dataset.age) st.age = st.age === b.dataset.age ? null : b.dataset.age;
      if (b.dataset.fmt) st.fmt = st.fmt === b.dataset.fmt ? null : b.dataset.fmt;
      render();
    });
    $("#f-q").addEventListener("input", function (e) { st.q = e.target.value; render(); });
    $("#f-reset").addEventListener("click", function () { st = { q: "", age: null, fmt: null }; $("#f-q").value = ""; render(); });
    render();
    if (startCat && $("#cat-" + startCat)) $("#cat-" + startCat).scrollIntoView();
  }

  /* карточка направления */
  if (page === "item") {
    var i = item(param("id")) || window.ITEMS[0], c = cat(i.cat);
    document.title = i.title + " — детский клуб «Ясам», Воронеж";
    $("#item").innerHTML = '<div class="crumbs"><a href="index.html">Главная</a> / <a href="catalog.html">Направления</a> / ' + t(c.name) + "</div>" +
      '<div class="card" style="padding:0;background:none"><div class="ic" style="background:' + c.color + '"><i class="ti ' + i.icon + '"></i></div></div>' +
      '<h1 style="margin-top:14px">' + t(i.title) + '</h1><p class="lead muted" style="font-size:20px">' + t(i.short) + "</p>" +
      '<span class="status ' + i.status + '">' + t(i.statusText) + "</span>" +
      '<div class="facts"><div><b>' + priceHtml(i) + "</b>стоимость</div><div><b>" + t(i.ageText) + "</b>возраст</div><div><b>" + t(i.group) + "</b>формат</div><div><b>" + t(i.schedule) + "</b>когда</div></div>" +
      (i.plans ? "<h3>Варианты</h3><div class=\"plans\">" + i.plans.map(function (p) { return '<div class="plan"><span><b>' + t(p.name) + "</b><small>" + t(p.note) + '</small></span><b class="p">' + t(p.price) + "</b></div>"; }).join("") + "</div>" : "") +
      '<h3 style="margin-top:26px">Что входит</h3><ul class="ticks">' + i.includes.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("") + "</ul>" +
      '<h3>Кто ведёт</h3><p>' + t(i.lead) + "</p>" +
      (i.need.length ? '<div class="need"><b>Нужно от вас</b><ul>' + i.need.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("") + "</ul></div>" : "") +
      '<p class="src" style="margin-top:14px">Источник: ' + t(i.src) + "</p>";
    $("#side-quote").innerHTML = "«" + t(i.quote.replace(/\.$/, "")) + "»<small>" + t(i.quoteBy) + "</small>";
    $("#more").innerHTML = window.ITEMS.filter(function (x) { return x.id !== i.id && x.ages.some(function (a) { return i.ages.indexOf(a) >= 0; }); }).slice(0, 3).map(cardHtml).join("");
  }

  /* статья */
  if (page === "article") {
    var a = window.ARTICLES.filter(function (x) { return x.id === param("id"); })[0] || window.ARTICLES[0];
    document.title = a.title + " — детский клуб «Ясам»";
    $("#article").innerHTML = '<div class="crumbs"><a href="index.html">Главная</a> / Статьи</div><span class="tag">' + t(a.tag) + "</span><h1 style=\"margin-top:14px\">" + t(a.title) + '</h1><p class="lead">' + t(a.lead) + "</p>" +
      '<div class="ph"><span><i class="ti ti-photo"></i> Фото из поста клуба</span></div>' + a.body.map(function (p) { return "<p>" + t(p) + "</p>"; }).join("") +
      '<p class="src">' + t("Эльмира Светова · " + a.date + " · текст собран из " + a.src) + "</p>";
    $("#more-art").innerHTML = window.ARTICLES.filter(function (x) { return x.id !== a.id; }).map(function (x) {
      return '<a class="card article-card rv" href="article.html?id=' + x.id + '"><span class="tag" style="align-self:start">' + t(x.tag) + "</span><h3>" + t(x.title) + "</h3><p>" + t(x.lead) + "</p></a>";
    }).join("");
  }

  /* появление при прокрутке */
  function reveal() {
    var els = $$(".rv:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .08 });
    els.forEach(function (e) { io.observe(e); });
  }
  reveal();
  /* страховка для скриншотов и печати: через пару секунд показываем всё */
  setTimeout(function () { $$(".rv").forEach(function (e) { e.classList.add("in"); }); }, 1500);
})();
