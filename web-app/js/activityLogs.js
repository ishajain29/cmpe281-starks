var uaUserLogsServerURL = "http://localhost:3000/userlogs";
var uaCartLogsServerURL = "http://localhost:3000/cartlogs";
var uaSearchLogsServerURL = "http://localhost:3000/searchlogs";

/* Fetch User Logs */
function uaGetUserLogs(){

	$.ajax({
	   url: uaUserLogsServerURL+'/'+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
	    console.log("User Logs");
      var jsonStr = JSON.stringify(data);
      console.log(jsonStr);
      $("div#user").append(jsonStr);

	   },
	   dataType: "json"
	});
}

function uaGetCartLogs(){

	$.ajax({
	   url: uaCartLogsServerURL+'/'+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
       console.log("Cart Logs");
       var jsonStr = JSON.stringify(data);
       console.log(jsonStr);
       $("div#cart").append(jsonStr);

	   },
	   dataType: "json"
	});
}

function uaGetSearchLogs(){

	$.ajax({
	   url: uaSearchLogsServerURL+'/'+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
       console.log("Search Logs");
       var jsonStr = JSON.stringify(data);
       console.log(jsonStr);
       $("div#search").append(jsonStr);

	   },
	   dataType: "json"
	});
}
