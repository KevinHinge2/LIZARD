const BASE_COUNT = 8492221;
const STORAGE_KEYS = {
  globalCount: "tomGlobalCount",
  localPresses: "tomLocalPresses",
  milestones: "tomMilestones"
};

const milestoneConfig = [
  { count: 10, burst: 24, message: "Milestone reached: 10 presses. Tom acknowledges your commitment." },
  { count: 50, burst: 48, message: "50 presses. The lizard pipeline is fully operational." },
  { count: 100, burst: 72, message: "100 presses. Premium lizard momentum achieved." },
  { count: 500, burst: 120, message: "Lizard Mode Activated." }
];

const state = {
  globalCount: Number(localStorage.getItem(STORAGE_KEYS.globalCount)) || BASE_COUNT,
  localPresses: Number(localStorage.getItem(STORAGE_KEYS.localPresses)) || 0,
  unlockedMilestones: JSON.parse(localStorage.getItem(STORAGE_KEYS.milestones) || "[]")
};

const globalCountEl = document.getElementById("globalCount");
const pressButton = document.getElementById("pressButton");
const lizardAudio = document.getElementById("lizardAudio");
const pressConfirmation = document.getElementById("pressConfirmation");
const heroMedia = document.getElementById("heroMedia");
const pageShell = document.getElementById("pageShell");
const confettiLayer = document.getElementById("confettiLayer");
const askForm = document.getElementById("askForm");
const answerText = document.getElementById("answerText");

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.globalCount, String(state.globalCount));
  localStorage.setItem(STORAGE_KEYS.localPresses, String(state.localPresses));
  localStorage.setItem(STORAGE_KEYS.milestones, JSON.stringify(state.unlockedMilestones));
}

function showConfirmation(message) {
  pressConfirmation.textContent = message;
  pressConfirmation.classList.add("show");
  window.clearTimeout(showConfirmation.timeout);
  showConfirmation.timeout = window.setTimeout(() => {
    pressConfirmation.classList.remove("show");
  }, 1800);
}

function triggerConfetti(amount) {
  const width = window.innerWidth;

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = "🦎";
    piece.style.left = `${Math.random() * width}px`;
    piece.style.animationDuration = `${2.8 + Math.random() * 1.4}s`;
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    piece.style.setProperty("--x-shift", `${-40 + Math.random() * 80}px`);
    confettiLayer.appendChild(piece);

    window.setTimeout(() => piece.remove(), 4400);
  }
}

function handleMilestone() {
  const unlockedSet = new Set(state.unlockedMilestones);
  const reached = milestoneConfig.find(
    (milestone) => milestone.count === state.localPresses && !unlockedSet.has(milestone.count)
  );

  if (!reached) return;

  state.unlockedMilestones.push(reached.count);
  showConfirmation(reached.message);
  triggerConfetti(reached.burst);
}

function playAudio() {
  if (!lizardAudio) return;
  lizardAudio.currentTime = 0;
  lizardAudio.play().catch(() => {
    showConfirmation("Press confirmed. (Add your lizard sound file to enable audio.)");
  });
}

function animatePressFeedback() {
  pressButton.classList.add("is-pressed");
  heroMedia.classList.add("bump");
  pageShell.classList.add("shake");

  setTimeout(() => pressButton.classList.remove("is-pressed"), 160);
  setTimeout(() => heroMedia.classList.remove("bump"), 280);
  setTimeout(() => pageShell.classList.remove("shake"), 240);
}

function handlePress() {
  state.globalCount += 1;
  state.localPresses += 1;
  globalCountEl.textContent = formatNumber(state.globalCount);

  playAudio();
  animatePressFeedback();
  showConfirmation("Button press confirmed.");
  handleMilestone();
  saveState();
}

function getTomAnswer() {
  const roll = Math.random();
  if (roll < 0.78) return "Lizard.";
  if (roll < 0.88) return "Lizard lizard.";
  if (roll < 0.96) return "Lizard, probably.";
  return "Tom has reviewed your question. Lizard.";
}

function handleAskTom(event) {
  event.preventDefault();
  const data = new FormData(askForm);
  const question = String(data.get("question") || "").trim();
  if (!question) return;

  answerText.textContent = "Consulting Tom…";

  setTimeout(() => {
    answerText.textContent = getTomAnswer();
  }, 780 + Math.random() * 640);

  askForm.reset();
}

function setupRevealAnimations() {
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -30px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function init() {
  globalCountEl.textContent = formatNumber(state.globalCount);
  pressButton.addEventListener("click", handlePress);
  askForm.addEventListener("submit", handleAskTom);
  setupRevealAnimations();
}

init();
