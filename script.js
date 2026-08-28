/* =========================================================
   SERENE MASSAGE — MAIN JAVASCRIPT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  window.setTimeout(() => loader?.classList.add("done"), 550);

  const header = document.getElementById("header");
  const backTop = document.getElementById("backTop");

  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 40);
    backTop?.classList.toggle("show", window.scrollY > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backTop?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");
  const mobileLinks = mobileMenu?.querySelectorAll("a");

  const setMenu = (open) => {
    mobileMenu?.classList.toggle("open", open);
    mobileMenu?.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
  };
  menuBtn?.addEventListener("click", () => setMenu(true));
  closeMenu?.addEventListener("click", () => setMenu(false));
  mobileLinks?.forEach(link => link.addEventListener("click", () => setMenu(false)));

  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Number counters
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const duration = 1200;
      const start = performance.now();

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, {threshold:.6});
  counters.forEach(c => counterObserver.observe(c));

  // Testimonials slider
  const track = document.getElementById("testimonialTrack");
  const testimonials = [...document.querySelectorAll(".testimonial")];
  const dots = document.getElementById("dots");
  let index = 0;

  const renderDots = () => {
    if (!dots) return;
    dots.innerHTML = testimonials.map((_, i) => `<button class="dot ${i===0?'active':''}" aria-label="Go to testimonial ${i+1}"></button>`).join("");
    dots.querySelectorAll(".dot").forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));
  };

  const visibleSlides = () => window.innerWidth <= 680 ? 1 : 2;
  const maxIndex = () => Math.max(0, testimonials.length - visibleSlides());

  const goTo = (newIndex) => {
    index = Math.max(0, Math.min(newIndex, maxIndex()));
    if (track) track.style.transform = `translateX(-${index * (100 / visibleSlides())}%)`;
    dots?.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === index));
  };

  document.getElementById("prevTest")?.addEventListener("click", () => goTo(index - 1));
  document.getElementById("nextTest")?.addEventListener("click", () => goTo(index + 1));
  renderDots();
  window.addEventListener("resize", () => goTo(index));

  // Touch swipe
  let touchStart = 0;
  track?.addEventListener("touchstart", e => touchStart = e.touches[0].clientX, {passive:true});
  track?.addEventListener("touchend", e => {
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 45) goTo(index + (diff < 0 ? 1 : -1));
  }, {passive:true});

  // Contact form demo behavior
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    note.textContent = "Thank you — your request has been received. We’ll be in touch shortly.";
    form.reset();
  });

  // Subtle parallax on large screens
  const heroImage = document.querySelector(".hero-image");
  const ctaBg = document.querySelector(".cta-bg");
  window.addEventListener("scroll", () => {
    if (window.innerWidth < 900) return;
    const y = window.scrollY;
    if (heroImage && y < window.innerHeight) heroImage.style.transform = `scale(1.04) translateY(${y * .045}px)`;
    if (ctaBg) {
      const rect = ctaBg.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        ctaBg.style.transform = `scale(1.04) translateY(${(window.innerHeight/2 - (rect.top + rect.height/2))*-.06}px)`;
      }
    }
  }, {passive:true});
});
