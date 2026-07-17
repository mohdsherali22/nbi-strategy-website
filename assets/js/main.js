/* NBI Strategy — site interactions */
(function () {
  "use strict";

  document.body.classList.add("js");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* Sticky header shadow */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile navigation */
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("nav-open"))
    );
  }

  /* Reveal on scroll */
  const revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealables.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("in"));
  }

  /* Animated counters — <strong data-count="500" data-suffix="+"> */
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCounter(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => {
      el.textContent = Number(el.dataset.count).toLocaleString() + (el.dataset.suffix || "");
    });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll progress bar */
  if (!reducedMotion) {
    const prog = document.createElement("div");
    prog.className = "scroll-progress";
    document.body.appendChild(prog);
    const updProg = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", updProg, { passive: true });
    updProg();
  }

  /* Word-by-word headline entrance */
  const splitHeadlines = () => {
    document.querySelectorAll(".hero h1, .page-hero h1").forEach((h) => {
      const frag = document.createDocumentFragment();
      let i = 0;
      const process = (node, cls) => {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) {
              frag.appendChild(document.createTextNode(tok));
              return;
            }
            const s = document.createElement("span");
            s.className = "w" + (cls ? " " + cls : "");
            s.style.setProperty("--wd", (i++ * 0.07).toFixed(2) + "s");
            s.textContent = tok;
            frag.appendChild(s);
          });
        } else if (node.nodeName === "BR") {
          frag.appendChild(document.createElement("br"));
        } else if (node.nodeType === 1) {
          Array.from(node.childNodes).forEach((ch) => process(ch, node.className));
        }
      };
      Array.from(h.childNodes).forEach((n) => process(n, ""));
      h.innerHTML = "";
      h.appendChild(frag);
    });
  };

  /* Preloader orchestration */
  const preloader = document.getElementById("preloader");
  if (preloader && !reducedMotion) {
    document.body.classList.add("has-preloader");
    document.body.style.overflow = "hidden";
    const countEl = document.getElementById("preCount");
    const t0 = performance.now();
    const DUR = 1700;
    const tickCount = (now) => {
      const p = Math.min((now - t0) / DUR, 1);
      if (countEl) countEl.textContent = Math.round(p * 100);
      if (p < 1) { requestAnimationFrame(tickCount); return; }
      preloader.classList.add("done");
      document.body.classList.add("ready");
      document.body.style.overflow = "";
      splitHeadlines();
      setTimeout(() => preloader.remove(), 1000);
    };
    requestAnimationFrame(tickCount);
  } else {
    if (preloader) preloader.remove();
    document.body.classList.add("ready");
    if (!reducedMotion) splitHeadlines();
  }

  /* Rotating hero words */
  const rotator = document.getElementById("rotator");
  if (rotator && !reducedMotion) {
    const words = ["AI workflow automations", "chatbots & knowledge assistants", "digital employees", "voice AI agents", "AI apps & SaaS MVPs"];
    let wi = 0;
    setInterval(() => {
      rotator.classList.add("swap");
      setTimeout(() => {
        wi = (wi + 1) % words.length;
        rotator.textContent = words[wi];
        rotator.classList.remove("swap");
      }, 360);
    }, 2600);
  }

  /* Custom cursor */
  if (finePointer && !reducedMotion) {
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.append(dot, ring);
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    }, { passive: true });
    const lerp = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(lerp);
    };
    lerp();
    document.addEventListener("mouseover", (e) => {
      ring.classList.toggle("hot", !!e.target.closest("a, button, .svc-card, .quote-card"));
    });
  }

  /* Cursor spotlight on cards */
  const spotTargets = document.querySelectorAll(
    ".service-card, .quote-card, .value-card, .team-card, .step, .industry"
  );
  if (finePointer) {
    spotTargets.forEach((card) => {
      card.classList.add("spot");
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* 3D tilt on hero surfaces */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".hero-panel, .visual-stack").forEach((el) => {
      el.classList.add("tilt");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        el.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* Skyline parallax */
  const skyBack = document.querySelector(".hero-skyline .skyline-back");
  if (skyBack && !reducedMotion) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < 900) {
        skyBack.style.transform = "translateX(-50%) translateY(" + (y * 0.14).toFixed(1) + "px)";
      }
    }, { passive: true });
  }

  /* Magnetic buttons */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.15;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
        btn.style.transform =
          "translate(" + Math.max(-6, Math.min(6, dx)).toFixed(1) + "px, " +
          Math.max(-4, Math.min(4, dy)).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* Constellation network canvas (hero) */
  const constel = document.getElementById("constellation");
  if (constel && constel.getContext) {
    const cctx = constel.getContext("2d");
    let W = 0, H = 0, cnodes = [];
    const cmouse = { x: -9999, y: -9999 };
    const dpr = window.devicePixelRatio || 1;
    const cResize = () => {
      W = constel.width = constel.offsetWidth * dpr;
      H = constel.height = constel.offsetHeight * dpr;
      const count = Math.min(80, Math.floor((constel.offsetWidth * constel.offsetHeight) / 18000));
      cnodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28 * dpr,
        vy: (Math.random() - 0.5) * 0.28 * dpr,
        r: (Math.random() * 1.4 + 0.7) * dpr,
        gold: Math.random() < 0.3
      }));
    };
    cResize();
    window.addEventListener("resize", cResize);
    const heroEl = constel.parentElement;
    heroEl.addEventListener("pointermove", (e) => {
      const rect = constel.getBoundingClientRect();
      cmouse.x = (e.clientX - rect.left) * dpr;
      cmouse.y = (e.clientY - rect.top) * dpr;
    });
    heroEl.addEventListener("pointerleave", () => { cmouse.x = -9999; cmouse.y = -9999; });
    const LINK = 150 * dpr;
    const MLINK = 220 * dpr;
    const cFrame = () => {
      cctx.clearRect(0, 0, W, H);
      for (const n of cnodes) {
        if (!reducedMotion) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
        }
        cctx.beginPath();
        cctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        cctx.fillStyle = n.gold ? "rgba(198,164,94,.9)" : "rgba(138,151,176,.55)";
        cctx.fill();
      }
      for (let i = 0; i < cnodes.length; i++) {
        const a = cnodes[i];
        for (let j = i + 1; j < cnodes.length; j++) {
          const b = cnodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.16;
            cctx.strokeStyle = (a.gold || b.gold)
              ? "rgba(198,164,94," + (alpha * 1.6).toFixed(3) + ")"
              : "rgba(138,151,176," + alpha.toFixed(3) + ")";
            cctx.lineWidth = dpr * 0.6;
            cctx.beginPath();
            cctx.moveTo(a.x, a.y);
            cctx.lineTo(b.x, b.y);
            cctx.stroke();
          }
        }
        const md = Math.hypot(a.x - cmouse.x, a.y - cmouse.y);
        if (md < MLINK) {
          const alpha = (1 - md / MLINK) * 0.35;
          cctx.strokeStyle = "rgba(198,164,94," + alpha.toFixed(3) + ")";
          cctx.lineWidth = dpr * 0.7;
          cctx.beginPath();
          cctx.moveTo(a.x, a.y);
          cctx.lineTo(cmouse.x, cmouse.y);
          cctx.stroke();
        }
      }
      requestAnimationFrame(cFrame);
    };
    cFrame();
  }

  /* Duplicate industries marquee for seamless loop */
  const indMq = document.getElementById("ind-marquee");
  if (indMq) indMq.innerHTML += indMq.innerHTML;

  /* Contact / consultation forms — client-side demo handler */
  const LEAD_ENDPOINT = "https://n8n-owwz.srv1402818.hstgr.cloud/webhook/nix-lead";
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.form = form.querySelector("textarea") ? "contact" : "newsletter";
      data.source = "website";
      data.page = location.pathname.split("/").pop() || "index.html";
      try {
        fetch(LEAD_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          keepalive: true,
        }).catch(() => {});
      } catch (e) { /* never block the visitor */ }
      const success = form.querySelector(".form-success");
      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      form.reset();
    });
  });

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
