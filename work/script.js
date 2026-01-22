// ========== LOADER ========== //
window.addEventListener('load', () => {
  const progressText = document.querySelector('.progress-text');
  const loaderData = { value: 0 };

  // Create a timeline to handle the sequence
  const tl = gsap.timeline({
    onComplete: () => {
      // 1. Hide the loader once the counter hits 100
      document.body.classList.remove('before-load');
    }
  });

  // Animate the value from 0 to 100
  tl.to(loaderData, {
    value: 100,
    duration: 5, // How long you want the loader to stay (seconds)
    ease: "power1.inOut",
    onUpdate: () => {
      progressText.textContent = Math.round(loaderData.value) + "%";
    }
  });
});

// Clean up DOM after transition
document.querySelector('.loadinger').addEventListener('transitionend', (e) => {
  if (e.propertyName === 'opacity') {
    e.currentTarget.remove();
  }
});

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


// ============================== FORCE VIDEO PLAY ============================== //
document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll("video");

  videos.forEach(vid => {
    vid.play().catch(() => {
      vid.muted = true; // force mute if needed
      vid.play().catch(() => {});
    });
  });
});

// ============================== CARDS ============================== //

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const workSection = document.querySelector(".work");
  const cardsContainer = document.querySelector(".cards");
  const moveDistance = window.innerWidth * 5;
  let currentXPosition = 0;

  const lerp = (start, end, t) => start + (end - start) * t;

  const gridCanvas = document.createElement("canvas");
  gridCanvas.id = "grid-canvas";
  workSection.appendChild(gridCanvas);
  const gridCtx = gridCanvas.getContext("2d");

  const resizeGridCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    [gridCanvas.width, gridCanvas.height] = [
      window.innerWidth * dpr,
      window.innerHeight * dpr,
    ];
    [gridCanvas.style.width, gridCanvas.style.height] = [
      `${window.innerWidth}px`,
      `${window.innerHeight}px`,
    ];
    gridCtx.scale(dpr, dpr);
  };
  resizeGridCanvas();

  const lettersScene = new THREE.Scene();
  const lettersCamera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  lettersCamera.position.z = 20;

  const lettersRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  lettersRenderer.setSize(window.innerWidth, window.innerHeight);
  lettersRenderer.setClearColor(0x000000, 0);
  lettersRenderer.setPixelRatio(window.devicePixelRatio);
  lettersRenderer.domElement.id = "letters-canvas";
  workSection.appendChild(lettersRenderer.domElement);

  const createTextAnimationPath = (yPos, amplitude, twist = 0, jitter = 0.5) => {
    const points = [];
  
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const baseY = yPos + Math.sin(t * Math.PI * (1 + twist)) * -amplitude;
      const jitterY = (Math.random() - 0.5) * jitter * 2;
  
      points.push(
        new THREE.Vector3(
          -25 + 50 * t,
          baseY + jitterY,
          (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
        )
      );
    }
  
    const curve = new THREE.CatmullRomCurve3(points);
  
    const geometry = new THREE.TubeGeometry(
      curve,
      120,     // tubular segments (smoothness)
      0.03,    // 🔥 thickness (radius)
      8,       // radial segments
      false
    );
  
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
  
    const tube = new THREE.Mesh(geometry, material);
    tube.curve = curve;
  
    return tube;
  };

  const path = [
    createTextAnimationPath(10, 2),
    createTextAnimationPath(3.5, 1),
    createTextAnimationPath(-3.5, -1),
    createTextAnimationPath(-10, -2),
  ];
  path.forEach((line) => lettersScene.add(line));

  const textContainer = document.querySelector(".text-container");
  const letterPositions = new Map();
  path.forEach((line, i) => {
    line.letterElements = Array.from({ length: 15 }, () => {
      const el = document.createElement("div");
      el.className = "letter";
      el.textContent = ["w", "o", "r", "k"][i];
      textContainer.appendChild(el);
      letterPositions.set(el, {
        current: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
      });
      return el;
    });
  });

  const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];
  const updateTargetPositions = (scrollProgress = 0) => {
    path.forEach((line, lineIndex) => {
      line.letterElements.forEach((element, i) => {
        const point = line.curve.getPoint(
          (i / 14 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1
        );
        const vector = point.clone().project(lettersCamera);
        const positions = letterPositions.get(element);
        positions.target = {
          x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
          y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
        };
      });
    });
  };

  const updateLetterPositions = () => {
    letterPositions.forEach((positions, element) => {
      const distX = positions.target.x - positions.current.x;
      if (Math.abs(distX) > window.innerWidth * 0.7) {
        [positions.current.x, positions.current.y] = [
          positions.target.x,
          positions.target.y,
        ];
      } else {
        positions.current.x = lerp(
          positions.current.x,
          positions.target.x,
          0.07
        );
        positions.current.y = lerp(
          positions.current.y,
          positions.target.y,
          0.07
        );
      }
      element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
    });
  };

  const updateCardsPosition = () => {
    const targetX = -moveDistance * (ScrollTrigger.getAll()[0]?.progress || 0);
    currentXPosition = lerp(currentXPosition, targetX, 0.07);

    gsap.set(cardsContainer, {
      x: currentXPosition,
      y: () => Math.sin((ScrollTrigger.getAll()[0]?.progress || 0) * 10) * 15,
      rotation: () => Math.sin((ScrollTrigger.getAll()[0]?.progress || 0) * 5) * 5,
    });
  };
  
  // GRID (AUTO ANIMATION TRIGGER)
  const animateGridChaotic = (time) => {
    drawGridNoiseChaotic(time);
    requestAnimationFrame(animateGridChaotic);
  };
  
  requestAnimationFrame(animateGridChaotic);

  // ANIMATIONS LOOP
  const animate = () => {
    updateLetterPositions();
    updateCardsPosition();
    lettersRenderer.render(lettersScene, lettersCamera);
    requestAnimationFrame(animate);
  };

  ScrollTrigger.create({
    trigger: ".work",
    start: "top top",
    end: "+=700%",
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      updateTargetPositions(self.progress);
      //drawGrid(self.progress);
    },
  });

  //drawGrid(0);
  animate();
  updateTargetPositions(0);

  window.addEventListener("resize", () => {
    resizeGridCanvas();
    //drawGrid(ScrollTrigger.getAll()[0]?.progress || 0);
    lettersCamera.aspect = window.innerWidth / window.innerHeight;
    lettersCamera.updateProjectionMatrix();
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0);
  });
});

gsap.registerPlugin(MotionPathPlugin);


