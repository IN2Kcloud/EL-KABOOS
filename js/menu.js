document.addEventListener("DOMContentLoaded", function () {
  // ============================
  // MENU TOGGLE SYSTEM
  // ============================
  const menuOpen = document.querySelector(".menu-open");
  const menuClose = document.querySelector(".menu-close");

  let isOpen = false;
  const defaultEase = "power4.inOut";

  gsap.set(".menu-logo img", { y: 50 });
  gsap.set(".menu-link p", { y: 100 });
  gsap.set(".menu-sub-item p", { y: 12 });
  gsap.set(["#img-2, #img-3, #img-4"], { top: "150%" });

  const openMenu = () => {
    gsap.to(".menu", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      pointerEvents: "all",
      duration: 1.25,
      ease: defaultEase,
    });

    gsap.to(".hero", {
      top: "-50%",
      opacity: 0,
      duration: 1.25,
      ease: defaultEase,
    });

    gsap.to(".menu-logo img", {
      y: 0,
      duration: 1,
      delay: 0.75,
      ease: "power3.out",
    });

    gsap.to(".menu-link p", {
      y: 0,
      duration: 1,
      stagger: 0.075,
      delay: 1,
      ease: "power3.out",
    });

    gsap.to(".menu-sub-item p", {
      y: 0,
      duration: 0.75,
      stagger: 0.05,
      delay: 1,
      ease: "power3.out",
    });

    gsap.to(["#img-2, #img-3, #img-4"], {
      top: "50%",
      duration: 1.25,
      ease: defaultEase,
      stagger: 0.1,
      delay: 0.25,
      onComplete: () => {
        gsap.set(".hero", { top: "50%" });
        isOpen = !isOpen;
      },
    });
  };

  const closeMenu = () => {
    gsap.to(".menu", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      pointerEvents: "none",
      duration: 1.25,
      ease: defaultEase,
    });

    gsap.to(".menu-items", {
      top: "-300px",
      opacity: 0,
      duration: 1.25,
      ease: defaultEase,
    });

    gsap.to(".hero", {
      top: "0%",
      opacity: 1,
      duration: 1.25,
      ease: defaultEase,
      onComplete: () => {
        gsap.set(".menu", {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
        gsap.set(".menu-logo img", { y: 50 });
        gsap.set(".menu-link p", { y: 100 });
        gsap.set(".menu-sub-item p", { y: 12 });
        gsap.set(".menu-items", { opacity: 1, top: "0px" });
        gsap.set(["#img-2, #img-3, #img-4"], { top: "150%" });
        isOpen = !isOpen;
      },
    });
  };

  menuOpen.addEventListener("click", () => { if (!isOpen) openMenu(); });
  menuClose.addEventListener("click", () => { if (isOpen) closeMenu(); });
});

// ============================
// MAGNETIC MENU NAVS
// ============================
const navs = document.querySelectorAll(".menu-nav");
const padding = 100;

navs.forEach(nav => {
  let hover = false;
  let x = 0, y = 0;
  let tx = 0, ty = 0;
  let base = { x: 0, y: 0 };
  let tween = null;

  const strength = 0.35;
  const friction = 0.12;

  nav.addEventListener("mouseenter", () => {
    hover = true;
    nav.style.setProperty("--scale", 1.06);
    if (tween) tween.kill();
  });

  nav.addEventListener("mouseleave", () => {
    hover = false;
    tx = ty = 0;
    nav.style.setProperty("--scale", 1);
    nav.style.setProperty("--rot", "0deg");
    moveRandom();
  });

  window.addEventListener("mousemove", e => {
    if (!hover) return;
    const r = nav.getBoundingClientRect();
    tx = (e.clientX - (r.left + r.width / 2)) * strength;
    ty = (e.clientY - (r.top + r.height / 2)) * strength;
  });

  function raf() {
    x += ((base.x + tx) - x) * friction;
    y += ((base.y + ty) - y) * friction;
    nav.style.setProperty("--mx", `${x}px`);
    nav.style.setProperty("--my", `${y}px`);
    nav.style.setProperty("--rot", `${x * 0.05}deg`);
    requestAnimationFrame(raf);
  }
  raf();

  function moveRandom() {
    if (hover) return;
    const newX = Math.random() * (window.innerWidth - padding * 2) + padding - window.innerWidth / 2 + nav.offsetWidth / 2;
    const newY = Math.random() * (window.innerHeight - padding * 2) + padding - window.innerHeight / 2 + nav.offsetHeight / 2;
    tween = gsap.to(base, {
      x: newX, y: newY,
      duration: Math.random() * 2 + 1.5,
      ease: "power2.inOut",
      onComplete: moveRandom
    });
  }
  moveRandom();
});

// ============================
// SWITCHING BG (MENU HOVER)
// ============================
const menus = document.querySelectorAll('.menu-nav');
menus.forEach(menu => {
  const bg = menu.querySelector('.menu-hov-bg');
  const open = menu.querySelector('.menu-open');
  const close = menu.querySelector('.menu-close');
  const eyeL = menu.querySelector('.menu-eye-l');
  const eyeR = menu.querySelector('.menu-eye-r');
  const mouth = menu.querySelector('.menu-mouth');

  gsap.set([eyeL, eyeR, mouth], { autoAlpha: 1, scale: 1 });
  gsap.set([bg, open, close].filter(Boolean), { autoAlpha: 0, y: 8, scale: 0.95 });

  menu.addEventListener('mouseenter', () => {
    gsap.timeline({ defaults: { ease: 'power3.out' }})
      .to([eyeL, eyeR, mouth], { autoAlpha: 0, scale: 0.6, duration: 0.25 })
      .to([bg, open, close].filter(Boolean), { autoAlpha: 1, y: 0, scale: 1, duration: 0.35 }, '-=0.1');
  });

  menu.addEventListener('mouseleave', () => {
    gsap.timeline({ defaults: { ease: 'power3.out' }})
      .to([bg, open, close].filter(Boolean), { autoAlpha: 0, y: 8, scale: 0.95, duration: 0.25 })
      .to([eyeL, eyeR, mouth], { autoAlpha: 1, scale: 1, duration: 0.35 }, '-=0.1');
  });
});

// ============================
// CHAOTIC LIGHTING SYSTEM
// ============================
const circle = document.querySelector(".circle");
const surface = document.querySelector(".circlefg");
const cirmen = document.querySelectorAll(".menu-nav");

let lx = 30, ly = 30, tlx = 30, tly = 30;

function updateLighting() {
  const cr = circle.getBoundingClientRect();
  const cx = cr.left + cr.width / 2;
  const cy = cr.top + cr.height / 2;
  let fx = 0, fy = 0;

  cirmen.forEach(menu => {
    const r = menu.getBoundingClientRect();
    const dx = (r.left + r.width / 2) - cx;
    const dy = (r.top + r.height / 2) - cy;
    const dist = Math.max(120, Math.hypot(dx, dy));
    fx += dx * (1 / dist);
    fy += dy * (1 / dist);
  });

  tlx = Math.max(-90, Math.min(90, fx * 140)) + (Math.random() - 0.5) * 6;
  tly = Math.max(-90, Math.min(90, fy * 140)) + (Math.random() - 0.5) * 6;
}

function lightingRAF() {
  lx += (tlx - lx) * 0.12;
  ly += (tly - ly) * 0.12;
  surface.style.setProperty("--lx", `${lx}px`);
  surface.style.setProperty("--ly", `${ly}px`);
  requestAnimationFrame(lightingRAF);
}
lightingRAF();
setInterval(updateLighting, 40);

// ============================
// CIRCLE MOTION SYSTEM (MOUSE ONLY WHEN HOVERED)
// ============================
const circleWrap = document.querySelector(".circle");
let cx = 0, cy = 0;
let tcx = 0, tcy = 0;
let driftX = 0, driftY = 0;
let mX = 0, mY = 0;
let isMouseActive = false;

const followStrength = 0.08;
const chaosStrength = 0.4;
const maxOffset = 150; // Increased range for cursor magnet
const magnetRadius = 350; // Distance to switch from menu to mouse
const magnetPull = 0.45; 

window.addEventListener("mousemove", (e) => {
  const cr = circleWrap.getBoundingClientRect();
  const dx = e.clientX - (cr.left + cr.width / 2);
  const dy = e.clientY - (cr.top + cr.height / 2);
  const dist = Math.hypot(dx, dy);

  if (dist < magnetRadius) {
    isMouseActive = true;
    mX = dx * magnetPull;
    mY = dy * magnetPull;
  } else {
    isMouseActive = false;
    mX = 0; mY = 0;
  }
});

function updateCircleMotion() {
  const cr = circleWrap.getBoundingClientRect();
  const ccx = cr.left + cr.width / 2;
  const ccy = cr.top + cr.height / 2;
  
  let targetX = 0;
  let targetY = 0;

  if (isMouseActive) {
    // ONLY cursor magnet
    targetX = mX;
    targetY = mY;
  } else {
    // ONLY menu nav chasing
    let fx = 0, fy = 0;
    cirmen.forEach(menu => {
      const r = menu.getBoundingClientRect();
      const dx = (r.left + r.width / 2) - ccx;
      const dy = (r.top + r.height / 2) - ccy;
      const dist = Math.max(200, Math.hypot(dx, dy));
      fx += dx * (1 / dist);
      fy += dy * (1 / dist);
    });
    targetX = fx * 220;
    targetY = fy * 220;
  }

  tcx = Math.max(-maxOffset, Math.min(maxOffset, targetX));
  tcy = Math.max(-maxOffset, Math.min(maxOffset, targetY));

  driftX += (Math.random() - 0.5) * chaosStrength;
  driftY += (Math.random() - 0.5) * chaosStrength;
  driftX *= 0.92; driftY *= 0.92;
}

function circleRAF() {
  cx += (tcx + driftX - cx) * followStrength;
  cy += (tcy + driftY - cy) * followStrength;
  circleWrap.style.transform = `translate(-50%, -50%) translate(${cx}px, ${cy}px)`;
  requestAnimationFrame(circleRAF);
}
circleRAF();
setInterval(updateCircleMotion, 40);

// ============================
// EYE TRACKING
// ============================
const pupils = document.querySelectorAll(".eye .pupil");
const menuOpenBtn = document.querySelector(".menu-open");
let ex = 0, ey = 0, tex = 0, tey = 0;
let eyesLocked = false;

function updateEyeTarget() {
  if (!menuOpenBtn || eyesLocked) return;
  const br = menuOpenBtn.getBoundingClientRect();
  const cr = circleWrap.getBoundingClientRect();
  const dx = (br.left + br.width / 2) - (cr.left + cr.width / 2);
  const dy = (br.top + br.height / 2) - (cr.top + cr.height / 2);
  const dist = Math.max(100, Math.hypot(dx, dy));
  tex = Math.max(-16, Math.min(16, dx * (1 / dist) * 140));
  tey = Math.max(-16, Math.min(16, dy * (1 / dist) * 140));
}

function eyeRAF() {
  ex += (tex - ex) * 0.18;
  ey += (tey - ey) * 0.18;
  pupils.forEach(pupil => {
    pupil.style.transform = `translate(-50%, -50%) translate(${ex}px, ${ey}px)`;
    pupil.style.backgroundPosition = `${50 + ex * 0.7}% ${50 + ey * 0.7}%`;
  });
  requestAnimationFrame(eyeRAF);
}
window.lockEyes = () => { eyesLocked = true; tex = 0; tey = 0; };
window.unlockEyes = () => { eyesLocked = false; };
eyeRAF();
setInterval(updateEyeTarget, 40);
