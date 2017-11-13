var usUserRegisterServerURL = "http://localhost:3000/register";
var uaUserLoginServerURL = "http://localhost:3000/login";
var uaUserIdServerURL = "http://localhost:3000/user";

/* Fetch User Details */
function usGetLogin(){

	$.ajax({
		type: "GET",
		url: usUserLoginServerURL,
		contentType: "application/json"
		error: function(xhr, status, error) {
			console.log(xhr.responseText);
		},
		success: function(data) {
			console.log("Registered");
			var jsonStr = JSON.stringify(data);
			console.log(jsonStr);
		},
		dataType: "json"
	});
}

function usGetRegistration(){

	$.ajax({
	   url: uaCartLogsServerURL,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
	       console.log("Cart Logs");
	       var jsonStr = JSON.stringify(data);
	       console.log(jsonStr);
	   },
	   dataType: "json"
	});
}

function uaGetSearchLogs(){

	$.ajax({
	   url: uaSearchLogsServerURL,
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