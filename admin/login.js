const API = "http://localhost:3000/api";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  error.textContent = "";

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      error.textContent = data.message || "Login failed";
      return;
    }

    // ✅ SAVE TOKEN
    localStorage.setItem("token", data.token);

    // ✅ REDIRECT TO DASHBOARD
    window.location.href = "dashboard.html";
  } catch (err) {
    error.textContent = "Server not running";
  }
}
