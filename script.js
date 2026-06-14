const taskTitle = document.getElementById("taskTitle");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

const addTaskBtn = document.getElementById("addTaskBtn");

const pendingColumn = document.getElementById("pendingColumn");
const completedColumn = document.getElementById("completedColumn");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressPercent = document.getElementById("progressPercent");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let chart;

addTaskBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);

function addTask() {

    if(taskTitle.value.trim() === ""){
        alert("Enter Task");
        return;
    }

    tasks.push({
        id: Date.now(),
        title: taskTitle.value,
        category: category.value,
        priority: priority.value,
        dueDate: dueDate.value,
        completed: false
    });

    saveTasks();

    taskTitle.value = "";
    dueDate.value = "";
}

function saveTasks(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    renderTasks();
}

function toggleTask(id){

    const task = tasks.find(
        t => t.id == id
    );

    if(task){
        task.completed = !task.completed;
    }

    saveTasks();
}

function deleteTask(id){

    tasks = tasks.filter(
        t => t.id != id
    );

    saveTasks();
}

function editTask(id){

    const task = tasks.find(
        t => t.id == id
    );

    if(!task) return;

    const newTitle = prompt(
        "Edit Task",
        task.title
    );

    if(newTitle){
        task.title = newTitle;
        saveTasks();
    }
}

function createTaskCard(task){

    const card = document.createElement("div");

    card.classList.add("task");

    card.innerHTML = `
        <h3>${task.title}</h3>

        <div class="task-info">
            <span>${task.category}</span>
            <span>${task.priority}</span>
            <span>${task.dueDate || "No Date"}</span>
        </div>

        <div class="task-buttons">

            <button class="complete-btn">
                ${task.completed ? "Undo" : "Done"}
            </button>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>

        </div>
    `;

    card.querySelector(".complete-btn")
    .addEventListener("click", () => {
        toggleTask(task.id);
    });

    card.querySelector(".edit-btn")
    .addEventListener("click", () => {
        editTask(task.id);
    });

    card.querySelector(".delete-btn")
    .addEventListener("click", () => {
        deleteTask(task.id);
    });

    return card;
}

function renderTasks(){

    pendingColumn.innerHTML = "";
    completedColumn.innerHTML = "";

    let filtered = tasks.filter(task =>
        task.title.toLowerCase()
        .includes(
            searchInput.value.toLowerCase()
        )
    );

    if(filterStatus.value === "completed"){
        filtered = filtered.filter(
            task => task.completed
        );
    }

    if(filterStatus.value === "pending"){
        filtered = filtered.filter(
            task => !task.completed
        );
    }

    filtered.forEach(task => {

        const card =
            createTaskCard(task);

        if(task.completed){
            completedColumn.appendChild(card);
        }else{
            pendingColumn.appendChild(card);
        }

    });

    updateStats();
    updateChart();
}

function updateStats(){

    const total = tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const pending =
        total - completed;

    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;

    progressPercent.textContent =
        total === 0
        ? "0%"
        : Math.round(
            completed / total * 100
        ) + "%";
}

function updateChart(){

    const canvas =
        document.getElementById(
            "taskChart"
        );

    if(!canvas) return;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const pending =
        tasks.length - completed;

    if(chart){
        chart.destroy();
    }

    chart = new Chart(
        canvas,
        {
            type:"doughnut",
            data:{
                labels:[
                    "Completed",
                    "Pending"
                ],
                datasets:[{
                    data:[
                        completed,
                        pending
                    ]
                }]
            }
        }
    );
}

renderTasks();