document.querySelector("#calculateBtn").addEventListener("click", async function () {
    try {
        const response = await fetch('/profile/data');
        if (!response.ok) {
            throw new Error("Failed to fetch profile data");
        }

        const { age, weight, height, gender } = await response.json();
        const goal = document.getElementById("goal").value;
        const caloriesBurnt = 2800; // Replace with actual calculation if needed

        if (!age || !weight || !height || !gender) {
            document.getElementById("calorieResult").textContent =
                "⚠️ Please complete your profile first to use the calculator.";
            return;
        }

        if (gender !== "male" && gender !== "female") {
            alert("Please select a valid gender in the profile.");
            return;
        }

        let bmr;
        if (gender === "male") {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        let totalCalories;
        if (goal === "lose") {
            totalCalories = bmr - 500 + caloriesBurnt;
        } else if (goal === "gain") {
            totalCalories = bmr + 500 + caloriesBurnt;
        } else {
            totalCalories = bmr + caloriesBurnt;
        }

        document.getElementById("calorieResult").textContent =
            `You need approximately ${Math.round(totalCalories)} kcal/day to ${goal}.`;

    } catch (err) {
        console.error(err);
        document.getElementById("calorieResult").textContent =
            "⚠️ Unable to retrieve profile data. Please try again later.";
    }
});
