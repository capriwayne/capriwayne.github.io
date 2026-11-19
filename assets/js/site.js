/* Renders every page from data/*.js. You shouldn't need to edit this file. */
(function () {
  const S = window.SITE || {};
  const W = window.WORK || [];
  const SECTIONS = window.SECTIONS || [];
  const ARTICLES = window.CRIMSON_ARTICLES || [];
  const params = new URLSearchParams(location.search);
  const body = document.body;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ext = (u) => (/^https?:\/\//.test(u || "") ? ' target="_blank" rel="noopener"' : "");
  const coverOf = (w) => w.cover || (w.gallery && w.gallery[0] && w.gallery[0].src) || (w.video && w.video.poster) || "";
  const sectionOf = (id) => SECTIONS.find((s) => s.id === id);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmt = (iso) => { const [y, m] = iso.split("-"); return `${MONTHS[+m - 1]} ${y}`; };
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  /* Nautical line icons (stroke = currentColor) */
  const svg = (inner) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  const ICON = {
    anchor: svg('<circle cx="12" cy="5" r="2"/><path d="M12 7v14"/><path d="M8 11h8"/><path d="M4.5 14.5c.8 3.6 3.9 6.5 7.5 6.5s6.7-2.9 7.5-6.5"/><path d="M3 15l1.5-.5L6 16"/><path d="M21 15l-1.5-.5L18 16"/>'),
    compass: svg('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
    wave: svg('<path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>'),
    play: svg('<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>'),
    script: svg('<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 11h5M10 14h5M10 17h3"/>'),
    lighthouse: svg('<path d="M10 21l1-12h2l1 12z"/><path d="M9.5 9h5"/><path d="M10.5 9V6.5L12 5l1.5 1.5V9"/><path d="M8 21h8"/><path class="beam" d="M15.5 6.5L21 4.5M15.5 7.5L21 9.5M8.5 6.5L3 4.5M8.5 7.5L3 9.5"/>'),
    mail: svg('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>'),
    linkedin: svg('<rect x="3" y="3" width="18" height="18" rx="3.5"/><path d="M8 10.5V16"/><circle cx="8" cy="7.6" r=".4" fill="currentColor"/><path d="M11.5 16v-5.5"/><path d="M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6V16"/>')
  };
  // Anchor favicon
  if (!document.querySelector('link[rel="icon"]')) {
    const l = document.createElement("link"); l.rel = "icon";
    l.href = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1d6fa5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v14M8 11h8M4.5 14.5c.8 3.6 3.9 6.5 7.5 6.5s6.7-2.9 7.5-6.5"/></svg>`);
    document.head.appendChild(l);
  }

  /* Click ripple, like a drop hitting water */
  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || reduceMotion()) return;
    ["", " r2"].forEach((cls) => {
      const r = document.createElement("span");
      r.className = "ripple" + cls;
      r.style.left = e.clientX + "px";
      r.style.top = e.clientY + "px";
      r.addEventListener("animationend", () => r.remove());
      document.body.appendChild(r);
    });
  }, { passive: true });

  const page = body.dataset.page;
  const currentSection =
    page === "section" ? body.dataset.section :
    page === "work" ? (W.find((w) => w.id === params.get("id")) || {}).section :
    page === "crimson" ? "writing" : null;

  /* ---------- Header & footer ---------- */
  $("#site-header").innerHTML = `
    <div class="wrap header-inner">
      <a class="brand" href="./">${ICON.anchor}${esc(S.name)}</a>
      <nav class="nav" aria-label="Work by type">
        ${SECTIONS.map((s) => `<a href="${esc(s.file)}"${s.id === currentSection ? ' aria-current="page"' : ""}>${esc(s.label)}</a>`).join("")}
        ${S.resume ? `<a href="${esc(S.resume)}" target="_blank" rel="noopener">Résumé</a>` : ""}
      </nav>
    </div>`;
  const cur = $(".nav [aria-current]");
  if (cur) cur.scrollIntoView({ block: "nearest", inline: "center" });

  $("#site-footer").innerHTML = `
    <div class="wrap footer-inner">
      <span>${ICON.wave}${esc(S.name)} · ${esc(S.school)}</span>
      <span>© ${new Date().getFullYear()}</span>
    </div>`;

  ({ home: renderHome, section: renderSection, work: renderWork, crimson: renderCrimson })[page]?.();
  themeToggle();
  if (page !== "home") voyage();
  messageInABottle();

  /* ---------- Home ---------- */
  function renderHome() {
    $("#main").innerHTML = `
      <div class="sky" aria-hidden="true"></div>
      <section class="home wrap" id="home">
        <h1 class="home-name">${ICON.compass}<span class="home-name-text">${esc(S.name)}</span></h1>
        <p class="home-bio">${esc(S.bio)}</p>
        <ul class="home-contact">
          ${S.email ? `<li><a href="mailto:${esc(S.email)}">${ICON.mail}<span>${esc(S.email)}</span></a></li>` : ""}
          ${S.linkedin ? `<li><a href="${esc(S.linkedin)}" target="_blank" rel="noopener">${ICON.linkedin}<span>LinkedIn</span></a></li>` : ""}
        </ul>
        <svg class="home-waves" viewBox="0 0 600 64" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
          <path/><path/>
        </svg>
      </section>`;
    timeOfDaySky($(".sky"));
    inkName($(".home-name"));
    liveWaves($(".home-waves"), $("#home"));
  }

  function reduceMotion() { return matchMedia("(prefers-reduced-motion: reduce)").matches; }

  /* 3 · Name writes itself in, once per visit */
  function inkName(h1) {
    const span = h1.querySelector(".home-name-text");
    let seen = false;
    try { seen = sessionStorage.getItem("inked") === "1"; } catch (e) {}
    if (seen || reduceMotion()) return;
    h1.classList.add("inking", "hold");
    const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);
    fontsReady.then(() => {
      try {
        const cs = getComputedStyle(span);
        const size = parseFloat(cs.fontSize);
        const box = span.getBoundingClientRect();
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`;
        const m = ctx.measureText(S.name);
        const asc = m.fontBoundingBoxAscent || size * 0.8, desc = m.fontBoundingBoxDescent || size * 0.2;
        const baseline = (box.height - (asc + desc)) / 2 + asc;
        const len = Math.round(size * 3.4);   // ≈ one glyph outline
        const ns = "http://www.w3.org/2000/svg";
        const ink = document.createElementNS(ns, "svg");
        ink.setAttribute("class", "ink");
        ink.setAttribute("aria-hidden", "true");
        ink.setAttribute("width", box.width + 4);
        ink.setAttribute("height", box.height);
        ink.style.setProperty("--len", len);
        // one <text> per letter, placed by measured prefix width (keeps kerning), drawn left to right
        const chars = [...S.name];
        const per = 1.25 / Math.max(chars.length - 1, 1);
        chars.forEach((ch, i) => {
          if (!ch.trim()) return;
          const t = document.createElementNS(ns, "text");
          t.setAttribute("x", ctx.measureText(chars.slice(0, i).join("")).width.toFixed(2));
          t.setAttribute("y", baseline);
          t.setAttribute("font-family", cs.fontFamily);
          t.setAttribute("font-size", size);
          t.style.animationDelay = `${(i * per).toFixed(3)}s, ${(0.55 + i * per).toFixed(3)}s`;
          t.textContent = ch;
          ink.appendChild(t);
        });
        span.appendChild(ink);
        h1.classList.add("ink-on");
        setTimeout(() => h1.classList.remove("hold"), 1700);
        setTimeout(() => {
          h1.classList.remove("inking", "ink-on");
          ink.remove();
          try { sessionStorage.setItem("inked", "1"); } catch (e) {}
        }, 2700);
      } catch (e) {
        h1.classList.remove("inking", "ink-on", "hold");
      }
    });
  }

  /* 1 · Waves drift on their own and swell toward the cursor */
  function liveWaves(svg, area) {
    const W = 600, H = 64, STEP = 5;
    const paths = svg.querySelectorAll("path");
    const lines = [
      { base: 24, amp: 3.2, k: (2 * Math.PI) / 64, speed: 0.9, phase: 0 },
      { base: 44, amp: 2.4, k: (2 * Math.PI) / 50, speed: -0.65, phase: 1.7 }
    ];
    let tx = W / 2, sx = W / 2, ts = 0, ss = 0;

    const draw = (time) => {
      lines.forEach((L, i) => {
        let d = "";
        for (let x = 0; x <= W; x += STEP) {
          const swell = ss * 11 * Math.exp(-((x - sx) ** 2) / (2 * 70 ** 2));
          const y = L.base + (L.amp + swell) * Math.sin(L.k * x + L.phase + (time / 1000) * L.speed)
                    - swell * 0.35;
          d += (x ? " L" : "M") + x + " " + y.toFixed(2);
        }
        paths[i].setAttribute("d", d);
      });
    };

    if (reduceMotion()) { draw(0); return; }

    area.addEventListener("pointermove", (e) => {
      const r = svg.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * W;
      const dy = Math.abs(e.clientY - (r.top + r.height / 2));
      const inX = e.clientX > r.left - 120 && e.clientX < r.right + 120;
      ts = inX ? Math.max(0, 1 - dy / 220) : 0;
    });
    area.addEventListener("pointerleave", () => { ts = 0; });

    const loop = (time) => {
      sx += (tx - sx) * 0.08;
      ss += (ts - ss) * 0.05;
      draw(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* 5 · A faint sky that follows the visitor's local time */
  function timeOfDaySky(el) {
    const SKIES = [
      // [from hour, name, glow, wash]
      [0,  "night",  "rgb(70 104 178 / .16)",  "rgb(120 150 205 / .08)"],
      [5,  "dawn",   "rgb(255 186 160 / .30)", "rgb(176 212 240 / .18)"],
      [8,  "day",    "rgb(150 205 238 / .20)", "rgb(214 238 250 / .14)"],
      [16, "golden", "rgb(255 196 120 / .28)", "rgb(250 222 190 / .14)"],
      [19, "dusk",   "rgb(198 156 222 / .24)", "rgb(120 150 214 / .14)"],
      [21, "night",  "rgb(70 104 178 / .16)",  "rgb(120 150 205 / .08)"]
    ];
    const apply = () => {
      const h = new Date().getHours();
      const sky = SKIES.filter((s) => h >= s[0]).pop();
      el.dataset.sky = sky[1];
      el.style.setProperty("--glow", sky[2]);
      el.style.setProperty("--wash", sky[3]);
    };
    apply();
    setInterval(apply, 10 * 60 * 1000);
  }

  /* ---------- Category page ---------- */
  function renderSection() {
    const sec = sectionOf(body.dataset.section);
    if (!sec) return;
    const items = W.filter((w) => w.section === sec.id);
    const isWriting = sec.id === "writing" && ARTICLES.length;
    const plays = sec.id === "writing" ? (window.SCREENPLAYS || []) : [];
    const total = items.length + (isWriting ? ARTICLES.length : 0) + plays.length;

    $("#main").innerHTML = `
      <section class="wrap page-head">
        <h1>${esc(sec.label)}</h1>
        <p class="count">${plural(total, isWriting ? "piece" : "project")}</p>
      </section>
      ${isWriting ? crimsonBlock({ compact: true }) : ""}
      ${items.length ? `
        <section class="wrap block">
          ${isWriting ? `<div class="block-head"><h2>Features &amp; Profiles</h2><span class="block-count">${items.length}</span></div>` : ""}
          <div class="grid">${items.map(card).join("")}</div>
        </section>` : ""}
      ${plays.length ? `
        <section class="wrap block">
          <div class="block-head"><h2>Screenwriting</h2><span class="block-count">${plays.length}</span></div>
          <div class="plays">${plays.map(screenplay).join("")}</div>
        </section>` : ""}`;
    if (isWriting) wireCrimson();
  }

  function screenplay(p) {
    return `
      <article class="play-card">
        <p class="kicker">${esc(p.genre)} · ${esc(p.year)}</p>
        <h3>${esc(p.title)}</h3>
        <p class="logline">${esc(p.logline)}</p>
        ${p.awards ? `<p class="awards"><span>Awarded</span>${esc(p.awards)}</p>` : ""}
        ${p.link ? `<a class="btn btn-ghost" href="${esc(p.link)}" target="_blank" rel="noopener">${ICON.script}Request to read ↗</a>` : ""}
      </article>`;
  }

  function card(w) {
    const c = coverOf(w);
    return `
      <a class="card" href="work.html?id=${encodeURIComponent(w.id)}">
        <div class="card-media">
          ${c ? `<img src="${esc(c)}" alt="" loading="lazy">` : ""}
          ${w.video ? '<span class="play" aria-hidden="true"></span>' : ""}
        </div>
        <div class="card-body">
          <p class="kicker">${esc(w.kind)}</p>
          <h3>${esc(w.title)}</h3>
          ${(w.outlet || w.date) ? `<p class="card-meta">${[w.outlet, w.date].filter(Boolean).map(esc).join(" · ")}</p>` : ""}
        </div>
      </a>`;
  }

  /* ---------- Crimson ---------- */
  function crimsonBlock({ compact }) {
    const counts = ARTICLES.reduce((m, a) => ((m[a.type] = (m[a.type] || 0) + 1), m), {});
    const types = [["Review", "Reviews"], ["Profile", "Profiles"], ["Feature", "Features, Thinkpieces & More"]].filter(([t]) => counts[t]);
    const dates = ARTICLES.map((a) => a.date).sort();
    const range = dates.length ? `${fmt(dates[0])} – ${fmt(dates[dates.length - 1])}` : "";
    return `
      <section class="wrap block crimson-block">
        <div class="crimson-top">
          <div>
            <p class="kicker">Arts Staff Writer</p>
            <h2 class="crimson-title">The Harvard Crimson</h2>
            <p class="crimson-range">${esc(range)}</p>
          </div>
          <div class="stat"><span class="stat-n">${ARTICLES.length}</span><span class="stat-l">articles</span></div>
        </div>
        <div class="filters" role="tablist" aria-label="Filter articles">
          <button role="tab" aria-selected="true" data-type="all">All <span>${ARTICLES.length}</span></button>
          ${types.map(([t, l]) => `<button role="tab" aria-selected="false" data-type="${t}">${esc(l)} <span>${counts[t]}</span></button>`).join("")}
        </div>
        <ol class="article-list" id="article-list">
          ${ARTICLES.map((a) => `
            <li data-type="${esc(a.type)}">
              <a href="${esc(new URL(S.crimsonUrl).origin + a.path)}" target="_blank" rel="noopener" data-image="${esc(a.image || "")}" data-meta="${esc([a.label ?? a.type, fmt(a.date)].filter(Boolean).join(" · "))}">
                <span class="a-date">${fmt(a.date)}</span>
                <span class="a-title">${esc(a.title)}</span>
                <span class="a-type">${esc(a.label ?? a.type)}</span>
              </a>
            </li>`).join("")}
        </ol>
        <div class="crimson-actions">
          ${compact ? `<a class="btn" href="crimson.html">${ICON.anchor}View live writer page</a>` : ""}
          <a class="btn btn-ghost" href="${esc(S.crimsonUrl)}" target="_blank" rel="noopener">thecrimson.com ↗</a>
        </div>
      </section>`;
  }

  function wireCrimson() {
    crimsonPeek();
    const bar = $(".filters");
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      bar.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      const t = b.dataset.type;
      document.querySelectorAll("#article-list li").forEach((li) => { li.hidden = t !== "all" && li.dataset.type !== t; });
    });
  }

  function renderCrimson() {
    $("#main").innerHTML = `
      <section class="wrap page-head">
        <a class="back" href="writing.html">← Writing</a>
        <h1>The Harvard Crimson</h1>
        <p class="count">${plural(ARTICLES.length, "article")} · Live writer page</p>
      </section>
      <section class="wrap">
        <div class="frame"><iframe src="${esc(S.crimsonUrl)}" title="Capri Wayne's writer page on The Harvard Crimson"></iframe></div>
      </section>
      ${crimsonBlock({ compact: false })}`;
    wireCrimson();
  }

  /* ---------- Work detail ---------- */
  function renderWork() {
    const w = W.find((x) => x.id === params.get("id"));
    if (!w) {
      $("#main").innerHTML = `<section class="wrap page-head"><h1>Not found</h1><p><a href="./">Home</a></p></section>`;
      return;
    }
    document.title = `${w.title} · ${S.name}`;
    const sec = sectionOf(w.section);
    const siblings = W.filter((x) => x.section === w.section);
    const i = siblings.indexOf(w);
    const next = siblings[(i + 1) % siblings.length];

    let media = "";
    if (w.video && w.video.src) {
      media += `<div class="media"><video controls preload="metadata" playsinline
        ${w.video.poster ? `poster="${esc(w.video.poster)}"` : ""} src="${esc(w.video.src)}"></video></div>`;
    }
    if (w.video && w.video.youtube) {
      media += `<div class="media"><iframe class="yt" src="${esc(w.video.youtube)}" title="${esc(w.title)}" allowfullscreen></iframe></div>`;
    }
    (w.pdfs || []).forEach((p) => {
      media += `<figure class="media pdf-wrap">
        <object class="pdf" data="${esc(p.src)}#view=FitH" type="application/pdf" aria-label="${esc(p.label || w.title)}"></object>
        <figcaption class="pdf-bar"><span>${esc(p.label || "PDF")}</span><a href="${esc(p.src)}" target="_blank" rel="noopener">Open full size ↗</a></figcaption>
      </figure>`;
    });
    if ((w.gallery || []).length) {
      media += `<div class="gallery${w.gallery.length === 1 ? " single" : ""}">${w.gallery.map((g, n) => `
        <figure>
          <button class="g-item" data-i="${n}" aria-label="Enlarge${g.caption ? ": " + esc(g.caption) : ""}">
            <img src="${esc(g.src)}" alt="${esc(g.caption || w.title)}" decoding="async">
          </button>
          ${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}
        </figure>`).join("")}</div>`;
    }

    $("#main").innerHTML = `
      <article class="wrap detail">
        <a class="back" href="${esc(sec ? sec.file : "./")}">← ${esc(sec ? sec.label : "Home")}</a>
        <p class="kicker">${esc(w.kind)}</p>
        <h1>${esc(w.title)}</h1>
        ${(w.outlet || w.date) ? `<p class="detail-meta">${[w.outlet, w.date].filter(Boolean).map(esc).join(" · ")}</p>` : ""}
        ${w.summary ? `<p class="summary">${esc(w.summary)}</p>` : ""}
        ${w.link && w.link.url ? `<a class="btn" href="${esc(w.link.url)}"${ext(w.link.url)}>${w.video ? ICON.play : ICON.anchor}${esc(w.link.label || "View")} ↗</a>` : ""}
        ${media}
        ${siblings.length > 1 ? `
          <a class="next" href="work.html?id=${encodeURIComponent(next.id)}">
            <span class="next-l">Next in ${esc(sec.label)}</span>
            <span class="next-t">${esc(next.title)} ${ICON.compass}</span>
          </a>` : ""}
      </article>`;

    const lb = $("#lightbox");
    if (w.gallery) {
      $("#main").addEventListener("click", (e) => {
        const b = e.target.closest(".g-item"); if (!b) return;
        const g = w.gallery[+b.dataset.i];
        lb.querySelector("img").src = g.src;
        lb.querySelector("img").alt = g.caption || w.title;
        lb.querySelector(".lb-caption").textContent = g.caption || "";
        lb.showModal();
      });
      lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lb-close")) lb.close(); });
    }
  }
  /* ---------- Crimson: photo preview that follows the cursor ---------- */
  function crimsonPeek() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const list = $("#article-list");
    if (!list) return;
    const peek = document.createElement("div");
    peek.className = "peek";
    peek.setAttribute("aria-hidden", "true");
    peek.innerHTML = '<div class="peek-img"><img alt=""></div><p class="peek-meta"></p>';
    document.body.appendChild(peek);
    const img = peek.querySelector("img"), meta = peek.querySelector(".peek-meta");
    let x = 0, y = 0, px = 0, py = 0, raf = 0, on = false;
    const move = () => {
      px += (x - px) * 0.18; py += (y - py) * 0.18;
      const w = peek.offsetWidth, h = peek.offsetHeight;
      let left = px + 28, top = py - h / 2;
      if (left + w > innerWidth - 16) left = px - w - 28;
      top = Math.max(76, Math.min(top, innerHeight - h - 16));
      const tilt = Math.max(-4, Math.min(4, (x - px) * 0.08));
      peek.style.transform = `translate3d(${left}px, ${top}px, 0) rotate(${tilt}deg)`;
      raf = on ? requestAnimationFrame(move) : 0;
    };
    list.addEventListener("pointerover", (e) => {
      const a = e.target.closest("a[data-image]");
      if (!a || !a.dataset.image) return;
      if (img.getAttribute("src") !== a.dataset.image) { peek.classList.remove("loaded"); img.src = a.dataset.image; }
      meta.textContent = a.dataset.meta || "";
      if (!on) { px = x = e.clientX; py = y = e.clientY; }
      on = true; peek.classList.add("on");
      if (!raf) raf = requestAnimationFrame(move);
    });
    img.addEventListener("load", () => peek.classList.add("loaded"));
    list.addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });
    list.addEventListener("pointerout", (e) => {
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("#article-list a")) return;
      on = false; peek.classList.remove("on");
    });
    addEventListener("scroll", () => { if (on) { on = false; peek.classList.remove("on"); } }, { passive: true });
  }

  /* ---------- Sailing boat scroll progress ---------- */
  function voyage() {
    const header = $("#site-header");
    const v = document.createElement("div");
    v.className = "voyage";
    v.setAttribute("aria-hidden", "true");
    v.innerHTML = `<span class="voyage-boat"><svg viewBox="0 0 32 32"><path d="M16 4 L16 20 L6 20 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/><path d="M17.5 8 L25 20 L17.5 20 Z" fill="var(--foam)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 21 L29 21 L24.5 27 L7.5 27 Z" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/></svg></span>`;
    header.appendChild(v);
    const boat = v.querySelector(".voyage-boat");
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      v.classList.toggle("show", max > 240);
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      boat.style.transform = `translateX(${(p * (v.clientWidth - boat.offsetWidth)).toFixed(1)}px)`;
      v.style.setProperty("--progress", p.toFixed(4));
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    addEventListener("load", req);
    new ResizeObserver(req).observe(document.body);
    req();
  }

  /* ---------- Lighthouse: day / night toggle ---------- */
  function themeToggle() {
    const root = document.documentElement;
    const sysDark = matchMedia("(prefers-color-scheme: dark)");
    const current = () => root.dataset.theme || (sysDark.matches ? "dark" : "light");
    const btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";
    btn.innerHTML = ICON.lighthouse;
    const sync = () => {
      const night = current() === "dark";
      btn.classList.toggle("lit", night);
      btn.setAttribute("aria-label", night ? "Switch to day mode" : "Switch to night mode");
      btn.title = night ? "Day mode" : "Night mode";
    };
    btn.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      sync();
    });
    sysDark.addEventListener?.("change", sync);
    $(".header-inner").appendChild(btn);
    sync();
  }

  /* ---------- Message in a bottle (appears once you add notes) ---------- */
  function messageInABottle() {
    const notes = (window.BOTTLE_NOTES || []).filter((n) => String(n).trim());
    if (!notes.length) return;
    const footer = $("#site-footer");
    const bottle = document.createElement("button");
    bottle.className = "bottle";
    bottle.type = "button";
    bottle.setAttribute("aria-label", "Open the message in a bottle");
    bottle.title = "A message in a bottle";
    bottle.innerHTML = `<svg viewBox="0 0 40 24" aria-hidden="true"><g stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="M4 9.5h18c3 0 5 1.2 7 2.5h4v0.01h0" fill="none"/><path d="M5 8h16c3.5 0 5.6 1.4 7.6 3.2H32a1.5 1.5 0 0 1 0 3h-3.4C26.6 16 24.5 17.4 21 17.4H5a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3z" fill="color-mix(in srgb, var(--foam) 45%, var(--surface))"/><path d="M32 11.2h3.2v3H32z" fill="#c8a27a"/><path d="M7 11h11v3.6H7z" fill="#f4ead6"/><path d="M9 12.4h7M9 13.6h5" stroke-width=".9"/></g></svg>`;
    footer.appendChild(bottle);

    const bubble = document.createElement("div");
    bubble.className = "note-bubble";
    bubble.id = "note-bubble";
    bubble.setAttribute("role", "status");
    bubble.hidden = true;
    bubble.innerHTML = `
      <p class="note-text"></p>
      <div class="note-actions">
        ${notes.length > 1 ? '<button class="note-next" type="button">Another one ↻</button>' : ""}
        <button class="note-close" type="button" aria-label="Close">×</button>
      </div>`;
    footer.appendChild(bubble);
    bottle.setAttribute("aria-controls", "note-bubble");
    bottle.setAttribute("aria-expanded", "false");
    const text = bubble.querySelector(".note-text");
    let last = -1;
    const pick = () => {
      let i = Math.floor(Math.random() * notes.length);
      if (notes.length > 1 && i === last) i = (i + 1) % notes.length;
      last = i;
      text.textContent = notes[i];
      text.classList.remove("unroll"); void text.offsetWidth; text.classList.add("unroll");
    };
    const open = () => { pick(); bubble.hidden = false; bottle.setAttribute("aria-expanded", "true"); };
    const close = () => { bubble.hidden = true; bottle.setAttribute("aria-expanded", "false"); };
    bottle.addEventListener("click", () => (bubble.hidden ? open() : close()));
    bubble.querySelector(".note-next")?.addEventListener("click", pick);
    bubble.querySelector(".note-close").addEventListener("click", close);
    document.addEventListener("click", (e) => { if (!bubble.hidden && !e.target.closest(".note-bubble, .bottle")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !bubble.hidden) { close(); bottle.focus(); } });
  }
})();
