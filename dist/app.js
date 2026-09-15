const content = window.WAICE_SITE_CONTENT;
const app = document.querySelector("#app");
const nav = document.querySelector("#site-nav");
const menuButton = document.querySelector(".menu-button");
const langButtons = document.querySelectorAll("[data-lang]");
let currentLang = localStorage.getItem("waice-site-language") || content.settings.primaryLanguage;

const publicNav = content.navigation.filter((item) => item.status === "public");

function t(text) {
  return content.translations?.[currentLang]?.[text] || text;
}

function bodyText(text) {
  const body = t(text)
    .replace(/(geography\.|geográfica\.|地域限制。)\s*/g, "$1\n\n")
    .replace(/(Music Fun 100\.|每一位老師。|每一位老师。)\s*/g, "$1\n\n");

  return body
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

function setActiveLanguage() {
  document.documentElement.lang =
    currentLang === "zhHant" ? "zh-Hant" : currentLang === "zhHans" ? "zh-Hans" : currentLang === "es" ? "es" : "en";
  langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLang);
    button.setAttribute("aria-pressed", String(button.dataset.lang === currentLang));
  });
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
}

function icon(name) {
  const icons = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
  };
  return icons[name] || "";
}

function renderNav() {
  nav.innerHTML = publicNav
    .map((item) => `<a href="#${item.id}" data-nav="${item.id}">${t(item.label)}</a>`)
    .join("");
}

function setActiveNav(pageId) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === pageId);
  });
}

function imageCard(imageKey, fallbackLabel, ratio = "4:5") {
  const image = content.images?.[imageKey];

  if (image?.src) {
    return `
      <figure class="image-card ratio-${(image.ratio || ratio).replace(":", "-")}">
        <img src="${image.src}" alt="${t(image.alt || fallbackLabel)}">
        <figcaption>${t(image.caption || fallbackLabel)}</figcaption>
      </figure>
    `;
  }

  return `
    <figure class="image-placeholder ratio-${ratio.replace(":", "-")}">
      <div>
        <span>${t("Image Slot")}</span>
        <strong>${t(fallbackLabel)}</strong>
      </div>
      <figcaption>${t("Replace with approved photography, caption and source note.")}</figcaption>
    </figure>
  `;
}

function sectionHeader(title, intro) {
  return `
    <section class="page-hero">
      <h1>${title}</h1>
      ${intro ? `<p>${intro}</p>` : ""}
    </section>
  `;
}

function renderImageGallery(gallery) {
  if (!gallery?.items?.length) return "";

  return `
    <section class="photo-gallery ${gallery.className || ""}">
      <div class="gallery-header">
        <h2>${t(gallery.title)}</h2>
        <p>${t(gallery.intro)}</p>
      </div>
      <div class="gallery-grid">
        ${gallery.items.map((imageKey) => imageCard(imageKey, imageKey, "4:5")).join("")}
      </div>
    </section>
  `;
}

function ctaBand() {
  const logo = content.images.musicFunLogo;

  return `
    <section class="cta-band">
      ${
        logo?.src
          ? `<img class="cta-logo" src="${logo.src}" alt="${t(logo.alt || logo.caption)}">`
          : ""
      }
      <div>
        <h2>${t("Music education should move beyond geography.")}</h2>
        <p>${t("Connect with Music Fun 100 as a teacher, student, parent or partner.")}</p>
      </div>
      <div class="cta-actions">
        <a class="button primary" href="${content.settings.musicFunUrl}" target="_blank" rel="noreferrer">${t("Join as a Teacher")} ${icon("arrow")}</a>
        <a class="button secondary" href="${content.settings.musicFunUrl}" target="_blank" rel="noreferrer">${t("Find a Music Teacher")}</a>
      </div>
    </section>
  `;
}

function renderHome(page) {
  const hasVideo = Boolean(content.settings.youtubeIntroUrl);
  return `
    <section class="hero-shell">
      <div class="hero-copy">
        <div class="identity-line">${t(page.hero.founderLine)}</div>
        <h1>${t(page.hero.title)}</h1>
        <h2>${t(page.hero.subtitle)}</h2>
        <p>${t(page.hero.body)}</p>
        <blockquote>${t(page.hero.belief)}</blockquote>
        <div class="hero-actions">
          <a class="button primary" href="${content.settings.musicFunUrl}" target="_blank" rel="noreferrer">${t("Visit Music Fun 100")} ${icon("arrow")}</a>
          <a class="button secondary" href="${content.settings.musicFunUrl}" target="_blank" rel="noreferrer">${t("Join as a Teacher")}</a>
          <a class="button text" href="${content.settings.musicFunUrl}" target="_blank" rel="noreferrer">${t("Find a Music Teacher")}</a>
        </div>
      </div>
      <div class="video-card">
        <div class="video-frame">
          ${
            hasVideo
              ? `<iframe src="${content.settings.youtubeIntroUrl}" title="${t(page.hero.videoTitle)}" allowfullscreen></iframe>`
              : `<div class="video-placeholder">${icon("play")}<strong>${t(page.hero.videoTitle)}</strong><span>${t(content.settings.youtubePosterNote)}</span></div>`
          }
        </div>
        <p>${t(page.hero.videoCaption)}</p>
      </div>
    </section>
    <section class="highlight-strip">
      ${page.highlights.map((item) => `<article><strong>${t(item.value)}</strong><span>${t(item.label)}</span></article>`).join("")}
    </section>
    <section class="split-section">
      <div>
        <h2>${t(page.sections[0].title)}</h2>
        <div class="body-copy">${bodyText(page.sections[0].body)}</div>
      </div>
      ${imageCard("seatedFounderPortrait", "Founder portrait / teaching moment", "4:5")}
    </section>
    <section class="proof-section">
      <h2>${t(page.sections[1].title)}</h2>
      <div class="proof-grid">
        ${page.sections[1].items.map((item) => `<article>${icon("check")}<p>${t(item)}</p></article>`).join("")}
      </div>
    </section>
    ${ctaBand()}
  `;
}

function renderStandardPage(page) {
  return `
    ${sectionHeader(t(page.title), t(page.intro))}
    <section class="editorial-list">
      ${page.sections
        .map(
          (section, index) => `
            <article class="editorial-row">
              <div class="row-number">0${index + 1}</div>
              <div>
                <h2>${t(section.title)}</h2>
                <p>${t(section.body)}</p>
                ${
                  section.items
                    ? `<div class="experience-list">${section.items
                        .map((item) => `<div class="experience-item"><strong>${item.period}</strong><p>${t(item.role)}</p></div>`)
                        .join("")}</div>`
                    : ""
                }
              </div>
              ${imageCard(section.imageKey, section.imageRole || section.title, index % 2 ? "16:9" : "4:5")}
            </article>
          `,
        )
        .join("")}
    </section>
    ${renderImageGallery(page.gallery)}
    ${ctaBand()}
  `;
}

function renderLeadership(page) {
  return `
    ${sectionHeader(t(page.title), t(page.intro))}
    <section class="group-grid">
      ${page.groups
        .map(
          (group) => `
            <article class="group-card">
              <h2>${t(group.title)}</h2>
              <ul>${group.items.map((item) => `<li>${t(item)}</li>`).join("")}</ul>
            </article>
          `,
        )
        .join("")}
    </section>
    <section class="split-section reverse">
      ${imageCard("missUniverseMacauViceChair", "Public image / entrepreneurship archive", "3:4")}
      <div>
        <h2>${t("Supporting the Founder Story")}</h2>
        <p>${t("These experiences should support Waice's credibility as a founder without distracting from Music Fun 100. Glamour Model Agency and modeling achievements remain secondary evidence, not the core positioning.")}</p>
      </div>
    </section>
    ${renderImageGallery(page.gallery)}
    ${(page.galleries || []).map((gallery) => renderImageGallery(gallery)).join("")}
  `;
}

function renderMedia(page) {
  return `
    ${sectionHeader(t(page.title), t(page.intro))}
    <section class="media-wall">
      ${page.mediaItems
        .map(
          (item) => `
            <article class="media-card ${item.status}">
              <span>${t(item.type)}</span>
              <h2>${t(item.title)}</h2>
              ${item.source ? `<p>${t(item.source)}</p>` : ""}
            </article>
          `,
        )
        .join("")}
    </section>
    ${renderImageGallery(page.gallery)}
    <section class="timeline">
      <h2>${t("Press Timeline")}</h2>
      <p>${t("Future media items can be added as public, draft, needs-source or archived records.")}</p>
    </section>
  `;
}

function renderFounder(page) {
  return `
    ${sectionHeader(t(page.title), t(page.intro))}
    <section class="letter-section">
      <div class="letter-paper">
        ${page.letter
          .map((paragraph, index) =>
            index === 0 || index > page.letter.length - 3
              ? `<p class="letter-emphasis">${t(paragraph)}</p>`
              : `<p>${t(paragraph)}</p>`,
          )
          .join("")}
      </div>
    </section>
    <section class="belief-grid">
      <article><h2>${t("For Teachers")}</h2><p>${t("Support music teachers in being seen, communicating clearly with parents and finding more active teaching opportunities.")}</p></article>
      <article><h2>${t("For Students")}</h2><p>${t("Open access to international music knowledge, competitions, festivals, exchanges and a wider view of the world.")}</p></article>
      <article><h2>${t("For Parents")}</h2><p>${t("Build trust, clarity and respect between parents and teachers through a more transparent music learning platform.")}</p></article>
    </section>
    ${ctaBand()}
  `;
}

function renderContact(page) {
  return `
    ${sectionHeader(t(page.title), t(page.intro))}
    <section class="contact-grid">
      <form class="contact-form" action="mailto:${content.settings.contactEmail}" method="post" enctype="text/plain">
        <label>${t("Name")}<input name="name" required></label>
        <label>${t("Email")}<input name="email" type="email" required></label>
        <label>${t("Topic")}<select name="topic">${page.topics.map((topic) => `<option>${t(topic)}</option>`).join("")}</select></label>
        <label>${t("Message")}<textarea name="message" rows="6" required></textarea></label>
        <button class="button primary" type="submit">${t("Send Inquiry")} ${icon("arrow")}</button>
      </form>
      <div class="contact-panel">
        <h2>${t("Primary Contact Paths")}</h2>
        <ul>${page.topics.map((topic) => `<li>${t(topic)}</li>`).join("")}</ul>
        <p>${t("The first live version can send directly to email. A future admin system can save inquiries into a private dashboard.")}</p>
      </div>
    </section>
  `;
}

function renderInvestor(page) {
  return `
    ${sectionHeader(t(page.title), t(page.intro))}
    <section class="investor-panel">
      <h2>${t("Founder-Market Fit")}</h2>
      <div class="proof-grid">
        ${page.points.map((point) => `<article>${icon("check")}<p>${t(point)}</p></article>`).join("")}
      </div>
    </section>
    <section class="split-section">
      <div>
        <h2>${t("Investment & Partnership Direction")}</h2>
        <p>${t("Music Fun 100 is positioned as a trust-led music education platform supporting teachers, students and parents, with a long-term international direction across learning, competitions, festivals and cultural exchange.")}</p>
      </div>
      ${imageCard("seatedFounderPortrait", "Investor-friendly founder image", "4:5")}
    </section>
  `;
}

function renderPage(pageId) {
  const page = content.pages[pageId] || content.pages.home;
  document.title = page.seo?.title ? t(page.seo.title) : `${t(page.title || "Waice Che")} | WaiceChe.com`;
  setActiveLanguage();
  renderNav();
  setActiveNav(page.id);

  if (page.id === "home") app.innerHTML = renderHome(page);
  else if (["about", "music", "students"].includes(page.id)) app.innerHTML = renderStandardPage(page);
  else if (page.id === "leadership") app.innerHTML = renderLeadership(page);
  else if (page.id === "media") app.innerHTML = renderMedia(page);
  else if (page.id === "founder") app.innerHTML = renderFounder(page);
  else if (page.id === "contact") app.innerHTML = renderContact(page);
  else if (page.id === "investor") app.innerHTML = renderInvestor(page);
  else app.innerHTML = renderHome(content.pages.home);

  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.body.classList.remove("nav-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", t("Open menu"));
}

function currentRoute() {
  return window.location.hash.replace("#", "") || "home";
}

renderNav();
renderPage(currentRoute());

window.addEventListener("hashchange", () => renderPage(currentRoute()));
menuButton.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", t(open ? "Close menu" : "Open menu"));
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLang = button.dataset.lang;
    localStorage.setItem("waice-site-language", currentLang);
    renderPage(currentRoute());
  });
});
