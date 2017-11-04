## Configuration for Application Server on AWS

* Launch an Ubuntu Server 16.04 LTS instance 
* For the above, create a security group with HTTP/HTTPS ports inbound traffic from anywhere and SSH port only from admin's system IP.
* Attach a security key pair to it with permissions to only the owner.
* After following the steps, launch the instance.
* Connect to the instance using the ssh command and run the following commands to install the required packages to run the nodejs application:
   * git clone the repository with the application into the instance
   * sudo apt-get update
   * sudo apt-get install npm
   * npm install
   * sudo apt-get install nodejs-legacy
* node app.js

## Configuration for MongoDB Server on AWS

* Create 3 Amazon Linux Instances in order to create a primary and 2 secondary Mongo replica sets. Connect to them using SSH.
* Use this command- 'sudo vi /etc/yum.repos.d/mongodb-org-3.0.repo' and make the following changes into the file for the instances:
```
     *[mongodb-org-3.0]
     *name= MongoDB Repository
     *baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.0/x86_64/
     *gpgcheck=0
     *enabled=1
```     
* Run this command to install the mongodb package- 'sudo yum install -y mongodb-org'
* Assign one instance as the master by making the following changes to the mongod.conf file-
```
master: true
auth: true
port: 27017
```

* Assign 2 other instances as the slave by making the following changes to the mongod.conf file-
```
  auth: true
  slave: true
  source: [IP of the master node]:27017
  autoresync: true
```
* Run the following command to start the mongodb server on the 3 instances: 
sudo mongod
  
     
