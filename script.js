let taskList = document.getElementById("taskList");

window.onload = function () {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(item => {
        if (item.task && item.priority) {
            createTask(item.task, item.priority);
        }
    });
    updateCounter();
};

function addTask() {
    let input = document.getElementById("taskInput");
    let task = input.value.trim();

    let priority = document.getElementById("priority").value;

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    createTask(task, priority);

    saveTask({ task, priority });

    input.value = "";
    taskList.appendChild(li);
    updateCounter();

}

// Create Task
function createTask(task, priority) {
    let li = document.createElement("li");

    let color = getPriorityColor(priority);

    li.innerHTML = `
        <span>${task} - <b style="color:${color}">${priority}</b></span>
        <div>
            <button onclick="editTask(this)">Edit</button>
            <button onclick="deleteTask(this)">Delete</button>
        </div>
    `;

    //  TOGGLE COMPLETE ADD KARO
    li.querySelector("span").onclick = function () {
        if (this.style.textDecoration === "line-through") {
            this.style.textDecoration = "none";
        } else {
            this.style.textDecoration = "line-through";
        }

        updateCounter();

    };

    taskList.appendChild(li);
}

// EDIT TASK
function editTask(btn) {
    let li = btn.parentElement.parentElement;
    let span = li.querySelector("span");

    let oldTask = span.textContent.split(" - ")[0];
    let oldPriority = span.textContent.split(" - ")[1];

    let newTask = prompt("Edit task:", oldTask);
    if (!newTask || newTask.trim() === "") return;

    let newPriority = prompt("Edit priority (Low, Medium, High):", oldPriority);

    if (!["low", "medium", "high"].includes(newPriority.toLowerCase())) {
        newPriority = oldPriority;
    }

    let color = getPriorityColor(newPriority);

    span.innerHTML = `${newTask} - <b style="color:${color}">${newPriority}</b>`;

    updateLocalStorage(oldTask, newTask, oldPriority, newPriority);
}

// DELETE TASK
function deleteTask(btn) {
    let li = btn.parentElement.parentElement;
    let taskText = li.querySelector("span").textContent.split(" - ")[0];

    li.remove();

    removeFromStorage(taskText);
    updateCounter();
}

// SAVE TASK
function saveTask(item) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(item);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// UPDATE TASK IN STORAGE
function updateLocalStorage(oldTask, newTask, oldPriority, newPriority) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.map(t => {
        if (t.task === oldTask && t.priority === oldPriority) {
            return { task: newTask, priority: newPriority };
        }
        return t;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// DELETE FROM STORAGE
function removeFromStorage(taskName) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(t => t.task !== taskName);

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// PRIORITY COLOR FUNCTION
function getPriorityColor(priority) {
    priority = priority.toLowerCase();

    if (priority === "high") return "red";
    if (priority === "medium") return "orange";
    if (priority === "low") return "green";
    return "black";
}

function updateCounter() {
    let tasks = document.querySelectorAll("#taskList li");
    let total = tasks.length;

    let completed = 0;

    tasks.forEach(task => {
        let span = task.querySelector("span");
        if (span.style.textDecoration === "line-through") {
            completed++;
        }
    });

    document.getElementById("taskCounter").innerText =
        `Total: ${total} | Completed: ${completed}`;
}

function searchTask() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let list = document.querySelectorAll("#taskList li");

    list.forEach(li => {
        let text = li.querySelector("span").textContent.toLowerCase();

        if (text.includes(input)) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

