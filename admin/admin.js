const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/cms"
    : "https://portfolio-backend-b7en.onrender.com/api/cms";

const token = localStorage.getItem("token");

async function fetchCMS() {
  const res = await fetch(`${API_BASE}/content`);
  if (!res.ok) {
    throw new Error("Failed to fetch CMS content");
  }
  return await res.json();
}


/* ===============================
   AUTH GUARD
================================ */
if (!token) {
  window.location.href = "login.html";
}

/* ===============================
   COMMON FETCH HELPERS
================================ */
async function apiRequest(url, method, body = null) {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  const options = { method, headers };

  if (body) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  // 🔑 IMPORTANT FIX
  if (res.status === 204) return {};
  if (!res.headers.get("content-type")) return {};

  return await res.json();
}



/* ===============================
   SKILLS MANAGEMENT
================================ */
async function addSkill() {
  const categoryTitle = document.getElementById("skill-category").value;
  const name = document.getElementById("skill-name").value.trim();

  if (!name) return alert("Enter skill");

  // 1. Get categories from CMS
  const cms = await fetchCMS();

  // 2. Find category UUID by title
  const category = cms.skillCategories.find(
    c => c.title === categoryTitle
  );

  if (!category) {
    alert("Skill category not found in database");
    return;
  }

  // 3. Send UUID (NOT title)
  await apiRequest(`${API_BASE}/skills`, "POST", {
    category_id: category.id,
    name
  });

  document.getElementById("skill-name").value = "";
  loadSkills();
}



async function loadSkills() {
  const cms = await fetchCMS();
  const container = document.getElementById("skills-list");
  if (!container) return;

  container.innerHTML = "";

  cms.skillCategories.forEach(cat => {
    const block = document.createElement("div");
    block.innerHTML = `<strong>${cat.title}</strong>`;

    (cat.items || []).forEach(skill => {
      const row = document.createElement("div");
      row.innerHTML = `
        ${skill.name}
        <button onclick="deleteSkill('${skill.id}')">❌</button>
      `;
      block.appendChild(row);
    });

    container.appendChild(block);
  });
}


async function deleteSkill(skillId) {
  await apiRequest(`${API_BASE}/skills/${skillId}`, "DELETE");
  loadSkills();
}


/* ===============================
   HERO MANAGEMENT
================================ */
async function updateHero() {
  const name = document.getElementById("hero-name").value;
  const title = document.getElementById("hero-title").value;
  const tagline = document.getElementById("hero-tagline").value;

  if (!name || !title || !tagline) {
    alert("Please fill all hero fields");
    return;
  }

  const res = await fetch(`${API_BASE}/hero`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, title, tagline })
  });

  const data = await res.json();
  alert(data.message || "Hero section updated");
}


/* ===============================
   PROJECTS MANAGEMENT
================================ */

async function loadProjects() {
  const cms = await fetchCMS();
  const container = document.getElementById("projects-list");
  if (!container) return;

  container.innerHTML = "";

  (cms.projects || []).forEach(project => {
    const div = document.createElement("div");
    div.className = "cms-item";
    div.innerHTML = `
      <strong>${project.title}</strong>
      <button onclick="deleteProject('${project.id}')">❌</button>
    `;
    container.appendChild(div);
  });
}

async function addProject() {
  const title = document.getElementById("project-title").value.trim();
  const toolsRaw = document.getElementById("project-tools").value;
  const description = document.getElementById("project-description").value.trim();
  const imageFile = document.getElementById("project-image").files[0];
  const link = document.getElementById("project-link").value.trim();

  if (!title || !description) {
    alert("Project title and description are required");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("link", link);

  if (toolsRaw) {
    formData.append("tools", toolsRaw); // backend will split
  }

  if (imageFile) {
    // optional client-side validation
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(imageFile.type)) {
      alert("Only PNG, JPG, and JPEG images are allowed");
      return;
    }
    formData.append("image", imageFile);
  }

  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Failed to add project");
    return;
  }

  alert("Project added successfully");

  // reset form
  document.getElementById("project-title").value = "";
  document.getElementById("project-tools").value = "";
  document.getElementById("project-description").value = "";
  document.getElementById("project-image").value = "";
  document.getElementById("project-link").value = "";

  loadProjects();
}

async function deleteProject(id) {
  if (!confirm("Are you sure you want to delete this project?")) return;

  console.log("Deleting project:", id);

  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    // ignore empty response
  }

  if (!res.ok) {
    alert(data.message || "Failed to delete project");
    return;
  }

  alert("Project deleted");
  loadProjects();
}


/* ===============================
   EXPERIENCE MANAGEMENT
================================ */
async function loadExperience() {
  const cms = await fetchCMS();
  const container = document.getElementById("experience-list");
  if (!container) return;

  container.innerHTML = "";

  cms.experience.forEach(exp => {
    const div = document.createElement("div");
    div.className = "cms-item";
    div.innerHTML = `
      <strong>${exp.company}</strong> – ${exp.designation}
      <button onclick="deleteExperience('${exp.id}')">❌</button>
    `;
    container.appendChild(div);
  });
}

async function addExperience() {
  const company = document.getElementById("exp-company").value.trim();
  const designation = document.getElementById("exp-designation").value.trim();
  const from = document.getElementById("exp-from").value;
  const to = document.getElementById("exp-to").value;
  const responsibilitiesRaw =
    document.getElementById("exp-responsibilities").value;
  const logoFile = document.getElementById("exp-logo").files[0];

  if (!company || !designation) {
    alert("Company and designation are required");
    return;
  }

  const formData = new FormData();
  formData.append("company", company);
  formData.append("designation", designation);
  formData.append("from", from);
  formData.append("to", to);
  formData.append("responsibilities", responsibilitiesRaw);

  if (logoFile) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(logoFile.type)) {
      alert("Only PNG, JPG, and JPEG images are allowed");
      return;
    }
    formData.append("logo", logoFile);
  }

  const res = await fetch(`${API_BASE}/experience`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
      // ❌ DO NOT set Content-Type
    },
    body: formData
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Failed to add experience");
    return;
  }

  alert("Experience added successfully");
  loadExperience();
}



async function deleteExperience(id) {
  await apiRequest(`${API_BASE}/experience/${id}`, "DELETE");
  loadExperience();
}




/* ===============================
   EDUCATION MANAGEMENT
================================ */
async function loadEducation() {
  const cms = await fetchCMS();
  const container = document.getElementById("education-list");
  if (!container) return;

  container.innerHTML = "";

  (cms.education || []).forEach(edu => {
    const div = document.createElement("div");
    div.className = "cms-item";
    div.innerHTML = `
      <strong>${edu.institute}</strong> – ${edu.degree}
      <button onclick="deleteEducation('${edu.id}')">❌</button>
    `;
    container.appendChild(div);
  });
}

async function addEducation() {
  const formData = new FormData();
  formData.append("institute", document.getElementById("edu-institute").value);
  formData.append("degree", document.getElementById("edu-degree").value);
  formData.append("year", document.getElementById("edu-year").value);
  formData.append("description", document.getElementById("edu-description").value);

  const imageFile = document.getElementById("edu-image").files[0];
  if (imageFile) formData.append("image", imageFile);

  await fetch(`${API_BASE}/education`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  loadEducation();
}


async function deleteEducation(id) {
  await apiRequest(`${API_BASE}/education/${id}`, "DELETE");
  loadEducation();
}



window.deleteProject = deleteProject;



/* ===============================
   INIT BASED ON PAGE
================================ */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("projects-list")) {
    loadProjects();
  }

  if (document.getElementById("skills-list")) {
    loadSkills();
  }

  if (document.getElementById("experience-list")) {
    loadExperience();
  }

  if (document.getElementById("education-list")) {
    loadEducation();
  }
});

