var pcProductCatalogServerURL = "http://52.14.80.57:8080/productCatalog";
var rsRecommendationsServerURL = "http://13.57.67.164:3000/sampsite";


// Get Previous Purchase Details
function rsGetPurchasedProducts(userid){

	$.ajax({
	   url: rsRecommendationsServerURL+'/'+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
	    	console.log("Purchase Details");
      		console.log(data);

      		var arrProductIds = [];

      		for(var i = 0; i < data.length; i++){
      			arrProductIds.push(data[i].productid);
      		}

      		//var arrProductIds = ["a64cac48-1852-4346-8a64-d2c74f01e6a6", "30650de6-c2b2-4f9a-b7ef-d8c7da16708e", "1a2be279-287d-4c9b-974f-1ef51c918be6"];

		    for(var i = 0; i < arrProductIds.length; i++){
		      	rsGetProductDetailForPurchaseHistory(arrProductIds[i], i + 1);
		    }
  		}
	});
}

function rsGetSearchedProducts(userid){

	$.ajax({
	   url: rsRecommendationsServerURL+'/'+userid,
		error: function(xhr, status, error) {
	        console.log(xhr.responseText);
	    },
	    success: function(data) {
	    	console.log("Searched history Details");
      		console.log(data);

      		var arrProductIds = [];

      		for(var i = 0; i < data.length; i++){
      			arrProductIds.push(data[i].productid);
      		}

      		//var arrProductIds = ["a64cac48-1852-4346-8a64-d2c74f01e6a6", "30650de6-c2b2-4f9a-b7ef-d8c7da16708e", "1a2be279-287d-4c9b-974f-1ef51c918be6"];

		    for(var i = 0; i < arrProductIds.length; i++){
		      	rsGetProductDetailForSearchHistory(arrProductIds[i], i + 1);
		    }
  		}
	});
}

function rsGetCategoryProducts(userid){

	$.ajax({
	   url: rsPurchasedProductsServerURL+'/'+userid,
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
	    	console.log("Category Details");
      		console.log(data);

      		var arrProductIds = [];

      		for(var i = 0; i < data.length; i++){
      			arrProductIds.push(data[i].productid);
      		}

      		//var arrProductIds = ["a64cac48-1852-4346-8a64-d2c74f01e6a6", "30650de6-c2b2-4f9a-b7ef-d8c7da16708e", "1a2be279-287d-4c9b-974f-1ef51c918be6"];

		    for(var i = 0; i < arrProductIds.length; i++){
		      	rsGetProductDetailForPurchaseHistory(arrProductIds[i], i + 1);
		    }
  		}
	});
}


/* To display all the details of the product on a single page */
function rsGetProductDetailForPurchaseHistory(productId, index){

	$.ajax({
		   url: pcProductCatalogServerURL + '/product/' + productId,
		   error: function(xhr, status, error) {
		      console.log(xhr.responseText);
		   },
		   success: function(data) {

		   	var box = "#rsPP_box_" + index; 
		   	var name = "#rsPP_name_" + index;
		   	var price = "#rsPP_price_" + index;
		   	var image = "#rsPP_image_" + index;
		   	var link = "#rsPP_link_" + index;

		   	var inputName = "#rsPP_name_input_" + index;
		   	var inputPrice = "#rsPP_price_input_" + index;
		   	var inputID = "#rsPP_id_input_" + index;
		   	
		   	$(box).addClass("visible");
		    $(name).text(data.title);
		    $(price).text("$" + data.price);
		    $(image).attr("src", data.imageURL);
		    $(link).attr("href", "single.html?id=" + data.id);

		    $(inputName).val(data.title);
		    $(inputPrice).val(data.price);
		    $(inputID).val(data.id);


			var event = new Event('productsloaded');
			document.dispatchEvent(event);
		   },
		   dataType: "json"
		});
}

/* To display all the details of the product on a single page */
function rsGetProductDetailForSearchHistory(productId, index){

	$.ajax({
		   url: pcProductCatalogServerURL + '/product/' + productId,
		   error: function(xhr, status, error) {
		      console.log(xhr.responseText);
		   },
		   success: function(data) {

		   	var box = "#rsSH_box_" + index; 
		   	var name = "#rsSH_name_" + index;
		   	var price = "#rsSH_price_" + index;
		   	var image = "#rsSH_image_" + index;
		   	var link = "#rsSH_link_" + index;

		   	var inputName = "#rsSH_name_input_" + index;
		   	var inputPrice = "#rsSH_price_input_" + index;
		   	var inputID = "#rsSH_id_input_" + index;
		   	
		   	$(box).addClass("visible");
		    $(name).text(data.title);
		    $(price).text("$" + data.price);
		    $(image).attr("src", data.imageURL);
		    $(link).attr("href", "single.html?id=" + data.id);

		    $(inputName).val(data.title);
		    $(inputPrice).val(data.price);
		    $(inputID).val(data.id);


			var event = new Event('productsloaded');
			document.dispatchEvent(event);

		   },
		   dataType: "json"
		});
}