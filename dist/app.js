// Ask Anish — AI chat settings.
// Paste the URL of the deployed chat proxy (see worker/worker.js and the README) between the quotes.
// While this is empty, the chat answers from the short built-in notes below instead of the AI.
const CHAT_ENDPOINT = "https://ask-anish.leoanish.workers.dev";
const MAX_HISTORY = 10;
const MAX_QUESTION_LENGTH = 500;

// Built-in fallback answers, used only when the AI service is unavailable.
const profileKnowledge = [
  {
    topics: ["who is", "who's", "about anish", "about him", "tell me about", "introduce", "introduction", "summary", "summarize anish", "overview", "background", "bio"],
    answer: "Anish Bhattarai is a Ph.D. student and Graduate Research Assistant in Crop and Soil Sciences at the University of Georgia. He is a precision agriculture researcher who combines agronomy, crop sensors, UAV LiDAR, satellite and weather data, spatial modeling, and software to turn field data into practical decisions. Originally trained in Nepal (B.Sc. in Agriculture, Chitwan), he has six peer-reviewed papers, fifteen awards and honors, and has built tools such as GeoSampler and Plant Pixel Extractor."
  },
  {
    topics: ["current research", "researching now", "weather", "prism", "daymet", "research"],
    answer: "Anish’s current research centers on two connected questions: sensor-based nitrogen management in cotton and whether weather data products are representative at field scale. He compares UGA weather stations with PRISM and Daymet using geostatistics and machine learning, testing how distance, topography, soil, land cover, and environmental conditions influence agreement in variables such as temperature and precipitation."
  },
  {
    topics: ["education", "degree", "phd", "school", "university", "gpa", "nepal"],
    answer: "Anish is pursuing a Ph.D. in Crop and Soil Sciences at the University of Georgia, with an expected completion in 2027 and a 3.92/4.00 GPA. He entered on the M.S. track in 2022 and transitioned directly to the Ph.D. program in 2025. He earned his B.Sc. in Agriculture from Agriculture and Forestry University in Chitwan, Nepal."
  },
  {
    topics: ["skills", "technical", "software", "programming", "r", "shiny", "gis", "machine learning"],
    answer: "His toolkit spans R, Shiny, statistical modeling, machine learning, reproducible workflows, and data visualization. His geospatial work includes GIS, spatial analysis, UAV multispectral imagery and LiDAR, point-cloud processing, satellite data, and weather-data integration."
  },
  {
    topics: ["lidar", "uav", "drone", "canopy"],
    answer: "Anish evaluated UAV LiDAR flight altitude, speed, point-cloud subsampling, and terrain-classification settings for efficient cotton canopy-height measurement. That work led to a 2025 first-author paper in Remote Sensing: “Optimizing Unmanned Aerial Vehicle LiDAR Data Collection in Cotton Through Flight Settings and Data Processing.”"
  },
  {
    topics: ["nitrogen", "sensor", "variable rate", "cotton"],
    answer: "His nitrogen-management research compares active and passive crop sensors, sensor-based recommendations, and traditional management across field environments. He evaluates accuracy, consistency, and practical usefulness alongside yield, fiber quality, nitrogen-use efficiency, and profitability. He also helped build NxS Advisor from a multi-state nitrogen-by-sulfur dataset."
  },
  {
    topics: ["publication", "papers", "published", "doi"],
    answer: "Anish has seven journal articles on Google Scholar, six of them summarised on this site, across precision agriculture, remote sensing, crop modeling, and agronomy. They include a first-author UAV LiDAR paper in Remote Sensing and collaborations on CottonVaRx, explainable-AI peanut yield prediction, cotton lint variability, yam nutrition, and spring rice establishment."
  },
  {
    topics: ["award", "honor", "competition", "hackathon"],
    answer: "Anish has fifteen awards and honors. Recent highlights include first place in the Precision Agriculture Systems Ph.D. oral competition at CANVAS 2026 in Portland, Oregon (presenting GeoSampler); second place in the CANVAS 2026 Student Hackathon; second place with Team Georgia at the 2026 NxS Hackathon; first place in the 2025 Precision Agriculture Systems oral competition; first place in the 2025 Bayer graduate hackathon; and multiple research presentation awards from 2023–2025."
  },
  {
    topics: ["geosampler", "dashboard", "app"],
    answer: "GeoSampler is an interactive geospatial data workflow for acquisition, comparison, visualization, and customized downloads. A live Shiny version is linked in the selected-work section of this site."
  },
  {
    topics: ["plant pixel", "ppe", "phenotyping", "image"],
    answer: "Plant Pixel Extractor (PPE) is a package and plugin Anish is developing to extract plant pixels from field imagery for reproducible image-based phenotyping and downstream crop analysis."
  },
  {
    topics: ["leadership", "community", "president", "secretary"],
    answer: "Anish served as President of the Nepalese Student Association at UGA from 2024–2025 and as Secretary of the Integrative Precision Agriculture Club from 2024–2026."
  },
  {
    topics: ["outreach", "extension", "speaker", "field day"],
    answer: "His extension work includes presenting in-season nitrogen management at a Farmers Field Day, speaking on a precision agriculture tour, engaging high-school students, and participating in cotton production field events across Georgia."
  },
  {
    topics: ["contact", "email", "linkedin", "github", "scholar"],
    answer: "You can reach Anish at ab68010@uga.edu. His Google Scholar, GitHub, and LinkedIn profiles are linked in the footer, and his complete CV is available from the CV section."
  },
  {
    topics: ["hobby", "hobbies", "sports", "team", "player", "nation"],
    answer: "Anish has reserved that part of the portfolio for personal interests he explicitly chooses to publish. Those details are not in the current CV, so I won’t guess them."
  }
];

const panel = document.querySelector(".agent-panel");
const backdrop = document.querySelector(".agent-backdrop");
const input = document.querySelector("#agent-input");
const chatLog = document.querySelector("#chat-log");
const sendButton = document.querySelector("#agent-form button");
const conversation = [];
let busy = false;

function openAgent() {
  backdrop.hidden = false;
  requestAnimationFrame(() => panel.classList.add("open"));
  panel.setAttribute("aria-hidden", "false");
  document.body.classList.add("agent-open");
  setTimeout(() => input.focus(), 220);
}

function closeAgent() {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("agent-open");
  setTimeout(() => { backdrop.hidden = true; }, 380);
}

document.querySelectorAll("[data-open-agent]").forEach(button => button.addEventListener("click", openAgent));
document.querySelectorAll("[data-close-agent]").forEach(button => button.addEventListener("click", closeAgent));
document.addEventListener("keydown", event => { if (event.key === "Escape" && panel.classList.contains("open")) closeAgent(); });

function localAnswer(question) {
  const normalized = question.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
  let best = null;
  let bestScore = 0;
  profileKnowledge.forEach(entry => {
    const score = entry.topics.reduce((total, topic) => total + (normalized.includes(topic) ? topic.split(" ").length + 1 : 0), 0);
    if (score > bestScore) { best = entry; bestScore = score; }
  });
  return bestScore > 0
    ? best.answer
    : "The AI guide is temporarily offline, so I can only answer a few set topics right now: Anish’s background, education, current research, projects, publications, awards, technical skills, leadership, outreach, or contact details. Please try again in a moment, or open the full CV from the CV section.";
}

// Turns the assistant's light Markdown (bold, links, lists) into safe DOM nodes.
function appendInline(parent, text) {
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|(https?:\/\/[^\s<>()]+[^\s<>().,;:!?])/g;
  let last = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parent.append(text.slice(last, match.index));
    if (match[1] !== undefined) {
      const strong = document.createElement("strong");
      strong.textContent = match[1];
      parent.append(strong);
    } else {
      const link = document.createElement("a");
      link.href = match[3] || match[4];
      link.textContent = match[2] || match[4].replace(/^https?:\/\//, "");
      link.target = "_blank";
      link.rel = "noreferrer";
      parent.append(link);
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) parent.append(text.slice(last));
}

function renderRichText(container, text) {
  container.replaceChildren();
  let list = null;
  let table = null;
  text.split(/\n+/).forEach(rawLine => {
    const line = rawLine.trim();
    if (!line) return;
    // Markdown tables: | a | b |
    if (/^\|.*\|$/.test(line)) {
      list = null;
      if (/^\|[\s:|-]+\|$/.test(line)) return;   // separator row
      const cells = line.slice(1, -1).split("|").map(cell => cell.trim());
      const isHeader = !table;
      if (!table) {
        const wrap = document.createElement("div");
        wrap.className = "message-table";
        table = document.createElement("table");
        wrap.append(table);
        container.append(wrap);
      }
      const row = document.createElement("tr");
      cells.forEach(cell => {
        const el = document.createElement(isHeader ? "th" : "td");
        appendInline(el, cell);
        row.append(el);
      });
      table.append(row);
      return;
    }
    table = null;
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      if (!list) { list = document.createElement("ul"); container.append(list); }
      const item = document.createElement("li");
      appendInline(item, bullet[1]);
      list.append(item);
    } else {
      list = null;
      const paragraph = document.createElement("p");
      appendInline(paragraph, line.replace(/^#{1,6}\s+/, ""));
      container.append(paragraph);
    }
  });
}

function scrollChat() {
  chatLog.scrollTop = chatLog.scrollHeight;
}

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = type === "user" ? "You" : "Ask Anish";
  const body = document.createElement("div");
  body.className = "message-body";
  if (type === "user") {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    body.append(paragraph);
  } else {
    renderRichText(body, text);
  }
  message.append(label, body);
  chatLog.append(message);
  scrollChat();
  return body;
}

async function streamAnswer(body) {
  const response = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: conversation.slice(-MAX_HISTORY) })
  });

  if (!response.ok || !response.body) {
    let reason = "";
    try { reason = (await response.json()).error || ""; } catch { /* not JSON */ }
    const error = new Error(reason || `Chat request failed (${response.status})`);
    error.busy = response.status === 429;
    throw error;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      const data = line.trim();
      if (!data.startsWith("data:")) continue;
      const payload = data.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
        if (delta) {
          answer += delta;
          body.classList.remove("thinking");
          renderRichText(body, answer);
          scrollChat();
        }
      } catch { /* ignore keep-alive or partial lines */ }
    }
  }

  if (!answer.trim()) throw new Error("Empty answer");
  return answer;
}

async function ask(question) {
  const clean = question.trim().slice(0, MAX_QUESTION_LENGTH);
  if (!clean || busy) return;
  busy = true;
  sendButton.disabled = true;
  document.querySelector(".suggestion-row")?.remove();

  addMessage(clean, "user");
  conversation.push({ role: "user", content: clean });
  input.value = "";
  input.style.height = "auto";

  const body = addMessage("Thinking…", "assistant");
  body.classList.add("thinking");

  let answer;
  try {
    if (!CHAT_ENDPOINT) throw new Error("Chat endpoint not configured");
    answer = await streamAnswer(body);
  } catch (error) {
    // The AI service is unreachable or not set up: answer from the built-in notes instead.
    console.warn("[Ask Anish] Falling back to built-in answers:", error.message);
    answer = localAnswer(clean);
    if (error.busy) answer += "\n\nMany people are asking right now, so this is a shorter built-in answer. Ask again in a minute for the full AI answer.";
    renderRichText(body, answer);
  }

  body.classList.remove("thinking");
  conversation.push({ role: "assistant", content: answer });
  scrollChat();
  busy = false;
  sendButton.disabled = false;
  if (panel.classList.contains("open")) input.focus();
}

document.querySelector("#agent-form").addEventListener("submit", event => { event.preventDefault(); ask(input.value); });
document.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => ask(button.dataset.question)));
input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = `${Math.min(input.scrollHeight, 120)}px`; });
input.addEventListener("keydown", event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(input.value); } });

// Google Scholar numbers and the Publications section (data/scholar.json is refreshed daily
// by the site's GitHub workflow).
const normalize = value => value.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
function el(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}
function externalLink(href, text, className) {
  const link = el("a", className, text);
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  return link;
}
// Papers with a picture and a DOI on this site, matched to Scholar titles.
const FEATURED_PAPERS = [
  { match: "cottonvarx", image: "cottonvarx", doi: "https://doi.org/10.1016/j.eja.2026.128090" },
  { match: "peanut yield and grade", image: "peanut", doi: "https://doi.org/10.1016/j.compag.2025.111270" },
  { match: "optimizing unmanned aerial vehicle lidar", image: "lidar", doi: "https://doi.org/10.3390/rs17091504" },
  { match: "cotton lint yield and quality", image: "lint", doi: "https://doi.org/10.1016/j.fcr.2025.109822" },
  { match: "effect of tuber size", image: "yam", doi: "https://doi.org/10.26480/asm.01.2021.17.19" },
  { match: "effect of crop establishment", image: "rice", doi: "https://doi.org/10.26480/bda.01.2021.06.11" }
];
const KNOWN_NAMES = { bastos: "Leonardo M. Bastos", scarpin: "Gonzalo J. Scarpin", jakhar: "Amrinder Jakhar", hand: "Lavesta C. Hand", snider: "John L. Snider", roberts: "Phillip M. Roberts", porter: "Wesley Porter" };
const titleCase = text => (text.length > 16 && text === text.toUpperCase() ? text.toLowerCase().replace(/\b([a-z])/g, c => c.toUpperCase()).replace(/\b(Of|And|In|The|For|On)\b/g, w => w.toLowerCase()) : text);

let scholarData = null;
let pubsFilter = "lead";

function renderPublications() {
  const list = document.querySelector(".pubs-list");
  if (!list || !scholarData) return;
  list.replaceChildren();
  const pubs = scholarData.publications.filter(p => pubsFilter === "all" || p.role === pubsFilter);
  const groups = [
    ["journal", "Journal articles"],
    ["presentation", "Conference presentations"],
    ["other", "Preprints, reports, and other work"]
  ];
  groups.forEach(([type, label]) => {
    const items = pubs.filter(p => p.type === type);
    if (!items.length) return;
    const group = el("div", "pubs-group");
    const head = el("div", "pubs-group-head");
    head.append(el("h3", "", label), el("span", "pubs-group-count", `${items.length}`));
    group.append(head);
    items.forEach(pub => {
      const featured = type === "journal" ? FEATURED_PAPERS.find(f => normalize(pub.title).startsWith(f.match)) : null;
      const row = el("article", `pub-row${featured ? " has-image" : ""}`);
      row.append(el("span", "pub-year", pub.year || "—"));
      if (featured) {
        const thumb = el("div", `pub-thumb cv-paper-${featured.image}`);
        thumb.setAttribute("aria-hidden", "true");
        row.append(thumb);
      }
      const body = el("div", "pub-body");
      body.append(el("h4", "", pub.title));
      const meta = el("p", "pub-meta");
      const venue = titleCase((pub.venue || "").replace(/,\s*\d{4}$/, "").replace(/,\s*0$/, ""));
      if (venue) meta.append(el("em", "", venue));
      body.append(meta);
      const tags = el("div", "pub-tags");
      tags.append(el("span", `pub-role ${pub.role === "lead" ? "lead" : "co"}`, pub.role === "lead" ? "Lead author" : "Co-author"));
      if (pub.cited_by > 0) tags.append(el("span", "pub-cited", `Cited by ${pub.cited_by}`));
      body.append(tags);
      row.append(body);
      const open = externalLink(featured ? featured.doi : pub.link, "↗", "pub-open");
      open.setAttribute("aria-label", `${featured ? "Open the paper" : "Open on Google Scholar"}: ${pub.title}`);
      row.append(open);
      group.append(row);
    });
    list.append(group);
  });
}

function renderCollaborators() {
  const box = document.querySelector(".pubs-collab-list");
  if (!box || !scholarData) return;
  const counts = new Map();
  scholarData.publications.forEach(pub => {
    const seen = new Set();
    (pub.authors || "").split(",").map(a => a.trim()).filter(a => a && a !== "...").forEach(author => {
      const parts = author.split(/\s+/);
      const surname = parts[parts.length - 1];
      const key = surname.toLowerCase();
      if (key === "bhattarai" || seen.has(key)) return;
      seen.add(key);
      const entry = counts.get(key) || { name: KNOWN_NAMES[key] || author, count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    });
  });
  [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 7).forEach(person => {
    const chip = el("span", "collab-chip");
    chip.append(el("span", "", person.name), el("b", "", person.count));
    chip.title = `${person.count} shared publications or presentations`;
    box.append(chip);
  });
}

document.querySelectorAll("[data-pubs-filter]").forEach(button => {
  button.addEventListener("click", () => {
    pubsFilter = button.dataset.pubsFilter;
    document.querySelectorAll("[data-pubs-filter]").forEach(card => {
      const selected = card === button;
      card.classList.toggle("active", selected);
      card.setAttribute("aria-selected", String(selected));
    });
    renderPublications();
  });
});

fetch("data/scholar.json", { cache: "no-cache" })
  .then(response => (response.ok ? response.json() : null))
  .then(data => {
    if (!data || !Array.isArray(data.publications)) return;
    scholarData = data;
    const pubs = data.publications;
    const count = (role, type) => pubs.filter(p => (!role || p.role === role) && (!type || p.type === type)).length;
    const values = {
      journal_count: data.journal_count,
      citations: data.citations,
      h_index: data.h_index,
      updated: data.updated ? new Date(`${data.updated}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""
    };
    document.querySelectorAll("[data-scholar]").forEach(element => {
      const value = values[element.dataset.scholar];
      if (value !== undefined && value !== "") element.textContent = value;
    });
    const pubsCounts = {
      lead: count("lead"), lead_journal: count("lead", "journal"), lead_presentation: count("lead", "presentation"),
      co: count("co-author"), co_journal: count("co-author", "journal"), co_presentation: count("co-author", "presentation"),
      all: pubs.length
    };
    document.querySelectorAll("[data-pubs-count]").forEach(element => {
      const value = pubsCounts[element.dataset.pubsCount];
      if (value !== undefined) element.textContent = value;
    });
    renderPublications();
    renderCollaborators();
  })
  .catch(() => { /* keep the numbers already written in the page */ });

document.querySelectorAll("[data-cv-filter]").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.cvFilter;
    document.querySelectorAll("[data-cv-filter]").forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    document.querySelectorAll("[data-cv-category]").forEach(item => {
      item.hidden = filter !== "all" && item.dataset.cvCategory !== filter;
    });
  });
});

const navigationLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const navigationSections = navigationLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
let navigationFrame = null;

function updatePagePosition() {
  const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
  document.documentElement.style.setProperty("--scroll-progress", `${progress * 100}%`);

  const marker = window.scrollY + document.querySelector(".site-header").offsetHeight + window.innerHeight * .22;
  let activeSection = null;
  navigationSections.forEach(section => {
    if (section.offsetTop <= marker) activeSection = section;
  });

  navigationLinks.forEach(link => {
    const isActive = activeSection && link.getAttribute("href") === `#${activeSection.id}`;
    link.classList.toggle("active", Boolean(isActive));
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  navigationFrame = null;
}

function requestPagePositionUpdate() {
  if (navigationFrame === null) navigationFrame = requestAnimationFrame(updatePagePosition);
}

window.addEventListener("scroll", requestPagePositionUpdate, { passive: true });
window.addEventListener("resize", requestPagePositionUpdate);
window.addEventListener("hashchange", requestPagePositionUpdate);
updatePagePosition();

const projectButtons = document.querySelectorAll(".project-toggle");

function closeProject(card) {
  const button = card.querySelector(".project-toggle");
  const details = card.querySelector(".project-details");
  card.classList.remove("expanded");
  button.setAttribute("aria-expanded", "false");
  button.querySelector("span").textContent = "Explore project";
  details.hidden = true;
}

projectButtons.forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".project-card");
    const details = card.querySelector(".project-details");
    const isOpen = button.getAttribute("aria-expanded") === "true";

    document.querySelectorAll(".project-card.expanded").forEach(openCard => {
      if (openCard !== card) closeProject(openCard);
    });

    if (isOpen) {
      closeProject(card);
      return;
    }

    card.classList.add("expanded");
    button.setAttribute("aria-expanded", "true");
    button.querySelector("span").textContent = "Close project";
    details.hidden = false;
    setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
  });
});

// Tools: one panel is open at a time. On wide screens pointing at a panel opens it;
// everywhere, clicking or tapping its tab opens it (and closes it again on small screens).
const toolPanels = [...document.querySelectorAll(".tool-panel")];
const toolStripQuery = window.matchMedia("(min-width: 1180px)");
let toolHoverTimer = null;

function setActiveTool(panel) {
  toolPanels.forEach(item => {
    const active = item === panel;
    item.classList.toggle("active", active);
    item.querySelector(".tool-tab").setAttribute("aria-expanded", String(active));
  });
}

toolPanels.forEach(panel => {
  const tab = panel.querySelector(".tool-tab");
  panel.addEventListener("mouseenter", () => {
    if (!toolStripQuery.matches) return;
    clearTimeout(toolHoverTimer);
    toolHoverTimer = setTimeout(() => setActiveTool(panel), 90);
  });
  panel.addEventListener("mouseleave", () => clearTimeout(toolHoverTimer));
  tab.addEventListener("focus", () => { if (toolStripQuery.matches) setActiveTool(panel); });
  tab.addEventListener("click", () => {
    const closing = !toolStripQuery.matches && panel.classList.contains("active");
    setActiveTool(closing ? null : panel);
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } });
}, { threshold: .1 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

document.querySelector("#year").textContent = new Date().getFullYear();
