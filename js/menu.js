document.addEventListener("DOMContentLoaded", function () {
  gsap.set(["#gif-2, #gif-3, #gif-4"], { top: "150%" });

  gsap.to(".menu-gif img", {
      top: "50%",
      duration: 1.25,
      ease: "power4.inOut",
      stagger: 0.1,
      delay: 0.25,
  });
});