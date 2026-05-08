document.addEventListener("DOMContentLoaded", () => {
    const activityItems = document.querySelectorAll(".activity-item");

    const maybeShow = (id, value, allowZero = false) => {
        const el = document.getElementById(id);
        const trimmedValue = (value || "").toString().trim();

        const shouldShow = allowZero
            ? trimmedValue !== ""
            : trimmedValue !== "" && !/^0+\s*[a-zA-Z]*$/.test(trimmedValue) && trimmedValue !== "0 km" && trimmedValue !== "0h 0m 0s";

        if (shouldShow) {
            el.textContent = value;
            el.parentElement.style.display = 'block';
        } else {
            el.parentElement.style.display = 'none';
        }
    };





    activityItems.forEach(item => {
        item.addEventListener("click", () => {
            const modal = new bootstrap.Modal(document.getElementById('activityDetailModal'));

            // Always show title and datetime
            document.getElementById("modalTitle").textContent = item.dataset.title;
            document.getElementById("modalDatetime").textContent = item.dataset.datetime;

            // Use maybeShow for everything else
            maybeShow("modalDuration", item.dataset.duration);
            maybeShow("modalDistance", item.dataset.distance);
            maybeShow("modalRate", item.dataset.rate, true);
            maybeShow("modalNotes", item.dataset.notes);
            maybeShow("modalActivityType", item.dataset.activityType);
            maybeShow("modalSpeed", item.dataset.speed);
            maybeShow("modalWeight", item.dataset.weightUsed);
            maybeShow("modalSteps", item.dataset.steps);
            maybeShow("modalSets", item.dataset.sets);
            maybeShow("modalReps", item.dataset.reps);
            maybeShow("modalCalories", item.dataset.caloriesBurned);

            modal.show();
        });
    });
});
