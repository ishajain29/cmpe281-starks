package com.pk.cmpe281.productcatalog.dao;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;

import com.pk.cmpe281.productcatalog.model.Product;

public class ProductCatalogDAOImpl implements ProductCatalogDAO{
	
	private MongoOperations mongoOps;
	private static final String PRODUCT_COLLECTION = "products";
	private static final int RESULTS_PER_PAGE = 9;
	
	public ProductCatalogDAOImpl(MongoOperations mongoOps){
		this.mongoOps = mongoOps;
	}

	@Override
	public void insertProduct(Product product) {
		this.mongoOps.insert(product, PRODUCT_COLLECTION);
	}
	
	@Override
	public Product getProductById(String uuid){
		
		Query query = new Query();
		query.addCriteria(Criteria.where("_id").is(uuid));

	    Product productObj = this.mongoOps.findOne(query, Product.class);
	    
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
	
	public List<Product> searchProduct(String keyword){
		
		TextCriteria criteria = TextCriteria.forDefaultLanguage()
				.matchingAny(keyword);
		
		Query query = TextQuery.queryText(criteria)
				.sortByScore();
		
		List<Product> searchResultProducts = this.mongoOps.find(query, Product.class);
		
		return searchResultProducts;
	}
}
