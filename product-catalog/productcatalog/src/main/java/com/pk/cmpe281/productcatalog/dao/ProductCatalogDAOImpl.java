package com.pk.cmpe281.productcatalog.dao;

import org.springframework.data.mongodb.core.MongoOperations;

import com.pk.cmpe281.productcatalog.model.Product;

public class ProductCatalogDAOImpl implements ProductCatalogDAO{
	
	private MongoOperations mongoOps;
	private static final String PRODUCT_COLLECTION = "products";
	
	public ProductCatalogDAOImpl(MongoOperations mongoOps){
		this.mongoOps = mongoOps;
	}

	@Override
	public void insert(Product product) {
		this.mongoOps.insert(product, PRODUCT_COLLECTION);
	}

}
