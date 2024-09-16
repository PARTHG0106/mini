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