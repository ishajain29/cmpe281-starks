package com.pk.cmpe281.productcatalog.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.pk.cmpe281.productcatalog.dao.ProductCatalogDAO;
import com.pk.cmpe281.productcatalog.model.Product;

@RestController
public class ProductController {
	
	 @Autowired
	 @Qualifier("productCatalogDAO")
	 ProductCatalogDAO productCatalogDAO;
	 
	 //NOTE: Set content-type=application/json in the request header
	 @RequestMapping(value = "/product", method = RequestMethod.POST)
	 @ResponseBody
	 @ResponseStatus(HttpStatus.CREATED)
	 public void insertProduct(@RequestBody Product product){
		 
		 UUID uuid = UUID.randomUUID();
	     String randomUUIDString = uuid.toString();
	     
	     if(product != null){
	    	 product.setId(randomUUIDString);
			 productCatalogDAO.insert(product);  	 
	     }
	 }
	
	 @RequestMapping(value = "/product/{id}", 
			 method = RequestMethod.GET, produces = "application/json")
	 @ResponseBody
	 public Product getProductById(@PathVariable long id){
		 
		 Product product = new Product();
		 
		 //TODO: Add logic for fetching the product based on the id from MongoDB
		 
		 return product;
	 }
	 
	 @RequestMapping(value = "/products/page/{pageNumber}", 
			 method = RequestMethod.GET, produces = "application/json")
	 @ResponseBody
	 public List<Product> getProductsByPageNumber(@PathVariable int pageNumber){
		 
		 List<Product> productList = new ArrayList<Product>();
		 //TODO: Add Logic for fetching products from MongoDB
		 
		 return productList;
	 }
}
