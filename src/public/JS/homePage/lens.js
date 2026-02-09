// 1. Lenis — плавный скролл
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: true,   // можно true для мобильных
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Обязательная синхронизация с ScrollTrigger!
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // GSAP ticker для плавности
});
gsap.ticker.lagSmoothing(0); // убирает лаги

// 3. Анимации секций (pin + переход картинки)
gsap.utils.toArray('.section').forEach((section, i) => {
  const img = section.querySelector('.bg-image img');

  // Timeline для каждой секции
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',       // когда верх секции достигает верха экрана
      end: '+=100%',          // длина pinning = высота экрана
      pin: true,              // приклеиваем секцию
      scrub: true,            // анимация следует за скроллом
      // markers: true,       // включи для отладки
    }
  });

  // Пример анимации картинки при "переходе"
  tl.fromTo(img, 
    { scale: 1.1, opacity: 0.7 },   // начало — чуть увеличена и полупрозрачна
    { scale: 1, opacity: 1, duration: 1 }
  )
  .to(img, { scale: 1.3, opacity: 0.4 }, '<') // потом zoom out + fade (можно менять)
  // Добавь что хочешь: clipPath, yPercent, filter: blur и т.д.
});