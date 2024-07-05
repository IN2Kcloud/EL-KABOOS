window.addEventListener('load', () => {
  document.body.classList.remove('before-load');
});
document.querySelector('.loading').addEventListener('transitionend', (e) => {
  document.body.removeChild(e.currentTarget);
});

//CARDS
// Function to update mouse coordinates
function updateMouseCoordinates(e, card) {
  const rect = card.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
}

// Function to update touch coordinates
function updateTouchCoordinates(e, card) {
  const touch = e.touches[0],
        rect = card.getBoundingClientRect(),
        x = touch.clientX - rect.left,
        y = touch.clientY - rect.top;

  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
}

// Handle mouse move and touch move events
document.getElementById("cards").addEventListener("mousemove", e => {
  for (const card of document.getElementsByClassName("card")) {
    updateMouseCoordinates(e, card);
  }
});

document.getElementById("cards").addEventListener("touchmove", e => {
  for (const card of document.getElementsByClassName("card")) {
    updateTouchCoordinates(e, card);
  }
});
/*
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("clicked");
    });
  });
*/
  
//SERVICES

var navLink = gsap.utils.toArray(".nav-link"),
    imgWrap = document.querySelector('.img-wrapper'),
    imgItem = document.querySelector('.img-placeholder img');

function moveImg(e){
    var mouseX = e.clientX,
        mouseY = e.clientY;
    var imgWrapWidth = imgWrap.offsetWidth,
        imgWrapHeight = imgWrap.offsetHeight;
        
    var tl = gsap.timeline();
    tl.to(imgWrap, {
        duration: 1,
        x: mouseX - imgWrapWidth / 2,
        y: mouseY - imgWrapHeight / 2,
        ease: Expo.ease
    });
}

function linkHover(e){
    if (e.type === "mouseenter"){
        var imgSrc = e.target.dataset.src;
        var tl = gsap.timeline();

        tl.set(imgItem, {
            attr: {src : imgSrc}
        }).to(imgWrap, {
            autoAlpha: 1,
            scale: 1
        });
    } else if (e.type === "mouseleave"){
        var tl = gsap.timeline();
        tl.to(imgWrap, {
            autoAlpha: 0,
            scale: 0.9
        });
    }
}

function initAnimation(){
    navLink.forEach(link => {
        link.addEventListener('mouseenter', linkHover);
        link.addEventListener('mouseleave', linkHover);
        link.addEventListener('mousemove', moveImg);
    });
}

function init(){
    initAnimation();
}

window.addEventListener("load", function(){
    init();
});

/*
// Check if the device is a desktop
function isDesktop() {
  // Regular expression to match common desktop user agents
  const desktopRegex = /Windows NT|Macintosh/;
  return desktopRegex.test(navigator.userAgent);
}

// Apply image effect only on desktop devices
if (isDesktop()) {

Shery.imageEffect(".card-image img",{
  style: 3,
  config: {"invert":{"value":false},"isTexture":{"value":false},"autorotate":{"value":true},"mouseMove":{"value":true},"color":{"value":16777215},"mouseMoveEWX":{"value":0,"range":[0,1]},"mouseMoveEHY":{"value":0.07,"range":[0,1]},"smoothness":{"value":2.06,"range":[0,3]},"circular":{"value":0,"range":[-0.1,0.1]},"styling":{"value":2.22,"range":[-3,3]},"clustering":{"value":5,"range":[0,5]},"gapping":{"value":0.9,"range":[0,1]},"rotation":{"value":60,"range":[0,90]},"density":{"value":0.07,"range":[0,1]},"scale":{"value":65.65,"range":[0,100]},"pattern":{"value":10.42,"range":[0,15]},"zindex":{"value":-9996999,"range":[-9999999,9999999]},"aspect":{"value":2},"ignoreShapeAspect":{"value":true},"shapePosition":{"value":{"x":0,"y":0}},"shapeScale":{"value":{"x":0.5,"y":0.5}},"shapeEdgeSoftness":{"value":0.5,"range":[0,0.5]},"shapeRadius":{"value":0,"range":[0,2]},"currentScroll":{"value":0},"scrollLerp":{"value":0.07},"gooey":{"value":false},"infiniteGooey":{"value":false},"growSize":{"value":4,"range":[1,15]},"durationOut":{"value":1,"range":[0.1,5]},"durationIn":{"value":1.5,"range":[0.1,5]},"displaceAmount":{"value":0.5},"masker":{"value":true},"maskVal":{"value":1.12,"range":[1,5]},"scrollType":{"value":0},"geoVertex":{"range":[1,64],"value":32},"noEffectGooey":{"value":true},"onMouse":{"value":0},"noise_speed":{"value":0.2,"range":[0,10]},"metaball":{"value":0.2,"range":[0,2]},"discard_threshold":{"value":0.5,"range":[0,1]},"antialias_threshold":{"value":0.002,"range":[0,0.1]},"noise_height":{"value":0.5,"range":[0,2]},"noise_scale":{"value":10,"range":[0,100]},"uColor":{"value":false},"uSpeed":{"value":0.6,"range":[0.1,1],"rangep":[1,10]},"uAmplitude":{"value":1.5,"range":[0,5]},"uFrequency":{"value":3.5,"range":[0,10]}},
  debug: true,
})

Shery.imageEffect('.Gooey', {
  style: 6,
  gooey: true,
  setUniforms: (uniforms) => {
    uniforms.infiniteGooey.value = true
    uniforms.noEffectGooey.value = false
  }
})
}
*/