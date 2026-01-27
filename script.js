// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// --- 1. CANVAS PARTICLE SYSTEM (Background) ---
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let width, height;
let mouse = { x: null, y: null, radius: 150 };

// Resize Canvas
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    window.innerHeight
  );
}
window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
resize();

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around screen
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize Particles
function initParticles() {
  particles = [];
  const particleCount = Math.floor(window.innerWidth / 10); // Responsive density
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
initParticles();

// Animation Loop
function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  // Draw Connections (Constellation effect)
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    p1.update();
    p1.draw();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1000})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    // Mouse Interaction
    if (mouse.x != null) {
      const dx = p1.x - mouse.x;
      const dy = p1.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const forceDirectionX = dx / dist;
        const forceDirectionY = dy / dist;
        const force = (mouse.radius - dist) / mouse.radius;
        const directionX = forceDirectionX * force * 3; // Push strength
        const directionY = forceDirectionY * force * 3;

        // Repel particles slightly
        p1.x += directionX;
        p1.y += directionY;

        // Draw connection to mouse
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 - dist / mouse.radius})`; // Cyan connection
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

// --- 2. THEME SWITCHING ---
const themeBtn = document.getElementById("theme-btn");
const body = document.body;
const icon = themeBtn.querySelector("i");

themeBtn.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");

  // Simple Toggle: Default <-> Purple
  if (currentTheme === "default") {
    body.setAttribute("data-theme", "purple");
    // Visual feedback
    gsap.to(".bg-glow", {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        gsap.to(".bg-glow", { opacity: 0.15, duration: 0.5 });
      },
    });
  } else {
    body.setAttribute("data-theme", "default");
    gsap.to(".bg-glow", {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        gsap.to(".bg-glow", { opacity: 0.15, duration: 0.5 });
      },
    });
  }
});

// --- 3. DYNAMIC HERO TYPING EFFECT ---
const phrases = ["Full Stack Developer", "Ingeniero de Software"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 100;
const deleteSpeed = 50;
const pauseTime = 2000;
const subtitleElement = document.querySelector(".hero-subtitle");

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    subtitleElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    subtitleElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Finished typing
    isDeleting = true;
    setTimeout(typeEffect, pauseTime);
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeEffect, 500);
  } else {
    setTimeout(typeEffect, isDeleting ? deleteSpeed : typeSpeed);
  }
}
// Start typing effect
setTimeout(typeEffect, 1000);

// --- 3.5 NAVBAR SCROLL EFFECT ---
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// --- 4. INNOVATIVE SECTION REVEALS (ROBUST) ---

// Headers
gsap.utils.toArray(".section-header").forEach((header) => {
  gsap.fromTo(
    header,
    { x: -50, opacity: 0 },
    {
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    }
  );
});

// --- 5. INFINITE SCROLL (STACK) ---
const scrollers = document.querySelectorAll(".scroller");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", "true");

    const scrollerInner = scroller.querySelector(".scroller-inner");
    constscrollerContent = Array.from(scrollerInner.children);

    // Clone items for infinite loop
    constscrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", "true");
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

// --- 6. ADVANCED TIMELINE ANIMATIONS ---
const timeline = document.querySelector(".timeline");
const progressLine = document.querySelector(".timeline-progress");

// Animate Progress Bar Height
gsap.to(progressLine, {
  height: "100%",
  scrollTrigger: {
    trigger: timeline,
    start: "top 60%",
    end: "bottom 60%",
    scrub: 1, // Smooth lighting up related to scroll
  },
  ease: "none",
});

// Animate Timeline Items (Active State + Reveal)
const tItems = document.querySelectorAll(".timeline-item");
tItems.forEach((item, i) => {
  // 1. Reveal Animation
  gsap.fromTo(
    item,
    { x: -50, opacity: 0 },
    {
      scrollTrigger: { trigger: item, start: "top 85%" },
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    }
  );

  // 2. Active Dot State (Lights up when passed)
  ScrollTrigger.create({
    trigger: item,
    start: "top 55%", // Center-ish
    end: "bottom 55%",
    onEnter: () => item.classList.add("active"),
    onLeaveBack: () => item.classList.remove("active"),
  });
});

// Projects (Batch) - Keeping previous robust logic
ScrollTrigger.batch(".project-card", {
  onEnter: (batch) =>
    gsap.fromTo(
      batch,
      { y: 60, scale: 0.9, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        overwrite: true,
      }
    ),
  start: "top 90%",
});

// Vanilla Tilt (Subtle)
VanillaTilt.init(document.querySelector(".hero-image"), {
  max: 5, // Reduced from 15 for subtle movement
  speed: 800, // Slower transition
  glare: true,
  "max-glare": 0.1, // Very subtle glare
  scale: 1.02, // Slight scale on hover
});

document.getElementById("year").textContent = new Date().getFullYear();

// --- 7. PROJECT MODAL & GALLERY SYSTEM ---

// Project Data source
const projectsData = {
  SAVELIFE: {
    title: "SAVELIFE",
    tag: "HealthTech",
    description:
      "Sistema integral para la automatización de farmacias y gestión de recetas médicas. Soluciona el problema de errores en la prescripción manual y la falta de trazabilidad en el inventario. Incluye módulos para médicos, farmacéuticos y administradores, con generación de recetas electrónicas seguras.",
    repo: "https://github.com/Aresx12/SISTEMA-DE-GESTION-DE-MEDICA.git",
    images: [
      "assets/SaveLife-Logo.png",
      "assets/Savelife-dashboard.png",
      "assets/Savelife-login.png",
      "assets/Savelife-modal.png",
      "assets/Savelife-receta-electronica.png",
    ],
    stack: [
        "ri-angularjs-fill", 
        "ri-code-s-slash-line", // TS
        "ri-paint-brush-line", // Tailwind
        "ri-nodejs-line", // Node.js (Font Icon)
        "ri-database-2-line", 
        "ri-git-merge-line"
    ],
  },
  Medinova: {
    title: "Medinova",
    tag: "Gestión Administrativa",
    description:
      "Plataforma de gestión de citas médicas diseñada para optimizar el flujo de pacientes en clínicas. Permite agendamiento automatizado, recordatorios, y gestión de historiales clínicos básicos. Enfocado en reducir el ausentismo y mejorar la experiencia del paciente.",
    repo: "https://github.com/Aresx12/GESTION-DE-CITAS.git",
    images: [
      "assets/Medinova-logo.png",
      "assets/Medinova-Home.png",
      "assets/Medinova-Login.png",
    ],
    stack: [
        "ri-html5-fill",
        "ri-code-s-slash-line", // TS
        "ri-nodejs-line", // Node.js (Font Icon)
        "ri-server-line", // Express
        "ri-database-fill", // SQL Server
        "ri-git-merge-line",
        "ri-send-plane-fill" // Postman
    ],
  },
};

// Elements
const modal = document.getElementById("project-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalTag = document.getElementById("modal-tag");
const modalDesc = document.getElementById("modal-desc");
const modalRepo = document.getElementById("modal-repo");
const modalStack = document.getElementById("modal-stack");
const galleryDots = document.getElementById("gallery-dots");

let currentProject = null;
let currentImgIndex = 0;

// Open Modal Logic
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => {
    // Identify Project title from the card
    const title = card.querySelector("h3").textContent.trim();
    const data = projectsData[title];

    if (data) {
      currentProject = data;
      currentImgIndex = 0;
      loadModalData(data);
      openModal();
    }
  });

  // Prevent clicking links inside card from bubbling to card click
  const links = card.querySelectorAll("a");
  links.forEach((link) =>
    link.addEventListener("click", (e) => e.stopPropagation())
  );
});

function loadModalData(data) {
  modalTitle.textContent = data.title;
  modalTag.textContent = data.tag;
  modalDesc.textContent = data.description;
  modalRepo.href = data.repo;

  // Stack Icons
  modalStack.innerHTML = data.stack
    .map((item) => {
      if (item.includes("assets/")) {
        return `<img src="${item}" alt="Tech" class="icon-svg-mimic">`;
      }
      return `<i class="${item}"></i>`;
    })
    .join("");

  // Load Initial Images Stack
  const stackContainer = document.querySelector(".gallery-stack");
  stackContainer.innerHTML = "";
  stackContainer.style.setProperty("--n", currentProject.images.length);

  currentProject.images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("gallery-item");
    img.dataset.index = i;
    // Initial state: 0 is active
    if (i === 0) img.classList.add("active");
    else if (i === 1) img.classList.add("next");
    else if (i === currentProject.images.length - 1) img.classList.add("prev");
    
    stackContainer.appendChild(img);
  });
  
  updateDots(0);
}

function updateGallery(newIndex) {
  if (!currentProject) return;
  
  const imgs = document.querySelectorAll(".gallery-item");
  const total = currentProject.images.length;

  // Wrap index
  if (newIndex < 0) newIndex = total - 1;
  if (newIndex >= total) newIndex = 0;
  
  currentImgIndex = newIndex;
  
  // Update Classes based on new Active Index
  imgs.forEach((img, i) => {
      img.className = "gallery-item"; // Reset
      
      if (i === newIndex) {
          img.classList.add("active");
      } else if (i === (newIndex + 1) % total) {
          img.classList.add("next");
      } else if (i === (newIndex - 1 + total) % total) {
          img.classList.add("prev");
      }
      // Others remain hidden/default
  });

  updateDots(newIndex);
}

function updateDots(index) {
    document.querySelectorAll(".gallery-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
}

function openModal() {
  modal.classList.add("open");
  document.body.style.overflow = "hidden"; // Lock Scroll
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = ""; // Unlock Scroll
}

// Controls
document.querySelector(".modal-close").addEventListener("click", closeModal);
document.querySelector(".modal-backdrop").addEventListener("click", closeModal);

document.querySelector(".gallery-btn.prev").addEventListener("click", () => {
  updateGallery(currentImgIndex - 1);
});
document.querySelector(".gallery-btn.next").addEventListener("click", () => {
  updateGallery(currentImgIndex + 1);
});

// Keyboard Nav
document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("open")) return;

  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") updateGallery(currentImgIndex - 1);
  if (e.key === "ArrowRight") updateGallery(currentImgIndex + 1);
});
