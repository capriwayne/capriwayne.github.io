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
    const types = [["Review", "Reviews"], ["Profile", "Profiles"], ["Feature", "Features & Essays"]].filter(([t]) => counts[t]);
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
              <a href="${esc(new URL(S.crimsonUrl).origin + a.path)}" target="_blank" rel="noopener">
                <span class="a-date">${fmt(a.date)}</span>
                <span class="a-title">${esc(a.title)}</span>
                <span class="a-type">${esc(a.type)}</span>
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
})();
