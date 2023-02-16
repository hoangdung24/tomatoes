gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
  markers: true,
});

const mq = window.matchMedia("(min-width: 768px)");

//* NAV HEADER

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
    markers: false,
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

//* PART2

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

    const tl = gsap.timeline({
      defaults: {
        duration: 0.7,
        ease: "Power4.out",
      },
    });

    function mouseEnterCb() {
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
    }

    function mouseLeaveCb() {
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
    }

    if (mq.matches) {
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

      section.addEventListener("mouseenter", mouseEnterCb);

      section.addEventListener("mouseleave", mouseLeaveCb);
    }

    mq.addEventListener("change", ({ matches }) => {
      if (matches) {
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

        section.addEventListener("mouseenter", mouseEnterCb);
        section.addEventListener("mouseleave", mouseLeaveCb);
      } else {
        [imageBlock, image, mask, text, textCopy, textMask].forEach((el) => {
          gsap.set(el, { clearProps: "all" });
          tl.killTweensOf(el);
        });

        section.removeEventListener("mouseenter", mouseEnterCb);
        section.removeEventListener("mouseleave", mouseLeaveCb);
      }
    });
  });
};

//* PART3

const allLinks = gsap.utils.toArray(".portfolio__categories a");
const pageBackground = document.querySelector(".fill-background");
const largeImage = document.querySelector(".portfolio__image--l");
const smallImage = document.querySelector(".portfolio__image--s");
const lInside = document.querySelector(".portfolio__image--l .image_inside");
const sInside = document.querySelector(".portfolio__image--s .image_inside");

const initPortfolioHover = () => {
  allLinks.forEach((link) => {
    link.addEventListener("mouseenter", (e) => {
      const { color, imagelarge, imagesmall } = e.target.dataset;

      const tl = gsap.timeline();

      const siblingLinks = allLinks.filter((link) => link !== e.target);

      tl.set(lInside, { backgroundImage: `url(${imagelarge})` })
        .set(sInside, {
          backgroundImage: `url(${imagesmall})`,
        })
        .to([largeImage, smallImage], {
          duration: 1,
          autoAlpha: 1,
        })
        .to(
          siblingLinks,
          {
            duration: 1,
            autoAlpha: 0.2,
          },
          "<"
        )
        .to(
          e.target,
          {
            color: "#FFF",
            duration: 1,
          },
          "<"
        )
        .to(
          pageBackground,
          {
            backgroundColor: color,
            duration: 0.5,
          },
          "<"
        );
    });
    link.addEventListener("mouseleave", (e) => {
      const tl = gsap.timeline();

      tl.to([largeImage, smallImage], {
        duration: 0.7,
        autoAlpha: 0,
      })
        .to(
          allLinks,
          {
            autoAlpha: 1,
            duration: 0.7,
            color: "#000",
          },
          "<"
        )
        .to(
          pageBackground,
          {
            backgroundColor: "unset",
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
  initPortfolioHover();
  // start here
}

window.addEventListener("load", init);
