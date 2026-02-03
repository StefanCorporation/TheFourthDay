const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

let particles = [];
let comet = null;

class Particle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 60;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw() {
    ctx.fillStyle = `rgba(0,255,255,${this.life / 60})`;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}

class Comet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 12;
    this.vy = -8;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // хвост
    for (let i = 0; i < 8; i++) {
      particles.push(
        new Particle(
          this.x,
          this.y,
          -this.vx * 0.2 + (Math.random() - 0.5),
          -this.vy * 0.2 + (Math.random() - 0.5)
        )
      );
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#0ff";
    ctx.fill();
  }

  isOffscreen() {
    return (
      this.x > canvas.width + 100 ||
      this.y < -100
    );
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (comet) {
    comet.update();
    comet.draw();

    if (comet.isOffscreen()) {
      comet = null;
      fadeOutIntro();
    }
  }

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

animate();

function fadeOutIntro() {
  gsap.to(".intro", {
    opacity: 0,
    duration: 0.6,
    onComplete: () => {
      document.querySelector(".intro")?.remove();
    }
  });
}

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    btn.style.visibility = "hidden";

    if (!comet) {
      comet = new Comet(x, y);
    }

    if (btn.dataset.sound === "on") {
      console.log("🔊 Sound ON");
    } else {
      console.log("🔇 Sound OFF");
    }
  });
});


