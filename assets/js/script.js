var formEl = document.querySelector("#task-form");
// Select the Unordered List
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var tasks = [];

var taskFormHandler = function() {
    // Stops button from submitting data and refreshing page
    event.preventDefault();
    // Storing the values of the input and dropdown box in variables
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
      alert("You need to fill out the task form!");
      return false;
    }
    var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
      var taskId = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
    // Package data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };

    createTaskEl(taskDataObj);
    }
    formEl.reset();
 }

var createTaskEl = function(taskDataObj) {
  // Adding an li to the UL with class task-item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // Add task ID as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);
  listItemEl.setAttribute("draggable", "true");

  // Creating a div below the li with class task-info
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  // Inserting HTML to display stored values of Input and Dropdown
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" +
    taskDataObj.type + "</span>";

  // Pass in the counter ID to the associate the actions task
  var taskActionsEl = createTaskActions(taskIdCounter);
  // Create the task info
  listItemEl.appendChild(taskInfoEl);
  // Create the task actions bar
  listItemEl.appendChild(taskActionsEl);

  // Create the entire to-do
  tasksToDoEl.appendChild(listItemEl);

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  saveTasks();

  // Increment taskID counter by 1
  taskIdCounter++;
}

var createTaskActions = function(taskId) {
  // Create container to hold buttons
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // Create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  // Add button to container
  actionContainerEl.appendChild(editButtonEl);

  // Create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  // Add delete button to container
  actionContainerEl.appendChild(deleteButtonEl);

  // Create dropdown
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  // Add dropdown to container
  actionContainerEl.appendChild(statusSelectEl);

  // Array holds choices to be added for select
  // Makes it easier to add additional options later on (e.g, email to-do to someone)
  var statusChoices = ["To Do", "In Progress", "Completed"];
  
  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
  
    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;  
}

var taskButtonHandler = function() {
  // get target element from event
  var targetEl = event.target;

  // delete button was clicked
  if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }

  // edit button was clicked
  else if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
}

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  // create array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if task[i].id doesn't match the value of taskId, let's keep that task and push it into
    // the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be in the same array as updatedTaskArr
  tasks = updatedTaskArr;
  saveTasks();
}

var editTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  document.querySelector("input[name='task-name']").value = taskName;

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("select[name='task-type']").value = taskType;

  document.querySelector("#save-task").textContent = "Save Task";
}

var completeEditTask = function(taskNameInput, taskTypeInput, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  // update task's in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      // At each iteration of this for loop, we are checking to see if that individual task's id property matches the taskId argument we passed into completeEditTask().
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  formEl.removeAttribute("#data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
  saveTasks();
}

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
  
    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") {
      tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
      tasksCompletedEl.appendChild(taskSelected);
    }
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
      }
    }
  saveTasks();
}

var dragTaskHandler = function(event) {
  // Grab the task ID of the item we're dragging
  var taskId = event.target.getAttribute("data-task-id");
  // Stores the taskID in the dataTransfer property of the event
  event.dataTransfer.setData("text/plain", taskId);
  // Verifies that we've gotten the data from dataTransfer
  var getId = event.dataTransfer.getData("text/plain");
} 

var dropZoneDragHandler = function() {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    event.preventDefault();
    taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
  }
}

var dropTaskHandler = function() {
  var id = event.dataTransfer.getData("text/plain");
  var draggableElement = document.querySelector("[data-task-id='" + id + "']"); 
  var dropZoneEl = event.target.closest(".task-list");
  var statusType = dropZoneEl.id;
  var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
  if (statusType === "tasks-to-do") {
    // Changes the selected index to display in dropdown menu
    statusSelectEl.selectedIndex = 0;
  } 
  else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
  } 
  else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
  }
  dropZoneEl.appendChild(draggableElement);
  dropZoneEl.removeAttribute("style");
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(id)) {
      tasks[i].status = statusSelectEl.value.toLowerCase();
    }
  }
  saveTasks();
}

var dragLeaveHandler = function() {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    taskListEl.removeAttribute("style");
  }
}

var saveTasks = function() {
  // Stores the tasks data as a string
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
  // Obtain task items from localStorage
  tasks = localStorage.getItem("tasks");
  if (tasks === null) {
    localStorage.setItem("tasks", []);
    return false;
  }
  // Convert from string back into array
  tasks = JSON.parse(tasks);

  // Iterate through array and create task elements on page
  for (var i = 0; i < tasks.length; i++) {
    taskIdCounter = tasks[i].id;
    console.log(taskIdCounter);

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", true);
    console.log(listItemEl);
  
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(tasks[i].id)
    listItemEl.appendChild(taskActionsEl);

    if (tasks[i].status === "to do") {
      listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.appendChild(listItemEl);
    } else if (tasks[i].status === "in progress") {
      listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.appendChild(listItemEl);
    } else if (tasks[i].status === "completed") {
      listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.appendChild(listItemEl);
    }

    taskIdCounter++;
  }
}

loadTasks();

pageContentEl.addEventListener("click", taskButtonHandler);
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);














































// // var buttonEl = document.querySelector("#save-task");
// var formEl = document.querySelector("#task-form");
// var tasksToDoEl = document.querySelector("#tasks-to-do");
// var taskIdCounter = 0;
// var pageContentEl = document.querySelector("#page-content");





// var taskFormHandler = function (event) {

//   event.preventDefault();

//   var taskNameInput = document.querySelector("input[name='task-name']").value;
//   var taskTypeInput = document.querySelector("select[name= 'task-type']").value;

  
//   var isEdit = formEl.hasAttribute("data-task-id");

  
//   //has data attribute, so get task id and call function to complete edit process
//   if (isEdit) {
//     var taskId = formEl.getAttribute("data-task-id");
//     completeEditTask(taskNameInput, taskTypeInput, taskId);
//   }
//   //no data attribute, so create object as normal and pass to createTaskEl function
//   else {
//     var taskDataObj = {
//       name: taskNameInput,
//       type: taskTypeInput
//     };

//     createTaskEl(taskDataObj);
//   }

//   //  // check if input values are empty strings
//   //  if (!taskNameInput || !taskTypeInput) {
//   //    alert("You need to fill out the task form!");
//   //    return false;
//   //  }


//     // formEl.reset();
// };
  
//   var completeEditTask = function(taskName, taskType, taskId) {
//     //find the matching task list item
//     var taskSelected =  document.querySelector(".task-item[data-task-id='" + taskId + "']");

//     //set new values
//     taskSelected.querySelector("h3.task-name").textContent = taskName;
//     taskSelected.querySelector("span.task-type").textContent = taskType;

//     alert("Task Updated!");

//     formEl.removeAttribute("#data-task-id");
//     document.querySelector("#save-task").textContent = "Add Task";


//   };

//   var createTaskEl = function (taskDataObj) {
//     // create list item
//     var listItemEl = document.createElement("li");
//     listItemEl.className = "task-item";

//     //add task id as custome attribute
//     listItemEl.setAttribute("data-task-id", taskIdCounter);

//     // create div to hold task info and add to list item
//     var taskInfoEl = document.createElement("div");
//     // give it a class name
//     taskInfoEl.className = "task-info";
//     // add HTML content to div
//     taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

//     listItemEl.appendChild(taskInfoEl);

//     var taskActionsEl = createTaskActions(taskIdCounter);
//     //  console.log(taskActionsEl);
//     listItemEl.appendChild(taskActionsEl);
//     // add entire list item to list
//     tasksToDoEl.appendChild(listItemEl);

//     //increase task counter for next unique id
//     taskIdCounter++;
//   };

//   var createTaskActions = function (taskId) {
//     var actionContainerEl = document.createElement("div");
//     actionContainerEl.className = "task-actions";

//     // create edit button
//     var editButtonEl = document.createElement("button");
//     editButtonEl.textContent = "Edit";
//     editButtonEl.className = "btn edit-btn";
//     editButtonEl.setAttribute("data-task-id", taskId);

//     actionContainerEl.appendChild(editButtonEl);

//     //create delete button
//     var deleteButtonEl = document.createElement("button");
//     deleteButtonEl.textContent = "Delete";
//     deleteButtonEl.className = "btn delete-btn";
//     deleteButtonEl.setAttribute("data-task-id", taskId);

//     actionContainerEl.appendChild(deleteButtonEl);

//     var statusSelectEl = document.createElement("select");
//     statusSelectEl.className = "select-status";
//     statusSelectEl.setAttribute("name", "status-change");
//     statusSelectEl.setAttribute("data-task-id", taskId);

//     actionContainerEl.appendChild(statusSelectEl);

//     var statusChoices = ["To Do", "In Progress", "Completed"];
//     for (var i = 0; i < statusChoices.length; i++) {
//       //create option element
//       var statusOptionEl = document.createElement("option");
//       statusOptionEl.textContent = statusChoices[i];
//       statusOptionEl.setAttribute("value", statusChoices[i]);

//       //append to select
//       statusSelectEl.appendChild(statusOptionEl);
//     }

//     return actionContainerEl;

//   };

//   formEl.addEventListener("submit", taskFormHandler);
//   // var listItemEl = document.createElement("li");
//   // listItemEl.className = "task-item";
//   // listItemEl.textContent = "This is a new task.";
//   // tasksToDoEl.appendChild(listItemEl);

//   var editTask = function (taskId) {
//     //get task list item
//     var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

//     //get content from task name and type
//     var taskName = taskSelected.querySelector("h3.task-name").textContent;
//     document.querySelector("input[name='task-name']").value = taskName;

//     var taskType = taskSelected.querySelector("span.task-type").textContent;
//     document.querySelector("select[name='task-type']").value = taskType;

//     document.querySelector("#save-task").textContent = "Save Task";

//     formEl.setAttribute("data-task-id", taskId);
//   };

//   var deleteTask = function (taskId) {
//     var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
//     taskSelected.remove();
//   };

//   var taskButtonHandler = function (event) {
//     console.log(event.target);
//     //get target element from event
//     var targetEl = event.target;

//     //edit button was clicked
//     if (targetEl.matches(".edit-btn")) {
//       var taskId = targetEl.getAttribute("data-task-id");
//       editTask(taskId);
//     }

//     //deleted button was clicked
//     else if (targetEl.matches(".delete-btn")) {
//       var taskId = targetEl.getAttribute("data-task-id");
//       deleteTask(taskId);
//     }
//   };

//   pageContentEl.addEventListener("click", taskButtonHandler)