// Global variables for data management
let activityData = {
    cardio: [],
    strength: [],
    steps: [],
    bodyweight: []
};

// fetch data from server
async function fetchActivityData(timeRange = 7) {
    try {
        console.log('Fetching activity data...');
        const response = await fetch(`/api/activities?timeRange=${timeRange}`);
        const data = await response.json();
        
        // calc week's activities
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisWeekActivities = data.filter(a => new Date(a.datetime) >= oneWeekAgo);
        
        // calc weekly running distance
        const runningActivities = thisWeekActivities.filter(a => a.activityTypeLabel === 'Running');
        const weeklyRunningDistance = runningActivities.reduce((sum, a) => sum + (a.distance || 0), 0);
        
        // calc average daily calories
        const totalCalories = thisWeekActivities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
        const averageDailyCalories = Math.round(totalCalories / 7);
        
        // calc total training time
        const totalMinutes = thisWeekActivities.reduce((sum, a) => {
            return sum + (a.duration?.hours * 60 + a.duration?.minutes || 0);
        }, 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const seconds = thisWeekActivities.reduce((sum, a) => sum + (a.duration?.seconds || 0), 0) % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update all summary cards
        const summaryCards = document.querySelectorAll('.summary-card');
        if (summaryCards.length >= 4) {
            // Activities This Week
            summaryCards[0].querySelector('.value').textContent = thisWeekActivities.length;
            summaryCards[0].querySelector('.label').textContent = 'Activities This Week';
            summaryCards[0].querySelector('.icon').innerHTML = '<i class="bi bi-calendar-check text-primary"></i>';
            
            // Weekly Running
            summaryCards[1].querySelector('.value').textContent = `${weeklyRunningDistance.toFixed(1)} Km`;
            summaryCards[1].querySelector('.label').textContent = 'Weekly Running';
            summaryCards[1].querySelector('.icon').innerHTML = '<i class="bi bi-geo-alt text-primary"></i>';
            
            // Average Daily Calories
            summaryCards[2].querySelector('.value').textContent = `${averageDailyCalories} Kcal`;
            summaryCards[2].querySelector('.label').textContent = 'Average Daily Calories';
            summaryCards[2].querySelector('.icon').innerHTML = '<i class="bi bi-fire text-danger"></i>';
            
            // Total Training Time
            summaryCards[3].querySelector('.value').textContent = formattedTime;
            summaryCards[3].querySelector('.label').textContent = 'Total Training Time';
            summaryCards[3].querySelector('.icon').innerHTML = '<i class="bi bi-clock-history text-warning"></i>';
        }
        
        // Process and categorize the data for charts
        activityData = {
            cardio: data.filter(a => ['Running', 'Walking', 'Hiking', 'Swimming', 'Cycling'].includes(a.activityTypeLabel)),
            strength: data.filter(a => ['Weightlifting', 'Deadlifts', 'Kettlebell Swings', 'Bicep Curls', 'Tricep Dips', 'Bench Press', 'Squat'].includes(a.activityTypeLabel)),
            steps: data.filter(a => a.steps),
            bodyweight: data.filter(a => ['Push-ups', 'Pull-ups', 'Squats', 'Lunges', 'Planks', 'Sit-ups', 'Mountain Climbers', 'Burpees', 'Leg Raises', 'Glute Bridges'].includes(a.activityTypeLabel))
        };
        
        console.log('Processed activity data:', activityData);
        updateAllCharts();
    } catch (error) {
        console.error('Error fetching activity data:', error);
    }
}

// Chart 1: Cardio Activity
let activityDurationChart;
function initActivityDurationChart() {
    const ctx = document.getElementById("activityDurationChart").getContext("2d");
    activityDurationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            datasets: [
                {
                    label: "duration (min)",
                    data: [30, 25, 40, 35, 20, 45, 30],
                    borderColor: "#970C3C",
                    backgroundColor: "rgba(151, 12, 60, 0.2)",
                    tension: 0.3,
                    fill: true
                },
                {
                    label: "distance (km)",
                    data: [4, 3.5, 5, 4.8, 3, 6, 4.5],
                    borderColor: "#7FB3D5",
                    backgroundColor: "rgba(127, 179, 213, 0.2)",
                    tension: 0.3,
                    fill: true
                },
                {
                    label: "speed (km/h)",
                    data: [8, 8.4, 7.5, 8.2, 9, 7, 8.1],
                    borderColor: "#D4A59A",
                    backgroundColor: "rgba(212, 165, 154, 0.2)",
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 8
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 0
                    }
                }
            }
        }
    });
}

// Chart 2: Strength Training
let strengthChart;
function initStrengthChart() {
    const ctx = document.getElementById("strengthChart").getContext("2d");
    strengthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: "weight used (kg)",
                    data: [],
                    backgroundColor: "#970C3C"
                },
                {
                    label: "reps",
                    data: [],
                    backgroundColor: "#7FB3D5"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 8
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 0
                    }
                }
            }
        }
    });

    // Update the dropdown to include all strength activities
    const strengthSelect = document.getElementById('strengthSelect');
    strengthSelect.innerHTML = `
        <option value="weightlifting">Weightlifting</option>
        <option value="deadlifts">Deadlifts</option>
        <option value="kettlebell swings">Kettlebell Swings</option>
        <option value="bicep curls">Bicep Curls</option>
        <option value="tricep dips">Tricep Dips</option>
        <option value="bench press">Bench Press</option>
        <option value="squat">Squat</option>
    `;
}

// Chart 3: Steps
let stepsChart;
function initStepsChart() {
    const ctx = document.getElementById("stepsChart").getContext("2d");
    stepsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            datasets: [{
                label: "steps",
                data: [6000, 7500, 8200, 7000, 8500, 9000, 10000],
                backgroundColor: "rgba(127, 179, 213, 0.2)",
                borderColor: "#7FB3D5",
                pointBackgroundColor: "#970C3C"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 8
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5
                    }
                }
            }
        }
    });
}

// Chart 4: Bodyweight Exercises
let bodyweightChart;
function initBodyweightChart() {
    const ctx = document.getElementById("bodyweightChart").getContext("2d");
    bodyweightChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 8
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} reps`;
                        }
                    }
                }
            }
        }
    });
}

// Update functions for each chart
function updateActivityDurationChart() {
    const cardioType = document.getElementById('cardioType').value;
    const filteredData = cardioType === 'all' 
        ? activityData.cardio 
        : activityData.cardio.filter(a => a.activityTypeLabel === cardioType);

    if (filteredData.length === 0) {
        activityDurationChart.data.labels = ['No Data'];
        activityDurationChart.data.datasets = [
            {
                label: "duration (min)",
                data: [0],
                borderColor: "#970C3C",
                backgroundColor: "rgba(151, 12, 60, 0.2)",
                tension: 0.3,
                fill: true
            },
            {
                label: "distance (km)",
                data: [0],
                borderColor: "#7FB3D5",
                backgroundColor: "rgba(127, 179, 213, 0.2)",
                tension: 0.3,
                fill: true
            },
            {
                label: "speed (km/h)",
                data: [0],
                borderColor: "#D4A59A",
                backgroundColor: "rgba(212, 165, 154, 0.2)",
                tension: 0.3,
                fill: true
            }
        ];
        activityDurationChart.update();
        return;
    }

    const dates = [...new Set(filteredData.map(a => new Date(a.datetime).toLocaleDateString()))];
    const durationData = dates.map(date => {
        const dayActivities = filteredData.filter(a => new Date(a.datetime).toLocaleDateString() === date);
        return dayActivities.reduce((sum, a) => sum + (a.duration.hours * 60 + a.duration.minutes), 0);
    });
    const distanceData = dates.map(date => {
        const dayActivities = filteredData.filter(a => new Date(a.datetime).toLocaleDateString() === date);
        return dayActivities.reduce((sum, a) => sum + (a.distance || 0), 0);
    });
    const speedData = dates.map((date, i) => {
        if (durationData[i] === 0) return 0;
        return (distanceData[i] / (durationData[i] / 60)).toFixed(1);
    });

    activityDurationChart.data.labels = dates;
    activityDurationChart.data.datasets[0].data = durationData;
    activityDurationChart.data.datasets[1].data = distanceData;
    activityDurationChart.data.datasets[2].data = speedData;
    activityDurationChart.update();
}

function updateStrengthChart() {
    const exercise = document.getElementById('strengthSelect').value;
    console.log('Selected exercise:', exercise);
    console.log('All strength data:', activityData.strength);
    
    // Add detailed logging of each strength activity
    activityData.strength.forEach(activity => {
        console.log('Activity:', {
            type: activity.activityTypeLabel,
            weight: activity.weightUsed,
            reps: activity.reps,
            datetime: activity.datetime
        });
    });
    
    const filteredData = activityData.strength.filter(a => {
        const matches = a.activityTypeLabel.toLowerCase() === exercise.toLowerCase();
        console.log('Comparing:', {
            activityType: a.activityTypeLabel,
            selectedExercise: exercise,
            matches: matches
        });
        return matches;
    });
    console.log('Filtered data:', filteredData);
    
    if (filteredData.length === 0) {
        strengthChart.data.labels = ['No Data'];
        strengthChart.data.datasets = [
            {
                label: "weight used (kg)",
                data: [0],
                backgroundColor: "#970C3C"
            },
            {
                label: "reps",
                data: [0],
                backgroundColor: "#7FB3D5"
            }
        ];
        strengthChart.update();
        return;
    }

    // Sort activities by date
    const sortedData = filteredData.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    
    // Get dates and format them
    const dates = sortedData.map(a => new Date(a.datetime).toLocaleDateString());
    
    // Calculate weight and reps data
    const weightData = sortedData.map(activity => {
        const weight = activity.weightUsed?.weight || 0;
        console.log('Weight for activity:', {
            date: activity.datetime,
            weight: weight,
            weightUsed: activity.weightUsed
        });
        return weight;
    });
    
    const repsData = sortedData.map(activity => {
        const totalReps = !activity.reps || !Array.isArray(activity.reps) ? 0 : 
            activity.reps.reduce((sum, rep) => sum + rep, 0);
        console.log('Reps for activity:', {
            date: activity.datetime,
            reps: activity.reps,
            totalReps: totalReps
        });
        return totalReps;
    });

    console.log('Final chart data:', {
        dates: dates,
        weightData: weightData,
        repsData: repsData
    });

    // Update chart data
    strengthChart.data.labels = dates;
    strengthChart.data.datasets[0].data = weightData;
    strengthChart.data.datasets[1].data = repsData;
    
    // Update the chart
    strengthChart.update();
}

function updateStepsChart() {
    const view = document.getElementById('stepsView').value;
    const stepsData = activityData.steps;
    
    if (stepsData.length === 0) {
        stepsChart.data.labels = ['No Data'];
        stepsChart.data.datasets = [{
            label: "steps",
            data: [0],
            backgroundColor: "rgba(127, 179, 213, 0.2)",
            borderColor: "#7FB3D5",
            pointBackgroundColor: "#970C3C"
        }];
        stepsChart.update();
        return;
    }

    if (view === 'daily') {
        const dates = [...new Set(stepsData.map(a => new Date(a.datetime).toLocaleDateString()))];
        const dailySteps = dates.map(date => {
            const dayActivities = stepsData.filter(a => new Date(a.datetime).toLocaleDateString() === date);
            return dayActivities.reduce((sum, a) => sum + (a.steps || 0), 0);
        });

        stepsChart.data.labels = dates;
        stepsChart.data.datasets[0].data = dailySteps;
    } else {
        // Weekly average
        const weeks = [...new Set(stepsData.map(a => {
            const date = new Date(a.datetime);
            return `${date.getFullYear()}-W${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
        }))];
        
        const weeklySteps = weeks.map(week => {
            const weekActivities = stepsData.filter(a => {
                const date = new Date(a.datetime);
                return `${date.getFullYear()}-W${Math.ceil((date.getDate() + date.getDay()) / 7)}` === week;
            });
            const total = weekActivities.reduce((sum, a) => sum + (a.steps || 0), 0);
            return Math.round(total / 7);
        });

        stepsChart.data.labels = weeks;
        stepsChart.data.datasets[0].data = weeklySteps;
    }
    stepsChart.update();
}

function updateBodyweightChart() {
    const exercise = document.getElementById('bodyweightSelect').value;
    const filteredData = activityData.bodyweight.filter(a => a.activityTypeLabel === exercise);
    
    if (filteredData.length === 0) {
        bodyweightChart.data.labels = ['No Data'];
        bodyweightChart.data.datasets = [{
            data: [1],
            backgroundColor: ['#e0e0e0']
        }];
        bodyweightChart.update();
        return;
    }

    // Get the most recent activity
    const latestActivity = filteredData.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))[0];
    
    if (!latestActivity.reps || latestActivity.reps.length === 0) {
        bodyweightChart.data.labels = ['No Reps Data'];
        bodyweightChart.data.datasets = [{
            data: [1],
            backgroundColor: ['#e0e0e0']
        }];
        bodyweightChart.update();
        return;
    }

    // Create labels for each set
    const labels = latestActivity.reps.map((_, index) => `Set ${index + 1}`);
    
    // Create dataset with the reps data
    bodyweightChart.data.labels = labels;
    bodyweightChart.data.datasets = [{
        label: `${exercise} Reps`,
        data: latestActivity.reps,
        backgroundColor: [
            '#970C3C',  // Set 1
            '#7FB3D5',  // Set 2
            '#D4A59A',  // Set 3
            '#2E8B57',  // Set 4
            '#FFA500',  // Set 5
            '#9370DB'   // Set 6
        ].slice(0, latestActivity.reps.length)
    }];

    bodyweightChart.update();
}

// Initialize all charts
function initAllCharts() {
    console.log('Initializing all charts...');
    initActivityDurationChart();
    initStrengthChart();
    initStepsChart();
    initBodyweightChart();
    
    // Fetch data after charts are initialized
    fetchActivityData();
}

// Update all charts
function updateAllCharts() {
    updateActivityDurationChart();
    updateStrengthChart();
    updateStepsChart();
    updateBodyweightChart();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Setting up charts...');
    initAllCharts();

    // Time range change
    document.getElementById('timeRange')?.addEventListener('change', (e) => {
        console.log('Time range changed:', e.target.value);
        fetchActivityData(e.target.value);
    });

    // Cardio type filter
    document.getElementById('cardioType')?.addEventListener('change', () => {
        console.log('Cardio type changed');
        updateActivityDurationChart();
    });

    // Strength exercise filter
    document.getElementById('strengthSelect')?.addEventListener('change', () => {
        console.log('Strength exercise changed');
        updateStrengthChart();
    });

    // Steps view filter
    document.getElementById('stepsView')?.addEventListener('change', () => {
        console.log('Steps view changed');
        updateStepsChart();
    });

    // Bodyweight exercise filter
    document.getElementById('bodyweightSelect')?.addEventListener('change', () => {
        console.log('Bodyweight exercise changed');
        updateBodyweightChart();
    });
});