// var buttonEl = document.querySelector("#save-task");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");


var createTaskHandler = function(event) {
  //buttonEl.addEventListener("click", createTaskHandler);
   
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name= 'task-type']").value;
    // console.log(taskTypeInput);

    // var listItemEl = document.createElement("li");
    // listItemEl.className = "task-item";
    // listItemEl.textContent = taskNameInput;
    // tasksToDoEl.appendChild(listItemEl);

    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";

    listItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);




    // //buttonEl.addEventListener("click", createTaskHandler);
   
    // event.preventDefault();

    // var taskNameInput = document.querySelector("input[name='task-name']").value;
    // var taskTypeInput = document.querySelector("select[name= 'task-type']").value;
    // console.log(taskTypeInput);

    // var listItemEl = document.createElement("li");
    // listItemEl.className = "task-item";
    // listItemEl.textContent = taskNameInput;
    // tasksToDoEl.appendChild(listItemEl);
};


formEl.addEventListener("submit", createTaskHandler); 
    // var listItemEl = document.createElement("li");
    // listItemEl.className = "task-item";
    // listItemEl.textContent = "This is a new task.";
    // tasksToDoEl.appendChild(listItemEl);


