**Activity Logs**

Logs are responsible for keeping an account of the user activities such that the information agglomerated could be further used for data analytics. For the sake of convenience, this application utilizes 3 different database schemas for user activity logs. 

*Logs retrieved from User Logs Web Services:*

```
POST http://shoppingcart.com/userlogs

{
	userid: <String>
	activity: <String> ("User created", "User Information Updated")
	timestamp : <Date.now>

}
```
***

*Logs retrieved from Cart Web Services:*
```
POST http://shoppingcart.com/cartlogs

{
	_id : <String>
	userId : <String>
	cartName: <String>
	products : [
			productId: <String>
			quantity: <int>
		]	
}
```

Handling the fetched log-
```
Database Name: /cartlogs

{
	userid : <userId,String>
	cartid : <_id,String>
	cartname : <cartName, String>
	typeofcart : <type, String> (user, shared)
	products : [
			productid: <String>
			qty: <int>
		]
	groupusers: [<userid, String>]
	activity: <String> ("Cart Created", "Product Added","Shared Cart Joined", "Cart Updated", "Product Removed", "User(s) Added", "User(s) Removed", "Order Placed")
	timestamp : <Date.now>

}
```
***

*Logs retrieved from Search Logs Web Services:*
```
POST http://shoppingcart.com/searchlogs

{
	userid : <userId,String>
	keyword: <String> (Keywords searched for)
	timestamp : <Date.now>

}
```

