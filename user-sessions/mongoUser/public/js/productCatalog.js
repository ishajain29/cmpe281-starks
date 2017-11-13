var pcProductCatalogServerURL = "http://18.216.132.146:8080/productCatalog";

/* Fetch page 1 product data to display on Home Page */
function pcGetProductData(){
	
	$.ajax({
	   url: pcProductCatalogServerURL + '/products/page/1',
	   error: function(xhr, status, error) {
	      console.log(xhr.responseText);
	   },
	   success: function(data) {
	    var $prodctHTML = pcGenerateProductDOM(data);
		$('#expeditions').append($prodctHTML);

		var event = new Event('productsloaded');
		document.dispatchEvent(event);

	   },
	   dataType: "json"
	});
}

/* To Generate the Home page Product Section DOM based on the product data fethced from the server */
function pcGenerateProductDOM(productArray){

	var productHTML = "";
	var productCounter = 1;
	
	productArray.forEach(function (product){

		if(productCounter%3 == 1){
			productHTML = productHTML + "<div class='agile_top_brands_grids'>";
		}
		
		var productInnerHTML = "<div class='col-md-4 top_brand_left'>" + 
									"<div class='hover14 column'>" + 
										"<div class='agile_top_brand_left_grid'>"+
											"<div class='agile_top_brand_left_grid_pos'>" + 
													"<img src='images/offer.png' alt='' class='img-responsive'>" +
											"</div>" + 
											"<div class='agile_top_brand_left_grid1'>" + 
												"<figure>" + 
													"<div class='snipcart-item block'>" +
														"<div class='snipcart-thumb'>" +
															"<a href='single.html?id="+ product.id +"'><img style='height:150px' title=' ' alt=' ' src='"+ product.imageURL +"'></a>" +
															"<p>"+ product.title +"</p>" +
															"<h4>$"+ product.price +"</h4>" + 
														"</div>" + 
														"<div class='snipcart-details top_brand_home_details'>" +
															"<form action='#' method='post'>" +
																"<fieldset>" + 
																	"<input type='hidden' name='cmd' value='_cart'>" +
																	"<input type='hidden' name='id' value='"+ product.id +"'>" + 																	
																	"<input type='hidden' name='item_name' value='" + product.title + "' />" +	
																	"<input type='hidden' name='amount' value='" + product.price + "' />" +	
																	"<input type='submit' name='submit' value='Add to cart' class='button'>" +																	
																"</fieldset>" +
															"</form>" + 
														"</div>" +
													"</div>" +
												"</figure>" +
											"</div>" +
										"</div>" +
									"</div>" +
								"</div>" ;

		productHTML = productHTML + productInnerHTML;

		if(productCounter%3 == 0){
			productHTML = productHTML + "<div class='clearfix'></div> </div>";
		}

		productCounter++;
	});

	return productHTML;
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

/* To get the product based on the category and display on the separate page */
function pcGetProductsByCategory(category){

	$.ajax({
		   url: pcProductCatalogServerURL + '/products/' + category,
		   error: function(xhr, status, error) {
		      console.log(xhr.responseText);
		   },
		   success: function(data) {
		       var $prodctHTML = pcGenerateProductDOM(data);
				$('#productCategory').append($prodctHTML);

				var $updateCategory = category.replace("-"," ").toUpperCase();
				$('#category').append($updateCategory);

		   },
		   dataType: "json"
		});
}

/* To Search through the  product catalog with given keyword */
function pcGetSearchResults(keyword){

	$.ajax({
		   url: pcProductCatalogServerURL + '/products/search/' + keyword,
		   error: function(xhr, status, error) {
		      console.log(xhr.responseText);
		   },
		   success: function(data) {
		   		var resultCount = data.length;
		   		var $prodctHTML;
		   		if(resultCount == 0){
		   			$('#productCategory').append("<strong>No results found matching with keyword.</strong>");
		   		} else {
		   			$prodctHTML = pcGenerateProductDOM(data);
					$('#productCategory').append($prodctHTML);

		   		}
		    },
		   dataType: "json"
		});
}