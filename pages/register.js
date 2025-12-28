document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const msg = document.getElementById("msg");

  // get geolocation automatically
  navigator.geolocation?.getCurrentPosition(
    pos => { window.autoLocation = `${pos.coords.latitude},${pos.coords.longitude}`; },
    () => { window.autoLocation = ""; }
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      type: document.getElementById("type").value,
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      location: window.autoLocation || "",
      phone: document.getElementById("phone").value,
      vehicle_type: document.getElementById("vehicle").value,
      created_at: new Date().toISOString()
    };

    if (!data.type) {
      msg.textContent = "Please select a type!";
      return;
    }

    // Save in localStorage as a fake "database"
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(u => u.email === data.email)) {
      msg.textContent = "Email already registered!";
      return;
    }

    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));

    msg.textContent = "Registered successfully! Redirecting to login...";
    form.reset();

    // redirect after 1s
    setTimeout(() => window.location.href = "login.html", 1000);
  });
});
