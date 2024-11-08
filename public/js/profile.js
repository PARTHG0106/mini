document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menuIcon');
    const menuList = document.getElementById('menuList');

    // Toggle the mobile menu on click
    menuIcon.addEventListener('click', () => {
        menuList.classList.toggle('active');
    });

    // Handle logout button click
    const logoutButton = document.querySelector('.logout');
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

    // Edit Work History functionality
    const workHistoryEditButton = document.querySelector('.work-history-card .edit-button');
    const workHistoryList = document.querySelector('.work-history-card ul');
    if (workHistoryEditButton) {
        workHistoryEditButton.addEventListener('click', () => {
            editList(workHistoryList, 'work history');
        });
    }

    // Edit Skills functionality
    const skillsEditButton = document.querySelector('.skills-card .edit-button');
    const skillsList = document.querySelector('.skills-card ul');
    if (skillsEditButton) {
        skillsEditButton.addEventListener('click', () => {
            editList(skillsList, 'skills');
        });
    }

    // Save button functionality
    const saveButton = document.querySelector('.profile-card .save-button');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            // Save profile changes here
            alert('Profile changes saved!');
            // Add any functionality to submit updated profile information to server
        });
    }

    // Function to handle editing lists (Work History and Skills)
    function editList(listElement, listType) {
        // Convert each item to an input for editing
        const items = listElement.querySelectorAll('li');
        items.forEach(item => {
            const text = item.textContent;
            item.innerHTML = `<input type="text" value="${text}" />`;
        });

        // Replace edit button with a save button for the section
        const saveEditButton = document.createElement('button');
        saveEditButton.classList.add('save-edit-button');
        saveEditButton.textContent = 'Save';
        saveEditButton.addEventListener('click', () => saveListChanges(listElement, listType));

        const editButton = listElement.parentNode.querySelector('.edit-button');
        editButton.style.display = 'none';
        editButton.parentNode.appendChild(saveEditButton);
    }

    // Function to save the edited list (Work History or Skills)
    // Function to handle saving the edited work history or skills
    // Function to save the edited list (Work History or Skills)
    // Function to save the edited list (Work History or Skills)
    function saveListChanges(listElement, listType) {
        const updatedItems = [];
        const inputs = listElement.querySelectorAll('input');
        inputs.forEach(input => {
            updatedItems.push(input.value);
            input.parentElement.textContent = input.value; // Replace input with plain text
        });

        // Log the data before sending
        console.log(`${listType} data to send:`, updatedItems);

        // Remove save button and show edit button again
        const saveEditButton = listElement.parentNode.querySelector('.save-edit-button');
        saveEditButton.remove();
        const editButton = listElement.parentNode.querySelector('.edit-button');
        editButton.style.display = 'inline-block';

        // Send the updated list to the server
        fetch(`/update-${listType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [listType]: updatedItems }), // Send the updated data as an array
        })
            .then(response => response.json())
            .then(data => {
                console.log(`${listType} updated:`, data);
                // Optionally, display a success message or update the page
            })
            .catch(error => console.error(`Error updating ${listType}:`, error));
    }

});
