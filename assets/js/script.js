// var buttonEl = document.querySelector("#save-task");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");


var createTaskHandler = function(event) {
    //buttonEl.addEventListener("click", createTaskHandler);
   
    event.preventDefault();

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "this is a new task.";
    tasksToDoEl.appendChild(listItemEl);
};


formEl.addEventListener("submit", createTaskHandler); 
    // var listItemEl = document.createElement("li");
    // listItemEl.className = "task-item";
    // listItemEl.textContent = "This is a new task.";
    // tasksToDoEl.appendChild(listItemEl);


