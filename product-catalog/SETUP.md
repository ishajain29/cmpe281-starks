## Application Server Configuration
* Create t2.mirco Ubuntu 16.04 instance
* Install JDK 8 with following commands:
	* sudo add-apt-repository ppa:webupd8team/java
	* sudo apt-get update
	* sudo apt-get install oracle-java8-installer
* Setup apache-tomcat 8.0.46 on the instance
* Open port 8080 in the security group to access Application server
* Deploy application WAR file on the Tomcat

## MongoDB Primary Node Configuration
* Create t2.micro Ubuntu 16.04 instance in the private subnet of same VPC of application server
* We will use NAT instance to connect to MongoDB instance
* To directly SSH into the MongoDB instance to perform installation, perform following command on NAT instance:
	* sudo iptables -t nat -A PREROUTING -p tcp --dport 10234 -j DNAT --to-destination [Private IP address of Instance]:22
* Perform following command to install MongoDB Enterprise Version:
	* sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
	* echo "deb [ arch=amd64,arm64,ppc64el,s390x ] http://repo.mongodb.com/apt/ubuntu xenial/mongodb-enterprise/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-enterprise.list
	* sudo apt-get update
	* sudo apt-get install -y mongodb-enterprise
* MongoDB is installed as a service on the Ubuntu. To start and stop, use following commands:
	* sudo service mongod start
	* sudo service mongod stop
* Open port 27017 in the security group to allow traffic on MongoDB

## Miscellaneous MongoDB Setup
* To perform text searching on the product data, we need to index the data using following commands:
	* use productdb
	* db.products.createIndex({title: "text", description: "text"})
* To export and import the data in MongoDB, we can use following commands:
	* mongoexport --db productdb --collection products --out catalog.json
	* mongoimport  --db productdb --collection products --file catalog.json
* To enable remote connection on the MongoDB instance, use following commands:
	* sudo vi /etc/mongod.conf
	* Comment line bindIp: 127.0.0.1 which accepts the requests from only mentioned IPs
	* Restart mongod service