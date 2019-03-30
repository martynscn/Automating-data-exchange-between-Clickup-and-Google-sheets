function createTask() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sss = ss.getSheetByName('Create Tasks');
  var startRow = 3;
  var startCol = 7;
  var numRows = sss.getRange('a3:a').getValues().filter(function(row) {return row[0] !== ''}).length;
  var numColumns = sss.getLastColumn() - startCol + 1;
  var tasks = sss.getRange(startRow, startCol, numRows, numColumns).getValues();
  var newTaskid = [];
  var updatedOnClickupAffirm_new = [];
  
  for (var task_index = 0; task_index < tasks.length; task_index++) {
//  for (var task_index = 0; task_index < 6; task_index++) {
    var currentTask = tasks[task_index];
    var taskName = currentTask[0];
    var taskContent = currentTask[1];
    var due_date = currentTask[2];
    var listId = currentTask[3];
    var assignees = currentTask.slice(4, 5);
    var priority = currentTask[6];
    var status = currentTask[7];
    var updateTask_Quest = currentTask[8];
    var updatedOnClickupAffirm = currentTask[9];
    var oldTaskId = currentTask[10];
    if(updatedOnClickupAffirm != 'Yes' && updateTask_Quest == true) {
      var tempTaskId = CreateTaskRequest(url = null,listId,taskName, taskContent, assignees = null, status, priority,due_date).getContentText();
      newTaskid[task_index] = JSON.parse(tempTaskId).id;
      updatedOnClickupAffirm_new[task_index] = 'Yes';
    } else {
      newTaskid[task_index] = oldTaskId;
      updatedOnClickupAffirm_new[task_index] = updatedOnClickupAffirm;
    }

  }
  var updateData = transpose([updatedOnClickupAffirm_new].concat([newTaskid]));
  sss.getRange(startRow, 16, updateData.length, updateData[0].length).setValues(updateData) // later use index of to get the index of the column
}

function CreateTaskRequest(url,listId,taskName, taskContent, assignees, status, priority,due_date) {
  var listId = listId || '849413';
  var url = url || 'https://api.clickup.com/api/v1/list/' + listId + '/task';
  var headers = {
    "Authorization" : "pk_AZTHMB3QKNGX6W0UW1PQZTFZVQ8JONVM"
  };
  var taskName = taskName || "No task";
  var taskContent = taskContent || "";
  var assignees = assignees || [758773]; // [758773,1824468]
  var status = status || "Open";
  var priority = priority || 3;
  var due_date = due_date || +((new Date()).addDays(7));
  var body = {
      "name" : taskName,
      "content" : taskContent,
      "assignees" : assignees,
      "status" : status,
      "priority" : priority,
      "due_date" : due_date
  };
  var stringifiedBody = JSON.stringify(body);
    var options = {
      "method" : "POST",
      'headers': headers,
      "contentType" : "application/json",
      "muteHttpExceptions": true,
      "payload": stringifiedBody
    };
  var request = UrlFetchApp.fetch(url, options);
  Logger.log(request);
  return request;
}

function testEpochDate() {
  var date = new Date();
  var date2 = +(date.addDays(6));
  var date3 = +((new Date()).addDays(7));
  Logger.log(date3);
}






