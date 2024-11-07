document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
const menuIcon = document.getElementById('menuIcon');
    const menuList = document.getElementById('menuList');

    menuIcon.addEventListener('click', () => {
        menuList.classList.toggle('active');
});
// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout'); // Assuming the logout button has the class 'logout'

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default form submission
            fetch('/auth/logout', {
                method: 'GET',
                credentials: 'include' // Include cookies for session
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url; // Redirect to the home page
                }
            })
            .catch(error => console.error('Logout error:', error));
        });
    }
});
