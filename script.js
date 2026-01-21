// ========== MARQUEE ========== //
window.addEventListener('load', () => {
  const progressText = document.querySelector('.progress-text');
  const loaderData = { value: 0 };

  // Create a timeline to handle the sequence
  const tl = gsap.timeline({
    onComplete: () => {
      // 1. Hide the loader once the counter hits 100
      document.body.classList.remove('before-load');
      // 2. Start your marquee
      initMarquee();
    }
  });

  // Animate the value from 0 to 100
  tl.to(loaderData, {
    value: 100,
    duration: 3, // How long you want the loader to stay (seconds)
    ease: "power1.inOut",
    onUpdate: () => {
      progressText.textContent = Math.round(loaderData.value) + "%";
    }
  });

  // Keep your existing Marquee function
  const initMarquee = () => {
    const wrapper = document.querySelector(".marquee-content");
    if (!wrapper) return;
    const items = wrapper.innerHTML;
    wrapper.innerHTML = items + items + items; 
    const scrollWidth = wrapper.scrollWidth / 3;

    gsap.to(wrapper, {
      x: -scrollWidth,
      duration: 100,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % scrollWidth)
      }
    });
  };
});

// Clean up DOM after transition
document.querySelector('.loadinger').addEventListener('transitionend', (e) => {
  if (e.propertyName === 'opacity') {
    e.currentTarget.remove();
  }
});

// ======================== TURBULENCE ======================== //

const turbulence = document.getElementById("text-turbulence");
let svgFrame = 0;
let lastSVGTime = 0;

function animateSVGFilter(time) {
  // Throttle to ~10 frames per second for that "jittery" hand-drawn look
  if (time - lastSVGTime > 100) {
    svgFrame += 0.1; 
    
    // Oscillate frequency between 0.04 and 0.06
    const freq = 0.05 + Math.sin(svgFrame) * 0.01;
    
    if (turbulence) {
      turbulence.setAttribute("baseFrequency", freq);
    }
    
    lastSVGTime = time;
  }
  requestAnimationFrame(animateSVGFilter);
}

requestAnimationFrame(animateSVGFilter);

// ======================== SUM OTHA SH*T ======================== //
// Variables
const el = document.querySelector(".ttl");

// Variables ~ Widths
let elWidth = el.offsetWidth;
let windowWidth = window.innerWidth;

// Variables ~ Mouse
let mouseX = 0;
let prevMouseX = 0;

// Target: value we want to animate to
let skewTarget = 0;
let translateTarget = 0;

// WithEasing: value we use to animate
let skewWithEasing = 0;
let translateWithEasing = 0;

// EasingFactor: determines how quick the animation/interpolation goes
let skewEasingFactor = 0.1;
let translateEasingFactor = 0.05;

// Events
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("resize", handleWindowResize);

// Functions
function handleMouseMove(e) {
  mouseX = e.pageX;
}

function handleWindowResize(e) {
  elWidth = el.offsetWidth;
  windowWidth = window.innerWidth;
}

function lerp(start, end, factor) {
  return (1 - factor) * start + factor * end;
}

function animateMe() {
  // Get difference between current and previous mouse position
  skewTarget = mouseX - prevMouseX;
  prevMouseX = mouseX;

  // Calc how much we need to translate our el
  translateTarget = (elWidth - windowWidth) / windowWidth * mouseX * -1;

  // Ease between start and target values (skew)
  skewWithEasing = lerp(skewWithEasing, skewTarget, skewEasingFactor);

  // Limit our skew to a range of 75 degrees so it doesn't "over-skew"
  skewWithEasing = Math.min(Math.max(parseInt(skewWithEasing), -75), 75);

  // Ease between start and target values (translate)
  translateWithEasing = lerp(
  translateWithEasing,
  translateTarget,
  translateEasingFactor);


  el.style.transform = `
    translateX(${translateWithEasing}px)
    skewX(${skewWithEasing}deg)
  `;

  // RAF
  window.requestAnimationFrame(animateMe);
}

window.requestAnimationFrame(animateMe);

// FORCE VIDEO PLAY ----------
document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll("video");

  videos.forEach(vid => {
    vid.play().catch(() => {
      vid.muted = true; // force mute if needed
      vid.play().catch(() => {});
    });
  });
});
