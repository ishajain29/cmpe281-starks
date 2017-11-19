Revision #1

## Configuration for Application Server on AWS

* Launch an Ubuntu Server 16.04 LTS instance 
* For the above, create a security group with HTTP/HTTPS (80 and 443) ports inbound traffic from anywhere and SSH port only from admin's system IP.
* Attach a security key pair to it with permissions to only the owner.
* After following the steps, launch the instance.
* Connect to the instance using the ssh command and run the following commands to install the required packages to run the nodejs application:
   * git clone the repository with the application into the instance
   * sudo apt-get update
   * sudo apt-get install npm
   * sudo apt-get install nodejs-legacy
* In order to enable port forwarding on Port 8080 from 80, follow the following steps on the instance-
i. Change the app to listen on Port 8080.
ii. Enable port forwarding by running this command 'sudo vim /etc/sysctl.conf'.
iii. Uncomment the following line- 'net.ipv4.ip_forward=1'
iv. Check if port forwarding is enabled through running the command - 'cat /proc/sys/net/ipv4/ip_forward'. It should return a 1.
v. Run the below commands to ensure port forwarding:
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT

* Now change the IP of mongodb server by changing it from localhost in /model/db.js to the IP of the MongoDB instance.
* Now go to cd bin and run 'node www' to start the server 
  
## Configuration for MongoDB Server on AWS

* Create an Amazon Linux Instances in order to create a Mongo node. Connect to them using SSH.
* Use this command- 'sudo vi /etc/yum.repos.d/mongodb-org-3.0.repo' and make the following changes into the file for the instance:
```
     [mongodb-org-3.0]
     name= MongoDB Repository
     baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.0/x86_64/
     gpgcheck=0
     enabled=1
```     
* Run this command to install the mongodb package- 'sudo yum install -y mongodb-org'
* Create /data/db directories in var of the ubunutu server.
* Test it by running 'mongod --dbpath /var/data/db'.

OR

```echo "[mongodb-org-3.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc" |
  sudo tee -a /etc/yum.repos.d/mongodb-org-3.4.repo
  ```
  
```
sudo yum -y update && sudo yum install -y mongodb-org-server \
    mongodb-org-shell mongodb-org-tools  
```
***
     


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
  
     
