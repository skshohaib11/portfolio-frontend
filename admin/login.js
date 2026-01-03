const API_BASE = "https://portfolio-backend-b7en.onrender.com";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  error.textContent = "";

  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      error.textContent = data.message || "Login failed";
      return;
    }

    // Save token
    localStorage.setItem("token", data.token);

    // Redirect
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    error.textContent = "Server not reachable";
  }
}
