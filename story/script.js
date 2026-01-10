window.addEventListener('load', () => {
  document.body.classList.remove('before-load');
});
document.querySelector('.loadinger').addEventListener('transitionend', (e) => {
  document.body.removeChild(e.currentTarget);
});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // smooth scroll
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const cards = gsap.utils.toArray(".card");
  const totalScrollHeight = window.innerHeight * 3;
  const positions = [14, 38, 62, 86];
  const rotations = [-15, -7.5, 7.5, 15];

  // pin the cards section
  ScrollTrigger.create({
    trigger: ".cards",
    start: "top top",
    end: () => `+=${totalScrollHeight}`,
    pin: true,
    pinSpacing: true,
  });

  // spread cards
  cards.forEach((card, index) => {
    gsap.to(card, {
      left: `${positions[index]}%`,
      rotation: `${rotations[index]}`,
      ease: "none",
      scrollTrigger: {
        trigger: ".cards",
        start: "top top",
        end: () => `+=${window.innerHeight}`,
        scrub: 0.5,
        id: `spread-${index}`,
      },
    });
  });

  // rotate and flip cards with staggered effect
  cards.forEach((card, index) => {
    const frontEl = card.querySelector(".flip-card-front");
    const backEl = card.querySelector(".flip-card-back");

    const staggerOffset = index * 0.05;
    const startOffset = 1 / 3 + staggerOffset;
    const endOffset = 2 / 3 + staggerOffset;

    ScrollTrigger.create({
      trigger: ".cards",
      start: "top top",
      end: () => `+=${totalScrollHeight}`,
      scrub: 1,
      id: `rotate-flip-${index}`,
      onUpdate: (self) => {
        const progress = self.progress;
        if (progress >= startOffset && progress <= endOffset) {
          const animationProgress = (progress - startOffset) / (1 / 3);
          const frontRotation = -180 * animationProgress;
          const backRotation = 180 - 180 * animationProgress;
          const cardRotation = rotations[index] * (1 - animationProgress);

          frontEl.style.transform = `rotateY(${frontRotation}deg)`;
          backEl.style.transform = `rotateY(${backRotation}deg)`;
          card.style.transform = `translate(-50%, -50%) rotate(${cardRotation}deg)`;
        }
      },
    });
  });

  // --- Inside your DOMContentLoaded or below Lenis init ---

  const thumb = document.querySelector('.scroll-thumb');
  const track = document.querySelector('.scroll-track');
  
  // 1. Move thumb when page scrolls
  lenis.on('scroll', ({ progress }) => {
    // progress is a value between 0 and 1
    const trackHeight = track.offsetHeight - thumb.offsetHeight;
    const moveY = progress * trackHeight;
    
    // Use GSAP for maximum smoothness (since you already have it)
    gsap.set(thumb, { y: moveY });
  });
  
  // 2. Drag logic for Touch/Mouse
  let isDragging = false;
  
  const onDrag = (e) => {
    if (!isDragging) return;
    
    const rect = track.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calculate percentage of track
    let pos = (clientY - rect.top) / rect.height;
    pos = Math.max(0, Math.min(1, pos)); // Clamp between 0 and 1
    
    // Tell Lenis to scroll to that percentage
    lenis.scrollTo(pos * (document.documentElement.scrollHeight - window.innerHeight), {
      immediate: true
    });
  };
  
  thumb.addEventListener('mousedown', () => isDragging = true);
  thumb.addEventListener('touchstart', () => isDragging = true, { passive: false });
  
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
  
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('touchend', () => isDragging = false);
  
});

// M E M O R I E S

// === Matter.js aliases ===
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

// === Titles (one per item) ===
const ITEM_TITLES = [
  "Sleepless Night",
  "Cold Window",
  "Missed Call",
  "Empty Room",
  "Distant Voices",
  "No Reply",
  "4:17 AM",
  "Streetlight Flicker",
  "Forgotten Path",
  "Heavy Air",
  "Still There",
  "Never Said",
];

// === Globals ===
let engine;
let items = [];
let lastMouseX = -1;
let lastMouseY = -1;

let container;
let canvas;

// === p5.js setup ===
function setup() {
  container = document.querySelector(".pics");
  if (!container) return;

  const rect = container.getBoundingClientRect();

  // Canvas INSIDE .pics
  canvas = createCanvas(rect.width, rect.height);
  canvas.parent(container);

  engine = Engine.create();
  engine.world.gravity.y = 0;

  addBoundaries(rect.width, rect.height);

  for (let i = 0; i < 12; i++) {
    let x = random(100, rect.width - 100);
    let y = random(100, rect.height - 100);

    items.push(
      new Item(
        x,
        y,
        `./assets/img${i + 1}.jpg`,
        ITEM_TITLES[i]
      )
    );
  }
}

// === Boundaries ===
function addBoundaries(w, h) {
  const thickness = 50;

  World.add(engine.world, [
    Bodies.rectangle(w / 2, -thickness / 2, w, thickness, { isStatic: true }),
    Bodies.rectangle(w / 2, h + thickness / 2, w, thickness, { isStatic: true }),
    Bodies.rectangle(-thickness / 2, h / 2, thickness, h, { isStatic: true }),
    Bodies.rectangle(w + thickness / 2, h / 2, thickness, h, { isStatic: true }),
  ]);
}

// === Draw loop ===
function draw() {
  background("black");
  Engine.update(engine);
  items.forEach(item => item.update());
}

// === Item class ===
class Item {
  constructor(x, y, imagePath, title) {
    const options = {
      frictionAir: 0.075,
      restitution: 0.25,
      density: 0.002,
      angle: Math.random() * Math.PI * 2,
    };

    this.body = Bodies.rectangle(x, y, 100, 200, options);
    World.add(engine.world, this.body);

    this.el = document.createElement("div");
    this.el.className = "item";
    this.el.style.position = "absolute";

    const img = document.createElement("img");
    img.src = imagePath;

    const span = document.createElement("span");
    span.textContent = title;

    this.el.appendChild(img);
    this.el.appendChild(span);
    container.appendChild(this.el);
  }

  update() {
    this.el.style.left = `${this.body.position.x - 50}px`;
    this.el.style.top = `${this.body.position.y - 100}px`;
    this.el.style.transform = `rotate(${this.body.angle}rad)`;
  }
}

// === Mouse interaction (scoped to .pics) ===
function mouseMoved() {
  if (!container) return;

  const rect = container.getBoundingClientRect();

  if (
    mouseX < 0 || mouseY < 0 ||
    mouseX > rect.width || mouseY > rect.height
  ) return;

  if (dist(mouseX, mouseY, lastMouseX, lastMouseY) > 10) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    items.forEach(item => {
      if (
        dist(mouseX, mouseY, item.body.position.x, item.body.position.y) < 150
      ) {
        Body.applyForce(
          item.body,
          item.body.position,
          {
            x: random(-3, 3),
            y: random(-3, 3),
          }
        );
      }
    });
  }
}

// === Resize ===
function windowResized() {
  if (!container) return;

  const rect = container.getBoundingClientRect();
  resizeCanvas(rect.width, rect.height);
}

// ============================== MENU ============================== //

const menuTrigger = document.getElementById('menu-trigger');
const navMenu = document.getElementById('nav-menu');
let menuIsOpen = false;

menuTrigger.addEventListener('click', () => {
  if (!menuIsOpen) {
    // OPENING
    gsap.to(navMenu, { y: "0%", duration: 0.8, ease: "expo.out" });

    gsap.fromTo(".menu-item", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)", delay: 0.3 }
    );
    
    // Switch to X element and hide text
    menuTrigger.innerHTML = '<div class="X"></div>'; 
    menuTrigger.style.backgroundColor = "#000";
    menuTrigger.style.border = "1px solid #fff";
    menuTrigger.style.borderBottom = "0px";
    
    menuIsOpen = true;
  } else {
    // CLOSING
    gsap.to(navMenu, { y: "100%", duration: 0.5, ease: "power2.in" });
    
    // Switch back to text
    menuTrigger.innerHTML = 'INDEX <div class="menu-hov-bg"></div>';
    menuTrigger.style.backgroundColor = "#fff";
    menuTrigger.style.color = "#000";
    menuTrigger.style.border = "none";
    //menuTrigger.style.textShadow = "0 0 2px #000, 0 0 5px #000, 0 0 50px #000";
    
    menuIsOpen = false;
  }
});

const btn = document.getElementById('menu-trigger');

// Create "quickTo" setters for maximum performance and smoothness
const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power3.out" });
const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power3.out" });

btn.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const { left, top, width, height } = btn.getBoundingClientRect();
  
  // Calculate relative position from center
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  
  // Define pull strength (0.3 to 0.5 is usually the sweet spot)
  const moveX = (clientX - centerX) * 0.4;
  const moveY = (clientY - centerY) * 0.4;

  // Apply smooth movement
  xTo(moveX);
  yTo(moveY);
});

btn.addEventListener('mouseleave', () => {
  // Smoothly snap back with a slight bounce
  gsap.to(btn, {
    x: 0,
    y: 0,
    duration: 0.7,
    ease: "elastic.out(1, 0.3)"
  });
});
