document.addEventListener("DOMContentLoaded", () => {

  // --- FAKE DATA ---
  let waitList = JSON.parse(localStorage.getItem("waitList") || "[]");
  if(waitList.length===0){
    waitList = Array.from({length:10}, (_, i)=>({
      name: `User ${i+1}`,
      type: i%2===0 ? "user" : "mechanic",
      email: `user${i+1}@example.com`,
      phone: `+2010${Math.floor(1000000 + Math.random()*8999999)}`,
      vehicle_type: ["BMW M3","Kia 4 GT Line","Embraer MG7 Trophy","Audi RS7"][i%4],
      created_at: new Date().toLocaleString()
    }));
    localStorage.setItem("waitList", JSON.stringify(waitList));
  }

  let reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  if(reviews.length===0){
    reviews = Array.from({length:10}, (_, i)=>({
      mechanic: `Mechanic ${i+1}`,
      reviewer: `User ${i+1}`,
      rating: Math.floor(Math.random()*5)+1,
      comment: `Great service by Mechanic ${i+1}!`,
      date: new Date().toLocaleDateString()
    }));
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }

  const approvalListDiv = document.getElementById("approval-list");
  const reviewsListDiv = document.getElementById("reviews-list");

  function loadApproval(){
    approvalListDiv.innerHTML = "";
    waitList.forEach((u,i)=>{
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <b>${u.name}</b> (${u.type}) - ${u.email}<br>
        Phone: ${u.phone} <br>
        Vehicle: ${u.vehicle_type}<br>
        <button class="approve-btn">Approve</button>
        <button class="block-btn">Block</button>
      `;
      div.querySelector(".approve-btn").addEventListener("click", ()=>{
        alert(`${u.name} approved!`);
        waitList.splice(i,1);
        localStorage.setItem("waitList", JSON.stringify(waitList));
        loadApproval();
      });
      div.querySelector(".block-btn").addEventListener("click", ()=>{
        alert(`${u.name} blocked!`);
        waitList.splice(i,1);
        localStorage.setItem("waitList", JSON.stringify(waitList));
        loadApproval();
      });
      approvalListDiv.appendChild(div);
    });
  }

  function loadReviews(){
    reviewsListDiv.innerHTML = "";
    reviews.forEach(r=>{
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <b>Mechanic:</b> ${r.mechanic} <br>
        <b>Reviewer:</b> ${r.reviewer} <br>
        <b>Rating:</b> ${r.rating}/5 <br>
        <b>Comment:</b> ${r.comment} <br>
        <b>Date:</b> ${r.date}
      `;
      reviewsListDiv.appendChild(div);
    });
  }

  loadApproval();
  loadReviews();

  // --- NAV ---
  const navBtns = document.querySelectorAll(".nav-btn");
  const tabs = document.querySelectorAll(".tab");

  navBtns.forEach(btn => {
    btn.addEventListener("click", ()=>{
      navBtns.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      tabs.forEach(t=>t.style.display="none");
      document.getElementById(`${btn.dataset.tab}-tab`).style.display="block";
      if(btn.dataset.tab==="approval") loadApproval();
      if(btn.dataset.tab==="reviews") loadReviews();
    });
  });

});
