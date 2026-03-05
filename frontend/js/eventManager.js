const createBtn = document.getElementById("createBtn");

const createForm = document.getElementById("createForm");



createBtn.addEventListener("click", () => {

    if (createForm.style.display === "block") {

        createForm.style.display = "none";

    }

    else {

        createForm.style.display = "block";

    }

});