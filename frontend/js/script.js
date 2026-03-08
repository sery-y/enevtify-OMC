function startCountdown() {
    const eventDate = new Date("2026-03-10T00:00:00").getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            clearInterval(interval);
            ["days", "hours", "minutes", "seconds"].forEach(id => {
                document.getElementById(id).innerText = "00";
            });
            return;
        }
        const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText    = String(days).padStart(2, '0');
        document.getElementById("hours").innerText   = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    }, 1000);
}

//Security
function sanitizeString(value, { maxLen = 300 } = {}) {
    if (value === null || value === undefined) return "";
    let s = String(value);
    try { s = s.normalize("NFKC"); } catch (e) {}
    s = s.trim();
    s = s.replace(/[\u0000-\u001F\u007F]/g, ""); // control chars
    s = s.replace(/[<>]/g, ""); // reduce XSS risk
    if (s.length > maxLen) s = s.slice(0, maxLen);
    return s;
}

function sanitizeEmail(value) {
    return sanitizeString(value, { maxLen: 200 }).toLowerCase();
}

function sanitizePhone(value) {
    const s = sanitizeString(value, { maxLen: 12 });
    return s.replace(/[^0-9+\-() ]/g, "");
}

function safeGetQueryParam(name, allowedValues = []) {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(name) || "";
    const cleaned = sanitizeString(raw, { maxLen: 200 });

    if (allowedValues.length > 0 && !allowedValues.includes(cleaned)) {
        return null;
    }

    return cleaned;
}



function addShift(containerId) {
    const container = document.getElementById(containerId);
    const row = document.createElement("div");
    row.className = "shift-row";
    row.innerHTML = `
        <select class="shift-day">
            <option value="">Day</option>
            <option value="day1">Day 1</option>
            <option value="day2">Day 2</option>
            <option value="day3">Day 3</option>
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
//Form
document.addEventListener("DOMContentLoaded", function () {

    startCountdown();

    // Elements
    const roleSelect = document.getElementById("roleSelect");
    const emailInput = document.getElementById("emailInput");

    const form1   = document.getElementById("form1");
    const form2   = document.getElementById("form2");
    const form3   = document.getElementById("form3");
    const form4   = document.getElementById("form4");
    const final   = document.getElementById("final");
    const otpForm = document.getElementById("otpForm");

    const steps = document.querySelectorAll(".step");

    let currentRole = "participant";
    let registrationPayload = null;

    document.querySelectorAll("input, select").forEach(field => {
        field.addEventListener("input", function () {
            this.classList.remove("input-error");            // retire la bordure rouge
            const next = this.nextElementSibling;
            if (next && next.classList.contains("error-msg")) next.remove(); // retire le texte d'erreur
        });
    });


    // Discord ID to role mapping (replace with real Discord API integration later)
    const discordRoleMapping = {
        "user123": "staff",
        "mentor456": "mentor", 
        "staff789": "staff",
        "admin999": "mentor"
        // Add more Discord ID to role mappings as needed
    };

    // ===== Discord Username → determine role =====
    const discordInput = document.getElementById("discordUsername");
    discordInput.addEventListener("blur", function () {
        const discordId = sanitizeString(discordInput.value);
        const mappedRole = discordRoleMapping[discordId] || "participant";

        roleSelect.innerHTML = `<option value="${mappedRole}">${mappedRole.charAt(0).toUpperCase() + mappedRole.slice(1)}</option>`;
        
        // Update currentRole
        currentRole = mappedRole;
    });

    function hideAll() {
        [form1, form2, form3, form4, final, otpForm].forEach(f => f.style.display = "none");
    }

    function show(el) {
        el.style.display = "block";
    }

    function setStep(index) {
        steps.forEach((s, i) => s.classList.toggle("active", i <= index));
    }


    function validateForm(formEl) {
        formEl.querySelectorAll(".error-msg").forEach(e => e.remove());
        formEl.querySelectorAll(".input-error").forEach(e => e.classList.remove("input-error"));

        const requiredFields = formEl.querySelectorAll("input[required], select[required]");
        let valid = true;

        requiredFields.forEach(field => {
            // Cas spécial radio : vérifie qu'une option est cochée dans le groupe
            if (field.type === "radio") {
                const group = formEl.querySelectorAll(`input[name="${field.name}"]`);
                const checked = [...group].some(r => r.checked);
                if (!checked) {
                    const groupContainer = field.closest(".radio-group");
                    if (groupContainer && !groupContainer.querySelector(".error-msg")) {
                        showError(groupContainer, "Please select an option.");
                    }
                    valid = false;
                }
                return;
            }

            // Champ vide
            if (!field.value.trim()) {
                field.classList.add("input-error");
                showError(field, "This field is required.");
                valid = false;
                return;
            }

            // Built-in constraints (pattern/minlength/maxlength/type=url/email)
            if (field.checkValidity && !field.checkValidity()) {
                field.classList.add("input-error");
                showError(field, field.validationMessage || "Invalid value.");
                valid = false;
            }
        });

        return valid;
    }

     function showError(el, message) {
        const err = document.createElement("span");
        err.className = "error-msg";
        err.textContent = message;
        el.insertAdjacentElement("afterend", err);
    }

    //to step 2
       document.getElementById("next1").addEventListener("click", function () {
        if (!validateForm(form1)) return;

        currentRole = roleSelect.value;
        hideAll();

        if (currentRole === "participant") show(form2);
        else if (currentRole === "mentor")  show(form3);
        else if (currentRole === "staff")   show(form4);

        setStep(1);
    });

    //back to step 1
    ["back2", "back3", "back4"].forEach(id => {
        document.getElementById(id).addEventListener("click", function () {
            hideAll();
            show(form1);
            setStep(0);
        });
    });
    //step 2 to fnal
    //participant 
    document.getElementById("next2").addEventListener("click", function () {
        if (!validateForm(form2)) return;
        hideAll();
        show(final);
        setStep(2);
    });

    //mentor
    document.getElementById("next3").addEventListener("click", function () {
        if (!validateForm(form3)) return;
        hideAll();
        show(final);
        setStep(2);
    });

    //staff
    document.getElementById("next4").addEventListener("click", function () {
        if (!validateForm(form4)) return;
        hideAll();
        show(final);
        setStep(2);
    });

    //back
    document.getElementById("backFinal").addEventListener("click", function () {
        hideAll();

        if (currentRole === "participant") { show(form2); setStep(1); }
        else if (currentRole === "mentor") { show(form3); setStep(1); }
        else if (currentRole === "staff")  { show(form4); setStep(1); }
    });

    // OTP back button
    document.getElementById("backOtp").addEventListener("click", function () {
        hideAll();
        show(final);
        setStep(2);
    });

    // OTP verification
    document.getElementById("verifyOtp").addEventListener("click", function () {
        const otpInputs = ["otp1", "otp2", "otp3", "otp4", "otp5", "otp6"];
        const enteredOtp = otpInputs.map(id => document.getElementById(id).value).join("");
        const correctOtp = localStorage.getItem("currentOtp");

        if (enteredOtp === correctOtp && registrationPayload) {
            // Save registration
            let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
            registrations.push(registrationPayload);
            localStorage.setItem("registrations", JSON.stringify(registrations));
            
            // Clear OTP
            localStorage.removeItem("currentOtp");
            
            alert("Registration completed successfully! Welcome to Eventify! ✔");
            
            // Redirect to admin dashboard (assuming admin.html exists)
            window.location.href = "admin.html";
        } else {
            alert("Invalid OTP. Please try again.");
        }
    });

    // Auto-focus OTP inputs
    document.querySelectorAll(".otp-input").forEach((input, index) => {
        input.addEventListener("input", function() {
            if (this.value.length === 1 && index < 5) {
                document.getElementById(`otp${index + 2}`).focus();
            }
        });
        
        input.addEventListener("keydown", function(e) {
            if (e.key === "Backspace" && this.value.length === 0 && index > 0) {
                document.getElementById(`otp${index}`).focus();
            }
        });
    });
    //submit
document.getElementById("submitFinal").addEventListener("click", function () {

    const payload = {
        firstName: sanitizeString(document.getElementById("firstName").value, { maxLen: 80 }),
        lastName: sanitizeString(document.getElementById("lastName").value, { maxLen: 80 }),
        email: sanitizeEmail(document.getElementById("emailInput").value),
        phone: sanitizePhone(document.getElementById("phone").value),
        discordUsername: sanitizeString(document.getElementById("discordUsername").value, { maxLen: 64 }),
        university: sanitizeString(document.getElementById("university").value, { maxLen: 120 }),
        fieldOfStudy: sanitizeString(document.getElementById("fieldOfStudy").value, { maxLen: 120 }),
        role: sanitizeString(roleSelect.value, { maxLen: 20 }),
        registrationDate: new Date().toLocaleDateString()
    };


    /* Role specific data */

    if (currentRole === "participant") {

        payload.teamName = sanitizeString(document.getElementById("teamName").value, { maxLen: 80 });
        payload.tools = sanitizeString(document.getElementById("tools").value, { maxLen: 200 });
        payload.motivation = sanitizeString(document.getElementById("motivation").value, { maxLen: 300 });
        payload.expectations = sanitizeString(document.getElementById("expectations").value, { maxLen: 300 });
        payload.mainSkills = sanitizeString(document.getElementById("mainSkills").value, { maxLen: 200 });
        payload.skillLevel = sanitizeString(document.getElementById("skillLevelSelect").value, { maxLen: 20 });

    }
    else if (currentRole === "mentor") {
        payload.yearsExperience = sanitizeString(document.getElementById("yearsExperience").value, { maxLen: 40 });
        payload.portfolio = sanitizeString(document.getElementById("portfolio").value, { maxLen: 200 });
        payload.expertiseArea = sanitizeString(document.getElementById("expertiseArea").value, { maxLen: 120 });
        payload.masteredTools = sanitizeString(document.getElementById("masteredTools").value, { maxLen: 200 });
        payload.mentoredBefore = sanitizeString(document.querySelector('input[name="mentored"]:checked')?.value || "", { maxLen: 10 });
        payload.availability = [...document.querySelectorAll("#shiftsMentor .shift-row")]
        .map(row => {
            const day = row.querySelector(".shift-day").value;
            const shift = row.querySelector(".shift-time").value;
            return day && shift ? `${day} - ${shift}` : null;
        })
        .filter(Boolean)
        .join(", ");
    }
    else if (currentRole === "staff") {

        payload.preferredRole = sanitizeString(document.getElementById("preferredRole").value, { maxLen: 120 });
        payload.organizedBefore = sanitizeString(document.getElementById("organizedBefore").value, { maxLen: 10 });
        payload.availability = [...document.querySelectorAll("#shiftsStaff .shift-row")]
            .map(row => {
                const day = row.querySelector(".shift-day").value;
                const shift = row.querySelector(".shift-time").value;
                return day && shift ? `${day} - ${shift}` : null;
            })
            .filter(Boolean)
            .join(", ");
    }

    // Store payload for OTP verification
    registrationPayload = payload;

    // Show OTP form
    hideAll();
    show(otpForm);
    setStep(2);

    // Generate and "send" OTP (in real app, this would be sent via email)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", generatedOtp); // In real app, this would be sent to user's email
    localStorage.setItem("currentOtp", generatedOtp);
});


});