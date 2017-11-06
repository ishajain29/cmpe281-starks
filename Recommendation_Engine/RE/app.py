#!flask/bin/python
from flask import Flask, jsonify, abort, flash, make_response, request, render_template, session, redirect, url_for, escape
from neo4j.v1 import GraphDatabase, basic_auth 

app = Flask(__name__)

# Connection String to connect Neo4j Garph DB
driver = GraphDatabase.driver("bolt://localhost:7687", auth=basic_auth("neo4j", "password"))



# Sample Search History 
searchHistory = [
    {
        'id': 5,
        'title': u'Shirt',
        'description': u'Lewis 40 Slimfit', 
        'category': u'Fashion', 
        'price': u'$40', 
        'imageURL': u'www.xyz.com' 
    },
    {
        
        'id': 6,
        'title': u'Book',
        'description': u'Learning from Data', 
        'category': u'Education', 
        'price': u'$30', 
        'imageURL': u'www.xyz.com' 
    }
]

@app.route('/')
def index():
    return render_template('re.html')

@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % username

@app.route('/hello/<name>')
def hello(name=None):
    return render_template('hello.html', name=name)

# Get the list of products in Search History
@app.route('/searchlist', methods=['GET'])
def get_searchlist():
    return jsonify({'searchHistory': searchHistory})

# Get List of Customers
@app.route('/products', methods=['GET'])
def get_products():
    session = driver.session()
    result = session.run("MATCH (n:Product) RETURN n.title as Products LIMIT 25")
    #for record in result:
        #print("%s" % (record["Products"]))

    return jsonify([record["Products"] for record in result])
    session.close()

@app.route('/products/<int:product_id>')
def show_post(product_id):
    # show the post with the given id, the id is an integer
    return 'Product %d' % product_id

@app.route('/category', methods=['GET'])
def get_category():
    session = driver.session()
    result = session.run("MATCH (n:Category) RETURN n.category_name as Category LIMIT 25")
    #for record in result:
    #    print("%s" % (record["Category"]))
    
    return jsonify([record["Category"] for record in result])
    session.close()

@app.route('/adduser/<username>/<email>', methods=['GET'])
def add_user(username,email):
    session = driver.session()
    session.run("CREATE (a:Person {name: $name, email: $email})", name=username, email=email)
    session.close()
    return 'User Created'


#http://0.0.0.0:8888/purchased?user=userid&product=productid
@app.route('/purchased/<username>/<product_id>', methods=['GET'])
def rel_purchased(username,product_id):
    
    session = driver.session()
    session.run("MATCH (a:Person),(b:Product) WHERE a.name=$username AND b.id=$product_id MERGE (a)-[:PURCHASED]->(b)", username=username, product_id=product_id)
    session.close()
    #session = driver.session()
    #session.run("MATCH (a:Person),(b:Product)"
    #           "WHERE a.name= 'username' AND b.id= 'product_id'"
    #           "CREATE (a)-[:PURCHASED]->(b)")
    #session.close()
    return 'OK'
    

#http://0.0.0.0:8888/purchased?user=userid&product=productid
@app.route('/searched/<username>/<product_id>', methods=['GET'])
def rel_searched(username,product_id):
    
    session = driver.session()
    session.run("MATCH (a:Person),(b:Product) WHERE a.name=$username AND b.id=$product_id MERGE (a)-[:SEARCHED]->(b)", username=username, product_id=product_id)
    session.close()
    #session = driver.session()
    #session.run("MATCH (a:Person),(b:Product)"
    #           "WHERE a.name= 'username' AND b.id= 'product_id'"
    #           "CREATE (a)-[:PURCHASED]->(b)")
    #session.close()
    return 'OK'    


@app.route('/rcmd/<username>', methods=['GET'])
def rcmd(username):
    session = driver.session()
    result = session.run("MATCH (p:Person {name:$username})-[:PURCHASED]->(:Product)<-[:PURCHASED]-(p2:Person)-[:PURCHASED]->(pd2:Product)"
            "WHERE NOT (p)-[:PURCHASED]->(pd2)"
            "RETURN pd2.title as product_title, pd2.description as product_details" , username=username)
    for record in result:
        print("Product: %s ,,, Description:  %s" % (record["product_title"], record["product_details"]))
        return 'Loop Entered'
    session.close()
    return 'OK'
    #return jsonify([record[("product_title","product_details")] for record in result])
    #session.close()
    #return 'OK'
    
@app.route('/rcmdp/<username>', methods=['GET'])
def rcmdp(username):
    session = driver.session()
    result = session.run("MATCH (p:Person {name:$username})-[:PURCHASED]->(pd:Product)"
                        "RETURN pd.title as product_title, pd.description as product_details" , username=username)
    for record in result:
        print("Product: %s ,,,, Description: %s" % (record["product_title"], record["product_details"]))
        return 'Loop Entered'
    return 'OK'    

@app.route('/rcmds/<username>', methods=['GET'])
def rcmds(username):
    session = driver.session()
    result = session.run("MATCH (p:Person {name:$username})-[:SEARCHED]->(pd:Product)"
                        "RETURN pd.title as product_title, pd.description as product_details" , username=username)
    for record in result:
        print("Product: %s ,,,, Description: %s" % (record["product_title"], record["product_details"]))
        return 'Loop Entered'
    return 'OK' 


# Get Supplier and Category of products they supply.
@app.route('/neo', methods=['GET'])
def get_neo():
    session = driver.session()
    result = session.run("MATCH (s:Supplier)-->(:Product)-->(c:Category)" 
                        "RETURN s.companyName as Company, collect(distinct c.categoryName) as Categories")
    for record in result:
        print("%s %s" % (record["Company"], record["Categories"]))
    session.close()
    return 'OK'
    #return jsonify([record[("Company","Categories")] for record in result])
    

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(debug=True)


