// ACTIVITY OPTION: OTHER
const activitySelect = document.getElementById("activityType");
const otherActivityContainer = document.getElementById("otherActivityContainer");

activitySelect.addEventListener("change", function () {
    if (activitySelect.value === "other") {
        otherActivityContainer.style.display = "block";
    } else {
        otherActivityContainer.style.display = "none";
    }
});

// Trigger on page load to handle default selected option
window.addEventListener("DOMContentLoaded", () => {
    if (activitySelect.value === "other") {
        otherActivityContainer.style.display = "block";
    }
});



// -------------------------------------------------------------------------------------
// FORM FOR DIFFERENT ACTIVITY
const weightUsed = document.getElementById("weightUsed");
const speedContainer = document.getElementById("speedContainer");
const distanceContainer = document.getElementById("distanceContainer");
const stepsContainer = document.getElementById("stepsContainer");
const setsContainer = document.getElementById("setsContainer");

activitySelect.addEventListener("change", function () {
    const v = parseInt(activitySelect.value, 10);

    if (v >= 1 && v <= 5) {
        weightUsed.style.display = "none";
        speedContainer.style.display = "block";
        distanceContainer.style.display = "block";
        stepsContainer.style.display = "none";
        setsContainer.style.display = "none";

        if (v >= 1 && v <= 3) {
            stepsContainer.style.display = "block";
        }
    }

    if (v >= 6 && v <= 10) {
        weightUsed.style.display = "block";
        speedContainer.style.display = "none";
        distanceContainer.style.display = "none";
        stepsContainer.style.display = "none";
        setsContainer.style.display = "block";
    }

    if (v >= 11 && v <= 20) {
        weightUsed.style.display = "none";
        speedContainer.style.display = "none";
        distanceContainer.style.display = "none";
        stepsContainer.style.display = "none";
        setsContainer.style.display = "block";
    }
});

window.addEventListener("DOMContentLoaded", () => {

    const v = parseInt(activitySelect.value, 10);

    if (v >= 1 && v <= 3) {
        weightUsed.style.display = "none";
        speedContainer.style.display = "block";
        distanceContainer.style.display = "block";
        stepsContainer.style.display = "block";
        setsContainer.style.display = "none";

    }
});



// -------------------------------------------------------------------------------------
// AUTOMATICALLY ADD REPS
document.getElementById("sets").addEventListener("change", function () {
    const sets = parseInt(this.value); // Get number of sets
    const repsSection = document.getElementById("repsSection");
    const currentRepsFields = repsSection.querySelectorAll("input[type='number']");

    // Remove existing rep fields
    currentRepsFields.forEach(field => field.parentElement.remove());

    // Add new rep fields
    for (let i = 1; i <= sets; i++) {
        const label = document.createElement("label");
        label.textContent = `Reps for Set ${i}`;
        label.classList.add("form-label", "text-primary");

        const input = document.createElement("input");
        input.type = "number";
        input.classList.add("form-control");
        input.placeholder = `e.g., ${i * 10}`;
        input.min = "1";
        input.required = true;
        input.name = `reps${i}`; 

        const container = document.createElement("div");
        container.classList.add("container", "mt-3");

        container.appendChild(label);
        container.appendChild(input);

        repsSection.appendChild(container);
    }
});

// Add button to add more sets manually
document.getElementById("addSetBtn").addEventListener("click", function () {
    const setsInput = document.getElementById("sets");
    setsInput.value = parseInt(setsInput.value) + 1; // Increase the sets count
    setsInput.dispatchEvent(new Event("change")); // Re-trigger the change event to add a rep field
});