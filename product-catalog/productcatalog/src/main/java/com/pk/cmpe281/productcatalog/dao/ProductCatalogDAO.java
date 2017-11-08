package com.pk.cmpe281.productcatalog.dao;

import java.util.List;

import com.pk.cmpe281.productcatalog.model.Product;

public interface ProductCatalogDAO {
	
	public void insertProduct(Product product);
	public Product getProductById(String uuid);
	public List<Product> getProductsByPageNumber(int pageNumber);
	public List<Product> getProductsByCategory(String category);
	public List<Product> searchProduct(String keyword);
}
