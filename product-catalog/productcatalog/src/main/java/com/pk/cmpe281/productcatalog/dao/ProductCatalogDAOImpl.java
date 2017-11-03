package com.pk.cmpe281.productcatalog.dao;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.pk.cmpe281.productcatalog.model.Product;

public class ProductCatalogDAOImpl implements ProductCatalogDAO{
	
	private MongoOperations mongoOps;
	private static final String PRODUCT_COLLECTION = "products";
	private static final int RESULTS_PER_PAGE = 10;
	
	public ProductCatalogDAOImpl(MongoOperations mongoOps){
		this.mongoOps = mongoOps;
	}

	@Override
	public void insertProduct(Product product) {
		this.mongoOps.insert(product, PRODUCT_COLLECTION);
	}
	
	@Override
	public Product getProductById(String uuid){
		
		Query findProductQuery = new Query();
		findProductQuery.addCriteria(Criteria.where("_id").is(uuid));

	    Product productObj = this.mongoOps.findOne(findProductQuery, Product.class);
	    
	    return productObj;
	}
	
	@Override
	public List<Product> getProductsByPageNumber(int pageNumber){
		
		int skipItems = (pageNumber-1) * RESULTS_PER_PAGE;
		
		Query query = new Query();
		query.skip(skipItems);
		query.limit(RESULTS_PER_PAGE);
		 
		List<Product> productsOnPage = this.mongoOps.find(query, Product.class);
		
		return productsOnPage;
	}
	
	@Override
	public List<Product> getProductsByCategory(String category){
		
		Query query = new Query();
		query.addCriteria(Criteria.where("category").is(category));
		
		List<Product> productsOfCategory = this.mongoOps.find(query, Product.class);
		
		return productsOfCategory;
		
	}
}
