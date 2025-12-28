document.addEventListener("DOMContentLoaded", () => {
  // Fake logged-in user
  let currentUser = JSON.parse(localStorage.getItem("auth")) || {
    email: "user@example.com",
    name: "John Doe",
    phone: "+201012345678",
    vehicle: "BMW M3",
    type: "user"
  };

  // Save to localStorage if not exist
  if(!localStorage.getItem("users")){
    localStorage.setItem("users", JSON.stringify([currentUser]));
  }

  // --- FAKE MECHANICS ---
  const fakeMechanics = Array.from({length:20}, (_, i) => ({
    name: `Mechanic ${i+1}`,
    phone: `+20101${Math.floor(1000000 + Math.random()*8999999)}`,
    vehicle_type: ["BMW M3","Embraer MG7 Trophy","Kia 4 GT Line","Audi RS7","Tesla Model S"][i%5],
    distance: (Math.random()*15+1).toFixed(1)
  }));

  const mechanicListDiv = document.getElementById("mechanic-list");

  fakeMechanics.forEach(m => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <b>${m.name}</b> (${m.vehicle_type}) - ${m.distance} km away
      <br>Phone: ${m.phone}
      <button class="request-btn">Request</button>
      <button class="remove-btn">Remove</button>
    `;
    mechanicListDiv.appendChild(div);

    div.querySelector(".request-btn").addEventListener("click", () => {
      // Save request to localStorage
      const requests = JSON.parse(localStorage.getItem("requests")||"[]");
      requests.push({
        requester: currentUser.name,
        requester_phone: currentUser.phone,
        mechanic: m.name,
        mechanic_phone: m.phone,
        review: "",
        state: "waiting",
        vehicle_type: currentUser.vehicle,
        created_at: new Date().toISOString()
      });
      localStorage.setItem("requests", JSON.stringify(requests));
      alert(`Request sent to ${m.name}. Waiting for acceptance.`);
    });

    div.querySelector(".remove-btn").addEventListener("click", () => div.remove());
  });

  // --- NAV ---
  const navBtns = document.querySelectorAll(".nav-btn");
  const tabs = document.querySelectorAll(".tab");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      navBtns.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      tabs.forEach(t=>t.style.display="none");
      document.getElementById(`${btn.dataset.tab}-tab`).style.display="block";
      if(btn.dataset.tab==="requests") loadRequests();
      if(btn.dataset.tab==="profile") loadProfile();
    });
  });

  // --- REQUESTS TAB ---
  function loadRequests(){
    const requestDiv = document.getElementById("request-list");
    requestDiv.innerHTML = "";
    const allRequests = JSON.parse(localStorage.getItem("requests")||"[]");
    const userRequests = allRequests.filter(r => r.requester===currentUser.name);
    userRequests.forEach(r=>{
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <b>Mechanic:</b> ${r.mechanic} <br>
        <b>Vehicle:</b> ${r.vehicle_type} <br>
        <b>Status:</b> ${r.state} <br>
        <b>Review:</b> ${r.review || "(empty)"} <br>
      `;
      // If accepted, allow adding review
      if(r.state==="accepted" && !r.review){
        const reviewInput = document.createElement("input");
        reviewInput.placeholder = "Write review";
        const saveBtn = document.createElement("button");
        saveBtn.textContent="Save Review";
        saveBtn.addEventListener("click", ()=>{
          r.review = reviewInput.value;
          localStorage.setItem("requests", JSON.stringify(allRequests));
          loadRequests();
        });
        div.appendChild(reviewInput);
        div.appendChild(saveBtn);
      }
      requestDiv.appendChild(div);
    });
  }

  // --- PROFILE TAB ---
  function loadProfile(){
    const form = document.getElementById("profile-form");
    document.getElementById("profile-name").value = currentUser.name;
    document.getElementById("profile-age").value = currentUser.age || "";
    document.getElementById("profile-email").value = currentUser.email;
    document.getElementById("profile-phone").value = currentUser.phone || "";
    document.getElementById("profile-vehicle").value = currentUser.vehicle || "";
  }

  document.getElementById("profile-form").addEventListener("submit", (e)=>{
    e.preventDefault();
    currentUser.name = document.getElementById("profile-name").value;
    currentUser.age = document.getElementById("profile-age").value;
    currentUser.phone = document.getElementById("profile-phone").value;
    currentUser.vehicle = document.getElementById("profile-vehicle").value;

    const users = JSON.parse(localStorage.getItem("users")||"[]");
    const idx = users.findIndex(u=>u.email===currentUser.email);
    if(idx>-1) users[idx]=currentUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("auth", JSON.stringify(currentUser));
    document.getElementById("profile-msg").textContent="Profile updated!";
  });
});
