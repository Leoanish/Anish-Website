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
    answer: "Anish Bhattarai is a Ph.D. student and Graduate Research Assistant in Crop and Soil Sciences at the University of Georgia. He is a precision agriculture researcher who combines agronomy, crop sensors, UAV LiDAR, satellite and weather data, spatial modeling, and software to turn field data into practical decisions. Originally trained in Nepal (B.Sc. in Agriculture, Chitwan), he has six peer-reviewed papers, thirteen awards and honors, and has built tools such as GeoSampler and Plant Pixel Extractor."
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
    answer: "Anish’s CV lists six peer-reviewed papers across precision agriculture, remote sensing, crop modeling, and agronomy. They include a first-author UAV LiDAR paper in Remote Sensing and collaborations on CottonVaRx, explainable-AI peanut yield prediction, cotton lint variability, yam nutrition, and spring rice establishment."
  },
  {
    topics: ["award", "honor", "competition", "hackathon"],
    answer: "The 2026 CV lists thirteen awards and honors. Recent highlights include second place with Team Georgia at the 2026 NxS Hackathon; first place in the 2025 Precision Agriculture Systems oral competition; first place in the 2025 Bayer graduate hackathon; and multiple research presentation awards from 2023–2025."
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
  text.split(/\n+/).forEach(rawLine => {
    const line = rawLine.trim();
    if (!line) return;
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
    error.friendly = response.status === 429 ? reason : "";
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
    answer = error.friendly || localAnswer(clean);
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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } });
}, { threshold: .1 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

document.querySelector("#year").textContent = new Date().getFullYear();
