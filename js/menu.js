document.addEventListener("DOMContentLoaded", function () {
  gsap.set(["#img-2, #img-3, #img-4"], { top: "150%" });

  gsap.to(".menu-img img", {
    top: "50%",
    duration: 1.25,
    ease: "power4.inOut",
    stagger: 0.1,
    delay: 0.25,
  });
});
