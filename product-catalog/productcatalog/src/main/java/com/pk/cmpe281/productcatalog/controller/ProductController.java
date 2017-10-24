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
import com.pk.cmpe281.productcatalog.exception.InvalidPageNumberException;
import com.pk.cmpe281.productcatalog.exception.ProductNotFoundException;
import com.pk.cmpe281.productcatalog.model.Product;

@RestController
public class ProductController {
	
	 @Autowired
	 @Qualifier("productCatalogDAO")
	 ProductCatalogDAO productCatalogDAO;
	 
	 @RequestMapping(value = "/product", method = RequestMethod.POST)
	 @ResponseBody
	 @ResponseStatus(HttpStatus.CREATED)
	 public void insertProduct(@RequestBody Product product){
		 
		 UUID uuid = UUID.randomUUID();
	     String randomUUIDString = uuid.toString();
	     
	     if(product != null){
	    	 product.setId(randomUUIDString);
			 productCatalogDAO.insertProduct(product);  	 
	     }
	 }
	
	 @RequestMapping(value = "/product/{id}", 
			 method = RequestMethod.GET, produces = "application/json")
	 @ResponseBody
	 public Product getProductById(@PathVariable String id){
		 
		 Product product = productCatalogDAO.getProductById(id);
		 
		 if(product == null){
			 throw new ProductNotFoundException();
		 }
		 
		 return product;
	 }
	 
	 @RequestMapping(value = "/products/page/{pageNumber}", 
			 method = RequestMethod.GET, produces = "application/json")
	 @ResponseBody
	 public List<Product> getProductsByPageNumber(@PathVariable int pageNumber){
		 
		 if(pageNumber <= 0){
			 throw new InvalidPageNumberException();
		 }
		 
		 List<Product> productList = new ArrayList<Product>();
		
		 productList = productCatalogDAO.getProductsByPageNumber(pageNumber);
		 
		 return productList;
	 }
	 
	 @RequestMapping(value = "/products/{category}", 
			 method = RequestMethod.GET, produces = "application/json")
	 @ResponseBody
	 public List<Product> getProductsByCategory(@PathVariable String category){
		 
		 List<Product> productList = new ArrayList<Product>();
		
		 productList = productCatalogDAO.getProductsByCategory(category);
		 
		 return productList;
	 }
	 
	 @RequestMapping(value = "/products/search/{keyword}", 
			 method = RequestMethod.GET, produces = "application/json")
	 @ResponseBody
	 public List<Product> searchProduct(@PathVariable String keyword){
	     
		 List<Product> productList = new ArrayList<Product>();
		
		 productList = productCatalogDAO.searchProduct(keyword);
		 
		 return productList;   
	 }
}
