document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const deadlineInput = document.getElementById('deadline-input');
    const list = document.querySelector('#todo-list tbody');

    // Load tasks from localStorage
    loadTasks();

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const task = input.value.trim();
        const deadline = deadlineInput.value;
        if (task !== '' && deadline !== '') {
            addTask(task, deadline);
            input.value = '';
            deadlineInput.value = '';
            // Save tasks to localStorage
            saveTasks();
        } else {
            alert("Please enter both task and deadline.");
        }
    });

   function addTask(task, deadline, progress = 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${task}</td>
        <td class="center">${deadline} <span class="remaining-days"></span></td>
        <td class="center"><input type="number" class="progress-input" value="${progress}" min="0" max="100">%</td>
        <td class="center"><button class="delete-icon" title="Delete"></button></td>
    `;

    // compute remaining days from today to the deadline
    const msPerDay = 1000 * 60 * 60 * 24;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    // handle invalid date
    const remainingDays = isNaN(deadlineDate.getTime())
        ? null
        : Math.ceil((deadlineDate - today) / msPerDay);

    // Coloring logic
    if (task.toLowerCase().includes('[test]')) {
        row.style.backgroundColor = 'rgb(202, 233, 241)'; // blue-ish
    } else if (task.toLowerCase().includes('*')) {
        // if deadline couldn't be parsed, treat as urgent (fallback)
        if (remainingDays === null) {
            row.style.backgroundColor = '#ff5252ff'; // urgent
        } else if (remainingDays > 3) {
            // more than 2 days left
            row.style.backgroundColor = '#a9a9a9'; // grey
        }  else if (remainingDays < 0) {
            // less than 0 days left
            row.style.backgroundColor = '#635858ff'; // dark-grey
        } else {
            // 2 days or less (including today or overdue)
            row.style.backgroundColor = '#ff5252ff'; // red
        }
    } else {
        if (remainingDays > 5 && remainingDays > 0)
            row.style.backgroundColor = 'rgb(248, 237, 223)';
        else if (remainingDays < 5 && remainingDays > 0)
            row.style.backgroundColor = 'rgba(225, 221, 5, 0.33)';
        else
            row.style.backgroundColor = 'rgba(232, 148, 13, 1)';
    }

    list.appendChild(row);

    updateRemainingDays(row, deadline);

    const deleteButton = row.querySelector('.delete-icon');
    deleteButton.addEventListener('click', function() {
        row.remove();
        saveTasks();
    });

    sortTasksByDeadline();

    const progressInput = row.querySelector('.progress-input');
    progressInput.addEventListener('change', function() {
        saveTasks();
    });
}


    function updateRemainingDays(row, deadline) {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const remainingDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        const remainingDaysSpan = row.querySelector('.remaining-days');
        if (remainingDays > 0) {
            if (remainingDays === 1) {
                remainingDaysSpan.textContent = `(1 day)`;
            } else {
                remainingDaysSpan.textContent = `(${remainingDays} days)`;
            }
        } else if (remainingDays === 0) {
            remainingDaysSpan.textContent = `(Today)`;
        } else {
            remainingDaysSpan.textContent = `(Overdue by ${Math.abs(remainingDays)} days)`;
        }
    }

    function saveTasks() {
        const tasks = [];
        const rows = list.querySelectorAll('tr');
        rows.forEach(row => {
            const task = row.cells[0].innerText;
            const deadline = row.cells[1].innerText.split(' ')[0]; // Extract date part
            const progress = row.querySelector('.progress-input').value;
            tasks.push({ task, deadline, progress });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                addTask(task.task, task.deadline, task.progress);
            });
        }
    }
    
    function sortTasksByDeadline() {
        const rows = Array.from(list.querySelectorAll('tr'));
        rows.sort((a, b) => {
            const deadlineA = new Date(a.cells[1].innerText);
            const deadlineB = new Date(b.cells[1].innerText);
            return deadlineA - deadlineB;
        });
        list.innerHTML = '';
        rows.forEach(row => list.appendChild(row));
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const scheduleImageInput = document.getElementById('schedule-image-input');
    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    const scheduleImage = document.getElementById('schedule-image');

    saveScheduleBtn.addEventListener('click', function() {
        const imageSrc = scheduleImage.src;
        localStorage.setItem('scheduleImage', imageSrc);
    });

    scheduleImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                scheduleImage.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Load schedule image from local storage
    const savedImageSrc = localStorage.getItem('scheduleImage');
    if (savedImageSrc) {
        scheduleImage.src = savedImageSrc;
    }
});






