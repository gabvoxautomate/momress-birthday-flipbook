(() => {
  "use strict";

  const intro = document.querySelector("#intro");
  const reader = document.querySelector("#book-stage");
  const readerTitle = document.querySelector("#reader-title");
  const book = document.querySelector("#book");
  const pages = [...document.querySelectorAll(".page")];
  const openButton = document.querySelector("#open-book");
  const prevButton = document.querySelector("#prev-page");
  const nextButton = document.querySelector("#next-page");
  const pageCount = document.querySelector("#page-count");
  const progressFill = document.querySelector("#progress-fill");
  const music = document.querySelector("#birthday-music");
  const musicToggle = document.querySelector("#music-toggle");
  const musicLabel = document.querySelector("#music-label");
  const musicNotice = document.querySelector("#music-notice");
  const backToCover = document.querySelector("#back-to-cover");

  const labels = ["Cover", "Birthday note", "A life worth celebrating", "Beautiful in every season",
    "Grace for the journey", "The gift of family", "A love to treasure", "The joy of motherhood",
    "Birthday blessing", "Media Team dedication"];
  let currentPage = 0;
  let revealedPage = null;
  let busy = false;
  let turningPage = null;
  let startX = null;
  let startY = null;
  let startTime = 0;

  pages.forEach(page => {
    const reverse = document.createElement("div");
    reverse.className = "page-reverse";
    reverse.setAttribute("aria-hidden", "true");
    page.append(reverse);

    const corner = document.createElement("span");
    corner.className = "page-corner";
    corner.setAttribute("aria-hidden", "true");
    page.append(corner);

    const content = page.querySelector(".page-content, .cover-inner");
    if (content) {
      const textNodes = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (textNodes.nextNode()) {
        if (textNodes.currentNode.textContent.trim()) nodes.push(textNodes.currentNode);
      }
      let wordIndex = 0;
      nodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
            return;
          }
          const word = document.createElement("span");
          word.className = "reveal-word";
          word.style.setProperty("--word-index", String(wordIndex++));
          word.textContent = part;
          fragment.append(word);
        });
        node.replaceWith(fragment);
      });
    }
  });

  function renderState() {
    pages.forEach((page, index) => {
      const flipped = index < currentPage;
      page.classList.toggle("flipped", flipped);
      page.classList.toggle("is-current", index === currentPage);
      const stackOrder = flipped ? index + 1 : pages.length - index + 10;
      page.style.zIndex = String(index === turningPage ? pages.length + 20 : stackOrder);
      page.setAttribute("aria-hidden", flipped ? "true" : "false");
      page.inert = flipped;
    });
    if (revealedPage !== currentPage) {
      const previousPage = pages[revealedPage];
      if (previousPage) previousPage.classList.add("has-revealed");
      revealedPage = currentPage;
      const activePage = pages[currentPage];
      if (activePage) {
        activePage.classList.remove("has-revealed");
        activePage.classList.remove("is-current");
        window.requestAnimationFrame(() => activePage.classList.add("is-current"));
      }
    }
    prevButton.disabled = currentPage === 0 || busy;
    nextButton.disabled = currentPage === pages.length - 1 || busy;
    pageCount.textContent = `${labels[currentPage]} · ${currentPage}/${pages.length - 1}`;
    progressFill.style.width = `${(currentPage / (pages.length - 1)) * 100}%`;
    nextButton.querySelector("span").textContent = currentPage === pages.length - 2 ? "Finish book" : "Turn page";
    if (currentPage === pages.length - 1) {
      nextButton.disabled = true;
      pageCount.textContent = "Media Team dedication · Final page";
    }
  }

  function turnTo(nextPage) {
    if (busy) return;
    const bounded = Math.max(0, Math.min(pages.length - 1, nextPage));
    if (bounded === currentPage) return;
    const previousPage = currentPage;
    busy = true;
    turningPage = bounded > previousPage ? previousPage : bounded;
    pages[turningPage].classList.add(bounded > previousPage ? "turning-forward" : "turning-backward");
    currentPage = bounded;
    renderState();
    const turnDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 920;
    window.setTimeout(() => {
      pages[turningPage].classList.remove("turning-forward", "turning-backward");
      turningPage = null;
      busy = false;
      renderState();
    }, turnDuration);
  }

  openButton.addEventListener("click", () => {
    startMusic();
    intro.classList.add("hidden");
    reader.classList.remove("hidden");
    renderState();
    reader.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    readerTitle.focus({ preventScroll: true });
    window.requestAnimationFrame(() => turnTo(1));
  });

  prevButton.addEventListener("click", () => turnTo(currentPage - 1));
  nextButton.addEventListener("click", () => turnTo(currentPage + 1));
  backToCover.addEventListener("click", () => {
    turnTo(0);
    reader.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
    window.setTimeout(() => readerTitle.focus({ preventScroll: true }),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 920);
  });

  async function startMusic() {
    if (!music.paused) return;
    try {
      await music.play();
      musicToggle.setAttribute("aria-pressed", "true");
      musicToggle.setAttribute("aria-label", "Pause background music");
      musicLabel.textContent = "Pause music";
      musicNotice.textContent = "Background music playing.";
    } catch {
      musicNotice.textContent = "Music could not play. Check that assets/emotional-piano.mp3 is a playable audio file.";
      musicLabel.textContent = "Music unavailable";
    }
  }

  function toggleMusic() {
    if (music.paused) {
      startMusic();
      return;
    }
    music.pause();
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "Play background music");
    musicLabel.textContent = "Play music";
    musicNotice.textContent = "Background music paused.";
  }
  musicToggle.addEventListener("click", toggleMusic);
  music.addEventListener("error", () => {
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "Play background music");
    musicLabel.textContent = "Music unavailable";
    musicNotice.textContent = "To enable music, add a licensed MP3 at assets/emotional-piano.mp3.";
  });

  function clearPointer() {
    startX = null;
    startY = null;
  }

  book.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest("button, a")) return;
    startX = event.clientX;
    startY = event.clientY;
    startTime = performance.now();
    book.setPointerCapture(event.pointerId);
  });
  book.addEventListener("pointerup", event => {
    if (startX === null || startY === null) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const elapsed = performance.now() - startTime;
    const width = book.getBoundingClientRect().width;
    const edgeWidth = Math.min(82, width * .22);
    const startedAtRightEdge = startX >= width - edgeWidth;
    const startedAtLeftEdge = startX <= edgeWidth;

    if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      turnTo(currentPage + (dx < 0 ? 1 : -1));
    } else if (elapsed < 650 && Math.abs(dx) < 18 && Math.abs(dy) < 24) {
      if (startedAtRightEdge) turnTo(currentPage + 1);
      if (startedAtLeftEdge) turnTo(currentPage - 1);
    }
    clearPointer();
  });
  book.addEventListener("pointercancel", clearPointer);
  book.addEventListener("lostpointercapture", clearPointer);

  document.addEventListener("keydown", event => {
    if (reader.classList.contains("hidden")) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight" && currentPage < pages.length - 1) {
      event.preventDefault();
      turnTo(currentPage + 1);
    }
    if (event.key === "ArrowLeft" && currentPage > 0) {
      event.preventDefault();
      turnTo(currentPage - 1);
    }
  });

  // Friendly fallbacks if image files have not been copied into assets yet.
  document.querySelectorAll(".photo-frame img").forEach(img => {
    img.addEventListener("error", () => {
      img.alt = `${img.alt}. Replace the placeholder file in the assets folder with the supplied photograph.`;
      img.style.visibility = "hidden";
      img.parentElement.classList.add("missing-image");
      if (!img.parentElement.querySelector(".image-placeholder")) {
        const placeholder = document.createElement("span");
        placeholder.className = "image-placeholder";
        placeholder.textContent = "Add your photograph in the assets folder";
        img.parentElement.append(placeholder);
      }
    });
  });

  renderState();
})();
