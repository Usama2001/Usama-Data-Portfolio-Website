const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const canvas = document.querySelector(".hero-canvas");

const storedTheme = localStorage.getItem("portfolio-theme");

if (storedTheme === "light") {
  body.classList.add("theme-light");
}

function syncThemeLabel() {
  const isLight = body.classList.contains("theme-light");
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
}

syncThemeLabel();

themeToggle.addEventListener("click", () => {
  body.classList.toggle("theme-light");
  localStorage.setItem("portfolio-theme", body.classList.contains("theme-light") ? "light" : "dark");
  syncThemeLabel();
});

navToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navPanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const ctx = canvas.getContext("2d");
let particles = [];
let animationId;

function resetCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.max(34, Math.floor(rect.width / 34));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    r: Math.random() * 1.7 + 0.8
  }));
}

function drawNetwork() {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  const isLight = body.classList.contains("theme-light");
  const dotColor = isLight ? "rgba(18, 82, 158, 0.58)" : "rgba(75, 214, 255, 0.64)";
  const lineColor = isLight ? "rgba(73, 103, 169, 0.14)" : "rgba(134, 83, 255, 0.22)";

  particles.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < 0 || point.x > rect.width) point.vx *= -1;
    if (point.y < 0 || point.y > rect.height) point.vy *= -1;

    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 135) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1 - distance / 135;
        ctx.stroke();
      }
    }
  });

  animationId = requestAnimationFrame(drawNetwork);
}

resetCanvas();
drawNetwork();

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationId);
  resetCanvas();
  drawNetwork();
});
