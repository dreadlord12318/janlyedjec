// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

menuBtn?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("show");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  mobileNav.setAttribute("aria-hidden", String(!isOpen));
});

// Close mobile menu on link click
mobileNav?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    mobileNav.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
  });
});

// Year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Project filter
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const selected = btn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    projectCards.forEach(card => {
      const type = card.dataset.type;
      const show = selected === "all" || selected === type;
      card.style.display = show ? "flex" : "none";
    });
  });
});


// ---- Project Modal Carousel ----
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const modalThumbs = document.getElementById("modalThumbs");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");

let slides = []; // [{src, caption}]
let currentIndex = 0;

function parseGallery(str) {
  // "img|caption;img|caption"
  return (str || "")
    .split(";")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const [src, caption] = item.split("|");
      return { src: (src || "").trim(), caption: (caption || "").trim() };
    })
    .filter(x => x.src);
}

function setSlide(index) {
  if (!slides.length) return;

  currentIndex = (index + slides.length) % slides.length;
  const slide = slides[currentIndex];

  modalImg.src = slide.src;
  modalCaption.textContent = slide.caption || "";

  // highlight thumbs
  modalThumbs.querySelectorAll("button").forEach((btn, i) => {
    btn.classList.toggle("active", i === currentIndex);
  });

  const showNav = slides.length > 1;
  modalPrev.style.display = showNav ? "block" : "none";
  modalNext.style.display = showNav ? "block" : "none";
}

function openModal({ title, desc, gallery }) {
  slides = gallery;
  currentIndex = 0;

  modalTitle.textContent = title || "Project Preview";
  modalDesc.textContent = desc || "";

  modalThumbs.innerHTML = "";

  slides.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.addEventListener("click", () => setSlide(i));

    const img = document.createElement("img");
    img.src = s.src;
    img.alt = s.caption ? s.caption : `Preview ${i + 1}`;
    b.appendChild(img);

    modalThumbs.appendChild(b);
  });

  setSlide(0);

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".thumb-btn").forEach((btn) => {
  // Set card thumbnail from first slide
  const gallery = parseGallery(btn.dataset.gallery);
  if (gallery[0]) btn.style.backgroundImage = `url('${gallery[0].src}')`;

  btn.addEventListener("click", () => {
    const title = btn.dataset.title;
    const desc = btn.dataset.desc;
    const g = gallery.length ? gallery : [{ src: "assets/project-1.png", caption: "" }];
    openModal({ title, desc, gallery: g });
  });
});

// close backdrop / close button
modal?.addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "true") closeModal();
});

modalPrev?.addEventListener("click", () => setSlide(currentIndex - 1));
modalNext?.addEventListener("click", () => setSlide(currentIndex + 1));

// keyboard
document.addEventListener("keydown", (e) => {
  if (!modal || !modal.classList.contains("show")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") setSlide(currentIndex - 1);
  if (e.key === "ArrowRight") setSlide(currentIndex + 1);
});