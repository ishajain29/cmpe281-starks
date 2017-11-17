## MongoDB Replica Set Configuration on AWS
* To Configure the three node replica set of MongoDB on AWS, I have performed following steps to setup the environment:
	* Create three EC2 Instances with MongoDB server running on it by following the commands from SETUP.md
	* Once three server are running, make following entries in the host file '/etc/hosts' of all three instances:
	
	`127.0.0.1 localhost mongo0.productcatalog.com`
	
	`10.0.1.82 mongo0.productcatalog.com`
	
	`10.0.1.240 mongo1.productcatalog.com`
	
	`10.0.1.99 mongo2.productcatalog.com`

* To configure the replica set, I have performed following steps on all three instances:
	* Stop the MongoDB instance.
	* Open the configuration file '/etc/mongod.conf'
	* Uncomment the line "Replication:" and add following line:
	
	`replSetName: rs0`
	
* Perform the following commands to add the nodes to the replica set:
	* rs.initiate()
	* rs.add("mongo1.productcatalog.com:27017")
	* rs.add("mongo2.productcatalog.com:27017")

* To check the configuration of the replica set, use the following command:
	* rs.config()
	
* To check the status of all three nodes, use the following command:
	* rs.status()


## Observations
* As the MongoDB replica set is available, I configured it on the client side with Java MongoDB driver.
* I also configured the replica set such a way that read operations are performed from the secondary nodes.
* When I execute the read queries, I observed from the logs that a connection to the secondary node has been made and data has been read.
* When I closed the MongoDB port 27017 to create the partition, the MongoDB driver on the client end, immediately recognized that the node has become unavailable, it closed that connection and opened a new connection to other node.
* Write operations are always performed on the Primary node.
* If there is a client, who is directly interacting with the secondary which is now partitioned from the Primary, will still be able to read the data from the Secondary but cannot perform the write which exhibits the unavailiblity of the MongoDB for the write operation.  

