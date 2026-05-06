// Home Cardio Chart
    new Chart(document.getElementById("homeCardioChart"), {
      type: 'line',
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Duration (min)",
            data: [30, 25, 40, 35, 20, 45, 30],
            borderColor: "#970C3C",
            backgroundColor: "rgba(151, 12, 60, 0.2)",
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Home Steps Chart
    new Chart(document.getElementById("homeStepsChart"), {
      type: 'radar',
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Steps",
          data: [6000, 7500, 8200, 7000, 8500, 9000, 10000],
          backgroundColor: "rgba(127, 179, 213, 0.2)",
          borderColor: "#7FB3D5",
          pointBackgroundColor: "#970C3C"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          r: {
            beginAtZero: true
          }
        }
      }
    });