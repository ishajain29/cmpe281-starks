The following are the steps to create a mongodb replica set on AWS EC2 Instance:

1. Create 3 Ubuntu AWS Instances. Set their Security Group appropriately to allow SSH Traffic from your IP and port 27017 traffic from other nodes.
2. Launch all the instances and SSH into all of them simultaneously.
3. Run the following commands to disable the updating last acces time for more throughput:

```
sudo nano /etc/fstab
Add noatime as follows:
LABEL=cloudimg-rootfs   /        ext4   defaults,noatime        0 0
```
4. Setup MongoDB on each Node

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

5. sudo service mongod stop
6. Modify the Host Server File on each server:

```
sudo nano /etc/hosts

127.0.0.1           localhost mongo0.example.com //Set this mongo(0,1,2) according to the Node you are connected to
(IP of Node 1)         mongo0.example.com
(IP of Node 2)         mongo1.example.com
(IP of Node 3)         mongo2.example.com
```

7. Modify the hostname on each server

```
sudo hostname mongo0.example.com
sudo nano /etc/hostname

Delete the older hostname value and place the following instead-
mongo0.example.com
```
8. Modify the Mongo Configuration on each server

```
Comment out bind_ip

#replication:                                                               
replication:                                                                
   oplogSizeMB: 1                                                           
   replSetName: rs0 
```

9. Go to root directory and add /data/db folder to var directory using sudo *on each server.
```
cd ../../
cd var
sudo mkdir data
cd data
sudo mkdir db
```

10. Start the mongod service on Mongo0 node using following command:

sudo mongod --replSet rs0 --dbpath /var/data/db

11. Start the mongo shell on Mongo0 using the following command on another terminal (connect to instance on that terminal too) 
```
mongo
```

12. Add the first server to intialize as the Primary Server:
```
rs.initiate()
```
13. Start the mongodb service and mongo shell on the other 2 instances as well after creating /data/db directories on them.

14. On the primary node connected, then run the following commands-
```
rs.add("mongo1.example.com:27017")
rs.add("mongo2.example.com:27017",true) // Use the true parameter to make it the Arbitrator
```

15. View the config using:
```
rs.config()
```

16. Check status using:
```
rs.status()
```

17. Add the following document to the Primary Node to test:
```
db.searchlogs.save({_id:1, value:'shampoo',timestamp:'12:32:12'})
```
18. Go to the Secondary Terminal and run the following commands to check if the document was added:
```
db.setSlaveOk()
db.searchlogs.find()
```
