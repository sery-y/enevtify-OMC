const list = document.querySelector(".registration-list")
const detailsBox = document.getElementById("userDetails")
const roleFilter = document.getElementById("roleFilter")
let registrations = JSON.parse(localStorage.getItem("registrations")) || []

function renderRegistrations(data){
    list.innerHTML = ""
    data.forEach((user,index)=>{
        const card = document.createElement("div")
        card.classList.add("registration-card")
        card.innerHTML = `
            <div class="reg-info">
                <p><strong>Registration date</strong></p>
                <p>${user.registrationDate}</p>
            </div>
            <div class="reg-info">
                <p><strong>User</strong></p>
                <p>${user.firstName} ${user.lastName}</p>
            </div>
            <div class="reg-actions">
                <button class="approve-btn">Approve</button>
                <button class="reject-btn">Reject</button>
                <button class="details-btn">View details</button>

            </div>
        `
        list.appendChild(card)
        card.querySelector(".details-btn").addEventListener("click",()=>{
            showDetails(user)
        })
        card.querySelector(".approve-btn").addEventListener("click",()=>{
            card.style.borderLeft = "5px solid green"
        })
        card.querySelector(".reject-btn").addEventListener("click",()=>{
            card.style.borderLeft = "5px solid red"
        })
    })
}



function showDetails(user){
    detailsBox.style.display = "block"
    detailsBox.innerHTML = `
        <h3>User details</h3>
        <div class="details-grid">
            <p>First Name</p>
            <p>${user.firstName}</p>
            <p>Last Name</p>
            <p>${user.lastName}</p>
            <p>Email</p>
            <p>${user.email}</p>
            <p>Discord</p>
            <p>${user.discordUsername}</p>
            <p>University</p>
            <p>${user.university || "-"}</p>
            <p>Field</p>
            <p>${user.fieldOfStudy}</p>
            <p>Role</p>
            <p>${user.role}</p>
        </div>
        <div class="details-actions">
            <button class="approve-btn">Approve</button>
            <button class="reject-btn">Reject</button>
        </div>

    `
}

roleFilter.addEventListener("change",()=>{
    const role = roleFilter.value
    if(role === "all"){
        renderRegistrations(registrations)
    }else{
        const filtered = registrations.filter(r => r.role === role)
        renderRegistrations(filtered)

    }

})

document.addEventListener("click",(e)=>{
    if(!detailsBox.contains(e.target) && !e.target.classList.contains("details-btn")){
        detailsBox.style.display = "none"

    }

})
renderRegistrations(registrations)