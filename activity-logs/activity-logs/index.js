var express= require ('express');
var mongo=require('mongodb');

var app=express();
app.set('port',process.env.PORT||3000);

app.get('/',function(req,res){
res.send('Express Works')
	var mongoClient=mongo.MongoClient;
		var url='mongodb://localhost:27017/activity-logs';
		mongoClient.connect(url,function(err,db) {
			if(err){
				console.log('Unable to connect to the server',err);
			} else{
				console.log('Connection Established');
				var coll=db.collection('groceries');
				coll.find({}).toArray(function(err,result){
					if(err){
						console.log(err);
					}
					else if(result.length){
						console.log(result);
					}
				});
			}
		});
});

app.listen(app.get('port'),function(){
	console.log('Express has started')
});
