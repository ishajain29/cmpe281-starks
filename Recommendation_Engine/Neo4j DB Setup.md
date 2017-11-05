Neo4j DB is used for to recommend products to users based on their several behaviours. Major behaviours considered for recommendting product includes:

* Based on Previous Purchases
* Based on Search History
* Based on similar user purchases

Node Labels in Neo4j:

* Person
* Product
* Category

Relationships on Nodes:

* ISPARTOF
* PURCHASED
* SEARCHED

Queries To Create Database:

1. Load Products into DB.

    LOAD CSV WITH HEADERS FROM "file:///productcatalog.csv" AS row
    
2. Create 'Product' and 'Category' Nodes.

    MERGE (product:Product {id: row.id})
    ON CREATE SET product.title = row.title, product.description = row.description, product.imageurl = row.row.imageURL

    MERGE (category:Category {id:row.category})
    ON CREATE SET category.category_name = row.category
    
3. Create Realtionship between Product and Category.

    MERGE (product)-[:ISPARTOF]->(category)
    
4. Adding New User to DB (Username and Email).

    CREATE (a:Person {name: $name, email: $email})", name=username, email=email
    
5. Create Purchassed Relationship between 'Person' and 'Product'

    MATCH (a:Person),(b:Product) WHERE a.name=$username AND b.id=$product_id MERGE (a)-[:PURCHASED]->(b)", username=username, product_id=product_id
    MATCH (a:Person),(b:Product) WHERE a.name=$username AND b.id=$product_id MERGE (a)-[:SEARCHED]->(b)", username=username, product_id=product_id
