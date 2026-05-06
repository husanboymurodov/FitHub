const form = document.getElementById('reminder-form');
const list = document.getElementById('reminder-list');
const sound = document.getElementById("reminder-sound");
let reminders = [];

// Fetch reminders from server on load
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/api/reminders');
        reminders = await response.json();
        reminders.forEach(createReminderItem);
    } catch (error) {
        console.error('Error fetching reminders:', error);
    }
});

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const text = document.getElementById('reminder-text').value;
    const time = document.getElementById('reminder-time').value;
    const category = document.getElementById('reminder-category').value;

    let recurring = 'none';
    const selectedDays = [];

    if (document.getElementById('daily').checked) {
        recurring = 'daily';
    } else {
        if (document.getElementById('monday').checked) selectedDays.push('Monday');
        if (document.getElementById('tuesday').checked) selectedDays.push('Tuesday');
        if (document.getElementById('wednesday').checked) selectedDays.push('Wednesday');
        if (document.getElementById('thursday').checked) selectedDays.push('Thursday');
        if (document.getElementById('friday').checked) selectedDays.push('Friday');
        if (document.getElementById('saturday').checked) selectedDays.push('Saturday');
        if (document.getElementById('sunday').checked) selectedDays.push('Sunday');

        if (selectedDays.length > 0) {
            recurring = selectedDays;
        }
    }
    const duration = document.getElementById('reminder-duration').value;
    const interval = document.getElementById('reminder-interval').value;

    const reminderData = { text, time, category, recurring, duration, interval };

    try {
        const response = await fetch('/api/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reminderData)
        });
        const savedReminder = await response.json();
        reminders.push(savedReminder);
        createReminderItem(savedReminder);
        form.reset();
    } catch (error) {
        console.error('Error saving reminder:', error);
    }
});

function createReminderItem(reminder) {
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const reminderTime = new Date(reminder.time);
    const formattedTime = reminderTime.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    li.innerHTML = `
    <span>
      ${reminder.text}
      <small class="text-muted">(${reminder.category})</small>
      <small class="text-muted">(${formattedTime})</small>
      ${reminder.duration > 0 ? `<small class="text-muted">(Duration: ${reminder.duration} min)</small>` : ''}
    </span>
    <button class="btn btn-sm btn-danger delete-btn">×</button>
  `;

    li.querySelector('.delete-btn').addEventListener('click', async () => {
        try {
            await fetch(`/api/reminders/${reminder._id}`, { method: 'DELETE' });
            list.removeChild(li);
            reminders = reminders.filter(r => r._id !== reminder._id);
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    });

    list.appendChild(li);
}

// Notification logic
if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
    });
}

function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("Reminder", {
            body: message,
            icon: "/images/logo-round.png"
        });
    }
}

setInterval(() => {
    const now = new Date().getTime(); // Get current time in milliseconds
    const todayDay = new Date().toLocaleString('en-us', { weekday: 'long' }); // Get the current day of the week

    reminders.forEach(reminder => {
        // Check for daily reminders
        if (reminder.recurring === 'daily' && !reminder.shown) {
            const reminderTime = new Date(reminder.time).getTime();

            if (now >= reminderTime) {
                // Notify
                document.getElementById('reminder-sound').play();
                showNotification(`Hey, its time to ${reminder.text}`);

                reminder.shown = true;  // Mark as shown
                saveReminders();
            }
        }

        // Check for weekly reminders (specific days)
        if (Array.isArray(reminder.recurring) && reminder.recurring.includes(todayDay) && !reminder.shown) {
            const reminderTime = new Date(reminder.time).getTime();

            if (now >= reminderTime) {
                // Notify
                document.getElementById('reminder-sound').play();
                showNotification(`Hey, its time to ${reminder.text}`);

                reminder.shown = true;  // Mark as shown
                saveReminders();
            }
        }
    });
}, 10000);  // Check every 10 seconds

// Voice input
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('reminder-text').value = transcript;
};
document.getElementById('voice-input').addEventListener('click', () => {
    recognition.start();
});