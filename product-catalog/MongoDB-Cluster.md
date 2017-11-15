## MongoDB Replica Set Configuration on AWS
* To Configure the three node replica set of MongoDB on AWS, I have performed following steps:
	* Create three EC2 Instances with MongoDB server running on it by following the commands from SETUP.md
	* Once three server are running, make following entries in the host file of the primary instance:
	127.0.0.1 localhost mongo0.example.com
	10.0.1.82 mongo0.example.com
	10.0.1.240 mongo1.example.com
	10.0.1.99 mongo2.example.com
	* Stop the MongoDB instance.
	* Open the configuration file /etc/mongod.conf.
	* Uncomment the line "Replication:" and add following line:
	replSetName: rs0

* Perform the following commands to configure replica set:
	* rs.initiate()
	* rs.add("mongo1.example.com:27017")
	* rs.add("mongo2.example.com:27017")

* To check the configuration of the replica set, use the following command:
	* rs.config()



