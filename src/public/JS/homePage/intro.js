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






const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let w, h, particles = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5,
    a: Math.random() * 0.5 + 0.2,
    s: Math.random() * 0.3 + 0.1
  });
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.y -= p.s;
    if (p.y < 0) p.y = h;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,215,180,${p.a})`;
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();



gsap.set(".section", { autoAlpha: 0 });

const introSound = document.getElementById("intro-sound");

const tl = gsap.timeline({
  onStart: () => {
    introSound.volume = 0.4;
    introSound.play().catch(()=>{});
  },
  onComplete: () => {
    document.querySelector(".intro").remove();
    gsap.to(".section", { autoAlpha: 1, duration: 1 });
    ScrollTrigger.refresh();
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

/* =======================
   УХОД ИНТРО
======================= */
tl.to(".intro", {
  opacity: 0,
  duration: 2,
  delay: 0.8,
  ease: "power2.inOut"
});




