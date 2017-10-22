#!flask/bin/python
from flask import Flask, jsonify, abort, make_response, request
from neo4j.v1 import GraphDatabase, basic_auth 

app = Flask(__name__)

# Connection String to connect Neo4j Garph DB
driver = GraphDatabase.driver("bolt://localhost:7687", auth=basic_auth("neo4j", "password"))

# Sample DB imported to neo4j available here - https://code.google.com/archive/p/northwindextended/downloads

# Sample wishlist (Not Stored in DB)
wishlist = [
    {
        'id': 3,
        'title': u'Shirt',
        'description': u'Lewis 40 Slimfit', 
        'category': u'Fashion', 
        'price': u'$40', 
        'imageURL': u'www.xyz.com' 
    },
    {
        
        'id': 4,
        'title': u'Book',
        'description': u'Learning from Data', 
        'category': u'Education', 
        'price': u'$30', 
        'imageURL': u'www.xyz.com' 
    }
]

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

# Get the list of products in Wishlist
@app.route('/wishlist', methods=['GET'])
def get_wishlists():
    return jsonify({'wishlist': wishlist})

# Get the list of products in Search History
@app.route('/searchlist', methods=['GET'])
def get_searchlist():
    return jsonify({'searchHistory': searchHistory})

# Get the product in wishlist with product ID
@app.route('/wishlist/<int:wishlist_id>', methods=['GET'])
def get_wishlist(wishlist_id):
    wl = [wl for wl in wishlist if wl['id'] == wishlist_id]
    if len(wl) == 0:
        abort(404)
    return jsonify({'task': wl[0]})

# Add a product to wishlist
@app.route('/wishlist', methods=['POST'])
def create_wishlist():
    if not request.json or not 'title' in request.json:
        abort(400)
    wl = {
        'id': wishlist[-1]['id'] + 1,
        'title': request.json['title'],
        'description': request.json.get('description', ""),
        'category': request.json.get('category',""),
        'price': request.json.get('price',""), 
        'imageURL': request.json.get('imageURL', "")
    }
    wishlist.append(wl)
    return jsonify({'wl': wl}), 201

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


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(debug=True)


