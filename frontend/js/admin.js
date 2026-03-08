const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// Set active tab based on current page
document.addEventListener("DOMContentLoaded", () => {
    const currentUrl = window.location.href;
    const currentPage = currentUrl.split('/').pop().split('?')[0]; // Handle query parameters
    const links = document.querySelectorAll('.links-ul li a');

    links.forEach(link => {
        link.classList.remove('active');

        const href = link.getAttribute('href');
        if (href && href === currentPage) {
            link.classList.add('active');
        }
    });
});