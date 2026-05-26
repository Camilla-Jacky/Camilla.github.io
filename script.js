const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const progress = document.querySelector(".scroll-progress");

toggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    const note = form.querySelector(".form-note");
    if (!button || !note) return;

    const original = button.textContent;
    button.textContent = "已收到";
    note.textContent = "感谢留言，我会尽快通过你留下的邮箱联系你。";

    setTimeout(() => {
      button.textContent = original;
      note.textContent = "";
      form.reset();
    }, 1800);
  });
});

const photoStage = document.querySelector("[data-photo-stage]");
const photoCards = [...document.querySelectorAll("[data-photo-card]")];
const photoDots = [...document.querySelectorAll("[data-photo-index]")];
const photoPrev = document.querySelector("[data-photo-prev]");
const photoNext = document.querySelector("[data-photo-next]");
let photoIndex = Math.max(0, photoDots.findIndex((dot) => dot.classList.contains("active")));
let photoStartX = 0;
let photoStartY = 0;

const showPhotoStack = (index) => {
  if (photoCards.length === 0) return;
  photoIndex = (index + photoCards.length) % photoCards.length;

  photoCards.forEach((card, cardIndex) => {
    const offset = (cardIndex - photoIndex + photoCards.length) % photoCards.length;
    card.classList.remove("active", "next", "next-2", "prev");

    if (offset === 0) {
      card.classList.add("active");
    } else if (offset === 1) {
      card.classList.add("next");
    } else if (offset === 2) {
      card.classList.add("next-2");
    } else {
      card.classList.add("prev");
    }
  });

  photoDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === photoIndex);
  });
};

photoDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => showPhotoStack(dotIndex));
});

photoPrev?.addEventListener("click", () => showPhotoStack(photoIndex - 1));
photoNext?.addEventListener("click", () => showPhotoStack(photoIndex + 1));

photoStage?.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".photo-nav, .photo-dot")) return;
  photoStartX = event.clientX;
  photoStartY = event.clientY;
  photoStage.setPointerCapture?.(event.pointerId);
});

photoStage?.addEventListener("pointerup", (event) => {
  if (event.target.closest(".photo-nav, .photo-dot")) return;
  const deltaX = event.clientX - photoStartX;
  const deltaY = event.clientY - photoStartY;
  if (Math.abs(deltaX) > 36 && Math.abs(deltaX) > Math.abs(deltaY)) {
    showPhotoStack(photoIndex + (deltaX < 0 ? 1 : -1));
  }
});

document.addEventListener(
  "click",
  (event) => {
    const prevTrigger = event.target.closest("[data-photo-prev]");
    const nextTrigger = event.target.closest("[data-photo-next]");
    const dotTrigger = event.target.closest("[data-photo-index]");

    if (prevTrigger) {
      event.preventDefault();
      event.stopPropagation();
      showPhotoStack(photoIndex - 1);
    }

    if (nextTrigger) {
      event.preventDefault();
      event.stopPropagation();
      showPhotoStack(photoIndex + 1);
    }

    if (dotTrigger) {
      event.preventDefault();
      event.stopPropagation();
      showPhotoStack(Number(dotTrigger.dataset.photoIndex));
    }
  },
  true
);

showPhotoStack(photoIndex);

const addTapFeedback = (selector, className) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener("click", () => {
      element.classList.remove(className);
      void element.offsetWidth;
      element.classList.add(className);
      window.setTimeout(() => element.classList.remove(className), 360);
    });
  });
};

addTapFeedback(".project-case", "tap-lift");
addTapFeedback(".profile-card, .profile-tags span, .profile-metrics div", "tap-highlight");

const revealTargets = [
  ".hero-copy",
  ".profile-card",
  ".section-heading",
  ".section-lead",
  ".about-grid article",
  ".skills-board article",
  ".experience-card",
  ".project-case",
  ".project-insights article",
  ".contact-card",
];

document.querySelectorAll(revealTargets.join(",")).forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];

const updateScrollUI = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  if (progress) {
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, ratio))})`;
  }

  const current = sections
    .map((section) => ({ id: section.id, top: Math.abs(section.getBoundingClientRect().top - 96) }))
    .sort((a, b) => a.top - b.top)[0]?.id;

  navItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("href") === `#${current}`);
  });
};

updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);

const tracks = [
  {
    title: "王嘉尔 - Blow",
    src: "assets/jackson-wang-blow.mp3",
    link: "https://open.spotify.com/search/Jackson%20Wang",
  },
  {
    title: "BTS - Butter",
    src: "assets/bts-butter.mp3",
    link: "https://open.spotify.com/search/BTS",
  },
];

const musicWidget = document.querySelector(".music-widget");
const musicToggle = document.querySelector(".music-toggle");
const musicNext = document.querySelector(".music-next");
const trackTitle = document.querySelector("[data-track-title]");
const trackLink = document.querySelector("[data-track-link]");
const audioPlayer = document.querySelector("[data-audio-player]");
let trackIndex = 0;
let isAudioReady = false;

const renderTrack = () => {
  const track = tracks[trackIndex];
  if (trackTitle) trackTitle.textContent = track.title;
  if (trackLink) trackLink.href = track.link;
  if (musicToggle) {
    musicToggle.setAttribute("title", `播放 / 暂停：${track.title}`);
    musicToggle.setAttribute("aria-label", `播放 / 暂停：${track.title}`);
  }
  if (musicNext) {
    musicNext.setAttribute("title", `切换音乐：${tracks[(trackIndex + 1) % tracks.length].title}`);
  }
  if (audioPlayer && audioPlayer.getAttribute("src") !== track.src) {
    audioPlayer.src = track.src;
    audioPlayer.load();
    isAudioReady = false;
  }
};

const playCurrentTrack = async () => {
  if (!audioPlayer) return;
  try {
    await audioPlayer.play();
    musicWidget?.classList.add("is-playing");
    isAudioReady = true;
  } catch {
    musicWidget?.classList.remove("is-playing");
  }
};

musicToggle?.addEventListener("click", () => {
  if (!audioPlayer) return;
  if (audioPlayer.paused) {
    playCurrentTrack();
  } else {
    audioPlayer.pause();
    musicWidget?.classList.remove("is-playing");
  }
});

musicNext?.addEventListener("click", () => {
  trackIndex = (trackIndex + 1) % tracks.length;
  renderTrack();
  playCurrentTrack();
});

audioPlayer?.addEventListener("ended", () => {
  trackIndex = (trackIndex + 1) % tracks.length;
  renderTrack();
  playCurrentTrack();
});

audioPlayer?.addEventListener("pause", () => {
  if (!audioPlayer.ended) {
    musicWidget?.classList.remove("is-playing");
  }
});

renderTrack();
