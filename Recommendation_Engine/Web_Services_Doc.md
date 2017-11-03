Web Services for Recommendation Engine

1. Get Previous Purchased Products:

URL: GET /past_purchases/<user_id>

Response: 200 OK

[
{
    "id": "1501492c-7358-49e5-bfd2-9bf33cd8ac42",
    "title": "Dove Gentle Exfoliating Soap",
    "description": "Contains exfoliating beads that gently wash away dead skin",
    "category": "Personal Care",
    "price": 10.88,
    "imageURL": "http://thepk.xyz/images/5678"
},
{
        "id": "a64cac48-1852-4346-8a64-d2c74f01e6a6",
        "title": "Dial coconut water glycerin soap",
        "description": "Discover the feeling of ultra fresh hydration. Leaves your skin feeling clean, fresh and hydrated healthier skin",
        "category": "Personal Care",
        "price": 2.97,
        "imageURL": "http://thepk.xyz/images/1234"
    }
]

Error: Not Found 400



2. Get Similar Products based on similar users.

URL: GET /similar_products/<user_id>

[
{
    "id": "1501492c-7358-49e5-bfd2-9bf33cd8ac42",
    "title": "Dove Gentle Exfoliating Soap",
    "description": "Contains exfoliating beads that gently wash away dead skin",
    "category": "Personal Care",
    "price": 10.88,
    "imageURL": "http://thepk.xyz/images/5678"
},
{
        "id": "a64cac48-1852-4346-8a64-d2c74f01e6a6",
        "title": "Dial coconut water glycerin soap",
        "description": "Discover the feeling of ultra fresh hydration. Leaves your skin feeling clean, fresh and hydrated healthier skin",
        "category": "Personal Care",
        "price": 2.97,
        "imageURL": "http://thepk.xyz/images/1234"
    }
]



3. Get product from Wishlist 

URL: GET /wishlist/<user_id>
Content Type : JSON
Response : SUCCESS 200 OK

[
    {
        "id": "a64cac48-1852-4346-8a64-d2c74f01e6a6",
        "title": "Dial coconut water glycerin soap",
        "description": "Discover the feeling of ultra fresh hydration. Leaves your skin feeling clean, fresh and hydrated healthier skin",
        "category": "personal-care",
        "price": 2.97,
        "imageURL": "http://thepk.xyz/images/1234"
    },
    {
        "id": "1501492c-7358-49e5-bfd2-9bf33cd8ac42",
        "title": "Dove Gentle Exfoliating Soap",
        "description": "Contains exfoliating beads that gently wash away dead skin",
        "category": "personal-care",
        "price": 10.88,
        "imageURL": "http://thepk.xyz/images/5678"
    }
]


4. Get the list of products in Search History

URL: GET /searhc_history/<user_id>
Content Type: JSON
Response : 200 OK

[
    {
        "id": "a64cac48-1852-4346-8a64-d2c74f01e6a6",
        "title": "Dial coconut water glycerin soap",
        "description": "Discover the feeling of ultra fresh hydration. Leaves your skin feeling clean, fresh and hydrated healthier skin",
        "category": "personal-care",
        "price": 2.97,
        "imageURL": "http://thepk.xyz/images/1234"
    },
    {
        "id": "1501492c-7358-49e5-bfd2-9bf33cd8ac42",
        "title": "Dove Gentle Exfoliating Soap",
        "description": "Contains exfoliating beads that gently wash away dead skin",
        "category": "personal-care",
        "price": 10.88,
        "imageURL": "http://thepk.xyz/images/5678"
    }
]
