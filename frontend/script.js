function startCountdown() {

    const eventDate = new Date("2026-03-10T00:00:00").getTime();

    const interval = setInterval(() => {

        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            clearInterval(interval);
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
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



document.addEventListener("DOMContentLoaded", function() {

    startCountdown();

    const roleSelect = document.getElementById("roleSelect");

    const form1 = document.getElementById("form1"); //main form
    const form2 = document.getElementById("form2"); // participant
    const form3 = document.getElementById("form3"); // mentor
    const form4 = document.getElementById("form4"); // staff
    const finalForm = document.getElementById("final"); // final step

    const nextBtn = document.getElementById("nextBtn");

    const steps = document.querySelectorAll(".step");


    nextBtn.addEventListener("click", function() {

        if (roleSelect.value === "") {
            alert("Select a role first!");
            return;
        }

        form1.style.display = "none";

        if (roleSelect.value === "participant") {
            form2.style.display = "block";
        }

        if (roleSelect.value === "mentor") {
            form3.style.display = "block";
        }

        if (roleSelect.value === "staff") {
            form4.style.display = "block";
        }

        steps[0].classList.remove("active");
        steps[1].classList.add("active");
    });



    function goFinal() {

        form2.style.display = "none";
        form3.style.display = "none";
        form4.style.display = "none";

        finalForm.style.display = "block";

        steps[1].classList.remove("active");
        steps[2].classList.add("active");
    }

    document.getElementById("nextParticipant")?.addEventListener("click", goFinal);
    document.getElementById("nextMentor")?.addEventListener("click", goFinal);
    document.getElementById("nextStaff")?.addEventListener("click", goFinal);



    function backToMain() {

        form2.style.display = "none";
        form3.style.display = "none";
        form4.style.display = "none";

        form1.style.display = "block";

        steps[1].classList.remove("active");
        steps[0].classList.add("active");
    }

    document.getElementById("backParticipant")?.addEventListener("click", backToMain);
    document.getElementById("backMentor")?.addEventListener("click", backToMain);
    document.getElementById("backStaff")?.addEventListener("click", backToMain);



    document.getElementById("backFinal")?.addEventListener("click", function() {

        finalForm.style.display = "none";

        if (roleSelect.value === "participant") {
            form2.style.display = "block";
        }

        if (roleSelect.value === "mentor") {
            form3.style.display = "block";
        }

        if (roleSelect.value === "staff") {
            form4.style.display = "block";
        }

        steps[2].classList.remove("active");
        steps[1].classList.add("active");
    });

});