const profileKnowledge = [
  {
    topics: ["current research", "researching now", "weather", "prism", "daymet", "research"],
    answer: "Anish’s current research centers on two connected questions: sensor-based nitrogen management in cotton and whether weather data products are representative at field scale. He compares UGA weather stations with gridded products such as PRISM and Daymet using geostatistics, machine learning, and landscape covariates."
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
    answer: "His nitrogen-management research compares active and passive crop sensors and recommendation approaches across field environments, with attention to yield, fiber quality, nitrogen-use efficiency, and profitability. He also helped build NxS Advisor from a multi-state nitrogen-by-sulfur dataset."
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

function findAnswer(question) {
  const normalized = question.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
  let best = null;
  let bestScore = 0;
  profileKnowledge.forEach(entry => {
    const score = entry.topics.reduce((total, topic) => total + (normalized.includes(topic) ? topic.split(" ").length + 1 : 0), 0);
    if (score > bestScore) { best = entry; bestScore = score; }
  });
  return bestScore > 0
    ? best.answer
    : "I don’t have enough verified information to answer that yet. I can help with Anish’s education, current research, projects, publications, awards, technical skills, leadership, outreach, or contact details.";
}

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = type === "user" ? "You" : "Portfolio guide";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  message.append(label, paragraph);
  chatLog.append(message);
  chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: "smooth" });
}

function ask(question) {
  const clean = question.trim();
  if (!clean) return;
  addMessage(clean, "user");
  input.value = "";
  input.style.height = "auto";
  const typing = document.createElement("div");
  typing.className = "message assistant";
  typing.innerHTML = '<span class="message-label">Portfolio guide</span><p>Checking the curated record…</p>';
  chatLog.append(typing);
  chatLog.scrollTop = chatLog.scrollHeight;
  setTimeout(() => { typing.remove(); addMessage(findAnswer(clean), "assistant"); }, 420);
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
