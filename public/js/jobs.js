const jobs = [
    { title: "House Cleaning", skill: "cleaning", location: "New York" },
    { title: "Cooking for Events", skill: "cooking", location: "Los Angeles" },
    { title: "Gardening Service", skill: "gardening", location: "San Francisco" },
    { title: "Babysitting", skill: "babysitting", location: "Chicago" },
    { title: "Office Cleaning", skill: "cleaning", location: "Houston" }
];

function displayJobs(jobs) {
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = '';
    jobs.forEach(job => {
        const jobItem = document.createElement('li');
        jobItem.innerHTML = `<strong>${job.title}</strong> <br> Skill: ${job.skill.charAt(0).toUpperCase() + job.skill.slice(1)} <br> Location: ${job.location}`;
        jobList.appendChild(jobItem);
    });
}

function filterJobs() {
    const selectedSkill = document.getElementById('skill').value;
    const enteredLocation = document.getElementById('location').value.toLowerCase();
    
    const filteredJobs = jobs.filter(job => {
        const matchesSkill = selectedSkill === 'all' || job.skill === selectedSkill;
        const matchesLocation = job.location.toLowerCase().includes(enteredLocation);
        return matchesSkill && matchesLocation;
    });

    displayJobs(filteredJobs);
}

// Load all jobs when the page loads
window.onload = () => {
    displayJobs(jobs);
};
const menuIcon = document.getElementById('menuIcon');
const menuList = document.getElementById('menuList');

menuIcon.addEventListener('click', () => {
    menuList.classList.toggle('active');
});
