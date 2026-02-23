document.querySelectorAll(".phrase").forEach(phrase => {
  const text = phrase.textContent;
  phrase.innerHTML = "";

  text.split("").forEach(c => {
    const span = document.createElement("span");
    span.className = "intro-letter";
    span.innerHTML = c === " " ? "&nbsp;" : c;
    phrase.appendChild(span);
  });
});


// =======================
// РАЗБИВКА ТЕКСТА В СЕКЦИИ 1
// =======================
function splitText(el) {
  let text = el.textContent
    .replace(/\s+/g, " ")   // убираем лишние переносы и пробелы
    .trim();                // убираем пробелы по краям

  el.innerHTML = "";

  for (let char of text) {
    const span = document.createElement("span");
    span.className = "intro-letter";
    span.textContent = char;
    el.appendChild(span);
  }
}

// Инициализация объединённого текста
function initBibleText() {
  const container = document.getElementById("section-text-main");
  if (!container) return;
  
  container.querySelectorAll(".verse").forEach(verse => {
    splitText(verse);   // разбиваем каждый стих отдельно
  });
}
initBibleText();   // вызываем один раз



function animateSectionText(skipped = false) {
  gsap.to(".section", { autoAlpha: 1, duration: 1.2 });

  const delay = skipped ? 0.22 : 0.75;  

  // Одна анимация на ВЕСЬ текст — появляется одновременно
  gsap.to("#section-text-main .intro-letter", {
    opacity: 1,
    y: 0,
    stagger: 0.021,          // красивая единая волна
    duration: 1.08,
    ease: "power3.out",
    delay: delay
  });

  ScrollTrigger.refresh();
}



const STAR_COLORS = [
  { color: [155, 176, 255], weight: 0.15 }, // O / B — голубые
  { color: [202, 215, 255], weight: 0.20 }, // A — бело-голубые
  { color: [248, 247, 255], weight: 0.30 }, // F — белые
  { color: [255, 244, 234], weight: 0.20 }, // G — жёлтые (как Солнце)
  { color: [255, 210, 161], weight: 0.10 }, // K — оранжевые
  { color: [255, 204, 111], weight: 0.05 }  // M — красноватые
];

function pickStarColor() {
  const r = Math.random();
  let acc = 0;
  for (const s of STAR_COLORS) {
    acc += s.weight;
    if (r <= acc) return s.color;
  }
  return STAR_COLORS[2].color;
}



const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let w, h;
let stars = [];
let comets = [];




function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ======================
   ЗВЁЗДЫ (ГЛУБИНА)
====================== */

for (let i = 0; i < 260; i++) {
  const [r, g, b] = pickStarColor();

  stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.6 + 0.3,
    a: Math.random() * 0.4 + 0.3,
    tw: Math.random() * 0.02 + 0.004,
    depth: Math.random(),
    color: { r, g, b }
  });
  
}
/* ======================
   КОМЕТЫ
====================== */
function spawnComet() {
  comets.push({
    x: -100,
    y: Math.random() * h * 0.6,
    vx: Math.random() * 6 + 8,
    vy: Math.random() * 1.5 + 0.5,
    life: 0,
    maxLife: 140,
    size: Math.random() * 3 + 3
  });
}



/* ======================
   DRAW
====================== */
function drawStars() {
  stars.forEach(s => {
    s.a += s.tw * (Math.random() > 0.5 ? 1 : -1);
    s.a = Math.max(0.15, Math.min(0.9, s.a));

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${s.a})`;
    ctx.fill();
    
  });
  
}


function drawComets() {
  comets.forEach((c, i) => {
    c.x += c.vx;
    c.y += c.vy;
    c.life++;

    // ХВОСТ
    const grad = ctx.createLinearGradient(
      c.x, c.y,
      c.x - c.vx * 10, c.y - c.vy * 10
    );
    grad.addColorStop(0, "rgba(255,255,255,0.9)");
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = grad;
    ctx.lineWidth = c.size;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x - c.vx * 10, c.y - c.vy * 10);
    ctx.stroke();

    // ЯДРО
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    if (c.life > c.maxLife || c.x > w + 200) {
      comets.splice(i, 1);
    }
  });
}

/* ======================
   LOOP
====================== */
function animate() {
  ctx.clearRect(0, 0, w, h);
  drawStars();
  drawComets();
  requestAnimationFrame(animate);
}

animate();

/* каждые 4–7 секунд новая комета */
setInterval(() => {
  if (Math.random() > 0.4) spawnComet();
}, 4500);




gsap.set(".section", { autoAlpha: 0 });

const introSound = document.getElementById("intro-sound");

const tl = gsap.timeline({
  onStart: () => {
    introSound.volume = 0.4;
    introSound.play().catch(()=>{});
  },
  onComplete: () => {
  document.querySelector(".intro").remove();
  animateSectionText(false);   // false = нормальное прохождение интро
}
});

// Пауза перед началом
tl.to({}, { duration: 1.2 });

/* =======================
   ФРАЗА 1 — ДЕНЬ / СОЛНЦЕ
======================= */
tl.to(".phrase-1 .intro-letter", {
  opacity: 1,
  y: 0,
  stagger: 0.05,
  duration: 0.6,
  ease: "power3.out"
})

.to({}, { duration: 0.6 }) // пауза

.to(".sun", {
  opacity: 1,
  scale: 1,
  duration: 1,
  ease: "power2.out"
})

.to(".sun", {
  x: 600,
  opacity: 0,
  duration: 2,
  ease: "power2.inOut"
});

/* =======================
   ФРАЗА 2 — НОЧЬ / ЛУНА
======================= */
tl.to(".phrase-2 .intro-letter", {
  opacity: 1,
  y: 0,
  stagger: 0.05,
  duration: 0.6,
  ease: "power3.out"
})

.to({}, { duration: 0.6 })

.to(".moon", {
  opacity: 1,
  scale: 1,
  duration: 1,
  ease: "power2.out"
})

.to(".moon", {
  x: -700,
  opacity: 0,
  duration: 2,
  ease: "power2.inOut"
});

/* =======================
   ФРАЗА 3 — ЗВЁЗДЫ
======================= */
tl.to(".phrase-3 .intro-letter", {
  opacity: 1,
  y: 0,
  stagger: 0.05,
  duration: 0.6,
  ease: "power3.out"
})

.to("#particles", {
  opacity: 1,
  duration: 2,
  ease: "power2.out"
});

tl.to(canvas, {
  scale: 1.08,
  duration: 6,
  ease: "power1.inOut"
})

/* =======================
   УХОД ИНТРО
======================= */
tl.to(".intro", {
  opacity: 0,
  duration: 2,
  delay: 0.8,
  ease: "power2.inOut"
});




document.querySelector(".skip-intro").addEventListener("click", () => {
  tl.kill(); // полностью останавливаем timeline

  gsap.to(".intro", {
    opacity: 0,
    duration: 1.1,
    ease: "power2.in",
    onComplete: () => {
      document.querySelector(".intro").remove();
      
      gsap.set("#particles", { opacity: 1 }); // звёзды сразу видимы
      
      animateSectionText(true);   // true = скип → текст сразу
    }
  });
});

