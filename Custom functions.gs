function updateOnSheet(sheetname,content,header) {
  var S = SpreadsheetApp.getActiveSpreadsheet();
  if(!S.getSheetByName(sheetname)) {
    S.insertSheet(sheetname);
  }
  var ss = S.getSheetByName(sheetname);
  ss.getRange(1, 1, header.length, header[0].length).setValues(header);
  ss.getRange(2, 1, content.length, content[0].length).setValues(content);
  var lastRow = ss.getLastRow();
  var lastCol = ss.getLastColumn();
  var maxRow = ss.getMaxRows();
  var maxCol = ss.getMaxColumns();
  var trimGap = 1;
  try {
  ss.deleteRows(lastRow + trimGap, maxRow - (lastRow + trimGap));
  ss.deleteColumns(lastCol + trimGap, maxCol - (lastCol + trimGap));
  }
  catch (err) {
    Logger.log('The rows or columns were out of boounds or this is the exact error' + err);
  }
}

function fetchRequests(url) {
//  var userUrl = 'https://api.clickup.com/api/v1/user' //Get the user that belongs to this token - works
//  var authorizedTeamUrl = 'https://api.clickup.com/api/v1/team' //Get the authorized teams for this token - works
  var headers = {
    "Authorization": "pk_AZTHMB3QKNGX6W0UW1PQZTFZVQ8JONVM"
  }
  var options = {
    "method" : "GET",
    'headers': headers,
    "contentType" : "application/json",
    "muteHttpExceptions": true
  };
  var request = UrlFetchApp.fetch(url, options);
  return request;
}
function parseTasksWithPages(page_url,teamId,no_of_tasks_to_nearest_hundred,sheetname) {
  var sheetname = sheetname || 'try';
  var results = getMyAllTasksWithPages(page_url,teamId,no_of_tasks_to_nearest_hundred);
  var header = [results[0]];
  var content = results.splice(1);
  updateOnSheet(sheetname,content,header);
  return content;
}

/**
* Retrieves all tasks from clickup.
*
* @param {string} page_url The task API url. Example "'https://api.clickup.com/api/v1/team/{teamId}/task?page='"
* @param {number or string in double quotes e.g. 123456 or "123456"} teamId The team Id.
* @param {number} no_of_tasks_to_nearest_hundred The number of tasks to return rounded to the nearest hundred(s). Example, 120 rounds to last 200 tasks.
* @return An array of all tasks matching the query criteria
* @customfunction
*/
function getMyAllTasksWithPages(page_url,teamId,no_of_tasks_to_nearest_hundred) {
  var teamId = teamId || 756304;
  // Version2: Edit this to use the full API url for getting task and use a regex to replace the various parameters in the API url.
  var page_url = page_url || 'https://api.clickup.com/api/v1/team/' + teamId + '/task?page=';
  var no_of_tasks_to_nearest_hundred = no_of_tasks_to_nearest_hundred || Number(999);

  var parentTasks = [];
  var creators = [];
  var date_updated = [];
  var date_created = [];
  var due_date = [];
  var assignee1 = [];
  var assignee2 = [];
  var tag1 = [];
  var tag2 = [];
  var projectId = [];
  var listId = [];
  var spaceId = [];
  var assignees = [];
  var tags = [];
  var url = [];
  var tags = [];
  var taskName = [];
  var taskId = [];
  var status = [];
  var start_date = [];
  var errCount = 0;
  var startPage = 0;
  var endPage = Math.floor((Number(no_of_tasks_to_nearest_hundred) - 1)/100);
  fetchTasksinAllPages:
  for (var p = startPage; p <= endPage; p++) {
    try {
      var page_url2 = page_url + p;
      var response = fetchRequests(page_url2);
      var dataAll = JSON.parse(response.getContentText()); //
      var mmdata = dataAll.tasks;
      for (i in mmdata){
        parentTasks.push(mmdata[i].parent);
        creators.push(mmdata[i].creator.username);
        date_updated.push(mmdata[i].date_updated);
        date_created.push(mmdata[i].date_created);
        due_date.push(mmdata[i].due_date);
        assignees = mmdata[i].assignees;
        var assigneesTemp = [];
        for (j in assignees) {
          assigneesTemp[j] = assignees[j].username;
        }
        assignee1.push(assigneesTemp[0] == undefined ? null : assigneesTemp[0]);
        assignee2.push(assigneesTemp[1] == undefined ? null : assigneesTemp[1]);
        tags = mmdata[i].tags;
        var tagsTemp = [];
        for (j in tags) {
          tagsTemp[j] = tags[j].username;
        }
        tag1.push(tagsTemp[0] == undefined ? null : tagsTemp[0]);
        tag2.push(tagsTemp[1] == undefined ? null : tagsTemp[1]);
        projectId.push(mmdata[i].project.id);
        listId.push(mmdata[i].list.id);
        spaceId.push(mmdata[i].space.id);
        url.push(mmdata[i].url);
        tags.push(mmdata[i].tags);
        taskName.push(mmdata[i].name);
        taskId.push(mmdata[i].id);
        status.push(mmdata[i].status.status);
        start_date.push(mmdata[i].start_date);
      }
    }
    catch(err) {
      Logger.log('page ' + p + ' does not exist');
      errCount++;
    }
    finally {
      if (errCount == 5) {
        Logger.log('in finally block, page is ' + p);
        break fetchTasksinAllPages;
      }
    }
  }
  date_updated = convertDate(date_updated);
  date_created = convertDate(date_created);
  start_date = convertDate(start_date);
  due_date = convertDate(due_date);
  
  var Spaces = getMySpacesId(teamId);
  var Lists = getMyListsId(teamId,Spaces)
  var projectNames = lookupProjectsId(projectId,teamId,Spaces);
  var listNames = myVlookup(listId, Lists,1,2);
  var spaceNames = myVlookup(spaceId, Spaces,1,2);

  var header = transpose([['taskName'],['taskId'],['parentTasks'],['creators'],['date_updated'],['date_created'],['start_date'],['due_date'],['assignee1'],['assignee2'],['projectId'],['listId'],['spaceId'],['tag1'],['tag2'],['url'],['status'],['spaceNames'],['projectNames'],['listNames']]);
  var content = transpose([taskName,taskId,parentTasks,creators,date_updated,date_created,start_date,due_date,assignee1,assignee2,projectId,listId,spaceId,tag1,tag2,url,status,spaceNames,projectNames,listNames]);
  var results = header.concat(content);
  return results;
}

function parseTasks(sheetname,response,teamId) {
  var dataAll = JSON.parse(response.getContentText()); //
  var mmdata = dataAll.tasks;
  var parentTasks = [];
  var creators = [];
  var date_updated = [];
  var date_created = [];
  var due_date = [];
  var assignee1 = [];
  var assignee2 = [];
  var tag1 = [];
  var tag2 = [];
  var projectId = [];
  var listId = [];
  var spaceId = [];
  var assignees = [];
  var tags = [];
  var url = [];
  var tags = [];
  var taskName = [];
  var taskId = [];
  var status = [];
  var start_date = [];
  for (i in mmdata){
    parentTasks[i] = mmdata[i].parent;
    creators[i] = mmdata[i].creator.username;
    date_updated[i] = mmdata[i].date_updated;
    date_created[i] = mmdata[i].date_created;
    due_date[i] = mmdata[i].due_date;
    assignees = mmdata[i].assignees;
    var assigneesTemp = [];
    for (j in assignees) {
      assigneesTemp[j] = assignees[j].username;
    }
    assignee1[i] = assigneesTemp[0] == undefined ? null : assigneesTemp[0];
    assignee2[i] = assigneesTemp[1] == undefined ? null : assigneesTemp[1];
    tags = mmdata[i].tags;
    var tagsTemp = [];
    for (j in tags) {
      tagsTemp[j] = tags[j].username;
    }
    tag1[i] = tagsTemp[0] == undefined ? null : tagsTemp[0];
    tag2[i] = tagsTemp[1] == undefined ? null : tagsTemp[1];
    projectId[i] = mmdata[i].project.id;
    listId[i] = mmdata[i].list.id;
    spaceId[i] = mmdata[i].space.id;
    url[i] = mmdata[i].url;
    tags[i] = mmdata[i].tags;
    taskName[i] = mmdata[i].name;
    taskId[i] = mmdata[i].id;
    status[i] = mmdata[i].status.status;
    start_date[i] = mmdata[i].start_date;
  }
  date_updated = convertDate(date_updated);
  date_created = convertDate(date_created);
  start_date = convertDate(start_date);
  due_date = convertDate(due_date);

  var header = transpose([['taskName'],['taskId'],['parentTasks'],['creators'],['date_updated'],['date_created'],['start_date'],['due_date'],['assignee1'],['assignee2'],['projectId'],['listId'],['spaceId'],['tag1'],['tag2'],['url'],['status']]);
  var content = transpose([taskName,taskId,parentTasks,creators,date_updated,date_created,start_date,due_date,assignee1,assignee2,projectId,listId,spaceId,tag1,tag2,url,status]);
  updateOnSheet(sheetname,content,header);
}

function convertDate(epochDate) {
  var convertedDate = epochDate.map(function(row) {
    return (row == null ? null : new Date(Number(row)));
  })
  return convertedDate;
}
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function transpose(a) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) {
        return r[c];
    });
  });
}