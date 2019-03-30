function myFunction() {
  var dayno = 1549969790602;
//new Date( new Date().toUTCString() ).toLocaleString()
// [19-03-10 12:08:02:510 WAT] Sun Mar 10 12:08:02 GMT+01:00 2019  --  new Date()
// [19-03-10 12:08:53:800 WAT] Sun, 10 Mar 2019 11:08:53 GMT  --  new Date().toUTCString()
// [19-03-10 12:10:00:744 WAT] Sun Mar 10 12:10:00 GMT+01:00 2019  --  new Date( new Date().toUTCString())
// [19-03-10 12:11:03:739 WAT] March 10, 2019 12:11:03 PM WAT
// [19-03-10 12:14:43:266 WAT] 1.552216483E12  --  new Date( new Date().toUTCString()).getTime()
  var utcseconds = new Date( new Date().toUTCString()).getTime();
  var d = new Date(0);
  d.setUTCSeconds(utcseconds/1000);
  var convertedDate = new Date(utcseconds);
}

function lookupProjectsId(projectIds,teamId,Spaces) {
  var Projects = getMyProjectsId(teamId,Spaces);
  var result = myVlookup(projectIds, Projects,1,2);
  return result;
}

function myVlookup(sourceArray, tableToLookup,columnToSearch,columnToReturn) {
  var o = [];
  var columnToSearch = Number(columnToSearch - 1);
  var columnToReturn = Number(columnToReturn - 1);
  for (var i = 0; i < sourceArray.length; i++) {
    for (var j = 0; j < tableToLookup.length; j++) {
      if(sourceArray[i] == tableToLookup[j][columnToSearch]) {
        o.push(tableToLookup[j][columnToReturn]);
        break;
      }
    }
  }
  return o;
}


