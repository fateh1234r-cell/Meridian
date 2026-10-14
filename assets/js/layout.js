// Shared chrome: header + division switcher, mobile menu, footer, WhatsApp button, page-wipe overlay,
// project filters and the enquiry form. Content pages only carry their own <main>.
(function () {
  const S = window.SITE;
  const body = document.body;
  const division = body.dataset.division || "group";
  const here = location.pathname.replace(/\/$/, "/index.html");
  document.documentElement.classList.add("js");

  const NAV = {
    group: [["Projects", "/projects.html"], ["About", "/about.html"], ["Contact", "/contact.html"]],
    interiors: [["Overview", "/interiors/index.html"], ["Portfolio", "/interiors/portfolio.html"], ["Services", "/interiors/services.html"], ["Contact", "/contact.html?division=interiors"]],
    glass: [["Overview", "/glass-art/index.html"], ["Gallery", "/glass-art/gallery.html"], ["Services", "/glass-art/services.html"], ["Contact", "/contact.html?division=glass"]],
  };
  const SUB = { group: "Build · Pvt. Ltd.", interiors: "Interiors", glass: "Glass Studio" };

  const mark = `<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 32V12l12 12 12-12v20" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 8h24" stroke="currentColor" stroke-width="1.5"/></svg>`;
  const arrow = `<svg class="arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
  window.ARROW = arrow;

  const isCurrent = (href) => here === href.split("?")[0];
  const navLinks = NAV[division].map(([t, h]) => `<a href="${h}"${isCurrent(h) ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  const switcher = Object.entries(S.divisions).map(([k, d]) =>
    `<a href="${d.home}" data-wipe="${k}"${k === division ? ' aria-current="true"' : ""}><span>${d.label}</span></a>`).join("");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="wrap">
      <a class="brand" href="${S.divisions[division].home}" aria-label="${S.divisions[division].name} — home">
        ${mark}<span class="brand-name">Meridian<small>${SUB[division]}</small></span>
      </a>
      <nav class="nav" aria-label="Primary">${navLinks}</nav>
      <nav class="switcher" aria-label="Group companies">${switcher}</nav>
      <button class="menu-btn" aria-expanded="false" aria-controls="mobile-menu">Menu</button>
    </div>`;
  body.prepend(header);

  const skip = document.createElement("a");
  skip.className = "skip-link"; skip.href = "#main"; skip.textContent = "Skip to content";
  body.prepend(skip);

  const menu = document.createElement("div");
  menu.className = "mobile-menu"; menu.id = "mobile-menu";
  menu.innerHTML = `<nav aria-label="Mobile">${navLinks}</nav><nav class="switcher" aria-label="Group companies (mobile)">${switcher}</nav>
    <p class="muted">${S.group.address}<br><a href="tel:${S.divisions[division].phone.replace(/\s/g, "")}">${S.divisions[division].phone}</a></p>`;
  header.after(menu);
  const menuBtn = header.querySelector(".menu-btn");
  menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
    header.classList.toggle("is-solid", open || scrollY > 40);
    document.documentElement.style.overflow = open ? "hidden" : "";
  });

  // Footer
  const year = new Date().getFullYear();
  const col = (k) => {
    const d = S.divisions[k];
    return `<div><h4>${d.name}</h4><ul>${NAV[k].map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join("")}
      <li><a href="tel:${d.phone.replace(/\s/g, "")}">${d.phone}</a></li><li><a href="mailto:${d.email}">${d.email}</a></li></ul></div>`;
  };
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="wrap">
      <p class="footer-word" aria-hidden="true">Meridian</p>
      <div class="footer-top">
        <div><h4>${S.group.name}</h4><p style="max-width:32ch;opacity:.8">Three disciplines under one roof — we build, we furnish, we craft light. ${S.group.address}.</p></div>
        ${col("group")}${col("interiors")}${col("glass")}
      </div>
      <div class="footer-bottom">
        <span>© ${year} ${S.group.legal}. All rights reserved.</span>
      </div>
    </div>`;
  body.append(footer);

  // WhatsApp
  const wa = document.createElement("a");
  wa.className = "wa-fab";
  wa.href = `https://wa.me/${S.divisions[division].whatsapp}?text=${encodeURIComponent(`Hello ${S.divisions[division].name}, I'd like to discuss a project.`)}`;
  wa.target = "_blank"; wa.rel = "noopener";
  wa.setAttribute("aria-label", `Chat with ${S.divisions[division].name} on WhatsApp`);
  wa.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z"/></svg>`;
  body.append(wa);

  // Living gradient backdrop (slow drifting light blooms behind every page)
  const aurora = document.createElement("div");
  aurora.className = "aurora"; aurora.setAttribute("aria-hidden", "true");
  aurora.innerHTML = '<div class="aurora__layer"><span class="bloom"><i></i></span><span class="bloom"><i></i></span><span class="bloom"><i></i></span><span class="bloom"><i></i></span><span class="bloom"><i></i></span></div><div class="rays"><div class="rays__fan"><b></b><b></b><b></b><b></b><b></b><b></b></div></div><div class="sweep"></div>';
  body.prepend(aurora);
  const spot = document.createElement("div");
  spot.className = "spotlight"; spot.setAttribute("aria-hidden", "true");
  body.prepend(spot);
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addEventListener("pointermove", (e) => { spot.style.setProperty("--mx", e.clientX + "px"); spot.style.setProperty("--my", e.clientY + "px"); spot.classList.add("is-on"); }, { passive: true });
  }

  // Wipe overlay (driven by motion-site.js)
  const wipe = document.createElement("div");
  wipe.className = "wipe"; wipe.setAttribute("aria-hidden", "true");
  wipe.innerHTML = "<span></span>";
  body.append(wipe);

  // Project filters
  document.querySelectorAll("[data-filters]").forEach((bar) => {
    const items = document.querySelectorAll(bar.dataset.filters);
    bar.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip"); if (!chip) return;
      bar.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      const f = chip.dataset.filter;
      items.forEach((it) => { it.hidden = f !== "all" && !it.dataset.type.split(" ").includes(f); });
      window.dispatchEvent(new Event("resize"));
    });
  });

  // Enquiry form: Web3Forms (per-division key) then a pre-filled WhatsApp to that division.
  const form = document.querySelector("#enquiry");
  if (form) {
    const sel = form.querySelector("[name=division]");
    const pre = new URLSearchParams(location.search).get("division");
    if (pre && S.divisions[pre]) sel.value = pre;
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = S.divisions[sel.value];
      const data = Object.fromEntries(new FormData(form));
      status.textContent = "Sending…";
      const msg = `Hello ${d.name}, I'm ${data.name}.\nProject: ${data.project_type}\nBudget: ${data.budget}\nCity: ${data.city || "-"}\n\n${data.message}`;
      try {
        if (d.web3formsKey.startsWith("YOUR-")) throw new Error("demo");
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ access_key: d.web3formsKey, subject: `New enquiry — ${d.name}`, from_name: "Meridian website", ...data }),
        });
        if (!res.ok) throw new Error("send failed");
        status.textContent = "Thank you — your enquiry has been sent. Opening WhatsApp so you can reach us directly…";
      } catch (err) {
        status.textContent = err.message === "demo"
          ? "Demo mode: email delivery is switched off until the form key is added. Opening WhatsApp…"
          : "We couldn't send the email just now — opening WhatsApp instead.";
      }
      setTimeout(() => window.open(`https://wa.me/${d.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener"), 900);
      form.reset(); sel.value = Object.keys(S.divisions).find((k) => S.divisions[k] === d);
    });
  }
})();
