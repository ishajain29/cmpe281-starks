# MongoDB Cluster Creation and Replication

## Setup mongodb replication with local docker

1. Start 3 mongodb container(1 primary, 2 secondary)
    ```
    docker run -td --name mongo-primary mongo mongod --replSet "rs0"
    docker run -td --name mongo-secondary-1 mongo mongod --replSet "rs0"
    docker run -td --name mongo-secondary-2 mongo mongod --replSet "rs0"
    ```

2. Create docker network and add all three container to the network
    ```
    docker network create cmpe281_network

    docker network connect cmpe281_network mongo-primary
    docker network connect cmpe281_network mongo-secondary-1
    docker network connect cmpe281_network mongo-secondary-2
    ```

3. Replica Set Configuration
    ```
    docker exec -it mongo-primary bash
        mongo
        <<< Inside Mongo Console >>>

        rs.initiate( {
                        _id : "rs0",
                        members: [ { _id : 0, host : "172.18.0.2:27017" } ]
                    })
        
        rs.conf()

        rs.add("172.18.0.3")
        rs.add("172.18.0.4")

        rs.status()


        db.users.insertOne(    {       name: "Anuj",       age: 23,       status: "P"    } )
        db.users.insertOne(    {       name: "Jay",        age: 23,       status: "P"    } )
    ```
    ```
    docker exec -it mongo-secondary-1 bash
        mongo
        <<< Inside Mongo Console >>>

        rs.slaveOk()
        db.users.find()
    ```

    Use Docker network connect-disconnect commands to check if data on secondary node replicates once connection is established


## MongoDB Replica Set Configuration on AWS
* I have performed following steps to Configure the three node replica set of MongoDB on AWS:
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

