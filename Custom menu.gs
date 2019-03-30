function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom menu')
    .addItem('Get all tasks', 'getAllTasks')
    .addItem('🐤Get all tasks with pages', 'getAllTasksWithPages')
    .addItem('Get all lists', 'getListsId')
    .addItem('Get all projects', 'getProjectsId')
    .addItem('Get all spaces', 'getSpacesId')
    .addItem('Get all assignees', 'getAssigneesId')
    .addItem('Create Task', 'createTask')
    .addToUi()
}