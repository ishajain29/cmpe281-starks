# Shared Shopping Cart

Shared shopping cart will allow your friends, colleague and roommates to create shared carts and others to contribute to the list of items to purchase.

## Functionalities and Use Cases ##

1. **Creating new shopping cart**

    * Admin User: Create new shopping cart, invite people to join or share joining link for that shopping cart
    * Other Users: Get joining link and join the group

2. **When user wants to purchase an item**
    
    There will be 2 options for him to decide

    * Add item to his own shopping cart
    * Add item to shared shopping cart
        * A menu will be pop-up with the list of shopping cart shared with him to select

3. **When user try to add item to shared shopping cart**

    * Item in not in the cart
        * Add item directly to the shared cart.
    * Item is already in the cart
        * Show confirmation pop-up that item is already in the cart added by User-X, do you want to add the item again.

4. **Show group settings**

    * From the list of shopping cart there will be setting menu of each shared cart
    * User will be able to view the list of group members
    * Admin will be able to manage group members from this menu
    * Admin can also be changed from this menu



## Database Schema ##

```javascript
User-Carts
{
    _id      :   <cart_id>,
    userId   :   <user_id>,
    products :   [ 
                    { 
                        productId: <product_id>,
                        quantity  : 1,
                        name      : "Apple - MacBook Pro® - 13 Display",
                        price     : $1299
                    }
                ]
}
```
```javascript
Shared-Carts
{
    _id             :   <shared_cart_id>,
    adminId         :   <user_id>,
    cartName        :   <cart_name>,
    groupUsers      :   [<user_id>, <user_id>, <user_id>],
    products        :   [ 
                            { 
                                productId: <product_id>,
                                quantity  : 1,
                                name      : "Google Pixel 2, 64GB Black",
                                price     : $649,
                                added_by  : <userid>
                            }
                        ],
    inviteLink     :   "http://my.api.com/carts/shared/460cab6e-a813-11e7-9f32-60f81dc1f3c0/join",
    expirationDate :   "2016-05-18T16:00:00Z"
}
```

## Web services (to be created) ##

### User Cart Related Services ###

1. Create new user cart

```
POST http://my.api.com/carts/user
{
    userId: <user_id>
}

201 Created

403 Forbidden
{
    error: "Cart for this user already exists"
}
```
2. Add product to user cart

```
POST http://my.api.com/carts/user/<user_id>/product
{  
    "id"        : "507f1f77bcf86cd799439012",
    "quantity"  : 1,
    "name"      : "Apple - MacBook Pro® - 13 Display",
    "price"     : 1290
}

200 OK
```
3. Update product from user cart

```
PUT http://my.api.com/carts/user/<user_id>/product/<product_id>
{  
    "id"        : "507f1f77bcf86cd799439012",
    "quantity"  : 2,
    "name"      : "Apple - MacBook Pro® - 13 Display",
    "price"     : 1290
}

200 OK
```
4. Remove product from user cart

```
DELETE http://my.api.com/carts/user/<user_id>/product/<product_id>

200 OK
```
5. Place order

```
POST http://my.api.com/carts/user/<user_id>/order

200 OK
```
### Shared Cart Related Services ###

1. Create shared cart
```
POST http://my.api.com/carts/shared
{
    adminId: <user_id>,
    cartName: <cart_name>,
    groupUsers: [<user_id>, <user_id>, <user_id>]
}


201 Created
{
    cartId: <shared_cart_id>,
    link: "http://my.api.com/carts/shared/<shared_cart_id>",
    inviteLink: "http://my.api.com/carts/shared/<shared_cart_id>/join"
}
```

2. Add users to shared cart[admin only]
    * with email Ids/ User Ids
    ```
    POST http://my.api.com/carts/shared/<cart_id>/user
    [<user_id_1>, <user_id_2>, <user_id_3>]

    200 OK
    ```

    * with sharable invite link

3. Remove users from shared cart[admin only]
```
DELETE http://my.api.com/carts/shared/<cart_id>/user/<user_id>

200 OK
```

4. Add products to shared cart
```
POST http://my.api.com/carts/shared/<cart_id>/product
{  
    "id"        : "507f1f77bcf86cd799439012",
    "quantity"  : 1,
    "name"      : "Apple - MacBook Pro® - 13 Display",
    "price"     : 1290,
    "addedBy"	: "anuj6"
}

200 OK
```

5. Update Products from shared cart
    * Admin can update all the items
    * Group users can update those items that are added by them only
```
PUT http://my.api.com/carts/shared/<cart_id>/product/507f1f77bcf86cd799439012
{  
    "id"        : "507f1f77bcf86cd799439012",
    "quantity"  : 2,
    "name"      : "Apple - MacBook Pro® - 13 Display",
    "price"     : 1290,
    "addedBy"	: "anuj6"
}

200 OK
```

6. Remove Products from shared cart
    * Admin can remove all the items
    * Group users can remove those items that are added by them only
```
DELETE http://my.api.com/carts/shared/<cart_id>/product/<product_id>

200 OK
```

7. Place order[admin only]
```
POST http://my.api.com/carts/user/<user_id>/order

200 OK
```

### Common Services ###

1. Check for out-of-stock items in the cart [when cart is loaded and before any order is placed]

