/* Renders the site from data/*.js. You shouldn't need to edit this file. */
(function () {
  const S = window.SITE || {};
  const W = window.WORK || [];
  const SECTIONS = window.SECTIONS || [];
  const params = new URLSearchParams(location.search);

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ext = (u) => (/^https?:\/\//.test(u || "") ? ' target="_blank" rel="noopener"' : "");
  const coverOf = (w) => w.cover || (w.gallery && w.gallery[0] && w.gallery[0].src) || (w.video && w.video.poster) || "";

  // Name / school everywhere
  document.querySelectorAll('[data-site="name"]').forEach((el) => (el.textContent = S.name || ""));
  document.querySelectorAll('[data-site="school"]').forEach((el) => (el.textContent = S.school || ""));

  // Nav
  const nav = $("#nav");
  if (nav) {
    const page = document.body.dataset.page;
    nav.innerHTML = [
      `<a href="./#work"${page === "home" ? ' aria-current="page"' : ""}>Work</a>`,
      S.crimsonUrl ? `<a href="crimson.html"${page === "crimson" ? ' aria-current="page"' : ""}>Crimson</a>` : "",
      S.resume ? `<a href="${esc(S.resume)}" target="_blank" rel="noopener">Résumé</a>` : ""
    ].join("");
  }

  ({ home: renderHome, work: renderWork, crimson: renderCrimson })[document.body.dataset.page]?.();

  /* ---------------- Home ---------------- */
  function renderHome() {
    const used = SECTIONS.filter((s) => W.some((w) => w.section === s.id));
    $("#section-jump").innerHTML = used.map((s) => `<a href="#${esc(s.id)}">${esc(s.label)}</a>`).join("");
    $("#sections").innerHTML = used.map((s) => `
      <section class="wrap section" id="${esc(s.id)}">
        <h2>${esc(s.label)}</h2>
        <div class="grid">${W.filter((w) => w.section === s.id).map(card).join("")}</div>
      </section>`).join("");
    $("#sections").id = "work";

    if (location.hash) {
      const t = document.getElementById(location.hash.slice(1));
      if (t) requestAnimationFrame(() => t.scrollIntoView());
    }
  }

  function card(w) {
    const href = w.href || `work.html?id=${encodeURIComponent(w.id)}`;
    const c = coverOf(w);
    const media = c
      ? `<img src="${esc(c)}" alt="" loading="lazy">`
      : `<div class="placeholder" aria-hidden="true"><span>${esc(w.title)}</span></div>`;
    return `
      <a class="card" href="${esc(href)}">
        <div class="card-media">${media}${w.video ? '<span class="play" aria-hidden="true">▶</span>' : ""}</div>
        <div class="card-body">
          <div class="meta">
            <span class="kind">${esc(w.kind)}</span>
            ${w.outlet ? `<span>${esc(w.outlet)}</span>` : ""}
            ${w.date ? `<span>${esc(w.date)}</span>` : ""}
          </div>
          <h3>${esc(w.title)}</h3>
          ${w.summary ? `<p>${esc(w.summary)}</p>` : ""}
        </div>
      </a>`;
  }

  /* ---------------- Work detail ---------------- */
  function renderWork() {
    const w = W.find((x) => x.id === params.get("id"));
    const el = $("#article");
    if (!w) {
      el.innerHTML = `<h1>Not found</h1><p><a href="./#work">Back to all work</a></p>`;
      return;
    }
    document.title = `${w.title} · ${S.name || "Portfolio"}`;
    const sec = SECTIONS.find((s) => s.id === w.section);

    let media = "";
    if (w.video && w.video.src) {
      media += `<div class="media"><video class="video" controls preload="metadata" playsinline
        ${w.video.poster ? `poster="${esc(w.video.poster)}"` : ""} src="${esc(w.video.src)}"></video></div>`;
    }
    if (w.video && w.video.youtube) {
      media += `<div class="media"><iframe class="video" src="${esc(w.video.youtube)}" title="${esc(w.title)}" allowfullscreen loading="lazy"></iframe></div>`;
    }
    (w.pdfs || []).forEach((p) => {
      media += `<div class="media"><object class="pdf" data="${esc(p.src)}#view=FitH" type="application/pdf" aria-label="${esc(p.label || w.title)}"></object>
        <div class="pdf-bar"><span>${esc(p.label || "PDF")}</span><a href="${esc(p.src)}" target="_blank" rel="noopener">Open full size ↗</a></div></div>`;
    });
    if ((w.gallery || []).length) {
      const one = w.gallery.length === 1;
      media += `<div class="gallery${one ? " single" : ""}">${w.gallery.map((g, i) => `
        <figure><button class="g-item" data-i="${i}" aria-label="Enlarge${g.caption ? ": " + esc(g.caption) : ""}">
          <img src="${esc(g.src)}" alt="${esc(g.caption || w.title)}" decoding="async"></button>
          ${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`;
    }
    const body = w.article && window.ARTICLES ? `<div class="prose">${window.ARTICLES[w.article] || ""}</div>` : "";
    const link = w.link && w.link.url ? `<a class="cta" href="${esc(w.link.url)}"${ext(w.link.url)}>${esc(w.link.label || "View")} →</a>` : "";

    el.innerHTML = `
      <a class="back" href="./#${esc(w.section)}">← ${esc(sec ? sec.label : "All work")}</a>
      <div class="meta"><span class="kind">${esc(w.kind)}</span>
        ${w.outlet ? `<span>${esc(w.outlet)}</span>` : ""}${w.date ? `<span>${esc(w.date)}</span>` : ""}</div>
      <h1>${esc(w.title)}</h1>
      ${w.summary ? `<p class="summary">${esc(w.summary)}</p>` : ""}
      ${link}${media}${body}`;

    // Lightbox
    const lb = $("#lightbox");
    if (lb && w.gallery) {
      el.addEventListener("click", (e) => {
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

  /* ---------------- Crimson ---------------- */
  function renderCrimson() {
    const url = S.crimsonUrl;
    $("#crimson-open").href = url;
    $("#crimson-frame").src = url;
    const base = new URL(url).origin;
    $("#crimson-list").innerHTML = (window.CRIMSON_ARTICLES || []).map((a) => `
      <li><a href="${esc(base + a.path)}" target="_blank" rel="noopener">${esc(a.title)}</a>
      <span class="date">${esc(a.date)}</span></li>`).join("");
  }
})();
