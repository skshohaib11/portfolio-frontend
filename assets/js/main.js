const API_BASE = "https://portfolio-backend-b7en.onrender.com";
const SERVER_BASE = API_BASE;
const API_URL = `${API_BASE}/api/cms/content`;



function formatMonthYear(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
}


/* ===========================
   HERO
=========================== */
function renderHero(hero) {
  if (!hero) return;

  const nameEl = document.getElementById("site-hero-name");
  const titleEl = document.getElementById("site-hero-title");
  const taglineEl = document.getElementById("site-hero-tagline");

  if (nameEl && hero.name) {
    // Split "Hey, I'm Shohaib Shaikh!"
    const parts = hero.name.split("I'm");
    if (parts.length === 2) {
      nameEl.innerHTML = `
        <span class="hero-greet">${parts[0]}I'm</span>
        <span class="hero-name">${parts[1]}</span>
      `;
    } else {
      nameEl.textContent = hero.name;
    }
  }

  if (titleEl) titleEl.textContent = hero.title;
  if (taglineEl) taglineEl.textContent = hero.tagline;
}



/* ===========================
   EDUCATION
=========================== */
function renderEducation(education) {
  const container = document.getElementById("education-container");
  if (!container) return;

  container.innerHTML = "";

  if (!education.length) {
    container.innerHTML = `<p class="empty-text">Education details coming soon.</p>`;
    return;
  }

  education.forEach(edu => {
    const div = document.createElement("div");
    div.className = "experience-card";

    div.innerHTML = `
      <div class="education-card">

        ${
          edu.image
            ? `
          <div class="education-logo">
            <img 
              src="${SERVER_BASE}${edu.image}" 
              alt="${edu.institute}"
              onerror="this.onerror=null; this.src='assets/icons/default-logo.png';"
            />
          </div>
          `
            : ""
        }

        <div class="education-content">
          <h4>${edu.institute}</h4>
          <p><strong>${edu.degree}</strong></p>
          ${edu.year ? `<p class="duration">${edu.year}</p>` : ""}
          ${edu.description ? `<p>${edu.description}</p>` : ""}
        </div>

      </div>
    `;

    container.appendChild(div);
  });
}



/* ===========================
   CONTACT FORM (EmailJS)
=========================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const messageInput = document.getElementById("contact-message");
  const submitBtn = document.getElementById("contact-submit");
  const statusEl = document.getElementById("contact-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      setStatus("❌ Please fill in all fields.", false);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    emailjs.send(
      "service_88pni8a",
      "YOUR_TEMPLATE_ID",
      {
        name: name,
        email: email,
        message: message
      }
    )
    .then(() => {
      setStatus("✅ Message sent successfully! I’ll get back to you soon.", true);
      form.reset();
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      setStatus("❌ Failed to send message. Please try again.", false);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    });
  });

  function setStatus(text, success) {
    statusEl.textContent = text;
    statusEl.style.marginTop = "12px";
    statusEl.style.textAlign = "center";
    statusEl.style.fontSize = "14px";
    statusEl.style.color = success ? "#00e5ff" : "#ff6b6b";
  }
});





/* ===========================
   SKILLS
=========================== */
function renderSkills(categories) {
  const container = document.getElementById("skills-sections");
  if (!container) return;

  container.innerHTML = "";

  categories.forEach(cat => {
    const section = document.createElement("div");
    section.className = "skill-section";

    section.innerHTML = `
      <h4>${cat.title}</h4>
      <div class="skill-items">
        ${cat.items.map(item => `<span class="skill-chip">${item}</span>`).join("")}
      </div>
    `;

    container.appendChild(section);
  });
}


/* ===========================
   PROJECTS
=========================== */
function renderProjects(projects) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  container.innerHTML = "";

  if (!projects.length) {
    container.innerHTML = `<p class="empty-text">Projects coming soon.</p>`;
    return;
  }

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    const imageHTML = project.image
      ? `<img 
           src="${SERVER_BASE}${project.image}" 
           alt="${project.title}" 
           class="project-image"
         />`
      : "";

    card.innerHTML = `
      ${imageHTML}
      <h4>${project.title}</h4>
      <p>${project.description}</p>
      ${
        project.tools && project.tools.length
          ? `<p class="tools"><strong>Tools:</strong> ${project.tools.join(", ")}</p>`
          : ""
      }
      ${
        project.link
          ? `<a href="${project.link}" target="_blank">View Project</a>`
          : ""
      }
    `;

    container.appendChild(card);
  });
}


/* ===========================
   EXPERIENCE
=========================== */
function renderExperience(experience) {
  const container =
    document.getElementById("experience-container") ||
    document.getElementById("experience-list");

  if (!container) return;

  container.innerHTML = "";

  experience.forEach(exp => {
    const div = document.createElement("div");
    div.className = "experience-card";

    // ✅ FIX: normalize responsibilities BEFORE template
    const responsibilities = Array.isArray(exp.responsibilities)
      ? exp.responsibilities
      : [];

    const logoHTML = exp.logo
      ? `
        <div class="experience-logo">
          <img 
            src="${SERVER_BASE}${exp.logo}" 
            alt="${exp.company}"
            onerror="this.onerror=null; this.src='assets/icons/default-logo.png';"
          />
        </div>
      `
      : "";


    div.innerHTML = `
      ${logoHTML}
      <div class="experience-content">
        <h4>${exp.company}</h4>
        <p><strong>${exp.designation}</strong></p>

        <p class="duration">
          ${formatMonthYear(exp.from)} – ${exp.to ? formatMonthYear(exp.to) : "Present"}
        </p>

        <ul>
          ${responsibilities.map(r => `<li>${r}</li>`).join("")}
        </ul>
      </div>
    `;


    container.appendChild(div);
  });
}



/* ===========================
   NAVBAR SCROLL EFFECT
=========================== */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/* ===========================
   SMOOTH SCROLL
=========================== */
function initSmoothScroll() {
  document.querySelectorAll("nav a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
}



async function loadCMSContent() {
  try {
    const res = await fetch(`${API_BASE}/api/cms/content`);
    if (!res.ok) throw new Error("Failed to load CMS content");

    const data = await res.json();

    renderHero(data.hero);
    renderSkills(data.skillCategories);
    renderProjects(data.projects);
    renderExperience(data.experience);
    renderEducation(data.education);

  } catch (err) {
    console.error("CMS Load Error:", err);
  }
}


/* ===========================
   INIT AFTER DOM LOAD
=========================== */
document.addEventListener("DOMContentLoaded", () => {
  loadCMSContent();
  initNavbar();
  initSmoothScroll();
});


