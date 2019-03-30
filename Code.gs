function getAllTasks() {
  // version666
  var teamId = 756304;
  var url = 'https://api.clickup.com/api/v1/team/' + teamId + '/task?page=';
  var p = 0;
  var page_url = url + p;
  var sheetname = 'all_tasks';
  var response = fetchRequests(page_url);
  parseTasks(sheetname,response,teamId);

}

function getAllTasksWithPages() {
    var teamId = 756304;
    var page_url = 'https://api.clickup.com/api/v1/team/' + teamId + '/task?page=';
    var no_of_tasks_to_nearest_hundred = Number(99);
    var sheetname = 'all_tasks_with_pages';
    Logger.log('entering parseTasksWithPages');
    parseTasksWithPages(page_url,teamId,no_of_tasks_to_nearest_hundred,sheetname);
}

function getListsId(teamId,Spaces) {
  var sheetname = 'listsId';
  var results = getMyListsId(teamId);
  var header = [results[0]];
  var content = results.splice(1);
  updateOnSheet(sheetname,content,header);
  return content;
}

/**
* Retrieves all lists from clickup.
*
* @param {number or string in double quotes e.g. 123456 or "123456"} teamId The team Id.
* @param {string or array} Spaces The space(s) to search through. A single space (in the case of one space) or an array of spaces which could be the output of calling getMySpacesId(teamId).
* @return An array of all lists.
* @customfunction
*/
function getMyListsId(teamId,Spaces) {
  var teamId = teamId || 756304;
  var Spaces = Spaces || getMySpacesId(teamId);
  var mySpaces = transpose(Spaces)[0];
  var ProjectId = [];
  var ProjectName = [];
  var listsId = [];
  var listsName = [];
  for (id in mySpaces) {
    var spaceId = mySpaces[id];
    var url = 'https://api.clickup.com/api/v1/space/' + spaceId +'/project';
    var response = fetchRequests(url);
    var dataAll = JSON.parse(response.getContentText());
    var mmdata = dataAll.projects;
    for (i in mmdata){
      var mmdataList = mmdata[i].lists;
      for (j in mmdataList) {
        listsId.push(mmdataList[j].id);
        listsName.push(mmdataList[j].name);
        ProjectId.push(mmdata[i].id);
        ProjectName.push(mmdata[i].name);
      }
    }
  }
  var header = transpose([['List ID'],['List Name'],['Project Name'],['Project Id']]);
  var content = transpose([listsId,listsName,ProjectName,ProjectId]);
  var results = header.concat(content);
  return results;
}

function getProjectsId(teamId,Spaces) {
  var sheetname = 'projectId';
  var results = getMyProjectsId(teamId);
  var header = [results[0]];
  var content = results.splice(1);
  updateOnSheet(sheetname,content,header);
  return content;
}
/**
* Retrieves all projects from clickup.
*
* @param {number or string in double quotes e.g. 123456 or "123456"} teamId The team Id.
* @param {string or array} Spaces The space(s) to search through. A single space (in the case of one space) or an array of spaces which could be the output of calling getMySpacesId(teamId).
* @return An array of all projects.
* @customfunction
*/
function getMyProjectsId(teamId,Spaces) {
  var teamId = teamId || 756304;
  var Spaces = Spaces || getMySpacesId(teamId);
  var mySpaces = transpose(Spaces)[0];
  var ProjectId = [];
  var ProjectName = [];
  for (id in mySpaces) {
    var spaceId = mySpaces[id];
    var url = 'https://api.clickup.com/api/v1/space/' + spaceId +'/project';
    var response = fetchRequests(url);
    var dataAll = JSON.parse(response.getContentText());
    var mmdata = dataAll.projects;
    for (i in mmdata){
      ProjectId.push(mmdata[i].id);
      ProjectName.push(mmdata[i].name);
    }
  }
  var header = transpose([['Project ID'],['Project Name']]);
  var content = transpose([ProjectId,ProjectName]);
  var results = header.concat(content);
  return results;
}

function getSpacesId(teamId) {
  var sheetname = 'spacesId';
  var teamId = teamId || 756304;
  var results = getMySpacesId(teamId);
  var header = [results[0]];
  var content = results.splice(1);
  updateOnSheet(sheetname,content,header);
  return content;
}

/**
* Retrieves all spaces from clickup.
*
* @param {number or string in double quotes e.g. 123456 or "123456"} teamId The team Id.
* @return An array of all spaces
* @customfunction
*/
function getMySpacesId(teamId) {
  var teamId = teamId || 756304;
  var url = 'https://api.clickup.com/api/v1/team/' + teamId + '/space';
  var response = fetchRequests(url);
  var dataAll = JSON.parse(response.getContentText());
  var mmdata = dataAll.spaces;
  var SpaceId = [];
  var SpaceName = [];
  for (i in mmdata){
    SpaceId[i] = mmdata[i].id;
    SpaceName[i] = mmdata[i].name;
  }
  var header = transpose([['Space ID'],['Space Name']]);
  var content = transpose([SpaceId,SpaceName]);
  var results = header.concat(content);
  return results;
}

function getAssigneesId() {
  var sheetname = 'assigneesId';
  var results = getMyAssigneesId();
  var header = [results[0]];
  var content = results.splice(1);
  updateOnSheet(sheetname,content,header);
  return content;
}

/**
* Retrieves all team members from clickup.
*
* @return An array of all team members
* @customfunction
*/
function getMyAssigneesId() {
  var url = 'https://api.clickup.com/api/v1/team';
  var response = fetchRequests(url);
  var dataAll = JSON.parse(response.getContentText());
  var mmdata = dataAll.teams;
  var TeamId = [];
  var TeamName = [];
  var assigneeId = [];
  var assigneeName = [];
  var assigneeInitials = [];
  for (i in mmdata){
    var mmdataList = mmdata[i].members;
    for (j in mmdataList) {
      assigneeId.push(mmdataList[j].user.id);
      assigneeName.push(mmdataList[j].user.username);
      assigneeInitials.push(mmdataList[j].user.initials);
      TeamId.push(mmdata[i].id);
      TeamName.push(mmdata[i].name);
    }
  }
  var header = transpose([['Team ID'],['Team Name'],['Assignee ID'],['Assignee Name'],['Assignee Initials']]);
  var content = transpose([TeamId,TeamName,assigneeId,assigneeName,assigneeInitials]);
  var results = header.concat(content);
  return results;
}
