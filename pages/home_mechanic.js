document.addEventListener("DOMContentLoaded", () => {

  // --- FAKE DATA ---
  let requests = JSON.parse(localStorage.getItem("requests") || "[]");
  if(requests.length===0){
    requests = Array.from({length:10},(_,i)=>({
      user: `User ${i+1}`,
      userPhone: `+2010${Math.floor(1000000+Math.random()*8999999)}`,
      mechanic: `Mechanic 1`,
      mechanicPhone: `+2010111111`,
      vehicle_type: ["BMW M3","Kia 4 GT Line","Embraer MG7 Trophy","Audi RS7"][i%4],
      state: "waiting",
      review: ""
    }));
    localStorage.setItem("requests", JSON.stringify(requests));
  }

  const requestsListDiv = document.getElementById("requests-list");
  const acceptedListDiv = document.getElementById("accepted-list");
  const profileFormDiv = document.getElementById("profile-form");

  function loadRequests(){
    requestsListDiv.innerHTML="";
    requests.filter(r=>r.state==="waiting").forEach((r,i)=>{
      const div=document.createElement("div");
      div.classList.add("card");
      div.innerHTML=`
        <b>${r.user}</b> requested service<br>
        Vehicle: ${r.vehicle_type}<br>
        Phone: ${r.userPhone}<br>
        <button class="approve-btn">Accept</button>
        <button class="deny-btn">Deny</button>
      `;
      div.querySelector(".approve-btn").addEventListener("click", ()=>{
        r.state="accepted";
        localStorage.setItem("requests", JSON.stringify(requests));
        loadRequests();
        loadAccepted();
      });
      div.querySelector(".deny-btn").addEventListener("click", ()=>{
        r.state="denied";
        localStorage.setItem("requests", JSON.stringify(requests));
        loadRequests();
      });
      requestsListDiv.appendChild(div);
    });
  }

  function loadAccepted(){
    acceptedListDiv.innerHTML="";
    requests.filter(r=>r.state==="accepted").forEach((r,i)=>{
      const div=document.createElement("div");
      div.classList.add("card");
      div.innerHTML=`
        <b>${r.user}</b> - Vehicle: ${r.vehicle_type}<br>
        Phone: ${r.userPhone}<br>
        Review: ${r.review || "(none)"}<br>
      `;
      acceptedListDiv.appendChild(div);
    });
  }

  function loadProfile(){
    const mechanic = JSON.parse(localStorage.getItem("mechanicProfile") || '{"name":"Mechanic 1","phone":"+2010111111","email":"mech1@example.com"}');
    profileFormDiv.innerHTML=`
      <label>Name</label>
      <input id="profile-name" value="${mechanic.name}">
      <label>Phone</label>
      <input id="profile-phone" value="${mechanic.phone}">
      <label>Email</label>
      <input id="profile-email" value="${mechanic.email}">
      <button class="save-btn">Save</button>
    `;
    profileFormDiv.querySelector(".save-btn").addEventListener("click", ()=>{
      mechanic.name = document.getElementById("profile-name").value;
      mechanic.phone = document.getElementById("profile-phone").value;
      mechanic.email = document.getElementById("profile-email").value;
      localStorage.setItem("mechanicProfile", JSON.stringify(mechanic));
      alert("Profile saved!");
    });
  }

  loadRequests();
  loadAccepted();
  loadProfile();

  // --- NAV ---
  const navBtns=document.querySelectorAll(".nav-btn");
  const tabs=document.querySelectorAll(".tab");
  navBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      navBtns.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      tabs.forEach(t=>t.style.display="none");
      document.getElementById(`${btn.dataset.tab}-tab`).style.display="block";
    });
  });
});
