document.getElementById("profile-update").addEventListener("submit", function (e) {
    e.preventDefault(); // prevent actual form submission

    // Get user inputs
    const age = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const gender = document.querySelector('input[name="gender"]:checked').value;

    // Validate inputs
    if (!age || !weight || !height || !gender) {
        alert("Please fill in all fields.");
        return;
    }

    // Store values in localStorage
    localStorage.setItem("age", age);
    localStorage.setItem("weight", weight);
    localStorage.setItem("height", height);
    localStorage.setItem("gender", gender); // store as "male" or "female"

    alert("Profile saved successfully!");
});
