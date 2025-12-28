document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const type = document.getElementById("type").value;
    const password = document.getElementById("password").value.trim();

    if (!type) {
      msg.textContent = "Please select a type!";
      return;
    }

    // Simple frontend-only check
    if (type === "user") {
      msg.textContent = "Redirecting to User Home...";
      setTimeout(() => window.location.href = "home_user.html", 500);
    } else if (type === "mec") {
      if (email.includes(".admin@")) {
        msg.textContent = "Redirecting to Admin Home...";
        setTimeout(() => window.location.href = "home_admin.html", 500);
      } else {
        msg.textContent = "Redirecting to Mechanic Home...";
        setTimeout(() => window.location.href = "home_mechanic.html", 500);
      }
    } else {
      msg.textContent = "Invalid type!";
    }
  });
});
