// Reference effects: arched-window zoom (Kryntix), 3D gallery ring (Oversight), refractive glass mark (3D glass logo).
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const progress = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };

  // ---------- Minimal motion: sections, eyebrows draw in; the backdrop drifts with scroll ----------
  const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); } }), { threshold: 0.15 });
  document.querySelectorAll("main > section, .eyebrow").forEach((el) => (reduce ? el.classList.add("in-view") : io.observe(el)));
  // living backdrop: every bloom follows the cursor at its own depth and flows with the scroll
  const blooms = Array.from(document.querySelectorAll(".aurora .bloom"));
  if (blooms.length && !reduce) {
    const depth = [[90, 60], [-120, -80], [150, 110], [-80, 120], [60, -140]];
    let px = 0, py = 0, tx = 0, ty = 0, sy = 0, auto = 0;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) addEventListener("pointermove", (ev) => { tx = ev.clientX / innerWidth - 0.5; ty = ev.clientY / innerHeight - 0.5; }, { passive: true });
    const flow = (now) => {
      requestAnimationFrame(flow);
      if (!fine) { auto = now / 1000; tx = Math.sin(auto * 0.21) * 0.35; ty = Math.cos(auto * 0.17) * 0.35; }  // touch: gentle self-motion
      px += (tx - px) * 0.045; py += (ty - py) * 0.045;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      sy += (scrollY / max - sy) * 0.06;
      blooms.forEach((b, k) => {
        const [dx, dy] = depth[k % depth.length];
        const swirl = sy * (k % 2 ? -1 : 1) * 40;
        b.style.transform = `translate3d(${px * dx * 2 + swirl}px, ${py * dy * 2 - sy * dy * 3}px, 0) rotate(${sy * (k + 1) * 14}deg)`;
      });
    };
    requestAnimationFrame(flow);
  }

  // ---------- Tilt toward the cursor (light study, glass page) ----------
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    if (reduce || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let rx = 0, ry = 0, trx = 0, try_ = 0;
    el.addEventListener("pointermove", (ev) => { const r = el.getBoundingClientRect(); try_ = ((ev.clientX - r.left) / r.width - 0.5) * 10; trx = -((ev.clientY - r.top) / r.height - 0.5) * 8; el.style.setProperty("--sheen", `${((ev.clientX - r.left) / r.width) * 140 - 70}%`); });
    el.addEventListener("pointerleave", () => { trx = 0; try_ = 0; });
    const tick = () => { requestAnimationFrame(tick); rx += (trx - rx) * 0.08; ry += (try_ - ry) * 0.08; el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`; };
    tick();
  });

  // ---------- Arched window zoom ----------
  document.querySelectorAll(".window-zoom").forEach((sec) => {
    const frame = sec.querySelector(".window-zoom__frame");
    const img = frame.querySelector("img");
    const wl = sec.querySelector(".window-zoom__word--l"), wr = sec.querySelector(".window-zoom__word--r");
    const cap = sec.querySelector(".window-zoom__caption");
    if (reduce) { sec.classList.add("is-open"); return; }
    let sp = 0;
    const tick = () => {
      requestAnimationFrame(tick);
      const r = sec.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      sp += (progress(sec) - sp) * 0.14;
      const e = ease(clamp(sp / 0.75));
      const W = frame.clientWidth, H = frame.clientHeight;
      const w0 = Math.min(W * 0.3, 420), h0 = Math.min(H * 0.62, w0 * 1.5);
      const ix = lerp((W - w0) / 2, 0, e), iy = lerp((H - h0) / 2, 0, e);
      const arch = lerp(w0 / 2, 0, e);
      frame.style.clipPath = `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${arch}px ${arch}px ${lerp(18, 0, e)}px ${lerp(18, 0, e)}px)`;
      img.style.transform = `scale(${lerp(1.45, 1, e)})`;
      const spread = lerp(0, W * 0.32, e);
      wl.style.transform = `translateX(${-spread}px)`; wr.style.transform = `translateX(${spread}px)`;
      wl.style.opacity = wr.style.opacity = String(1 - clamp((sp - 0.45) / 0.25));
      if (cap) { const c = clamp((sp - 0.7) / 0.2); cap.style.opacity = String(c); cap.style.transform = `translateY(${lerp(30, 0, c)}px)`; }
    };
    tick();
  });

  // ---------- 3D gallery ring ----------
  document.querySelectorAll("[data-ring]").forEach((ring) => {
    const track = ring.querySelector(".ring__track");
    const items = Array.from(track.children);
    const n = items.length;
    let rot = 0, vel = 0, drag = false, lastX = 0, base = 0;
    const layout = () => {
      const w = track.clientWidth;
      const R = (w / 2) / Math.tan(Math.PI / n) * 1.08;
      items.forEach((it, k) => (it.style.transform = `rotateY(${(360 / n) * k}deg) translateZ(${R}px)`));
      track.style.setProperty("--R", R + "px");
    };
    layout(); addEventListener("resize", layout);
    if (reduce) return;
    ring.addEventListener("pointerdown", (e) => { drag = true; lastX = e.clientX; ring.setPointerCapture(e.pointerId); ring.classList.add("is-drag"); });
    ring.addEventListener("pointermove", (e) => { if (!drag) return; const dx = e.clientX - lastX; lastX = e.clientX; vel = dx * 0.18; rot += vel; });
    const end = () => { drag = false; ring.classList.remove("is-drag"); };
    ring.addEventListener("pointerup", end); ring.addEventListener("pointercancel", end);
    const tick = () => {
      requestAnimationFrame(tick);
      const r = ring.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      const scrollRot = (1 - (r.top + r.height / 2) / (innerHeight + r.height)) * -220;
      if (!drag) { vel *= 0.94; rot += vel - 0.04; }
      base += (scrollRot - base) * 0.08;
      track.style.transform = `translateZ(calc(var(--R) * -1)) rotateX(-6deg) rotateY(${rot + base}deg)`;
      const a = ((rot + base) % 360 + 360) % 360;
      items.forEach((it, k) => { let d = Math.abs((((360 / n) * k + a) % 360 + 360) % 360); d = Math.min(d, 360 - d); it.style.opacity = String(lerp(1, 0.28, clamp((d - 30) / 120))); });
    };
    tick();
  });

  // ---------- Refractive glass mark ----------
  document.querySelectorAll(".glass-mark").forEach((holder) => {
    if (reduce) { holder.classList.add("is-static"); return; }
    const canvas = document.createElement("canvas");
    holder.prepend(canvas);
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) { canvas.remove(); holder.classList.add("is-static"); return; }

    // height map of the Meridian mark: frame + M + bar, blurred into a rounded "glass" profile
    const H = document.createElement("canvas"); H.width = H.height = 512;
    const c = H.getContext("2d");
    c.fillStyle = "#000"; c.fillRect(0, 0, 512, 512);
    c.filter = "blur(14px)"; c.strokeStyle = "#fff"; c.lineCap = "round"; c.lineJoin = "round"; c.lineWidth = 34;
    c.strokeRect(70, 70, 372, 372);
    c.beginPath(); c.moveTo(140, 380); c.lineTo(140, 170); c.lineTo(256, 290); c.lineTo(372, 170); c.lineTo(372, 380); c.stroke();
    c.beginPath(); c.moveTo(140, 125); c.lineTo(372, 125); c.stroke();
    c.filter = "blur(4px)"; c.globalCompositeOperation = "lighter"; c.globalAlpha = 0.35; c.lineWidth = 18;
    c.strokeRect(70, 70, 372, 372);

    const VS = "attribute vec2 p; varying vec2 v; void main(){ v = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }";
    const FS = `precision highp float; varying vec2 v; uniform sampler2D uH; uniform vec2 uRes, uL; uniform float uT;
      float h(vec2 q){ return texture2D(uH, q).r; }
      vec3 bg(vec2 q){
        float bars = smoothstep(0.55, 1.0, sin(q.x * 34.0 + uT * 0.6) * 0.5 + 0.5) * 0.22;
        vec3 glowA = vec3(0.79, 0.68, 0.5) * exp(-8.0 * length(q - vec2(0.3 + 0.2*sin(uT*0.3), 0.65)));
        vec3 glowB = vec3(0.35, 0.75, 0.8) * exp(-9.0 * length(q - vec2(0.72, 0.35 + 0.15*cos(uT*0.4))));
        return vec3(0.04) + bars * vec3(1.0, 0.96, 0.9) + glowA * 0.9 + glowB * 0.6;
      }
      void main(){
        vec2 q = v; float ar = uRes.x / uRes.y;
        vec2 m = vec2((q.x - 0.5) * ar, q.y - 0.5) / 0.78 + 0.5;          // mark space, square, centred
        m += (uL - 0.5) * 0.04 * h(m);                                     // parallax tilt
        float e = 1.5 / 512.0;
        float hc = h(m), dx = h(m + vec2(e, 0.)) - h(m - vec2(e, 0.)), dy = h(m + vec2(0., e)) - h(m - vec2(0., e));
        vec3 n = normalize(vec3(-dx * 6.0, -dy * 6.0, 1.0));
        float mask = smoothstep(0.08, 0.3, hc) * step(0.0, m.x) * step(m.x, 1.0) * step(0.0, m.y) * step(m.y, 1.0);
        vec2 off = n.xy * 0.09;
        vec3 refr = vec3(bg(q + off * 1.00).r, bg(q + off * 1.06).g, bg(q + off * 1.12).b);
        vec3 L = normalize(vec3((uL - 0.5) * 2.0, 0.9)), V = vec3(0., 0., 1.);
        float spec = pow(max(dot(reflect(-L, n), V), 0.0), 48.0);
        float fres = pow(1.0 - n.z, 2.2);
        vec3 rainbow = 0.5 + 0.5 * cos(6.2831 * (atan(n.y, n.x) / 6.2831 + uT * 0.05 + vec3(0.0, 0.33, 0.67)));
        vec3 glass = refr * 1.35 + spec * 1.3 + fres * mix(vec3(1.0), rainbow, 0.55) * 1.6 + hc * 0.06;
        vec3 col = mix(bg(q) * 0.55, glass, mask);
        col *= smoothstep(1.2, 0.3, length((q - 0.5) * vec2(ar, 1.0)));
        gl_FragColor = vec4(col, 1.0);
      }`;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(o); return o; };
    const pr = gl.createProgram();
    try { gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); } catch (err) { console.warn(err); canvas.remove(); holder.classList.add("is-static"); return; }
    gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, H);
    const U = (k) => gl.getUniformLocation(pr, k);
    const uRes = U("uRes"), uL = U("uL"), uT = U("uT");
    gl.uniform1i(U("uH"), 0);
    const resize = () => { const d = Math.min(devicePixelRatio || 1, 1.5); canvas.width = holder.clientWidth * d; canvas.height = holder.clientHeight * d; gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(uRes, canvas.width, canvas.height); };
    resize(); addEventListener("resize", resize);
    let lx = 0.5, ly = 0.6, tx = 0.5, ty = 0.6, vis = false;
    holder.addEventListener("pointermove", (e) => { const r = holder.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = 1 - (e.clientY - r.top) / r.height; });
    new IntersectionObserver(([en]) => (vis = en.isIntersecting)).observe(holder);
    canvas.addEventListener("webglcontextlost", () => holder.classList.add("is-static"));
    const t0 = performance.now();
    const tick = (now) => {
      requestAnimationFrame(tick);
      if (!vis) return;
      const t = (now - t0) / 1000;
      if (!fine) { tx = 0.5 + 0.3 * Math.sin(t * 0.5); ty = 0.6 + 0.2 * Math.cos(t * 0.4); }
      lx += (tx - lx) * 0.06; ly += (ty - ly) * 0.06;
      gl.uniform2f(uL, lx, ly); gl.uniform1f(uT, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    requestAnimationFrame(tick);
  });
})();
