var pcProductCatalogServerURL = "http://18.216.132.146:8080/productCatalog";
var rsPurchasedProductsServerURL = "http://localhost:3000/rspurchased";
var rsSearchedProductsServerURL = "http://localhost:3000/rssearched";
//var uaSearchLogsServerURL = "http://localhost:3000/searchlogs";


// Get Previous Purchase Details
function rsGetPurchasedProducts(userid){

	$.ajax({
	   url: rsPurchasedProductsServerURL+'/'+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
	    console.log("Purchase Details");
      var jsonStr = JSON.stringify(data);
      console.log(jsonStr);
      $("div#user").append(jsonStr);

	   },
	   dataType: "json"
	});
}

function uaGetSearchedProducts(userid){

	$.ajax({
	   url: rsSearchedProductsServerURL+'/'+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
       console.log("Search Details");
       var jsonStr = JSON.stringify(data);
       console.log(jsonStr);
       $("div#cart").append(jsonStr);

	   },
	   dataType: "json"
	});
}

/* To display all the details of the product on a single page */
function pcGetProductDetail(productId){

	$.ajax({
		   url: pcProductCatalogServerURL + '/product/' + productId,
		   error: function(xhr, status, error) {
		      console.log(xhr.responseText);
		   },
		   success: function(data) {
		    $("#product-title").text(data.title);
		    $("#product-description").text(data.description);
		    $("#product-price").text("$" + data.price);
		    $("#product-category").text(data.category);
		    $("#product-image").attr("src", data.imageURL);
		    $("#product-id").val(data.id);
		   },
		   dataType: "json"
		});
}