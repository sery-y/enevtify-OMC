const createBtn = document.getElementById("createBtn")
const form = document.getElementById("createForm")
const saveBtn = document.getElementById("saveEvent")
const container = document.querySelector(".event-container")
const daysInput = document.getElementById("daysNumber")
const agendaContainer = document.getElementById("agendaContainer")

// Function to add shift rows
function addShift(containerId) {
    const container = document.getElementById(containerId);
    const daysNumber = parseInt(document.getElementById("daysNumber").value) || 3;

    let dayOptions = '<option value="">Day</option>';
    for (let i = 1; i <= daysNumber; i++) {
        dayOptions += `<option value="day${i}">Day ${i}</option>`;
    }

    const row = document.createElement("div");
    row.className = "shift-row";
    row.innerHTML = `
        <select class="shift-day">
            ${dayOptions}
        </select>
        <select class="shift-time">
            <option value="">Shift</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="full">Full day</option>
        </select>
        <button type="button" onclick="this.parentElement.remove()" 
            style="background:none;border:none;color:#e74c3c;font-size:18px;cursor:pointer;">×</button>
    `;
    container.appendChild(row);
}

createBtn.addEventListener("click", () => {

    form.style.display = "block"

})

// Add event listener for the static edit button
const staticEditBtn = document.querySelector(".event-overview .edit-btn")
if (staticEditBtn) {
    staticEditBtn.addEventListener("click", () => {
        // Populate with static event data
        document.getElementById("eventName").value = "Ideathon"
        document.getElementById("eventDescription").value = "************"
        document.getElementById("eventDay").value = "2026-03-06"
        document.getElementById("eventTime").value = "17:00"
        document.getElementById("eventType").value = "External" // Assuming default
        document.getElementById("participants").value = "" // Not specified in static
        document.getElementById("staff").value = "" // Not specified
        document.getElementById("mentor").value = "" // Not specified
        document.getElementById("daysNumber").value = "3"

        // Trigger the days input change to create agenda fields
        document.getElementById("daysNumber").dispatchEvent(new Event('input'))

        // For now, leave agenda empty or add some default data
        setTimeout(() => {
            // Could populate with default agenda if needed
        }, 100)

        form.style.display = "block"
    })
}


daysInput.addEventListener("input", () => {

    agendaContainer.innerHTML = ""

    const days = daysInput.value

    for (let i = 1; i <= days; i++) {

        const block = document.createElement("div")

        block.classList.add("agenda-day")

        block.innerHTML = `

            <h4>Day ${i}</h4>

            <input
                type="text"
                class="dayTitle"
                placeholder="Title"
            >

            <textarea
                class="dayDesc"
                placeholder="Description"
            ></textarea>

        `

        agendaContainer.appendChild(block)

    }

})


saveBtn.addEventListener("click", () => {

    const name = document.getElementById("eventName").value
    const date = document.getElementById("eventDay").value
    const time = document.getElementById("eventTime").value
    const type = document.getElementById("eventType").value
    const participants = document.getElementById("participants").value
    const staff = document.getElementById("staff").value
    const mentor = document.getElementById("mentor").value
    const days = document.getElementById("daysNumber").value


    const titles = document.querySelectorAll(".dayTitle")
    const descs = document.querySelectorAll(".dayDesc")

    let agendaHTML = ""
    let agendaData = []

    titles.forEach((title, index) => {

        agendaHTML += `

            <p><strong>Day ${index + 1}:</strong> ${title.value}</p>
            <p>${descs[index].value}</p>

        `

        agendaData.push({
            title: title.value,
            description: descs[index].value
        })

    })



    const eventBox = document.createElement("div")

    eventBox.classList.add("event-box")


    eventBox.innerHTML = `

    <h2>Event Overview</h2>

    <p><strong>Event Name:</strong> ${name}</p>
    <p><strong>Participants:</strong> ${participants}</p>
    <p><strong>Date & time:</strong> ${date} , ${time}</p>
    <p><strong>Number of days:</strong> ${days} days</p>
    <div class="event-actions">
        <button class="edit-btn">Edit event</button>
        <button class="delete-btn">Delete event</button>
    </div>
`
    // Store agenda data on the event box for later editing
    eventBox.agendaData = agendaData
    eventBox.eventData = {
        name, date, time, type, participants, staff, mentor, days
    }
    container.appendChild(eventBox)
    form.style.display = "none"

    const deleteBtn = eventBox.querySelector(".delete-btn")
    deleteBtn.addEventListener("click", () => {

        eventBox.remove()

    })
    const editBtn = eventBox.querySelector(".edit-btn")
    editBtn.addEventListener("click", () => {
        // Populate basic event data
        document.getElementById("eventName").value = eventBox.eventData.name
        document.getElementById("eventDay").value = eventBox.eventData.date
        document.getElementById("eventTime").value = eventBox.eventData.time
        document.getElementById("eventType").value = eventBox.eventData.type
        document.getElementById("participants").value = eventBox.eventData.participants
        document.getElementById("staff").value = eventBox.eventData.staff
        document.getElementById("mentor").value = eventBox.eventData.mentor
        document.getElementById("daysNumber").value = eventBox.eventData.days

        // Trigger the days input change to create agenda fields
        document.getElementById("daysNumber").dispatchEvent(new Event('input'))

        // Populate agenda data after a short delay to ensure fields are created
        setTimeout(() => {
            const titles = document.querySelectorAll(".dayTitle")
            const descs = document.querySelectorAll(".dayDesc")

            eventBox.agendaData.forEach((day, index) => {
                if (titles[index] && descs[index]) {
                    titles[index].value = day.title
                    descs[index].value = day.description
                }
            })
        }, 100)

        eventBox.remove()
        form.style.display = "block"
    })

})