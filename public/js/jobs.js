const jobs = [
    { title: "House Cleaning", skill: "cleaning", location: "Nagpur", website: "https://hellocleaning.com" },
    { title: "Cooking for Events", skill: "cooking", location: "Mumbai", website:"https://jobnukkad.com/domestic-cooks-for-home-mumbai" },
    { title: "Gardening Service", skill: "gardening", location: "Pune", website:"https://www.ugaoo.com/pages/ugaoo-garden-services?srsltid=AfmBOoodk6AfEioGFacrvjnJp79yI_6TpsDN23EOMXQAOjspI9Pz66pI" },
    { title: "Babysitting", skill: "babysitting", location: "Navi Mumbai", website:"https://kamwalibais.com/?gad_source=1&gclid=Cj0KCQjwyL24BhCtARIsALo0fSDprkOx1gRwJCLrFtW-4Xw6Hw2iybkVq9kofO3daR5ZiXHir33GzY0aAlE8EALw_wcB" },
    { title: "Office Cleaning", skill: "cleaning", location: "Jalgaon", website:"https://www.bark.com/en/in/cleaners/maharashtra/jalgaon/" }
];

function displayJobs(jobs) {
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = '';
    jobs.forEach(job => {
        const jobItem = document.createElement('li');
        jobItem.innerHTML = `
            <strong>${job.title}</strong> <br> 
            Skill: ${job.skill.charAt(0).toUpperCase() + job.skill.slice(1)} <br> 
            Location: ${job.location} <br>
            ${job.website ? `<a href="${job.website}" target="_blank">Visit Website</a>` : 'No website available'}
        `;
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