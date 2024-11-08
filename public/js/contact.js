document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("vbOcmvpVDTFuY3SEd"); // Replace with your EmailJS user ID

    // Handle form submission
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Collect form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Send the email
        emailjs.send("service_x1nay25", "template_dwjjokb", {
            from_name: name,
            from_email: email,
            message: message
        })
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Your message has been sent successfully!');
        })
        .catch(function(error) {
            console.error('EmailJS Send Error:', error);
            alert('Oops! Something went wrong. Please check the console for more details.');
        });
    });
});
const menuIcon = document.getElementById('menuIcon');
    const menuList = document.getElementById('menuList');

    menuIcon.addEventListener('click', () => {
        menuList.classList.toggle('active');
    });