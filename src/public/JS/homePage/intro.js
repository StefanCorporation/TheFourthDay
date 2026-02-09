const textEl = document.getElementById("intro-text");
const text = textEl.innerText;
textEl.innerHTML = "";

text.split("").forEach(c => {
  const span = document.createElement("span");
  span.className = "intro-letter";
  span.innerHTML = c === " " ? "&nbsp;" : c;
  textEl.appendChild(span);
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

/* 1. Чёрный экран — пауза */
tl.to({}, { duration: 1.5 })

/* 2. Появляются звёзды */
.to("#particles", {
  opacity: 1,
  duration: 2,
  ease: "power2.out"
})

/* 3. Небольшая пауза */
.to({}, { duration: 0.8 })

/* 4. Появление текста по буквам */
.to(".intro-letter", {
  opacity: 1,
  y: 0,
  duration: 0.7,
  ease: "power3.out",
  stagger: 0.06
})

/* 5. «Оживление» свечения текста */
.to(".intro-letter", {
  backgroundPosition: "100% 0%",
  textShadow: `
    0 0 15px rgba(255,215,0,.6),
    0 0 40px rgba(255,215,0,.4),
    0 0 80px rgba(255,215,0,.2)
  `,
  duration: 1.5,
  ease: "sine.inOut"
})

/* 6. Исчезновение интро */
.to(".intro", {
  opacity: 0,
  duration: 1.8,
  ease: "power2.inOut",
  delay: 1
});
