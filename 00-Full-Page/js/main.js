gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
  markers: true,
});

function initNavigation() {
  const mainNavLinks = gsap.utils.toArray(".main-nav a");
  const mainNavLinksRev = gsap.utils.toArray(".main-nav a").reverse();

  mainNavLinks.forEach((link) => {
    link.addEventListener("mouseleave", (e) => {
      link.classList.add("animate-out");
      setTimeout(() => {
        link.classList.remove("animate-out");
      }, 300);
    });
  });

  function navAnimation(direction) {
    const isScrollDown = direction === 1;

    const links = direction === 1 ? mainNavLinks : mainNavLinksRev;

    return gsap.to(links, {
      duration: 0.3,
      stagger: 0.1,
      autoAlpha: () => (isScrollDown ? 0 : 1),
      y: () => (isScrollDown ? 20 : 0),
      ease: "Power4.out",
    });
  }

  ScrollTrigger.create({
    trigger: "body",
    start: 100,
    end: "bottom bottom-=10",
    toggleClass: {
      targets: "body",
      className: "has-scrolled",
    },
    onEnter: ({ direction }) => navAnimation(direction),
    onLeaveBack: ({ direction }) => navAnimation(direction),
  });
}

function initHeaderTilt() {
  document.querySelector("header").addEventListener("mousemove", moveImages);
}

function moveImages(e) {
  const { offsetX, offsetY, target } = e;
  const { clientWidth, clientHeight } = target;

  const xPos = offsetX / clientWidth - 0.5;
  const yPos = offsetY / clientHeight - 0.5;

  const leftImages = gsap.utils.toArray(".hg__left .hg__image");
  const rightImages = gsap.utils.toArray(".hg__right .hg__image");

  const modifier = (index) => index * 1.2 + 0.5;

  leftImages.forEach((image, idx) => {
    gsap.to(image, {
      duration: 0.5,
      x: xPos * 20 * modifier(idx),
      y: yPos * 30 * modifier(idx),
      rotationX: yPos * 10,
      rotationY: xPos * 40,
      ease: "Power3.out",
    });
  });

  rightImages.forEach((image, idx) => {
    gsap.to(image, {
      duration: 0.5,
      x: xPos * 20 * modifier(idx),
      y: yPos * 30 * modifier(idx),
      rotationX: yPos * 10,
      rotationY: xPos * 40,
      ease: "Power3.out",
    });
  });

  gsap.to(".decor__circle", {
    duration: 1.7,
    x: 100 * xPos,
    y: 120 * yPos,
    ease: "Power4.out",
  });
}

const initHoverReval = () => {
  const sections = gsap.utils.toArray(".rg__column");

  sections.forEach((section) => {
    const imageBlock = section.querySelector(".rg__image");
    const image = section.querySelector(".rg__image img");
    const mask = section.querySelector(".rg__image--mask");
    const text = section.querySelector(".rg__text");

    const textCopy = section.querySelector(".rg__text--copy");
    const textMask = section.querySelector(".rg__text--mask");

    const textHeight = textCopy.clientHeight;

    gsap.set(imageBlock, {
      yPercent: -100,
    });

    gsap.set(image, {
      scale: 1.2,
    });

    gsap.set(mask, {
      yPercent: 100,
    });

    gsap.set(textMask, {
      yPercent: -100,
    });

    const tl = gsap.timeline({
      defaults: {
        duration: 0.7,
        ease: "Power4.out",
      },
    });

    section.addEventListener("mouseenter", (e) => {
      tl.to([imageBlock, mask], {
        yPercent: 0,
        duration: 0.7,
      })
        .to(
          image,
          {
            scale: 1,
            duration: 1.1,
          },
          "<"
        )
        .to(
          text,
          {
            y: -textHeight / 2,
          },
          "<"
        )
        .to(
          textMask,
          {
            yPercent: 0,
          },
          "<"
        );
    });

    section.addEventListener("mouseleave", (e) => {
      tl.to([imageBlock, textMask], {
        yPercent: -100,
      })
        .to(
          mask,
          {
            yPercent: 100,
          },
          "<"
        )
        .to(
          text,
          {
            y: 0,
          },
          "<"
        )
        .to(
          image,
          {
            scale: 1.2,
          },
          "<"
        );
    });
  });
};

function init() {
  initNavigation();
  initHeaderTilt();
  initHoverReval();
  // start here
}

window.addEventListener("load", init);
