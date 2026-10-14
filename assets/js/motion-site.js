// Motion layer (Motion 12 vanilla + Lenis). Signature moments: zoom-through hero, horizontal reel,
// room reveal, prismatic light, division page-wipe. Everything else: quiet reveals.
(function () {
  const { animate, scroll, inView, stagger } = window.Motion;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = matchMedia("(min-width: 861px)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const ease = [0.32, 0.72, 0, 1];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ---------- Smooth scroll ----------
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // ---------- Header ----------
  const header = document.querySelector(".site-header");
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    const menuOpen = document.querySelector(".mobile-menu.is-open");
    header.classList.toggle("is-solid", y > 40 || !!menuOpen);
    header.classList.toggle("is-hidden", !menuOpen && y > 500 && y > lastY + 2);
    if (y < lastY - 2) header.classList.remove("is-hidden");
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // ---------- Page wipe ----------
  const WIPE = { group: ["#af6446", "We build."], interiors: ["#4a0a05", "We furnish."], glass: ["#0d0d0e", "We craft light."] };
  const wipe = document.querySelector(".wipe");
  const pending = sessionStorage.getItem("wipe");
  if (pending && wipe && WIPE[pending] && !reduce) {
    sessionStorage.removeItem("wipe");
    wipe.style.background = WIPE[pending][0];
    wipe.style.transformOrigin = "top";
    wipe.style.transform = "scaleY(1)";
    animate(wipe, { scaleY: [1, 0] }, { duration: 0.8, ease, delay: 0.1 });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-wipe]");
    if (!a || reduce || e.metaKey || e.ctrlKey || a.getAttribute("aria-current") === "true") return;
    e.preventDefault();
    const k = a.dataset.wipe;
    wipe.style.background = WIPE[k][0];
    wipe.style.transformOrigin = "bottom";
    wipe.querySelector("span").textContent = WIPE[k][1];
    sessionStorage.setItem("wipe", k);
    animate(wipe, { scaleY: [0, 1] }, { duration: 0.65, ease }).then(() => (location.href = a.href));
    animate(wipe.querySelector("span"), { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: 0.25, ease });
  });

  // ---------- Split-text headings ----------
  $$("[data-split]").forEach((el) => {
    const words = [];
    const walk = (node, wrapIn) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.append(" "); return; }
            const w = document.createElement("span"); w.className = "split-word";
            const i = document.createElement("span"); i.textContent = p;
            w.append(i); frag.append(w); words.push(i);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    el.classList.add("is-split");
    if (reduce) return;
    words.forEach((w) => (w.style.transform = "translateY(110%)"));
    inView(el, () => { animate(words, { y: ["110%", "0%"] }, { duration: 1.1, ease, delay: stagger(0.045, { startDelay: Number(el.dataset.delay || 0) }) }); }, { amount: 0.3 });
  });

  // ---------- Reveals ----------
  $$("[data-reveal]").forEach((el) => {
    if (reduce) { el.style.opacity = 1; return; }
    inView(el, () => { animate(el, { opacity: [0, 1], y: [48, 0], filter: ["blur(10px)", "blur(0px)"] }, { duration: 1.2, ease: [0.32, 0.72, 0, 1], delay: Number(el.dataset.delay || 0) }); }, { amount: 0.2 });
  });
  $$("[data-stagger]").forEach((group) => {
    const kids = Array.from(group.children);
    if (reduce) return;
    kids.forEach((k) => (k.style.opacity = 0));
    inView(group, () => { animate(kids, { opacity: [0, 1], y: [40, 0] }, { duration: 0.9, ease, delay: stagger(0.09) }); }, { amount: 0.15 });
  });

  // ---------- Parallax media ----------
  if (!reduce) $$("[data-parallax] img").forEach((img) => {
    scroll(animate(img, { y: ["-7%", "7%"] }, { ease: "linear" }), { target: img.parentElement, offset: ["start end", "end start"] });
  });

  // ---------- Counters ----------
  $$("[data-count]").forEach((el) => {
    const to = Number(el.dataset.count); const suffix = el.dataset.suffix || ""; const fmt = (v) => ("plain" in el.dataset ? String(v) : v.toLocaleString("en-IN"));
    if (reduce) { el.textContent = fmt(to) + suffix; return; }
    el.textContent = "0" + suffix;
    inView(el, () => { animate(0, to, { duration: 2, ease, onUpdate: (v) => (el.textContent = fmt(Math.round(v)) + suffix) }); }, { amount: 0.6 });
  });

  // ---------- Scroll-lit statement ----------
  $$("[data-statement]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    if (reduce) return;
    const spans = $$(".w", el);
    scroll((p) => { const lit = p * spans.length * 1.15; spans.forEach((s, i) => (s.style.opacity = String(lerp(0.18, 1, clamp(lit - i))))); },
      { target: el, offset: ["start 0.85", "end 0.45"] });
  });

  // ---------- Magnetic buttons ----------
  if (finePointer && !reduce) $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      animate(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35 }, { type: "spring", stiffness: 260, damping: 18 });
    });
    el.addEventListener("pointerleave", () => animate(el, { x: 0, y: 0 }, { type: "spring", stiffness: 200, damping: 14 }));
  });

  // ---------- Scroll-scrubbed video (drop encoded clips in assets/video and they take over) ----------
  const scrubVideos = [];
  $$("[data-video]").forEach(async (holder) => {
    if (reduce || holder.classList.contains("film-hero")) return;
    const src = desktop.matches ? holder.dataset.video : holder.dataset.videoMobile || holder.dataset.video;
    try { const r = await fetch(src, { method: "HEAD" }); if (!r.ok) return; } catch { return; }
    const v = document.createElement("video");
    Object.assign(v, { muted: true, playsInline: true, preload: "auto", src });
    v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    v.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover";
    const loop = holder.dataset.videoMode === "loop";
    if (loop) Object.assign(v, { autoplay: true, loop: true });
    holder.append(v);
    v.addEventListener("loadeddata", () => {
      const img = holder.querySelector("img"); if (img) img.style.visibility = "hidden";
      const z = holder.closest(".zoom-hero"); if (z) z.classList.add("has-video");
      if (loop) v.play().catch(() => {});
    }, { once: true });
    if (!loop) scrubVideos.push({ v, holder });
  });
  const scrubTo = (v, t) => { if (v.readyState >= 1 && v.duration) { const target = t * (v.duration - 0.05); if (Math.abs(v.currentTime - target) > 0.01) v.currentTime = target; } };

  // ---------- Signature 1: zoom-through hero ----------
  const zoom = document.querySelector(".zoom-hero");
  if (zoom && !reduce) {
    const [l1, l2, l3] = $$(".zoom-layer", zoom);
    const titles = $$(".zoom-title", zoom);
    const steps = $$(".zoom-hero__progress span", zoom);
    const cue = zoom.querySelector(".scroll-cue");
    scroll((p) => {
      if (zoom.classList.contains("has-video")) {
        // one continuous Flow journey carries the hero: just scrub it and keep the titles in step
        l1.style.transform = ""; l1.style.opacity = "1"; l2.style.display = l3.style.display = "none";
      } else {
      // layer 1: facade pushes in; a window opens onto layer 2
      const a = range(p, 0, 0.42);
      l1.style.transform = `scale(${lerp(1, 2.4, a * a)})`;
      l1.style.opacity = String(1 - range(p, 0.36, 0.46));
      const w = range(p, 0.12, 0.42);
      l2.style.clipPath = `inset(${lerp(50, 0, w)}% ${lerp(50, 0, w)}% ${lerp(50, 0, w)}% ${lerp(50, 0, w)}% round ${lerp(6, 0, w)}px)`;
      // layer 2: interior settles, then a glass detail opens inside it
      const b = range(p, 0.42, 0.82);
      l2.style.transform = `scale(${lerp(1.18, 1, range(p, 0.12, 0.42)) * lerp(1, 1.9, b * b)})`;
      l2.style.opacity = String(1 - range(p, 0.76, 0.86));
      const g = range(p, 0.52, 0.82);
      l3.style.clipPath = `inset(${lerp(50, 0, g)}% ${lerp(50, 0, g)}% ${lerp(50, 0, g)}% ${lerp(50, 0, g)}% round ${lerp(6, 0, g)}px)`;
      l3.style.transform = `scale(${lerp(1.2, 1, g)})`;
      }
      // titles
      const t = p < 0.36 ? 0 : p < 0.72 ? 1 : 2;
      titles.forEach((el, i) => {
        const on = i === t;
        el.style.opacity = on ? "1" : "0";
        el.style.transform = `translateY(${on ? 0 : i < t ? -24 : 24}px)`;
        el.style.transition = "opacity .6s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)";
      });
      steps.forEach((s, i) => s.classList.toggle("is-on", i === t));
      if (cue) cue.style.opacity = String(0.8 * (1 - range(p, 0, 0.06)));
      scrubVideos.forEach(({ v, holder }) => { if (zoom.contains(holder)) scrubTo(v, p); });
    }, { target: zoom, offset: ["start start", "end end"] });
  }

  // ---------- Signature 2: horizontal reel ----------
  $$(".reel").forEach((reel) => {
    const track = reel.querySelector(".reel__track");
    const bar = reel.querySelector(".reel__progress i");
    if (reduce) return;
    let dist = 0;
    const measure = () => { dist = Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft)); };
    measure(); addEventListener("resize", measure);
    scroll((p) => {
      if (!desktop.matches) { track.style.transform = ""; return; }
      track.style.transform = `translate3d(${-dist * p}px,0,0)`;
      if (bar) bar.style.transform = `scaleX(${p})`;
    }, { target: reel, offset: ["start start", "end end"] });
  });

  // ---------- Signature 3: interiors room reveal ----------
  $$(".room-reveal").forEach((room) => {
    const box = room.querySelector(".room-reveal__img");
    const img = box.querySelector("img");
    const copy = room.querySelector(".room-reveal__copy");
    const sw = $$(".swatch", room);
    if (reduce) return;
    sw.forEach((s) => (s.style.opacity = 0));
    let shown = false;
    scroll((p) => {
      const r = range(p, 0.05, 0.7);
      const e = 1 - Math.pow(1 - r, 3);
      box.style.clipPath = `inset(${lerp(18, 0, e)}% ${lerp(32, 0, e)}% ${lerp(18, 0, e)}% ${lerp(32, 0, e)}%)`;
      img.style.transform = `scale(${lerp(1.25, 1, e)})`;
      if (copy) { copy.style.opacity = String(1 - range(p, 0.05, 0.3)); copy.style.transform = `translateY(${lerp(0, -40, range(p, 0.05, 0.3))}px)`; }
      if (!shown && p > 0.62) { shown = true; animate(sw, { opacity: [0, 1], y: [30, 0], scale: [0.8, 1] }, { duration: 0.8, ease, delay: stagger(0.08) }); }
      scrubVideos.forEach(({ v, holder }) => { if (room.contains(holder)) scrubTo(v, p); });
    }, { target: room, offset: ["start start", "end end"] });
  });

  // ---------- Signature 4: prismatic light ----------
  const beam = document.querySelector(".prism-beam");
  if (beam && !reduce) {
    let rot = -18, rotTarget = -18;
    scroll((p) => {
      beam.style.setProperty("--beam-x", `${lerp(-22, 22, p)}%`);
      $$(".prism-text").forEach((t) => t.style.setProperty("--prism-pos", `${p * 300}%`));
    });
    if (finePointer) {
      addEventListener("pointermove", (e) => { rotTarget = -18 + (e.clientX / innerWidth - 0.5) * 24 + (e.clientY / innerHeight - 0.5) * 10; });
      const tick = () => { rot = lerp(rot, rotTarget, 0.06); beam.style.setProperty("--beam-rot", `${rot.toFixed(2)}deg`); requestAnimationFrame(tick); };
      tick();
    }
    const hero = document.querySelector(".prism-hero");
    if (hero) scroll((p) => scrubVideos.forEach(({ v, holder }) => { if (hero.contains(holder)) scrubTo(v, p); }), { target: hero, offset: ["start start", "end start"] });
  }
  if (!reduce) $$(".glass-card").forEach((card) => {
    scroll((p) => card.style.setProperty("--sheen", `${lerp(-70, 70, p)}%`), { target: card, offset: ["start end", "end start"] });
  });

  // ---------- Film hero: content fades on the first scroll; the stage recedes into a plate at the very end ----------
  if (!reduce) $$(".film-hero").forEach((hero) => {
    const stage = hero.querySelector(".film-hero__stage");
    const lede = hero.querySelector(".film-hero__foot");
    const pill = hero.querySelector(".film-hero__content .pill");
    scroll((p) => {
      stage.style.transform = `scale(${lerp(1, 0.9, p)})`;
      stage.style.borderRadius = `${lerp(0, 28, p)}px`;
    }, { target: hero, offset: ["end end", "end start"] });
    scroll((p) => {
      const f = 1 - range(p, 0, 0.06);
      if (lede) lede.style.opacity = String(f);
      if (pill) pill.style.opacity = String(f);
    }, { target: hero, offset: ["start start", "end end"] });
  });

  // ---------- Media reveal: a slow curtain lift with the image settling inside (CSS-driven) ----------
  if (!reduce) $$("main .media").forEach((m) => {
    if (m.closest(".film-hero, .reel, .gallery")) return;   // multi-column galleries: IntersectionObserver is unreliable inside column fragments
    m.classList.add("reveal-media");
    // observe the parent: a fully clipped target never reports as intersecting
    inView(m.parentElement, () => { m.classList.add("is-revealed"); }, { amount: 0.1 });
  });

  // ---------- Custom cursor ----------
  if (finePointer && !reduce) {
    const c = document.createElement("div");
    c.className = "cursor"; c.setAttribute("aria-hidden", "true"); c.innerHTML = "<span>View</span>";
    document.body.append(c);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      const t = e.target;
      c.classList.toggle("is-view", !!t.closest(".project, .reel-card, .gateway, .gallery figure"));
      c.classList.toggle("is-link", !c.classList.contains("is-view") && !!t.closest("a, button, select, input, textarea"));
    });
    const tick = () => { cx = lerp(cx, x, 0.18); cy = lerp(cy, y, 0.18); c.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(tick); };
    tick();
  }

  // ---------- Intro curtain (once per session) ----------
  if (!reduce && !sessionStorage.getItem("intro") && !pending) {
    sessionStorage.setItem("intro", "1");
    const intro = document.createElement("div");
    intro.className = "intro"; intro.setAttribute("aria-hidden", "true");
    intro.innerHTML = `<div class="intro__mark"><span class="intro__word">Meridian</span><span class="intro__bar"><i></i></span><span class="intro__sub">Build · Interiors · Glass</span></div>`;
    document.body.append(intro);
    const mark = intro.querySelector(".intro__mark");
    animate(mark, { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, ease });
    animate(intro.querySelector(".intro__bar i"), { scaleX: [0, 1] }, { duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.2 })
      .then(() => animate(mark, { opacity: 0, y: -20 }, { duration: 0.5, ease }))
      .then(() => animate(intro, { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] }, { duration: 1, ease: [0.76, 0, 0.24, 1] }))
      .then(() => intro.remove());
  }

  // keep Lenis in sync after filters/resize
  addEventListener("resize", () => lenis && lenis.resize());
})();
