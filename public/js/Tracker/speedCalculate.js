document.addEventListener("DOMContentLoaded", function () {

            // Get element to calculate speed
            const hoursInput = document.getElementById("hours");
            const minutesInput = document.getElementById("minutes");
            const secondsInput = document.getElementById("seconds");
            const distanceInput = document.getElementById("distanceInput");
            const speedText = document.getElementById("speedText");

            // Calculate speed
            function calculateSpeed() {
                const hours = parseInt(hoursInput.value) || 0;
                const minutes = parseInt(minutesInput.value) || 0;
                const seconds = parseInt(secondsInput.value) || 0;
                const distance = parseFloat(distanceInput.value) || 0;

                // Convert total time to hours
                const totalTimeInHours = hours + (minutes / 60) + (seconds / 3600);

                // Calculate speed in km/h
                if (distance > 0 && totalTimeInHours > 0) {
                    const speed = distance / totalTimeInHours; // km/h
                    speedText.textContent = `${speed.toFixed(2)} km/h`;
                } else {
                    speedText.textContent = "-- km/h";
                }
            }

            // Event listeners to update speed in real-time
            hoursInput.addEventListener("input", calculateSpeed);
            minutesInput.addEventListener("input", calculateSpeed);
            secondsInput.addEventListener("input", calculateSpeed);
            distanceInput.addEventListener("input", calculateSpeed);
        });