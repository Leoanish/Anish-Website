// Visitor analytics (Google Analytics 4).
// Turned on by the <meta name="ga-id" content="G-XXXXXXXXXX"> tag in index.html.
// With no ID set, nothing loads and nothing is tracked.
(function () {
  const meta = document.querySelector('meta[name="ga-id"]');
  const id = meta && meta.content.trim();
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id);

  const track = (name, params) => gtag("event", name, params || {});

  document.addEventListener("click", event => {
    const el = event.target.closest("a, button");
    if (!el) return;

    if (el.matches("[data-open-agent]")) {
      track("chat_open", { location: el.closest("header") ? "header" : "page" });
      return;
    }
    if (el.matches("[data-award-filter]") || el.closest("[data-award-filter]")) {
      const card = el.closest("[data-award-filter]") || el;
      track("award_filter", { category: card.dataset.awardFilter });
      return;
    }
    if (el.tagName === "A") {
      const href = el.getAttribute("href") || "";
      if (/\.pdf($|\?)/i.test(href)) {
        track("cv_open", { method: el.hasAttribute("download") ? "download" : "view" });
        return;
      }
      const tool = el.closest("[data-tool]");
      if (tool && /^https?:/.test(href)) {
        track("tool_link", { tool: tool.dataset.tool, destination: new URL(href).hostname });
      }
    }
  }, true);

  // A tool counts as viewed when its panel opens (by click, tap or hover).
  let toolsReady = false;
  setTimeout(() => { toolsReady = true; }, 1500);
  const seenTools = new Set();
  new MutationObserver(records => {
    if (!toolsReady) return;
    records.forEach(r => {
      if (r.target.getAttribute("aria-expanded") !== "true") return;
      const tool = r.target.closest("[data-tool]");
      if (tool && !seenTools.has(tool.dataset.tool)) {
        seenTools.add(tool.dataset.tool);
        track("tool_view", { tool: tool.dataset.tool });
      }
    });
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["aria-expanded"] });

  const form = document.querySelector("#agent-form");
  if (form) form.addEventListener("submit", () => track("chat_question"), true);

  document.querySelectorAll(".suggestion-row button").forEach(chip =>
    chip.addEventListener("click", () => track("chat_question", { suggested: true }), true));
})();
