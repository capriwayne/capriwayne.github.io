/* =====================================================================
   EDIT THIS FILE TO UPDATE YOUR SITE.
   - SITE        name, college, bio
   - SECTIONS    the category pages in the top menu, in order
   - WORK        every piece; `section` decides which page it appears on
   Crimson articles live in data/crimson.js.
   ===================================================================== */

window.SITE = {
  name: "Capri Wayne",
  school: "Harvard College",
  bio: "History & Literature and Art, Film & Visual Studies @ Harvard College",
  resume: "",   // e.g. "files/resume.pdf"; leave "" to hide
  crimsonUrl: "https://www.thecrimson.com/writer/1220388/Capri_S._Wayne/"
};

/* Each section is its own page (file) in the top menu. */
window.SECTIONS = [
  { id: "writing", label: "Writing",            file: "writing.html" },
  { id: "design",  label: "Design",             file: "design.html" },
  { id: "dataviz", label: "Data Visualization", file: "data-visualization.html" },
  { id: "social",  label: "Social Media",       file: "social-media.html" },
  { id: "video",   label: "Video",              file: "video.html" }
];

/* Fields
   id, title, section, kind          required
   outlet, date, summary              optional text
   cover                              card image (defaults to first gallery image / video poster)
   link: { label, url }               button to an outside page
   pdfs: [{ src, label }]             PDFs shown inline
   gallery: [{ src, caption }]        image grid (click to enlarge)
   video: { src, poster }             self-hosted mp4  (or youtube: "embed url")
*/
window.WORK = [
  /* ---------------- Writing ---------------- */
  {
    id: "ai-careers",
    section: "writing",
    kind: "Feature",
    title: "From Robots to Movie Stars: How AI Is Transforming Careers",
    outlet: "JingKids · AI print issue",
    date: "Summer 2023",
    cover: "files/journalism/ai-careers-cover.jpg",
    pdfs: [{ src: "files/journalism/ai-transforming-careers.pdf", label: "Feature (3 pages)" }]
  },
  {
    id: "andrew-ross",
    section: "writing",
    kind: "Profile",
    title: "From Visual Major to World-Traveling Brooklyn Studio Artist",
    outlet: "The Muse · Dreyfoos School of the Arts",
    cover: "files/design/andrew-ross-cover.jpg",
    pdfs: [{ src: "files/design/andrew-ross-profile-spread.pdf", label: "Profile of Andrew Ross (2 pages)" }]
  },

  /* ---------------- Design ---------------- */
  {
    id: "infographics",
    section: "design",
    kind: "Infographics",
    title: "Infographics: Nuclear Power, AI, and the Metaverse",
    cover: "files/design/infographic-nuclear.webp",
    gallery: [
      { src: "files/design/infographic-nuclear.webp", caption: "Nuclear Power" },
      { src: "files/design/infographic-ai.webp", caption: "AI: applications and implications" },
      { src: "files/design/infographic-metaverse.jpg", caption: "Into the Metaverse" }
    ]
  },
  {
    id: "scroll-paintings",
    section: "design",
    kind: "Painting",
    title: "Scroll Paintings",
    outlet: "AFVS Sophomore Tutorial · Harvard",
    date: "Spring 2026",
    summary: "Scroll paintings inspired by traditional Chinese art.",
    gallery: [{ src: "files/design/scroll-paintings.jpg" }]
  },
  {
    id: "genai-symposium",
    section: "design",
    kind: "Event campaign",
    title: "Harvard University Generative AI Symposium",
    outlet: "Digital Data Design Institute at Harvard",
    date: "May 2025",
    gallery: [
      { src: "files/d3/symposium-16x9.webp", caption: "16:9 screen" },
      { src: "files/d3/symposium-poster.webp", caption: "Poster" },
      { src: "files/d3/symposium-1x1.webp", caption: "1:1 social" },
      { src: "files/d3/circuit-motif.webp", caption: "Circuit motif" }
    ]
  },
  {
    id: "genai-modules",
    section: "design",
    kind: "Graphics series",
    title: "GenAI Module Graphics",
    outlet: "Digital Data Design Institute at Harvard",
    gallery: [
      { src: "files/d3/genai-marketing.webp", caption: "GenAI + Marketing" },
      { src: "files/d3/genai-strategy.webp", caption: "GenAI + Strategy" },
      { src: "files/d3/genai-finance.webp", caption: "GenAI + Finance" },
      { src: "files/d3/genai-all-modules.webp", caption: "All modules" },
      { src: "files/d3/genai-modules-shield.webp", caption: "Module shield" },
      { src: "files/d3/vertical-ad-1.webp", caption: "Vertical ad" },
      { src: "files/d3/vertical-ad-2.webp", caption: "Vertical ad" },
      { src: "files/d3/vertical-ad-3.webp", caption: "Vertical ad" }
    ]
  },
  {
    id: "muse-spreads",
    section: "design",
    kind: "Magazine spreads",
    title: "The Muse: Magazine Spreads",
    outlet: "The Muse · Dreyfoos School of the Arts",
    cover: "files/design/history-of-campus-cover.jpg",
    pdfs: [
      { src: "files/design/history-of-campus-spread.pdf", label: "Floods, Termites, Time Capsules: A Rich History of Campus" },
      { src: "files/design/andrew-ross-profile-spread.pdf", label: "From Visual Major to World-Traveling Brooklyn Studio Artist" }
    ],
    gallery: [{ src: "files/design/still-undefeated-spread.webp", caption: "Still Undefeated" }]
  },

  /* ---------------- Data visualization ---------------- */
  {
    id: "research-charts",
    section: "dataviz",
    kind: "Research graphics",
    title: "Research Charts: AI Productivity and Climate Investment",
    outlet: "Digital Data Design Institute at Harvard",
    date: "2025",
    gallery: [
      { src: "files/dataviz/ai-productivity-gains.svg", caption: "AI drives biggest productivity gains for less experienced agents" },
      { src: "files/dataviz/ai-impact-smallmultiples.svg", caption: "Where AI makes the biggest difference" },
      { src: "files/dataviz/vc-climate-signal-chart.svg", caption: "VC investment sparks a 37% boost in climate focus" },
      { src: "files/dataviz/vc-signal-climate-impact-event-study.svg", caption: "Incumbents shift toward climate solutions after VC signals" },
      { src: "files/dataviz/vc-signal-dumbbell-chart.svg", caption: "Who benefits most" },
      { src: "files/dataviz/vc-signal-investment-impacts.svg", caption: "VC signal leads to real investment shifts" }
    ]
  },

  /* ---------------- Social media ---------------- */
  {
    id: "ai-flip-sxsw",
    section: "social",
    kind: "Social campaign",
    title: "D³ × SXSW: The AI Flip",
    outlet: "Digital Data Design Institute at Harvard",
    date: "2025",
    summary: "Social graphics for the Digital Data Design Institute's 2025 SXSW panel.",
    gallery: [
      { src: "files/d3/ai-flip-composite.webp" },
      { src: "files/d3/ai-flip-speakers.webp" },
      { src: "files/d3/ai-flip-illustration.webp" },
      { src: "files/d3/sxsw-vote.webp" }
    ]
  },
  {
    id: "the-muse",
    section: "social",
    kind: "Social graphics",
    title: "The Muse: Social and Print Promotion",
    outlet: "The Muse · Dreyfoos School of the Arts",
    gallery: [
      { src: "files/social/muse-info-session.webp", caption: "Info session" },
      { src: "files/social/muse-issue-1-flyer.jpg", caption: "Issue 1 distribution" },
      { src: "files/social/muse-issue-3.webp", caption: "Issue 3 distribution" },
      { src: "files/social/content-team-editors.webp", caption: "Content team editors" },
      { src: "files/social/eic-quote.webp", caption: "Staff quote" }
    ]
  },

  /* ---------------- Video ---------------- */
  {
    id: "hnmun-rewind",
    section: "video",
    kind: "Recap video",
    title: "HNMUN Rewind 2026",
    outlet: "Harvard National Model United Nations",
    date: "2026",
    summary: "Recap video of the 2026 HNMUN conference, screened for all delegates and staffers at the awards ceremony.",
    video: { src: "files/video/hnmun-rewind-2026.mp4", poster: "files/video/hnmun-poster.jpg" }
  },
  {
    id: "echoes",
    section: "video",
    kind: "Short film",
    title: "Echoes",
    outlet: "AFVS Sophomore Tutorial · Harvard",
    date: "Spring 2026",
    cover: "https://i.ytimg.com/vi/tX1JmK7WzQc/hqdefault.jpg",
    video: { youtube: "https://www.youtube-nocookie.com/embed/tX1JmK7WzQc" },
    link: { label: "Watch on YouTube", url: "https://youtu.be/tX1JmK7WzQc" }
  },
  {
    id: "palace-museum",
    section: "video",
    kind: "Promo video",
    title: "Palace Museum Promo",
    summary: "Mock promotional video for Discovery SE Asia's social media.",
    video: { src: "files/video/palace-museum-promo.mp4", poster: "files/video/palace-poster.jpg" }
  }
];
