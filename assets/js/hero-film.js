// Cinematic photo film for the hero sections.
// Stills play like footage: a dolly on every shot, liquid ink dissolves with a warm light-leak and slight
// chromatic fringe, pseudo-depth parallax that follows the pointer, grain and vignette.
//   data-mode="scroll"  → the film is scrubbed by scrolling through the (tall) hero; otherwise it plays on a timer
//   data-counter        → "percent" (e.g. 62% complete) or "index" (Room 02 / 04)
//   data-dolly          → push-in strength per shot (0.13 default; ~0.4 for a walk-through feel)
//   data-video          → an encoded clip at this path replaces the stills (scrubbed in scroll mode, looped otherwise)
// Falls back to a CSS slideshow if WebGL is unavailable or the context is lost.
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SHOT = 6.2;   // seconds per shot (timer mode)
  const MIX = 1.7;    // seconds of dissolve (timer mode)

  const VERT = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;
  const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA, uB;
uniform vec2 uRes, uSizeA, uSizeB, uMouse;
uniform float uMix, uDriftA, uDriftB, uTime, uWarm, uDolly;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }

vec2 cover(vec2 uv, vec2 img){
  float rs = uRes.x / uRes.y, ri = img.x / img.y;
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}
vec2 shot(vec2 uv, vec2 img, float drift, float dir){
  float depth = pow(1.0 - uv.y, 1.6);                     // ground is nearer than sky
  uv += uMouse * (0.008 + 0.022 * depth);                  // parallax
  uv = (uv - 0.5) / (1.04 + uDolly * drift) + 0.5;         // dolly-in
  uv.x += dir * 0.025 * (drift - 0.5);                     // gentle lateral pan
  uv.y += 0.012 * (drift - 0.5) * depth;
  return cover(uv, img);
}
vec3 tex(sampler2D t, vec2 uv, float ca){
  return vec3(texture2D(t, uv + vec2(ca, 0.0)).r, texture2D(t, uv).g, texture2D(t, uv - vec2(ca, 0.0)).b);
}
void main(){
  vec2 uv = vUv;
  float n = fbm(uv * 3.2 + vec2(uTime * 0.05, 0.0));
  float m = smoothstep(0.0, 1.0, clamp((uMix * 1.5 - 0.25) + (n - 0.5) * 0.9, 0.0, 1.0));
  float pulse = sin(uMix * 3.14159);
  float ca = 0.0018 * pulse;
  vec2 warp = vec2(n - 0.5, fbm(uv * 2.7 + 7.0) - 0.5) * 0.22;
  vec3 a = tex(uA, shot(uv + warp * m, uSizeA, uDriftA, 1.0), ca);
  vec3 b = tex(uB, shot(uv - warp * (1.0 - m), uSizeB, uDriftB, -1.0), ca);
  vec3 col = mix(a, b, m);
  float leak = pulse * smoothstep(0.35, 1.0, fbm(uv * 1.6 + uTime * 0.08)) * (0.35 + 0.65 * uv.x);
  col += vec3(1.0, 0.72, 0.42) * leak * 0.45 * uWarm;
  col = pow(col, vec3(0.96));
  col = mix(col, col * vec3(1.04, 1.0, 0.94), 0.5 * uWarm);
  float v = smoothstep(1.15, 0.35, length((uv - 0.5) * vec2(1.25, 1.0)));
  col *= mix(0.62, 1.0, v);
  col += (hash(uv * uRes + fract(uTime) * 91.7) - 0.5) * 0.045;
  gl_FragColor = vec4(col, 1.0);
}`;

  const load = (src) => new Promise((res, rej) => { const i = new Image(); i.decoding = "async"; i.onload = () => res(i); i.onerror = rej; i.src = src; });
  const ease3 = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);

  async function tryVideo(hero) {
    const desk = matchMedia("(min-width: 861px)").matches;
    const src = desk ? hero.dataset.video : hero.dataset.videoMobile || hero.dataset.video;
    if (!src) return false;
    try { const r = await fetch(src, { method: "HEAD" }); if (!r.ok) return false; } catch { return false; }
    const v = document.createElement("video");
    Object.assign(v, { muted: true, playsInline: true, src });
    v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    v.className = "film-hero__video";
    hero.querySelector(".film-hero__stage").prepend(v);
    hero.classList.add("is-video");
    if (hero.dataset.mode === "scroll") {
      v.preload = "auto";
      let last = -1;
      const scrub = () => {
        requestAnimationFrame(scrub);
        const st = hero._state(performance.now(), 0);
        if (v.duration) { const t = st.p * (v.duration - 0.05); if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t; }
        if (st.show !== last) { last = st.show; hero._show(st.show); }
        hero._paint(st);
      };
      v.addEventListener("loadedmetadata", () => requestAnimationFrame(scrub), { once: true });
    } else {
      Object.assign(v, { loop: true, autoplay: true });
      v.play().catch(() => {});
    }
    return true;
  }

  // ---------- Frame-sequence player ----------
  // data-frames="/assets/frames/build/{n}.webp" data-frame-count="24": stills generated from one camera,
  // scrubbed by scroll like footage. Adjacent frames crossfade, so 24 frames read as continuous motion.
  async function trySequence(hero, showTitle, chapters, counter) {
    const pattern = hero.dataset.frames, count = Number(hero.dataset.frameCount || 0);
    if (!pattern || count < 2) return false;
    const mobile = matchMedia("(max-width: 860px)").matches;
    const url = (k) => pattern.replace("{n}", String(k + 1).padStart(2, "0")).replace(".webp", mobile && hero.dataset.framesMobile ? "-m.webp" : ".webp");
    try { const r = await fetch(url(0), { method: "HEAD" }); if (!r.ok) return false; } catch { return false; }

    const stage = hero.querySelector(".film-hero__stage");
    const canvas = document.createElement("canvas");
    canvas.className = "film-hero__gl";
    stage.prepend(canvas);
    const ctx = canvas.getContext("2d");
    const frames = new Array(count);
    const loadFrame = (k) => new Promise((res) => { const im = new Image(); im.decoding = "async"; im.onload = () => { frames[k] = im; res(); }; im.onerror = res; im.src = url(k); });
    await loadFrame(0);
    hero.classList.add("is-gl", "is-sequence");
    // load the rest in order, a few at a time, so early frames are ready first
    (async () => { for (let k = 1; k < count; k += 4) await Promise.all([k, k + 1, k + 2, k + 3].filter((x) => x < count).map(loadFrame)); })();

    const resize = () => { const d = Math.min(devicePixelRatio || 1, 1.75); canvas.width = Math.round(stage.clientWidth * d); canvas.height = Math.round(stage.clientHeight * d); };
    resize(); addEventListener("resize", resize);
    const nearest = (k) => { for (let d = 0; d < count; d++) { if (frames[k - d]) return frames[k - d]; if (frames[k + d]) return frames[k + d]; } return frames[0]; };
    const draw = (img, alpha, scale, ox, oy) => {
      if (!img) return;
      const cw = canvas.width, ch = canvas.height, r = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * scale;
      const w = img.naturalWidth * r, h = img.naturalHeight * r;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2 + ox * cw, (ch - h) / 2 + oy * ch, w, h);
    };

    const titles = hero.querySelectorAll(".film-title").length || 1;
    let sp = 0, mx = 0, my = 0, tx = 0, ty = 0, last = -1;
    if (matchMedia("(hover: hover)").matches) addEventListener("pointermove", (e) => { tx = (e.clientX / innerWidth - 0.5); ty = (e.clientY / innerHeight - 0.5); });
    const read = () => { const r = hero.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))); };
    const tick = () => {
      requestAnimationFrame(tick);
      const r = hero.getBoundingClientRect(); if (r.bottom < 0 || document.hidden) return;
      sp += (read() - sp) * 0.14;
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      const f = sp * (count - 1), a = Math.floor(f), t = f - a;
      const s = 1.03 + 0.02 * Math.sin(sp * Math.PI);            // breathing so held frames never look frozen
      ctx.globalAlpha = 1; ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(frames[a] || nearest(a), 1, s, -mx * 0.012, -my * 0.01);
      // "tight" blend: each frame holds clean, dissolving briefly between views (for walk-throughs where the camera moves)
      const tight = hero.dataset.blend === "tight";
      const alpha = tight ? (t <= 0.32 ? 0 : t >= 0.68 ? 1 : ((x) => x * x * (3 - 2 * x))((t - 0.32) / 0.36)) : t;
      if (alpha > 0.001 && a + 1 < count) draw(frames[a + 1] || nearest(a + 1), alpha, s, -mx * 0.012, -my * 0.01);
      // optional data-title-at="0,0.2,0.85,0.96": progress points where each headline takes over
      const at = (hero.dataset.titleAt || "").split(",").filter(Boolean).map(Number);
      const show = at.length ? Math.max(0, at.reduce((acc, v, k) => (sp >= v ? k : acc), 0)) : Math.min(titles - 1, Math.floor(sp * titles * 0.999));
      if (show !== last) { last = show; showTitle(show); }
      chapters.forEach((c, k) => c.style.setProperty("--p", String(Math.min(1, Math.max(0, sp * chapters.length - k)))));
      if (counter) counter.textContent = hero.dataset.counter === "index" ? String(show + 1).padStart(2, "0") : String(Math.round(sp * 100));
    };
    tick();
    return true;
  }

  // CSS fallback: crossfading, slowly pushing stills driven by the same state as the film
  function slideshow(hero, srcs) {
    if (hero.dataset.slideshow) return; hero.dataset.slideshow = "1";
    const stage = hero.querySelector(".film-hero__stage");
    hero.classList.remove("is-static"); hero.classList.add("is-slides");
    const slides = srcs.map((src) => { const im = new Image(); im.src = src; im.alt = ""; im.className = "film-hero__slide"; im.decoding = "async"; return im; });
    slides.slice().reverse().forEach((im) => stage.prepend(im));
    const t0 = performance.now(); let last = -1;
    const tick = (now) => {
      requestAnimationFrame(tick);
      const st = hero._state(now - t0, 0);
      if (st.show !== last) { last = st.show; slides.forEach((im, k) => im.classList.toggle("is-on", k === st.show)); hero._show(st.show); }
      hero._paint(st);
    };
    requestAnimationFrame(tick);
  }

  function init(hero) {
    const stage = hero.querySelector(".film-hero__stage");
    const titles = Array.from(hero.querySelectorAll(".film-title"));
    const chapters = Array.from(hero.querySelectorAll(".film-chapter"));
    const srcs = JSON.parse(hero.dataset.images || "[]");
    const warm = hero.dataset.warm ? Number(hero.dataset.warm) : 1;
    const dolly = hero.dataset.dolly ? Number(hero.dataset.dolly) : 0.13;
    const scrollMode = hero.dataset.mode === "scroll";
    const counter = hero.querySelector(".film-counter b");
    const n = srcs.length;

    const showTitle = (i) => {
      titles.forEach((t, k) => t.classList.toggle("is-on", k === i));
      chapters.forEach((c, k) => { c.classList.toggle("is-on", k === i); c.classList.toggle("is-done", k < i); });
    };
    showTitle(0);
    if (reduce || n < 2) { hero.classList.add("is-static"); return; }

    // scroll progress through the tall hero, smoothed
    let sp = 0, spTarget = 0;
    const readScroll = () => { const r = hero.getBoundingClientRect(); spTarget = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))); };
    if (scrollMode) { addEventListener("scroll", readScroll, { passive: true }); addEventListener("resize", readScroll); readScroll(); }

    // one state function drives the GL film, the real video and the fallback alike
    const state = (now, offset) => {
      if (scrollMode) {
        readScroll();
        sp += (spTarget - sp) * 0.12;
        const seg = sp * (n - 1), i = Math.min(n - 2, Math.floor(seg)), local = seg - i;
        const mix = ease3(Math.min(1, Math.max(0, (local - 0.5) / 0.5)));
        const prog = chapters.map((_, k) => (k < i ? 1 : k === i ? Math.min(1, local * 2) : k === i + 1 && local > 0.5 ? (local - 0.5) * 2 : 0));
        return { i, j: i + 1, mix, da: Math.min(1, local * 1.4), db: Math.max(0, local - 0.5) * 0.8, show: mix > 0.5 ? i + 1 : i, prog, p: sp, t: now / 1000 };
      }
      const t = now / 1000 + offset, total = SHOT * n, lt = ((t % total) + total) % total;
      const i = Math.floor(lt / SHOT), j = (i + 1) % n, inShot = lt - i * SHOT;
      const mix = ease3(Math.max(0, (inShot - (SHOT - MIX)) / MIX));
      const prog = chapters.map((_, k) => (k === i ? Math.min(1, inShot / SHOT) : k < i ? 1 : 0));
      return { i, j, mix, da: Math.min(1, inShot / SHOT), db: Math.max(0, inShot - (SHOT - MIX)) / SHOT, show: mix > 0.5 ? j : i, prog, p: lt / total, t };
    };
    const paintUI = (st) => {
      chapters.forEach((c, k) => c.style.setProperty("--p", String(st.prog[k] || 0)));
      if (counter) counter.textContent = hero.dataset.counter === "index" ? String(st.show + 1).padStart(2, "0") : String(Math.round(st.p * 100));
    };
    hero._state = state; hero._paint = paintUI; hero._show = showTitle;

    let offset = 0;
    const t0 = performance.now();
    chapters.forEach((c, k) => c.addEventListener("click", () => {
      if (scrollMode) { const top = hero.getBoundingClientRect().top + scrollY; scrollTo({ top: top + (hero.offsetHeight - innerHeight) * (k / (n - 1)) + 2, behavior: "smooth" }); return; }
      offset = k * SHOT - (performance.now() - t0) / 1000 - 0.001 + SHOT * n * 10;
    }));

    // Priority: a frame sequence (your 24 generated stills) → an encoded video → the 4-still WebGL film.
    trySequence(hero, showTitle, chapters, counter).then((isSeq) => {
      if (!isSeq) tryVideo(hero).then((isVideo) => { if (!isVideo) startGL(); });
    });

    function startGL() {
      const canvas = document.createElement("canvas");
      canvas.className = "film-hero__gl";
      stage.prepend(canvas);
      const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, powerPreference: "high-performance" });
      if (!gl) { canvas.remove(); slideshow(hero, srcs); return; }
      let dead = false;
      canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); dead = true; hero.classList.remove("is-gl"); canvas.remove(); slideshow(hero, srcs); });

      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const prog = gl.createProgram();
      try { gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); }
      catch (e) { console.warn("film shader", e); canvas.remove(); slideshow(hero, srcs); return; }
      gl.linkProgram(prog); gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = (k) => gl.getUniformLocation(prog, k);
      const u = { A: U("uA"), B: U("uB"), res: U("uRes"), sa: U("uSizeA"), sb: U("uSizeB"), mouse: U("uMouse"), mix: U("uMix"), da: U("uDriftA"), db: U("uDriftB"), time: U("uTime"), warm: U("uWarm"), dolly: U("uDolly") };
      gl.uniform1i(u.A, 0); gl.uniform1i(u.B, 1); gl.uniform1f(u.warm, warm); gl.uniform1f(u.dolly, dolly);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      const textures = [], sizes = [];
      const MAX = matchMedia("(max-width: 860px)").matches ? 1280 : 1920;
      const makeTex = (img) => {
        // cap texture size: kinder to mobile GPUs and avoids context loss on big stills
        const k = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
        let src = img;
        if (k < 1) { src = document.createElement("canvas"); src.width = Math.round(img.naturalWidth * k); src.height = Math.round(img.naturalHeight * k); src.getContext("2d").drawImage(img, 0, 0, src.width, src.height); }
        const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src); return t;
      };

      const resize = () => {
        const dpr = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(stage.clientWidth * dpr); canvas.height = Math.round(stage.clientHeight * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(u.res, canvas.width, canvas.height);
      };
      addEventListener("resize", resize);

      let mx = 0, my = 0, tx = 0, ty = 0;
      if (matchMedia("(hover: hover)").matches) addEventListener("pointermove", (e) => { tx = (e.clientX / innerWidth - 0.5) * -1; ty = (e.clientY / innerHeight - 0.5); });
      let visible = true;
      new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(hero);

      Promise.all(srcs.map(load)).then((imgs) => {
        imgs.forEach((img) => { textures.push(makeTex(img)); sizes.push([img.naturalWidth, img.naturalHeight]); });
        resize();
        hero.classList.add("is-gl");
        let last = -1;
        const frame = (now) => {
          if (dead) return;
          requestAnimationFrame(frame);
          if (!visible || document.hidden) return;
          const st = state(now - t0, offset);
          mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
          gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[st.i]);
          gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[st.j]);
          gl.uniform2f(u.sa, sizes[st.i][0], sizes[st.i][1]); gl.uniform2f(u.sb, sizes[st.j][0], sizes[st.j][1]);
          gl.uniform1f(u.mix, st.mix); gl.uniform1f(u.da, st.da); gl.uniform1f(u.db, st.db);
          gl.uniform1f(u.time, st.t); gl.uniform2f(u.mouse, mx, my);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          if (st.show !== last) { last = st.show; showTitle(st.show); }
          paintUI(st);
        };
        requestAnimationFrame(frame);
      }).catch((e) => { console.warn("film images", e); canvas.remove(); slideshow(hero, srcs); });
    }
  }

  document.querySelectorAll(".film-hero").forEach(init);
})();
