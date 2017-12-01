var uaUserLogsServerURL = "http://13.57.108.136/userlogs";
var uaCartLogsServerURL = "http://13.57.108.136/cartlogs";
var uaSearchLogsServerURL = "http://13.57.108.136/searchlogs";
var userid = localStorage.getItem('userid');

/* Fetch User Logs */
function uaGetUserLogs(){

	$.ajax({
	   url: uaUserLogsServerURL+"/"+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
	    console.log("User Logs");
      var jsonStr = JSON.stringify(data);
      console.log(jsonStr);
			createDomUser(data);

	   },
	   dataType: "json"
	});
}

	function createDomUser(data){
		$("div#user div .logstable").text('');
			var htmlStr="<ul>";
			for(var i = 0; i < data.length; i++){
				var str="";
				str="You "+data[i].activity+" at "+data[i].timestamp+" on "+data[i].date;
				htmlStr = htmlStr + "<li>" + str + "</li>";
			}

			$("div#user div .logstable").append(htmlStr);
	}


 function uaGetCartLogs(){

	$.ajax({
	   url: uaCartLogsServerURL+"/"+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
       console.log("Cart Logs");
      var jsonStr = JSON.stringify(data);
      createDomCart(data);
	   },
	   dataType: "json"
	});
}

function createDomCart(data){
$("div#cart div .logstable").text('');

	var htmlStr="<ul>";

	for(var i = 0; i < data.length; i++){
		console.log(data[i]);
		var str="";
	if(data[i].cartname!="null") {
			if(data[i].activity=="Cart Created"){

 				str = "You created a shared cart"+" - "+data[i].cartname+" at "+data[i].timestamp+" on "+data[i].date;
				htmlStr=htmlStr+"<li>"+str+"</li>";
			}
			else if (data[i].activity=="Product Added"){

				str = "You added a product"+" - "+data[i].products.name+" to "+data[i].cartname+" at "+data[i].timestamp+" on "+data[i].date;
				htmlStr=htmlStr+"<li>"+str+"</li>";
			}

			else if(data[i].activity=="Product Removed") {
				str = "You removed a product -"+data[i].products.name+" from the cart "+data[i].cartname+" at "+data[i].timestamp+" on "+data[i].date;
				htmlStr=htmlStr+"<li>"+str+"</li>";
			}

			else if(data[i].activity=="Product Updated"){
				str = "You updated a product -"+data[i].products.name+ " in the cart "+data[i].cartname+" at "+data[i].timestamp+" on "+data[i].date;
				htmlStr=htmlStr+"<li>"+str+"</li>";
			}

			else if(data[i].activity=="User Added"){
				str = "You added user(s)- "+data[i].groupusers+ " to the shared cart "+data[i].cartname+" at "+data[i].timestamp+" on "+data[i].date;
				htmlStr=htmlStr+"<li>"+str+"</li>";
			}

			else if(data[i].activity=="User Removed"){
				str = "You removed a user "+data[i].groupusers+ "from the shared cart "+data[i].cartname+" at "+data[i].timestamp+" on "+data[i].date;
				htmlStr=htmlStr+"<li>"+str+"</li>";
			}

			else if(data[i].activity=="Order Placed"){
				str = "You placed an order - "+data[i].cartname+" at "+data[i].timestamp+" on "+data[i].date;
				htmlStr=htmlStr+"<li>"+str+"</li>";
			}
	 }
	 else{
		 if (data[i].activity=="Product Added"){
			  str = "You added a product"+ " - "+data[i].products.name +" to your user cart at "+data[i].timestamp+" on "+data[i].date;
			 	htmlStr=htmlStr+"<li>"+str+"</li>";
		 }

		 else if(data[i].activity=="Product Removed"){
			  str = "You removed a product -"+data[i].products.name+" from your user cart at "+data[i].timestamp+" on "+data[i].date;
				htmlStr=htmlStr+"<li>"+str+"</li>";
		 }

		 else if(data[i].activity=="Product Updated"){
			  str = "You updated a product -"+data[i].products.name+ " in your user cart at "+data[i].timestamp+" on "+data[i].date;
				htmlStr=htmlStr+"<li>"+str+"</li>";
		 }

		 else if(data[i].activity=="Order Placed"){
			 str = "You placed an order from your user cart at "+data[i].timestamp+" on "+data[i].date;
			 htmlStr=htmlStr+"<li>"+str+"</li>";
		 }
	 }
 }

htmlStr=htmlStr+"</ul>";

$("div#cart div .logstable").append(htmlStr);
}


function uaGetSearchLogs(){

	$.ajax({
	   url: uaSearchLogsServerURL+"/"+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
       console.log("Search Logs");
       var jsonStr = JSON.stringify(data);
       console.log(jsonStr);
			 createDomSearch(data);

	   },
	   dataType: "json"
	});
}

function createDomSearch(data){
$("div#search div .logstable").text('');
var htmlStr="<ul>";

for(var i = 0; i < data.length; i++){
			str="You searched for "+data[i].keyword+" at "+data[i].timestamp+" on "+data[i].date;
			htmlStr = htmlStr + "<li>" + str + "</li>";
			console.log(data[i]);

		}
		htmlStr = htmlStr + "</ul>";
		$("div#search div .logstable").append(htmlStr);

}
